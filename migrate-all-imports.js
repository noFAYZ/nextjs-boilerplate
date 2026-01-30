#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Complete mapping of old imports to new paths
const MIGRATIONS = [
  // Auth
  { old: /from ['"]@\/lib\/stores\/auth-store['"]/, new: "from '@/lib/features/auth/stores'" },
  { old: /from ['"]@\/lib\/queries\/use-auth-data['"]/, new: "from '@/lib/features/auth/queries'" },
  { old: /from ['"]@\/lib\/hooks\/useAuthSession['"]/, new: "from '@/lib/features/auth/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/use-session-timeout['"]/, new: "from '@/lib/features/auth/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/use-user-profile['"]/, new: "from '@/lib/features/auth/hooks'" },

  // Banking
  { old: /from ['"]@\/lib\/queries\/use-banking-data['"]/, new: "from '@/lib/features/banking/queries'" },
  { old: /from ['"]@\/lib\/stores\/banking-ui-store['"]/, new: "from '@/lib/features/banking/stores'" },
  { old: /from ['"]@\/lib\/stores\/banking-store['"]/, new: "from '@/lib/features/banking/stores'" },
  { old: /from ['"]@\/lib\/services\/banking-api['"]/, new: "from '@/lib/features/banking/services'" },
  { old: /from ['"]@\/lib\/services\/banking-transaction-processor['"]/, new: "from '@/lib/features/banking/services'" },

  // Budgets - queries
  { old: /from ['"]@\/lib\/queries\/use-budget-data['"]/, new: "from '@/lib/features/budgets/queries'" },
  { old: /from ['"]@\/lib\/queries\/use-budget-alerts-data['"]/, new: "from '@/lib/features/budgets/queries'" },
  { old: /from ['"]@\/lib\/queries\/use-envelope-data['"]/, new: "from '@/lib/features/budgets/queries'" },
  { old: /from ['"]@\/lib\/queries\/use-income-allocation-data['"]/, new: "from '@/lib/features/budgets/queries'" },

  // Budgets - stores
  { old: /from ['"]@\/lib\/stores\/budget-ui-store['"]/, new: "from '@/lib/features/budgets/stores'" },
  { old: /from ['"]@\/lib\/stores\/budgets-v3-ui-store['"]/, new: "from '@/lib/features/budgets/stores'" },
  { old: /from ['"]@\/lib\/stores\/envelope-ui-store['"]/, new: "from '@/lib/features/budgets/stores'" },

  // Budgets - hooks
  { old: /from ['"]@\/lib\/hooks\/use-budget-allocation['"]/, new: "from '@/lib/features/budgets/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/use-budget-dialogs['"]/, new: "from '@/lib/features/budgets/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/use-budget-filters['"]/, new: "from '@/lib/features/budgets/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/use-budget-groups['"]/, new: "from '@/lib/features/budgets/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/use-budget-modals['"]/, new: "from '@/lib/features/budgets/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/use-budget-popovers['"]/, new: "from '@/lib/features/budgets/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/use-budget-selection['"]/, new: "from '@/lib/features/budgets/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/use-available-to-budget['"]/, new: "from '@/lib/features/budgets/hooks'" },

  // Budgets - services
  { old: /from ['"]@\/lib\/services\/budget-api['"]/, new: "from '@/lib/features/budgets/services'" },
  { old: /from ['"]@\/lib\/services\/budget-alerts-api['"]/, new: "from '@/lib/features/budgets/services'" },
  { old: /from ['"]@\/lib\/services\/budget-analytics-api['"]/, new: "from '@/lib/features/budgets/services'" },
  { old: /from ['"]@\/lib\/services\/budget-forecasting-api['"]/, new: "from '@/lib/features/budgets/services'" },
  { old: /from ['"]@\/lib\/services\/budget-reports-api['"]/, new: "from '@/lib/features/budgets/services'" },
  { old: /from ['"]@\/lib\/services\/budget-templates-api['"]/, new: "from '@/lib/features/budgets/services'" },
  { old: /from ['"]@\/lib\/services\/envelope-api['"]/, new: "from '@/lib/features/budgets/services'" },
  { old: /from ['"]@\/lib\/services\/income-allocation-api['"]/, new: "from '@/lib/features/budgets/services'" },
  { old: /from ['"]@\/lib\/services\/category-envelope-api['"]/, new: "from '@/lib/features/budgets/services'" },

  // Crypto
  { old: /from ['"]@\/lib\/queries\/use-crypto-data['"]/, new: "from '@/lib/features/crypto/queries'" },
  { old: /from ['"]@\/lib\/stores\/crypto-ui-store['"]/, new: "from '@/lib/features/crypto/stores'" },
  { old: /from ['"]@\/lib\/stores\/crypto-store['"]/, new: "from '@/lib/features/crypto/stores'" },
  { old: /from ['"]@\/lib\/services\/crypto-api['"]/, new: "from '@/lib/features/crypto/services'" },
  { old: /from ['"]@\/lib\/services\/zerion-chart-api['"]/, new: "from '@/lib/features/crypto/services'" },
  { old: /from ['"]@\/lib\/hooks\/use-wallet-dock['"]/, new: "from '@/lib/features/crypto/hooks'" },

  // Transactions
  { old: /from ['"]@\/lib\/queries\/use-transactions-data['"]/, new: "from '@/lib/features/transactions/queries'" },
  { old: /from ['"]@\/lib\/stores\/transactions-ui-store['"]/, new: "from '@/lib/features/transactions/stores'" },
  { old: /from ['"]@\/lib\/services\/transactions-api['"]/, new: "from '@/lib/features/transactions/services'" },
  { old: /from ['"]@\/lib\/services\/transaction-categories-api['"]/, new: "from '@/lib/features/transactions/services'" },
  { old: /from ['"]@\/lib\/hooks\/use-transaction-table['"]/, new: "from '@/lib/features/transactions/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/use-merchants-map['"]/, new: "from '@/lib/features/transactions/hooks'" },

  // Categories
  { old: /from ['"]@\/lib\/queries\/use-categories-data['"]/, new: "from '@/lib/features/categories/queries'" },
  { old: /from ['"]@\/lib\/queries\/use-categorization-rules-data['"]/, new: "from '@/lib/features/categories/queries'" },
  { old: /from ['"]@\/lib\/queries\/use-category-groups-data['"]/, new: "from '@/lib/features/categories/queries'" },
  { old: /from ['"]@\/lib\/services\/categories-api['"]/, new: "from '@/lib/features/categories/services'" },
  { old: /from ['"]@\/lib\/services\/categorization-rules-api['"]/, new: "from '@/lib/features/categories/services'" },
  { old: /from ['"]@\/lib\/services\/category-groups-api['"]/, new: "from '@/lib/features/categories/services'" },
  { old: /from ['"]@\/lib\/services\/category-matching-api['"]/, new: "from '@/lib/features/categories/services'" },
  { old: /from ['"]@\/lib\/hooks\/use-categories-map['"]/, new: "from '@/lib/features/categories/hooks'" },

  // Accounts
  { old: /from ['"]@\/lib\/queries\/use-accounts-data['"]/, new: "from '@/lib/features/accounts/queries'" },
  { old: /from ['"]@\/lib\/stores\/accounts-ui-store['"]/, new: "from '@/lib/features/accounts/stores'" },
  { old: /from ['"]@\/lib\/stores\/account-groups-store['"]/, new: "from '@/lib/features/accounts/stores'" },
  { old: /from ['"]@\/lib\/services\/accounts-api['"]/, new: "from '@/lib/features/accounts/services'" },
  { old: /from ['"]@\/lib\/services\/accounts-categories-api['"]/, new: "from '@/lib/features/accounts/services'" },
  { old: /from ['"]@\/lib\/hooks\/use-account-groups['"]/, new: "from '@/lib/features/accounts/hooks'" },

  // Organization
  { old: /from ['"]@\/lib\/queries\/use-organization-data['"]/, new: "from '@/lib/features/organization/queries'" },
  { old: /from ['"]@\/lib\/queries\/use-organization-data-context['"]/, new: "from '@/lib/features/organization/queries'" },
  { old: /from ['"]@\/lib\/stores\/organization-store['"]/, new: "from '@/lib/features/organization/stores'" },
  { old: /from ['"]@\/lib\/stores\/organization-ui-store['"]/, new: "from '@/lib/features/organization/stores'" },
  { old: /from ['"]@\/lib\/stores\/organization-refetch-store['"]/, new: "from '@/lib/features/organization/stores'" },
  { old: /from ['"]@\/lib\/hooks\/use-org-switcher['"]/, new: "from '@/lib/features/organization/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/use-organization-refetch['"]/, new: "from '@/lib/features/organization/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/use-organization-refetch-state['"]/, new: "from '@/lib/features/organization/hooks'" },
  { old: /from ['"]@\/lib\/services\/organization-api['"]/, new: "from '@/lib/features/organization/services'" },

  // Goals
  { old: /from ['"]@\/lib\/queries\/use-goal-data['"]/, new: "from '@/lib/features/goals/queries'" },
  { old: /from ['"]@\/lib\/stores\/goals-store['"]/, new: "from '@/lib/features/goals/stores'" },
  { old: /from ['"]@\/lib\/services\/goals-api['"]/, new: "from '@/lib/features/goals/services'" },

  // Networth
  { old: /from ['"]@\/lib\/queries\/use-networth-data['"]/, new: "from '@/lib/features/networth/queries'" },
  { old: /from ['"]@\/lib\/services\/networth-api['"]/, new: "from '@/lib/features/networth/services'" },

  // Subscriptions
  { old: /from ['"]@\/lib\/queries\/use-subscription-data['"]/, new: "from '@/lib/features/subscriptions/queries'" },
  { old: /from ['"]@\/lib\/queries\/use-billing-subscription-data['"]/, new: "from '@/lib/features/subscriptions/queries'" },
  { old: /from ['"]@\/lib\/stores\/subscription-ui-store['"]/, new: "from '@/lib/features/subscriptions/stores'" },
  { old: /from ['"]@\/lib\/hooks\/use-subscription['"]/, new: "from '@/lib/features/subscriptions/hooks'" },
  { old: /from ['"]@\/lib\/services\/subscriptions-api['"]/, new: "from '@/lib/features/subscriptions/services'" },
  { old: /from ['"]@\/lib\/services\/subscription-service['"]/, new: "from '@/lib/features/subscriptions/services'" },

  // Integrations
  { old: /from ['"]@\/lib\/queries\/plaid-queries['"]/, new: "from '@/lib/features/integrations/queries'" },
  { old: /from ['"]@\/lib\/queries\/integrations-queries['"]/, new: "from '@/lib/features/integrations/queries'" },
  { old: /from ['"]@\/lib\/stores\/integrations-store['"]/, new: "from '@/lib/features/integrations/stores'" },
  { old: /from ['"]@\/lib\/hooks\/use-plaid-integration['"]/, new: "from '@/lib/features/integrations/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/useIntegrationSync['"]/, new: "from '@/lib/features/integrations/hooks'" },
  { old: /from ['"]@\/lib\/services\/integrations-api['"]/, new: "from '@/lib/features/integrations/services'" },

  // Settings
  { old: /from ['"]@\/lib\/queries\/use-settings-data['"]/, new: "from '@/lib/features/settings/queries'" },
  { old: /from ['"]@\/lib\/stores\/settings-ui-store['"]/, new: "from '@/lib/features/settings/stores'" },
  { old: /from ['"]@\/lib\/services\/settings-api['"]/, new: "from '@/lib/features/settings/services'" },

  // Onboarding
  { old: /from ['"]@\/lib\/stores\/onboarding-ui-store['"]/, new: "from '@/lib/features/onboarding/stores'" },
  { old: /from ['"]@\/lib\/hooks\/use-onboarding['"]/, new: "from '@/lib/features/onboarding/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/use-onboarding-v2['"]/, new: "from '@/lib/features/onboarding/hooks'" },

  // Shared hooks
  { old: /from ['"]@\/lib\/hooks\/useToast['"]/, new: "from '@/lib/shared/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/use-notifications['"]/, new: "from '@/lib/shared/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/use-keyboard-shortcuts['"]/, new: "from '@/lib/shared/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/use-breakpoint-value['"]/, new: "from '@/lib/shared/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/use-realtime-sync['"]/, new: "from '@/lib/shared/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/use-unified-auto-sync['"]/, new: "from '@/lib/shared/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/useSSECacheInvalidation['"]/, new: "from '@/lib/shared/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/use-csrf-initialization['"]/, new: "from '@/lib/shared/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/useConsentManager['"]/, new: "from '@/lib/shared/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/use-gtm['"]/, new: "from '@/lib/shared/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/usePostHogPageView['"]/, new: "from '@/lib/shared/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/useCursorVector['"]/, new: "from '@/lib/shared/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/use-sidebar['"]/, new: "from '@/lib/shared/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/use-cache-manager['"]/, new: "from '@/lib/shared/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/use-async-operation['"]/, new: "from '@/lib/shared/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/use-store-initialization['"]/, new: "from '@/lib/shared/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/use-realtime-sync-connection['"]/, new: "from '@/lib/shared/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/use-realtime-notifications['"]/, new: "from '@/lib/shared/hooks'" },

  // Shared stores
  { old: /from ['"]@\/lib\/stores\/global-ui-store['"]/, new: "from '@/lib/shared/stores'" },
  { old: /from ['"]@\/lib\/stores\/csrf-store['"]/, new: "from '@/lib/shared/stores'" },
  { old: /from ['"]@\/lib\/stores\/dashboard-layout-ui-store['"]/, new: "from '@/lib/shared/stores'" },
  { old: /from ['"]@\/lib\/stores\/ui-stores['"]/, new: "from '@/lib/shared/stores'" },

  // Shared services
  { old: /from ['"]@\/lib\/services\/logo-service['"]/, new: "from '@/lib/shared/services'" },
  { old: /from ['"]@\/lib\/services\/sse-manager['"]/, new: "from '@/lib/shared/services'" },
  { old: /from ['"]@\/lib\/services\/sse-cache-handler['"]/, new: "from '@/lib/shared/services'" },

  // Shared queries
  { old: /from ['"]@\/lib\/queries\/use-currency-data['"]/, new: "from '@/lib/shared/queries'" },
  { old: /from ['"]@\/lib\/queries\/use-waitlist-data['"]/, new: "from '@/lib/shared/queries'" },
  { old: /from ['"]@\/lib\/queries\/use-payment-method-data['"]/, new: "from '@/lib/shared/queries'" },

  // Core - api
  { old: /from ['"]@\/lib\/api\/account-groups['"]/, new: "from '@/lib/core/api'" },
  { old: /from ['"]@\/lib\/api-client['"]/, new: "from '@/lib/core/api'" },

  // Core - auth
  { old: /from ['"]@\/lib\/auth\/auth-client['"]/, new: "from '@/lib/core/auth'" },
  { old: /from ['"]@\/lib\/auth-client['"]/, new: "from '@/lib/core/auth'" },

  // Core - config
  { old: /from ['"]@\/lib\/config\/env['"]/, new: "from '@/lib/core/config'" },
];

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  MIGRATIONS.forEach(({ old, new: newPath }) => {
    content = content.replace(old, newPath);
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  }
  return false;
}

function walkAndMigrate(dir) {
  let count = 0;
  try {
    const entries = fs.readdirSync(dir);

    entries.forEach(entry => {
      const fullPath = path.join(dir, entry);

      if (fullPath.includes('node_modules') || fullPath.includes('.next')) return;

      try {
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          count += walkAndMigrate(fullPath);
        } else if (entry.endsWith('.ts') || entry.endsWith('.tsx')) {
          if (migrateFile(fullPath)) {
            count++;
          }
        }
      } catch (err) {
        // Ignore
      }
    });
  } catch (err) {
    // Ignore
  }

  return count;
}

console.log('🔄 Migrating ALL imports to new structure...\n');
const app = walkAndMigrate('app');
const components = walkAndMigrate('components');
const lib = walkAndMigrate('lib/features');

const total = app + components + lib;
console.log(`✅ Migrated ${total} files`);
console.log(`   - app/: ${app}`);
console.log(`   - components/: ${components}`);
console.log(`   - lib/features/: ${lib}`);
