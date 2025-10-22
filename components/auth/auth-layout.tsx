'use client';

import { LogoMappr } from '@/components/icons';
import { TrendingUp, Shield, Zap, BarChart3 } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-start lg:justify-center px-4 sm:px-6 lg:px-20 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>


    </div>
  );
}
