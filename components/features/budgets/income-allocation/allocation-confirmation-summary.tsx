'use client';

/**
 * Allocation Confirmation Summary Component
 * Final review of allocations before applying
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface AllocationItem {
  id: string;
  envelopeName: string;
  envelopeType: string;
  amount: number;
  wasModified: boolean;
  originalAmount?: number;
}

interface AllocationConfirmationSummaryProps {
  incomeAmount: number;
  allocations: AllocationItem[];
  templateType: string;
  onConfirm: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function AllocationConfirmationSummary({
  incomeAmount,
  allocations,
  templateType,
  onConfirm,
  onBack,
  isLoading = false,
}: AllocationConfirmationSummaryProps) {
  const totalAllocated = allocations.reduce((sum, a) => sum + a.amount, 0);
  const unallocatedAmount = incomeAmount - totalAllocated;
  const isFullyAllocated = unallocatedAmount === 0;

  // Group by envelope type
  const groupedAllocations = allocations.reduce(
    (acc, alloc) => {
      const type = alloc.envelopeType || 'Other';
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(alloc);
      return acc;
    },
    {} as Record<string, AllocationItem[]>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Review Your Allocations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Template</p>
              <p className="font-medium">{templateType}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Monthly Income</p>
              <p className="font-medium">${incomeAmount.toFixed(2)}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Total Allocated</p>
              <p className="font-medium">${totalAllocated.toFixed(2)}</p>
            </div>
          </div>

          {/* Status indicator */}
          <div className={`flex items-center gap-2 p-3 rounded-lg ${
            isFullyAllocated ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'
          }`}>
            {isFullyAllocated ? (
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className={isFullyAllocated ? 'text-green-900' : 'text-orange-900'}>
                {isFullyAllocated
                  ? 'All income allocated!'
                  : `${unallocatedAmount.toFixed(2)} remaining unallocated`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grouped Allocations */}
      {Object.entries(groupedAllocations).map(([type, items]) => (
        <div key={type} className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {type}
          </h3>

          <div className="space-y-2">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.envelopeName}</p>
                      <p className="text-sm text-muted-foreground">
                        {((item.amount / incomeAmount) * 100).toFixed(1)}% of income
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {item.wasModified && (
                        <Badge variant="outline" className="text-xs">
                          Modified
                        </Badge>
                      )}

                      <div className="text-right">
                        <p className="font-bold text-lg">${item.amount.toFixed(2)}</p>
                        {item.wasModified && item.originalAmount && (
                          <p className="text-xs text-muted-foreground line-through">
                            ${item.originalAmount.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack} disabled={isLoading} className="flex-1">
          Back to Review
        </Button>
        <Button onClick={onConfirm} disabled={isLoading || !isFullyAllocated} className="flex-1">
          {isLoading ? 'Applying...' : 'Confirm & Apply'}
        </Button>
      </div>
    </div>
  );
}
