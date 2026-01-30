'use client';

/**
 * Invitations Panel
 *
 * Display and manage pending invitations for the current user:
 * - Accept invitations via email token or code
 * - View expiration status
 * - Show role and organization details
 */

import React, { useState } from 'react';
import {
  Mail,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader,
} from 'lucide-react';
import {
  usePendingInvitations,
  useAcceptInvitationByToken,
  useAcceptInvitationByCode,
} from '@/lib/features/organization/queries';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WidgetSkeleton } from '@/components/ui/widget-skeleton';
import { cn } from '@/lib/utils';
import type { Invitation, OrganizationRole } from '@/lib/types/organization';

// ============================================================================
// ROLE BADGE
// ============================================================================

const ROLE_COLORS: Record<OrganizationRole, string> = {
  OWNER: 'bg-orange-100 text-orange-800 dark:bg-orange-600/20 dark:text-orange-300',
  EDITOR:
    'bg-blue-100 text-blue-800 dark:bg-blue-600/20 dark:text-blue-300',
  VIEWER: 'bg-gray-100 text-gray-800 dark:bg-gray-600/20 dark:text-gray-300',
};

// ============================================================================
// INVITATION CARD
// ============================================================================

interface InvitationCardProps {
  invitation: Invitation;
  onAccept: () => void;
  isAccepting?: boolean;
}

function InvitationCard({
  invitation,
  onAccept,
  isAccepting,
}: InvitationCardProps) {
  const expiresAt = new Date(invitation.expiresAt);
  const now = new Date();
  const isExpired = expiresAt < now;
  const daysUntilExpiry = Math.ceil(
    (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  const getExpiryLabel = () => {
    if (isExpired) return 'Expired';
    if (daysUntilExpiry === 0) return 'Expires today';
    if (daysUntilExpiry === 1) return 'Expires tomorrow';
    return `Expires in ${daysUntilExpiry} days`;
  };

  const getExpiryColor = () => {
    if (isExpired) return 'text-red-600 dark:text-red-400';
    if (daysUntilExpiry <= 1) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  return (
    <Card className={cn(
      'p-6 transition-opacity',
      isExpired && 'opacity-60'
    )}>
      <div className="flex items-start justify-between gap-4">
        {/* Organization Info */}
        <div className="flex-1 min-w-0">
          {invitation.organization && (
            <div className="mb-3">
              <h3 className="font-semibold truncate">
                {invitation.organization.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {invitation.organization.slug}
              </p>
            </div>
          )}

          {/* Invitation Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className={cn('text-xs', ROLE_COLORS[invitation.role])}>
                {invitation.role}
              </Badge>
              <span className="text-xs text-muted-foreground">Role</span>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-muted-foreground truncate">
                Sent to {invitation.email}
              </span>
            </div>

            {/* Expiry Status */}
            <div
              className={cn(
                'flex items-center gap-2 text-xs font-medium',
                getExpiryColor()
              )}
            >
              {isExpired ? (
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
              ) : (
                <Clock className="h-4 w-4 flex-shrink-0" />
              )}
              {getExpiryLabel()}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          {!isExpired ? (
            <Button
              size="sm"
              onClick={onAccept}
              disabled={isAccepting}
              className="gap-2"
            >
              {isAccepting ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Accepting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Accept
                </>
              )}
            </Button>
          ) : (
            <Button size="sm" variant="outline" disabled>
              Expired
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface InvitationsPanelProps {
  className?: string;
  autoAcceptToken?: string;
  autoAcceptCode?: string;
}

export function InvitationsPanel({
  className,
  autoAcceptToken,
  autoAcceptCode,
}: InvitationsPanelProps) {
  const { data: invitationsData, isLoading, refetch } =
    usePendingInvitations();
  const { mutate: acceptByToken, isPending: isAcceptingByToken } =
    useAcceptInvitationByToken();
  const { mutate: acceptByCode, isPending: isAcceptingByCode } =
    useAcceptInvitationByCode();

  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  // Extract invitations list from response
  const invitations: Invitation[] =
    Array.isArray(invitationsData) ? invitationsData : invitationsData?.data ?? [];
  const pendingInvitations = invitations.filter(
    (inv) => inv.status === 'PENDING'
  );

  // Auto-accept if token or code provided
  React.useEffect(() => {
    if (autoAcceptToken) {
      acceptByToken(
        { token: autoAcceptToken },
        {
          onSuccess: () => {
            refetch();
          },
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoAcceptToken]);

  React.useEffect(() => {
    if (autoAcceptCode) {
      acceptByCode(
        { code: autoAcceptCode },
        {
          onSuccess: () => {
            refetch();
          },
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoAcceptCode]);

  const handleAccept = (invitation: Invitation) => {
    setAcceptingId(invitation.id);

    const onSuccess = () => {
      setAcceptingId(null);
      refetch();
    };

    const onError = () => {
      setAcceptingId(null);
    };

    if (invitation.emailToken) {
      acceptByToken({ token: invitation.emailToken }, { onSuccess, onError });
    } else if (invitation.code) {
      acceptByCode({ code: invitation.code }, { onSuccess, onError });
    }
  };

  if (isLoading) {
    return <WidgetSkeleton variant="list" itemsCount={2} />;
  }

  if (pendingInvitations.length === 0) {
    return (
      <Card className={cn('p-8 text-center', className)}>
        <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p className="font-medium">No pending invitations</p>
        <p className="text-sm text-muted-foreground">
          You&apos;re all caught up! Invitations will appear here when they arrive.
        </p>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h2 className="text-lg font-semibold">Pending Invitations</h2>
        <p className="text-sm text-muted-foreground">
          {pendingInvitations.length}{' '}
          {pendingInvitations.length === 1
            ? 'invitation'
            : 'invitations'}{' '}
          waiting for your response
        </p>
      </div>

      <div className="space-y-3">
        {pendingInvitations.map((invitation) => (
          <InvitationCard
            key={invitation.id}
            invitation={invitation}
            onAccept={() => handleAccept(invitation)}
            isAccepting={
              acceptingId === invitation.id &&
              (isAcceptingByToken || isAcceptingByCode)
            }
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// BADGE COMPONENT - For displaying invitation count
// ============================================================================

export function InvitationBadge() {
  const { data: invitationsData } = usePendingInvitations();

  const invitations: Invitation[] =
    Array.isArray(invitationsData) ? invitationsData : invitationsData?.data ?? [];
  const pendingCount = invitations.filter(
    (inv) => inv.status === 'PENDING'
  ).length;

  if (pendingCount === 0) return null;

  return (
    <div className="absolute -top-2 -right-2 flex items-center justify-center h-6 w-6 rounded-full bg-red-500 text-white text-xs font-bold">
      {pendingCount > 9 ? '9+' : pendingCount}
    </div>
  );
}
