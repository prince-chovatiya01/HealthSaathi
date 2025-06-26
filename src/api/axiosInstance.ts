// src/api/axiosInstance.ts
import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Attach token to every request
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

// ✅ Global response interceptor for errors with better handling
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const status = error.response?.status;
    const currentPath = window.location.pathname;

    if (status === 401) {
      // Only auto-logout for critical authentication endpoints
      const criticalEndpoints = ['/auth/verify', '/auth/refresh', '/profile'];
      const requestUrl = error.config?.url || '';
      
      // Check if this is a critical auth failure or user is on login page
      const isCriticalAuth = criticalEndpoints.some(endpoint => requestUrl.includes(endpoint));
      const isOnLoginPage = currentPath === '/login';
      
      if (isCriticalAuth || isOnLoginPage) {
        // Clear token and redirect immediately for critical auth failures
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (!isOnLoginPage) {
          window.location.href = '/login';
        }
      } else {
        // For non-critical endpoints, just clear token but let component handle the error
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Add a small delay to prevent immediate redirect, giving components time to handle errors
        setTimeout(() => {
          if (window.location.pathname !== '/login') {
            // Show a notification instead of immediate redirect
            const shouldRedirect = confirm(
              'Your session has expired. Would you like to log in again?'
            );
            if (shouldRedirect) {
              window.location.href = '/login';
            }
          }
        }, 100);
      }
    } else if (status === 403) {
      // Forbidden - show user-friendly message
      console.warn('Access forbidden. You may not have permission for this action.');
    } else if (status === 500) {
      alert('Server error. Please try again later.');
    } else if (status >= 400 && status < 500) {
      // Other client errors - let the component handle them
      console.warn(`Client error ${status}:`, error.response?.data?.message || 'Request failed');
    } else if (!error.response) {
      // Network errors
      console.error('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  }
);

// ✅ Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

// ✅ Helper function to manually logout
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// ✅ Helper function to handle auth errors gracefully
export const handleAuthError = (error: any, fallbackAction?: () => void): void => {
  if (error.response?.status === 401) {
    const shouldRedirect = confirm(
      'Your session has expired. Would you like to log in again?'
    );
    if (shouldRedirect) {
      logout();
    } else if (fallbackAction) {
      fallbackAction();
    }
  }
};

export default axiosInstance;





// import axios from 'axios';

// const instance = axios.create({
//   baseURL: 'http://localhost:3000/api', // or your backend URL
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export default instance;
