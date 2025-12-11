'use client';

/**
 * Income Allocation Tab
 * AI-powered income distribution wizard
 */

import { useIncomeAllocationSuggestions } from '@/lib/queries';
import { useBudgetsV3UIStore } from '@/lib/stores/budgets-v3-ui-store';
import { useOrganizationStore } from '@/lib/stores/organization-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

export function IncomeAllocationTab() {
  const { incomeAllocation, setIncomeAmount, setSelectedTemplate, setIncomeAllocationStep } =
    useBudgetsV3UIStore();
  const organizationId = useOrganizationStore((state) => state.selectedOrganizationId);

  const [tempAmount, setTempAmount] = useState<string>(
    incomeAllocation.incomeAmount?.toString() || ''
  );
  const [tempTemplate, setTempTemplate] = useState<string>(incomeAllocation.selectedTemplate || '');

  const { data: suggestions, isLoading } = useIncomeAllocationSuggestions(
    {
      incomeAmount: incomeAllocation.incomeAmount || 0,
      templateType: incomeAllocation.selectedTemplate || 'custom',
    },
    organizationId,
    {
      enabled:
        !!incomeAllocation.incomeAmount && !!incomeAllocation.selectedTemplate,
    }
  );

  const handleNext = () => {
    const amount = parseFloat(tempAmount);
    if (amount > 0) {
      setIncomeAmount(amount);
      setSelectedTemplate(tempTemplate);
      if (tempAmount && tempTemplate) {
        setIncomeAllocationStep('suggestions');
      }
    }
  };

  const handleReset = () => {
    setTempAmount('');
    setTempTemplate('');
    setIncomeAmount(null);
    setSelectedTemplate(null);
    setIncomeAllocationStep('input');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Input Step */}
      {incomeAllocation.step === 'input' && (
        <Card>
          <CardHeader>
            <CardTitle>Income Allocation Wizard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="income">Monthly Income</Label>
              <div className="mt-2 flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-3 text-muted-foreground">$</span>
                  <Input
                    id="income"
                    type="number"
                    placeholder="0.00"
                    value={tempAmount}
                    onChange={(e) => setTempAmount(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="template">Allocation Template</Label>
              <Select value={tempTemplate} onValueChange={setTempTemplate}>
                <SelectTrigger id="template" className="mt-2">
                  <SelectValue placeholder="Select a template..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50-30-20">50/30/20 Rule</SelectItem>
                  <SelectItem value="ynab">YNAB Method</SelectItem>
                  <SelectItem value="envelope">Envelope System</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                Choose a template to get AI-powered allocation suggestions.
              </p>
            </div>

            <Button onClick={handleNext} disabled={!tempAmount || !tempTemplate} className="w-full">
              Get Suggestions
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Suggestions Step */}
      {incomeAllocation.step === 'suggestions' && isLoading && (
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner />
        </div>
      )}

      {incomeAllocation.step === 'suggestions' && !isLoading && suggestions && (
        <Card>
          <CardHeader>
            <CardTitle>AI Allocation Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Based on your income of ${incomeAllocation.incomeAmount?.toFixed(2) || '0'} and the{' '}
              <span className="font-semibold">{incomeAllocation.selectedTemplate}</span> template:
            </p>

            <div className="space-y-4">
              {suggestions.allocations && suggestions.allocations.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {suggestions.allocations.map((allocation, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{allocation.name}</h4>
                          <span className="text-lg font-bold text-primary">
                            ${allocation.amount?.toFixed(2) || '0'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{allocation.percentage}% of income</p>
                        {allocation.description && (
                          <p className="text-xs text-muted-foreground">{allocation.description}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {suggestions.explanation && (
                    <div className="p-4 bg-secondary rounded-lg">
                      <p className="text-sm text-muted-foreground">{suggestions.explanation}</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No suggestions available</p>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset} className="flex-1">
                Back
              </Button>
              <Button
                onClick={() => setIncomeAllocationStep('review')}
                className="flex-1"
              >
                Review & Apply
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Step */}
      {incomeAllocation.step === 'review' && suggestions && (
        <Card>
          <CardHeader>
            <CardTitle>Review & Adjust Allocations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">Review your suggested allocations. You can adjust amounts if needed.</p>

            <div className="space-y-4">
              {suggestions.allocations && suggestions.allocations.map((allocation, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{allocation.name}</h4>
                    <span className="text-sm text-muted-foreground">{allocation.percentage}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${Math.min(allocation.percentage || 0, 100)}%`,
                      }}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">${allocation.amount?.toFixed(2) || '0'}</span>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-secondary rounded-lg">
              <div className="flex items-center justify-between font-semibold">
                <span>Total Monthly Income:</span>
                <span className="text-primary text-lg">${incomeAllocation.incomeAmount?.toFixed(2) || '0'}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIncomeAllocationStep('suggestions')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={() => setIncomeAllocationStep('confirm')}
                className="flex-1"
              >
                Confirm Allocations
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Step */}
      {incomeAllocation.step === 'confirm' && (
        <Card>
          <CardHeader>
            <CardTitle>Confirm & Apply Allocations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                Ready to apply your allocations? This will create envelopes for each allocation category with the specified monthly amounts.
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <p className="font-semibold">Summary:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>✓ Template: <span className="font-medium capitalize text-foreground">{incomeAllocation.selectedTemplate}</span></li>
                <li>✓ Monthly Income: <span className="font-medium text-foreground">${incomeAllocation.incomeAmount?.toFixed(2) || '0'}</span></li>
                <li>✓ Allocations will be created as separate envelopes</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIncomeAllocationStep('review')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={() => setIncomeAllocationStep('complete')}
                className="flex-1"
              >
                Apply Allocations
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complete Step */}
      {incomeAllocation.step === 'complete' && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-green-900 dark:text-green-100">✓ Allocations Applied Successfully</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-green-900 dark:text-green-100">
              Your income has been allocated into {incomeAllocation.incomeAmount ? 'envelopes' : 'envelopes'} based on the {incomeAllocation.selectedTemplate} template.
            </p>

            <div className="p-4 bg-white dark:bg-slate-950 rounded-lg border">
              <p className="text-sm font-semibold mb-2">Total Allocated:</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${incomeAllocation.incomeAmount?.toFixed(2) || '0'}
              </p>
            </div>

            <Button onClick={handleReset} className="w-full">
              Start New Allocation
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
