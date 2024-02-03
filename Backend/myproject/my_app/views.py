from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Contact, Game, Order, OrderItem,Review,Image,CartItem
from .serializers import ( ContactSerializer, CreateOrderSerializer, MyTokenObtainPairSerializer, OrderItemSerializer, UpdateOrderSerializer, UserSerializer, GameSerializer, OrderSerializer,ReviewSerializer,ImageSerializer,
                          CartItemSerializer,CartSerializer,Cart,AddCartItemSerializer,UpdateCartItemSerializer,
                             UserviewSerializer)
from rest_framework import viewsets
from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status

@api_view()
def home(request):
    return Response('ok')

# ...user jwt....


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            response.data['message'] = 'Login successful.'
        return response

class LogoutView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        return Response({"detail": "Successfully logged out."})

class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


# ....game.... 
    
class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    
 

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
# Review 
        
class GameReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def get_queryset(self):
        game_id = self.kwargs.get('game_id')
        if game_id:
            return Review.objects.filter(game__id=game_id)
        return Review.objects.all()

    def perform_create(self, serializer):
        game_id = self.kwargs.get('game_id')
        if game_id:
            serializer.save(game_id=game_id)
        else:
            serializer.save()

# Image
class GameImageViewSet(viewsets.ModelViewSet):
    serializer_class = ImageSerializer
    permission_classes = [permissions.IsAuthenticated] 


class GameImageViewSet(viewsets.ModelViewSet):
    serializer_class = ImageSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Get images associated with a specific game.
        """
        game_id = self.kwargs.get('game_id')
        if game_id:
            return Image.objects.filter(game__id=game_id)
        return Image.objects.all()
    
# Contact 

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    

# Cart 
    
class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated] 

    def perform_create(self, serializer):
            serializer.save(user=self.request.user)


class CartItemViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'patch', 'delete']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AddCartItemSerializer
        elif self.request.method == 'PATCH':
            return UpdateCartItemSerializer
        return CartItemSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'cart_id': self.kwargs['cart_pk'], 'request': self.request})
        return context

    def get_queryset(self):
        return CartItem.objects.filter(cart__id=self.kwargs['cart_pk'])

    permission_classes = [permissions.IsAuthenticated]

# views.py
# from rest_framework import viewsets
# from .serializers import OrderSerializer, CreateOrderSerializer
# from .models import Order

# class OrderViewSet(viewsets.ModelViewSet):
#     http_method_names = ['get', 'post', 'patch', 'delete']
#     queryset = Order.objects.all()
#     # serializer_class = OrderSerializer

#     def perform_create(self, serializer):
#         # Associate the review with the authenticated user
#         serializer.save(user=self.request.user)

#     def get_serializer_class(self):
#         if self.request.method == 'POST':
#             return CreateOrderSerializer
#         elif self.request.method =='PATCH':
#             return UpdateOrderSerializer
#         return OrderSerializer
#     # permission_classes = [permissions.IsAuthenticated] 
    
# views.py

# Order 
    
class OrderViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'patch', 'delete']
    queryset = Order.objects.all()
    # serializer_class = OrderSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateOrderSerializer
        elif self.request.method =='PATCH':
            return UpdateOrderSerializer
        return OrderSerializer
    permission_classes = [permissions.IsAuthenticated] 

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        latest_order = Order.objects.filter(user=self.request.user).order_by('-created_at').first()

        if not latest_order or latest_order.payment_status != 'Pending':
            latest_order = Order.objects.create(cart=self.request.user.carts.last(), user=self.request.user)

        serializer.save(order=latest_order, user=self.request.user)

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return OrderItem.objects.filter(order__user=self.request.user)
        else:
            return OrderItem.objects.none() 


@api_view(['GET'])
def get_user_carts(request, user_id):
    try:
        user_carts = Cart.objects.filter(user__id=user_id)
        serializer = CartSerializer(user_carts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class UserOrdersView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Order.objects.filter(user_id=user_id)
