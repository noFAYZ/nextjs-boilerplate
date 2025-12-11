'use client';

/**
 * Budgets V3 Page
 * Main page for the hybrid budgeting system combining:
 * - Envelope budgeting
 * - Traditional budgeting
 * - Income allocation with AI suggestions
 * - Budget forecasting with predictions
 * - Financial health scoring
 * - Analytics and reporting
 */

import { useBudgetsV3UIStore } from '@/lib/stores/budgets-v3-ui-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { BudgetsV3Header } from '@/components/budgets-v3/layout/budgets-v3-header';
import { BudgetsV3TabNavigation } from '@/components/budgets-v3/layout/budgets-v3-tab-navigation';
import { OverviewTab } from '@/components/budgets-v3/tabs/overview-tab';
import { EnvelopesTab } from '@/components/budgets-v3/tabs/envelopes-tab';
import { TraditionalBudgetsTab } from '@/components/budgets-v3/tabs/traditional-budgets-tab';
import { AnalyticsTab } from '@/components/budgets-v3/tabs/analytics-tab';
import { ForecastingTab } from '@/components/budgets-v3/tabs/forecasting-tab';
import { IncomeAllocationTab } from '@/components/budgets-v3/tabs/income-allocation-tab';
import { CreateEnvelopeModal } from '@/components/budgets-v3/modals/create-envelope-modal';
import { CreateBudgetModal } from '@/components/budgets-v3/modals/create-budget-modal';
import { usePostHogPageView } from '@/lib/hooks/usePostHogPageView';

export default function BudgetsV3Page() {
  // Track page view
  usePostHogPageView('budgets-v3');

  // Get active tab and modals from store
  const { activeTab, modals, closeCreateEnvelopeModal, closeCreateBudgetModal } = useBudgetsV3UIStore();

  // Check authentication
  const user = useAuthStore((state) => state.user);
  const isAuthReady = !!user;

  if (!isAuthReady) {
    return null; // Will be redirected by auth middleware
  }

  return (
    <div>
      {/* Modals */}
      <CreateEnvelopeModal
        isOpen={modals.isCreateEnvelopeModalOpen}
        onClose={closeCreateEnvelopeModal}
      />
      <CreateBudgetModal
        isOpen={modals.isCreateBudgetModalOpen}
        onClose={closeCreateBudgetModal}
      />

      {/* Page Header */}
      <BudgetsV3Header />

      {/* Tab Navigation */}
      <BudgetsV3TabNavigation />

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'envelopes' && <EnvelopesTab />}
        {activeTab === 'traditional' && <TraditionalBudgetsTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'forecasting' && <ForecastingTab />}
        {activeTab === 'income-allocation' && <IncomeAllocationTab />}
      </div>
    </div>
  );
}
