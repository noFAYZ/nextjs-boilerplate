'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import AuthForm from '@/components/auth/auth-form';
import { SignInFormData } from '@/lib/types';
import { PageLoader } from '@/components/ui/page-loader';
import { useAuthStore, selectAuthLoading, selectAuthError, selectSession, selectIsAuthenticated } from '@/lib/stores';
import { useLoading } from '@/lib/contexts/loading-context';
function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const error = useAuthStore(selectAuthError);
  const clearError = useAuthStore((state) => state.clearAuthErrors);
  const loading = useAuthStore(selectAuthLoading);
  const session = useAuthStore(selectSession);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const { showLoading, showSuccess, showError, hideLoading } = useLoading();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && session) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, session, router]);

  const handleSignIn = async (data: SignInFormData) => {
    clearError();
    
    try {
      showLoading('Signing you in...');
      await login(data?.email, data?.password);
      showSuccess('Welcome back! Redirecting to dashboard...');
      
      // Redirect to dashboard after successful login
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const handleFormSubmit = async (data: unknown) => {
    await handleSignIn(data as SignInFormData);
  };

  return (

      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm">
          <AuthForm
            type="signin"
            title="Welcome back"
            description="Sign in to your MoneyMappr account"
            onSubmit={handleFormSubmit}
            error={error ? { code: 'AUTH_ERROR', message: String(error) } : null}
            links={[
              {
                href: '/auth/forgot-password',
                text: 'Forgot your password?',
                linkText: 'Reset it here',
              },
              {
                href: '/auth/signup',
                text: "Don't have an account?",
                linkText: 'Sign up',
              },
            ]}
          />
        </div>
      </div>
 
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<PageLoader message="Loading login..." />}>
      <LoginForm />
    </Suspense>
  );
}