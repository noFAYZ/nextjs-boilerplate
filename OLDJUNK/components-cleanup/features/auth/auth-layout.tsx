'use client';

import Link from 'next/link';
import Image from 'next/image';
import { WalletLogoIconOpen } from '../icons/icons';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex bg-background">

      {/* LEFT PANEL — only logo */}
     <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12 relative">

        {/* Mobile logo */}
        <div className="lg:hidden absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center group">
        <span  className="flex  group text-[60px] font-bold text-orange-500">
             {/*  𒀭  */}  <Image src="/logo/log1.png" alt="Mappr logo" width={56} height={56} className="w-9 h-9 object-contain" priority />
            
              </span>
        </div>

        <div className="w-full max-w-md mt-20 lg:mt-0">
          {children}
        </div>
      </div> 

      {/* RIGHT PANEL — login/register */}
      <div className="hidden lg:flex w-1/2 bg-muted dark:bg-muted/40 justify-center items-center">
        <Link href="/" className="flex flex-col items-center group">
        <WalletLogoIconOpen className="w-28 h-28" />
          {/*    <span  className="flex  group text-[120px] font-bold text-orange-500">
     
             𒀭
              </span> */}
          <h1 className="  text-3xl font-bold tracking-tight">MoneyMappr</h1>
          <p className="text-sm text-muted-foreground ">
            Financial Intelligence
          </p>
        </Link>

        
      </div>
    </div>
  );
}
