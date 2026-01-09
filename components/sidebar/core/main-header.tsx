'use client';

import * as React from 'react';
import {
  Crown,
  LogOut,
  Menu,
  MenuIcon,
  PlusIcon,
  RefreshCcw,
  Settings,
  User,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { createAvatar } from '@dicebear/core';
import { avataaarsNeutral } from '@dicebear/collection';
import { useCallback, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { ActionSearchBar } from '@/components/ui/action-search-bar';
import { PageTabs } from '@/components/ui/page-tabs';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { AddAccountDialog } from '@/components/accounts/add-account-dialog';

import { useCommandPalette } from '@/components/command/command-palette';
import { useAuthStore, useGlobalUIStore } from '@/lib/stores';
import {
  LetsIconsAddDuotone,
  SolarRefreshCircleBoldDuotone,
  TablerLayoutSidebarLeftExpandFilled,
  SolarLibraryBoldDuotone,
  SolarBillListBoldDuotone,
  SolarInboxInBoldDuotone,
  MageGoals,
} from '@/components/icons/icons';
import { GlobalViewSwitcher } from '@/components/ui/global-view-switcher';
import { OnboardingIndicator } from '@/components/layout/onboarding-indicator';
import { useIsFetching, useIsMutating, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/lib/hooks/useToast';
import { LetsIconsSettingLineDuotone } from '@/components/icons';

interface MainHeaderProps {
  mainColumnExpanded: boolean;
  onToggleMainColumn: () => void;
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

// Breadcrumb generator
function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);

  return segments.map((segment, index) => {
    const label = segment
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const href = '/' + segments.slice(0, index + 1).join('/');

    return {
      label,
      href,
      isLast: index === segments.length - 1
    };
  });
}

export function MainHeader({
  mainColumnExpanded,
  onToggleMainColumn,
  onMobileMenuToggle,
  isMobileMenuOpen = false
}: MainHeaderProps) {

  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const logout = useAuthStore((s) => s.logout);
  const profileLoading = !isInitialized;

  const pathname = usePathname();
  const router = useRouter();
  const { openCommandPalette } = useCommandPalette();
  const breadcrumbs = generateBreadcrumbs(pathname);
  const queryClient = useQueryClient();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isLoading = isFetching > 0 || isMutating > 0;
  const { toast } = useToast();

  // Add menu state
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);

  const handleSignOut = useCallback(async () => {
    try {
      router.push('/auth/logout-loading');
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Sign out failed:', error);
      useAuthStore.setState({
        user: null,
        session: null,
        isAuthenticated: false,
      });
      router.push('/auth/login');
    }
  }, [router, logout]);

  const avatar = createAvatar(avataaarsNeutral, {
    size: 128,
    seed: user.name,
    radius: 100,
  }).toDataUri();

  const firstName =
  user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "User";
const currentHour = new Date().getHours();
const greeting =
  currentHour < 12
    ? "Good morning"
    : currentHour < 18
    ? "Good afternoon"
    : "Good evening";
   
  const handleRefresh = React.useCallback(async () => {
    try {
      // Detect current page and refetch appropriate data
      if (pathname.includes("/subscriptions")) {
        await queryClient.refetchQueries({ queryKey: ["subscriptions"] });
      } else {
        // Generic refetch for other pages
        await queryClient.refetchQueries();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive",
      });
    }
  }, [pathname, queryClient, toast]);

  // Add menu action handlers
  const handleAddAccount = () => {
    setAddMenuOpen(false);
    setIsAddAccountDialogOpen(true);
  };

  const handleAddTransaction = () => {
    setAddMenuOpen(false);
    // TODO: Implement add transaction dialog
  };

  const handleAddRule = () => {
    setAddMenuOpen(false);
    // TODO: Implement add rule dialog
  };

  const handleAddSubscription = () => {
    setAddMenuOpen(false);
    router.push('/subscriptions');
  };

  const handleAddGoal = () => {
    setAddMenuOpen(false);
    // TODO: Implement add goal dialog
  };
  return (
    <TooltipProvider delayDuration={100}>
      <header className="relative w-full z-40  ">
        {/* Row 1 — Main Navigation */}
        <div className="flex items-center justify-between h-14 md:h-16 px-3 sm:px-4 relative  ">
          
          {/* LEFT GROUP */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Mobile menu */}
            <div className="md:hidden">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-sm" onClick={onMobileMenuToggle}>
                    <Menu className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Toggle menu</TooltipContent>
              </Tooltip>
            </div>

           

            {/* Sidebar toggler — desktop only 
            <div className="hidden md:block">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-sm" onClick={onToggleMainColumn}>
                    {mainColumnExpanded ? (
                      <TablerLayoutSidebarLeftExpandFilled className="h-6 w-6 rotate-180 text-muted-foreground" />
                    ) : (
                      <TablerLayoutSidebarLeftExpandFilled className="h-6 w-6 text-muted-foreground" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {mainColumnExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
                </TooltipContent>
              </Tooltip>
            </div>*/}
 {/* Page Tabs - shown on /accounts and /transactions pages */}
            <PageTabs />
            {/* Breadcrumbs — desktop only 
            {breadcrumbs.length > 0 && (
              <div className="hidden lg:flex">
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbs.map((c, i) => (
                      <React.Fragment key={c.href}>
                        {i > 0 && <BreadcrumbSeparator />}
                        <BreadcrumbItem>
                          {c.isLast ? (
                            <BreadcrumbPage className="text-base font-semibold">
                              {c.label}
                            </BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink asChild>
                              <Link
                                href={c.href}
                                className="text-base font-semibold text-muted-foreground hover:text-foreground"
                              >
                                {c.label}
                              </Link>
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                      </React.Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            )}*/}
          </div>

          {/* CENTER GROUP — Search Bar 
          <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 w-full max-w-md px-4">
            <ActionSearchBar onOpenCommandPalette={openCommandPalette}  />
          </div>*/}

          {/* MOBILE SEARCH (Full width under navbar) <OnboardingIndicator />*/}
          <div className="sm:hidden relative  px-3">
            <ActionSearchBar onOpenCommandPalette={openCommandPalette} />
          </div>

          {/* RIGHT GROUP */}
          <div className="flex items-center gap-2  ml-auto">

            

        
 {/* Add button */}
 <Button variant="outline"      onClick={handleRefresh}  disabled={isLoading} className='  pl-1  pr-2  ' icon={ <SolarRefreshCircleBoldDuotone className={cn("h-6 w-6", isLoading && "animate-spin")} />}>
             
              Sync
            </Button>
      
            {/* Add menu popover */}
            <Popover open={addMenuOpen} onOpenChange={setAddMenuOpen}>
              <PopoverTrigger asChild>
                <Button   size='icon' className='rounded-full'  >
                  <PlusIcon className="h-6 w-6" strokeWidth={2} />
               
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" align="end">
                <div className="space-y-1">
                  {/* Account */}
                  <button
                    onClick={handleAddAccount}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <SolarLibraryBoldDuotone className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium">Account</span>
                  </button>

                  {/* Transaction */}
                  <button
                    onClick={handleAddTransaction}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <SolarBillListBoldDuotone className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium">Transaction</span>
                  </button>

                  {/* Rule */}
                  <button
                    onClick={handleAddRule}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <LetsIconsSettingLineDuotone className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium">Rule</span>
                  </button>

                  {/* Subscription */}
                  <button
                    onClick={handleAddSubscription}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <SolarInboxInBoldDuotone className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium">Subscription</span>
                  </button>

                  {/* Goal */}
                  <button
                    onClick={handleAddGoal}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <MageGoals className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium">Goal</span>
                  </button>
                </div>
              </PopoverContent>
            </Popover>


          </div>
        </div>

        {/* Add Account Dialog */}
        <AddAccountDialog open={isAddAccountDialogOpen} onOpenChange={setIsAddAccountDialogOpen} />

      </header>
    </TooltipProvider>
  );
}
