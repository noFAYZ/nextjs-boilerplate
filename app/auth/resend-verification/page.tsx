'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useResendVerificationEmail } from '@/lib/queries/use-auth-data';
import AuthForm from '@/components/auth/auth-form';
import { PageLoader } from '@/components/ui/page-loader';

interface ResendEmailFormData {
  email: string;
}

function ResendVerificationForm() {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get('email');
  const [defaultEmail, setDefaultEmail] = useState<string>('');

  // ✅ CORRECT: Use TanStack Query mutation hook
  const { mutate: resendEmail, isPending, isSuccess, error } = useResendVerificationEmail();

  // Pre-fill email if provided in URL
  useEffect(() => {
    if (emailFromUrl) {
      setDefaultEmail(emailFromUrl);
    }
  }, [emailFromUrl]);

  const handleFormSubmit = async (data: unknown) => {
    const { email } = data as ResendEmailFormData;

    // Trigger mutation with email and optional callback URL
    resendEmail({
      email,
      callbackURL: 'http://localhost:3001/dashboard',
    });
  };

  // Transform TanStack Query error to AuthForm error format
  const formError = error
    ? {
        code: 'RESEND_ERROR',
        message: error instanceof Error ? error.message : 'Failed to resend verification email',
      }
    : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <AuthForm
          type="resend-email"
          title="Verify your email"
          description={
            emailFromUrl
              ? 'Your email needs to be verified before you can sign in'
              : 'Enter your email address and we\'ll resend the verification email'
          }
          onSubmit={handleFormSubmit}
          isLoading={isPending}
          error={formError}
          success={isSuccess}
          successMessage="Verification email sent! Please check your inbox and spam folder for the verification link."
          defaultEmail={defaultEmail}
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

export default function ResendVerificationPage() {
  return (
    <Suspense fallback={<PageLoader message="Loading..." />}>
      <ResendVerificationForm />
    </Suspense>
  );
}
