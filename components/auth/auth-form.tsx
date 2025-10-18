'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, AlertCircle, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AuthError } from '@/lib/types';
import { Fa7BrandsGithub, LogosGoogleIcon, SuccessLoader } from '../icons';
import { useRouter } from 'next/navigation';
import { useBruteForceProtection, formatTimeRemaining } from '@/lib/security/brute-force-protection';
import { logger } from '@/lib/utils/logger';

// Validation schemas
export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const signUpSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),
  email: z.string()
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  token: z.string().min(1, 'Reset token is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const resendEmailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

interface AuthFormProps {
  type: 'signin' | 'signup' | 'forgot-password' | 'reset-password' | 'resend-email';
  title: string;
  description: string;
  onSubmit: (data: unknown) => Promise<void>;
  isLoading?: boolean;
  error?: AuthError | null;
  success?: boolean;
  successMessage?: string;
  links?: Array<{
    href: string;
    text: string;
    linkText: string;
  }>;
}

export default function AuthForm({
  type,
  title,
  description,
  onSubmit,
  isLoading = false,
  error,
  success,
  successMessage,
  links = [],
}: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);
  const router = useRouter();

  const {
    checkAttempt,
    recordFailedAttempt,
    recordSuccessfulAttempt,
    getAttemptStats,
  } = useBruteForceProtection();

  // Check brute force protection on mount and when type changes
  useEffect(() => {
    if (type === 'signin' || type === 'signup') {
      checkBruteForceStatus();
    }
  }, [type]);

  // Update countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBlocked && blockTimeRemaining > 0) {
      timer = setInterval(() => {
        setBlockTimeRemaining((prev) => {
          if (prev <= 1000) {
            setIsBlocked(false);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBlocked, blockTimeRemaining]);

  const checkBruteForceStatus = async () => {
    try {
      const result = await checkAttempt();
      setIsBlocked(!result.allowed);
      setBlockTimeRemaining(result.nextAttemptIn);
      
      if (!result.allowed) {
        logger.warn('Authentication blocked due to brute force protection', {
          reason: result.reason,
          remainingAttempts: result.remainingAttempts,
          nextAttemptIn: result.nextAttemptIn,
        });
      }
    } catch (error) {
      logger.error('Error checking brute force protection', error);
    }
  };

  const getSchema = () => {
    switch (type) {
      case 'signin':
        return signInSchema;
      case 'signup':
        return signUpSchema;
      case 'forgot-password':
        return forgotPasswordSchema;
      case 'reset-password':
        return resetPasswordSchema;
      case 'resend-email':
        return resendEmailSchema;
      default:
        return signInSchema;
    }
  };

  const getDefaultValues = () => {
    switch (type) {
      case 'signin':
        return { email: '', password: '', rememberMe: false };
      case 'signup':
        return { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };
      case 'forgot-password':
      case 'resend-email':
        return { email: '' };
      case 'reset-password':
        return { password: '', confirmPassword: '', token: '' };
      default:
        return {};
    }
  };

  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(getSchema()) as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValues: getDefaultValues() as any,
  });

  const handleSubmit = async (data: unknown) => {
    // Check brute force protection before allowing submission
    if ((type === 'signin' || type === 'signup') && isBlocked) {
      form.setError('root', {
        type: 'manual',
        message: `Too many attempts. Please wait ${formatTimeRemaining(blockTimeRemaining)} before trying again.`
      });
      return;
    }

    try {
      // Clear any existing form errors
      form.clearErrors();
      
      // Check brute force protection one more time
      if (type === 'signin' || type === 'signup') {
        const result = await checkAttempt();
        if (!result.allowed) {
          setIsBlocked(true);
          setBlockTimeRemaining(result.nextAttemptIn);
          form.setError('root', {
            type: 'manual',
            message: `Too many attempts. Please wait ${formatTimeRemaining(result.nextAttemptIn)} before trying again.`
          });
          return;
        }
      }

      await onSubmit(data);
      
      // Record successful attempt for brute force protection
      if (type === 'signin' || type === 'signup') {
        await recordSuccessfulAttempt();
      }
    } catch (error) {
      // Record failed attempt for brute force protection
      if (type === 'signin') {
        await recordFailedAttempt();
        await checkBruteForceStatus(); // Refresh the status
      }
      
      // If there's a validation error, show it on the form
      if (error instanceof Error) {
        form.setError('root', { 
          type: 'manual', 
          message: error.message 
        });
      }
      
      logger.error('Authentication attempt failed', error, {
        type,
        email: (data as any)?.email,
      });
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader className="text-center justify-center w-full">
          <div className="flex mb-4 justify-center">
            <span className='w-40 h-40'><SuccessLoader /></span>
          </div>
          <CardTitle className="text-2xl">Success!</CardTitle>
          <CardDescription>{successMessage || 'Operation completed successfully!'}</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col space-y-4">
          {links.map((link, index: number) => (
            <div key={index} className="text-center text-sm">
              <span className="text-muted-foreground">{link.text}</span>{' '}
              <Link href={link.href} className="text-primary hover:underline font-medium">
                {link.linkText}
              </Link>
            </div>
          ))}
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm mx-auto px-2 border-border ">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/20">
            <AlertCircle className="w-4 h-4" />
            <span>{error.message}</span>
          </div>
        )}
             {/* Display brute force protection warning */}
             {isBlocked && blockTimeRemaining > 0 && (
              <Alert className="mb-4 border-yellow-200 bg-yellow-50 dark:border-yellow-900/20 dark:bg-yellow-900/10">
                <Clock className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                  <strong>Account temporarily locked</strong>
                  <br />
                  Too many failed attempts. Please wait {formatTimeRemaining(blockTimeRemaining)} before trying again.
                </AlertDescription>
              </Alert>
             )}

             {/* Display form root errors */}
             {form.formState.errors.root && (
              <div className="flex items-center gap-2 p-2 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/20">
                <AlertCircle className="w-4 h-4" />
                <span>{form.formState.errors.root.message}</span>
              </div>
            )}

{type === 'signin' && ( <><div className={` justify-center gap-4 mb-6 px-4 flex `}>
                <Button variant="outline" className='w-1/2 items-center align-middle content-center' size={'lg'} >
                  <Fa7BrandsGithub className='w-6 h-6' />
               
                  Github
                </Button>
                <Button variant="outline" className='w-1/2  items-center align-middle content-center'  size={'lg'} >
                <LogosGoogleIcon className='w-6 h-6'/>
                  Google
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t mb-4">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div></>)}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* First Name */}
            {type === 'signup' && (
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John" 
                        autoComplete="given-name"
                        {...field} 
                        variant={'filled'}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Last Name */}
            {type === 'signup' && (
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Doe" 
                        autoComplete="family-name"
                        {...field} 
                        variant={'filled'}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Email */}
            {(type === 'signin' || type === 'signup' || type === 'forgot-password' || type === 'resend-email') && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="john@example.com"
                        autoComplete="email"
                        {...field} 
                        variant={'filled'}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Password */}
            {(type === 'signin' || type === 'signup' || type === 'reset-password') && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative overflow-hidden">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          autoComplete={type === 'signin' ? 'current-password' : 'new-password'}
                          variant={'filled'}
                          className='overflow-hidden'
                      
                          {...field}
                        />
                
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Confirm Password */}
            {(type === 'signup' || type === 'reset-password') && (
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          autoComplete="new-password"
                          {...field}
                          variant={'filled'}
                        />
                  
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Remember Me */}
            {type === 'signin' && (
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary bg-background border-2 border-muted rounded focus:ring-primary focus:ring-2"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm">Remember me</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            )}

       

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || (isBlocked && blockTimeRemaining > 0)}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : isBlocked && blockTimeRemaining > 0 ? (
                `Wait ${formatTimeRemaining(blockTimeRemaining)}`
              ) : (
                getButtonText()
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        {links.map((link, index: number) => (
          <div key={index} className="text-center text-sm">
            <span className="text-muted-foreground">{link.text}</span>{' '}
            <Link href={link.href} className="text-primary hover:underline font-medium">
              {link.linkText}
            </Link>
          </div>
        ))}
      </CardFooter>
    </Card>
  );

  function getButtonText() {
    switch (type) {
      case 'signin':
        return 'Sign In';
      case 'signup':
        return 'Create Account';
      case 'forgot-password':
        return 'Send Reset Email';
      case 'reset-password':
        return 'Reset Password';
      case 'resend-email':
        return 'Resend Email';
      default:
        return 'Submit';
    }
  }
}