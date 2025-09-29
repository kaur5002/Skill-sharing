// lib/api.ts
import axios from 'axios';
import { LoginRequest, SignupRequest, AuthResponse } from '@/types/user';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', data);
    return response.data;
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/signup', data);
    return response.data;
  },
};

export default api;