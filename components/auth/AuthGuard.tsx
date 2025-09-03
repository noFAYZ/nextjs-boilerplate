"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { RefreshCcw, User2 } from "lucide-react";
import { FailLoader, LogoLoader } from "../icons";
import { Button } from "../ui/button";

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  fallback?: ReactNode;
}

export default function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = "/auth/login",
  fallback,
}: AuthGuardProps) {
  const { user, loading, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !error) {
      if (requireAuth && !user) {
        router.push(redirectTo);
      } else if (!requireAuth && user && redirectTo === "/auth/login") {
        // If user is logged in and trying to access auth pages, redirect to dashboard
        router.push("/dashboard");
      }
    }
  }, [user, loading, error, requireAuth, redirectTo, router]);

  // Show error state if there's an auth error
  if (error && requireAuth) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        
        <div className="flex flex-col items-center gap-4 text-center">
       <div className=" w-16 h-16"><FailLoader className=" w-12 h-12"/></div>
          
          <h1 className="text-lg font-medium ">Authentication Error</h1>
          <p className=" max-w-md">{error}</p>
<div className="flex gap-2 justify-center">
          <Button className="flex gap-2" size={'default'} variant={'outline'}>
           
           <span className="w-6 h-6"> <RefreshCcw  /></span> 
           Reload
          </Button>
          <Button className="flex gap-2" size={'default'} variant={'outline'} onClick={() =>router.push('/auth/login')}>
           
           <span className="w-6 h-6"> <User2  /></span> 
           Login
          </Button></div>
        </div>
      </div>
    );
  }

  // Show custom fallback or loading state
  if (loading) {
    return (
      fallback || (
        <div className="w-screen h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <LogoLoader className="w-18 h-18 " />
          
            <p className="text-lg font-medium">Authenticating...</p>
          </div>
        </div>
      )
    );
  }

  // Show nothing while redirecting
  if (requireAuth && !user) {
    return null;
  }

  // Show nothing while redirecting authenticated users from auth pages
  if (!requireAuth && user && redirectTo === "/auth/login") {
    return null;
  }

  return <>{children}</>;
}