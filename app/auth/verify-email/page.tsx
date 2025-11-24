'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import posthog from 'posthog-js';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyEmail, useSession } from '@/lib/auth-client';
import { usePostHogPageView } from '@/lib/hooks/usePostHogPageView';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle, Mail } from 'lucide-react';
import { PageLoader } from '@/components/ui/page-loader';
import Link from 'next/link';

function VerifyEmailForm() {
  usePostHogPageView('auth_verify_email');
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('loading');
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionData = useSession();
  const session = sessionData?.data;

  const handleVerification = useCallback(async (token: string) => {
    try {
      const result = await verifyEmail({
        query: {
          token,
          callbackURL: '/dashboard'
        }
      });
      
      if (result.error) {
        setStatus('error');
        setMessage(result.error.message || 'Failed to verify email. The verification link may be invalid or expired.');
        posthog.capture('email_verification_failed', {
          error: result.error.message
        });
      } else {
        setStatus('success');
        setMessage('Your email has been successfully verified! You can now access all features of your account.');
        posthog.capture('email_verified');

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      }
    } catch (error) {
      console.error('Email verification error:', error);
      setStatus('error');
      setMessage('An unexpected error occurred. Please try again.');
    }
  }, [router]);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Token provided, verify the email
      handleVerification(token);
    } else if (session?.user && !session.user.emailVerified) {
      // No token but user exists and is not verified, show pending state
      setStatus('pending');
      setMessage('Please check your email and click the verification link to activate your account.');
    } else if (session?.user && session.user.emailVerified) {
      // User is already verified, redirect to dashboard
      router.push('/dashboard');
    } else {
      // No token and no user, redirect to login
      router.push('/auth/login');
    }
  }, [searchParams, session, router, handleVerification]);

  const handleResendEmail = async () => {
    if (!session?.user?.email) return;

    setIsResending(true);

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: session.user.email }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Verification email sent! Please check your inbox and spam folder.');
        posthog.capture('verification_email_resent', {
          email: session.user.email
        });
      } else {
        setMessage(result.message || 'Failed to resend verification email.');
        posthog.capture('verification_email_resend_failed', {
          error: result.message
        });
      }
    } catch (error) {
      setMessage('An unexpected error occurred while resending the email.');
      posthog.capture('verification_email_resend_error', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Verifying Email</CardTitle>
              <CardDescription>Please wait while we verify your email address...</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <PageLoader message="Verifying your email address..." fullScreen={false} />
            </CardContent>
          </Card>
        );

      case 'success':
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-green-600">Email Verified!</CardTitle>
              <CardDescription>{message}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </CardFooter>
          </Card>
        );

      case 'error':
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
              <CardTitle className="text-2xl text-red-600">Verification Failed</CardTitle>
              <CardDescription>{message}</CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col space-y-2">
              {session?.user?.email && (
                <Button 
                  onClick={handleResendEmail} 
                  disabled={isResending}
                  className="w-full"
                >
                  {isResending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    'Resend Verification Email'
                  )}
                </Button>
              )}
              <Button variant="outline" asChild className="w-full">
                <Link href="/auth/login">Back to Login</Link>
              </Button>
            </CardFooter>
          </Card>
        );

      case 'pending':
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Mail className="w-12 h-12 text-blue-500" />
              </div>
              <CardTitle className="text-2xl">Check Your Email</CardTitle>
              <CardDescription>{message}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 p-3 mb-4 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-md dark:bg-blue-900/10 dark:text-blue-400 dark:border-blue-900/20">
                <AlertCircle className="w-4 h-4" />
                <span>Can&apos;t find the email? Check your spam folder.</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              {session?.user?.email && (
                <Button 
                  onClick={handleResendEmail} 
                  disabled={isResending}
                  className="w-full"
                >
                  {isResending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    'Resend Verification Email'
                  )}
                </Button>
              )}
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Wrong email address? </span>
                <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                  Create new account
                </Link>
              </div>
            </CardFooter>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      {renderContent()}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<PageLoader message="Loading email verification..." />}>
      <VerifyEmailForm />
    </Suspense>
  );
}