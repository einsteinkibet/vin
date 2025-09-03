import axios from 'axios';

// Base API URL - change this in production
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
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
  updateProfile: (data) => api.put('/auth/profile/', data),
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

export default api;