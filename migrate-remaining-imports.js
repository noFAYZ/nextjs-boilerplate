#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Migrate ALL remaining imports from old lib paths to new modular structure
 * Run this AFTER lib/features structure is created and lib/core is moved
 */

const IMPORT_MAPPINGS = [
  // Auth
  { old: "'@/lib/stores/auth-store'", new: "'@/lib/features/auth/stores'" },
  { old: '"@/lib/stores/auth-store"', new: '"@/lib/features/auth/stores"' },
  { old: "'@/lib/hooks/useAuthSession'", new: "'@/lib/features/auth/hooks'" },
  { old: '"@/lib/hooks/useAuthSession"', new: '"@/lib/features/auth/hooks"' },
  { old: "'@/lib/hooks/use-session-timeout'", new: "'@/lib/features/auth/hooks'" },
  { old: '"@/lib/hooks/use-session-timeout"', new: '"@/lib/features/auth/hooks"' },
  { old: "'@/lib/hooks/use-user-profile'", new: "'@/lib/features/auth/hooks'" },
  { old: '"@/lib/hooks/use-user-profile"', new: '"@/lib/features/auth/hooks"' },
  { old: "'@/lib/queries/use-auth-data'", new: "'@/lib/features/auth/queries'" },
  { old: '"@/lib/queries/use-auth-data"', new: '"@/lib/features/auth/queries"' },
  { old: "'@/lib/services/user-service'", new: "'@/lib/features/auth/services'" },
  { old: '"@/lib/services/user-service"', new: '"@/lib/features/auth/services"' },

  // Accounts
  { old: "'@/lib/stores/accounts-ui-store'", new: "'@/lib/features/accounts/stores'" },
  { old: '"@/lib/stores/accounts-ui-store"', new: '"@/lib/features/accounts/stores"' },
  { old: "'@/lib/stores/account-groups-store'", new: "'@/lib/features/accounts/stores'" },
  { old: '"@/lib/stores/account-groups-store"', new: '"@/lib/features/accounts/stores"' },
  { old: "'@/lib/hooks/use-account-groups'", new: "'@/lib/features/accounts/hooks'" },
  { old: '"@/lib/hooks/use-account-groups"', new: '"@/lib/features/accounts/hooks"' },
  { old: "'@/lib/queries/use-accounts-data'", new: "'@/lib/features/accounts/queries'" },
  { old: '"@/lib/queries/use-accounts-data"', new: '"@/lib/features/accounts/queries"' },
  { old: "'@/lib/services/accounts-api'", new: "'@/lib/features/accounts/services'" },
  { old: '"@/lib/services/accounts-api"', new: '"@/lib/features/accounts/services"' },
  { old: "'@/lib/api/account-groups'", new: "'@/lib/features/accounts/services/accounts-api'" },
  { old: '"@/lib/api/account-groups"', new: '"@/lib/features/accounts/services/accounts-api"' },
  { old: "'@/lib/api/account-groups-settings'", new: "'@/lib/features/accounts/services/accounts-api'" },
  { old: '"@/lib/api/account-groups-settings"', new: '"@/lib/features/accounts/services/accounts-api"' },

  // Banking
  { old: "'@/lib/stores/banking-ui-store'", new: "'@/lib/features/banking/stores'" },
  { old: '"@/lib/stores/banking-ui-store"', new: '"@/lib/features/banking/stores"' },
  { old: "'@/lib/stores/banking-store'", new: "'@/lib/features/banking/stores'" },
  { old: '"@/lib/stores/banking-store"', new: '"@/lib/features/banking/stores"' },
  { old: "'@/lib/queries/use-banking-data'", new: "'@/lib/features/banking/queries'" },
  { old: '"@/lib/queries/use-banking-data"', new: '"@/lib/features/banking/queries"' },
  { old: "'@/lib/services/banking-api'", new: "'@/lib/features/banking/services'" },
  { old: '"@/lib/services/banking-api"', new: '"@/lib/features/banking/services"' },
  { old: "'@/lib/services/banking-transaction-processor'", new: "'@/lib/features/banking/services'" },
  { old: '"@/lib/services/banking-transaction-processor"', new: '"@/lib/features/banking/services"' },

  // Budgets
  { old: "'@/lib/stores/budget-ui-store'", new: "'@/lib/features/budgets/stores'" },
  { old: '"@/lib/stores/budget-ui-store"', new: '"@/lib/features/budgets/stores"' },
  { old: "'@/lib/stores/budgets-v3-ui-store'", new: "'@/lib/features/budgets/stores'" },
  { old: '"@/lib/stores/budgets-v3-ui-store"', new: '"@/lib/features/budgets/stores"' },
  { old: "'@/lib/stores/envelope-ui-store'", new: "'@/lib/features/budgets/stores'" },
  { old: '"@/lib/stores/envelope-ui-store"', new: '"@/lib/features/budgets/stores"' },
  { old: "'@/lib/queries/use-budget-data'", new: "'@/lib/features/budgets/queries'" },
  { old: '"@/lib/queries/use-budget-data"', new: '"@/lib/features/budgets/queries"' },
  { old: "'@/lib/queries/use-budget-alerts-data'", new: "'@/lib/features/budgets/queries'" },
  { old: '"@/lib/queries/use-budget-alerts-data"', new: '"@/lib/features/budgets/queries"' },
  { old: "'@/lib/queries/use-budget-analytics-data'", new: "'@/lib/features/budgets/queries'" },
  { old: '"@/lib/queries/use-budget-analytics-data"', new: '"@/lib/features/budgets/queries"' },
  { old: "'@/lib/queries/use-budget-forecasting-data'", new: "'@/lib/features/budgets/queries'" },
  { old: '"@/lib/queries/use-budget-forecasting-data"', new: '"@/lib/features/budgets/queries"' },
  { old: "'@/lib/queries/use-budget-reports-data'", new: "'@/lib/features/budgets/queries'" },
  { old: '"@/lib/queries/use-budget-reports-data"', new: '"@/lib/features/budgets/queries"' },
  { old: "'@/lib/queries/use-budget-templates-data'", new: "'@/lib/features/budgets/queries'" },
  { old: '"@/lib/queries/use-budget-templates-data"', new: '"@/lib/features/budgets/queries"' },
  { old: "'@/lib/queries/use-envelope-data'", new: "'@/lib/features/budgets/queries'" },
  { old: '"@/lib/queries/use-envelope-data"', new: '"@/lib/features/budgets/queries"' },
  { old: "'@/lib/queries/use-income-allocation-data'", new: "'@/lib/features/budgets/queries'" },
  { old: '"@/lib/queries/use-income-allocation-data"', new: '"@/lib/features/budgets/queries"' },
  { old: "'@/lib/hooks/use-budget-allocation'", new: "'@/lib/features/budgets/hooks'" },
  { old: '"@/lib/hooks/use-budget-allocation"', new: '"@/lib/features/budgets/hooks"' },
  { old: "'@/lib/hooks/use-budget-dialogs'", new: "'@/lib/features/budgets/hooks'" },
  { old: '"@/lib/hooks/use-budget-dialogs"', new: '"@/lib/features/budgets/hooks"' },
  { old: "'@/lib/hooks/use-budget-filters'", new: "'@/lib/features/budgets/hooks'" },
  { old: '"@/lib/hooks/use-budget-filters"', new: '"@/lib/features/budgets/hooks"' },
  { old: "'@/lib/hooks/use-budget-groups'", new: "'@/lib/features/budgets/hooks'" },
  { old: '"@/lib/hooks/use-budget-groups"', new: '"@/lib/features/budgets/hooks"' },
  { old: "'@/lib/hooks/use-budget-modals'", new: "'@/lib/features/budgets/hooks'" },
  { old: '"@/lib/hooks/use-budget-modals"', new: '"@/lib/features/budgets/hooks"' },
  { old: "'@/lib/hooks/use-budget-popovers'", new: "'@/lib/features/budgets/hooks'" },
  { old: '"@/lib/hooks/use-budget-popovers"', new: '"@/lib/features/budgets/hooks"' },
  { old: "'@/lib/hooks/use-budget-selection'", new: "'@/lib/features/budgets/hooks'" },
  { old: '"@/lib/hooks/use-budget-selection"', new: '"@/lib/features/budgets/hooks"' },
  { old: "'@/lib/hooks/use-available-to-budget'", new: "'@/lib/features/budgets/hooks'" },
  { old: '"@/lib/hooks/use-available-to-budget"', new: '"@/lib/features/budgets/hooks"' },
  { old: "'@/lib/services/budget-api'", new: "'@/lib/features/budgets/services'" },
  { old: '"@/lib/services/budget-api"', new: '"@/lib/features/budgets/services"' },

  // Crypto
  { old: "'@/lib/stores/crypto-ui-store'", new: "'@/lib/features/crypto/stores'" },
  { old: '"@/lib/stores/crypto-ui-store"', new: '"@/lib/features/crypto/stores"' },
  { old: "'@/lib/stores/crypto-store'", new: "'@/lib/features/crypto/stores'" },
  { old: '"@/lib/stores/crypto-store"', new: '"@/lib/features/crypto/stores"' },
  { old: "'@/lib/queries/use-crypto-data'", new: "'@/lib/features/crypto/queries'" },
  { old: '"@/lib/queries/use-crypto-data"', new: '"@/lib/features/crypto/queries"' },
  { old: "'@/lib/hooks/use-wallet-dock'", new: "'@/lib/features/crypto/hooks'" },
  { old: '"@/lib/hooks/use-wallet-dock"', new: '"@/lib/features/crypto/hooks"' },
  { old: "'@/lib/services/crypto-api'", new: "'@/lib/features/crypto/services'" },
  { old: '"@/lib/services/crypto-api"', new: '"@/lib/features/crypto/services"' },

  // Transactions
  { old: "'@/lib/stores/transactions-ui-store'", new: "'@/lib/features/transactions/stores'" },
  { old: '"@/lib/stores/transactions-ui-store"', new: '"@/lib/features/transactions/stores"' },
  { old: "'@/lib/queries/use-transactions-data'", new: "'@/lib/features/transactions/queries'" },
  { old: '"@/lib/queries/use-transactions-data"', new: '"@/lib/features/transactions/queries"' },
  { old: "'@/lib/hooks/use-transaction-table'", new: "'@/lib/features/transactions/hooks'" },
  { old: '"@/lib/hooks/use-transaction-table"', new: '"@/lib/features/transactions/hooks"' },
  { old: "'@/lib/hooks/use-merchants-map'", new: "'@/lib/features/transactions/hooks'" },
  { old: '"@/lib/hooks/use-merchants-map"', new: '"@/lib/features/transactions/hooks"' },
  { old: "'@/lib/services/transactions-api'", new: "'@/lib/features/transactions/services'" },
  { old: '"@/lib/services/transactions-api"', new: '"@/lib/features/transactions/services"' },

  // Categories
  { old: "'@/lib/queries/use-categories-data'", new: "'@/lib/features/categories/queries'" },
  { old: '"@/lib/queries/use-categories-data"', new: '"@/lib/features/categories/queries"' },
  { old: "'@/lib/queries/use-category-groups-data'", new: "'@/lib/features/categories/queries'" },
  { old: '"@/lib/queries/use-category-groups-data"', new: '"@/lib/features/categories/queries"' },
  { old: "'@/lib/queries/use-categorization-rules-data'", new: "'@/lib/features/categories/queries'" },
  { old: '"@/lib/queries/use-categorization-rules-data"', new: '"@/lib/features/categories/queries"' },
  { old: "'@/lib/queries/use-category-matching-data'", new: "'@/lib/features/categories/queries'" },
  { old: '"@/lib/queries/use-category-matching-data"', new: '"@/lib/features/categories/queries"' },
  { old: "'@/lib/hooks/use-categories-map'", new: "'@/lib/features/categories/hooks'" },
  { old: '"@/lib/hooks/use-categories-map"', new: '"@/lib/features/categories/hooks"' },
  { old: "'@/lib/services/categories-api'", new: "'@/lib/features/categories/services'" },
  { old: '"@/lib/services/categories-api"', new: '"@/lib/features/categories/services"' },

  // Goals
  { old: "'@/lib/queries/use-goal-data'", new: "'@/lib/features/goals/queries'" },
  { old: '"@/lib/queries/use-goal-data"', new: '"@/lib/features/goals/queries"' },
  { old: "'@/lib/stores/goals-store'", new: "'@/lib/features/goals/stores'" },
  { old: '"@/lib/stores/goals-store"', new: '"@/lib/features/goals/stores"' },
  { old: "'@/lib/services/goals-api'", new: "'@/lib/features/goals/services'" },
  { old: '"@/lib/services/goals-api"', new: '"@/lib/features/goals/services"' },

  // Networth
  { old: "'@/lib/queries/use-networth-data'", new: "'@/lib/features/networth/queries'" },
  { old: '"@/lib/queries/use-networth-data"', new: '"@/lib/features/networth/queries"' },
  { old: "'@/lib/services/networth-api'", new: "'@/lib/features/networth/services'" },
  { old: '"@/lib/services/networth-api"', new: '"@/lib/features/networth/services"' },

  // Subscriptions
  { old: "'@/lib/stores/subscription-ui-store'", new: "'@/lib/features/subscriptions/stores'" },
  { old: '"@/lib/stores/subscription-ui-store"', new: '"@/lib/features/subscriptions/stores"' },
  { old: "'@/lib/queries/use-subscription-data'", new: "'@/lib/features/subscriptions/queries'" },
  { old: '"@/lib/queries/use-subscription-data"', new: '"@/lib/features/subscriptions/queries"' },
  { old: "'@/lib/queries/use-billing-subscription-data'", new: "'@/lib/features/subscriptions/queries'" },
  { old: '"@/lib/queries/use-billing-subscription-data"', new: '"@/lib/features/subscriptions/queries"' },
  { old: "'@/lib/hooks/use-subscription'", new: "'@/lib/features/subscriptions/hooks'" },
  { old: '"@/lib/hooks/use-subscription"', new: '"@/lib/features/subscriptions/hooks"' },
  { old: "'@/lib/services/subscriptions-api'", new: "'@/lib/features/subscriptions/services'" },
  { old: '"@/lib/services/subscriptions-api"', new: '"@/lib/features/subscriptions/services"' },
  { old: "'@/lib/services/subscription-service'", new: "'@/lib/features/subscriptions/services'" },
  { old: '"@/lib/services/subscription-service"', new: '"@/lib/features/subscriptions/services"' },

  // Integrations
  { old: "'@/lib/stores/integrations-store'", new: "'@/lib/features/integrations/stores'" },
  { old: '"@/lib/stores/integrations-store"', new: '"@/lib/features/integrations/stores"' },
  { old: "'@/lib/hooks/use-plaid-integration'", new: "'@/lib/features/integrations/hooks'" },
  { old: '"@/lib/hooks/use-plaid-integration"', new: '"@/lib/features/integrations/hooks"' },
  { old: "'@/lib/hooks/useIntegrationSync'", new: "'@/lib/features/integrations/hooks'" },
  { old: '"@/lib/hooks/useIntegrationSync"', new: '"@/lib/features/integrations/hooks"' },
  { old: "'@/lib/services/integrations-api'", new: "'@/lib/features/integrations/services'" },
  { old: '"@/lib/services/integrations-api"', new: '"@/lib/features/integrations/services"' },

  // Organization
  { old: "'@/lib/stores/organization-store'", new: "'@/lib/features/organization/stores'" },
  { old: '"@/lib/stores/organization-store"', new: '"@/lib/features/organization/stores"' },
  { old: "'@/lib/stores/organization-ui-store'", new: "'@/lib/features/organization/stores'" },
  { old: '"@/lib/stores/organization-ui-store"', new: '"@/lib/features/organization/stores"' },
  { old: "'@/lib/stores/organization-refetch-store'", new: "'@/lib/features/organization/stores'" },
  { old: '"@/lib/stores/organization-refetch-store"', new: '"@/lib/features/organization/stores"' },
  { old: "'@/lib/hooks/use-org-switcher'", new: "'@/lib/features/organization/hooks'" },
  { old: '"@/lib/hooks/use-org-switcher"', new: '"@/lib/features/organization/hooks"' },
  { old: "'@/lib/hooks/use-organization-refetch'", new: "'@/lib/features/organization/hooks'" },
  { old: '"@/lib/hooks/use-organization-refetch"', new: '"@/lib/features/organization/hooks"' },
  { old: "'@/lib/hooks/use-organization-refetch-state'", new: "'@/lib/features/organization/hooks'" },
  { old: '"@/lib/hooks/use-organization-refetch-state"', new: '"@/lib/features/organization/hooks"' },
  { old: "'@/lib/queries/use-organization-data'", new: "'@/lib/features/organization/queries'" },
  { old: '"@/lib/queries/use-organization-data"', new: '"@/lib/features/organization/queries"' },
  { old: "'@/lib/services/organization-api'", new: "'@/lib/features/organization/services'" },
  { old: '"@/lib/services/organization-api"', new: '"@/lib/features/organization/services"' },

  // Onboarding
  { old: "'@/lib/stores/onboarding-ui-store'", new: "'@/lib/features/onboarding/stores'" },
  { old: '"@/lib/stores/onboarding-ui-store"', new: '"@/lib/features/onboarding/stores"' },
  { old: "'@/lib/hooks/use-onboarding'", new: "'@/lib/features/onboarding/hooks'" },
  { old: '"@/lib/hooks/use-onboarding"', new: '"@/lib/features/onboarding/hooks"' },

  // Shared hooks
  { old: "'@/lib/hooks/useToast'", new: "'@/lib/shared/hooks'" },
  { old: '"@/lib/hooks/useToast"', new: '"@/lib/shared/hooks"' },
  { old: "'@/lib/hooks/use-async-operation'", new: "'@/lib/shared/hooks'" },
  { old: '"@/lib/hooks/use-async-operation"', new: '"@/lib/shared/hooks"' },
  { old: "'@/lib/hooks/use-breakpoint-value'", new: "'@/lib/shared/hooks'" },
  { old: '"@/lib/hooks/use-breakpoint-value"', new: '"@/lib/shared/hooks"' },
  { old: "'@/lib/hooks/use-keyboard-shortcuts'", new: "'@/lib/shared/hooks'" },
  { old: '"@/lib/hooks/use-keyboard-shortcuts"', new: '"@/lib/shared/hooks"' },
  { old: "'@/lib/hooks/use-notifications'", new: "'@/lib/shared/hooks'" },
  { old: '"@/lib/hooks/use-notifications"', new: '"@/lib/shared/hooks"' },
  { old: "'@/lib/hooks/use-sidebar'", new: "'@/lib/shared/hooks'" },
  { old: '"@/lib/hooks/use-sidebar"', new: '"@/lib/shared/hooks"' },
  { old: "'@/lib/hooks/use-cache-manager'", new: "'@/lib/shared/hooks'" },
  { old: '"@/lib/hooks/use-cache-manager"', new: '"@/lib/shared/hooks"' },
  { old: "'@/lib/hooks/use-store-initialization'", new: "'@/lib/shared/hooks'" },
  { old: '"@/lib/hooks/use-store-initialization"', new: '"@/lib/shared/hooks"' },
  { old: "'@/lib/hooks/use-realtime-sync'", new: "'@/lib/shared/hooks'" },
  { old: '"@/lib/hooks/use-realtime-sync"', new: '"@/lib/shared/hooks"' },
  { old: "'@/lib/hooks/use-realtime-sync-connection'", new: "'@/lib/shared/hooks'" },
  { old: '"@/lib/hooks/use-realtime-sync-connection"', new: '"@/lib/shared/hooks"' },
  { old: "'@/lib/hooks/use-realtime-notifications'", new: "'@/lib/shared/hooks'" },
  { old: '"@/lib/hooks/use-realtime-notifications"', new: '"@/lib/shared/hooks"' },
  { old: "'@/lib/hooks/use-unified-auto-sync'", new: "'@/lib/shared/hooks'" },
  { old: '"@/lib/hooks/use-unified-auto-sync"', new: '"@/lib/shared/hooks"' },
  { old: "'@/lib/hooks/useSSECacheInvalidation'", new: "'@/lib/shared/hooks'" },
  { old: '"@/lib/hooks/useSSECacheInvalidation"', new: '"@/lib/shared/hooks"' },
  { old: "'@/lib/hooks/useConsentManager'", new: "'@/lib/shared/hooks'" },
  { old: '"@/lib/hooks/useConsentManager"', new: '"@/lib/shared/hooks"' },
  { old: "'@/lib/hooks/use-gtm'", new: "'@/lib/shared/hooks'" },
  { old: '"@/lib/hooks/use-gtm"', new: '"@/lib/shared/hooks"' },
  { old: "'@/lib/hooks/usePostHogPageView'", new: "'@/lib/shared/hooks'" },
  { old: '"@/lib/hooks/usePostHogPageView"', new: '"@/lib/shared/hooks"' },
  { old: "'@/lib/hooks/useCursorVector'", new: "'@/lib/shared/hooks'" },
  { old: '"@/lib/hooks/useCursorVector"', new: '"@/lib/shared/hooks"' },
  { old: "'@/lib/hooks/use-csrf-initialization'", new: "'@/lib/shared/hooks'" },
  { old: '"@/lib/hooks/use-csrf-initialization"', new: '"@/lib/shared/hooks"' },

  // Shared stores
  { old: "'@/lib/stores/global-ui-store'", new: "'@/lib/shared/stores'" },
  { old: '"@/lib/stores/global-ui-store"', new: '"@/lib/shared/stores"' },
  { old: "'@/lib/stores/csrf-store'", new: "'@/lib/shared/stores'" },
  { old: '"@/lib/stores/csrf-store"', new: '"@/lib/shared/stores"' },
  { old: "'@/lib/stores/dashboard-layout-ui-store'", new: "'@/lib/shared/stores'" },
  { old: '"@/lib/stores/dashboard-layout-ui-store"', new: '"@/lib/shared/stores"' },

  // Shared services
  { old: "'@/lib/services/logo-service'", new: "'@/lib/shared/services'" },
  { old: '"@/lib/services/logo-service"', new: '"@/lib/shared/services"' },
  { old: "'@/lib/services/sse-manager'", new: "'@/lib/shared/services'" },
  { old: '"@/lib/services/sse-manager"', new: '"@/lib/shared/services"' },
  { old: "'@/lib/services/sse-cache-handler'", new: "'@/lib/shared/services'" },
  { old: '"@/lib/services/sse-cache-handler"', new: '"@/lib/shared/services"' },

  // Shared queries
  { old: "'@/lib/queries/use-currency-data'", new: "'@/lib/shared/queries'" },
  { old: '"@/lib/queries/use-currency-data"', new: '"@/lib/shared/queries"' },
  { old: "'@/lib/queries/use-waitlist-data'", new: "'@/lib/shared/queries'" },
  { old: '"@/lib/queries/use-waitlist-data"', new: '"@/lib/shared/queries"' },
  { old: "'@/lib/queries/use-payment-method-data'", new: "'@/lib/shared/queries'" },
  { old: '"@/lib/queries/use-payment-method-data"', new: '"@/lib/shared/queries"' },

  // Core
  { old: "'@/lib/config/env'", new: "'@/lib/core/config'" },
  { old: '"@/lib/config/env"', new: '"@/lib/core/config"' },
  { old: "'@/lib/api/secure-client'", new: "'@/lib/core/api'" },
  { old: '"@/lib/api/secure-client"', new: '"@/lib/core/api"' },
  { old: "'@/lib/api/api-client'", new: "'@/lib/core/api'" },
  { old: '"@/lib/api/api-client"', new: '"@/lib/core/api"' },
  { old: "'@/lib/query-helpers'", new: "'@/lib/core/query'" },
  { old: '"@/lib/query-helpers"', new: '"@/lib/core/query"' },
  { old: "'@/lib/query-client'", new: "'@/lib/core/query'" },
  { old: '"@/lib/query-client"', new: '"@/lib/core/query"' },
  { old: "'@/lib/query-dependencies'", new: "'@/lib/core/query'" },
  { old: '"@/lib/query-dependencies"', new: '"@/lib/core/query"' },
  { old: "'@/lib/query-invalidation'", new: "'@/lib/core/query'" },
  { old: '"@/lib/query-invalidation"', new: '"@/lib/core/query"' },
  { old: "'@/lib/auth-client'", new: "'@/lib/core/auth'" },
  { old: '"@/lib/auth-client"', new: '"@/lib/core/auth"' },
  { old: "'@/lib/auth-config'", new: "'@/lib/core/auth'" },
  { old: '"@/lib/auth-config"', new: '"@/lib/core/auth"' },
];

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  IMPORT_MAPPINGS.forEach(({ old, new: newPath }) => {
    content = content.replace(new RegExp(old, 'g'), newPath);
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  }
  return false;
}

function walkAndFix(dir) {
  let count = 0;
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    const normalized = fullPath.replace(/\\/g, '/');

    if (stat.isDirectory() && !normalized.includes('node_modules') && !normalized.includes('.next')) {
      count += walkAndFix(fullPath);
    } else if ((file.endsWith('.ts') || file.endsWith('.tsx')) && (normalized.includes('/app/') || normalized.includes('/components/'))) {
      if (fixFile(fullPath)) {
        count++;
      }
    }
  });

  return count;
}

console.log('🔄 Migrating remaining imports from app/ and components/...\n');
const updated = walkAndFix('.');
console.log(`\n✅ Updated ${updated} files`);
