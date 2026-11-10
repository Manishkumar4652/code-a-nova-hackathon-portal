import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Bearer Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('codeanova_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/signup')
    ) {
      localStorage.removeItem('codeanova_token');
    }
    return Promise.reject(error);
  }
);

// Authentication API methods
export const authService = {
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },
  verifyOTP: async (verifyData) => {
    const response = await api.post('/auth/verify-otp', verifyData);
    return response.data;
  },
  resendOTP: async (email) => {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/user/me');
    return response.data;
  },
};

// Hackathon Registration API methods
export const hackathonService = {
  register: async (registrationData) => {
    const response = await api.post('/hackathon/register', registrationData);
    return response.data;
  },
  getMyEntry: async () => {
    const response = await api.get('/hackathon/my-entry');
    return response.data;
  },
};

// Contact Form API methods
export const contactService = {
  submitInquiry: async (inquiryData) => {
    const response = await api.post('/contact', inquiryData);
    return response.data;
  },
};

export default api;
