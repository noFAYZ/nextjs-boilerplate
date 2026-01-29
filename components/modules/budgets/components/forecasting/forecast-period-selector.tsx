'use client';

/**
 * Forecast Period Selector Component
 * Allows users to select forecast horizon (30, 60, or 90 days)
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Calendar, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type ForecastPeriod = 30 | 60 | 90;

interface ForecastPeriodSelectorProps {
  selectedPeriod: ForecastPeriod;
  onSelect: (period: ForecastPeriod) => void;
  isLoading?: boolean;
}

const PERIOD_OPTIONS: Array<{
  value: ForecastPeriod;
  label: string;
  description: string;
  accuracy: 'high' | 'medium' | 'low';
}> = [
  {
    value: 30,
    label: '1 Month',
    description: 'Detailed forecast for the next 30 days',
    accuracy: 'high',
  },
  {
    value: 60,
    label: '2 Months',
    description: 'Medium-term forecast for 30-60 days ahead',
    accuracy: 'medium',
  },
  {
    value: 90,
    label: '3 Months',
    description: 'Long-term forecast for 60-90 days ahead',
    accuracy: 'low',
  },
];

const getAccuracyColor = (accuracy: string): string => {
  if (accuracy === 'high') return 'bg-green-500';
  if (accuracy === 'medium') return 'bg-yellow-500';
  return 'bg-orange-500';
};

const getAccuracyLabel = (accuracy: string): string => {
  if (accuracy === 'high') return 'High Confidence';
  if (accuracy === 'medium') return 'Medium Confidence';
  return 'Lower Confidence';
};

export function ForecastPeriodSelector({
  selectedPeriod,
  onSelect,
  isLoading = false,
}: ForecastPeriodSelectorProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Forecast Period
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <RadioGroup value={selectedPeriod.toString()} onValueChange={(v) => onSelect(parseInt(v) as ForecastPeriod)}>
            <div className="space-y-3">
              {PERIOD_OPTIONS.map((option) => (
                <Label
                  key={option.value}
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedPeriod === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-secondary bg-secondary/30 hover:border-primary/50'
                  }`}
                >
                  <RadioGroupItem
                    value={option.value.toString()}
                    disabled={isLoading}
                    className="mt-1"
                  />

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{option.label}</span>
                      <Badge
                        className={`${getAccuracyColor(option.accuracy)} text-white text-xs`}
                      >
                        {getAccuracyLabel(option.accuracy)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </Label>
              ))}
            </div>
          </RadioGroup>

          {/* Accuracy Info */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              {selectedPeriod === 30 &&
                'Short-term forecasts are most accurate. Based on recent spending patterns and known upcoming transactions.'}
              {selectedPeriod === 60 &&
                'Medium-term forecasts account for seasonal variations. Some uncertainty expected.'}
              {selectedPeriod === 90 &&
                'Long-term forecasts are less precise. Best used for budget planning rather than exact predictions.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <p className="text-sm font-medium">Forecast Tips</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Shorter periods are more accurate</li>
              <li>Consider seasonal spending patterns</li>
              <li>Account for planned large purchases</li>
              <li>Review confidence bands for uncertainty</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
