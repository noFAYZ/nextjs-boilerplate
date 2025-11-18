'use client';

/**
 * Organization Settings Page
 *
 * Manage organization details, members, and settings
 */

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { OrganizationSettings } from '@/components/organization';
import { useOrganization } from '@/lib/queries/use-organization-data';

interface PageProps {
  params: { id: string };
}

function SettingsContent({ organizationId }: { organizationId: string }) {
  const { data: organization, isLoading } = useOrganization(organizationId);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{organization.name}</h1>
        <p className="text-muted-foreground mt-1">Manage your organization and team members</p>
      </div>

      <OrganizationSettings organizationId={organizationId} />
    </div>
  );
}

export default function OrganizationSettingsPage({ params }: PageProps) {
  return (
    <div className="container py-6">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        }
      >
        <SettingsContent organizationId={params.id} />
      </Suspense>
    </div>
  );
}
