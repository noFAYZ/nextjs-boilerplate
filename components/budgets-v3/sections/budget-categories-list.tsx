'use client';

/**
 * Budget Categories List
 * Shows all budget categories with allocation, spending, and remaining balance
 * Main view for category-based budgeting
 */

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  TrendingDown,
  Edit2,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { CurrencyDisplay } from '@/components/ui/currency-display';

interface BudgetCategory {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  allocated: number;
  spent: number;
  limit?: number;
  transactions?: number;
}

interface BudgetCategoriesListProps {
  categories: BudgetCategory[];
  onCategoryClick?: (categoryId: string) => void;
  onEditClick?: (categoryId: string) => void;
  isLoading?: boolean;
}

function getBudgetStatus(spent: number, allocated: number) {
  if (allocated === 0) {
    return {
      label: 'Not allocated',
      color: 'text-gray-500',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      percentage: 0,
    };
  }

  const percentage = (spent / allocated) * 100;

  if (percentage > 100) {
    return {
      label: 'Over budget',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      percentage: Math.min(percentage, 100),
    };
  }

  if (percentage > 80) {
    return {
      label: 'At risk',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      percentage,
    };
  }

  return {
    label: 'On track',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    percentage,
  };
}

export function BudgetCategoriesList({
  categories,
  onCategoryClick,
  onEditClick,
  isLoading = false,
}: BudgetCategoriesListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-6">
              <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-muted rounded mb-3"></div>
              <div className="h-2 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 text-center">
          <Zap className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium text-muted-foreground">No budgets yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Create your first budget to start tracking
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {categories.map((category) => {
        const status = getBudgetStatus(category.spent, category.allocated);
        const remaining = category.allocated - category.spent;

        return (
          <Card
            key={category.id}
            className={`border-l-4 cursor-pointer transition-colors hover:bg-muted/30 ${status.borderColor}`}
            onClick={() => onCategoryClick?.(category.id)}
          >
            <CardContent className="pt-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {category.icon && <span className="text-lg">{category.icon}</span>}
                    <h3 className="font-semibold">{category.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {category.transactions ? `${category.transactions} transaction${category.transactions !== 1 ? 's' : ''}` : 'No transactions'}
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${status.color}`}>
                      {status.label}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditClick?.(category.id);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    <CurrencyDisplay value={category.spent} showCurrency /> of{' '}
                    <CurrencyDisplay value={category.allocated} showCurrency />
                  </span>
                  <span className="font-semibold">{status.percentage.toFixed(0)}%</span>
                </div>
                <Progress
                  value={status.percentage}
                  className="h-2.5"
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Allocated</p>
                  <p className="font-semibold">
                    <CurrencyDisplay value={category.allocated} showCurrency />
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Spent</p>
                  <p className="font-semibold">
                    <CurrencyDisplay value={category.spent} showCurrency />
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">
                    {remaining >= 0 ? 'Remaining' : 'Over'}
                  </p>
                  <p className={`font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <CurrencyDisplay value={Math.abs(remaining)} showCurrency />
                  </p>
                </div>
              </div>

              {/* Warning */}
              {remaining < 0 && (
                <div className="flex items-center gap-2 mt-3 p-2 bg-red-50 rounded border border-red-200 text-xs text-red-700">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  Over budget by <CurrencyDisplay value={Math.abs(remaining)} showCurrency />
                </div>
              )}

              {/* View Details Link */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t">
                <span className="text-xs text-muted-foreground">View details</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
