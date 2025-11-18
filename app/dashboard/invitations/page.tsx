'use client';

/**
 * Pending Invitations Page
 *
 * Display and manage pending invitations for the user
 */

import { Suspense } from 'react';
import { ArrowRight } from 'lucide-react';
import { PendingInvitations } from '@/components/organization';
import { useOrganizations } from '@/lib/queries/use-organization-data';
import { useRouter } from 'next/navigation';

function InvitationsContent() {
  const router = useRouter();
  const { refetch: refetchOrganizations } = useOrganizations();

  const handleInvitationAccepted = () => {
    refetchOrganizations();
    router.push('/dashboard');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Pending Invitations</h1>
        <p className="text-muted-foreground mt-2">
          You have pending invitations to join organizations. Accept them to get started!
        </p>
      </div>

      <div className="grid gap-8">
        <PendingInvitations onAccept={handleInvitationAccepted} />
      </div>

      <div className="pt-4 border-t border-border">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-primary hover:underline"
        >
          Back to Dashboard
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default function InvitationsPage() {
  return (
    <div className="container py-6">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading invitations...</div>
          </div>
        }
      >
        <InvitationsContent />
      </Suspense>
    </div>
  );
}
