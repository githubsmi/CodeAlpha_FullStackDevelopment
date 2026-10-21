from decimal import Decimal
from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.shortcuts import get_object_or_404, redirect, render

from .forms import CheckoutForm, RegisterForm
from .models import Order, OrderItem, Product


def home(request):
    products = Product.objects.all()
    return render(request, "home.html", {
        "products": products[:8],
        "featured": products.filter(featured=True)[:4],
    })


def product_list(request):
    products = Product.objects.all()
    category = request.GET.get("category", "").strip()
    search = request.GET.get("q", "").strip()

    if category:
        products = products.filter(category=category)
    if search:
        products = products.filter(name__icontains=search)

    return render(request, "products.html", {
        "products": products,
        "selected_category": category,
        "search_query": search,
        "categories": Product.CATEGORY_CHOICES,
    })


def product_detail(request, slug):
    product = get_object_or_404(Product, slug=slug)
    related = Product.objects.filter(category=product.category).exclude(pk=product.pk)[:4]
    return render(request, "product_detail.html", {"product": product, "related": related})


def _cart_items(request):
    cart = request.session.get("cart", {})
    products = Product.objects.filter(id__in=cart.keys())
    items = []
    total = Decimal("0")

    for product in products:
        quantity = max(1, int(cart.get(str(product.id), cart.get(product.id, 1))))
        quantity = min(quantity, product.stock)
        subtotal = product.price * quantity
        total += subtotal
        items.append({"product": product, "quantity": quantity, "subtotal": subtotal})
    return items, total


def cart(request):
    items, total = _cart_items(request)
    return render(request, "cart.html", {"items": items, "total": total})


def add_to_cart(request, product_id):
    product = get_object_or_404(Product, pk=product_id)
    if product.stock < 1:
        messages.error(request, "This product is currently out of stock.")
        return redirect(request.META.get("HTTP_REFERER", "product_list"))

    cart = request.session.get("cart", {})
    key = str(product_id)
    cart[key] = min(int(cart.get(key, 0)) + int(request.POST.get("quantity", 1)), product.stock)
    request.session["cart"] = cart
    request.session.modified = True
    messages.success(request, f"{product.name} was added to your cart.")
    return redirect(request.POST.get("next") or "cart")


def update_cart(request, product_id):
    product = get_object_or_404(Product, pk=product_id)
    cart = request.session.get("cart", {})
    quantity = int(request.POST.get("quantity", 1))
    if quantity <= 0:
        cart.pop(str(product_id), None)
    else:
        cart[str(product_id)] = min(quantity, product.stock)
    request.session["cart"] = cart
    request.session.modified = True
    return redirect("cart")


def remove_from_cart(request, product_id):
    cart = request.session.get("cart", {})
    cart.pop(str(product_id), None)
    request.session["cart"] = cart
    request.session.modified = True
    return redirect("cart")


@login_required
def checkout(request):
    items, total = _cart_items(request)
    if not items:
        messages.info(request, "Your cart is empty.")
        return redirect("product_list")

    initial = {
        "full_name": request.user.get_full_name() or request.user.username,
        "email": request.user.email,
    }

    if request.method == "POST":
        form = CheckoutForm(request.POST)
        if form.is_valid():
            with transaction.atomic():
                # Re-check inventory inside the transaction.
                for item in items:
                    product = Product.objects.select_for_update().get(pk=item["product"].pk)
                    if item["quantity"] > product.stock:
                        messages.error(request, f"Not enough stock for {product.name}.")
                        return redirect("cart")

                order = Order.objects.create(
                    user=request.user,
                    total=total,
                    **form.cleaned_data,
                )
                for item in items:
                    product = Product.objects.select_for_update().get(pk=item["product"].pk)
                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        product_name=product.name,
                        price=product.price,
                        quantity=item["quantity"],
                    )
                    product.stock -= item["quantity"]
                    product.save(update_fields=["stock"])

            request.session["cart"] = {}
            request.session.modified = True
            return redirect("order_success", order_id=order.id)
    else:
        form = CheckoutForm(initial=initial)

    return render(request, "checkout.html", {"form": form, "items": items, "total": total})


@login_required
def order_success(request, order_id):
    order = get_object_or_404(Order, pk=order_id, user=request.user)
    return render(request, "order_success.html", {"order": order})


@login_required
def my_orders(request):
    orders = request.user.orders.prefetch_related("items")
    return render(request, "orders.html", {"orders": orders})


def register(request):
    if request.user.is_authenticated:
        return redirect("home")
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, "Welcome to Veloura!")
            return redirect("home")
    else:
        form = RegisterForm()
    return render(request, "registration/register.html", {"form": form})
