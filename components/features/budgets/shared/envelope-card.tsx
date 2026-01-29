'use client';

/**
 * Envelope Card Component
 * Displays a single envelope with current balance and status
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
import { MoreVertical, ArrowRight, Eye, Edit2, Trash2 } from 'lucide-react';

interface EnvelopeCardProps {
  id: string;
  name: string;
  envelopeType: string;
  currentBalance: number;
  budgetLimit?: number;
  monthlyAllocation?: number;
  status?: 'healthy' | 'warning' | 'depleted';
  onAllocate?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

const getEnvelopeStatus = (
  currentBalance: number,
  budgetLimit?: number,
  monthlyAllocation?: number
): EnvelopeCardProps['status'] => {
  if (!budgetLimit && !monthlyAllocation) return 'healthy';

  const target = budgetLimit || monthlyAllocation || 0;
  const percentage = (currentBalance / target) * 100;

  if (currentBalance <= 0) return 'depleted';
  if (percentage < 30) return 'warning';
  return 'healthy';
};

const getStatusColor = (status: EnvelopeCardProps['status']): string => {
  if (status === 'healthy') return 'bg-green-500';
  if (status === 'warning') return 'bg-yellow-500';
  return 'bg-red-500';
};

const getStatusLabel = (status: EnvelopeCardProps['status']): string => {
  if (status === 'healthy') return 'Healthy';
  if (status === 'warning') return 'Low Balance';
  return 'Depleted';
};

export function EnvelopeCard({
  name,
  envelopeType,
  currentBalance,
  budgetLimit,
  monthlyAllocation,
  status,
  onAllocate,
  onEdit,
  onDelete,
  onView,
}: EnvelopeCardProps) {
  const calculatedStatus = status || getEnvelopeStatus(currentBalance, budgetLimit, monthlyAllocation);
  const target = budgetLimit || monthlyAllocation;
  const percentage = target ? (currentBalance / target) * 100 : 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex-1">
          <CardTitle className="text-base">{name}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{envelopeType}</p>
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
        <Badge className={`${getStatusColor(calculatedStatus)} text-white text-xs`}>
          {getStatusLabel(calculatedStatus)}
        </Badge>

        {/* Current Balance */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">Current Balance</p>
          <p className="text-3xl font-bold text-primary">${currentBalance.toFixed(2)}</p>
        </div>

        {/* Progress (if limit set) */}
        {target && (
          <div className="space-y-2">
            <Progress value={Math.min(percentage, 100)} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {percentage.toFixed(0)}% of{' '}
              {budgetLimit ? `${budgetLimit.toFixed(2)} limit` : `${target.toFixed(2)} allocation`}
            </p>
          </div>
        )}

        {/* Allocation Info */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {monthlyAllocation && (
            <div>
              <p className="text-xs text-muted-foreground">Monthly Allocation</p>
              <p className="font-semibold">${monthlyAllocation.toFixed(2)}</p>
            </div>
          )}
          {budgetLimit && (
            <div>
              <p className="text-xs text-muted-foreground">Budget Limit</p>
              <p className="font-semibold">${budgetLimit.toFixed(2)}</p>
            </div>
          )}
        </div>

        {/* Action Button */}
        {onAllocate && (
          <Button onClick={onAllocate} className="w-full gap-2" variant="outline" size="sm">
            <ArrowRight className="h-4 w-4" />
            Allocate Funds
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
