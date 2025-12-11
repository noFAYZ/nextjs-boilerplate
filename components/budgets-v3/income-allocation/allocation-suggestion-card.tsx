'use client';

/**
 * Allocation Suggestion Card Component
 * Displays a single allocation suggestion with confidence badge and reasoning
 */

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { AllocationSuggestion } from '@/lib/types/income-allocation';
import { AlertCircle, Edit2, TrendingUp, TrendingDown } from 'lucide-react';

interface AllocationSuggestionCardProps {
  suggestion: AllocationSuggestion;
  onEdit?: () => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

const getConfidenceBadgeColor = (confidence: number): string => {
  if (confidence >= 0.8) return 'bg-green-500';
  if (confidence >= 0.6) return 'bg-blue-500';
  if (confidence >= 0.4) return 'bg-yellow-500';
  return 'bg-orange-500';
};

const getConfidenceLabel = (confidence: number): string => {
  if (confidence >= 0.8) return 'Very High';
  if (confidence >= 0.6) return 'High';
  if (confidence >= 0.4) return 'Moderate';
  return 'Low';
};

const getTrendIcon = (trend: string | undefined) => {
  if (trend === 'increasing') return <TrendingUp className="h-4 w-4 text-red-500" />;
  if (trend === 'decreasing') return <TrendingDown className="h-4 w-4 text-green-500" />;
  return null;
};

export function AllocationSuggestionCard({
  suggestion,
  onEdit,
  isSelected = false,
  onSelect,
}: AllocationSuggestionCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onSelect}
    >
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header with name and confidence badge */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg">{suggestion.envelopeName}</h3>
              <p className="text-sm text-muted-foreground">{suggestion.envelopeType}</p>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="secondary"
                    className={`${getConfidenceBadgeColor(suggestion.confidence)} text-white`}
                  >
                    {Math.round(suggestion.confidence * 100)}%
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getConfidenceLabel(suggestion.confidence)} confidence</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Amount and percentage */}
          <div className="flex items-baseline gap-3">
            <div>
              <span className="text-3xl font-bold">${suggestion.suggestedAmount.toFixed(2)}</span>
              <span className="text-muted-foreground ml-2">
                ({suggestion.percentage?.toFixed(1) || '0'}%)
              </span>
            </div>

            {/* Trend indicator */}
            {suggestion.trend && getTrendIcon(suggestion.trend)}
          </div>

          {/* Reasoning */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-start gap-2 p-3 bg-secondary/50 rounded-lg cursor-help">
                  <AlertCircle className="h-4 w-4 text-secondary-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-secondary-foreground line-clamp-2">
                    {suggestion.reasoning}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{suggestion.reasoning}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Match details */}
          {suggestion.matchType && (
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">
                {suggestion.matchType}
              </Badge>
              {suggestion.historicalData && (
                <Badge variant="outline" className="text-xs">
                  Based on history
                </Badge>
              )}
            </div>
          )}

          {/* Edit button */}
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="w-full gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Adjust Amount
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
