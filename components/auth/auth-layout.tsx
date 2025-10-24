'use client';

import { LogoMappr } from '@/components/icons';
import { TrendingUp, Shield, Zap, BarChart3 } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-background"    style={{
      backgroundImage: "url('/patterns/5.webp')",
    }}
  >
    {/* === Gradient Overlay === */}
    <div className="absolute inset-0 bg-gradient-to-b from-background via-background/10 to-background pointer-events-none" />
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-start lg:justify-center px-4 sm:px-6 lg:px-20 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>


    </div>
  );
}
