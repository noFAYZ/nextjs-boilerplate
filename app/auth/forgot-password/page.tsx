'use client';

import { useState, useEffect } from 'react';
import posthog from 'posthog-js';
import { forgetPassword } from '@/lib/auth-client';
import AuthForm from '@/components/auth/auth-form';
import { useLoading } from '@/lib/contexts/loading-context';
import { usePostHogPageView } from '@/lib/hooks/usePostHogPageView';

interface ForgotPasswordFormData {
  email: string;
}

interface ErrorState {
  code: string;
  message: string;
}

export default function ForgotPasswordPage() {
  usePostHogPageView('auth_forgot_password');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [success, setSuccess] = useState(false);
  const { withLoading } = useLoading();

  // Track when user views forgot password page
  useEffect(() => {
    posthog.capture('forgot_password_page_viewed');
  }, []);

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    setError(null);
    setIsLoading(true);
    
    try {
      const result = await withLoading(
        forgetPassword({
          email: data.email,
          redirectTo: '/auth/reset-password'
        }),
        'Sending password reset email...'
      );
      
      if (result.error) {
        setError({
          code: 'FORGOT_PASSWORD_ERROR',
          message: result.error.message || 'Failed to send reset password email'
        });
        posthog.capture('forgot_password_failed', {
          error: result.error.message
        });
      } else {
        setSuccess(true);
        posthog.capture('forgot_password_submitted', {
          email: data.email
        });
      }
    } catch {
      setError({
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (data: unknown) => {
    await handleForgotPassword(data as ForgotPasswordFormData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <AuthForm
          type="forgot-password"
          title="Reset your password"
          description="Enter your email address and we'll send you a link to reset your password"
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
          error={error}
          success={success}
          successMessage="Password reset email sent! Please check your inbox and follow the instructions to reset your password."
          links={[
            {
              href: '/auth/login',
              text: 'Remember your password?',
              linkText: 'Sign in',
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