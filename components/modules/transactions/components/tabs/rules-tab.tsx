'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Settings2 } from 'lucide-react';
import type { UnifiedTransaction } from '@/lib/types';

interface RulesTabProps {
  transaction: UnifiedTransaction;
  onFieldChange: () => void;
}

export function RulesTab({ transaction, onFieldChange }: RulesTabProps) {
  const [isRecurring, setIsRecurring] = useState(transaction.metadata?.recurring?.enabled || false);
  const [frequency, setFrequency] = useState(transaction.metadata?.recurring?.frequency || 'MONTHLY');
  const [startDate, setStartDate] = useState(
    transaction.metadata?.recurring?.startDate ? new Date(transaction.metadata.recurring.startDate) : new Date()
  );
  const [endDate, setEndDate] = useState(
    transaction.metadata?.recurring?.endDate ? new Date(transaction.metadata.recurring.endDate) : undefined
  );

  const [excludeBudgets, setExcludeBudgets] = useState(transaction.metadata?.exclusions?.budgets || false);
  const [excludeCashFlow, setExcludeCashFlow] = useState(transaction.metadata?.exclusions?.cashFlow || false);
  const [excludeReports, setExcludeReports] = useState(transaction.metadata?.exclusions?.reports || false);
  const [excludeNetWorth, setExcludeNetWorth] = useState(transaction.metadata?.exclusions?.netWorth || false);

  const handleRecurringToggle = (value: boolean) => {
    setIsRecurring(value);
    onFieldChange();
  };

  const handleFrequencyChange = (value: string) => {
    setFrequency(value);
    onFieldChange();
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      setStartDate(date);
      onFieldChange();
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    onFieldChange();
  };

  const handleExclusionChange = (type: string, value: boolean) => {
    if (type === 'budgets') setExcludeBudgets(value);
    if (type === 'cashFlow') setExcludeCashFlow(value);
    if (type === 'reports') setExcludeReports(value);
    if (type === 'netWorth') setExcludeNetWorth(value);
    onFieldChange();
  };

  return (
    <div className="space-y-4">
      {/* Create Rule Button */}
      <Button
        variant="outline"
        size="sm"
        className="w-full"
      >
        <Settings2 className="h-4 w-4 mr-2" />
        Create Rule from Transaction
      </Button>

      <Separator />

      {/* Recurring Configuration */}
      <div className="space-y-3 border rounded-lg p-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-foreground">Mark as Recurring</label>
          <Switch
            checked={isRecurring}
            onCheckedChange={handleRecurringToggle}
          />
        </div>

        {isRecurring && (
          <div className="space-y-3">
            {/* Frequency */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Frequency</label>
              <Select value={frequency} onValueChange={handleFrequencyChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAILY">Daily</SelectItem>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="BIWEEKLY">Bi-Weekly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Start Date</label>
              <DatePicker
                value={startDate}
                onChange={handleStartDateChange}
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wide">End Date (Optional)</label>
              <DatePicker
                value={endDate}
                onChange={handleEndDateChange}
              />
            </div>

            {/* Next Expected Date */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Next Expected Date</label>
              <div className="px-3 py-2 rounded-lg border border-border/50 text-sm text-foreground/60">
                —
              </div>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Exclusions */}
      <div className="space-y-3 border rounded-lg p-3">
        <p className="text-sm font-semibold text-foreground">Exclude From</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={excludeBudgets}
              onCheckedChange={(value) => handleExclusionChange('budgets', Boolean(value))}
            />
            <label className="text-xs font-medium text-foreground cursor-pointer">Budgets</label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              checked={excludeCashFlow}
              onCheckedChange={(value) => handleExclusionChange('cashFlow', Boolean(value))}
            />
            <label className="text-xs font-medium text-foreground cursor-pointer">Cash Flow</label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              checked={excludeReports}
              onCheckedChange={(value) => handleExclusionChange('reports', Boolean(value))}
            />
            <label className="text-xs font-medium text-foreground cursor-pointer">Reports</label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              checked={excludeNetWorth}
              onCheckedChange={(value) => handleExclusionChange('netWorth', Boolean(value))}
            />
            <label className="text-xs font-medium text-foreground cursor-pointer">Net Worth</label>
          </div>
        </div>
      </div>
    </div>
  );
}
