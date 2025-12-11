'use client';

/**
 * Allocation Suggestions List Component
 * Displays all allocation suggestions with total summary
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AllocationSuggestionCard } from './allocation-suggestion-card';
import { AlertCircle, CheckCircle } from 'lucide-react';
import type { AllocationSuggestion } from '@/lib/types/income-allocation';

interface AllocationSuggestionsListProps {
  suggestions: AllocationSuggestion[];
  incomeAmount: number;
  selectedSuggestions?: string[];
  onSelectSuggestion?: (suggestionId: string) => void;
  onEditSuggestion?: (suggestion: AllocationSuggestion) => void;
}

export function AllocationSuggestionsList({
  suggestions,
  incomeAmount,
  selectedSuggestions = [],
  onSelectSuggestion,
  onEditSuggestion,
}: AllocationSuggestionsListProps) {
  const totalAllocated = suggestions.reduce((sum, s) => sum + s.suggestedAmount, 0);
  const allocatedPercentage = (totalAllocated / incomeAmount) * 100;
  const unallocatedAmount = incomeAmount - totalAllocated;
  const isFullyAllocated = Math.abs(unallocatedAmount) < 0.01; // Allow for floating point rounding

  // Group by envelope type
  const groupedSuggestions = suggestions.reduce(
    (acc, suggestion) => {
      const type = suggestion.envelopeType || 'Other';
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(suggestion);
      return acc;
    },
    {} as Record<string, AllocationSuggestion[]>
  );

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Allocation Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Zero-Base Budgeting Status Alert */}
          <Alert className={isFullyAllocated ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}>
            <div className="flex items-start gap-3">
              {isFullyAllocated ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
              )}
              <AlertDescription className={isFullyAllocated ? 'text-green-900' : 'text-orange-900'}>
                {isFullyAllocated
                  ? '✓ Zero-base budgeting achieved! All income is allocated.'
                  : `⚠ Zero-base budgeting incomplete. ${unallocatedAmount.toFixed(2)} remaining to allocate (${(100 - allocatedPercentage).toFixed(1)}%).`}
              </AlertDescription>
            </div>
          </Alert>

          {/* Income breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Monthly Income</span>
              <span className="text-lg font-bold">${incomeAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Allocated</span>
              <span className={`text-lg font-bold ${isFullyAllocated ? 'text-green-600' : 'text-orange-600'}`}>
                ${totalAllocated.toFixed(2)}
              </span>
            </div>

            {!isFullyAllocated && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Remaining</span>
                <span className="text-lg font-bold text-orange-600">
                  ${unallocatedAmount.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span>Allocation Progress</span>
              <span className="font-medium">{allocatedPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={Math.min(allocatedPercentage, 100)} />
            {!isFullyAllocated && (
              <p className="text-xs text-muted-foreground">
                Allocate an additional ${unallocatedAmount.toFixed(2)} to achieve zero-base budgeting
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Grouped Suggestions */}
      {Object.entries(groupedSuggestions).map(([type, typeSuggestions]) => (
        <div key={type} className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {type}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {typeSuggestions.map((suggestion) => (
              <AllocationSuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                isSelected={selectedSuggestions.includes(suggestion.id)}
                onSelect={() => onSelectSuggestion?.(suggestion.id)}
                onEdit={() => onEditSuggestion?.(suggestion)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Empty state */}
      {suggestions.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            <p>No allocation suggestions available. Please try again.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
