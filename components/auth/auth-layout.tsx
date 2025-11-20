'use client';

import Link from 'next/link';
import Image from 'next/image';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex bg-background">

      {/* LEFT PANEL — only logo */}
      <div className="hidden lg:flex w-1/2 bg-muted dark:bg-muted/40 justify-center items-center">
        <Link href="/" className="flex flex-col items-center group">
          <Image
            src="/logo/mappr.svg"
            alt="MoneyMappr logo"
            width={120}
            height={120}
            className="   "
            priority
          />
          <h1 className="mt-3 text-3xl font-bold tracking-tight">MoneyMappr</h1>
          <p className="text-sm text-muted-foreground ">
            Financial Intelligence
          </p>
        </Link>
      </div>

      {/* RIGHT PANEL — login/register */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12 relative">

        {/* Mobile logo */}
        <div className="lg:hidden absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center group">
          <Image
            src="/logo/mappr.svg"
            alt="MoneyMappr logo"
            width={60}
            height={60}
            className="transition-transform group-hover:scale-102"
            priority
          />
          <h1 className="mt-2 text-xl font-bold tracking-tight">MoneyMappr</h1>
        </div>

        <div className="w-full max-w-md mt-20 lg:mt-0">
          {children}
        </div>
      </div>
    </div>
  );
}
