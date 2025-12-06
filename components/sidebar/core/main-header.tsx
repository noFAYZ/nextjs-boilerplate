'use client';

import * as React from 'react';
import { Crown, LogOut, Menu, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { TablerLayoutSidebarLeftExpandFilled } from '@/components/icons/icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { GlobalViewSwitcher } from '@/components/ui/global-view-switcher';
import { OrganizationSwitcher } from '@/components/organization';
import { ActionSearchBar } from '@/components/ui/action-search-bar';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from '@/components/ui/tooltip';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useCommandPalette } from '@/components/command/command-palette';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { useCallback } from 'react';

import { createAvatar } from '@dicebear/core';
import { avataaarsNeutral } from '@dicebear/collection';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/stores';
import { authClient } from '@/lib/auth-client';
import { signOut } from '@/lib/auth-client';

interface MainHeaderProps {
  mainColumnExpanded: boolean;
  onToggleMainColumn: () => void;
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

// Helper function to generate breadcrumb items from pathname
function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: { label: string; href: string }[] = [];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    breadcrumbs.push({
      label,
      href: currentPath,
      isLast: index === segments.length - 1
    });
  });

  return breadcrumbs;
}

export function MainHeader({
  mainColumnExpanded,
  onToggleMainColumn,
  onMobileMenuToggle,
  isMobileMenuOpen = false
}: MainHeaderProps) {

  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const logout = useAuthStore((state) => state.logout);
  const profileLoading = !isInitialized;

  const pathname = usePathname();
  const router = useRouter();
  const { openCommandPalette } = useCommandPalette();
  const breadcrumbs = generateBreadcrumbs(pathname);

  const handleSignOut = useCallback(async () => {
    try {
      // Show loading state first
      router.push('/auth/logout-loading');

      // Call auth store's logout which handles both session clearing and state reset
      await logout();

      // Navigate to login after logout is fully complete
      // Middleware will recognize missing session and allow navigation to login
      router.push('/auth/login');
    } catch (error) {
      console.error('Sign out failed:', error);
      // Force redirect to login on error and ensure local state is cleared
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


  return (
    <TooltipProvider delayDuration={200}>
      <header className="sticky top-0 z-40  ">
        <div className="h-14 md:h-16 relative mx-auto px-3 sm:px-4  flex items-center">
          {/* Left Section - Mobile Menu & Desktop Collapse/Expand + Breadcrumbs */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* Mobile Menu Button - Visible only on mobile */}
            <div className="md:hidden">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={onMobileMenuToggle}
                  >
                    <Menu className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  sideOffset={8}
                  className="bg-[#2a2a2a] text-white text-xs font-medium rounded-lg shadow-xl border border-white/10"
                >
                  Toggle menu
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Desktop Expand/Collapse Icon - Hidden on mobile */}
            <div className="hidden md:block">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={onToggleMainColumn}
                  >
                    {mainColumnExpanded ? (
                      <TablerLayoutSidebarLeftExpandFilled className="h-6 w-6 transition-all duration-100 text-muted-foreground rotate-180" />
                    ) : (
                      <TablerLayoutSidebarLeftExpandFilled className="h-6 w-6 transition-all duration-100 text-muted-foreground" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  sideOffset={8}
                  className="bg-[#2a2a2a] text-white text-xs font-medium rounded-lg shadow-xl border border-white/10"
                >
                  {mainColumnExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Breadcrumbs - Hidden on mobile */}
            {breadcrumbs.length > 0 && (
              <div className="hidden md:flex items-center   ">
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbs.map((crumb, index) => (
                      <React.Fragment key={crumb.href}>
                        {index > 0 && <BreadcrumbSeparator />}
                        <BreadcrumbItem>
                          {crumb.isLast ? (
                            <BreadcrumbPage className=" text-md text-foreground font-medium">
                              {crumb.label}
                            </BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink asChild>
                              <Link href={crumb.href} className="text-md text-muted-foreground hover:text-foreground">
                                {crumb.label}
                              </Link>
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                      </React.Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            )}
          </div>

          {/* Center Section - Action Search Bar (Always Centered) */}
          <div className="absolute left-1/2  -translate-x-1/2 top-1/2 transform -translate-y-1/2 w-full md:max-w-md px-3 sm:px-4 md:px-6">
            <ActionSearchBar onOpenCommandPalette={openCommandPalette}  />
          </div>

          {/* Right Section - Theme & Global Switcher & User Profile */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Hide global switcher on small mobile*/}
            
             <ThemeSwitcher />
{/* <div className="hidden sm:block">
              <GlobalViewSwitcher size="sm" className="items-start justify-start mx-0" />
            </div> */}
            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-full p-1 pr-2 h-9 gap-2 hover:bg-muted"
                >
                  {profileLoading || !user.id? (
                    <Skeleton className="h-7 w-7 rounded-full" />
                  ) : (
                    <>
                      <Avatar className="h-7 w-7 rounded-full flex-shrink-0">
                        <AvatarImage
                          src={user?.image ?? avatar}
                          alt={`${user?.name || 'User'}'s avatar`}
                          className='rounded-full'
                        />
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground font-semibold">
                          {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline text-sm font-medium truncate max-w-[100px]">
                        {String(user?.name)?.split(' ')[0] || 'User'}
                      </span>
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="w-56">
                {/* User Header */}
                <div className="px-2 py-1.5">
                  <p className="text-sm font-semibold">{user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>

                <DropdownMenuSeparator />

                {/* Menu Items */}
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    <span>Profile Settings</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/subscription" className="flex items-center gap-2 cursor-pointer">
                    <Crown className="h-4 w-4" />
                    <span>Subscription</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Sign Out */}
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-destructive focus:text-destructive cursor-pointer gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}
