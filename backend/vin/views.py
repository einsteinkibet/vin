from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count, F
from django.utils import timezone
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import login as auth_login
from django.conf import settings
from rest_framework import generics, status
from django.contrib.auth import login as auth_login
import stripe
from rest_framework.views import APIView
from .models import *
from .serializers import *
# Initialize Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY

# ===== AUTH VIEWS =====
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Create auth token
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)

class LoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        
        # Create or get auth token
        token, created = Token.objects.get_or_create(user=user)
        
        # Log the user in
        auth_login(request, user)
        
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        })

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    try:
        # Delete the token
        request.user.auth_token.delete()
    except:
        pass
    
    return Response({'detail': 'Successfully logged out.'})

# ===== PROFILE VIEW =====
class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

# ===== BASE VIEWSETS =====
class BaseViewSet(viewsets.ModelViewSet):
    """Base ViewSet with common functionality"""
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        return self.queryset
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# ===== USER VIEWS =====
class UserViewSet(BaseViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

# ===== VEHICLE VIEWS =====
class BMWVehicleViewSet(BaseViewSet):
    queryset = BMWVehicle.objects.all()
    serializer_class = BMWVehicleSerializer
    lookup_field = 'vin'
    
    @action(detail=True, methods=['get'])
    def options(self, request, vin=None):
        vehicle = self.get_object()
        options = OptionCompatibility.objects.filter(vehicle=vehicle)
        data = {
            'vehicle': BMWVehicleSerializer(vehicle).data,
            'options': VehicleOptionSerializer([oc.option for oc in options], many=True).data
        }
        return Response(data)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.GET.get('q', '')
        vehicles = BMWVehicle.objects.filter(
            Q(vin__icontains=query) |
            Q(model__icontains=query) |
            Q(series__icontains=query)
        )[:20]
        serializer = self.get_serializer(vehicles, many=True)
        return Response(serializer.data)

# ===== VIN DECODER VIEW =====
class VINDecodeViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    
    def create(self, request):
        vin = request.data.get('vin', '').upper().strip()
        
        if not vin or len(vin) != 17:
            return Response({'error': 'Invalid VIN'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if vehicle exists
        try:
            vehicle = BMWVehicle.objects.get(vin=vin)
        except BMWVehicle.DoesNotExist:
            return Response({'error': 'VIN not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Track lookup
        VINLookupHistory.objects.create(
            user=request.user if request.user.is_authenticated else None,
            vehicle=vehicle,
            ip_address=self.get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', ''),
            was_premium=request.user.is_authenticated and request.user.premium_status
        )
        
        # Return basic data for free, full data for premium
        serializer = BMWVehicleSerializer(vehicle)
        data = serializer.data
        
        if not request.user.is_authenticated or not request.user.premium_status:
            # Free tier - limited data
            data = {
                'vin': data['vin'],
                'model': data['model'],
                'model_year': data['model_year'],
                'series': data['series'],
                'engine_code': data['engine_code'],
                'is_premium': False
            }
        else:
            data['is_premium'] = True
        
        return Response(data)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        return x_forwarded_for.split(',')[0] if x_forwarded_for else request.META.get('REMOTE_ADDR')

# ===== PAYMENT VIEWS =====
class PaymentViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def create(self, request):
        vin = request.data.get('vin')
        amount = 300  # $3.00 in cents
        
        try:
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {'name': f'Premium VIN Report - {vin}'},
                        'unit_amount': amount,
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url=f'{settings.FRONTEND_URL}/success?session_id={{CHECKOUT_SESSION_ID}}',
                cancel_url=f'{settings.FRONTEND_URL}/cancel',
                customer=request.user.stripe_customer_id if request.user.stripe_customer_id else None,
                metadata={'vin': vin, 'user_id': str(request.user.id)}
            )
            
            # Create payment transaction record
            PaymentTransaction.objects.create(
                user=request.user,
                stripe_session_id=session.id,
                amount=amount / 100,  # Convert to dollars
                status='pending',
                vin=vin
            )
            
            return Response({'sessionId': session.id})
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# ===== STRIPE WEBHOOK VIEW =====
class StripeWebhookViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    
    def create(self, request):
        payload = request.body
        sig_header = request.META['HTTP_STRIPE_SIGNATURE']
        
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError:
            return Response({'error': 'Invalid payload'}, status=400)
        except stripe.error.SignatureVerificationError:
            return Response({'error': 'Invalid signature'}, status=400)
        
        # Handle checkout.session.completed event
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            self.handle_checkout_session(session)
        
        return Response({'status': 'success'})
    
    def handle_checkout_session(self, session):
        try:
            transaction = PaymentTransaction.objects.get(
                stripe_session_id=session.id
            )
            transaction.status = 'completed'
            transaction.stripe_payment_intent_id = session.payment_intent
            transaction.completed_at = timezone.now()
            transaction.save()
            
            # Upgrade user to premium
            user = transaction.user
            user.premium_status = True
            user.premium_since = timezone.now()
            user.save()
            
        except PaymentTransaction.DoesNotExist:
            pass

# ===== CONTENT VIEWS =====
class ContentPageViewSet(BaseViewSet):
    queryset = ContentPage.objects.filter(published=True)
    serializer_class = ContentPageSerializer
    lookup_field = 'slug'
    permission_classes = [permissions.AllowAny]

# ===== AFFILIATE VIEWS =====
class AffiliateViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    
    def list(self, request):
        products = AffiliateProduct.objects.filter(active=True)
        serializer = AffiliateProductSerializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def click(self, request, pk=None):
        product = get_object_or_404(AffiliateProduct, pk=pk, active=True)
        
        AffiliateClick.objects.create(
            user=request.user if request.user.is_authenticated else None,
            product=product,
            ip_address=self.get_client_ip(request)
        )
        
        return Response({'redirect_url': product.affiliate_url})
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        return x_forwarded_for.split(',')[0] if x_forwarded_for else request.META.get('REMOTE_ADDR')

# ===== HEALTH CHECK =====
class HealthCheckViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    
    def list(self, request):
        return Response({
            'status': 'healthy',
            'timestamp': timezone.now(),
            'vehicle_count': BMWVehicle.objects.count(),
            'user_count': User.objects.count()
        })

# ===== DASHBOARD VIEWS =====
class SavedVehiclesViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        # Get user's saved vehicles from lookup history
        saved_vehicles = VINLookupHistory.objects.filter(
            user=request.user
        ).select_related('vehicle').order_by('-lookup_date')[:10]
        
        serializer = VINLookupHistorySerializer(saved_vehicles, many=True)
        return Response(serializer.data)

class UsageStatsViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        from django.db.models import Count, Sum
        from django.utils import timezone
        from datetime import timedelta
        
        # Calculate usage statistics
        today = timezone.now().date()
        month_start = today.replace(day=1)
        
        stats = {
            'total_lookups': VINLookupHistory.objects.filter(user=request.user).count(),
            'premium_lookups': VINLookupHistory.objects.filter(
                user=request.user, was_premium=True
            ).count(),
            'lookups_this_month': VINLookupHistory.objects.filter(
                user=request.user, lookup_date__gte=month_start
            ).count(),
            'saved_vehicles': VINLookupHistory.objects.filter(
                user=request.user
            ).values('vehicle').distinct().count(),
        }
        
        return Response(stats)

# ===== USER PROFILE VIEW =====
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

# ===== VIN HISTORY VIEW =====
class VINHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = VINLookupHistorySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return VINLookupHistory.objects.filter(
            user=self.request.user
        ).select_related('vehicle').order_by('-lookup_date')

# ===== USER PROFILE UPDATE =====
class UserProfileUpdateView(generics.UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

# ===== DATA EXPORT =====
class DataExportView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        from django.http import JsonResponse
        from datetime import datetime
        
        # Get user data
        user_data = UserSerializer(request.user).data
        
        # Get user's VIN history
        vin_history = VINLookupHistory.objects.filter(user=request.user)
        history_data = VINLookupHistorySerializer(vin_history, many=True).data
        
        export_data = {
            'user': user_data,
            'vin_history': history_data,
            'export_date': datetime.now().isoformat(),
            'exported_from': 'BimmerVIN'
        }
        
        return Response(export_data)

# ===== VEHICLE OPTIONS =====
class VehicleOptionsView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, vin):
        try:
            vehicle = BMWVehicle.objects.get(vin=vin)
            options = OptionCompatibility.objects.filter(vehicle=vehicle).select_related('option')
            
            options_data = VehicleOptionSerializer(
                [oc.option for oc in options], 
                many=True
            ).data
            
            return Response({
                'vehicle': BMWVehicleSerializer(vehicle).data,
                'options': options_data
            })
            
        except BMWVehicle.DoesNotExist:
            return Response({'error': 'Vehicle not found'}, status=404)        