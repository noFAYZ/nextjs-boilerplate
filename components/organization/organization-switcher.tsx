'use client';

/**
 * Organization Switcher
 *
 * Modern dropdown component for switching between organizations
 * - Built on Radix DropdownMenu for robustness
 * - Displays current organization with visual indicators
 * - Lists all available organizations
 * - Quick actions to create new org or manage members
 * - Shows personal workspace indicator with accessible styling
 */

import { useRouter } from 'next/navigation';
import { ChevronDown, Plus, Users, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { useOrganizations, usePersonalOrganization } from '@/lib/queries/use-organization-data';
import { useOrganizationUIStore } from '@/lib/stores/ui-stores';
import { useOrganizationStore } from '@/lib/stores/organization-store';
import type { Organization } from '@/lib/types/organization';
import { Button } from '../ui/button';
import { PhUsersDuotone } from '../icons/icons';

interface OrganizationSwitcherProps {
  className?: string;
  onOrgSelect?: (org: Organization) => void;
}

function OrgAvatar({ org, size = 'default' }: { org: Organization; size?: 'sm' | 'default' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
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

export function OrganizationSwitcher({ className = '', onOrgSelect }: OrganizationSwitcherProps) {
  const router = useRouter();

  // Data hooks
  const { data: organizations = [], isLoading: orgsLoading, error: orgsError } = useOrganizations();
  const { data: personalOrg, isLoading: personalOrgLoading } = usePersonalOrganization();

  // UI store (for modal states, selections UI)
  const { selectedOrganizationId, selectOrganization, openCreateOrgModal } =
    useOrganizationUIStore();

  // Context store (for data scoping - triggers query invalidation)
  const { setSelectedOrganization } = useOrganizationStore();

  const isLoading = orgsLoading || personalOrgLoading;
  const hasError = orgsError !== null && orgsError !== undefined;

  // Find current organization (prefer selected, fallback to personal)
  let currentOrg = organizations.find((org) => org.id === selectedOrganizationId);
  if (!currentOrg) {
    currentOrg = personalOrg;
  }

  const handleOrgSelect = (org: Organization) => {
    // Update BOTH stores:
    // 1. UI store for selection state/visual feedback
    selectOrganization(org.id);
    // 2. Context store for data scoping (this triggers OrganizationDataSyncProvider to invalidate queries)
    setSelectedOrganization(org.id);
    onOrgSelect?.(org);
    router.push(`/dashboard?org=${org.id}`);
  };

  const handleCreateOrg = () => {
    openCreateOrgModal();
  };

  const handleManageMembers = (org: Organization) => {
    router.push(`/dashboard/organization/${org.id}/members`);
  };

  // Show loading state
  if (isLoading && !currentOrg) {
    return (
      <div className={`flex items-center gap-3 px-3 py-2 rounded-md bg-muted ${className}`}>
        <div className="h-2 w-2 rounded-full animate-pulse bg-muted-foreground/50" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  // Show error state
  if (hasError && !currentOrg) {
    return (
      <div className={`flex items-center gap-3 px-3 py-2 rounded-md bg-destructive/10 border border-destructive/20 ${className}`}>
        <div className="h-2 w-2 rounded-full bg-destructive" />
        <span className="text-sm text-destructive font-medium">Error loading</span>
      </div>
    );
  }

  // Fallback if no organization found
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
    <DropdownMenu>
      {/* Trigger Button */}
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            'flex items-center justify-between gap-3 w-full px-3 py-5 rounded-lg',
            
        
            'group',
            className
          )}
          aria-label={`Current workspace: ${currentOrg.name}`}
          variant='outline'
          size='lg'
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <OrgAvatar org={currentOrg} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{currentOrg.name}</p>
           
            </div>
          </div>
          <ChevronDown
            size={16}
            className="flex-shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
          />
        </Button>
      </DropdownMenuTrigger>

      {/* Dropdown Content */}
      <DropdownMenuContent align="start" sideOffset={8} className="w-72">
        {/* Header */}
        <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold uppercase text-muted-foreground tracking-wide">
          Your Workspaces
        </DropdownMenuLabel>

        {/* Organizations Group */}
        <DropdownMenuGroup>
          {organizations.length > 0 ? (
            organizations.map((org) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => handleOrgSelect(org)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 cursor-pointer',
                  org.id === selectedOrganizationId && 'bg-muted '
                )}
              >
                <OrgAvatar org={org}   />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{org.name}</p>
                  {org.isPersonal && (
                    <p className="text-xs text-muted-foreground">Personal Workspace</p>
                  )}
                </div>
                {org.id === selectedOrganizationId && (
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                )}
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-3 py-6 text-center">
              <p className="text-sm text-muted-foreground">No workspaces yet</p>
            </div>
          )}
        </DropdownMenuGroup>

        {/* Separator */}
        <DropdownMenuSeparator className="my-2" />

        {/* Actions */}
        <DropdownMenuGroup>
        
            <Button className='w-full mb-2' size='xs'    onClick={handleCreateOrg}>
                    
            <span className="font-medium">Create Workspace</span>
            </Button>
     
       

          {currentOrg && (
            <DropdownMenuItem
              onClick={() => handleManageMembers(currentOrg)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm cursor-pointer"
            >
              <PhUsersDuotone   />
              <span>Manage Members</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
