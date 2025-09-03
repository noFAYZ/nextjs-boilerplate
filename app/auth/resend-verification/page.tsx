'use client';

import { useState } from 'react';
import AuthForm from '@/components/auth/auth-form';

interface ResendEmailFormData {
  email: string;
}

interface ErrorState {
  code: string;
  message: string;
}

export default function ResendVerificationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResendEmail = async (data: ResendEmailFormData) => {
    setError(null);
    setIsLoading(true);
    
    try {
      // Better Auth doesn't have a specific resend verification method
      // We'll use a custom API endpoint that triggers verification email resend
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError({
          code: 'RESEND_ERROR',
          message: result.message || 'Failed to resend verification email'
        });
      } else {
        setSuccess(true);
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
    await handleResendEmail(data as ResendEmailFormData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <AuthForm
          type="resend-email"
          title="Resend verification email"
          description="Enter your email address and we'll resend the verification email"
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
          error={error}
          success={success}
          successMessage="Verification email sent! Please check your inbox and spam folder for the verification link."
          links={[
            {
              href: '/auth/login',
              text: 'Already verified?',
              linkText: 'Sign in',
            },
            {
              href: '/auth/signup',
              text: 'Need a different account?',
              linkText: 'Sign up',
            },
          ]}
        />
      </div>
    </div>
  );
}