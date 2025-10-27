'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import posthog from 'posthog-js';

import AuthForm from '@/components/auth/auth-form';
import { AuthLayout } from '@/components/auth/auth-layout';
import { SignInFormData } from '@/lib/types';
import { PageLoader } from '@/components/ui/page-loader';
import { useAuthStore, selectAuthError, selectSession, selectIsAuthenticated } from '@/lib/stores';
import { useLoading } from '@/lib/contexts/loading-context';
function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const error = useAuthStore(selectAuthError);
  const clearError = useAuthStore((state) => state.clearAuthErrors);
  const session = useAuthStore(selectSession);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const { showLoading, showSuccess, showError } = useLoading();

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
      posthog.capture('login_form_submitted', { success: true });
      showSuccess('Welcome back! Redirecting to dashboard...');

      // Redirect to dashboard after successful login
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error) {
      const errorObj = error as Error & { code?: string };
      posthog.capture('login_form_submitted', {
        success: false,
        error_code: errorObj.code,
        error_message: error instanceof Error ? error.message : String(error),
      });
      // Check if error is EMAIL_NOT_VERIFIED
      if (errorObj.code === 'EMAIL_NOT_VERIFIED') {
        // Redirect to verification page with email
        showError('Please verify your email to continue');
        setTimeout(() => {
          router.push(`/auth/resend-verification?email=${encodeURIComponent(data?.email)}`);
        }, 1500);
      } else {
        showError(error instanceof Error ? error.message : 'Login failed');
      }
    }
  };

  const handleFormSubmit = async (data: unknown) => {
    await handleSignIn(data as SignInFormData);
  };

  return (
    <AuthLayout>
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
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<PageLoader message="Loading login..." />}>
      <LoginForm />
    </Suspense>
  );
}
