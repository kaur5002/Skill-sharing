// components/AuthForm.tsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, User, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { loginSchema, signupSchema, type LoginFormData, type SignupFormData } from '@/lib/validations';
import { authApi } from '@/lib/api';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onModeChange: () => void;
  onClose?: () => void;
}

function LoginForm({ onModeChange, onClose }: { onModeChange: () => void; onClose?: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(true);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: 'learner',
    },
  });

  const selectedRole = watch('role');

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (data.success) {
        localStorage.setItem('token', data.token!);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/firstPage');
      }
    },
    onError: (error: any) => {
      setShowError(true);
      console.error('Login failed:', error.message);
      
      // Handle specific error cases
      if (error.message?.includes('<!DOCTYPE') || error.message?.includes('Unexpected token')) {
        error.message = 'Server error occurred. Please check if the database is connected and try again.';
      } else if (error.message?.includes('Network Error') || error.message?.includes('fetch')) {
        error.message = 'Network error. Please check your internet connection and try again.';
      }
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setShowError(false);
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Role Selection */}
      <div className="space-y-2">
        <Label htmlFor="role">I want to sign in as</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={selectedRole === 'learner' ? 'default' : 'outline'}
            onClick={() => setValue('role', 'learner')}
            className="flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            Learner
          </Button>
          <Button
            type="button"
            variant={selectedRole === 'tutor' ? 'default' : 'outline'}
            onClick={() => setValue('role', 'tutor')}
            className="flex items-center gap-2"
          >
            <GraduationCap className="w-4 h-4" />
            Tutor
          </Button>
        </div>
        {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register('email')}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            {...register('password')}
            className={errors.password ? 'border-red-500' : ''}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Signing In...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {selectedRole === 'tutor' ? <GraduationCap className="w-4 h-4" /> : <User className="w-4 h-4" />}
            Sign In
          </div>
        )}
      </Button>

      {/* Error Messages */}
      {loginMutation.error && showError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md relative">
          <button
            onClick={() => setShowError(false)}
            className="absolute top-2 right-2 text-red-600 hover:text-red-800"
          >
            ✕
          </button>
          <p className="text-sm text-red-600 pr-6">
            {(loginMutation.error as any)?.message || 'An error occurred. Please try again.'}
          </p>
        </div>
      )}

      {/* Mode Switch */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?
          <Button
            type="button"
            variant="link"
            onClick={onModeChange}
            className="pl-1 text-blue-600 hover:text-blue-800"
          >
            Sign Up
          </Button>
        </p>
      </div>
    </form>
  );
}

function SignupForm({ onModeChange, onClose }: { onModeChange: () => void; onClose?: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showError, setShowError] = useState(true);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: 'learner',
    },
  });

  const selectedRole = watch('role');

  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      if (data.success) {
        localStorage.setItem('token', data.token!);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/firstPage');
      }
    },
    onError: (error: any) => {
      setShowError(true);
      console.error('Signup failed:', error.message);
      
      // Handle specific error cases for better user experience
      if (error.message?.includes('<!DOCTYPE') || error.message?.includes('Unexpected token')) {
        error.message = 'Database connection error. Please try again later or contact support if the issue persists.';
      } else if (error.message?.includes('Network Error') || error.message?.includes('fetch')) {
        error.message = 'Network error. Please check your internet connection and try again.';
      } else if (error.message?.includes('timeout')) {
        error.message = 'Request timed out. Please check your connection and try again.';
      }
    },
  });

  const onSubmit = (data: SignupFormData) => {
    setShowError(false); // Clear any previous errors
    const { confirmPassword, ...signupData } = data;
    signupMutation.mutate(signupData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Role Selection */}
      <div className="space-y-2">
        <Label htmlFor="role">I want to join as</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={selectedRole === 'learner' ? 'default' : 'outline'}
            onClick={() => setValue('role', 'learner')}
            className="flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            Learner
          </Button>
          <Button
            type="button"
            variant={selectedRole === 'tutor' ? 'default' : 'outline'}
            onClick={() => setValue('role', 'tutor')}
            className="flex items-center gap-2"
          >
            <GraduationCap className="w-4 h-4" />
            Tutor
          </Button>
        </div>
        {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
      </div>

      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your full name"
          {...register('name')}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register('email')}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            {...register('password')}
            className={errors.password ? 'border-red-500' : ''}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            {...register('confirmPassword')}
            className={errors.confirmPassword ? 'border-red-500' : ''}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
        {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={signupMutation.isPending}
      >
        {signupMutation.isPending ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Creating Account...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {selectedRole === 'tutor' ? <GraduationCap className="w-4 h-4" /> : <User className="w-4 h-4" />}
            Create Account
          </div>
        )}
      </Button>

      {/* Error Messages */}
      {signupMutation.error && showError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md relative">
          <button
            onClick={() => setShowError(false)}
            className="absolute top-2 right-2 text-red-600 hover:text-red-800"
          >
            ✕
          </button>
          <p className="text-sm text-red-600 pr-6">
            {(signupMutation.error as any)?.message === 'An account with this email already exists' 
              ? 'This email is already registered. Try logging in instead or use a different email.'
              : (signupMutation.error as any)?.message || 'An error occurred. Please try again.'
            }
          </p>
        </div>
      )}

      {/* Mode Switch */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?
          <Button
            type="button"
            variant="link"
            onClick={onModeChange}
            className="pl-1 text-blue-600 hover:text-blue-800"
          >
            Sign In
          </Button>
        </p>
      </div>
    </form>
  );
}

export default function AuthForm({ mode, onModeChange, onClose }: AuthFormProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center relative">
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 w-8 h-8 p-0"
          >
            ✕
          </Button>
        )}
        <CardTitle className="text-2xl font-bold">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </CardTitle>
        <CardDescription>
          {mode === 'login' 
            ? 'Sign in to continue your learning journey' 
            : 'Join our community of learners and tutors'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mode === 'login' ? (
          <LoginForm onModeChange={onModeChange} onClose={onClose} />
        ) : (
          <SignupForm onModeChange={onModeChange} onClose={onClose} />
        )}
      </CardContent>
    </Card>
  );
}