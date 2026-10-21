from .models import Product

def store_context(request):
    cart = request.session.get("cart", {})
    cart_count = sum(int(qty) for qty in cart.values())
    return {
        "cart_count": cart_count,
        "featured_products": Product.objects.filter(featured=True)[:4],
    }
