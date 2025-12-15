'use client';

/**
 * Organization Members Page
 *
 * View and manage organization members and invitations
 */

import { Suspense, use } from 'react';
import { MembersList } from '@/components/organization';
import { useOrganization } from '@/lib/queries/use-organization-data';
import { useCurrentUser } from '@/lib/queries/use-auth-data';

interface PageProps {
  params: Promise<{ id: string }>;
}

function MembersContent({ organizationId }: { organizationId: string }) {
  const { data: organization, isLoading: isLoadingOrg } = useOrganization(organizationId);
  const { data: currentUser } = useCurrentUser();

  const isOwner = organization?.ownerId === currentUser?.id;

  if (isLoadingOrg) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading...</div>
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team Members</h1>
        <p className="text-muted-foreground mt-1">
          Manage team members, roles, and invitations for {organization.name}
        </p>
      </div>

      <MembersList organizationId={organizationId} isOwner={isOwner} />
    </div>
  );
}

export default function MembersPage({ params }: PageProps) {
  const { id } = use(params);

  return (
    <div className="container py-6">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        }
      >
        <MembersContent organizationId={id} />
      </Suspense>
    </div>
  );
}
