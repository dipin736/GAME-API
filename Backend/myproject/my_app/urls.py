from django.urls import path
from .views import ContactViewSet, LogoutView, MyTokenObtainPairView, OrderItemViewSet, RegisterView, UserOrdersView, UserProfileView, get_user_carts, home, GameViewSet, GameReviewViewSet, GameImageViewSet, CartViewSet, CartItemViewSet, OrderViewSet
from rest_framework_nested.routers import DefaultRouter, NestedDefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'games', GameViewSet, basename='game-list')
router.register(r'review', GameReviewViewSet, basename='review-list')
router.register(r'image', GameImageViewSet, basename='image-list')
router.register(r'carts', CartViewSet, basename='carts')
router.register(r'orders', OrderViewSet, basename='orders')
router.register(r'order-items', OrderItemViewSet, basename='order-item')
router.register(r'contacts', ContactViewSet, basename='contact')
# router.register(r'orders', OrderViewSet, basename='order')


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
     path('carts/<int:user_id>/', get_user_carts, name='get_user_carts'),
     path('orders/<int:user_id>/', UserOrdersView.as_view(), name='user_orders'),
     
] + router.urls + carts_router.urls
