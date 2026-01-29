'use client';

/**
 * Budget Card Component
 * Displays a single budget with progress and actions
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';

interface BudgetCardProps {
  id: string;
  name: string;
  description?: string;
  budgetAmount: number;
  spentAmount: number;
  remaining?: number;
  cycle: 'weekly' | 'monthly' | 'yearly';
  status?: 'on-track' | 'warning' | 'over-budget';
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

const getBudgetStatus = (spent: number, budget: number): BudgetCardProps['status'] => {
  const percentage = (spent / budget) * 100;
  if (percentage > 100) return 'over-budget';
  if (percentage > 80) return 'warning';
  return 'on-track';
};

const getStatusColor = (status: BudgetCardProps['status']): string => {
  if (status === 'on-track') return 'bg-green-500';
  if (status === 'warning') return 'bg-yellow-500';
  return 'bg-red-500';
};

const getStatusLabel = (status: BudgetCardProps['status']): string => {
  if (status === 'on-track') return 'On Track';
  if (status === 'warning') return 'At Risk';
  return 'Over Budget';
};

export function BudgetCard({
  name,
  description,
  budgetAmount,
  spentAmount,
  remaining,
  cycle,
  status,
  onEdit,
  onDelete,
  onView,
}: BudgetCardProps) {
  const calculatedStatus = status || getBudgetStatus(spentAmount, budgetAmount);
  const percentage = (spentAmount / budgetAmount) * 100;
  const remainingAmount = remaining ?? budgetAmount - spentAmount;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex-1">
          <CardTitle className="text-base">{name}</CardTitle>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onView && (
              <DropdownMenuItem onClick={onView}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem onClick={onEdit}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs capitalize">
            {cycle} Budget
          </Badge>
          <Badge className={`${getStatusColor(calculatedStatus)} text-white text-xs`}>
            {getStatusLabel(calculatedStatus)}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={Math.min(percentage, 100)} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {percentage.toFixed(0)}% of budget used
          </p>
        </div>

        {/* Amount Details */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Budget</p>
            <p className="font-semibold">${budgetAmount.toFixed(2)}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Spent</p>
            <p className="font-semibold text-primary">${spentAmount.toFixed(2)}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              {remainingAmount >= 0 ? 'Remaining' : 'Over'}
            </p>
            <p
              className={`font-semibold ${
                remainingAmount >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              ${Math.abs(remainingAmount).toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
