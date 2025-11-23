"use client"

import React from "react"
import { LogoLoader } from "@/components/icons"
import { cn } from "@/lib/utils"

interface PageLoaderProps {
  message?: string
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  fullScreen?: boolean
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12", 
  lg: "w-16 h-16",
  xl: "w-20 h-20"
}

export function PageLoader({ 
  message = "Loading...", 
  className,
  size = "lg",
  fullScreen = true
}: PageLoaderProps) {
  const containerClasses = fullScreen 
    ? "fixed inset-0 z-40 flex items-center justify-center bg-card" 
    : "flex items-center justify-center min-h-[200px]"

  return (
    <div className={cn(containerClasses, className)}>
      <div className="flex flex-col items-center gap-4 text-center">
        <LogoLoader className={cn(sizeClasses[size])} />
        {message && (
          <p className="text-sm text-muted-foreground font-medium animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

interface PageLoaderWrapperProps {
  children: React.ReactNode
  isLoading: boolean
  message?: string
  fallback?: React.ReactNode
  className?: string
}

export function PageLoaderWrapper({
  children,
  isLoading,
  message,
  fallback,
  className
}: PageLoaderWrapperProps) {
  if (isLoading) {
    return fallback || <PageLoader message={message} className={className} />
  }

  return <>{children}</>
}

// Higher-order component for pages
export function withPageLoader<P extends object>(
  Component: React.ComponentType<P>,
  loadingMessage?: string
) {
  const WrappedComponent = (props: P & { isLoading?: boolean }) => {
    const { isLoading, ...componentProps } = props
    
    return (
      <PageLoaderWrapper 
        isLoading={isLoading || false} 
        message={loadingMessage}
      >
        <Component {...(componentProps as P)} />
      </PageLoaderWrapper>
    )
  }
  
  WrappedComponent.displayName = `withPageLoader(${Component.displayName || Component.name})`
  return WrappedComponent
}