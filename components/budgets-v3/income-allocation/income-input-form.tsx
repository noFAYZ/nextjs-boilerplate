'use client';

/**
 * Income Input Form Component
 * Allows user to input monthly income and select allocation template
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { TemplateType } from '@/lib/stores/budgets-v3-ui-store';
import { Info } from 'lucide-react';

interface IncomeInputFormProps {
  onSubmit: (income: number, template: TemplateType) => void;
  isLoading?: boolean;
  defaultIncome?: number;
  defaultTemplate?: TemplateType;
}

const TEMPLATE_DESCRIPTIONS: Record<TemplateType, { title: string; description: string }> = {
  '50-30-20': {
    title: '50/30/20 Rule',
    description: '50% needs, 30% wants, 20% savings',
  },
  ynab: {
    title: 'YNAB Method',
    description: 'You Need A Budget methodology',
  },
  envelope: {
    title: 'Envelope System',
    description: 'Traditional envelope-based allocation',
  },
  custom: {
    title: 'Custom',
    description: 'Create your own allocation',
  },
};

export function IncomeInputForm({
  onSubmit,
  isLoading = false,
  defaultIncome = undefined,
  defaultTemplate = undefined,
}: IncomeInputFormProps) {
  const [income, setIncome] = useState<string>(defaultIncome?.toString() || '');
  const [template, setTemplate] = useState<TemplateType | ''>(defaultTemplate || '');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const incomeAmount = parseFloat(income);

    if (!income || incomeAmount <= 0) {
      setError('Please enter a valid income amount');
      return;
    }

    if (!template) {
      setError('Please select an allocation template');
      return;
    }

    onSubmit(incomeAmount, template as TemplateType);
  };

  const selectedTemplateInfo = template ? TEMPLATE_DESCRIPTIONS[template as TemplateType] : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Allocation</CardTitle>
        <CardDescription>
          Enter your monthly income and select an allocation template to get AI-powered suggestions
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Income Input */}
          <div className="space-y-2">
            <Label htmlFor="income-input">Monthly Income</Label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-muted-foreground font-medium">$</span>
              <Input
                id="income-input"
                type="number"
                placeholder="0.00"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="pl-7"
                step="0.01"
                min="0"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Template Selection */}
          <div className="space-y-2">
            <Label htmlFor="template-select">Allocation Template</Label>
            <Select value={template} onValueChange={(value) => setTemplate(value as TemplateType)}>
              <SelectTrigger id="template-select" disabled={isLoading}>
                <SelectValue placeholder="Select a template..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50-30-20">50/30/20 Rule</SelectItem>
                <SelectItem value="ynab">YNAB Method</SelectItem>
                <SelectItem value="envelope">Envelope System</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>

            {/* Template Description */}
            {selectedTemplateInfo && (
              <div className="mt-3 p-3 bg-secondary rounded-lg flex gap-2">
                <Info className="h-4 w-4 text-secondary-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">{selectedTemplateInfo.title}</p>
                  <p className="text-xs text-muted-foreground">{selectedTemplateInfo.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Getting suggestions...' : 'Get AI Suggestions'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
