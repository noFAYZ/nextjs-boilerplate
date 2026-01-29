'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Plus, TrendingUp, AlertCircle } from 'lucide-react';
import { CurrencyDisplay } from '@/components/ui/currency-display';

interface Envelope {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  allocatedAmount: string | number;
  spentAmount: string | number;
  availableBalance: string | number;
  status: string;
  cycle?: string;
}

interface EnvelopeBudgetCardProps {
  envelope: Envelope;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onAllocate?: () => void;
}

export function EnvelopeBudgetCard({
  envelope,
  isSelected = false,
  onSelect,
  onEdit,
  onAllocate,
}: EnvelopeBudgetCardProps) {
  const allocated = typeof envelope.allocatedAmount === 'string'
    ? parseFloat(envelope.allocatedAmount)
    : envelope.allocatedAmount || 0;
  const spent = typeof envelope.spentAmount === 'string'
    ? parseFloat(envelope.spentAmount)
    : envelope.spentAmount || 0;
  const available = typeof envelope.availableBalance === 'string'
    ? parseFloat(envelope.availableBalance)
    : envelope.availableBalance || 0;

  const percentageUsed = allocated > 0 ? (spent / allocated) * 100 : 0;
  const hasAllocation = allocated > 0;

  // Color coding based on usage
  const getProgressColor = () => {
    if (percentageUsed >= 100) return 'bg-red-500';
    if (percentageUsed >= 75) return 'bg-amber-500';
    if (percentageUsed >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusColor = () => {
    if (percentageUsed >= 100) return 'border-red-200 dark:border-red-900/50';
    if (percentageUsed >= 75) return 'border-amber-200 dark:border-amber-900/50';
    if (hasAllocation) return 'border-green-200 dark:border-green-900/50';
    return 'border-border';
  };

  const getAvailableColor = () => {
    if (available < 0) return 'text-red-600 dark:text-red-400';
    if (available === 0) return 'text-muted-foreground';
    return 'text-green-600 dark:text-green-400';
  };

  return (
    <Card
      onClick={onSelect}
      className={`p-4 cursor-pointer transition-all hover:shadow-md ${getStatusColor()} ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="text-2xl">{envelope.icon || '📁'}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{envelope.name}</h3>
            <p className="text-xs text-muted-foreground capitalize">{envelope.cycle || 'Monthly'}</p>
          </div>
        </div>
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="h-8 w-8 p-0"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Amounts */}
      {hasAllocation ? (
        <>
          {/* Budget Status */}
          <div className="space-y-3">
            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground font-medium">ALLOCATED</p>
                <p className="text-sm font-semibold">
                  <CurrencyDisplay value={allocated} showCurrency />
                </p>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${getProgressColor()}`}
                  style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                />
              </div>
            </div>

            {/* Spent */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">SPENT</p>
              <p className="text-sm font-semibold">
                <CurrencyDisplay value={spent} showCurrency /> ({percentageUsed.toFixed(0)}%)
              </p>
            </div>

            {/* Available */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">AVAILABLE</p>
              <p className={`text-sm font-semibold ${getAvailableColor()}`}>
                <CurrencyDisplay value={Math.abs(available)} showCurrency />
                {available < 0 && ' over'}
              </p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="mt-4 pt-3 border-t flex items-center justify-between">
            <div className="flex items-center gap-2">
              {percentageUsed >= 100 ? (
                <>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-xs text-red-600 dark:text-red-400 font-medium">Over Budget</span>
                </>
              ) : percentageUsed >= 75 ? (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">At Risk</span>
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">On Track</span>
                </>
              )}
            </div>

            {onAllocate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAllocate();
                }}
                className="h-7 px-2 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Funds
              </Button>
            )}
          </div>
        </>
      ) : (
        /* No Allocation State */
        <div className="py-4 text-center">
          <p className="text-sm text-muted-foreground mb-3">No budget allocated yet</p>
          {onAllocate && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAllocate();
              }}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Allocate Budget
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
