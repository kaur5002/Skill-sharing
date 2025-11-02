// types/user.ts
export interface User {
  _id?: string;
  email: string;
  password: string;
  name: string;
  role: 'tutor' | 'learner';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: 'tutor' | 'learner';
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  role: 'tutor' | 'learner';
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: Omit<User, 'password'>;
  token?: string;
}