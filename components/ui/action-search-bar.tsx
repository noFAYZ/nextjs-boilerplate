'use client';

import * as React from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  Calculator,
  Plus,
  Bell,
  Download,
  Upload,
  CreditCard,
  Settings,
  User,
  Target,
  FileText,
  Building,
  Store,
  TrendingUp
} from 'lucide-react';
import {
  HugeiconsHome04,
  SolarWallet2Outline,
  HugeiconsPieChart09,
  HugeiconsTransactionHistory,
  MageGoals,
  HugeiconsAnalytics02,
} from '@/components/icons/icons';

interface ActionItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  action: () => void;
  shortcut?: string;
  group: string;
  keywords?: string[];
}

interface ActionSearchBarProps {
  onOpenCommandPalette?: () => void;
 
  
}

export function ActionSearchBar({ onOpenCommandPalette }: ActionSearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const actions: ActionItem[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      label: 'Dashboard',
      description: 'View main dashboard',
      icon: HugeiconsHome04,
      action: () => router.push('/dashboard'),
      shortcut: '⌘ D',
      group: 'Navigation',
      keywords: ['home', 'overview']
    },
    {
      id: 'nav-wallets',
      label: 'Crypto Wallets',
      description: 'Manage crypto wallets',
      icon: SolarWallet2Outline,
      action: () => router.push('/accounts/wallet'),
      shortcut: '⌘ W',
      group: 'Navigation',
      keywords: ['crypto', 'wallet', 'accounts']
    },
    {
      id: 'nav-portfolio',
      label: 'Portfolio',
      description: 'View portfolio overview',
      icon: HugeiconsPieChart09,
      action: () => router.push('/portfolio'),
      shortcut: '⌘ P',
      group: 'Navigation',
      keywords: ['holdings', 'assets', 'performance']
    },
    {
      id: 'nav-transactions',
      label: 'Transactions',
      description: 'View transaction history',
      icon: HugeiconsTransactionHistory,
      action: () => router.push('/transactions'),
      shortcut: '⌘ T',
      group: 'Navigation',
      keywords: ['history', 'transfers', 'payments']
    },
    {
      id: 'nav-goals',
      label: 'Goals',
      description: 'Manage financial goals',
      icon: MageGoals,
      action: () => router.push('/goals'),
      shortcut: '⌘ G',
      group: 'Navigation',
      keywords: ['savings', 'targets', 'objectives']
    },
    {
      id: 'nav-insights',
      label: 'Insights',
      description: 'View analytics and insights',
      icon: HugeiconsAnalytics02,
      action: () => router.push('/insights'),
      shortcut: '⌘ I',
      group: 'Navigation',
      keywords: ['analytics', 'reports', 'trends']
    },
    // Quick Actions
    {
      id: 'add-wallet',
      label: 'Add New Wallet',
      description: 'Connect a cryptocurrency wallet',
      icon: Plus,
      action: () => router.push('/accounts/wallet/add'),
      group: 'Quick Actions',
      keywords: ['connect', 'new', 'crypto']
    },
    {
      id: 'add-transaction',
      label: 'Add Transaction',
      description: 'Record a new transaction',
      icon: CreditCard,
      shortcut: '⌘ ⇧ T',
      group: 'Quick Actions',
      keywords: ['record', 'income', 'expense']
    },
    {
      id: 'export-data',
      label: 'Export Data',
      description: 'Download your financial data',
      icon: Download,
      group: 'Quick Actions',
      keywords: ['download', 'backup', 'csv', 'pdf']
    },
    {
      id: 'import-data',
      label: 'Import Data',
      description: 'Upload transaction data',
      icon: Upload,
      group: 'Quick Actions',
      keywords: ['upload', 'csv', 'bank', 'statements']
    },
    // Tools
    {
      id: 'calculator',
      label: 'Calculator',
      description: 'Open financial calculator',
      icon: Calculator,
      shortcut: '⌘ C',
      group: 'Tools',
      keywords: ['calc', 'math', 'compute']
    },
    {
      id: 'notifications',
      label: 'Notifications',
      description: 'View notifications',
      icon: Bell,
      group: 'Tools',
      keywords: ['alerts', 'updates']
    },
    // Account
    {
      id: 'profile',
      label: 'Profile Settings',
      description: 'Manage your profile',
      icon: User,
      action: () => router.push('/profile'),
      group: 'Account',
      keywords: ['account', 'personal', 'info']
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'App preferences and settings',
      icon: Settings,
      action: () => router.push('/settings'),
      shortcut: '⌘ ,',
      group: 'Account',
      keywords: ['preferences', 'config']
    }
  ];

  // Filter actions based on search query
  const filteredActions = React.useMemo(() => {
    if (!query) {
      // Show recently used or most popular actions when search is empty
      return actions.slice(0, 6);
    }

    const queryLower = query.toLowerCase();
    return actions.filter(action =>
      action.label.toLowerCase().includes(queryLower) ||
      action.description?.toLowerCase().includes(queryLower) ||
      action.keywords?.some(kw => kw.toLowerCase().includes(queryLower)) ||
      action.group.toLowerCase().includes(queryLower)
    );
  }, [query, actions]);

  // Group filtered actions by category
  const groupedActions = React.useMemo(() => {
    const groups: Record<string, typeof filteredActions> = {};
    filteredActions.forEach(action => {
      if (!groups[action.group]) {
        groups[action.group] = [];
      }
      groups[action.group].push(action);
    });
    return groups;
  }, [filteredActions]);

  // Reset selection when filtered results change
  React.useEffect(() => {
    setSelectedIndex(0);
  }, [filteredActions]);

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl+K to open/close search
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) {
          setIsOpen(false);
          setQuery('');
        } else {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }
        return;
      }

      // Only handle navigation when dropdown is open
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredActions.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredActions[selectedIndex]) {
            handleSelectAction(filteredActions[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setQuery('');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredActions, selectedIndex]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSelectAction = (action: ActionItem) => {
    action.action();
    setIsOpen(false);
    setQuery('');
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className="w-full  relative"
    >
      {/* Input Container */}
      <div className="relative">
        <div className="flex items-center h-9 sm:h-10 px-2 sm:px-3 bg-card border border-border/80 rounded-lg hover:bg-card/80 shadow ">
          <Search className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleInputFocus}
            className="flex-1 bg-transparent border-0 outline-none text-xs sm:text-sm text-foreground placeholder:text-muted-foreground px-2 py-1"
          />
          {query && (
            <button
              onClick={handleClear}
              className="p-0.5 hover:bg-muted rounded transition-colors flex-shrink-0"
              aria-label="Clear search"
            >
              <X className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-muted-foreground" />
            </button>
          )}
          {!query && (
            <kbd className="hidden md:flex ml-auto pointer-events-none h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground flex-shrink-0">
              <span className="text-xs">⌘</span>K
            </kbd>
          )}
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/50 rounded-lg shadow-lg overflow-hidden z-50">
            <div className="max-h-96 sm:max-h-[500px] overflow-y-auto">
              {filteredActions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Search className="h-8 w-8 opacity-50 mb-2" />
                  <p className="text-sm">No actions found</p>
                  <p className="text-xs">Try searching for "wallet", "dashboard", or other actions</p>
                </div>
              ) : (
                <div className="py-2">
                  {Object.entries(groupedActions).map(([group, groupActions], groupIndex) => (
                    <div key={group}>
                      {groupIndex > 0 && (
                        <div className="my-1 border-t border-border/30" />
                      )}
                      <div className="px-3 py-2 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
                        {group}
                      </div>
                      {groupActions.map((action) => {
                        const isSelected = filteredActions.indexOf(action) === selectedIndex;
                        const Icon = action.icon;

                        return (
                          <button
                            key={action.id}
                            onClick={() => handleSelectAction(action)}
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors cursor-pointer',
                              isSelected
                                ? 'bg-muted text-foreground'
                                : 'text-foreground hover:bg-muted/50'
                            )}
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background/50 flex-shrink-0">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <div className="font-medium text-sm">
                                {action.label}
                              </div>
                              {action.description && (
                                <div className="text-xs text-muted-foreground truncate">
                                  {action.description}
                                </div>
                              )}
                            </div>
                            {action.shortcut && (
                              <kbd className="hidden sm:inline-flex ml-auto pointer-events-none h-5 select-none items-center gap-0.5 rounded border border-border/50 bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground flex-shrink-0">
                                {action.shortcut}
                              </kbd>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}

              {/* Footer hint */}
              {filteredActions.length > 0 && (
                <div className="border-t border-border/30 px-3 py-2 bg-muted/30 text-xs text-muted-foreground flex items-center justify-between">
                  <span>↑↓ to navigate</span>
                  <span>⏎ to select</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
