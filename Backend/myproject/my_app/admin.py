from django.contrib import admin
from .models import Game, Image, Review, Cart, CartItem, Order, OrderItem, Contact

# Register your models here.

class ImageInline(admin.TabularInline):
    model = Image
    extra = 1

class ReviewInline(admin.TabularInline):
    model = Review
    extra = 1

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 1

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1

class GameAdmin(admin.ModelAdmin):
    list_display = ('title', 'release_date', 'price', 'user')
    inlines = [ImageInline, ReviewInline]

class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'created_at', 'user', 'get_total_price_of_cart_items')
    inlines = [CartItemInline]

class OrderAdmin(admin.ModelAdmin):
    list_display = ('cart', 'created_at', 'payment_status', 'user')
    inlines = [OrderItemInline]

class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'message')

admin.site.register(Game, GameAdmin)
admin.site.register(Cart, CartAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(Contact, ContactAdmin)
admin.site.register(Review)
admin.site.register(Image)

