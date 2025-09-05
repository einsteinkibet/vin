import requests
import logging
from django.conf import settings
from django.core.cache import cache
from .models import BMWVehicle, VehicleOption, OptionCompatibility

logger = logging.getLogger(__name__)

class DataProviderBase:
    """Base class for all data providers"""
    
    def __init__(self):
        self.name = "base_provider"
        self.priority = 0
        self.cache_timeout = 86400  # 24 hours
    
    def get_vehicle_data(self, vin):
        """Get vehicle data from provider"""
        raise NotImplementedError("Subclasses must implement get_vehicle_data")
    
    def get_options_data(self, vin):
        """Get options data from provider"""
        raise NotImplementedError("Subclasses must implement get_options_data")
    
    def is_available(self):
        """Check if provider is available"""
        return True

class BMWAPIDataProvider(DataProviderBase):
    """BMW Official API Data Provider"""
    
    def __init__(self):
        super().__init__()
        self.name = "bmw_official_api"
        self.priority = 100
        self.base_url = getattr(settings, 'BMW_API_URL', 'https://b2b.bmwgroup.com/api/')
        self.api_key = getattr(settings, 'BMW_API_KEY', None)
    
    def is_available(self):
        return self.api_key is not None
    
    def get_vehicle_data(self, vin):
        cache_key = f'vehicle_{vin}_{self.name}'
        cached_data = cache.get(cache_key)
        if cached_data:
            return cached_data
        
        try:
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(
                f'{self.base_url}vehicles/{vin}',
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                cache.set(cache_key, data, self.cache_timeout)
                return data
                
        except requests.RequestException as e:
            logger.error(f"BMW API request failed: {e}")
        
        return None

class NHTSADataProvider:
    def __init__(self):
        self.name = "nhtsa_api"
        self.base_url = "https://vpic.nhtsa.dot.gov/api/vehicles"
    
    def get_vehicle_data(self, vin):
        cache_key = f'vehicle_{vin}_nhtsa'
        cached_data = cache.get(cache_key)
        if cached_data:
            return cached_data
        
        try:
            response = requests.get(
                f'{self.base_url}/decodevinvalues/{vin}?format=json',
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('Results'):
                    result = data['Results'][0]
                    # Normalize NHTSA data to our schema
                    normalized_data = {
                        'vin': result.get('VIN', ''),
                        'model': result.get('Model', ''),
                        'model_year': result.get('ModelYear', ''),
                        'series': result.get('Series', ''),
                        'body_type': result.get('BodyClass', ''),
                        'engine_code': result.get('EngineConfiguration', ''),
                        'transmission_type': result.get('TransmissionStyle', ''),
                        'drive_type': result.get('DriveType', ''),
                        'fuel_type': result.get('FuelTypePrimary', ''),
                        'manufacturer': result.get('Manufacturer', ''),
                        'plant_country': result.get('PlantCountry', ''),
                        'plant_company_name': result.get('PlantCompanyName', ''),
                        'plant_state': result.get('PlantState', ''),
                        'data_source': 'nhtsa',
                        'data_confidence': 0.85
                    }
                    cache.set(cache_key, normalized_data, 86400)  # 24 hours
                    return normalized_data
                    
        except requests.RequestException as e:
            print(f"NHTSA API request failed: {e}")
        
        return None

class CarfaxDataProvider(DataProviderBase):
    """Carfax Data Provider for History Reports"""
    
    def __init__(self):
        super().__init__()
        self.name = "carfax_api"
        self.priority = 80
        self.api_key = getattr(settings, 'CARFAX_API_KEY', None)
        self.base_url = getattr(settings, 'CARFAX_API_URL', 'https://api.carfax.com/v2/')
    
    def is_available(self):
        return self.api_key is not None
    
    def get_vehicle_history(self, vin):
        cache_key = f'history_{vin}_{self.name}'
        cached_data = cache.get(cache_key)
        if cached_data:
            return cached_data
        
        try:
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(
                f'{self.base_url}vehicles/{vin}/history',
                headers=headers,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                cache.set(cache_key, data, self.cache_timeout)
                return data
                
        except requests.RequestException as e:
            logger.error(f"Carfax API request failed: {e}")
        
        return None

class DataProviderManager:
    """Manager class to handle multiple data providers"""
    
    def __init__(self):
        self.providers = []
        self._register_providers()
    
    def _register_providers(self):
        # Register all available providers
        self.providers.append(BMWAPIDataProvider())
        self.providers.append(NHTSADataProvider())
        self.providers.append(CarfaxDataProvider())
        
        # Sort by priority (highest first)
        self.providers.sort(key=lambda x: x.priority, reverse=True)
    
    def get_vehicle_data(self, vin):
        """Get vehicle data from the best available provider"""
        for provider in self.providers:
            if provider.is_available():
                data = provider.get_vehicle_data(vin)
                if data:
                    return self._normalize_vehicle_data(data, provider.name)
        
        return None
    
    def get_vehicle_history(self, vin):
        """Get vehicle history data"""
        for provider in self.providers:
            if hasattr(provider, 'get_vehicle_history') and provider.is_available():
                data = provider.get_vehicle_history(vin)
                if data:
                    return data
        
        return None
    
    def _normalize_vehicle_data(self, data, provider_name):
        """Normalize data from different providers to our schema"""
        normalized = {}
        
        if provider_name == "bmw_official_api":
            normalized = {
                'vin': data.get('vin', ''),
                'model': data.get('modelDescription', ''),
                'model_year': data.get('modelYear', ''),
                'series': data.get('series', ''),
                'body_type': data.get('bodyType', ''),
                'engine_code': data.get('engineCode', ''),
                'transmission_type': data.get('transmissionType', ''),
                'drive_type': data.get('driveType', ''),
                'fuel_type': data.get('fuelType', ''),
                'assembly_plant': data.get('assemblyPlant', ''),
            }
        
        elif provider_name == "nhtsa_api":
            normalized = {
                'vin': data.get('VIN', ''),
                'model': data.get('Model', ''),
                'model_year': data.get('ModelYear', ''),
                'series': data.get('Series', ''),
                'body_type': data.get('BodyClass', ''),
                'engine_code': data.get('EngineConfiguration', ''),
                'transmission_type': data.get('TransmissionStyle', ''),
                'drive_type': data.get('DriveType', ''),
                'fuel_type': data.get('FuelTypePrimary', ''),
            }
        
        return normalized

# Global instance
data_provider_manager = DataProviderManager()