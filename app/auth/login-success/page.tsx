'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export default function LoginSuccessPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 30); // Complete in 1.5 seconds

    // Redirect to dashboard after animation
    const redirectTimeout = setTimeout(() => {
      router.push('/dashboard');
    }, 1500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(redirectTimeout);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <Card className="relative w-full max-w-md p-8 bg-gradient-to-br from-card/50 via-card/60 to-card/50 backdrop-blur-xl border-2 border-border/50 shadow-2xl">
        {/* Inner glow */}
        <div className="pointer-events-none absolute inset-0 rounded-lg">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent dark:via-white/3" />
        </div>

        <div className="relative flex flex-col items-center space-y-6">
          {/* Success Icon with animation */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center animate-scale-in">
              <CheckCircle className="h-12 w-12 text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* Message */}
          <div className="text-center space-y-2 animate-fade-in">
            <h2 className="text-2xl font-bold text-foreground">
              Welcome back!
            </h2>
            <p className="text-sm text-muted-foreground">
              Login successful. Redirecting to your dashboard...
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full space-y-2">
            <Progress value={progress} className="h-1" />
            <p className="text-xs text-center text-muted-foreground">
              {Math.round(progress)}%
            </p>
          </div>
        </div>
      </Card>

      <style jsx global>{`
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out 0.3s both;
        }
      `}</style>
    </div>
  );
}
