'use client';

/**
 * Category Details Drawer
 * Shows detailed view of a budget category with transactions
 */

import { useBudget } from '@/lib/queries';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Edit2, X, TrendingDown } from 'lucide-react';
import { CurrencyDisplay } from '@/components/ui/currency-display';

interface CategoryDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  budgetId: string;
  budgetName?: string;
  organizationId?: string;
  onEdit?: (budgetId: string) => void;
}

export function CategoryDetailsDrawer({
  isOpen,
  onClose,
  budgetId,
  budgetName,
  organizationId,
  onEdit,
}: CategoryDetailsDrawerProps) {
  const { data: budget, isLoading } = useBudget(budgetId, {}, organizationId);

  if (!budget && !isLoading) {
    return null;
  }

  const allocated = budget?.allocatedAmount || 0;
  const spent = budget?.spentAmount || 0;
  const remaining = allocated - spent;
  const spentPercentage = allocated > 0 ? (spent / allocated) * 100 : 0;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <SheetTitle>{budgetName || budget?.name || 'Category Details'}</SheetTitle>
              <SheetDescription>
                View and manage this budget category
              </SheetDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onEdit?.(budgetId);
                onClose();
              }}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : budget ? (
          <div className="space-y-6 mt-6">
            {/* Allocation Summary */}
            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Allocated</p>
                <p className="text-lg font-semibold">
                  <CurrencyDisplay value={allocated} showCurrency />
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Spent</p>
                <p className="text-lg font-semibold">
                  <CurrencyDisplay value={spent} showCurrency />
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Remaining</p>
                <p className={`text-lg font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <CurrencyDisplay value={Math.abs(remaining)} showCurrency />
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 pt-3 border-t">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium">Spending Progress</p>
                  <p className="text-xs font-semibold">{spentPercentage.toFixed(0)}%</p>
                </div>
                <Progress value={Math.min(spentPercentage, 100)} className="h-2" />
              </div>
            </Card>

            {/* Monthly Breakdown */}
            {budget.currentPeriodStart && budget.currentPeriodEnd && (
              <Card className="p-4 space-y-3">
                <p className="text-sm font-semibold">Current Period</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Start</p>
                    <p className="font-medium">
                      {new Date(budget.currentPeriodStart).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">End</p>
                    <p className="font-medium">
                      {new Date(budget.currentPeriodEnd).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Transactions Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Recent Transactions</h3>
              {budget.transactions && budget.transactions.length > 0 ? (
                <div className="space-y-2">
                  {budget.transactions.slice(0, 5).map((transaction: any) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <TrendingDown className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {transaction.description || 'Transaction'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.date
                              ? new Date(transaction.date).toLocaleDateString()
                              : 'No date'}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-right">
                        <CurrencyDisplay value={transaction.amount || 0} showCurrency />
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-muted/50 rounded-lg text-center text-sm text-muted-foreground">
                  No transactions yet
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={() => {
                  onEdit?.(budgetId);
                  onClose();
                }}
                className="flex-1"
              >
                Edit Budget
              </Button>
              <Button variant="outline" onClick={onClose} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
