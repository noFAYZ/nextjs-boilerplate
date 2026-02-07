'use client';

import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAccountsUIStore } from '@/lib/features/accounts/stores';
import { cn } from '@/lib/utils';

type TabType = 'overview' | 'overview-2' | 'manage' | 'wallet' | 'bank';

export function AccountTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = useAccountsUIStore((state) => state.ui.activeTab);
  const setActiveTab = useAccountsUIStore((state) => state.setActiveTab);
  const defaultOverview = useAccountsUIStore((state) => state.viewPreferences.defaultOverview);

  // Determine current active tab based on route
  const getCurrentTab = (): TabType => {
    if (pathname.startsWith('/accounts/wallet')) return 'wallet';
    if (pathname.startsWith('/accounts/bank')) return 'bank';
    if (pathname === '/accounts') return activeTab as TabType;
    return 'overview';
  };

  const currentTab = getCurrentTab();

  const tabs = useMemo(
    () => [
      { value: defaultOverview as TabType, label: 'Overview' },
      { value: 'manage' as TabType, label: 'Manage' },
      { value: 'wallet' as TabType, label: 'Wallets' },
      { value: 'bank' as TabType, label: 'Banks' },
    ],
    [defaultOverview]
  );

  const handleTabClick = (tabValue: TabType) => {
    if (tabValue === 'wallet') {
      router.push('/accounts/wallet');
    } else if (tabValue === 'bank') {
      router.push('/accounts/bank');
    } else {
      // Overview or Manage tabs
      setActiveTab(tabValue);
      if (pathname !== '/accounts') {
        router.push('/accounts');
      }
    }
  };

  return (
    <div className="flex items-center gap-1">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.value;

        return (
          <button
            key={tab.value}
            onClick={() => handleTabClick(tab.value)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 text-xs sm:text-[13px] font-semibold rounded-sm transition-colors duration-75 cursor-pointer',
              isActive
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
