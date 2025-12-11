'use client';

/**
 * Budgets V3 - Hybrid YNAB/Monarch Approach
 *
 * Workflow:
 * 1. See total income from all accounts
 * 2. Allocate remaining income to categories
 * 3. Track spending against allocations
 * 4. View insights and analytics
 */

import { useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useOrganizationStore } from '@/lib/stores/organization-store';
import { useBudgets, useDashboardMetrics } from '@/lib/queries';
import { usePostHogPageView } from '@/lib/hooks/usePostHogPageView';
import { useBudgetAllocation } from '@/lib/hooks/use-budget-allocation';
import { useAvailableToBudget } from '@/lib/hooks/use-available-to-budget';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// New components
import { IncomeSummary } from '@/components/budgets-v3/sections/income-summary';
import { QuickAllocate } from '@/components/budgets-v3/sections/quick-allocate';
import { BudgetCategoriesList } from '@/components/budgets-v3/sections/budget-categories-list';
import { CategoryDetailsDrawer } from '@/components/budgets-v3/sections/category-details-drawer';
import { InsightsCards } from '@/components/budgets-v3/sections/insights-cards';

// Modals
import { CreateEnvelopeModal } from '@/components/budgets-v3/modals/create-envelope-modal';
import { CreateBudgetModal } from '@/components/budgets-v3/modals/create-budget-modal';

// Store
import { useBudgetsV3UIStore } from '@/lib/stores/budgets-v3-ui-store';

export default function BudgetsV3Page() {
  usePostHogPageView('budgets-v3-hybrid');

  // Auth & Organization
  const user = useAuthStore((state) => state.user);
  const isAuthReady = !!user;
  const organizationId = useOrganizationStore((state) => state.selectedOrganizationId);

  // UI Store
  const { modals, closeCreateEnvelopeModal, closeCreateBudgetModal, openCreateBudgetModal } = useBudgetsV3UIStore();

  // Local state for drawer
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Data queries
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics(organizationId);
  const { data: budgets, isLoading: budgetsLoading } = useBudgets({}, organizationId);
  const { availableToBudget, isLoading: accountsLoading } = useAvailableToBudget(organizationId);

  // Mutations
  const { mutate: allocateBudget, isPending: isAllocating } = useBudgetAllocation();

  const isLoading = !isAuthReady || metricsLoading || budgetsLoading || accountsLoading;

  if (!isAuthReady) {
    return null;
  }

  // Calculate values
  const totalIncome = availableToBudget;
  const totalAllocated = metrics?.data?.totalAllocated || 0;
  const totalSpent = metrics?.data?.totalSpent || 0;
  const availableToAllocate = Math.max(0, totalIncome - totalAllocated);

  // Transform budget data for list component
  const budgetCategories = (budgets?.data || []).map((budget: any) => ({
    id: budget.id,
    name: budget.name,
    icon: budget.icon,
    color: budget.color,
    allocated: budget.allocatedAmount || 0,
    spent: budget.spentAmount || 0,
    limit: budget.limit,
    transactions: budget.transactionCount || 0,
  }));

  // Calculate insight metrics
  const budgetsAtRisk = budgetCategories.filter((b) => {
    const spent = b.spent || 0;
    const allocated = b.allocated || 0;
    const percentage = allocated > 0 ? (spent / allocated) * 100 : 0;
    return percentage > 80 && percentage < 100;
  }).length;

  const budgetsOverBudget = budgetCategories.filter((b) => {
    const spent = b.spent || 0;
    const allocated = b.allocated || 0;
    return spent > allocated && allocated > 0;
  }).length;

  const selectedBudget = budgetCategories.find((b) => b.id === selectedBudgetId);

  return (
    <div className="space-y-6">
      {/* Modals & Drawers */}
      <CreateEnvelopeModal
        isOpen={modals.isCreateEnvelopeModalOpen}
        onClose={closeCreateEnvelopeModal}
      />
      <CreateBudgetModal
        isOpen={modals.isCreateBudgetModalOpen}
        onClose={closeCreateBudgetModal}
      />
      <CategoryDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedBudgetId(null);
        }}
        budgetId={selectedBudgetId || ''}
        budgetName={selectedBudget?.name}
        organizationId={organizationId}
        onEdit={(budgetId) => {
          // TODO: Open edit budget modal
          setIsDrawerOpen(false);
        }}
      />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Budgets</h1>
          <p className="text-muted-foreground mt-1">Allocate income and track your spending</p>
        </div>
        <Button onClick={openCreateBudgetModal} className="gap-2">
          <Plus className="h-4 w-4" />
          New Budget
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* 1. Income Summary - Shows available money */}
          <IncomeSummary
            totalIncome={totalIncome}
            totalAllocated={totalAllocated}
            totalSpent={totalSpent}
            isLoading={metricsLoading}
          />

          {/* 2. Quick Allocate - YNAB-style allocation interface */}
          <QuickAllocate
            availableAmount={availableToAllocate}
            budgets={budgetCategories}
            onAllocate={async (budgetId, amount) => {
              allocateBudget({
                budgetId,
                amount,
                organizationId,
              });
            }}
            isLoading={budgetsLoading || isAllocating}
          />

          {/* 3. Budget Categories List - Main view of all budgets */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Budgets</h2>
            {budgetCategories.length === 0 && !budgetsLoading ? (
              <div className="p-8 text-center border border-dashed rounded-lg bg-muted/30">
                <p className="text-muted-foreground mb-4">No budgets created yet</p>
                <Button onClick={openCreateBudgetModal} variant="outline">
                  Create Your First Budget
                </Button>
              </div>
            ) : (
              <BudgetCategoriesList
                categories={budgetCategories}
                onCategoryClick={(categoryId) => {
                  setSelectedBudgetId(categoryId);
                  setIsDrawerOpen(true);
                }}
                onEditClick={(categoryId) => {
                  // TODO: Open edit modal
                  console.log('Edit category', categoryId);
                }}
                isLoading={budgetsLoading}
              />
            )}
          </div>

          {/* 4. Insights Section - Analytics */}
          <div className="pt-6 border-t">
            <h2 className="text-xl font-semibold mb-4">Insights</h2>
            <InsightsCards
              currentMonthSpent={totalSpent}
              previousMonthSpent={totalSpent * 0.9} // TODO: Get actual previous month data
              monthlyBudget={totalAllocated}
              projectedMonthlySpend={totalSpent * 1.1} // TODO: Calculate based on daily average
              budgetsAtRisk={budgetsAtRisk}
              budgetsOverBudget={budgetsOverBudget}
              isLoading={metricsLoading}
            />
          </div>
        </>
      )}
    </div>
  );
}
