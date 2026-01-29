'use client';

/**
 * Confidence Bands Info Component
 * Explains confidence intervals and uncertainty in forecasts
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, TrendingUp, TrendingDown } from 'lucide-react';

interface ConfidenceBandsInfoProps {
  confidence: number;
  upperBound: number;
  lowerBound: number;
  projectedAmount: number;
  historicalVariance?: number;
}

const getConfidenceLevel = (confidence: number): { label: string; color: string; description: string } => {
  if (confidence >= 0.9) {
    return {
      label: 'Very High Confidence',
      color: 'bg-green-500',
      description: 'Forecast is highly reliable based on consistent spending patterns',
    };
  }
  if (confidence >= 0.7) {
    return {
      label: 'High Confidence',
      color: 'bg-blue-500',
      description: 'Forecast is reliable with minor variations expected',
    };
  }
  if (confidence >= 0.5) {
    return {
      label: 'Moderate Confidence',
      color: 'bg-yellow-500',
      description: 'Forecast has some uncertainty, plan for variance',
    };
  }
  return {
    label: 'Low Confidence',
    color: 'bg-orange-500',
    description: 'Forecast has high uncertainty, plan conservatively',
  };
};

export function ConfidenceBandsInfo({
  confidence,
  upperBound,
  lowerBound,
  projectedAmount,
  historicalVariance,
}: ConfidenceBandsInfoProps) {
  const confidenceInfo = getConfidenceLevel(confidence);
  const variance = upperBound - lowerBound;
  const variancePercent = (variance / projectedAmount) * 100;

  return (
    <div className="space-y-4">
      {/* Confidence Level */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Forecast Confidence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-full rounded-full ${confidenceInfo.color} opacity-20`}>
                <div
                  className={`h-full rounded-full ${confidenceInfo.color}`}
                  style={{ width: `${confidence * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold whitespace-nowrap">
                {Math.round(confidence * 100)}%
              </span>
            </div>
            <p className="text-sm font-medium">{confidenceInfo.label}</p>
            <p className="text-xs text-muted-foreground">{confidenceInfo.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Confidence Bands */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Predicted Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {/* Lower Bound */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  Minimum
                </span>
                <span className="font-medium">${lowerBound.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Conservative estimate if spending is lower than usual
              </p>
            </div>

            {/* Projected Amount */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold">Expected</span>
                <span className="text-lg font-bold text-primary">${projectedAmount.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Most likely based on historical patterns
              </p>
            </div>

            {/* Upper Bound */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Maximum
                </span>
                <span className="font-medium">${upperBound.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Conservative estimate if spending is higher than usual
              </p>
            </div>
          </div>

          {/* Variance Info */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Expected variance: <span className="font-medium">${variance.toFixed(2)}</span> (
              <span className="font-medium">{variancePercent.toFixed(1)}%</span> of projected
              amount)
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Historical Variance */}
      {historicalVariance !== undefined && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Historical Volatility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Month-to-Month Variation</span>
                <span className="text-sm font-medium">{historicalVariance.toFixed(1)}%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {historicalVariance > 20
                  ? 'This envelope has high spending variance. Plan buffer room in budget.'
                  : 'This envelope has consistent spending. Forecast is more predictable.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
