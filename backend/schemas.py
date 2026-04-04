from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ── Category ──────────────────────────────────────────────
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryOut(CategoryBase):
    id: int
    is_active: bool
    class Config:
        from_attributes = True


# ── Product ───────────────────────────────────────────────
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    stock: int = 0
    image_url: Optional[str] = None
    sku: Optional[str] = None
    is_featured: bool = False
    category_id: int

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    stock: Optional[int] = None
    image_url: Optional[str] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None

class ProductOut(ProductBase):
    id: int
    is_active: bool
    created_at: datetime
    category: Optional[CategoryOut] = None
    class Config:
        from_attributes = True


# ── Order ────────────────────────────────────────────────
class OrderItemIn(BaseModel):
    product_id: int
    quantity: int

class OrderCreate(BaseModel):
    customer_name: str
    customer_email: str
    customer_phone: str
    shipping_address: str
    payment_method: str = "cod"
    notes: Optional[str] = None
    items: List[OrderItemIn]
    is_existing_customer: bool = False

class OrderItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: float
    product: Optional[ProductOut] = None
    class Config:
        from_attributes = True

class OrderOut(BaseModel):
    id: int
    order_number: str
    customer_name: str
    customer_email: str
    customer_phone: str
    shipping_address: str
    total_amount: float
    discount_amount: float
    status: str
    payment_method: str
    notes: Optional[str]
    created_at: datetime
    items: List[OrderItemOut] = []
    class Config:
        from_attributes = True


# ── Auth ─────────────────────────────────────────────────
class Token(BaseModel):
    access_token: str
    token_type: str

class AdminLogin(BaseModel):
    username: str
    password: str
