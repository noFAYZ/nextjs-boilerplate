'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronsUpDown, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

import {
  useOrganizations,
} from '@/lib/features/organization/queries';
import { useOrganizationUIStore } from '@/lib/features/organization/stores';
import { useOrganizationStore } from '@/lib/features/organization/stores';
import { useOrgSwitcher } from '@/lib/features/organization/hooks';
import { OrgSwitchingOverlay } from './org-switching-overlay';

import type { Organization } from '@/lib/types/organization';
import { PhUsersDuotone } from '@/components/icons/icons';

/* -------------------------------------------------------------------------- */
/*                                   Avatar                                   */
/* -------------------------------------------------------------------------- */

const OrgAvatar = React.memo(function OrgAvatar({
  org,
  size = 'default',
}: {
  org: Organization;
  size?: 'sm' | 'default' | 'lg';
}) {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    default: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full',
        'bg-secondary text-foreground font-medium border',
        sizeClasses[size]
      )}
    >
      {org.icon ?? org.name?.[0]?.toUpperCase()}
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/*                           Organization Switcher                             */
/* -------------------------------------------------------------------------- */

interface OrganizationSwitcherProps {
  className?: string;
  compact?: boolean;
  onOrgSelect?: (org: Organization) => void;
}

export function OrganizationSwitcher({
  className,
  compact,
  onOrgSelect,
}: OrganizationSwitcherProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isSwitching, setIsSwitching] = React.useState(false);
  const [switchingOrg, setSwitchingOrg] = React.useState<Organization | null>(null);
  const [switchError, setSwitchError] = React.useState<string | null>(null);

  const { data: orgsResponse, isLoading: orgsLoading } =
    useOrganizations();

  // Extract data from API responses
  const organizations = Array.isArray(orgsResponse)
    ? orgsResponse
    : (orgsResponse as any)?.data ?? [];

  const {
    selectedOrganizationId,
    selectOrganization,
    openCreateOrgModal,
  } = useOrganizationUIStore();

  const { setSelectedOrganization } = useOrganizationStore();
  const { switchOrganization } = useOrgSwitcher();

  const isLoading = orgsLoading;

  const currentOrg = React.useMemo(
    () =>
      organizations.find((o) => o.id === selectedOrganizationId) ??
      organizations[0],
    [organizations, selectedOrganizationId]
  );

  const handleSelect = React.useCallback(
    async (org: Organization) => {
      if (org.id === selectedOrganizationId) {
        setOpen(false);
        return;
      }

      setIsSwitching(true);
      setSwitchingOrg(org);
      setSwitchError(null);

      try {
        // Step 1: Update UI store optimistically
        selectOrganization(org.id);

        // Step 2: Switch organization (backend-aware)
        // This:
        // - Updates Better Auth session.activeOrganizationId
        // - Invalidates session cache
        // - Refetches all org-scoped queries
        const result = await switchOrganization(org.id);

        if (!result.success) {
          // Rollback on failure
          selectOrganization(selectedOrganizationId);
          setSwitchError(result.error || 'Failed to switch organization');
          return;
        }

        // Success - close popover and clear overlay after a brief delay
        setOpen(false);
        onOrgSelect?.(org);

        // Clear overlay state after animation completes
        setTimeout(() => {
          setIsSwitching(false);
          setSwitchingOrg(null);
          setSwitchError(null);
        }, 500);
      } catch (error) {
        // Rollback on error
        selectOrganization(selectedOrganizationId);
        console.error('Organization switch error:', error);
        setSwitchError('An error occurred while switching organizations');
      }
    },
    [
      selectOrganization,
      selectedOrganizationId,
      switchOrganization,
      onOrgSelect,
    ]
  );

  if (!currentOrg) return null;

  return (
    <>
      <OrgSwitchingOverlay
        isOpen={isSwitching && !!switchingOrg}
        organization={switchingOrg}
        isError={!!switchError}
        errorMessage={switchError}
        onDismiss={() => {
          setIsSwitching(false);
          setSwitchingOrg(null);
          setSwitchError(null);
        }}
      />
      <Popover open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <PopoverTrigger asChild>
        <Button
          variant={compact ? 'ghost' : 'ghost'}
          size={compact ? 'icon-lg' : 'lg'}
          disabled={isSwitching}
          className={cn(
            'group ',
            compact
              ? 'rounded-full'
              : 'flex w-full items-center justify-between gap-3 px-1 rounded-lg shadow-none hover:bg-muted/60 disabled:opacity-50',
            className
          )}
          aria-label={`Current workspace: ${currentOrg.name}`}
        >
          {compact ? (
            <OrgAvatar org={currentOrg} size="sm" />
          ) : (
            <>
              <div className="flex items-center gap-2 min-w-0">
                <OrgAvatar org={currentOrg} size="sm" />
                <div className="min-w-0 text-left">
                  <p className="text-xs font-medium truncate">
                    {currentOrg.isPersonal
                      ? 'Personal Workspace'
                      : currentOrg.name}
                  </p>
                </div>
              </div>
              {isSwitching ? (
                <Loader2 className="h-4 w-4 animate-spin ml-auto text-muted-foreground" />
              ) : (
                <ChevronsUpDown className="h-4 w-4 text-muted-foreground transition group-hover:opacity-80" />
              )}
            </>
          )}
        </Button>
      </PopoverTrigger>

      {/* Content */}
      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-72 p-2"
      >
        <p className="px-2 py-1.5 text-xs font-semibold uppercase text-muted-foreground">
          Workspaces
        </p>

        <div
          className="mt-1 space-y-0.5"
          role="listbox"
          aria-label="Workspaces"
        >
          {isLoading ? (
            <div className="px-3 py-4 text-sm text-muted-foreground">
              Loading…
            </div>
          ) : organizations.length === 0 ? (
            <div className="px-3 py-4 text-sm text-muted-foreground">
              No workspaces yet
            </div>
          ) : (
            organizations.map((org) => {
              const active = org.id === selectedOrganizationId;

              return (
                <Button
                  key={org.id}
                  role="option"
                  aria-selected={active}
                  onClick={() => handleSelect(org)}
                  disabled={isSwitching}
                  variant='ghost'
                  className={cn(
                    'relative flex items-center gap-3 rounded-md w-full  text-start',
                    'transition hover:bg-secondary focus-visible:outline-none disabled:opacity-50',
                    active && 'bg-muted'
                  )}
                >
                  {active && (
                    <span className="absolute left-0 h-4 w-0.5 rounded bg-primary" />
                  )}

                  <OrgAvatar org={org} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate">
                      {org.name}
                    </p>
                   
                  </div>
                </Button>
              );
            })
          )}
        </div>

        <Separator className="my-2" />

        <div className="space-y-1">
          <Button
            size="xs"
            variant="secondary"
            disabled={isSwitching}
            className="w-full"
            onClick={() => {
              setOpen(false);
              openCreateOrgModal();
            }}
          >
            Create Workspace
          </Button>

          <Button
            variant="ghost"
            disabled={isSwitching}
            className={cn(
              'relative flex items-center gap-3 rounded-md w-full  text-start',
              'transition hover:bg-muted focus-visible:outline-none justify-start disabled:opacity-50',
            )}
            onClick={() => {
              setOpen(false);
              router.push(
                `/dashboard/organization/${currentOrg.id}/members`
              );
            }}
          >
            <PhUsersDuotone className="h-4 w-4" />
            Manage Members
          </Button>
        </div>
      </PopoverContent>
    </Popover>
    </>
  );
}
