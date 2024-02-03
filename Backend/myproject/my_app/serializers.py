from rest_framework import serializers
from .models import Contact, Game, Image, Order, OrderItem,Review,CartItem,Cart, CartItem, Order, OrderItem
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
        user_id = self.context.get('user_id')
        return user_id

class ImageSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Image
        fields = '__all__'


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
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

        instance.title = validated_data.get('title', instance.title)
        instance.about = validated_data.get('about', instance.about)

        instance.save()

        instance.images.clear() 
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
    game_id = serializers.IntegerField()

    def validate_game_id(self, value):
        if not Game.objects.filter(pk=value).exists():
            raise serializers.ValidationError('No Game found with the given ID')
        return value

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError('Quantity must be greater than or equal to 1')
        return value

    def save(self, **kwargs):
        cart_id = self.context['cart_id']
        game_id = self.validated_data['game_id']
        quantity = self.validated_data['quantity']
        
        print(f"Attempting to create CartItem for cart_id={cart_id}, game_id={game_id}, quantity={quantity}")
        
        if cart_id == "null":
            user = self.context['request'].user
            cart = Cart.objects.create(user=user)  # Create a new cart and associate the user
        else:
            try:
                cart = Cart.objects.get(id=cart_id)
            except Cart.DoesNotExist:
                raise serializers.ValidationError('Cart not found with the given ID')

        try:
            cart_item = CartItem.objects.get(cart=cart, game_id=game_id)
            cart_item.quantity += quantity
            cart_item.save()
        except CartItem.DoesNotExist:
            cart_item = CartItem.objects.create(cart=cart, game_id=game_id, quantity=quantity, user=self.context['request'].user)

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
        fields = ['id','cart' ,'created_at', 'payment_status', 'order_items','user']


class UpdateOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model=Order
        fields = ['payment_status']



from django.contrib.auth.models import User
from django.db import transaction

class CreateOrderSerializer(serializers.Serializer):
    cart_id = serializers.UUIDField()

    def validate_cart_id(self, cart_id):
        print("Saving order...")
        if not Cart.objects.filter(pk=cart_id).exists():
            raise serializers.ValidationError('No cart with the given ID was found.')
        if CartItem.objects.filter(cart_id=cart_id).count() == 0:
            raise serializers.ValidationError('Cart is empty.')
        return cart_id

    def save(self, user, **kwargs):
        with transaction.atomic():
            cart_id = self.validated_data['cart_id']

            order = Order.objects.create(cart_id=cart_id, user=user)

            cart_items = CartItem.objects.select_related('game').filter(cart_id=cart_id)

            order_items = [
                OrderItem(
                    order=order,
                    game=item.game,
                    quantity=item.quantity,
                    user=user  # Set the user for each OrderItem
                ) for item in cart_items
            ]

            OrderItem.objects.bulk_create(order_items)

            print("Order saved successfully.")
            return order




# serializers.py

# from rest_framework import serializers
# from .models import Order, OrderItem

# class OrderItemSerializer(serializers.ModelSerializer):
#     game = SimpleProductSerializer()

#     class Meta:
#         model = OrderItem
#         fields = ['id','game', 'quantity']

#     def get_total_price(self, obj):
#         return obj.get_total_price()

# class OrderSerializer(serializers.ModelSerializer):
#     id = serializers.UUIDField(read_only=True)
#     order_items = OrderItemSerializer(many=True, read_only=True)

#     class Meta:
#         model = Order
#         fields = ['id','cart', 'order_items', 'created_at', 'payment_status','user']

#     def get_total_price(self, obj):
#         return obj.get_total_price()
