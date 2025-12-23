"use client";

import { useAuthStore, selectUser, selectAuthLoading, selectAuthError } from "@/lib/stores";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { RefreshCcw, User2 } from "lucide-react";
import { FailLoader, LogoLoader } from "../icons";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ErrorAuthIcon, ErrorIcon } from "../icons/icons";

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
  const user = useAuthStore(selectUser);
  const loading = useAuthStore(selectAuthLoading);
  const error = useAuthStore(selectAuthError);
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
    return (<div className=" relative h-screen     z-10 flex items-center justify-center">
      <Card className="p-6 space-y-4 items-center " >
    
        <ErrorAuthIcon className=" w-12 h-12"/>
          
        <h1 className="text-md font-semibold">Authentication Error!</h1>
        <div className="flex gap-2 justify-center">
          <Button className="flex gap-2" size={'sm'} variant={'outline'}
          icon={<RefreshCcw className="w-4 h-4"  />}
          >
           
           
           Reload
          </Button>
          <Button className="flex gap-2" size={'sm'}   onClick={() =>router.push('/auth/login')}
            icon={<User2 className="w-4 h-4"  />}
            >
           
           
           Login
          </Button></div>
      </Card>
      </div>);
  }

  // Show custom fallback or loading state
  if (loading) {
    return (
      fallback || (<div className=" relative h-screen     z-10 flex items-center justify-center">
        <Card className="px-5 border-border  " >
          <div className="flex items-center space-x-3">
            <LogoLoader className="w-8 h-8" />
            <span className="text-sm font-semibold">Authenticating....</span>
          </div>
        </Card>
        </div>)
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