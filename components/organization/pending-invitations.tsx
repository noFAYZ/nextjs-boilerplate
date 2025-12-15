'use client';

/**
 * Pending Invitations Component
 *
 * Displays pending invitations for the current user
 * - Shows organization and role
 * - Actions to accept or decline
 * - Displays expiration date
 */

import { usePendingInvitations, useAcceptInvitationByToken } from '@/lib/queries/use-organization-data';
import { Clock, CheckCircle, Trash2 } from 'lucide-react';

interface PendingInvitationsProps {
  onAccept?: () => void;
}

export function PendingInvitations({ onAccept }: PendingInvitationsProps) {
  const { data: response, isLoading } = usePendingInvitations();
  const acceptMutation = useAcceptInvitationByToken();

  const invitations = response?.data || [];

  const handleAccept = async (token: string) => {
    try {
      const response = await acceptMutation.mutateAsync({ token });
      if (response.success) {
        onAccept?.();
      }
    } catch (error) {
      alert('Failed to accept invitation');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading invitations...</div>
      </div>
    );
  }

  if (invitations.length === 0) {
    return null;
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'EDITOR':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'VIEWER':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getExpirationStatus = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const daysLeft = Math.floor((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return { text: 'Expired', color: 'text-destructive' };
    if (daysLeft === 0) return { text: 'Expires today', color: 'text-amber-600' };
    if (daysLeft === 1) return { text: 'Expires tomorrow', color: 'text-amber-600' };
    return { text: `Expires in ${daysLeft} days`, color: 'text-muted-foreground' };
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold flex items-center gap-2">
        <Clock size={18} />
        Pending Invitations ({invitations.length})
      </h3>

      <div className="space-y-3">
        {invitations.map((invitation) => {
          const expiration = getExpirationStatus(invitation.expiresAt);
          const isExpired = expiration.text.includes('Expired');

          return (
            <div
              key={invitation.id}
              className="p-4 border border-input rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">
                      {invitation.organization?.name || 'Organization'}
                    </h4>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getRoleBadgeColor(invitation.role)}`}>
                      {invitation.role}
                    </span>
                  </div>
                  <p className={`text-sm ${expiration.color}`}>
                    {expiration.text}
                  </p>
                </div>

                {!isExpired && (
                  <button
                    onClick={() => handleAccept(invitation.emailToken || '')}
                    disabled={acceptMutation.isPending}
                    className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm disabled:opacity-50 flex-shrink-0"
                  >
                    <CheckCircle size={16} />
                    Accept
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Invitation Badge
 *
 * Small badge showing number of pending invitations
 */
interface InvitationBadgeProps {
  className?: string;
}

export function InvitationBadge({ className = '' }: InvitationBadgeProps) {
  const { data: response } = usePendingInvitations();

  const count = response?.total || 0;

  if (count === 0) return null;

  return (
    <div className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-destructive text-white text-xs font-bold ${className}`}>
      {count > 9 ? '9+' : count}
    </div>
  );
}
