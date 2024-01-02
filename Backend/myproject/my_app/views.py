
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Game, Order,Review,Image,CartItem
from .serializers import CreateOrderSerializer, GameSerializer, OrderSerializer,ReviewSerializer,ImageSerializer,CartItemSerializer,CartSerializer,Cart,AddCartItemSerializer,UpdateCartItemSerializer, UpdateOrderSerializer
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet
from rest_framework import viewsets
from rest_framework.mixins import CreateModelMixin
from rest_framework.decorators import action

@api_view()
def home(request):
    return Response('ok')

# class GameListAPIView(APIView):
#     def get(self, request):
#         games = Game.objects.all()
#         serializer = GameSerializer(games, many=True)
#         return Response(serializer.data)

#     def post(self, request):
#         serializer = GameSerializer(data=request.data)

#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class GameDetailAPIView(APIView):
#     def get(self, request, game_id):
#         game = get_object_or_404(Game, pk=game_id)
#         serializer = GameSerializer(game)
#         return Response(serializer.data)



class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    

class GameReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    
# class GameReviewViewSet(viewsets.ModelViewSet):
#     serializer_class = ReviewSerializer

#     def get_serializer_context(self):
#         return {'game_id': self.kwargs['game_pk']}
    
#     def get_queryset(self):
#         return Review.objects.filter(game_id=self.kwargs['game_pk'])

class GameImageViewSet(viewsets.ModelViewSet):
    serializer_class = ImageSerializer

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
        