from rest_framework import serializers
from .models import Game, Image, Order, OrderItem,Review,CartItem,Cart, CartItem, Order, OrderItem
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        # Check if the email already exists in the User model
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists. Choose a different email.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UserviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        
    def get_user_id(self, obj):
        # Retrieve user ID from context
        user_id = self.context.get('user_id')
        return user_id

class ImageSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Image
        fields = '__all__'

class GameSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, required=False)

    class Meta:
        model = Game
        fields = '__all__'

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        game = Game.objects.create(**validated_data)

        for image_data in images_data:
            Image.objects.create(game=game, **image_data)

        return game

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', [])

        # Update the game fields
        instance.title = validated_data.get('title', instance.title)
        instance.about = validated_data.get('about', instance.about)
        # Add other fields as needed

        instance.save()

        # Update or create images
        instance.images.clear()  # Clear existing images
        for image_data in images_data:
            image = Image.objects.create(game=instance, **image_data)
            instance.images.add(image)

        return instance


class SimpleProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id','title','price']

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

    def create(self, validated_data):
        game_id = validated_data.pop('game_id', None)
        if game_id is not None:
            validated_data['game_id'] = game_id

        return super().create(validated_data)

    
class CartItemSerializer(serializers.ModelSerializer):
    game = SimpleProductSerializer()

    total_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'game','quantity', 'total_price']

    def get_total_price(self, obj):
        return obj.get_total_price()


class AddCartItemSerializer(serializers.ModelSerializer):
    game_id=serializers.IntegerField()

    def validate_game_id(self, value):
        if not Game.objects.filter(pk=value).exists():
            raise serializers.ValidationError('No Game found with the given ID')
        return value
    
    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError('Quantity must be greater than or equal to 1')
        return value
    
    def save(self, **kwargs):
        cart_id=self.context['cart_id']
        game_id=self.validated_data['game_id']
        quantity=self.validated_data['quantity']

        try: 
            cart_item=CartItem.objects.get(cart_id=cart_id,game_id=game_id)
            cart_item.quantity+=quantity
            cart_item.save()
        except CartItem.DoesNotExist:
            self.instance=CartItem.objects.create(cart_id=cart_id,**self.validated_data)

        return self.instance
    
    class Meta:
        model = CartItem
        fields = ['id', 'game_id', 'quantity']

class CartSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    cart_items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id','cart_items', 'total_price']

    def get_total_price(self, obj):
        return obj.get_total_price()


class UpdateCartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model=CartItem
        fields = ['quantity']


class OrderItemSerializer(serializers.ModelSerializer):
    game = SimpleProductSerializer()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'game', 'quantity', 'total_price']

    def get_total_price(self, obj):
        return obj.get_total_price()

 

class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id','cart' ,'created_at', 'payment_status', 'order_items']


class UpdateOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model=Order
        fields = ['payment_status']



class CreateOrderSerializer(serializers.Serializer):
    cart_id = serializers.UUIDField()

    def validate_cart_id(self, cart_id):
        if not Cart.objects.filter(pk=cart_id).exists():
            raise serializers.ValidationError('No Cart found with the given ID')
        if CartItem.objects.filter(cart_id=cart_id).count() == 0:
            raise serializers.ValidationError('The Cart is empty')
        return cart_id

    def save(self, **kwargs):
        cart_id = self.validated_data['cart_id']

        # Use select_related to fetch related 'game' objects in a single query
        cart_items = CartItem.objects.select_related('game').filter(cart_id=cart_id)

        order_items = [
            OrderItem(
                order=None,  # We will set this later
                game=item.game,
                price=item.game.price,
                quantity=item.quantity
            ) for item in cart_items
        ]

        # Create an order and associate it with the cart
        order = Order.objects.create(cart_id=cart_id)

        # Update the order items with the correct order
        for order_item in order_items:
            order_item.order = order

        # Bulk create the order items
        OrderItem.objects.bulk_create(order_items)

        # Update the cart status or perform other actions if needed
        Cart.objects.filter(pk=cart_id).delete()

        return order


