'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import posthog from 'posthog-js';
import AuthForm from '@/components/auth/auth-form';
import { AuthLayout } from '@/components/auth/auth-layout';
import { SignUpFormData } from '@/lib/types';
import { useAuthStore, selectIsAuthenticated, selectSession } from '@/lib/stores';
import { usePostHogPageView } from '@/lib/hooks/usePostHogPageView';
import { useToast } from '@/lib/hooks/useToast';

export default function SignUpPage() {
  usePostHogPageView('auth_signup');
  const router = useRouter();
  const { toast } = useToast();
  const signup = useAuthStore((state) => state.signup);
  const signupLoading = useAuthStore((state) => state.signupLoading);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const session = useAuthStore(selectSession);
  const [success, setSuccess] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && session) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, session, router]);

  // Track when user views signup page
  useEffect(() => {
    posthog.capture('signup_page_viewed');
  }, []);

  const handleSignUp = async (data: SignUpFormData) => {
    try {
      await signup(data);
      posthog.capture('signup_success', { email: data.email });
      setSuccess(true);
      toast({ title: 'Account created successfully! Please check your email to verify your account.', variant: 'success' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      posthog.capture('signup_failed', { email: data.email, error: errorMessage });
      // Show error as toast
      toast({ title: errorMessage, variant: 'destructive' });
    }
  };

  const handleFormSubmit = async (data: unknown) => {
    await handleSignUp(data as SignUpFormData);
  };

  return (
    <AuthLayout>
      <AuthForm
        type="signup"
        title="Create your account"
        description="Join MoneyMappr and take control of your finances"
        onSubmit={handleFormSubmit}
        isLoading={signupLoading}
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
    </AuthLayout>
  );
}
