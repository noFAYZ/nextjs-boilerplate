'use client';

import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSidebarV2 } from './use-sidebar-v2';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { SidebarMenuButton } from './sidebar-menu-button';
import { MenuItemV2 } from './types';
import { useAuthStore } from '@/lib/stores/auth-store';
import { authClient } from '@/lib/auth-client';
import { createAvatar } from '@dicebear/core';
import { avataaarsNeutral } from '@dicebear/collection';
import { Settings, LogOut, User, Crown, MoreVertical, HelpCircle, Settings2, Pin, PinOff } from 'lucide-react';
import {
  SolarHomeSmileBoldDuotone,
  SolarLibraryBoldDuotone,
  HugeiconsTransactionHistory,
  SolarCalculatorBoldDuotone,
  MageGoals,
  SolarBillListBoldDuotone,
  PhBrainDuotone,
  WalletLogoIconOpen,
  FluentWrenchSettings24Regular,
  SolarInboxInBoldDuotone,
} from '@/components/icons/icons';
import { SettingsDialog } from '@/components/modules/settings/components/settings-dialog';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { OrganizationSwitcher } from '@/components/modules/organization/components/organization-switcher';
import { SIDEBAR_WIDTHS, SIDEBAR_TRANSITIONS, LOGO_STYLES, POPOVER_STYLES } from './constants';

/**
 * Menu items configuration for the sidebar
 * Organized by feature/section with navigation paths
 */
const MENU_ITEMS_V2: MenuItemV2[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: SolarHomeSmileBoldDuotone,
    href: '/dashboard',
    submenu: [
      {
        id: 'overview',
        label: 'Overview',
        href: '/dashboard',
        icon: SolarHomeSmileBoldDuotone,
        description: 'Main dashboard view',
      },
      {
        id: 'analytics',
        label: 'Analytics',
        href: '/dashboard/analytics',
        description: 'Deep dive insights',
        status: 'new',
      },
      {
        id: 'reports',
        label: 'Reports',
        href: '/dashboard/reports',
        description: 'Financial reports',
      },
    ],
  },
  {
    id: 'accounts',
    label: 'Accounts',
    icon: SolarLibraryBoldDuotone,
    href: '/accounts',
    submenu: [
      {
        id: 'crypto-wallets',
        label: 'Crypto Wallets',
        href: '/accounts/wallet',
        icon: SolarLibraryBoldDuotone,
        description: 'Track crypto wallets',
      },
      {
        id: 'bank-accounts',
        label: 'Bank Accounts',
        href: '/accounts/bank',
        description: 'Monitor bank accounts',
      },
      {
        id: 'integrations',
        label: 'Integrations',
        href: '/accounts/integrations',
        description: 'Connect new accounts',
      },
    ],
  },
  {
    id: 'transactions',
    label: 'Transactions',
    icon: SolarBillListBoldDuotone,
    href: '/transactions',
    submenu: [
      {
        id: 'all-transactions',
        label: 'All Transactions',
        href: '/transactions',
        icon: HugeiconsTransactionHistory,
        description: 'View all transactions',
      },
      {
        id: 'pending',
        label: 'Pending',
        href: '/transactions?status=pending',
        description: 'Pending transactions',
      },
      {
        id: 'categories',
        label: 'By Category',
        href: '/transactions?view=categories',
        description: 'Categorized view',
      },
    ],
  },
  {
    id: 'budgets',
    label: 'Budgets',
    icon: SolarCalculatorBoldDuotone,
    href: '/budgets',
    submenu: [
      {
        id: 'all-budgets',
        label: 'All Budgets',
        href: '/budgets',
        icon: SolarCalculatorBoldDuotone,
        description: 'Manage budgets',
      },
      {
        id: 'create-budget',
        label: 'Create Budget',
        href: '/budgets/create',
        description: 'New budget',
        status: 'new',
      },
    ],
  },
  {
    id: 'goals',
    label: 'Goals',
    icon: MageGoals,
    href: '/goals',
    submenu: [
      {
        id: 'all-goals',
        label: 'All Goals',
        href: '/goals',
        icon: MageGoals,
        description: 'View all goals',
      },
      {
        id: 'create-goal',
        label: 'Create Goal',
        href: '/goals/create',
        description: 'New goal',
      },
    ],
  },
  {
    id: 'subscriptions',
    label: 'Subscriptions',
    icon: SolarInboxInBoldDuotone,
    href: '/subscriptions',
    submenu: [
      {
        id: 'all-subscriptions',
        label: 'All Subscriptions',
        href: '/subscriptions',
        icon: SolarBillListBoldDuotone,
        description: 'Track subscriptions',
      },
      {
        id: 'upcoming',
        label: 'Upcoming Charges',
        href: '/subscriptions?filter=upcoming',
        description: 'Coming soon',
      },
    ],
  },
  {
    id: 'ai',
    label: 'MapprAI',
    icon: PhBrainDuotone,
    href: '/ai',
    submenu: [
      {
        id: 'insights',
        label: 'Insights',
        href: '/ai/insights',
        icon: PhBrainDuotone,
        description: 'AI insights',
        status: 'beta',
      },
      {
        id: 'recommendations',
        label: 'Recommendations',
        href: '/ai/recommendations',
        description: 'Smart suggestions',
      },
    ],
  },
];

interface SidebarV2Props {
  defaultExpanded?: boolean;
}

export function SidebarV2({
  defaultExpanded = false,
}: SidebarV2Props) {
  /**
   * Sidebar state and handlers
   */
  const pathname = usePathname();
  const router = useRouter();
  const { state, dispatch } = useSidebarV2();
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  const user = useAuthStore((state) => state.user);
  const { isHovering, isExpanded, isPinned } = state;

  const handleTogglePin = useCallback(() => {
    dispatch.setIsPinned(!isPinned);
  }, [isPinned, dispatch]);

  const getActiveMenuItem = useCallback((): string | null => {
    return MENU_ITEMS_V2.find(
      (item) => pathname.startsWith(item.href) || pathname === item.href
    )?.id ?? null;
  }, [pathname]);

  const activeMenuItem = useMemo(() => getActiveMenuItem(), [getActiveMenuItem]);

  const avatar = useMemo(() => {
    return createAvatar(avataaarsNeutral, {
      size: 128,
      seed: user.name,
      radius: 20,
    }).toDataUri();
  }, [user.name]);

  const handleSignOut = useCallback(async () => {
    try {
      router.push('/auth/logout-loading');
      await authClient.signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Sign out failed:', error);
      router.push('/auth/login');
    }
  }, [router]);

  const handleMouseEnter = useCallback(() => {
    dispatch.setIsHovering(true);
  }, [dispatch]);

  const handleMouseLeave = useCallback(() => {
    dispatch.setIsHovering(false);
  }, [dispatch]);

  const sidebarClasses = useMemo(
    () =>
      cn(
        'flex flex-col h-full justify-between bg-none p-4 transition-all',
        SIDEBAR_TRANSITIONS.DURATION,
        SIDEBAR_TRANSITIONS.EASING,
        isExpanded ? SIDEBAR_WIDTHS.EXPANDED : SIDEBAR_WIDTHS.COLLAPSED
      ),
    [isExpanded]
  );

  return (
    <div
      className={sidebarClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className=' flex flex-col'>

     
      <div className={cn('flex items-center ', isExpanded ? 'justify-between' : 'justify-center')}>
        <Link href="/" className={cn('flex items-center', LOGO_STYLES.TRANSITION, isExpanded && 'gap-3')} aria-label="Home">
          <WalletLogoIconOpen className={cn(LOGO_STYLES.ICON_SIZE, LOGO_STYLES.ICON_COLOR)} aria-hidden="true" />
          {isExpanded && (
            <div className="min-w-0">
              <div className="text-sm font-bold text-foreground">MAPPR</div>
              <div className="text-[10px] text-muted-foreground leading-none -mt-0.5">Intelligence</div>
            </div>
          )}
        </Link>
        {isExpanded && (
          <div className="flex items-center gap-1">
            <ThemeSwitcher />
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 hover:bg-muted"
              onClick={handleTogglePin}
              title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
              aria-label={isPinned ? "Unpin sidebar" : "Pin sidebar"}
              aria-pressed={isPinned}
            >
              {isPinned ? (
                <Pin className="h-5 w-5 text-primary" />
              ) : (
                <PinOff className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>
          </div>
        )}


      </div>

        <div className="mt-8 flex items-center justify-center w-full flex-shrink-0">
        <OrganizationSwitcher compact={!isExpanded} />
      </div>

        <nav className="flex mt-20 flex-col gap-1.5 overflow-y-auto scrollbar-hide" aria-label="Navigation menu">
        {MENU_ITEMS_V2.map((item) => (
          <SidebarMenuButton
            key={item.id}
            item={item}
            isActive={activeMenuItem === item.id}
            isExpanded={isExpanded}
          />
        ))}
      </nav>

      </div>


    
     

      <footer className="flex flex-col gap-2 flex-shrink-0  ">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'relative flex items-center gap-3 h-10 rounded-lg transition-colors duration-100 text-muted-foreground',
                isExpanded ? 'w-full justify-start px-3' : 'w-10 justify-center p-0'
              )}
              aria-label="Menu"
            >
              <Settings2 className="h-6 w-6" aria-hidden="true" />
              {isExpanded && <span className="text-sm font-medium">Menu</span>}
            </Button>
          
          </PopoverTrigger>

          <PopoverContent
            side="right"
            align="end"
            className={cn(
              'border border-border/50 bg-background/95 backdrop-blur-sm shadow-lg',
              POPOVER_STYLES.WIDTH,
              POPOVER_STYLES.ROUNDED,
              POPOVER_STYLES.PADDING
            )}
          >
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings className="h-4 w-4" aria-hidden="true" />
                <span>Settings</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
              >
                <HelpCircle className="h-4 w-4" aria-hidden="true" />
                <span>Help & Feedback</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'relative flex items-center gap-3 h-10 rounded-lg transition-colors duration-150',
                isExpanded ? 'w-full justify-start px-3' : 'w-10 justify-center p-0'
              )}
              aria-label="User menu"
            >
              <Avatar className="h-7 w-7">
                <AvatarImage
                  src={avatar}
                  alt={`${user?.name || 'User'}'s avatar`}
                />
                <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                  {user?.name?.charAt(0)?.toUpperCase() ||
                    user?.email?.charAt(0)?.toUpperCase() ||
                    'U'}
                </AvatarFallback>
              </Avatar>

              {isExpanded && (
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs font-medium truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align={'start'}
            side="top"
            className={cn(
              'bg-background border border-border/50 shadow-lg',
              POPOVER_STYLES.WIDTH,
              POPOVER_STYLES.ROUNDED
            )}
          >
            <div className="px-3 py-2 border-b border-border/30">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>

            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/profile" className="flex items-center gap-3">
                <User className="h-4 w-4" aria-hidden="true" />
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/subscription" className="flex items-center gap-3">
                <Crown className="h-4 w-4" aria-hidden="true" />
                Subscription
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="flex items-center gap-3 text-destructive cursor-pointer focus:text-destructive focus:bg-destructive/10"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </footer>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}

export type { SidebarV2Props };
