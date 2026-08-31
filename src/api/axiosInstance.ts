// src/api/axiosInstance.ts
import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response interceptor — no blocking dialogs/alerts
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const status = error.response?.status;
    const currentPath = window.location.pathname;

    if (status === 401) {
      // Clear stale auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Only redirect to login if not already there
      if (currentPath !== '/login' && currentPath !== '/signup') {
        window.location.href = '/login';
      }
    } else if (status === 403) {
      console.warn('Access forbidden:', error.response?.data?.message || 'No permission');
    } else if (status === 500) {
      console.error('Server error:', error.response?.data?.message || 'Internal server error');
    } else if (!error.response) {
      console.error('Network error — server may be unreachable');
    }

    return Promise.reject(error);
  }
);

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export default axiosInstance;