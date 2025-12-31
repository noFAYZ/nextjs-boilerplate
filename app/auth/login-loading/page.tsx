'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function LoginLoadingPage() {
  const router = useRouter();

  // Safety timeout - if stuck on this page for too long, redirect to login
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/auth/login');
    }, 109000); // 10 seconds max

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <Card className="relative w-full max-w-md p-8 bg-gradient-to-br from-card/50 via-card/60 to-card/50 backdrop-blur-xl border-2 border-border/50 shadow-2xl">
        {/* Inner glow */}
        <div className="pointer-events-none absolute inset-0 rounded-lg">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent dark:via-white/3" />
        </div>

        <div className="relative flex flex-col items-center space-y-6">
          {/* Logo */}
          <div className="flex items-center justify-center">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-xl" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">M</span>
              </div>
            </div>
          </div>

          {/* Animated Spinner */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl animate-pulse" />
            <Loader2 className="relative h-12 w-12 text-primary animate-spin" />
          </div>

          {/* Message */}
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Signing you in
            </h2>
            <p className="text-sm text-muted-foreground">
              Please wait while we authenticate your account...
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </Card>
    </div>
  );
}
