import axios from 'axios';

// Base API instances for different microservices
export const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8000/auth',
  headers: { 'Content-Type': 'application/json' },
});

export const rolesApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ROLES_API_URL || 'http://localhost:8001',
  headers: { 'Content-Type': 'application/json' },
});

export const fieldsApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FIELDS_API_URL || 'http://localhost:8002/fields',
  headers: { 'Content-Type': 'application/json' },
});

export const reservationsApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_RESERVATIONS_API_URL || 'http://localhost:8003/reservations',
  headers: { 'Content-Type': 'application/json' },
});

export const adminApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:8004/dashboard',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor to add JWT token
const authInterceptor = (config: any) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
};

const setupInterceptors = (instance: typeof axios) => {
  instance.interceptors.request.use(authInterceptor, (error) => Promise.reject(error));
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle unauthorized explicitly
      if (error.response?.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // trigger global logout event or something handled by store
        window.dispatchEvent(new Event('auth-expired'));
      }
      return Promise.reject(error);
    }
  );
};

// @ts-ignore
[authApi, rolesApi, fieldsApi, reservationsApi, adminApi].forEach(setupInterceptors);
