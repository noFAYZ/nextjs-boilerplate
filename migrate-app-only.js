const fs = require('fs');
const path = require('path');

const MIGRATIONS = [
  { old: /from ['"]@\/lib\/stores\/auth-store['"]/, new: "from '@/lib/features/auth/stores'" },
  { old: /from ['"]@\/lib\/queries\/use-auth-data['"]/, new: "from '@/lib/features/auth/queries'" },
  { old: /from ['"]@\/lib\/queries\/use-banking-data['"]/, new: "from '@/lib/features/banking/queries'" },
  { old: /from ['"]@\/lib\/stores\/banking-ui-store['"]/, new: "from '@/lib/features/banking/stores'" },
  { old: /from ['"]@\/lib\/queries\/use-budget-data['"]/, new: "from '@/lib/features/budgets/queries'" },
  { old: /from ['"]@\/lib\/stores\/budget-ui-store['"]/, new: "from '@/lib/features/budgets/stores'" },
  { old: /from ['"]@\/lib\/stores\/budgets-v3-ui-store['"]/, new: "from '@/lib/features/budgets/stores'" },
  { old: /from ['"]@\/lib\/queries\/use-crypto-data['"]/, new: "from '@/lib/features/crypto/queries'" },
  { old: /from ['"]@\/lib\/stores\/crypto-ui-store['"]/, new: "from '@/lib/features/crypto/stores'" },
  { old: /from ['"]@\/lib\/queries\/use-transactions-data['"]/, new: "from '@/lib/features/transactions/queries'" },
  { old: /from ['"]@\/lib\/queries\/use-categories-data['"]/, new: "from '@/lib/features/categories/queries'" },
  { old: /from ['"]@\/lib\/queries\/use-accounts-data['"]/, new: "from '@/lib/features/accounts/queries'" },
  { old: /from ['"]@\/lib\/queries\/use-organization-data['"]/, new: "from '@/lib/features/organization/queries'" },
  { old: /from ['"]@\/lib\/stores\/organization-store['"]/, new: "from '@/lib/features/organization/stores'" },
  { old: /from ['"]@\/lib\/stores\/organization-ui-store['"]/, new: "from '@/lib/features/organization/stores'" },
  { old: /from ['"]@\/lib\/hooks\/useToast['"]/, new: "from '@/lib/shared/hooks'" },
  { old: /from ['"]@\/lib\/hooks\/usePostHogPageView['"]/, new: "from '@/lib/shared/hooks'" },
  { old: /from ['"]@\/lib\/stores\/global-ui-store['"]/, new: "from '@/lib/shared/stores'" },
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
  const entries = fs.readdirSync(dir);

  entries.forEach(entry => {
    const fullPath = path.join(dir, entry);
    if (fullPath.includes('node_modules') || fullPath.includes('.next')) return;

    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      count += walkAndMigrate(fullPath);
    } else if (entry.endsWith('.ts') || entry.endsWith('.tsx')) {
      if (migrateFile(fullPath)) {
        count++;
      }
    }
  });

  return count;
}

console.log('Migrating app/ imports...');
const count = walkAndMigrate('app');
console.log(`✅ Migrated ${count} files in app/`);
