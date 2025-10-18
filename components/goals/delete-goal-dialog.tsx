'use client';

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2, Target, TrendingUp } from 'lucide-react';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { Goal } from '@/lib/types/goals';
import { cn } from '@/lib/utils';

interface DeleteGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: Goal | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteGoalDialog({
  open,
  onOpenChange,
  goal,
  onConfirm,
  isLoading = false,
}: DeleteGoalDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  if (!goal) return null;

  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const milestoneCount = goal.milestones?.length || 0;
  const achievedMilestones = goal.milestones?.filter(m => m.isAchieved).length || 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <AlertDialogTitle>Delete Goal?</AlertDialogTitle>
            </div>
          </div>
        </AlertDialogHeader>
        <div className="space-y-4 pt-4">
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{goal.name}</strong>?
          </AlertDialogDescription>

          {/* Goal Progress Summary */}
          <div className="p-4 rounded-lg bg-muted/50 border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Progress</span>
              <span className="text-sm font-semibold">{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} className="h-2" />

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Current Amount</p>
                <CurrencyDisplay amountUSD={goal.currentAmount} className="text-sm font-semibold" />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Target Amount</p>
                <CurrencyDisplay amountUSD={goal.targetAmount} className="text-sm font-semibold" />
              </div>
            </div>

            {milestoneCount > 0 && (
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-muted-foreground">Milestones</span>
                <Badge variant="secondary" size="sm" className="text-xs">
                  {achievedMilestones}/{milestoneCount} completed
                </Badge>
              </div>
            )}

            {goal.isAchieved && (
              <div className="flex items-center gap-2 pt-2 border-t">
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  This goal has been achieved!
                </span>
              </div>
            )}
          </div>

          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <p className="text-sm text-amber-600 dark:text-amber-400">
              <strong>Warning:</strong> This action cannot be undone. All progress, milestones, and contributions will be permanently removed.
            </p>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? 'Deleting...' : 'Delete Goal'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
