
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Game, Order,Review,Image,CartItem
from .serializers import ( MyTokenObtainPairSerializer, UserSerializer,CreateOrderSerializer, GameSerializer, OrderSerializer,ReviewSerializer,ImageSerializer,
                          CartItemSerializer,CartSerializer,Cart,AddCartItemSerializer,UpdateCartItemSerializer,
                            UpdateOrderSerializer, UserviewSerializer)
from rest_framework import viewsets
from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth.models import User
from rest_framework.response import Response

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
        # Customize the response data
        if response.status_code == 200:
            response.data['message'] = 'Login successful.'
        return response

class LogoutView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        # Simply return success message, as JWTs are stateless
        return Response({"detail": "Successfully logged out."})

# views.py
from rest_framework import generics, permissions
from .serializers import UserSerializer

class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [permissions.IsAuthenticated] 
    

class GameReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated] 

class GameImageViewSet(viewsets.ModelViewSet):
    serializer_class = ImageSerializer
    permission_classes = [permissions.IsAuthenticated] 


    def get_queryset(self):
        """
        Get images associated with a specific game.
        """
        game_id = self.kwargs.get('game_id')
        if game_id:
            return Image.objects.filter(game__id=game_id)
        return Image.objects.all()

class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated] 


class CartItemViewSet(viewsets.ModelViewSet):
    http_method_names=['get','post','patch','delete']
    def get_serializer_class(self):
        if self.request.method=='POST':
            return AddCartItemSerializer
        elif self.request.method =='PATCH':
            return UpdateCartItemSerializer
        return CartItemSerializer

    def get_serializer_context(self):
        return {'cart_id':self.kwargs['cart_pk']}

    def get_queryset(self):
        return CartItem.objects.filter(cart__id=self.kwargs['cart_pk'])
    permission_classes = [permissions.IsAuthenticated]


# views.py
from rest_framework import viewsets
from .serializers import OrderSerializer, CreateOrderSerializer
from .models import Order

class OrderViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'patch', 'delete']
    queryset = Order.objects.all()
    # serializer_class = OrderSerializer

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateOrderSerializer
        elif self.request.method =='PATCH':
            return UpdateOrderSerializer
        return OrderSerializer
    permission_classes = [permissions.IsAuthenticated] 
    

