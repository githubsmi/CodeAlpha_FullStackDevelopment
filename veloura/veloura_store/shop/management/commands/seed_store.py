from django.core.management.base import BaseCommand
from shop.models import Product

PRODUCTS = [
    {
        "name": "Luna Silk Blouse", "slug": "luna-silk-blouse",
        "description": "A refined silk blouse with a soft drape and timeless silhouette, designed for effortless day-to-evening styling.",
        "price": "89.00", "old_price": "119.00", "category": "fashion", "stock": 18, "featured": True,
        "image_url": "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80"
    },
    {
        "name": "Aurelia Leather Tote", "slug": "aurelia-leather-tote",
        "description": "A structured everyday tote with a polished finish, generous interior and understated luxury.",
        "price": "129.00", "old_price": "159.00", "category": "accessories", "stock": 12, "featured": True,
        "image_url": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80"
    },
    {
        "name": "Noir Minimal Watch", "slug": "noir-minimal-watch",
        "description": "A sleek minimalist timepiece with a clean dial and versatile profile for modern wardrobes.",
        "price": "149.00", "old_price": None, "category": "accessories", "stock": 10, "featured": True,
        "image_url": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80"
    },
    {
        "name": "Velvet Rose Eau de Parfum", "slug": "velvet-rose-eau-de-parfum",
        "description": "A sophisticated floral fragrance blending rose petals, warm woods and a soft amber finish.",
        "price": "79.00", "old_price": "95.00", "category": "beauty", "stock": 20, "featured": True,
        "image_url": "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&w=900&q=80"
    },
    {
        "name": "Cloud Knit Lounge Set", "slug": "cloud-knit-lounge-set",
        "description": "A plush two-piece knit set made for slow mornings, travel days and elevated comfort.",
        "price": "99.00", "old_price": None, "category": "fashion", "stock": 16, "featured": False,
        "image_url": "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=900&q=80"
    },
    {
        "name": "Studio Ceramic Vase", "slug": "studio-ceramic-vase",
        "description": "A sculptural ceramic vase that brings a quiet, gallery-inspired accent to your space.",
        "price": "59.00", "old_price": "69.00", "category": "home", "stock": 15, "featured": False,
        "image_url": "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=900&q=80"
    },
    {
        "name": "Arc Wireless Headphones", "slug": "arc-wireless-headphones",
        "description": "Comfortable wireless headphones with a clean design for work, travel and everyday listening.",
        "price": "179.00", "old_price": "219.00", "category": "tech", "stock": 9, "featured": False,
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"
    },
    {
        "name": "Silk Glow Face Set", "slug": "silk-glow-face-set",
        "description": "A simple self-care set featuring elegant essentials for a fresh, luminous routine.",
        "price": "69.00", "old_price": None, "category": "beauty", "stock": 14, "featured": False,
        "image_url": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80"
    },
]

class Command(BaseCommand):
    help = "Create demo products for Veloura"

    def handle(self, *args, **options):
        for data in PRODUCTS:
            Product.objects.update_or_create(slug=data["slug"], defaults=data)
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(PRODUCTS)} Veloura products."))
