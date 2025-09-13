'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/auth/auth-form';
import { SignUpFormData } from '@/lib/types';
import { useAuthStore, selectAuthLoading, selectAuthError, selectIsAuthenticated, selectSession } from '@/lib/stores';
import { useLoading } from '@/lib/contexts/loading-context';

export default function SignUpPage() {
  const router = useRouter();
  const signup = useAuthStore((state) => state.signup);
  const loading = useAuthStore(selectAuthLoading);
  const error = useAuthStore(selectAuthError);
  const clearError = useAuthStore((state) => state.clearAuthErrors);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const session = useAuthStore(selectSession);
  const [success, setSuccess] = useState(false);
  const { showLoading, showSuccess, showError, hideLoading } = useLoading();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && session) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, session, router]);

  const handleSignUp = async (data: SignUpFormData) => {
    clearError();
    
    try {
      showLoading('Creating your account...');
      await signup(data);
      setSuccess(true);
      showSuccess('Account created successfully! Please check your email to verify your account.');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Signup failed');
    }
  };

  const handleFormSubmit = async (data: unknown) => {
    await handleSignUp(data as SignUpFormData);
  };

  return (

      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <AuthForm
            type="signup"
            title="Create your account"
            description="Join MoneyMappr and take control of your finances"
            onSubmit={handleFormSubmit}
            error={error ? { code: 'AUTH_ERROR', message: String(error) } : null}
            success={success}
            successMessage="Account created successfully! Please check your email to verify your account before signing in."
            links={[
              {
                href: '/auth/login',
                text: 'Already have an account?',
                linkText: 'Sign in',
              },
              ...(success ? [{
                href: '/auth/resend-verification',
                text: "Didn't receive the email?",
                linkText: 'Resend verification',
              }] : []),
            ]}
          />
        </div>
      </div>
 
  );
}