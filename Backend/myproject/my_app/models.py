from django.contrib.auth.models import User
import uuid
# models.py


from django.db import models

class Game(models.Model):
    title = models.CharField(max_length=100)
    about = models.TextField()
    release_date = models.DateField()
    platforms = models.CharField(max_length=100)
    genres = models.CharField(max_length=100)
    developers = models.CharField(max_length=100)
    publisher = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='games')

    def __str__(self):
        return f"{self.title}--|--{self.genres}"

class Image(models.Model):
    game = models.ForeignKey(Game, related_name='images', on_delete=models.CASCADE)
    url = models.URLField()

    def __str__(self):
        return f"Image {self.url}"


class Review(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveIntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    
    def __str__(self):
        return f"{self.game.title} - {self.rating}"


class Cart(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='carts')

    def __str__(self):
        return f"uuid- {self.id}"
    
  
    def get_total_price_of_cart_items(self):
        return sum(item.get_total_price() for item in self.cart_items.all())

    def get_total_price(self):
        return self.get_total_price_of_cart_items()

# models.py
class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='cart_items')
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.game.title}"

    def get_total_price(self):
        return self.quantity * self.game.price
    

# models.py
class Order(models.Model):
    PAYMENT_CHOICES = [
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed'),
    ]

    cart = models.OneToOneField(Cart, on_delete=models.CASCADE, related_name='order')
    created_at = models.DateTimeField(auto_now_add=True)
    payment_status = models.CharField(max_length=10, choices=PAYMENT_CHOICES, default='Pending')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')

    def __str__(self):
        return f"Order for Cart {self.cart.id}, Payment Status: {self.payment_status}"
        

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_items')
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.quantity} x {self.game.title} in Order {self.order.id}"

    
    def get_total_price(self):
        return self.quantity * self.game.price