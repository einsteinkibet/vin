from django.db import models

# Create your models here.
import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

# ===== USER MODEL =====
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    stripe_customer_id = models.CharField(max_length=255, blank=True, null=True)
    premium_status = models.BooleanField(default=False)
    premium_since = models.DateTimeField(blank=True, null=True)
    email_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=100, blank=True, null=True)
    signup_source = models.CharField(max_length=100, blank=True, null=True)
    marketing_consent = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'auth_user'

# ===== CORE VEHICLE MODELS =====
class BMWVehicle(models.Model):
    vin = models.CharField(max_length=17, unique=True, primary_key=True)
    model = models.CharField(max_length=100)
    model_year = models.IntegerField()
    production_date = models.DateField(null=True, blank=True)
    series = models.CharField(max_length=50)
    body_type = models.CharField(max_length=50)
    engine_code = models.CharField(max_length=50)
    transmission_type = models.CharField(max_length=50)
    drive_type = models.CharField(max_length=20)
    fuel_type = models.CharField(max_length=30)
    assembly_plant = models.CharField(max_length=50, blank=True, null=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    horsepower = models.IntegerField(null=True, blank=True)
    torque = models.IntegerField(null=True, blank=True)
    top_speed = models.IntegerField(null=True, blank=True)
    acceleration_0_60 = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    data_source = models.CharField(max_length=100, default='scraper')
    data_updated = models.DateTimeField(auto_now=True)
    data_confidence = models.DecimalField(max_digits=3, decimal_places=2, default=1.0)
    
    class Meta:
        db_table = 'bmw_vehicles'
        indexes = [
            models.Index(fields=['model']),
            models.Index(fields=['model_year']),
            models.Index(fields=['series']),
            models.Index(fields=['production_date']),
        ]

class VehicleOption(models.Model):
    OPTION_TYPE_CHOICES = [
        ('standard', 'Standard Equipment'),
        ('optional', 'Optional Equipment'),
        ('package', 'Package'),
        ('individual', 'Individual Option'),
        ('dealer', 'Dealer Installed'),
        ('retrofit', 'Retrofit Possible'),
    ]
    
    option_code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    option_type = models.CharField(max_length=20, choices=OPTION_TYPE_CHOICES)
    category = models.CharField(max_length=100)
    msrp_price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    popularity_score = models.DecimalField(max_digits=3, decimal_places=2, default=0.5)
    retrofit_cost_estimate = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    
    class Meta:
        db_table = 'vehicle_options'

class OptionCompatibility(models.Model):
    vehicle = models.ForeignKey(BMWVehicle, on_delete=models.CASCADE)
    option = models.ForeignKey(VehicleOption, on_delete=models.CASCADE)
    is_standard = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'option_compatibility'
        unique_together = ['vehicle', 'option']

# ===== MONETIZATION MODELS =====
class SubscriptionPlan(models.Model):
    PLAN_TIERS = [
        ('basic', 'Basic'),
        ('premium', 'Premium'),
        ('professional', 'Professional'),
    ]
    
    name = models.CharField(max_length=100)
    tier = models.CharField(max_length=20, choices=PLAN_TIERS, unique=True)
    stripe_price_id = models.CharField(max_length=255)
    monthly_price = models.DecimalField(max_digits=6, decimal_places=2)
    yearly_price = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    features = models.JSONField()
    max_vin_checks_per_month = models.IntegerField(null=True, blank=True)
    active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'subscription_plans'

class UserSubscription(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('past_due', 'Past Due'),
        ('canceled', 'Canceled'),
        ('incomplete', 'Incomplete'),
        ('incomplete_expired', 'Incomplete Expired'),
        ('trialing', 'Trialing'),
        ('unpaid', 'Unpaid'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='subscription')
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.PROTECT)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='incomplete')
    current_period_start = models.DateTimeField()
    current_period_end = models.DateTimeField()
    cancel_at_period_end = models.BooleanField(default=False)
    stripe_subscription_id = models.CharField(max_length=255, unique=True)
    vin_checks_this_month = models.IntegerField(default=0)
    last_reset_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_subscriptions'

class PaymentTransaction(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    stripe_session_id = models.CharField(max_length=255, unique=True)
    stripe_payment_intent_id = models.CharField(max_length=255, null=True, blank=True)
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    vin = models.CharField(max_length=17)
    
    class Meta:
        db_table = 'payment_transactions'
        indexes = [
            models.Index(fields=['stripe_session_id']),
            models.Index(fields=['user', 'created_at']),
        ]

class AffiliateProduct(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    affiliate_url = models.URLField()
    merchant = models.CharField(max_length=100)
    commission_rate = models.DecimalField(max_digits=4, decimal_places=2)
    category = models.CharField(max_length=100)
    active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'affiliate_products'

class AffiliateClick(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    product = models.ForeignKey(AffiliateProduct, on_delete=models.CASCADE)
    click_date = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField()
    converted = models.BooleanField(default=False)
    conversion_date = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'affiliate_clicks'

# ===== ANALYTICS & TRACKING MODELS =====
class VINLookupHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lookups', null=True, blank=True)
    vehicle = models.ForeignKey(BMWVehicle, on_delete=models.CASCADE)
    lookup_date = models.DateTimeField(auto_now_add=True)
    was_premium = models.BooleanField(default=False)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    device_type = models.CharField(max_length=50, blank=True, null=True)
    viewed_premium_offer = models.BooleanField(default=False)
    clicked_purchase_button = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'vin_lookup_history'
        indexes = [
            models.Index(fields=['lookup_date']),
            models.Index(fields=['user', 'lookup_date']),
            models.Index(fields=['country']),
            models.Index(fields=['device_type']),
        ]

class UserEvent(models.Model):
    EVENT_TYPES = [
        ('page_view', 'Page View'),
        ('button_click', 'Button Click'),
        ('form_submit', 'Form Submit'),
        ('error', 'Error'),
        ('search', 'Search'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    session_id = models.CharField(max_length=100)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES)
    event_name = models.CharField(max_length=200)
    event_data = models.JSONField()
    timestamp = models.DateTimeField(auto_now_add=True)
    url = models.URLField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    
    class Meta:
        db_table = 'user_events'
        indexes = [
            models.Index(fields=['timestamp']),
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['event_type', 'timestamp']),
        ]

class DataQualityIssue(models.Model):
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    vehicle = models.ForeignKey(BMWVehicle, on_delete=models.CASCADE, null=True, blank=True)
    option = models.ForeignKey(VehicleOption, on_delete=models.CASCADE, null=True, blank=True)
    issue_type = models.CharField(max_length=100)
    description = models.TextField()
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    detected_date = models.DateTimeField(auto_now_add=True)
    resolved = models.BooleanField(default=False)
    resolved_date = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'data_quality_issues'

# ===== API MANAGEMENT MODELS =====
class APIKey(models.Model):
    key = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='api_keys')
    name = models.CharField(max_length=100)
    requests_per_day = models.IntegerField(default=100)
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'api_keys'

class APIRequestLog(models.Model):
    api_key = models.ForeignKey(APIKey, on_delete=models.CASCADE)
    endpoint = models.CharField(max_length=200)
    timestamp = models.DateTimeField(auto_now_add=True)
    response_time = models.DecimalField(max_digits=6, decimal_places=3)
    status_code = models.IntegerField()
    
    class Meta:
        db_table = 'api_request_logs'

# ===== CONTENT MANAGEMENT =====
class ContentPage(models.Model):
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=200)
    content = models.TextField()
    meta_description = models.TextField()
    published = models.BooleanField(default=False)
    published_date = models.DateTimeField(null=True, blank=True)
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'content_pages'
