'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calculator,
  Search,
  Plus,
  Bell,
  Download,
  Upload,
  CreditCard,
  Wallet,
  PieChart,
  TrendingUp,
  Settings,
  User,
  Target,
  FileText,
  Building,
  Store
} from 'lucide-react';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { HugeiconsHome04, SolarWallet2Outline, HugeiconsPieChart09, HugeiconsTransactionHistory, MageGoals, HugeiconsAnalytics02, GuidanceBank } from '@/components/icons/icons';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  action: () => void;
  shortcut?: string;
  group: string;
  keywords?: string[];
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const commands: Command[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      label: 'Go to Dashboard',
      description: 'View main dashboard',
      icon: HugeiconsHome04,
      action: () => router.push('/dashboard'),
      shortcut: '⌘ D',
      group: 'Navigation',
      keywords: ['home', 'overview']
    },
    {
      id: 'nav-wallets',
      label: 'Go to Wallets',
      description: 'Manage crypto wallets',
      icon: SolarWallet2Outline,
      action: () => router.push('/accounts/wallet'),
      shortcut: '⌘ W',
      group: 'Navigation',
      keywords: ['crypto', 'wallet', 'accounts']
    },
    {
      id: 'nav-portfolio',
      label: 'Go to Portfolio',
      description: 'View portfolio overview',
      icon: HugeiconsPieChart09,
      action: () => router.push('/portfolio'),
      shortcut: '⌘ P',
      group: 'Navigation',
      keywords: ['holdings', 'assets', 'performance']
    },
    {
      id: 'nav-transactions',
      label: 'Go to Transactions',
      description: 'View transaction history',
      icon: HugeiconsTransactionHistory,
      action: () => router.push('/transactions'),
      shortcut: '⌘ T',
      group: 'Navigation',
      keywords: ['history', 'transfers', 'payments']
    },
    {
      id: 'nav-goals',
      label: 'Go to Goals',
      description: 'Manage financial goals',
      icon: MageGoals,
      action: () => router.push('/goals'),
      shortcut: '⌘ G',
      group: 'Navigation',
      keywords: ['savings', 'targets', 'objectives']
    },
    {
      id: 'nav-insights',
      label: 'Go to Insights',
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

  // Filter commands based on search
  const filteredCommands = React.useMemo(() => {
    if (!search) return commands;
    
    const query = search.toLowerCase();
    return commands.filter(command => 
      command.label.toLowerCase().includes(query) ||
      command.description?.toLowerCase().includes(query) ||
      command.keywords?.some(keyword => keyword.toLowerCase().includes(query)) ||
      command.group.toLowerCase().includes(query)
    );
  }, [search, commands]);

  // Group filtered commands
  const groupedCommands = React.useMemo(() => {
    const groups: Record<string, typeof filteredCommands> = {};
    filteredCommands.forEach(command => {
      if (!groups[command.group]) {
        groups[command.group] = [];
      }
      groups[command.group].push(command);
    });
    return groups;
  }, [filteredCommands]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const handleSelect = (command: Command) => {
    onOpenChange(false);
    command.action();
  };

  return (
    <CommandDialog 
      open={open} 
      onOpenChange={onOpenChange}
      className="max-w-2xl"
    >
      <CommandInput
        placeholder="Search commands, pages, or actions..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Search className="h-8 w-8 opacity-50" />
            <p>No results found.</p>
            <p className="text-xs">Try searching for "wallet", "dashboard", or "settings"</p>
          </div>
        </CommandEmpty>

        {Object.entries(groupedCommands).map(([group, groupCommands], index) => (
          <React.Fragment key={group}>
            {index > 0 && <CommandSeparator />}
            <CommandGroup heading={group}>
              {groupCommands.map((command) => {
                const Icon = command.icon;
                return (
                  <CommandItem
                    key={command.id}
                    value={`${command.label} ${command.description} ${command.keywords?.join(' ')}`}
                    onSelect={() => handleSelect(command)}
                    className="flex items-center gap-3 px-3 py-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{command.label}</div>
                      {command.description && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {command.description}
                        </div>
                      )}
                    </div>
                    {command.shortcut && (
                      <CommandShortcut>{command.shortcut}</CommandShortcut>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </React.Fragment>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

// Hook to use command palette
export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  const toggle = React.useCallback(() => setOpen(prev => !prev), []);
  const close = React.useCallback(() => setOpen(false), []);
  const openCommandPalette = React.useCallback(() => setOpen(true), []);

  return {
    open,
    toggle,
    close,
    openCommandPalette,
    CommandPalette: (props: Omit<CommandPaletteProps, 'open' | 'onOpenChange'>) => (
      <CommandPalette {...props} open={open} onOpenChange={setOpen} />
    )
  };
}