'use client';

import { useEffect, useState, Suspense } from 'react';
import posthog from 'posthog-js';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPassword } from '@/lib/auth-client';
import AuthForm from '@/components/auth/auth-form';
import { usePostHogPageView } from '@/lib/hooks/usePostHogPageView';

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

interface ErrorState {
  code: string;
  message: string;
}

function ResetPasswordForm() {
  usePostHogPageView('auth_reset_password');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string>('');

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      router.push('/auth/forgot-password');
      return;
    }
    setToken(tokenParam);
    posthog.capture('reset_password_page_viewed');
  }, [searchParams, router]);

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError({ 
        code: 'INVALID_TOKEN', 
        message: 'Invalid reset token. Please request a new password reset.' 
      });
      return;
    }

    setError(null);
    setIsLoading(true);
    
    try {
      const result = await resetPassword({
        newPassword: data.password,
        token,
      });
      
      if (result.error) {
        setError({
          code: 'RESET_PASSWORD_ERROR',
          message: result.error.message || 'Failed to reset password'
        });
        posthog.capture('reset_password_failed', {
          error: result.error.message
        });
      } else {
        setSuccess(true);
        posthog.capture('reset_password_success');
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
    await handleResetPassword(data as ResetPasswordFormData);
  };

  if (!token) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <AuthForm
          type="reset-password"
          title="Set new password"
          description="Enter your new password below"
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
          error={error}
          success={success}
          successMessage="Password reset successfully! You can now sign in with your new password."
          links={[
            {
              href: '/auth/login',
              text: success ? 'Ready to sign in?' : 'Remember your password?',
              linkText: 'Sign in',
            },
            ...(!success ? [{
              href: '/auth/forgot-password',
              text: 'Need a new reset link?',
              linkText: 'Request here',
            }] : []),
          ]}
        />
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}