import requests
from django.conf import settings
import json
import hashlib
import hmac

class PaystackPayment:
    def __init__(self):
        self.secret_key = settings.PAYSTACK_SECRET_KEY
        self.public_key = settings.PAYSTACK_PUBLIC_KEY
        self.base_url = "https://api.paystack.co"
    
    def verify_webhook_signature(self, payload, signature):
        """Verify Paystack webhook signature"""
        if not settings.PAYSTACK_WEBHOOK_SECRET:
            raise Exception("Webhook secret not configured")
        
        computed_signature = hmac.new(
            settings.PAYSTACK_WEBHOOK_SECRET.encode('utf-8'),
            payload,
            digestmod=hashlib.sha512
        ).hexdigest()
        
        return hmac.compare_digest(computed_signature, signature)
    
    def handle_webhook_event(self, event_data):
        """Handle webhook events"""
        event_type = event_data.get('event')
        data = event_data.get('data', {})
        
        handlers = {
            'charge.success': self._handle_successful_charge,
            'charge.failure': self._handle_failed_charge,
            'refund.processed': self._handle_refund,
            'transfer.success': self._handle_transfer_success,
        }
        
        handler = handlers.get(event_type)
        if handler:
            return handler(data)
        else:
            print(f"Unhandled event type: {event_type}")
            return None
    
    def _handle_successful_charge(self, data):
        """Handle successful payment"""
        return {
            'action': 'payment_success',
            'reference': data.get('reference'),
            'amount': data.get('amount'),
            'customer_email': data.get('customer', {}).get('email'),
            'metadata': data.get('metadata', {})
        }
    
    def _handle_failed_charge(self, data):
        """Handle failed payment"""
        return {
            'action': 'payment_failed',
            'reference': data.get('reference'),
            'reason': data.get('gateway_response'),
            'customer_email': data.get('customer', {}).get('email')
        }
    
    def _handle_refund(self, data):
        """Handle refund"""
        return {
            'action': 'refund_processed',
            'reference': data.get('reference'),
            'amount': data.get('amount'),
            'reason': data.get('reason')
        }
