'use client';

/**
 * Organization Settings
 *
 * Full settings page for an organization
 * - View and edit organization details
 * - Manage members and invitations
 * - Delete organization (owner only)
 */

import { useState } from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import { useOrganization, useDeleteOrganization } from '@/lib/queries/use-organization-data';
import { useCurrentUser } from '@/lib/queries/use-auth-data';
import { useOrganizationUIStore } from '@/lib/stores/ui-stores';
import { CreateOrganizationModal } from './create-organization-modal';
import { MembersList } from './members-list';
import type { Organization } from '@/lib/types/organization';

interface OrganizationSettingsProps {
  organizationId: string;
}

export function OrganizationSettings({ organizationId }: OrganizationSettingsProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Data hooks
  const { data: organization, isLoading: isLoadingOrg } = useOrganization(organizationId);
  const { data: currentUser } = useCurrentUser();
  const deleteMutation = useDeleteOrganization(organizationId);

  const isOwner = organization?.ownerId === currentUser?.id;
  const isPersonal = organization?.isPersonal;

  const handleDeleteOrg = async () => {
    if (!organization) return;

    if (
      !confirm(
        `Are you sure you want to delete "${organization.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteMutation.mutateAsync();
      // Redirect will be handled by the page
    } catch (error) {
      alert('Failed to delete organization');
    }
  };

  if (isLoadingOrg) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading organization...</div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-md text-destructive">
        Organization not found
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Organization Details */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Organization Settings</h2>
          {isOwner && !isPersonal && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Edit2 size={16} />
              Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Info Card */}
          <div className="p-6 border border-input rounded-lg">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-semibold flex-shrink-0">
                {organization.icon ? (
                  <span>{organization.icon}</span>
                ) : (
                  <span>{organization.name[0]?.toUpperCase()}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold">{organization.name}</h3>
                {organization.description && (
                  <p className="text-sm text-muted-foreground mt-1">{organization.description}</p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  ID: <code className="bg-muted px-1 rounded">{organization.id}</code>
                </p>

                <div className="mt-4 space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Created:</span>{' '}
                    {new Date(organization.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Status:</span>{' '}
                    {organization.isActive ? (
                      <span className="text-green-600">Active</span>
                    ) : (
                      <span className="text-amber-600">Inactive</span>
                    )}
                  </p>
                  {organization.isPersonal && (
                    <p>
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium dark:bg-blue-900 dark:text-blue-100">
                        Personal Workspace
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-6 border border-input rounded-lg">
            <h4 className="font-semibold mb-4">Organization Stats</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-lg font-semibold">
                  {organization.isActive ? '✓ Active' : '✗ Inactive'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Slug</p>
                <p className="text-sm font-mono">{organization.slug}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Members Section */}
      {!isPersonal && (
        <div>
          <MembersList organizationId={organizationId} isOwner={isOwner} />
        </div>
      )}

      {/* Danger Zone */}
      {isOwner && !isPersonal && (
        <div className="p-6 border border-destructive/30 rounded-lg bg-destructive/5">
          <h3 className="font-semibold text-destructive mb-4 flex items-center gap-2">
            <Trash2 size={18} />
            Danger Zone
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            Deleting an organization is permanent and cannot be undone. All associated data will be
            lost.
          </p>

          <button
            onClick={handleDeleteOrg}
            disabled={deleteMutation.isPending}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors disabled:opacity-50"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete Organization'}
          </button>
        </div>
      )}

      {/* Modals */}
      <CreateOrganizationModal
        organization={organization}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}
