'use client';

/**
 * Invitations Page
 *
 * View and manage all pending invitations:
 * - Accept invitations
 * - View organization details
 * - Expiration status
 */

import { Suspense } from 'react';
import { Mail, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { InvitationsPanel } from '@/components/organization/invitations-panel';
import { WidgetSkeleton } from '@/components/ui/widget-skeleton';
import { Card } from '@/components/ui/card';
import { usePendingInvitations } from '@/lib/queries/use-organization-data';

// ============================================================================
// CONTENT COMPONENT
// ============================================================================

function InvitationsContent() {
  const { data: invitationsData, isLoading } = usePendingInvitations();

  const invitations = Array.isArray(invitationsData)
    ? invitationsData
    : invitationsData?.data ?? [];

  const pendingCount = invitations.filter((inv) => inv.status === 'PENDING').length;
  const acceptedCount = invitations.filter((inv) => inv.status === 'ACCEPTED').length;
  const expiredCount = invitations.filter((inv) => inv.status === 'EXPIRED').length;

  if (isLoading) {
    return <WidgetSkeleton variant="list" itemsCount={3} />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">Invitations</h1>
        <p className="text-muted-foreground mt-2">
          Manage your organization invitations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-3xl font-bold mt-2">{pendingCount}</p>
            </div>
            <Clock className="h-8 w-8 text-amber-500/50 flex-shrink-0" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Accepted</p>
              <p className="text-3xl font-bold mt-2">{acceptedCount}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500/50 flex-shrink-0" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Expired</p>
              <p className="text-3xl font-bold mt-2">{expiredCount}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500/50 flex-shrink-0" />
          </div>
        </Card>
      </div>

      {/* Invitations Panel */}
      <Card className="p-6">
        <InvitationsPanel />
      </Card>

      {/* Help Section */}
      {pendingCount === 0 && acceptedCount === 0 && expiredCount === 0 && (
        <Card className="p-8 text-center">
          <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-lg font-medium">No invitations</p>
          <p className="text-muted-foreground mt-1">
            Invitations will appear here when organization owners invite you to join their team
          </p>
        </Card>
      )}
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function InvitationsPage() {
  return (
    <div className="container py-6">
      <Suspense fallback={<WidgetSkeleton variant="list" itemsCount={3} />}>
        <InvitationsContent />
      </Suspense>
    </div>
  );
}
