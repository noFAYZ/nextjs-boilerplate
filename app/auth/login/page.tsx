'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import posthog from 'posthog-js';

import AuthForm from '@/components/auth/auth-form';
import { AuthLayout } from '@/components/auth/auth-layout';
import { SignInFormData } from '@/lib/types';
import { useAuthStore, selectSession, selectIsAuthenticated } from '@/lib/stores';
import { usePostHogPageView } from '@/lib/hooks/usePostHogPageView';
import { useToast } from "@/lib/hooks/useToast";
function LoginForm() {
  usePostHogPageView('auth_login');
  const router = useRouter();
  const { toast } = useToast();
  const login = useAuthStore((state) => state.login);
  const loginLoading = useAuthStore((state) => state.loginLoading);
  const session = useAuthStore(selectSession);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && session) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, session, router]);

  // Track when user views login page
  useEffect(() => {
    posthog.capture('login_page_viewed');
  }, []);

  const handleSignIn = async (data: SignInFormData) => {

    try {
      // Perform login (button will show loading state automatically via loginLoading from store)
      await login(data?.email, data?.password);
      posthog.capture('login_form_submitted', { success: true });

      // Navigate to success screen (which will auto-redirect to dashboard)
      router.push('/auth/login-success');
    } catch (error) {
      const errorObj = error as Error & { code?: string };
      const errorMessage = error instanceof Error ? error.message : 'Login failed';

      posthog.capture('login_form_submitted', {
        success: false,
        error_code: errorObj.code,
        error_message: errorMessage,
      });

      // Show error as toast
      toast({ title: errorMessage, variant: 'destructive' });

      // Check if error is EMAIL_NOT_VERIFIED - special handling
      if (errorObj.code === 'EMAIL_NOT_VERIFIED') {
        setTimeout(() => {
          router.push(`/auth/resend-verification?email=${encodeURIComponent(data?.email)}`);
        }, 1000);
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
        isLoading={loginLoading}
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
