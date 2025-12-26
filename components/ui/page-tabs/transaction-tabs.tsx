'use client';

import { useTransactionsUIStore } from '@/lib/stores/transactions-ui-store';
import { History, Tag, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { value: 'transactions' as const, label: 'Transactions', icon: History },
  { value: 'categories' as const, label: 'Categories', icon: Tag },
  { value: 'rules' as const, label: 'Rules', icon: BookOpen },
];

export function TransactionTabs() {
  const activeTab = useTransactionsUIStore((state) => state.activeTab);
  const setActiveTab = useTransactionsUIStore((state) => state.setActiveTab);

  return (
    <div className="flex items-center gap-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
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
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
