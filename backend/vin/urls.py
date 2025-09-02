from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

# Auto-register all ViewSets (NO NEED TO IMPORT EACH ONE INDIVIDUALLY)
for attr_name in dir(views):
    attr = getattr(views, attr_name)
    if isinstance(attr, type) and issubclass(attr, viewsets.ViewSet) and attr != viewsets.ViewSet:
        # Generate base name from class name (remove 'ViewSet')
        base_name = attr_name.replace('ViewSet', '').lower()
        router.register(base_name, attr, basename=base_name)

# Manual registration for views that don't follow the pattern
router.register('vin/decode', views.VINDecodeViewSet, basename='vin-decode')
router.register('payment', views.PaymentViewSet, basename='payment')
router.register('webhook/stripe', views.StripeWebhookViewSet, basename='stripe-webhook')
router.register('affiliate', views.AffiliateViewSet, basename='affiliate')
router.register('health', views.HealthCheckViewSet, basename='health')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/auth/', include('rest_framework.urls')),
]
