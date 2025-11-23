'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import posthog from 'posthog-js';

import AuthForm from '@/components/auth/auth-form';
import { AuthLayout } from '@/components/auth/auth-layout';
import { SignInFormData } from '@/lib/types';
import { useAuthStore, selectAuthError, selectSession, selectIsAuthenticated } from '@/lib/stores';
import { toast } from 'sonner';
function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const error = useAuthStore(selectAuthError);
  const clearError = useAuthStore((state) => state.clearAuthErrors);
  const session = useAuthStore(selectSession);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && session) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, session, router]);

  const handleSignIn = async (data: SignInFormData) => {
    clearError();

    try {
      // Navigate to loading screen
      router.push('/auth/login-loading');
      
      // Perform login
      await login(data?.email, data?.password);
      posthog.capture('login_form_submitted', { success: true });
      
      // Navigate to success screen (which will auto-redirect to dashboard)
      router.push('/auth/login-success');
    } catch (error) {
      const errorObj = error as Error & { code?: string };
      posthog.capture('login_form_submitted', {
        success: false,
        error_code: errorObj.code,
        error_message: error instanceof Error ? error.message : String(error),
      });
      
      // Navigate back to login page
      router.push('/auth/login');
      
      // Check if error is EMAIL_NOT_VERIFIED
      if (errorObj.code === 'EMAIL_NOT_VERIFIED') {
        // Redirect to verification page with email
        toast.error('Please verify your email to continue');
        setTimeout(() => {
          router.push(`/auth/resend-verification?email=${encodeURIComponent(data?.email)}`);
        }, 1500);
      } else {
        toast.error(error instanceof Error ? error.message : 'Login failed');
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
  return <LoginForm />;
}
