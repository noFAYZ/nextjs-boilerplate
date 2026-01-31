'use client';

/**
 * Forecasting Tab
 * Budget forecasting and predictions view
 */

// TODO: Import forecast and insights query hooks when implemented
import { useBudgetsV3UIStore } from '@/lib/features/budgets/stores';
import { useOrganizationStore } from '@/lib/features/organization/stores';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { ForecastChart } from '@/components/modules/budgets/components/forecasting/forecast-chart';
import { ForecastEnvelopeSelector } from '@/components/modules/budgets/components/forecasting/forecast-envelope-selector';
import { ForecastPeriodSelector } from '@/components/modules/budgets/components/forecasting/forecast-period-selector';
import { SpendingInsightsCard } from '@/components/modules/budgets/components/forecasting/spending-insights-card';
import { AlertCircle, TrendingUp } from 'lucide-react';

export function ForecastingTab() {
  const { forecasting, setSelectedEnvelopeId, setDaysAhead } = useBudgetsV3UIStore();
  const organizationId = useOrganizationStore((state) => state.selectedOrganizationId);
  const { selectedEnvelopeId, daysAhead, showConfidence, showRecommendations } = forecasting;

  // TODO: Implement useEnvelopes, useEnvelopeForecast, and useSpendingInsights query hooks
  // Fetch all envelopes for the selector
  const envelopesData = null;
  const envelopesLoading = false;
  const envelopes = envelopesData?.data || [];

  const forecast = null;
  const forecastLoading = false;

  const insights = null;
  const insightsLoading = false;

  const isLoading = forecastLoading || insightsLoading || envelopesLoading;

  return (
    <div className="space-y-6">
      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ForecastEnvelopeSelector
          envelopes={envelopes}
          selectedEnvelopeId={selectedEnvelopeId}
          onSelect={setSelectedEnvelopeId}
          isLoading={envelopesLoading}
        />
        <ForecastPeriodSelector
          selectedPeriod={daysAhead}
          onSelect={setDaysAhead}
          isLoading={envelopesLoading}
        />
      </div>

      {/* Envelope Selection Notice */}
      {!selectedEnvelopeId && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="pt-6 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-blue-900 dark:text-blue-100">
              Select an envelope to view its spending forecast and insights for the next {daysAhead} days.
            </p>
          </CardContent>
        </Card>
      )}

      {selectedEnvelopeId && isLoading && (
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner />
        </div>
      )}

      {selectedEnvelopeId && !isLoading && (
        <>
          {/* Forecast Chart */}
          {forecast && (
            <ForecastChart
              data={forecast}
              showConfidence={showConfidence}
              title={`${daysAhead}-Day Spending Forecast`}
            />
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Projected Spend</p>
                  <p className="text-2xl font-bold mt-2">
                    ${forecast?.projectedTotal?.toFixed(2) || '0'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Daily Average</p>
                  <p className="text-2xl font-bold mt-2">
                    ${forecast?.dailyAverage?.toFixed(2) || '0'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Confidence Level</p>
                  <p className="text-2xl font-bold mt-2 text-green-600">
                    {forecast?.confidence ? `${(forecast.confidence * 100).toFixed(0)}%` : 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insights */}
          {insights && (
            <SpendingInsightsCard insights={insights} />
          )}

          {/* Recommendations */}
          {showRecommendations && forecast?.recommendations && forecast.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {forecast.recommendations.slice(0, 3).map((rec, index) => (
                    <div key={index} className="p-3 bg-secondary rounded-lg">
                      <p className="text-sm font-medium">{rec.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
