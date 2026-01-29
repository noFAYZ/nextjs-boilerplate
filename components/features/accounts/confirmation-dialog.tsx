'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2, PowerOff, Power } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  action: 'delete' | 'deactivate' | 'reactivate';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  action,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const actionConfig = {
    delete: {
      icon: Trash2,
      label: 'Delete',
      buttonClass: 'hover:bg-destructive/10 hover:text-destructive focus:ring-destructive/50',
    },
    deactivate: {
      icon: PowerOff,
      label: 'Deactivate',
      buttonClass: 'hover:bg-yellow-500/10 hover:text-yellow-700 dark:hover:text-yellow-400 focus:ring-yellow-500/50',
    },
    reactivate: {
      icon: Power,
      label: 'Reactivate',
      buttonClass: 'hover:bg-green-500/10 hover:text-green-700 dark:hover:text-green-400 focus:ring-green-500/50',
    },
  };

  const config = actionConfig[action];
  const IconComponent = config.icon;

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', action === 'delete' && 'bg-destructive/10', action === 'deactivate' && 'bg-yellow-500/10', action === 'reactivate' && 'bg-green-500/10')}>
              <IconComponent
                className={cn(
                  'h-5 w-5',
                  action === 'delete' && 'text-destructive',
                  action === 'deactivate' && 'text-yellow-600 dark:text-yellow-400',
                  action === 'reactivate' && 'text-green-600 dark:text-green-400'
                )}
              />
            </div>
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading} className="flex-1 sm:flex-none">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn(
              'flex-1 sm:flex-none gap-2',
              action === 'delete' && 'bg-destructive hover:bg-destructive/90 text-white',
              action === 'deactivate' && 'bg-yellow-600 hover:bg-yellow-700 text-white dark:bg-yellow-600 dark:hover:bg-yellow-700',
              action === 'reactivate' && 'bg-green-600 hover:bg-green-700 text-white'
            )}
          >
            {isLoading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            {config.label}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
