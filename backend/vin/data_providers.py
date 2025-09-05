import requests
from django.conf import settings
import redis
from django.core.cache import cache
import json
 
class VehicleHistoryAPI:
    def __init__(self):
        self.providers = {
            'carfax': self._fetch_carfax,
            'autocheck': self._fetch_autocheck,
            'nhtsa': self._fetch_nhtsa_recalls,
        }
    
    def get_complete_history(self, vin):
        """Get complete vehicle history from multiple sources"""
        history_data = {
            'accidents': [],
            'owners': [],
            'services': [],
            'recalls': [],
            'titles': []
        }
        
        # Fetch from all available providers
        for provider_name, provider_func in self.providers.items():
            try:
                provider_data = provider_func(vin)
                history_data = self._merge_history_data(history_data, provider_data)
            except Exception as e:
                print(f"Error fetching from {provider_name}: {str(e)}")
        
        return history_data
    
    def _fetch_carfax(self, vin):
        """Fetch data from CarFax API"""
        # Implement CarFax integration
        pass
    
    def _fetch_autocheck(self, vin):
        """Fetch data from AutoCheck API"""
        # Implement AutoCheck integration
        pass
    
    def _fetch_nhtsa_recalls(self, vin):
        """Fetch recall data from NHTSA"""
        url = f"https://api.nhtsa.gov/recalls/recallsByVIN?vin={vin}"
        response = requests.get(url)
        response.raise_for_status()
        return response.json()

# Initialize Redis if available
try:
    redis_client = redis.Redis(
        host=settings.REDIS_HOST, 
        port=settings.REDIS_PORT, 
        db=0
    )
except:
    redis_client = None

class DataProvider:
    def __init__(self):
        self.cache_timeout = 3600  # 1 hour cache
    
    def get_vehicle_history(self, vin, force_refresh=False):
        """Get vehicle history with caching"""
        cache_key = f'vehicle_history_{vin}'
        
        # Try to get from cache first
        if not force_refresh:
            cached_data = self._get_from_cache(cache_key)
            if cached_data:
                return cached_data
        
        # Fetch from data providers
        history_data = self._fetch_from_providers(vin)
        
        # Cache the results
        self._set_cache(cache_key, history_data)
        
        return history_data
    
    def _fetch_from_providers(self, vin):
        """Fetch data from multiple providers"""
        history_data = {
            'accidents': [],
            'owners': [],
            'services': [],
            'recalls': self._fetch_nhtsa_recalls(vin),
            'market_value': self._fetch_market_value(vin)
        }
        
        # Try CarFax if API key available
        if hasattr(settings, 'CARFAX_API_KEY'):
            history_data.update(self._fetch_carfax(vin))
        
        # Try AutoCheck if API key available  
        if hasattr(settings, 'AUTOCHECK_API_KEY'):
            history_data.update(self._fetch_autocheck(vin))
            
        return history_data
    
    def _fetch_nhtsa_recalls(self, vin):
        """Fetch recalls from NHTSA (free)"""
        try:
            url = f"https://api.nhtsa.gov/recalls/recallsByVIN?vin={vin}"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return response.json().get('results', [])
        except:
            return []
    
    def _fetch_market_value(self, vin):
        """Fetch market value from Kelley Blue Book or similar"""
        # This would be a paid API integration
        return None
    
    def _get_from_cache(self, key):
        """Get data from cache"""
        try:
            if redis_client:
                cached = redis_client.get(key)
                if cached:
                    return json.loads(cached)
            else:
                return cache.get(key)
        except:
            return None
    
    def _set_cache(self, key, data):
        """Set data in cache"""
        try:
            if redis_client:
                redis_client.setex(key, self.cache_timeout, json.dumps(data))
            else:
                cache.set(key, data, self.cache_timeout)
        except:
            pass

# Singleton instance
data_provider = DataProvider()



import requests
import redis
from django.conf import settings
from django.core.cache import cache
import json
from .models import VehicleAccident, OwnershipHistory, ServiceHistory, RecallInformation

class DataProvider:
    def __init__(self):
        self.redis_client = redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            db=0,
            decode_responses=True
        )
    
    def get_vehicle_history(self, vin, force_refresh=False):
        """Get complete vehicle history with caching"""
        cache_key = f"vehicle_history:{vin}"
        
        # Try to get from cache first
        if not force_refresh:
            cached_data = self.redis_client.get(cache_key)
            if cached_data:
                return json.loads(cached_data)
        
        # Fetch from all data providers
        history_data = {
            'accidents': self.get_accidents(vin),
            'owners': self.get_ownership(vin),
            'services': self.get_service_history(vin),
            'recalls': self.get_recalls(vin),
            'market_value': self.get_market_value(vin)
        }
        
        # Cache for 24 hours
        self.redis_client.setex(cache_key, 86400, json.dumps(history_data))
        
        return history_data
    
    def get_accidents(self, vin):
        """Get accident history from multiple sources"""
        accidents = []
        
        # Try CarFax API
        try:
            carfax_data = self._fetch_carfax(vin)
            accidents.extend(self._parse_carfax_accidents(carfax_data))
        except Exception as e:
            print(f"CarFax error: {str(e)}")
        
        # Try AutoCheck API
        try:
            autocheck_data = self._fetch_autocheck(vin)
            accidents.extend(self._parse_autocheck_accidents(autocheck_data))
        except Exception as e:
            print(f"AutoCheck error: {str(e)}")
        
        return accidents
    
    def _fetch_carfax(self, vin):
        """Fetch data from CarFax API"""
        # Implement CarFax integration
        # You'll need CarFax API credentials
        pass
    
    def _fetch_autocheck(self, vin):
        """Fetch data from AutoCheck API"""
        # Implement AutoCheck integration
        # You'll need AutoCheck API credentials
        pass
    
    def get_recalls(self, vin):
        """Get recall data from NHTSA"""
        try:
            url = f"https://api.nhtsa.gov/recalls/recallsByVIN?vin={vin}"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return response.json().get('results', [])
        except Exception as e:
            print(f"NHTSA recall error: {str(e)}")
            return []
