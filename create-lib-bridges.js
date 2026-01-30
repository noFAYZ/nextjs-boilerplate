#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Bridge Migration Strategy:
 * 1. Convert old lib files to re-export from new locations
 * 2. This ensures backward compatibility while we transition
 * 3. Then we can update imports feature-by-feature
 */

// Mapping: old path → new path
const BRIDGE_MAPPINGS = {
  // Hooks
  'lib/hooks/use-account-groups.ts': 'lib/features/accounts/hooks/use-account-groups.ts',
  'lib/hooks/use-async-operation.ts': 'lib/shared/hooks/use-async-operation.ts',
  'lib/hooks/useAuthSession.ts': 'lib/features/auth/hooks/useAuthSession.ts',
  'lib/hooks/use-available-to-budget.ts': 'lib/features/budgets/hooks/use-available-to-budget.ts',
  'lib/hooks/use-breakpoint-value.ts': 'lib/shared/hooks/use-breakpoint-value.ts',
  'lib/hooks/use-budget-allocation.ts': 'lib/features/budgets/hooks/use-budget-allocation.ts',
  'lib/hooks/use-budget-dialogs.ts': 'lib/features/budgets/hooks/use-budget-dialogs.ts',
  'lib/hooks/use-budget-filters.ts': 'lib/features/budgets/hooks/use-budget-filters.ts',
  'lib/hooks/use-budget-groups.ts': 'lib/features/budgets/hooks/use-budget-groups.ts',
  'lib/hooks/use-budget-modals.ts': 'lib/features/budgets/hooks/use-budget-modals.ts',
  'lib/hooks/use-budget-popovers.ts': 'lib/features/budgets/hooks/use-budget-popovers.ts',
  'lib/hooks/use-budget-selection.ts': 'lib/features/budgets/hooks/use-budget-selection.ts',
  'lib/hooks/use-cache-manager.ts': 'lib/shared/hooks/use-cache-manager.ts',
  'lib/hooks/use-categories-map.ts': 'lib/features/categories/hooks/use-categories-map.ts',
  'lib/hooks/useConsentManager.ts': 'lib/shared/hooks/useConsentManager.ts',
  'lib/hooks/use-csrf-initialization.ts': 'lib/shared/hooks/use-csrf-initialization.ts',
  'lib/hooks/use-gtm.ts': 'lib/shared/hooks/use-gtm.ts',
  'lib/hooks/useIntegrationSync.ts': 'lib/features/integrations/hooks/useIntegrationSync.ts',
  'lib/hooks/use-keyboard-shortcuts.ts': 'lib/shared/hooks/use-keyboard-shortcuts.ts',
  'lib/hooks/use-merchants-map.ts': 'lib/features/transactions/hooks/use-merchants-map.ts',
  'lib/hooks/use-notifications.ts': 'lib/shared/hooks/use-notifications.ts',
  'lib/hooks/usePostHogPageView.ts': 'lib/shared/hooks/usePostHogPageView.ts',
  'lib/hooks/use-realtime-notifications.ts': 'lib/shared/hooks/use-realtime-notifications.ts',
  'lib/hooks/use-realtime-sync.tsx': 'lib/shared/hooks/use-realtime-sync.tsx',
  'lib/hooks/use-realtime-sync-connection.ts': 'lib/shared/hooks/use-realtime-sync-connection.ts',
  'lib/hooks/use-session-timeout.ts': 'lib/features/auth/hooks/use-session-timeout.ts',
  'lib/hooks/use-sidebar.ts': 'lib/shared/hooks/use-sidebar.ts',
  'lib/hooks/use-store-initialization.ts': 'lib/shared/hooks/use-store-initialization.ts',
  'lib/hooks/use-subscription.ts': 'lib/features/subscriptions/hooks/use-subscription.ts',
  'lib/hooks/use-transaction-table.ts': 'lib/features/transactions/hooks/use-transaction-table.ts',
  'lib/hooks/use-unified-auto-sync.ts': 'lib/shared/hooks/use-unified-auto-sync.ts',
  'lib/hooks/useSSECacheInvalidation.ts': 'lib/shared/hooks/useSSECacheInvalidation.ts',
  'lib/hooks/useCursorVector.tsx': 'lib/shared/hooks/useCursorVector.tsx',
  'lib/hooks/use-org-switcher.ts': 'lib/features/organization/hooks/use-org-switcher.ts',
  'lib/hooks/use-organization-refetch.ts': 'lib/features/organization/hooks/use-organization-refetch.ts',
  'lib/hooks/use-organization-refetch-state.ts': 'lib/features/organization/hooks/use-organization-refetch-state.ts',
  'lib/hooks/use-plaid-integration.ts': 'lib/features/integrations/hooks/use-plaid-integration.ts',
  'lib/hooks/use-user-profile.ts': 'lib/features/auth/hooks/use-user-profile.ts',
  'lib/hooks/use-wallet-dock.ts': 'lib/features/crypto/hooks/use-wallet-dock.ts',
  'lib/hooks/useToast.ts': 'lib/shared/hooks/useToast.ts',

  // Stores
  'lib/stores/accounts-ui-store.ts': 'lib/features/accounts/stores/accounts-ui-store.ts',
  'lib/stores/account-groups-store.ts': 'lib/features/accounts/stores/account-groups-store.ts',
  'lib/stores/auth-store.ts': 'lib/features/auth/stores/auth-store.ts',
  'lib/stores/banking-ui-store.ts': 'lib/features/banking/stores/banking-ui-store.ts',
  'lib/stores/banking-store.ts': 'lib/features/banking/stores/banking-store.ts',
  'lib/stores/budget-ui-store.ts': 'lib/features/budgets/stores/budget-ui-store.ts',
  'lib/stores/budgets-v3-ui-store.ts': 'lib/features/budgets/stores/budgets-v3-ui-store.ts',
  'lib/stores/crypto-ui-store.ts': 'lib/features/crypto/stores/crypto-ui-store.ts',
  'lib/stores/crypto-store.ts': 'lib/features/crypto/stores/crypto-store.ts',
  'lib/stores/csrf-store.ts': 'lib/shared/stores/csrf-store.ts',
  'lib/stores/dashboard-layout-ui-store.ts': 'lib/shared/stores/dashboard-layout-ui-store.ts',
  'lib/stores/envelope-ui-store.ts': 'lib/features/budgets/stores/envelope-ui-store.ts',
  'lib/stores/global-ui-store.ts': 'lib/shared/stores/global-ui-store.ts',
  'lib/stores/goals-store.ts': 'lib/features/goals/stores/goals-store.ts',
  'lib/stores/integrations-store.ts': 'lib/features/integrations/stores/integrations-store.ts',
  'lib/stores/organization-refetch-store.ts': 'lib/features/organization/stores/organization-refetch-store.ts',
  'lib/stores/organization-store.ts': 'lib/features/organization/stores/organization-store.ts',
  'lib/stores/organization-ui-store.ts': 'lib/features/organization/stores/organization-ui-store.ts',
  'lib/stores/settings-ui-store.ts': 'lib/features/settings/stores/settings-ui-store.ts',
  'lib/stores/subscription-ui-store.ts': 'lib/features/subscriptions/stores/subscription-ui-store.ts',
  'lib/stores/transactions-ui-store.ts': 'lib/features/transactions/stores/transactions-ui-store.ts',

  // Queries - direct re-exports to features
  'lib/queries/use-accounts-data.ts': 'lib/features/accounts/queries/use-accounts-data.ts',
  'lib/queries/use-auth-data.ts': 'lib/features/auth/queries/use-auth-data.ts',
  'lib/queries/use-banking-data.ts': 'lib/features/banking/queries/use-banking-data.ts',
  'lib/queries/use-budget-data.ts': 'lib/features/budgets/queries/use-budget-data.ts',
  'lib/queries/use-budget-alerts-data.ts': 'lib/features/budgets/queries/use-budget-data.ts',
  'lib/queries/use-budget-analytics-data.ts': 'lib/features/budgets/queries/use-budget-data.ts',
  'lib/queries/use-budget-forecasting-data.ts': 'lib/features/budgets/queries/use-budget-data.ts',
  'lib/queries/use-budget-reports-data.ts': 'lib/features/budgets/queries/use-budget-data.ts',
  'lib/queries/use-budget-templates-data.ts': 'lib/features/budgets/queries/use-budget-data.ts',
  'lib/queries/use-categories-data.ts': 'lib/features/categories/queries/use-categories-data.ts',
  'lib/queries/use-category-groups-data.ts': 'lib/features/categories/queries/use-categories-data.ts',
  'lib/queries/use-category-envelope-data.ts': 'lib/features/budgets/queries/use-budget-data.ts',
  'lib/queries/use-categorization-rules-data.ts': 'lib/features/categories/queries/use-categories-data.ts',
  'lib/queries/use-category-matching-data.ts': 'lib/features/categories/queries/use-categories-data.ts',
  'lib/queries/use-crypto-data.ts': 'lib/features/crypto/queries/use-crypto-data.ts',
  'lib/queries/use-currency-data.ts': 'lib/shared/queries/use-currency-data.ts',
  'lib/queries/use-envelope-data.ts': 'lib/features/budgets/queries/use-budget-data.ts',
  'lib/queries/use-goal-data.ts': 'lib/features/goals/queries/use-goal-data.ts',
  'lib/queries/use-income-allocation-data.ts': 'lib/features/budgets/queries/use-budget-data.ts',
  'lib/queries/use-networth-data.ts': 'lib/features/networth/queries/use-networth-data.ts',
  'lib/queries/use-organization-data.ts': 'lib/features/organization/queries/use-organization-data.ts',
  'lib/queries/use-organization-data-context.ts': 'lib/features/organization/queries/use-organization-data.ts',
  'lib/queries/use-payment-method-data.ts': 'lib/shared/queries/use-payment-method-data.ts',
  'lib/queries/use-subscription-data.ts': 'lib/features/subscriptions/queries/use-subscription-data.ts',
  'lib/queries/use-billing-subscription-data.ts': 'lib/features/subscriptions/queries/use-subscription-data.ts',
  'lib/queries/use-transactions-data.ts': 'lib/features/transactions/queries/use-transactions-data.ts',
  'lib/queries/use-transaction-categories-data.ts': 'lib/features/categories/queries/use-categories-data.ts',
  'lib/queries/use-waitlist-data.ts': 'lib/shared/queries/use-waitlist-data.ts',

  // Services - direct re-exports to features
  'lib/services/accounts-api.ts': 'lib/features/accounts/services/accounts-api.ts',
  'lib/services/accounts-categories-api.ts': 'lib/features/accounts/services/accounts-categories-api.ts',
  'lib/services/account-groups.ts': 'lib/features/accounts/services/accounts-api.ts',
  'lib/services/banking-api.ts': 'lib/features/banking/services/banking-api.ts',
  'lib/services/banking-transaction-processor.ts': 'lib/features/banking/services/banking-transaction-processor.ts',
  'lib/services/budget-alerts-api.ts': 'lib/features/budgets/services/budget-alerts-api.ts',
  'lib/services/budget-analytics-api.ts': 'lib/features/budgets/services/budget-analytics-api.ts',
  'lib/services/budget-api.ts': 'lib/features/budgets/services/budget-api.ts',
  'lib/services/budget-forecasting-api.ts': 'lib/features/budgets/services/budget-forecasting-api.ts',
  'lib/services/budget-reports-api.ts': 'lib/features/budgets/services/budget-reports-api.ts',
  'lib/services/budget-templates-api.ts': 'lib/features/budgets/services/budget-templates-api.ts',
  'lib/services/categories-api.ts': 'lib/features/categories/services/categories-api.ts',
  'lib/services/category-groups-api.ts': 'lib/features/categories/services/category-groups-api.ts',
  'lib/services/category-matching-api.ts': 'lib/features/categories/services/category-matching-api.ts',
  'lib/services/categorization-rules-api.ts': 'lib/features/categories/services/categorization-rules-api.ts',
  'lib/services/crypto-api.ts': 'lib/features/crypto/services/crypto-api.ts',
  'lib/services/envelope-api.ts': 'lib/features/budgets/services/envelope-api.ts',
  'lib/services/goals-api.ts': 'lib/features/goals/services/goals-api.ts',
  'lib/services/income-allocation-api.ts': 'lib/features/budgets/services/income-allocation-api.ts',
  'lib/services/integrations-api.ts': 'lib/features/integrations/services/integrations-api.ts',
  'lib/services/logo-service.ts': 'lib/shared/services/logo-service.ts',
  'lib/services/networth-api.ts': 'lib/features/networth/services/networth-api.ts',
  'lib/services/organization-api.ts': 'lib/features/organization/services/organization-api.ts',
  'lib/services/settings-api.ts': 'lib/features/settings/services/settings-api.ts',
  'lib/services/sse-cache-handler.ts': 'lib/shared/services/sse-cache-handler.ts',
  'lib/services/sse-manager.ts': 'lib/shared/services/sse-manager.ts',
  'lib/services/subscriptions-api.ts': 'lib/features/subscriptions/services/subscriptions-api.ts',
  'lib/services/subscription-service.ts': 'lib/features/subscriptions/services/subscription-service.ts',
  'lib/services/transactions-api.ts': 'lib/features/transactions/services/transactions-api.ts',
  'lib/services/transaction-categories-api.ts': 'lib/features/categories/services/transaction-categories-api.ts',
  'lib/services/user-service.ts': 'lib/features/auth/services/user-service.ts',
  'lib/services/zerion-chart-api.ts': 'lib/features/crypto/services/zerion-chart-api.ts',
};

function createBridgeFile(oldPath, newPath) {
  const extension = path.extname(oldPath);
  const relativeNewPath = newPath;

  const bridgeContent = `// Bridge: Re-export from new modular location
export * from '${relativeNewPath}';
`;

  fs.writeFileSync(oldPath, bridgeContent, 'utf-8');
  return true;
}

function createBridges() {
  let count = 0;
  let skipped = 0;

  Object.entries(BRIDGE_MAPPINGS).forEach(([oldPath, newPath]) => {
    // Calculate relative path for import statement
    const oldDir = path.dirname(oldPath);
    const relative = path.relative(oldDir, newPath);

    try {
      const fullOldPath = oldPath;

      // Check if old file exists
      if (fs.existsSync(fullOldPath)) {
        createBridgeFile(fullOldPath, './' + relative.replace(/\\/g, '/'));
        count++;
      } else {
        skipped++;
      }
    } catch (error) {
      console.error(`Error processing ${oldPath}:`, error.message);
    }
  });

  console.log(`\n✅ Created bridge files:`);
  console.log(`   - Updated: ${count} files`);
  console.log(`   - Skipped: ${skipped} files (didn't exist)`);
}

createBridges();
