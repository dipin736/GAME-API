# urls.py
# from django.urls import path
# from .views import home, GameListAPIView, GameDetailAPIView



# urlpatterns = [
#     path('home', home, name='home'),
#     path('games/', GameListAPIView.as_view(), name='game-list'),
#     path('games/<int:game_id>/', GameDetailAPIView.as_view(), name='game-detail'),
#     # Add more paths as needed
# ]



# urls.py
from django.urls import path
from .views import home, GameViewSet, GameReviewViewSet, GameImageViewSet, CartViewSet, CartItemViewSet,OrderViewSet
from rest_framework_nested.routers import DefaultRouter, NestedDefaultRouter

router = DefaultRouter()
router.register(r'games', GameViewSet, basename='game-list')
router.register(r'review', GameReviewViewSet, basename='review-list')
router.register(r'image', GameImageViewSet, basename='image-list')
router.register(r'carts', CartViewSet, basename='carts')
router.register(r'orders', OrderViewSet, basename='orders')


# game_router = NestedDefaultRouter(router, 'games', lookup='games')
# game_router.register('reviews', GameReviewViewSet, basename='games-reviews')

carts_router = NestedDefaultRouter(router, 'carts', lookup='cart')
carts_router.register('items', CartItemViewSet, basename='cart-items-details')

urlpatterns = router.urls + carts_router.urls
