"""Run once to populate the database with initial data."""
from database import SessionLocal, engine
import models
from auth import get_password_hash

models.Base.metadata.create_all(bind=engine)

CATEGORIES = [
    {"name": "Baby Dresses", "slug": "baby-dresses", "description": "Adorable clothing for newborns and toddlers", "icon": "👶", "color": "#FF6B9D"},
    {"name": "Fancy",        "slug": "fancy",         "description": "Jewellery, hair clips & accessories",         "icon": "💍", "color": "#A855F7"},
    {"name": "Gifts",        "slug": "gifts",         "description": "Beautiful gift sets for every occasion",      "icon": "🎁", "color": "#F97316"},
    {"name": "Bags",         "slug": "bags",          "description": "Handbags, backpacks & school bags",           "icon": "👜", "color": "#10B981"},
    {"name": "Toys",         "slug": "toys",          "description": "Educational & fun toys for all ages",         "icon": "🧸", "color": "#F59E0B"},
    {"name": "Stationery",   "slug": "stationery",    "description": "Pens, notebooks & art supplies",              "icon": "✏️", "color": "#3B82F6"},
    {"name": "Sweet Escape", "slug": "sweet-escape",  "description": "Ice creams, juices, milkshakes & snacks",     "icon": "🍦", "color": "#EC4899"},
]

PRODUCTS = [
    # Baby Dresses
    {"name":"Pink Floral Baby Frock","price":349,"original_price":499,"stock":50,"category_slug":"baby-dresses","is_featured":True,"description":"Soft cotton floral frock for baby girls aged 0–12 months.","image_url":"https://images.unsplash.com/photo-1522771930-78848d9293e8?w=500&h=500&fit=crop&auto=format"},
    {"name":"Blue Romper Set","price":299,"original_price":450,"stock":40,"category_slug":"baby-dresses","is_featured":False,"description":"Comfortable stretchable romper with matching cap.","image_url":"https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=500&fit=crop&auto=format"},
    {"name":"Baby Woollen Sweater Set","price":549,"original_price":799,"stock":30,"category_slug":"baby-dresses","is_featured":False,"description":"Warm knitted sweater + pant set for winters.","image_url":"https://images.unsplash.com/photo-1519689680058-324335c77eba?w=500&h=500&fit=crop&auto=format"},
    {"name":"New-Born Gift Dress Set","price":699,"original_price":999,"stock":25,"category_slug":"baby-dresses","is_featured":True,"description":"Premium 5-piece new-born clothing gift set.","image_url":"https://images.unsplash.com/photo-1617331721458-bd3bd3f9c7f8?w=500&h=500&fit=crop&auto=format"},
    # Fancy
    {"name":"Pearl Hair Clip Set (12 pcs)","price":149,"original_price":249,"stock":100,"category_slug":"fancy","is_featured":True,"description":"Assorted pearl & flower hair clips for girls.","image_url":"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop&auto=format"},
    {"name":"Bangle & Bracelet Combo","price":199,"original_price":299,"stock":80,"category_slug":"fancy","is_featured":False,"description":"Traditional-style bangles with matching bracelet.","image_url":"https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=500&h=500&fit=crop&auto=format"},
    {"name":"Fancy Hairband Set (6 pcs)","price":129,"original_price":199,"stock":120,"category_slug":"fancy","is_featured":False,"description":"Colourful velvet and satin hairbands.","image_url":"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop&auto=format"},
    # Gifts
    {"name":"Birthday Gift Box – Pink","price":599,"original_price":899,"stock":30,"category_slug":"gifts","is_featured":True,"description":"Beautifully wrapped gift box with ribbon.","image_url":"https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&h=500&fit=crop&auto=format"},
    {"name":"Combo Gift Hamper (5 items)","price":999,"original_price":1499,"stock":20,"category_slug":"gifts","is_featured":True,"description":"Toys, stationery & accessories combo hamper.","image_url":"https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=500&h=500&fit=crop&auto=format"},
    {"name":"Return Gift Set (Pack of 10)","price":449,"original_price":699,"stock":50,"category_slug":"gifts","is_featured":False,"description":"Perfect for birthday party return gifts.","image_url":"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&auto=format"},
    # Bags
    {"name":"Green Mini Handbag","price":499,"original_price":799,"stock":35,"category_slug":"bags","is_featured":True,"description":"Trendy faux-leather handbag with pom-pom.","image_url":"https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop&auto=format"},
    {"name":"Pink School Backpack","price":699,"original_price":999,"stock":40,"category_slug":"bags","is_featured":True,"description":"Spacious water-resistant school bag for kids.","image_url":"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop&auto=format"},
    {"name":"Gradient Water Bottle Bag","price":299,"original_price":499,"stock":60,"category_slug":"bags","is_featured":False,"description":"Insulated bag that fits most 500 ml bottles.","image_url":"https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500&h=500&fit=crop&auto=format"},
    # Toys
    {"name":"Stacking Rainbow Rings","price":249,"original_price":399,"stock":55,"category_slug":"toys","is_featured":False,"description":"Classic educational stacking toy for toddlers.","image_url":"https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=500&fit=crop&auto=format"},
    {"name":"Barbie Fashion Doll","price":449,"original_price":699,"stock":45,"category_slug":"toys","is_featured":True,"description":"Glamorous fashion doll with changeable outfit.","image_url":"https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&h=500&fit=crop&auto=format"},
    {"name":"Teddy Bear (30 cm)","price":349,"original_price":499,"stock":70,"category_slug":"toys","is_featured":True,"description":"Ultra-soft plush teddy bear.","image_url":"https://images.unsplash.com/photo-1559715541-5daf8a0296d0?w=500&h=500&fit=crop&auto=format"},
    {"name":"DIY Building Blocks (100 pcs)","price":399,"original_price":599,"stock":40,"category_slug":"toys","is_featured":False,"description":"Colourful LEGO-compatible building blocks.","image_url":"https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500&h=500&fit=crop&auto=format"},
    # Stationery
    {"name":"Fancy Pen Set (12 pcs)","price":149,"original_price":249,"stock":90,"category_slug":"stationery","is_featured":False,"description":"Gel pens with animal toppers – great for kids.","image_url":"https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&h=500&fit=crop&auto=format"},
    {"name":"Pastel Notebook Set (3 pcs)","price":199,"original_price":349,"stock":75,"category_slug":"stationery","is_featured":True,"description":"A5 ruled notebooks with pastel covers.","image_url":"https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&h=500&fit=crop&auto=format"},
    {"name":"Art & Craft Kit","price":499,"original_price":799,"stock":30,"category_slug":"stationery","is_featured":True,"description":"Complete art kit with crayons, paints & brushes.","image_url":"https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop&auto=format"},
    {"name":"Glitter Sticker Sheet Pack","price":99,"original_price":149,"stock":200,"category_slug":"stationery","is_featured":False,"description":"100+ glitter stickers for kids craft projects.","image_url":"https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=500&h=500&fit=crop&auto=format"},
    # Sweet Escape
    {"name":"Vanilla Soft Serve Cone","price":50,"original_price":None,"stock":999,"category_slug":"sweet-escape","is_featured":True,"description":"Classic creamy vanilla soft-serve ice cream.","image_url":"https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500&h=500&fit=crop&auto=format"},
    {"name":"Strawberry Milkshake (300 ml)","price":80,"original_price":None,"stock":999,"category_slug":"sweet-escape","is_featured":True,"description":"Thick fresh strawberry milkshake.","image_url":"https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=500&h=500&fit=crop&auto=format"},
    {"name":"Fresh Sugarcane Juice (400 ml)","price":40,"original_price":None,"stock":999,"category_slug":"sweet-escape","is_featured":False,"description":"Cold pressed natural sugarcane juice.","image_url":"https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&h=500&fit=crop&auto=format"},
    {"name":"Buttered Popcorn (Medium)","price":60,"original_price":None,"stock":999,"category_slug":"sweet-escape","is_featured":False,"description":"Freshly popped cinema-style butter popcorn.","image_url":"https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=500&h=500&fit=crop&auto=format"},
    {"name":"Soft Drink Combo (2 bottles)","price":70,"original_price":90,"stock":999,"category_slug":"sweet-escape","is_featured":False,"description":"Choice of 2 chilled soft drink bottles.","image_url":"https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=500&h=500&fit=crop&auto=format"},
]


def seed():
    db = SessionLocal()
    try:
        if not db.query(models.Admin).filter_by(username="admin").first():
            db.add(models.Admin(username="admin", hashed_password=get_password_hash("admin@CW2024")))
            print("✅ Admin user created  (username: admin | password: admin@CW2024)")

        cat_map = {}
        for c in CATEGORIES:
            obj = db.query(models.Category).filter_by(slug=c["slug"]).first()
            if not obj:
                obj = models.Category(**c)
                db.add(obj)
                db.flush()
                print(f"   Category: {c['name']}")
            cat_map[c["slug"]] = obj.id

        for p in PRODUCTS:
            slug = p.pop("category_slug")
            p["category_id"] = cat_map[slug]
            if not db.query(models.Product).filter_by(name=p["name"]).first():
                db.add(models.Product(**p))
                print(f"   Product: {p['name']}")

        db.commit()
        print("\n🎉 Database seeded successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
