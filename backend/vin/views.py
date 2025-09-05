from django.shortcuts import render
import requests
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
# import stripe
from rest_framework.views import APIView
from .models import *
from .serializers import *
from .paystack_handler import PaystackPayment

# stripe.api_key = settings.STRIPE_SECRET_KEY

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
        print(f"=== VIN DECODE REQUEST ===")
        print(f"Request data: {request.data}")
        print(f"User: {request.user}")
        print(f"Authenticated: {request.user.is_authenticated}")
        
        vin = request.data.get('vin', '').upper().strip()
        print(f"Extracted VIN: '{vin}'")
        
        if not vin:
            print("ERROR: No VIN provided")
            return Response({'error': 'VIN is required'}, status=400)
        
        if len(vin) != 17:
            print(f"ERROR: VIN length is {len(vin)}, expected 17")
            return Response({'error': 'VIN must be 17 characters'}, status=400)
        
        try:
            # Check cache first
            print("Checking cache for VIN...")
            cached_vehicle = BMWVehicle.objects.filter(vin=vin).first()
            if cached_vehicle:
                print(f"Found cached vehicle: {cached_vehicle.vin}")
                return self._prepare_response(
                    BMWVehicleSerializer(cached_vehicle).data, 
                    request.user
                )
            
            print("No cached vehicle found, fetching from NHTSA...")
            # Get enhanced data with history
            vehicle_data = self._get_vehicle_data(vin)
            print(f"Vehicle data retrieved: {vehicle_data}")
            
            # For now, skip history data until basic decoding works
            history_data = {}  # data_provider.get_vehicle_history(vin)
            
            print("Creating vehicle record...")
            # Create vehicle record
            vehicle = BMWVehicle.objects.create(**vehicle_data)
            print(f"Vehicle created: {vehicle.vin}")
            
            # Add history data to response
            response_data = BMWVehicleSerializer(vehicle).data
            response_data['history'] = history_data
            
            return self._prepare_response(response_data, request.user)
            
        except Exception as e:
            print(f"EXCEPTION in VIN decode: {str(e)}")
            import traceback
            traceback.print_exc()  # This will show the full stack trace
            return Response({'error': str(e)}, status=400)

    def _get_vehicle_data(self, vin):
        """
        Get vehicle data from NHTSA API and transform it to our format
        """
        try:
            # Fetch data from NHTSA API
            nhtsa_data = self._fetch_nhtsa_data(vin)
            
            # Transform to our format
            vehicle_data = self._transform_nhtsa_to_bmw(nhtsa_data, vin)
            
            return vehicle_data
            
        except Exception as e:
            # Log the error and re-raise
            print(f"Error getting vehicle data for VIN {vin}: {str(e)}")
            raise Exception(f"Failed to fetch vehicle data: {str(e)}")
                
    def _fetch_nhtsa_data(self, vin):
        """Fetch data from NHTSA API"""
        try:
            url = f"https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVINValues/{vin}?format=json"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return response.json()
    
        except requests.RequestException as e:
            raise Exception(f"NHTSA API request failed: {str(e)}")
        except ValueError as e:
            raise Exception(f"Failed to parse NHTSA response: {str(e)}")

    def _transform_nhtsa_to_bmw(self, nhtsa_data, vin):
        """Transform NHTSA data to BMW format with validation"""
        results = nhtsa_data.get('Results', [{}])[0]
        
        # Handle missing data gracefully with defaults
        def get_safe(key, default='Unknown'):
            value = results.get(key)
            return value if value not in [None, '', 'Not Applicable'] else default
        
        # Handle model_year conversion safely
        model_year = get_safe('ModelYear', '2020')
        try:
            model_year = int(model_year) if model_year and str(model_year).isdigit() else 2020
        except (ValueError, TypeError):
            model_year = 2020
        
        # Handle horsepower conversion safely  
        horsepower = get_safe('EngineHP')
        try:
            horsepower = int(horsepower) if horsepower and str(horsepower).isdigit() else None
        except (ValueError, TypeError):
            horsepower = None
        
        return {
            'vin': vin,
            'model': get_safe('Model', 'Unknown BMW Model'),
            'model_year': model_year,
            'series': self._extract_series(get_safe('Model')),
            'body_type': get_safe('BodyClass', 'Sedan'),
            'engine_code': self._extract_engine_code(results) or 'Unknown',
            'transmission_type': get_safe('TransmissionStyle', 'Automatic'),
            'drive_type': get_safe('DriveType', 'RWD'),
            'fuel_type': get_safe('FuelTypePrimary', 'Gasoline'),
            'assembly_plant': self._extract_plant(vin) or 'Unknown',
            'horsepower': horsepower,
            'data_source': 'nhtsa',
            'data_confidence': 0.7
        }
    
    def _extract_series(self, model_name):
        """Extract BMW series from model name"""
        if not model_name:
            return "Unknown"
        
        model_name = model_name.upper()
        if '3 SERIES' in model_name: return "3 Series"
        if '5 SERIES' in model_name: return "5 Series" 
        if '7 SERIES' in model_name: return "7 Series"
        if 'X3' in model_name: return "X3"
        if 'X5' in model_name: return "X5"
        if 'X7' in model_name: return "X7"
        if 'M3' in model_name: return "M3"
        if 'M5' in model_name: return "M5"
        
        return model_name
    
    def _extract_engine_code(self, results):
        """Extract BMW engine code"""
        engine = results.get('EngineModel')
        if engine and 'N' in engine:  # BMW engine codes start with N, B, S, etc.
            return engine
        return results.get('EngineConfiguration', 'Unknown')
    
    def _extract_plant(self, vin):
        """Extract assembly plant from VIN"""
        # 11th character of VIN indicates plant
        plant_codes = {
            'A': 'Ingolstadt, Germany',
            'B': 'Berlin, Germany',
            'C': 'Munich, Germany',
            'D': 'Dingolfing, Germany',
            'E': 'Regensburg, Germany',
            'F': 'Spartanburg, USA',
            'G': 'Graz, Austria',
            'H': 'Oxford, UK',
        }
        return plant_codes.get(vin[10], 'Unknown')
    
    def _prepare_response(self, data, user):
        """Prepare response based on user status"""
        if not user or not user.premium_status:
            # Free tier - limited data
            return Response({
                'vin': data['vin'],
                'model': data['model'],
                'model_year': data['model_year'],
                'series': data['series'],
                'engine_code': data['engine_code'],
                'is_premium': False
            })
        else:
            # Premium - full data
            data['is_premium'] = True
            return Response(data)

# ===== PAYMENT VIEWS =====
# ===== PAYSTACK PAYMENT VIEWS =====
class PaymentViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def create(self, request):
        vin = request.data.get('vin')
        plan_id = request.data.get('plan_id', 'premium')
        
        # Set amount based on plan (in KES)
        plan_prices = {
            'basic': 500,      # 500 KES
            'premium': 1500,   # 1500 KES
            'pro': 3000        # 3000 KES
        }
        
        amount = plan_prices.get(plan_id, 1500)
        
        try:
            paystack = PaystackPayment()
            
            # Create unique reference
            import uuid
            reference = f"bvin_{uuid.uuid4().hex[:10]}"
            
            # Initialize Paystack payment
            payment_data = paystack.initialize_payment(
                email=request.user.email,
                amount=amount * 100,  # Convert to kobo
                reference=reference,
                callback_url=f"{settings.FRONTEND_URL}/payment/verify?success=true",
                metadata={
                    'user_id': str(request.user.id),
                    'plan_id': plan_id,
                    'vin': vin,
                    'product': 'Premium VIN Report'
                }
            )
            
            # Save transaction to database
            PaymentTransaction.objects.create(
                user=request.user,
                payment_reference=reference,
                amount=amount,
                currency='KES',
                status='pending',
                payment_gateway='paystack',
                vin=vin
            )
            
            return Response({
                'authorization_url': payment_data['data']['authorization_url'],
                'reference': reference,
                'amount': amount,
                'currency': 'KES'
            })
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

               # ===== PAYSTACK WEBHOOK VIEW =====
class PaystackWebhookViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    
    def create(self, request):
        try:
            from .paystack_handler import PaystackPayment
            
            paystack = PaystackPayment()
            
            # Verify webhook signature
            signature = request.headers.get('x-paystack-signature', '')
            if not paystack.verify_webhook_signature(request.body, signature):
                return Response({'error': 'Invalid signature'}, status=400)
            
            # Process the webhook event
            event_data = request.data
            result = paystack.handle_webhook_event(event_data)
            
            if result:
                if result['action'] == 'payment_success':
                    self._handle_payment_success(result)
                elif result['action'] == 'payment_failed':
                    self._handle_payment_failure(result)
            
            return Response({'status': 'success', 'processed': True})
            
        except Exception as e:
            print(f"Webhook error: {str(e)}")
            return Response({'error': str(e)}, status=400)
    
    def _handle_payment_success(self, data):
        """Handle successful payment from webhook"""
        reference = data['reference']
        amount = data['amount']
        metadata = data['metadata']
        
        try:
            # Find the transaction
            transaction = PaymentTransaction.objects.get(
                payment_reference=reference,
                status='pending'
            )
            
            # Verify payment with Paystack API (double-check)
            from .paystack_handler import PaystackPayment
            paystack = PaystackPayment()
            verification = paystack.verify_payment(reference)
            
            if verification['status'] and verification['data']['status'] == 'success':
                # Update transaction
                transaction.status = 'completed'
                transaction.amount = amount
                transaction.payment_gateway_data = verification['data']
                transaction.completed_at = timezone.now()
                transaction.save()
                
                # Upgrade user to premium
                user = transaction.user
                user.premium_status = True
                user.premium_since = timezone.now()
                user.save()
                
                print(f"Payment successful for user: {user.email}, Amount: {amount} KES")
                
        except PaymentTransaction.DoesNotExist:
            print(f"Transaction not found for reference: {reference}")
            # You might want to create a transaction here if it doesn't exist
        except Exception as e:
            print(f"Error processing payment: {str(e)}")
    
    def _handle_payment_failure(self, data):
        """Handle failed payment"""
        reference = data['reference']
        
        try:
            transaction = PaymentTransaction.objects.get(
                payment_reference=reference,
                status='pending'
            )
            
            transaction.status = 'failed'
            transaction.completed_at = timezone.now()
            transaction.save()
            
            print(f"Payment failed for reference: {reference}")
            
        except PaymentTransaction.DoesNotExist:
            print(f"Transaction not found for failed payment: {reference}")
                               
# ===== STRIPE WEBHOOK VIEW =====
class StripeWebhookViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    
    def create(self, request):
        payload = request.body
        sig_header = request.META['HTTP_STRIPE_SIGNATURE']
        
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET)
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

# ===== PAYSTACK WEBHOOK VIEW =====
# ===== PAYSTACK WEBHOOK VIEW =====
class PaystackWebhookViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    
    def create(self, request):
        from .paystack_handler import PaystackPayment
        
        try:
            paystack = PaystackPayment()
            
            # Verify webhook signature
            signature = request.headers.get('x-paystack-signature', '')
            if not paystack.verify_webhook_signature(request.body, signature):
                return Response({'error': 'Invalid signature'}, status=400)
            
            # Process the webhook event
            event_data = request.data
            result = paystack.handle_webhook_event(event_data)
            
            if result:
                # Handle based on action type
                if result['action'] == 'payment_success':
                    self._handle_payment_success(result)
                elif result['action'] == 'payment_failed':
                    self._handle_payment_failure(result)
                elif result['action'] == 'refund_processed':
                    self._handle_refund(result)
            
            return Response({'status': 'success', 'processed': True})
            
        except Exception as e:
            print(f"Webhook error: {str(e)}")
            return Response({'error': str(e)}, status=400)
    
    def _handle_payment_success(self, data):
        """Handle successful payment from webhook"""
        reference = data['reference']
        
        try:
            transaction = PaymentTransaction.objects.get(
                payment_reference=reference,
                status='pending'
            )
            
            # Verify payment with Paystack API (double-check)
            paystack = PaystackPayment()
            verification = paystack.verify_payment(reference)
            
            if verification['status'] and verification['data']['status'] == 'success':
                # Update transaction
                transaction.status = 'completed'
                transaction.payment_gateway_data = verification['data']
                transaction.completed_at = timezone.now()
                transaction.save()
                
                # Upgrade user
                user = transaction.user
                user.premium_status = True
                user.premium_since = timezone.now()
                user.save()
                
                print(f"Payment successful for user: {user.email}")
                
        except PaymentTransaction.DoesNotExist:
            print(f"Transaction not found for reference: {reference}")
        except Exception as e:
            print(f"Error processing payment: {str(e)}")
