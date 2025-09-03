from rest_framework import serializers
from django.contrib.auth import authenticate
from django.utils import timezone
from .models import *

# ===== AUTH SERIALIZERS =====
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'marketing_consent']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            marketing_consent=validated_data.get('marketing_consent', False)
        )
        return user

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        if not user.is_active:
            raise serializers.ValidationError("Account is disabled")
        return user

class UserSerializer(serializers.ModelSerializer):
    subscription_status = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'premium_status', 'premium_since', 'date_joined',
            'subscription_status', 'marketing_consent'
        ]
        read_only_fields = ['id', 'date_joined', 'premium_status', 'premium_since']
    
    def get_subscription_status(self, obj):
        if hasattr(obj, 'subscription'):
            return obj.subscription.status
        return 'inactive'

# ===== VEHICLE SERIALIZERS =====
class VehicleOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleOption
        fields = [
            'option_code', 'name', 'description', 'option_type',
            'category', 'msrp_price', 'popularity_score', 'retrofit_cost_estimate'
        ]

class BMWVehicleSerializer(serializers.ModelSerializer):
    options = VehicleOptionSerializer(many=True, read_only=True)
    is_premium = serializers.SerializerMethodField()
    
    class Meta:
        model = BMWVehicle
        fields = [
            'vin', 'model', 'model_year', 'production_date', 'series',
            'body_type', 'engine_code', 'transmission_type', 'drive_type',
            'fuel_type', 'assembly_plant', 'base_price', 'horsepower',
            'torque', 'top_speed', 'acceleration_0_60', 'data_source',
            'data_updated', 'data_confidence', 'options', 'is_premium'
        ]
    
    def get_is_premium(self, obj):
        request = self.context.get('request')
        return request and request.user.is_authenticated and request.user.premium_status

class OptionCompatibilitySerializer(serializers.ModelSerializer):
    option = VehicleOptionSerializer(read_only=True)
    vehicle_vin = serializers.CharField(source='vehicle.vin', read_only=True)
    
    class Meta:
        model = OptionCompatibility
        fields = ['id', 'vehicle_vin', 'option', 'is_standard']

# ===== MONETIZATION SERIALIZERS =====
class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = [
            'id', 'name', 'tier', 'monthly_price', 'yearly_price',
            'features', 'max_vin_checks_per_month', 'active'
        ]

class UserSubscriptionSerializer(serializers.ModelSerializer):
    plan_name = serializers.CharField(source='plan.name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = UserSubscription
        fields = [
            'id', 'user', 'user_email', 'plan', 'plan_name', 'status',
            'current_period_start', 'current_period_end',
            'cancel_at_period_end', 'stripe_subscription_id',
            'vin_checks_this_month', 'last_reset_date'
        ]

class PaymentTransactionSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = PaymentTransaction
        fields = [
            'id', 'user', 'user_email', 'stripe_session_id',
            'stripe_payment_intent_id', 'amount', 'currency',
            'status', 'created_at', 'completed_at', 'vin'
        ]
        read_only_fields = ['id', 'created_at', 'completed_at']

class AffiliateProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = AffiliateProduct
        fields = [
            'id', 'name', 'description', 'affiliate_url', 'merchant',
            'commission_rate', 'category', 'active'
        ]

class AffiliateClickSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True, allow_null=True)
    
    class Meta:
        model = AffiliateClick
        fields = [
            'id', 'user', 'user_email', 'product', 'product_name',
            'click_date', 'ip_address', 'converted', 'conversion_date'
        ]
        read_only_fields = ['id', 'click_date', 'conversion_date']

# ===== ANALYTICS SERIALIZERS =====
class VINLookupHistorySerializer(serializers.ModelSerializer):
    vehicle_model = serializers.CharField(source='vehicle.model', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True, allow_null=True)
    
    class Meta:
        model = VINLookupHistory
        fields = [
            'id', 'user', 'user_email', 'vehicle', 'vehicle_model',
            'lookup_date', 'was_premium', 'ip_address', 'country',
            'device_type', 'viewed_premium_offer', 'clicked_purchase_button'
        ]
        read_only_fields = ['id', 'lookup_date']

class UserEventSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True, allow_null=True)
    
    class Meta:
        model = UserEvent
        fields = [
            'id', 'user', 'user_email', 'session_id', 'event_type',
            'event_name', 'event_data', 'timestamp', 'url', 'ip_address'
        ]
        read_only_fields = ['id', 'timestamp']

class DataQualityIssueSerializer(serializers.ModelSerializer):
    vehicle_vin = serializers.CharField(source='vehicle.vin', read_only=True, allow_null=True)
    option_code = serializers.CharField(source='option.option_code', read_only=True, allow_null=True)
    
    class Meta:
        model = DataQualityIssue
        fields = [
            'id', 'vehicle', 'vehicle_vin', 'option', 'option_code',
            'issue_type', 'description', 'severity', 'detected_date',
            'resolved', 'resolved_date'
        ]
        read_only_fields = ['id', 'detected_date', 'resolved_date']

# ===== API MANAGEMENT SERIALIZERS =====
class APIKeySerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = APIKey
        fields = ['id', 'key', 'user', 'user_email', 'name', 'requests_per_day', 'active', 'created_date']
        read_only_fields = ['id', 'key', 'created_date']
    
    def create(self, validated_data):
        # Generate a random API key (you might want to use a better method)
        import secrets
        validated_data['key'] = f"bv_{secrets.token_urlsafe(32)}"
        return super().create(validated_data)

class APIRequestLogSerializer(serializers.ModelSerializer):
    api_key_name = serializers.CharField(source='api_key.name', read_only=True)
    
    class Meta:
        model = APIRequestLog
        fields = ['id', 'api_key', 'api_key_name', 'endpoint', 'timestamp', 'response_time', 'status_code']
        read_only_fields = ['id', 'timestamp']

# ===== CONTENT SERIALIZERS =====
class ContentPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentPage
        fields = ['id', 'slug', 'title', 'content', 'meta_description', 'published', 'published_date', 'last_updated']
        read_only_fields = ['id', 'published_date', 'last_updated']

# ===== SPECIALIZED SERIALIZERS =====
class VINDecodeRequestSerializer(serializers.Serializer):
    vin = serializers.CharField(max_length=17, min_length=17)
    
    def validate_vin(self, value):
        value = value.upper().strip()
        if not value.isalnum():
            raise serializers.ValidationError("VIN must contain only letters and numbers")
        return value

class PaymentRequestSerializer(serializers.Serializer):
    vin = serializers.CharField(max_length=17, min_length=17)
    plan_id = serializers.IntegerField(required=False)
    
    def validate_vin(self, value):
        value = value.upper().strip()
        if not value.isalnum():
            raise serializers.ValidationError("VIN must contain only letters and numbers")
        return value

class StripeWebhookSerializer(serializers.Serializer):
    id = serializers.CharField()
    type = serializers.CharField()
    data = serializers.JSONField()
    created = serializers.IntegerField()

# ===== DASHBOARD SERIALIZERS =====
class DashboardStatsSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    total_vehicles = serializers.IntegerField()
    total_lookups = serializers.IntegerField()
    premium_users = serializers.IntegerField()
    revenue_today = serializers.DecimalField(max_digits=10, decimal_places=2)
    revenue_month = serializers.DecimalField(max_digits=10, decimal_places=2)

class LookupTrendSerializer(serializers.Serializer):
    date = serializers.DateField()
    count = serializers.IntegerField()
    premium_count = serializers.IntegerField()

# ===== VALIDATION SERIALIZERS =====
class EmailValidationSerializer(serializers.Serializer):
    email = serializers.EmailField()

class UsernameValidationSerializer(serializers.Serializer):
    username = serializers.CharField(min_length=3, max_length=150)

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=8)
    new_password_confirm = serializers.CharField(min_length=8)
    
    def validate(self, data):
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return data