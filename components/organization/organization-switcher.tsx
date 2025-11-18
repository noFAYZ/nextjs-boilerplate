'use client';

/**
 * Organization Switcher
 *
 * Dropdown component for switching between organizations
 * - Displays current organization
 * - Lists all available organizations
 * - Quick actions to create new org or manage members
 * - Shows personal workspace indicator
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Plus, Settings, Check } from 'lucide-react';
import { useOrganizations, usePersonalOrganization } from '@/lib/queries/use-organization-data';
import { useOrganizationUIStore } from '@/lib/stores/ui-stores';
import type { Organization } from '@/lib/types/organization';

interface OrganizationSwitcherProps {
  className?: string;
  onOrgSelect?: (org: Organization) => void;
}

export function OrganizationSwitcher({ className = '', onOrgSelect }: OrganizationSwitcherProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Data hooks
  const { data: organizations = [], isLoading: orgsLoading, error: orgsError } = useOrganizations();
  const { data: personalOrg, isLoading: personalOrgLoading } = usePersonalOrganization();

  // UI store
  const { selectedOrganizationId, selectOrganization, openCreateOrgModal } =
    useOrganizationUIStore();

  const isLoading = orgsLoading || personalOrgLoading;
  const hasError = orgsError !== null && orgsError !== undefined;

  // Find current organization (prefer selected, fallback to personal)
  let currentOrg = organizations.find((org) => org.id === selectedOrganizationId);
  if (!currentOrg) {
    currentOrg = personalOrg;
  }

  const handleOrgSelect = (org: Organization) => {
    selectOrganization(org.id);
    setIsOpen(false);
    onOrgSelect?.(org);
    router.push(`/dashboard?org=${org.id}`);
  };

  const handleCreateOrg = () => {
    openCreateOrgModal();
    setIsOpen(false);
  };

  const handleManageMembers = (org: Organization) => {
    router.push(`/dashboard/organization/${org.id}/members`);
    setIsOpen(false);
  };

  // Show loading state
  if (isLoading && !currentOrg) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-md bg-muted ${className}`}>
        <div className="h-2 w-2 rounded-full animate-pulse bg-muted-foreground/50" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  // Show error state
  if (hasError && !currentOrg) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-md bg-destructive/10 border border-destructive/20 ${className}`}>
        <div className="h-2 w-2 rounded-full bg-destructive" />
        <span className="text-sm text-destructive">Error loading</span>
      </div>
    );
  }

  // Fallback if no organization found (shouldn't happen, but safe default)
  if (!currentOrg) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-md bg-muted ${className}`}>
        <div className="flex items-center justify-center w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold flex-shrink-0">
          M
        </div>
        <span className="text-sm text-muted-foreground">Select Org</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors w-full text-left"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex items-center justify-center w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold flex-shrink-0">
            {currentOrg.icon ? (
              <span>{currentOrg.icon}</span>
            ) : (
              <span>{currentOrg.name[0]?.toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{currentOrg.name}</p>
            {currentOrg.isPersonal && (
              <p className="text-xs text-muted-foreground">Personal Workspace</p>
            )}
          </div>
        </div>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-input rounded-lg shadow-lg z-50 min-w-[280px]">
          {/* Organizations List */}
          <div className="max-h-[300px] overflow-y-auto p-2">
            {organizations.map((org) => (
              <button
                key={org.id}
                onClick={() => handleOrgSelect(org)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-left mb-1"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold flex-shrink-0">
                  {org.icon ? (
                    <span>{org.icon}</span>
                  ) : (
                    <span>{org.name[0]?.toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{org.name}</p>
                  {org.isPersonal && (
                    <p className="text-xs text-muted-foreground">Personal Workspace</p>
                  )}
                </div>
                {org.id === selectedOrganizationId && (
                  <Check size={16} className="flex-shrink-0 text-green-600" />
                )}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-border my-2" />

          {/* Actions */}
          <div className="p-2 space-y-1">
            <button
              onClick={handleCreateOrg}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left"
            >
              <Plus size={16} className="flex-shrink-0" />
              <span>Create Organization</span>
            </button>

            {!currentOrg.isPersonal && (
              <button
                onClick={() => handleManageMembers(currentOrg)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left"
              >
                <Settings size={16} className="flex-shrink-0" />
                <span>Manage Members</span>
              </button>
            )}
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
