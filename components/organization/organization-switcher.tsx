'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronsUpDown } from 'lucide-react';

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
  usePersonalOrganization,
} from '@/lib/queries/use-organization-data';
import { useOrganizationUIStore } from '@/lib/stores/ui-stores';
import { useOrganizationStore } from '@/lib/stores/organization-store';
import { authClient } from '@/lib/auth-client';

import type { Organization } from '@/lib/types/organization';
import { PhUsersDuotone } from '../icons/icons';

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
        'bg-muted text-foreground font-medium border',
        sizeClasses[size]
      )}
    >
      {org.icon ?? org.name[0]?.toUpperCase()}
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

  const { data: organizations = [], isLoading: orgsLoading } =
    useOrganizations();
  const { data: personalOrg, isLoading: personalLoading } =
    usePersonalOrganization();

  const {
    selectedOrganizationId,
    selectOrganization,
    openCreateOrgModal,
  } = useOrganizationUIStore();

  const { setSelectedOrganization } = useOrganizationStore();

  const isLoading = orgsLoading || personalLoading;

  const currentOrg = React.useMemo(
    () =>
      organizations.find((o) => o.id === selectedOrganizationId) ??
      personalOrg,
    [organizations, selectedOrganizationId, personalOrg]
  );

  const handleSelect = React.useCallback(
    async (org: Organization) => {
      if (org.id === selectedOrganizationId) {
        setOpen(false);
        return;
      }

      selectOrganization(org.id);
      setSelectedOrganization(org.id);
      setOpen(false);

      await authClient.organization.setActive({
        organizationId: org.id,
      });

      onOrgSelect?.(org);
    },
    [
      selectOrganization,
      setSelectedOrganization,
      selectedOrganizationId,
      onOrgSelect,
    ]
  );

  if (!currentOrg) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <PopoverTrigger asChild>
        <Button
          variant={compact ? 'outline2' : 'outline2'}
          size={compact ? 'icon-sm' : 'lg'}
          className={cn(
            'group ',
            compact
              ? 'rounded-full'
              : 'flex w-full items-center justify-between gap-3 px-1.5 rounded-lg shadow-none hover:bg-muted/60',
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
              <ChevronsUpDown className="h-4 w-4 text-muted-foreground transition group-hover:opacity-80" />
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
                  variant='ghost'
                  className={cn(
                    'relative flex items-center gap-3 rounded-md w-full  text-start',
                    'transition hover:bg-muted focus-visible:outline-none ',
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
        
            className={cn(
              'relative flex items-center gap-3 rounded-md w-full  text-start',
              'transition hover:bg-muted focus-visible:outline-none justify-start',
           

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
  );
}
