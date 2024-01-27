# urls.py
# from django.urls import path
# from .views import home, GameListAPIView, GameDetailAPIView



# urlpatterns = [
#     path('home', home, name='home'),
#     path('games/', GameListAPIView.as_view(), name='game-list'),
#     path('games/<int:game_id>/', GameDetailAPIView.as_view(), name='game-detail'),
#     # Add more paths as needed
# ]

# game_router = NestedDefaultRouter(router, 'games', lookup='games')
# game_router.register('reviews', GameReviewViewSet, basename='games-reviews')

from django.urls import path
from .views import LogoutView, MyTokenObtainPairView, RegisterView, UserProfileView, home, GameViewSet, GameReviewViewSet, GameImageViewSet, CartViewSet, CartItemViewSet, OrderViewSet
from rest_framework_nested.routers import DefaultRouter, NestedDefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'games', GameViewSet, basename='game-list')
router.register(r'review', GameReviewViewSet, basename='review-list')
router.register(r'image', GameImageViewSet, basename='image-list')
router.register(r'carts', CartViewSet, basename='carts')
router.register(r'orders', OrderViewSet, basename='orders')

carts_router = NestedDefaultRouter(router, 'carts', lookup='cart')
carts_router.register('items', CartItemViewSet, basename='cart-items-details')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
     path('games/<int:game_id>/reviews/', GameReviewViewSet.as_view({'get': 'list', 'post': 'create'}), name='game-reviews'),
    path('images/<int:game_id>/', GameImageViewSet.as_view({'get': 'list'}), name='game-image-list'),
] + router.urls + carts_router.urls
