'use client';

import { Suspense } from 'react';

import AuthForm from '@/components/auth/auth-form';
import { SignInFormData } from '@/lib/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/lib/contexts/AuthContext';
function LoginForm() {
  const { login, error, clearError, loading, session } = useAuth();

  const handleSignIn = async (data: SignInFormData) => {
    clearError();
    
     await login(data?.email, data?.password);
     
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
            isLoading={loading}
            error={error ? { code: 'AUTH_ERROR', message: error } : null}
            success={session ?true :false}
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
    <Suspense fallback={<LoadingSpinner />}>
      <LoginForm />
    </Suspense>
  );
}