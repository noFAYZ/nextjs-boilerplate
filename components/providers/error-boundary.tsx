'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { logger } from '@/lib/utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Error caught by boundary', error, { errorInfo });
    
    this.setState({
      error,
      errorInfo,
    });

    // Log error to monitoring service (e.g., Sentry)
    if (process.env.NODE_ENV === 'production') {
      // logErrorToService(error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
              <CardTitle className="text-2xl">Something went wrong</CardTitle>
              <CardDescription>
                We&apos;re sorry, but something unexpected happened. Please try again.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/10 dark:border-red-900/20">
                  <details className="text-sm text-red-800 dark:text-red-200">
                    <summary className="cursor-pointer font-medium mb-2">
                      Error Details (Development Only)
                    </summary>
                    <div className="mt-2 space-y-2">
                      <div>
                        <strong>Error:</strong>{' '}
                        <code className="bg-red-100 dark:bg-red-900/20 px-1 py-0.5 rounded text-xs">
                          {this.state.error?.message}
                        </code>
                      </div>
                      {this.state.error?.stack && (
                        <div>
                          <strong>Stack:</strong>
                          <pre className="mt-1 text-xs bg-red-100 dark:bg-red-900/20 p-2 rounded overflow-x-auto">
                            {this.state.error.stack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-2">
              <Button onClick={this.handleReset} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={this.handleReload} variant="outline" className="w-full">
                Reload Page
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    logger.error('Error caught by hook', error, { errorInfo });
    
    if (process.env.NODE_ENV === 'production') {
      // logErrorToService(error, errorInfo);
    }
  };
}