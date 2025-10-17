// lib/http.ts
import axios from 'axios';

export const http = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as any)['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error?.response?.data?.message || error.message || 'Request failed';
    return Promise.reject(new Error(message));
  }
);

export default http;
