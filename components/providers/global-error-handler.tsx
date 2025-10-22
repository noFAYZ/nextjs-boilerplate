'use client';

import React, { useEffect, useState } from 'react';
import { ServerError } from '@/components/ui/server-error';
import { errorHandler, AppError } from '@/lib/utils/error-handler';

interface GlobalErrorHandlerProps {
  children: React.ReactNode;
}

export function GlobalErrorHandler({ children }: GlobalErrorHandlerProps) {
  const [backendError, setBackendError] = useState<AppError | null>(null);

  useEffect(() => {
    // Set up global error handler
    const handleBackendError = (error: unknown) => {
      const appError = errorHandler.handleError(error, 'global', {
        showToast: false,
        logError: true,
        throwError: false
      });
console.log('Global error handler caught an error:', appError);
      // Only show error UI for backend/critical errors
      if (appError.code === 'BACKEND_UNREACHABLE' ||
          appError.code === 'BACKEND_DOWN' ||
          appError.severity === 'critical') {
        setBackendError(appError);
      }
    };

    // Attach to window for API client to trigger
    if (typeof window !== 'undefined') {
      (window as Window & { showBackendError?: (error: unknown) => void }).showBackendError = handleBackendError;
    }

    return () => {
      // Cleanup
      if (typeof window !== 'undefined') {
        delete (window as Window & { showBackendError?: (error: unknown) => void }).showBackendError;
      }
    };
  }, []);

  const handleRetry = async () => {
    if (!backendError) return;

    try {
      // Try to check if backend is available
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/health`);

      if (response.ok) {
        setBackendError(null);
        window.location.reload();
      } else {
        // Backend still down, keep showing error
        console.warn('Backend health check failed, keeping error UI visible');
      }
    } catch (error) {
      // Backend still down, keep showing error
      console.warn('Backend health check failed, keeping error UI visible');
    }
  };

  const handleCheckStatus = async () => {
    if (!backendError) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/health`);

      if (response.ok) {
        alert('✅ Backend server is now available!');
        setBackendError(null);
        window.location.reload();
      } else {
        alert('❌ Backend server is still unavailable. Please try again later.');
      }
    } catch (error) {
      alert('❌ Backend server is still unavailable. Please try again later.');
    }
  };

  // Show error UI if there's a backend error
  if (backendError) {
    return (
      <ServerError
        title="Backend Connection Failed"
        description={backendError.userMessage}
        showHealthCheck={true}
        onRetry={handleRetry}
        onCheckStatus={handleCheckStatus}
        className="min-h-screen"
      />
    );
  }

  return <>{children}</>;
}