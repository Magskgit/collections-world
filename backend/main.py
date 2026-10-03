from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from typing import List, Optional
from datetime import timedelta
import uuid, os, shutil

import models, schemas
from database import engine, get_db
from auth import (
    verify_password, get_password_hash, create_access_token,
    get_current_admin, ACCESS_TOKEN_EXPIRE_MINUTES
)

# ── Create tables ─────────────────────────────────────────
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Collections World API",
    description="Backend for Collections World e-commerce store",
    version="1.0.0",
)

# ── CORS ──────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "https://collections-world.vercel.app",
    "https://www.collectionsworld.in",
    "https://collectionsworld.in",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Static files ──────────────────────────────────────────
os.makedirs("static/images", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

DISCOUNT_PERCENTAGE   = 50   # max discount
EXISTING_CUSTOMER_EXTRA = 5  # additional 5 % for existing customers


# ════════════════════════════════════════════════════════════
#  CATEGORIES
# ════════════════════════════════════════════════════════════
@app.get("/categories", response_model=List[schemas.CategoryOut], tags=["Categories"])
def list_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).filter_by(is_active=True).all()


@app.get("/categories/{slug}", response_model=schemas.CategoryOut, tags=["Categories"])
def get_category(slug: str, db: Session = Depends(get_db)):
    cat = db.query(models.Category).filter_by(slug=slug, is_active=True).first()
    if not cat:
        raise HTTPException(404, "Category not found")
    return cat


# ════════════════════════════════════════════════════════════
#  PRODUCTS
# ════════════════════════════════════════════════════════════
@app.get("/products", response_model=List[schemas.ProductOut], tags=["Products"])
def list_products(
    category_slug: Optional[str] = None,
    search: Optional[str] = None,
    featured: Optional[bool] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    q = (
        db.query(models.Product)
        .options(joinedload(models.Product.category))
        .filter(models.Product.is_active == True)
    )
    if category_slug:
        q = q.join(models.Category).filter(models.Category.slug == category_slug)
    if search:
        q = q.filter(
            or_(
                models.Product.name.ilike(f"%{search}%"),
                models.Product.description.ilike(f"%{search}%"),
            )
        )
    if featured is not None:
        q = q.filter(models.Product.is_featured == featured)
    if min_price is not None:
        q = q.filter(models.Product.price >= min_price)
    if max_price is not None:
        q = q.filter(models.Product.price <= max_price)
    return q.offset(skip).limit(limit).all()


@app.get("/products/{product_id}", response_model=schemas.ProductOut, tags=["Products"])
def get_product(product_id: int, db: Session = Depends(get_db)):
    p = (
        db.query(models.Product)
        .options(joinedload(models.Product.category))
        .filter_by(id=product_id, is_active=True)
        .first()
    )
    if not p:
        raise HTTPException(404, "Product not found")
    return p


# ════════════════════════════════════════════════════════════
#  ORDERS
# ════════════════════════════════════════════════════════════
@app.post("/orders", response_model=schemas.OrderOut, tags=["Orders"])
def create_order(order_in: schemas.OrderCreate, db: Session = Depends(get_db)):
    subtotal = 0.0
    items_to_create = []

    for item in order_in.items:
        product = db.query(models.Product).filter_by(id=item.product_id, is_active=True).first()
        if not product:
            raise HTTPException(404, f"Product {item.product_id} not found")
        if product.stock < item.quantity:
            raise HTTPException(400, f"Insufficient stock for {product.name}")
        subtotal += product.price * item.quantity
        items_to_create.append((product, item.quantity))

    # Apply existing customer discount
    discount = subtotal * 0.05 if order_in.is_existing_customer else 0
    total = subtotal - discount

    order = models.Order(
        order_number=f"CW-{uuid.uuid4().hex[:8].upper()}",
        customer_name=order_in.customer_name,
        customer_email=order_in.customer_email,
        customer_phone=order_in.customer_phone,
        shipping_address=order_in.shipping_address,
        total_amount=round(total, 2),
        discount_amount=round(discount, 2),
        payment_method=order_in.payment_method,
        notes=order_in.notes,
    )
    db.add(order)
    db.flush()

    for product, qty in items_to_create:
        db.add(models.OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=qty,
            unit_price=product.price,
        ))
        product.stock -= qty

    db.commit()
    db.refresh(order)
    return db.query(models.Order).options(
        joinedload(models.Order.items).joinedload(models.OrderItem.product)
        .joinedload(models.Product.category)
    ).filter_by(id=order.id).first()


@app.get("/orders/{order_number}", response_model=schemas.OrderOut, tags=["Orders"])
def track_order(order_number: str, db: Session = Depends(get_db)):
    order = (
        db.query(models.Order)
        .options(joinedload(models.Order.items).joinedload(models.OrderItem.product))
        .filter_by(order_number=order_number)
        .first()
    )
    if not order:
        raise HTTPException(404, "Order not found")
    return order


# ════════════════════════════════════════════════════════════
#  ADMIN AUTH
# ════════════════════════════════════════════════════════════
@app.post("/admin/login", response_model=schemas.Token, tags=["Admin"])
def admin_login(login: schemas.AdminLogin, db: Session = Depends(get_db)):
    admin = db.query(models.Admin).filter_by(username=login.username).first()
    if not admin or not verify_password(login.password, admin.hashed_password):
        raise HTTPException(401, "Incorrect username or password")
    token = create_access_token(
        {"sub": admin.username},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {"access_token": token, "token_type": "bearer"}


# ════════════════════════════════════════════════════════════
#  ADMIN – PRODUCTS
# ════════════════════════════════════════════════════════════
@app.post("/admin/products", response_model=schemas.ProductOut, tags=["Admin"])
def admin_create_product(
    product: schemas.ProductCreate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    p = models.Product(**product.model_dump())
    db.add(p)
    db.commit()
    db.refresh(p)
    return p


@app.patch("/admin/products/{product_id}", response_model=schemas.ProductOut, tags=["Admin"])
def admin_update_product(
    product_id: int,
    update: schemas.ProductUpdate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    p = db.query(models.Product).filter_by(id=product_id).first()
    if not p:
        raise HTTPException(404, "Product not found")
    for key, val in update.model_dump(exclude_unset=True).items():
        setattr(p, key, val)
    db.commit()
    db.refresh(p)
    return p


@app.delete("/admin/products/{product_id}", tags=["Admin"])
def admin_delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    p = db.query(models.Product).filter_by(id=product_id).first()
    if not p:
        raise HTTPException(404, "Product not found")
    p.is_active = False
    db.commit()
    return {"message": "Product deleted"}


@app.post("/admin/products/{product_id}/image", tags=["Admin"])
async def upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    p = db.query(models.Product).filter_by(id=product_id).first()
    if not p:
        raise HTTPException(404, "Product not found")
    ext = os.path.splitext(file.filename)[1]
    filename = f"product_{product_id}{ext}"
    path = f"static/images/{filename}"
    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    p.image_url = f"/static/images/{filename}"
    db.commit()
    return {"image_url": p.image_url}


# ════════════════════════════════════════════════════════════
#  ADMIN – ORDERS
# ════════════════════════════════════════════════════════════
@app.get("/admin/orders", response_model=List[schemas.OrderOut], tags=["Admin"])
def admin_list_orders(
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    q = db.query(models.Order).options(
        joinedload(models.Order.items).joinedload(models.OrderItem.product)
    )
    if status:
        q = q.filter_by(status=status)
    return q.order_by(models.Order.created_at.desc()).offset(skip).limit(limit).all()


@app.patch("/admin/orders/{order_id}/status", response_model=schemas.OrderOut, tags=["Admin"])
def admin_update_order_status(
    order_id: int,
    status: str = Query(...),
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    order = db.query(models.Order).filter_by(id=order_id).first()
    if not order:
        raise HTTPException(404, "Order not found")
    order.status = status
    db.commit()
    db.refresh(order)
    return order


@app.get("/admin/dashboard", tags=["Admin"])
def admin_dashboard(
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    from sqlalchemy import func
    total_orders   = db.query(func.count(models.Order.id)).scalar()
    total_revenue  = db.query(func.sum(models.Order.total_amount)).scalar() or 0
    total_products = db.query(func.count(models.Product.id)).filter_by(is_active=True).scalar()
    pending_orders = db.query(func.count(models.Order.id)).filter_by(status="pending").scalar()
    return {
        "total_orders":   total_orders,
        "total_revenue":  round(total_revenue, 2),
        "total_products": total_products,
        "pending_orders": pending_orders,
    }


@app.get("/", tags=["Health"])
def root():
    return {"message": "Collections World API is running 🎉", "version": "1.0.0"}
