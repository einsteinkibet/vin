import axios from 'axios';

// Base API URL - change this in production
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Update the response interceptor to handle retries
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    
    if (!config || !config.retryCount) {
      config.retryCount = 0;
    }
    
    // Retry on network errors or 5xx server errors
    if (config.retryCount < MAX_RETRIES && 
        (!response || (response.status >= 500 && response.status <= 599))) {
      
      config.retryCount += 1;
      await delay(RETRY_DELAY * config.retryCount);
      
      return api(config);
    }
    
    if (response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);
// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  logout: () => api.post('/auth/logout/'),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.put('/user/profile/update/', data),
  exportData: () => api.get('/user/export-data/'),
};

// VIN API endpoints
export const vinAPI = {
  decode: (vin) => api.post('/vin/decode/', { vin }),
  getVehicle: (vin) => api.get(`/vehicles/${vin}/`),
  searchVehicles: (query) => api.get('/vehicles/search/', { params: { q: query } }),
  getVehicleOptions: (vin) => api.get(`/vehicles/${vin}/options/`),
};

// Payment API endpoints
export const paymentAPI = {
  createSession: (vin, planId) => api.post('/payment/create/', { vin, plan_id: planId }),
};

// User API endpoints
export const userAPI = {
  getUsers: () => api.get('/users/'),
  getUser: (id) => api.get(`/users/${id}/`),
  updateUser: (id, data) => api.put(`/users/${id}/`, data),
};

// Content API endpoints
export const contentAPI = {
  getPages: () => api.get('/content/'),
  getPage: (slug) => api.get(`/content/${slug}/`),
};

// Affiliate API endpoints
export const affiliateAPI = {
  getProducts: () => api.get('/affiliate/'),
  trackClick: (productId) => api.post(`/affiliate/${productId}/click/`),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health/'),
};

// Utility functions
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Dashboard API endpoints
export const dashboardAPI = {
  getSavedVehicles: () => api.get('/dashboard/saved-vehicles/'),
  getUsageStats: () => api.get('/dashboard/usage-stats/'),
  getVINHistory: () => api.get('/dashboard/vin-history/'),
};


// Add vehicle history endpoint
export const vehicleHistoryAPI = {
  getHistory: (vin) => api.get(`/vehicles/${vin}/history/`),
  getAccidents: (vin) => api.get(`/vehicles/${vin}/accidents/`),
  getOwners: (vin) => api.get(`/vehicles/${vin}/owners/`),
  getServices: (vin) => api.get(`/vehicles/${vin}/services/`),
  getRecalls: (vin) => api.get(`/vehicles/${vin}/recalls/`),
};

export const analyticsAPI = {
  getLookupStats: (days = 30) => api.get(`/analytics/lookups/?days=${days}`),
  getUserGrowth: (days = 90) => api.get(`/analytics/users/?days=${days}`),
  getRevenueStats: (days = 30) => api.get(`/analytics/revenue/?days=${days}`),
};

export const webhookAPI = {
  testStripe: () => api.post('/webhook/test/stripe/'),
  testPaystack: () => api.post('/webhook/test/paystack/'),
};

export default api;