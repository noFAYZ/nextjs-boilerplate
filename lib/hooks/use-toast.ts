'use client';

import { useCallback } from 'react';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

// Simple console-based implementation for development
// In a real app, you'd want to use a proper toast library like sonner or react-hot-toast
export function useToast() {
  const toast = useCallback((options: ToastOptions) => {
    const message = options.description ? `${options.title}: ${options.description}` : options.title;
    
    if (options.variant === 'destructive') {
      console.log(`[Toast Error] ${message}`);
    } else {
      console.log(`[Toast] ${message}`);
    }
    
    // You can extend this to show actual toast notifications
    // For now, just showing in console for development
  }, []);

  return { toast };
}