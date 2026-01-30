#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Final comprehensive fix for any remaining old imports
 * Uses regex to catch all variations (single/double quotes, etc)
 */

const STORE_MAPPINGS = {
  'banking-store': 'lib/features/banking/stores',
  'banking-ui-store': 'lib/features/banking/stores',
  'budget-ui-store': 'lib/features/budgets/stores',
  'budgets-v3-ui-store': 'lib/features/budgets/stores',
  'envelope-ui-store': 'lib/features/budgets/stores',
  'accounts-ui-store': 'lib/features/accounts/stores',
  'account-groups-store': 'lib/features/accounts/stores',
  'organization-store': 'lib/features/organization/stores',
  'organization-ui-store': 'lib/features/organization/stores',
  'organization-refetch-store': 'lib/features/organization/stores',
  'auth-store': 'lib/features/auth/stores',
  'crypto-store': 'lib/features/crypto/stores',
  'crypto-ui-store': 'lib/features/crypto/stores',
  'transactions-ui-store': 'lib/features/transactions/stores',
  'goals-store': 'lib/features/goals/stores',
  'subscription-ui-store': 'lib/features/subscriptions/stores',
  'integrations-store': 'lib/features/integrations/stores',
  'onboarding-ui-store': 'lib/features/onboarding/stores',
  'global-ui-store': 'lib/shared/stores',
  'csrf-store': 'lib/shared/stores',
  'dashboard-layout-ui-store': 'lib/shared/stores',
  'ui-stores': 'lib/features/accounts/stores', // fallback for barrel imports
};

const HOOKS_MAPPINGS = {
  'use-account-groups': 'lib/features/accounts/hooks',
  'use-async-operation': 'lib/shared/hooks',
  'useAuthSession': 'lib/features/auth/hooks',
  'use-available-to-budget': 'lib/features/budgets/hooks',
  'use-breakpoint-value': 'lib/shared/hooks',
  'use-budget-allocation': 'lib/features/budgets/hooks',
  'use-budget-dialogs': 'lib/features/budgets/hooks',
  'use-budget-filters': 'lib/features/budgets/hooks',
  'use-budget-groups': 'lib/features/budgets/hooks',
  'use-budget-modals': 'lib/features/budgets/hooks',
  'use-budget-popovers': 'lib/features/budgets/hooks',
  'use-budget-selection': 'lib/features/budgets/hooks',
  'use-cache-manager': 'lib/shared/hooks',
  'use-categories-map': 'lib/features/categories/hooks',
  'useConsentManager': 'lib/shared/hooks',
  'use-csrf-initialization': 'lib/shared/hooks',
  'use-gtm': 'lib/shared/hooks',
  'useIntegrationSync': 'lib/features/integrations/hooks',
  'use-keyboard-shortcuts': 'lib/shared/hooks',
  'use-merchants-map': 'lib/features/transactions/hooks',
  'use-notifications': 'lib/shared/hooks',
  'usePostHogPageView': 'lib/shared/hooks',
  'use-realtime-notifications': 'lib/shared/hooks',
  'use-realtime-sync': 'lib/shared/hooks',
  'use-realtime-sync-connection': 'lib/shared/hooks',
  'use-session-timeout': 'lib/features/auth/hooks',
  'use-sidebar': 'lib/shared/hooks',
  'use-store-initialization': 'lib/shared/hooks',
  'use-subscription': 'lib/features/subscriptions/hooks',
  'use-transaction-table': 'lib/features/transactions/hooks',
  'use-unified-auto-sync': 'lib/shared/hooks',
  'useSSECacheInvalidation': 'lib/shared/hooks',
  'useCursorVector': 'lib/shared/hooks',
  'use-org-switcher': 'lib/features/organization/hooks',
  'use-organization-refetch': 'lib/features/organization/hooks',
  'use-organization-refetch-state': 'lib/features/organization/hooks',
  'use-plaid-integration': 'lib/features/integrations/hooks',
  'use-user-profile': 'lib/features/auth/hooks',
  'use-wallet-dock': 'lib/features/crypto/hooks',
  'useToast': 'lib/shared/hooks',
};

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;

    // Fix store imports
    Object.entries(STORE_MAPPINGS).forEach(([storeName, newPath]) => {
      const patterns = [
        new RegExp(`from\\s+['\"]@/lib/stores/${storeName}['\"]`, 'g'),
      ];
      patterns.forEach(pattern => {
        content = content.replace(pattern, `from '@/${newPath}'`);
      });
    });

    // Fix hook imports
    Object.entries(HOOKS_MAPPINGS).forEach(([hookName, newPath]) => {
      const patterns = [
        new RegExp(`from\\s+['\"]@/lib/hooks/${hookName}['\"]`, 'g'),
      ];
      patterns.forEach(pattern => {
        content = content.replace(pattern, `from '@/${newPath}'`);
      });
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf-8');
      return true;
    }
  } catch (error) {
    // Ignore read errors
  }
  return false;
}

function walkAndFix(dir) {
  let count = 0;
  let visited = new Set();

  function traverse(currentDir) {
    try {
      const files = fs.readdirSync(currentDir);

      files.forEach(file => {
        const fullPath = path.join(currentDir, file);
        const normalized = fullPath.replace(/\\/g, '/');

        if (visited.has(normalized)) return;
        visited.add(normalized);

        try {
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory() && !normalized.includes('node_modules') && !normalized.includes('.next')) {
            traverse(fullPath);
          } else if ((file.endsWith('.ts') || file.endsWith('.tsx'))) {
            if (fixFile(fullPath)) {
              count++;
            }
          }
        } catch (error) {
          // Ignore stat errors
        }
      });
    } catch (error) {
      // Ignore read errors
    }
  }

  traverse(dir);
  return count;
}

console.log('🔄 Final comprehensive fix: Finding and fixing remaining old imports...\n');
const updated = walkAndFix('.');
console.log(`\n✅ Fixed ${updated} more files with old imports`);
