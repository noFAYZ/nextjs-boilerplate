'use client';

/**
 * Budgets V3 Page Header
 * Displays page title, description, and quick action buttons
 */

import { Button } from '@/components/ui/button';
import { useBudgetsV3UIStore } from '@/lib/stores/budgets-v3-ui-store';
import { PlusIcon, ArrowDownIcon, FileDownIcon, Zap } from 'lucide-react';

export function BudgetsV3Header() {
  const { setActiveTab, openCreateEnvelopeModal, openCreateBudgetModal } = useBudgetsV3UIStore();

  return (
    <div className="space-y-6 pb-6">
      {/* Title and Description */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-amber-500" />
          <h1 className="text-3xl font-bold">Budget Management</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Manage your envelopes, budgets, and allocate your income with AI-powered suggestions
        </p>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          className="gap-2"
          onClick={() => openCreateEnvelopeModal()}
        >
          <PlusIcon className="h-4 w-4" />
          New Envelope
        </Button>

        <Button
          variant="outline"
          className="gap-2"
          onClick={() => openCreateBudgetModal()}
        >
          <PlusIcon className="h-4 w-4" />
          New Budget
        </Button>

        <Button
          variant="outline"
          className="gap-2"
          onClick={() => {
            setActiveTab('income-allocation');
          }}
        >
          <ArrowDownIcon className="h-4 w-4" />
          Income Allocation
        </Button>

        <Button
          variant="outline"
          className="gap-2"
          onClick={() => {
            // Export functionality could be added here
            alert('Export feature coming soon');
          }}
        >
          <FileDownIcon className="h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
}
