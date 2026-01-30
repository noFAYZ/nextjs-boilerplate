#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Fix barrel imports from @/lib/stores
 * These need special handling because they import multiple stores
 */

const FILE_MAPPINGS = [
  {
    file: "app/(protected)/goals/analytics/page.tsx",
    from: "import { useGoalsStore } from '@/lib/stores';",
    to: "import { useGoalsStore } from '@/lib/features/goals/stores';"
  },
  {
    file: "app/auth/login/page.tsx",
    from: "import { useAuthStore, selectSession, selectIsAuthenticated } from '@/lib/stores';",
    to: "import { useAuthStore, selectSession, selectIsAuthenticated } from '@/lib/features/auth/stores';"
  },
  {
    file: "app/auth/signup/page.tsx",
    from: "import { useAuthStore, selectIsAuthenticated, selectSession } from '@/lib/stores';",
    to: "import { useAuthStore, selectIsAuthenticated, selectSession } from '@/lib/features/auth/stores';"
  },
  {
    file: "app/onboarding/page.tsx",
    from: "import { useAuthStore, selectUser } from '@/lib/stores';",
    to: "import { useAuthStore, selectUser } from '@/lib/features/auth/stores';"
  },
  {
    file: "components/modules/accounts/components/AccountGroupsGrid.tsx",
    from: 'import { useAccountGroupsStore } from "@/lib/stores";',
    to: "import { useAccountGroupsStore } from '@/lib/features/accounts/stores';"
  },
  {
    file: "components/modules/accounts/components/AccountGroupsList.tsx",
    from: "import { useAccountGroupsStore } from '@/lib/stores';",
    to: "import { useAccountGroupsStore } from '@/lib/features/accounts/stores';"
  },
  {
    file: "components/modules/accounts/components/CreateGroupDialog.tsx",
    from: 'import { useAccountGroupsStore } from "@/lib/stores";',
    to: "import { useAccountGroupsStore } from '@/lib/features/accounts/stores';"
  },
  {
    file: "components/modules/auth/components/AuthGuard.tsx",
    from: 'import { useAuthStore, selectUser, selectAuthLoading, selectAuthError } from "@/lib/stores";',
    to: "import { useAuthStore, selectUser, selectAuthLoading, selectAuthError } from '@/lib/features/auth/stores';"
  },
  {
    file: "components/modules/auth/components/onboarding-guard.tsx",
    from: "import { useAuthStore, selectUser, selectIsAuthenticated, selectAuthLoading } from '@/lib/stores';",
    to: "import { useAuthStore, selectUser, selectIsAuthenticated, selectAuthLoading } from '@/lib/features/auth/stores';"
  },
  {
    file: "components/modules/banking/components/BankCard.tsx",
    from: 'import { useBankingStore } from "@/lib/stores";',
    to: "import { useBankingStore } from '@/lib/features/banking/stores';"
  },
  {
    file: "components/modules/crypto/components/crypto-wallets-data-table.tsx",
    from: 'import { useCryptoStore } from "@/lib/stores";',
    to: "import { useCryptoStore } from '@/lib/features/crypto/stores';"
  },
  {
    file: "components/modules/crypto/components/WalletCard.tsx",
    from: 'import { useCryptoStore } from "@/lib/stores";',
    to: "import { useCryptoStore } from '@/lib/features/crypto/stores';"
  },
  {
    file: "components/modules/goals/components/goals-dashboard.tsx",
    from: "import { useGoalsStore, selectFilteredGoals, selectActiveGoals, selectCompletedGoals, selectOffTrackGoals } from '@/lib/stores';",
    to: "import { useGoalsStore, selectFilteredGoals, selectActiveGoals, selectCompletedGoals, selectOffTrackGoals } from '@/lib/features/goals/stores';"
  },
  {
    file: "lib/shared/hooks/use-store-initialization.ts",
    from: "import { useAuthStore, useAccountGroupsStore, useCryptoStore } from '@/lib/stores';",
    to: "import { useAuthStore } from '@/lib/features/auth/stores';\nimport { useAccountGroupsStore } from '@/lib/features/accounts/stores';\nimport { useCryptoStore } from '@/lib/features/crypto/stores';"
  },
];

let count = 0;

FILE_MAPPINGS.forEach(({ file, from, to }) => {
  try {
    const fullPath = file;
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      if (content.includes(from)) {
        content = content.replace(from, to);
        fs.writeFileSync(fullPath, content, 'utf-8');
        count++;
        console.log(`✓ Fixed: ${file}`);
      }
    }
  } catch (error) {
    console.log(`✗ Error fixing ${file}:`, error.message);
  }
});

console.log(`\n✅ Fixed ${count} files with barrel imports`);
