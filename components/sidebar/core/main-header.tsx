'use client';

import * as React from 'react';
import {
  Crown,
  LogOut,
  Menu,
  PlusIcon,
  RefreshCcw,
  Settings,
  User
} from 'lucide-react';
import Link from 'next/link';
import { createAvatar } from '@dicebear/core';
import { avataaarsNeutral } from '@dicebear/collection';
import { useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { ActionSearchBar } from '@/components/ui/action-search-bar';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';

import { useCommandPalette } from '@/components/command/command-palette';
import { useAuthStore, useGlobalUIStore } from '@/lib/stores';
import { LetsIconsAddDuotone, SolarRefreshCircleBoldDuotone, TablerLayoutSidebarLeftExpandFilled } from '@/components/icons/icons';
import { GlobalViewSwitcher } from '@/components/ui/global-view-switcher';

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
  const openAddMenu = useGlobalUIStore((s) => s.openAddMenu);
  const breadcrumbs = generateBreadcrumbs(pathname);

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

            {/* <h1 className="text-lg font-semibold mb-1  bg-clip-text">
            {greeting}, {firstName}!  
          </h1> */}
          <ActionSearchBar onOpenCommandPalette={openCommandPalette} />

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
            <ActionSearchBar onOpenCommandPalette={openCommandPalette} cla />
          </div>*/}

          {/* MOBILE SEARCH (Full width under navbar) */}
          <div className="sm:hidden relative  px-3">
            <ActionSearchBar onOpenCommandPalette={openCommandPalette} />
          </div>

          {/* RIGHT GROUP */}
          <div className="flex items-center gap-2  ml-auto">
            
        
            <ThemeSwitcher />
 {/* Add button */}
 <Button variant="outline2" size='sm'  className='rounded-full pl-1 shadow-none pr-2' icon={ <SolarRefreshCircleBoldDuotone className="h-6 w-6" />}>
             
              Sync
            </Button>
      
            {/* Add button */}
       
                <Button variant="brand" size='icon-sm'  className='rounded-[0.9rem]' onClick={openAddMenu}>
                  <PlusIcon className="h-5 w-5" />
                </Button>
             
          </div>
        </div>


      </header>
    </TooltipProvider>
  );
}
