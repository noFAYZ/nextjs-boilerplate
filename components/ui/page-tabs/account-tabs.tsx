'use client';

import { useAccountsUIStore } from '@/lib/stores/accounts-ui-store';
import { cn } from '@/lib/utils';

export function AccountTabs() {
  const activeTab = useAccountsUIStore((state) => state.ui.activeTab);
  const setActiveTab = useAccountsUIStore((state) => state.setActiveTab);
  const defaultOverview = useAccountsUIStore((state) => state.viewPreferences.defaultOverview);

  const tabs = [
    { value: defaultOverview, label: 'Overview' },
    { value: 'manage' as const, label: 'Manage' },
  ];

  return (
    <div className="flex items-center gap-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;

        return (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors duration-0 cursor-pointer',
              isActive
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
