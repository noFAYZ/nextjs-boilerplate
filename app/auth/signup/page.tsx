'use client';

import { useState } from 'react';
import AuthForm from '@/components/auth/auth-form';

import { SignUpFormData } from '@/lib/types';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function SignUpPage() {
  const { signup, loading, error, clearError } = useAuth();
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (data: SignUpFormData) => {
    clearError();
    
    const result = await signup(data);
    
    if (result?.success) {
      setSuccess(true);
    }
  };

  const handleFormSubmit = async (data: unknown) => {
    await handleSignUp(data as SignUpFormData);
  };

  return (

      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <AuthForm
            type="signup"
            title="Create your account"
            description="Join MoneyMappr and take control of your finances"
            onSubmit={handleFormSubmit}
            isLoading={loading}
            error={error}
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
        </div>
      </div>
 
  );
}