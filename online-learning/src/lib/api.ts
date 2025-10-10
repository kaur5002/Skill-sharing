// lib/api.ts
import { LoginRequest, SignupRequest, AuthResponse } from '@/types/user';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        // If response is not JSON (like HTML error page), provide a meaningful error
        throw new Error('Server error: Unable to process request. Please try again.');
      }
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }
      
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection and try again.');
    }
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        // If response is not JSON (like HTML error page), provide a meaningful error
        throw new Error('Server error: Unable to process request. Please check if the database is connected.');
      }
      
      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }
      
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection and try again.');
    }
  },
};