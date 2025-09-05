from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

# Manual registration
router.register('users', views.UserViewSet, basename='user')
router.register('vehicles', views.BMWVehicleViewSet, basename='vehicle')
router.register('content', views.ContentPageViewSet, basename='content')

urlpatterns = [
    path('', include(router.urls)),
    
    # Auth endpoints
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/profile/', views.ProfileView.as_view(), name='profile'),
    
    # Custom endpoints
    path('vin/decode/', views.VINDecodeViewSet.as_view({'post': 'create'}), name='vin-decode'),
    path('payment/create/', views.PaymentViewSet.as_view({'post': 'create'}), name='payment-create'),
    path('webhook/stripe/', views.StripeWebhookViewSet.as_view({'post': 'create'}), name='stripe-webhook'),
    path('affiliate/', views.AffiliateViewSet.as_view({'get': 'list'}), name='affiliate-list'),
    path('affiliate/<int:pk>/click/', views.AffiliateViewSet.as_view({'post': 'click'}), name='affiliate-click'),
    path('health/', views.HealthCheckViewSet.as_view({'get': 'list'}), name='health-check'),
    path('dashboard/saved-vehicles/', views.SavedVehiclesViewSet.as_view({'get': 'list'}), name='saved-vehicles'),
    path('dashboard/usage-stats/', views.UsageStatsViewSet.as_view({'get': 'list'}), name='usage-stats'),
    path('dashboard/vin-history/', views.VINHistoryViewSet.as_view({'get': 'list'}), name='vin-history'),
    # DRF auth URLs for browsable API - KEEP THIS ONLY ONCE
    path('auth-api/', include('rest_framework.urls', namespace='rest_framework')),
    # Add this to your urlpatterns
    path('webhook/paystack/', views.PaystackWebhookViewSet.as_view({'post': 'create'}), name='paystack-webhook'),
    
]
