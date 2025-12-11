'use client';

/**
 * User Organization Switcher
 *
 * Hybrid component combining:
 * - Organization switcher with workspace management
 * - User profile dropdown with account actions
 * - Global view switcher (Lite/Pro mode)
 * - Theme switcher (Light/Dark mode)
 *
 * Shows expanded or compact version based on sidebar state
 */

import { useRouter } from 'next/navigation';
import { ChevronDown, Crown, LogOut, Settings, User, ChevronsUpDownIcon, MenuIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from '@/components/ui/tooltip';
import { useOrganizations, usePersonalOrganization } from '@/lib/queries/use-organization-data';
import { useOrganizationUIStore } from '@/lib/stores/ui-stores';
import { useOrganizationStore } from '@/lib/stores/organization-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { authClient } from '@/lib/auth-client';
import type { Organization } from '@/lib/types/organization';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { PhUsersDuotone } from '../icons/icons';
import { GlobalViewSwitcher } from '@/components/ui/global-view-switcher';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { createAvatar } from '@dicebear/core';
import { avataaarsNeutral } from '@dicebear/collection';
import Link from 'next/link';

interface UserOrgSwitcherProps {
  compact?: boolean;
  className?: string;
}

function OrgAvatar({ org, size = 'default' }: { org: Organization; size?: 'sm' | 'default' | 'lg' |'xs' }) {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-7 h-7 text-xs',
    default: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  return (
    <div className={`flex items-center justify-center rounded-full font-semibold text-white flex-shrink-0 bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 ${sizeClasses[size]}`}>
      {org.icon ? (
        <span>{org.icon}</span>
      ) : (
        <span>{org.name[0]?.toUpperCase()}</span>
      )}
    </div>
  );
}

export function UserOrgSwitcher({ compact = false, className = '' }: UserOrgSwitcherProps) {
  const router = useRouter();

  // Data hooks
  const { data: organizations = [], isLoading: orgsLoading } = useOrganizations();
  const { data: personalOrg, isLoading: personalOrgLoading } = usePersonalOrganization();
  const user = useAuthStore((state) => state.user);

  // UI store (for modal states, selections)
  const { selectedOrganizationId, selectOrganization, openCreateOrgModal } =
    useOrganizationUIStore();

  // Context store (for data scoping)
  const { setSelectedOrganization } = useOrganizationStore();

  const isLoading = orgsLoading || personalOrgLoading;

  // Find current organization
  let currentOrg = organizations.find((org) => org.id === selectedOrganizationId);
  if (!currentOrg) {
    currentOrg = personalOrg;
  }

  const handleSignOut = async () => {
    try {
      router.push('/auth/logout-loading');
      await authClient.signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Sign out failed:', error);
      router.push('/auth/login');
    }
  };

  const handleOrgSelect = (org: Organization) => {
    selectOrganization(org.id);
    setSelectedOrganization(org.id);
  };

  const handleCreateOrg = () => {
    openCreateOrgModal();
  };

  const handleManageMembers = (org: Organization) => {
    router.push(`/dashboard/organization/${org.id}/members`);
  };

  const avatar = createAvatar(avataaarsNeutral, {
    size: 128,
    seed: user.name,
    radius: 20,
  }).toDataUri();

  if (isLoading && !currentOrg) {
    return (
      <div className={`flex items-center gap-3 px-3 py-2 rounded-md border border-border/50 bg-muted ${className}`}>
        <div className="h-2 w-2 rounded-full animate-pulse bg-muted-foreground/50" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (!currentOrg) {
    return (
      <div className={`flex items-center gap-3 px-3 py-2 rounded-md bg-muted ${className}`}>
        <div className="h-6 w-6 rounded-md bg-muted-foreground/20 flex items-center justify-center">
          <span className="text-xs font-semibold">?</span>
        </div>
        <span className="text-sm text-muted-foreground">Select Org</span>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Popover>
        {compact ? (
          <PopoverTrigger asChild>
            <Button
              variant="outline2"
              size="icon-sm"
              className="rounded-full   border"
              aria-label={`Current workspace: ${currentOrg.name}`}
              title={user?.name || 'Profile'}
            >
              <Avatar className="h-full w-full border">
                <AvatarImage
                  src={avatar}
                  alt={`${user?.name || "User"}'s avatar`}
                />
                <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                  {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </PopoverTrigger>
        ) : (
          <PopoverTrigger asChild>
            <Button
              variant="outlinebrand"
              size="xl"
              className="flex items-center justify-between gap-2 md:gap-3 w-full px-2  "
              aria-label={`Current workspace: ${currentOrg.name}`}
            >
              <div className="flex items-center text-start gap-2 flex-1 min-w-0">
              <OrgAvatar org={currentOrg} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-[10px] md:text-xs font-medium truncate">{user?.name}</p>

                  </div>
                  <p className="text-[9px] md:text-[10px] text-muted-foreground truncate">{currentOrg.name}</p>
                </div>
              </div>
              <ChevronsUpDownIcon
                size={18}
                className="flex-shrink-0  hidden sm:block"
              />
            </Button>
          </PopoverTrigger>
        )}

        {/* Popover Content — Hybrid of Organization and User */}
        <PopoverContent align="start" sideOffset={12} className="w-70 p-3 space-y-2">

          {/* User Section Header */}
          <div className="space-y-2 border-b pb-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage
                  src={avatar}
                  alt={`${user?.name || "User"}'s avatar`}
                />
                <AvatarFallback className="text-sm bg-muted text-muted-foreground">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Organization Section */}
          <div className="space-y-2">
            <div className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wide">
              Workspaces
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1">
              {organizations.length > 0 ? (
                organizations.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => handleOrgSelect(org)}
                    className={cn(
                      'w-full flex items-center gap-2 px-2 py-1 rounded-md text-sm transition-colors',
                      org.id === selectedOrganizationId
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground hover:bg-muted/50'
                    )}
                  >
                    <OrgAvatar  org={org} size="xs" />
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-medium truncate">{org.name}</p>
                      {org.isPersonal && (
                        <p className="text-xs text-muted-foreground">Personal</p>
                      )}
                    </div>
                    {org.id === selectedOrganizationId && (
                      <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-3">No workspaces</p>
              )}
            </div>

            <Button
              className="w-full"
              size="xs"
              onClick={handleCreateOrg}
              variant="outline"
            >
              Create Workspace
            </Button>

            {currentOrg && (
              <Button
                className="w-full"
                size="xs"
                variant="ghost"
                onClick={() => handleManageMembers(currentOrg)}
              >
                <PhUsersDuotone className="h-4 w-4 mr-2" />
                Manage Members
              </Button>
            )}
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* User Actions */}
          <div className="space-y-0.5">
            <Button
              variant="ghost"
              size="xs"
              className="w-full justify-start"
              asChild
            >
              <Link href="/profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile Settings
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="xs"
              className="w-full justify-start"
              asChild
            >
              <Link href="/subscription" className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                Subscription
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="xs"
              className="w-full justify-start"
              asChild
            >
              <Link href="/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* Global Controls 
          <div className="flex flex-col flex-1 space-y-2">
            <div className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wide">
              Preferences
            </div>

   
            <div className="flex w-full">
  <ThemeSwitcher />
              <GlobalViewSwitcher
                size="sm"
                showLabels={true}
             className='   justify-center'
              />
              
            </div>

            <GlobalViewSwitcher   size="sm" />
          
          </div>*/}
 <GlobalViewSwitcher   size="sm" className='border-0'/>
          {/* Divider */}
          <div className="border-t" />

          {/* Sign Out */}
          <Button
            variant="steel"
            size="xs"
            className="w-full bg-red-400"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
}
