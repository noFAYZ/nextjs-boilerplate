#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Fix imports WITHIN lib/features to use new modular paths
 * This must be done FIRST before updating imports elsewhere
 */

const IMPORT_MAPPINGS = [
  // Auth
  { from: "'@/lib/stores/auth-store'", to: "'@/lib/features/auth/stores'" },
  { from: '"@/lib/stores/auth-store"', to: '"@/lib/features/auth/stores"' },

  // Banking
  { from: "'@/lib/stores/banking-ui-store'", to: "'@/lib/features/banking/stores'" },
  { from: '"@/lib/stores/banking-ui-store"', to: '"@/lib/features/banking/stores"' },
  { from: "'@/lib/stores/banking-store'", to: "'@/lib/features/banking/stores'" },
  { from: '"@/lib/stores/banking-store"', to: '"@/lib/features/banking/stores"' },

  // Budgets
  { from: "'@/lib/stores/budget-ui-store'", to: "'@/lib/features/budgets/stores'" },
  { from: '"@/lib/stores/budget-ui-store"', to: '"@/lib/features/budgets/stores"' },
  { from: "'@/lib/stores/budgets-v3-ui-store'", to: "'@/lib/features/budgets/stores'" },
  { from: '"@/lib/stores/budgets-v3-ui-store"', to: '"@/lib/features/budgets/stores"' },
  { from: "'@/lib/stores/envelope-ui-store'", to: "'@/lib/features/budgets/stores'" },
  { from: '"@/lib/stores/envelope-ui-store"', to: '"@/lib/features/budgets/stores"' },

  // Crypto
  { from: "'@/lib/stores/crypto-ui-store'", to: "'@/lib/features/crypto/stores'" },
  { from: '"@/lib/stores/crypto-ui-store"', to: '"@/lib/features/crypto/stores"' },
  { from: "'@/lib/stores/crypto-store'", to: "'@/lib/features/crypto/stores'" },
  { from: '"@/lib/stores/crypto-store"', to: '"@/lib/features/crypto/stores"' },

  // Transactions
  { from: "'@/lib/stores/transactions-ui-store'", to: "'@/lib/features/transactions/stores'" },
  { from: '"@/lib/stores/transactions-ui-store"', to: '"@/lib/features/transactions/stores"' },

  // Accounts
  { from: "'@/lib/stores/accounts-ui-store'", to: "'@/lib/features/accounts/stores'" },
  { from: '"@/lib/stores/accounts-ui-store"', to: '"@/lib/features/accounts/stores"' },
  { from: "'@/lib/stores/account-groups-store'", to: "'@/lib/features/accounts/stores'" },
  { from: '"@/lib/stores/account-groups-store"', to: '"@/lib/features/accounts/stores"' },

  // Organization
  { from: "'@/lib/stores/organization-store'", to: "'@/lib/features/organization/stores'" },
  { from: '"@/lib/stores/organization-store"', to: '"@/lib/features/organization/stores"' },
  { from: "'@/lib/stores/organization-ui-store'", to: "'@/lib/features/organization/stores'" },
  { from: '"@/lib/stores/organization-ui-store"', to: '"@/lib/features/organization/stores"' },
  { from: "'@/lib/stores/organization-refetch-store'", to: "'@/lib/features/organization/stores'" },
  { from: '"@/lib/stores/organization-refetch-store"', to: '"@/lib/features/organization/stores"' },

  // Subscriptions
  { from: "'@/lib/stores/subscription-ui-store'", to: "'@/lib/features/subscriptions/stores'" },
  { from: '"@/lib/stores/subscription-ui-store"', to: '"@/lib/features/subscriptions/stores"' },

  // Goals
  { from: "'@/lib/stores/goals-store'", to: "'@/lib/features/goals/stores'" },
  { from: '"@/lib/stores/goals-store"', to: '"@/lib/features/goals/stores"' },

  // Integrations
  { from: "'@/lib/stores/integrations-store'", to: "'@/lib/features/integrations/stores'" },
  { from: '"@/lib/stores/integrations-store"', to: '"@/lib/features/integrations/stores"' },

  // Onboarding
  { from: "'@/lib/stores/onboarding-ui-store'", to: "'@/lib/features/onboarding/stores'" },
  { from: '"@/lib/stores/onboarding-ui-store"', to: '"@/lib/features/onboarding/stores"' },

  // Shared stores
  { from: "'@/lib/stores/global-ui-store'", to: "'@/lib/shared/stores'" },
  { from: '"@/lib/stores/global-ui-store"', to: '"@/lib/shared/stores"' },
  { from: "'@/lib/stores/csrf-store'", to: "'@/lib/shared/stores'" },
  { from: '"@/lib/stores/csrf-store"', to: '"@/lib/shared/stores"' },
  { from: "'@/lib/stores/dashboard-layout-ui-store'", to: "'@/lib/shared/stores'" },
  { from: '"@/lib/stores/dashboard-layout-ui-store"', to: '"@/lib/shared/stores"' },
];

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  IMPORT_MAPPINGS.forEach(({ from, to }) => {
    content = content.replace(new RegExp(from, 'g'), to);
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
    } else if ((file.endsWith('.ts') || file.endsWith('.tsx')) && normalized.includes('lib/features')) {
      if (fixFile(fullPath)) {
        count++;
      }
    }
  });

  return count;
}

console.log('🔄 Fixing imports within lib/features...\n');
const updated = walkAndFix('lib');
console.log(`\n✅ Fixed imports in ${updated} files`);
