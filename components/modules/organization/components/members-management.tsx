'use client';

/**
 * Enhanced Members Management Component
 *
 * Comprehensive member and invitation management with:
 * - Display current members with roles
 * - Invite new members with role selection
 * - Update member roles
 * - Remove members
 * - View and manage pending invitations
 * - Revoke invitations
 */

import React, { useState, useMemo } from 'react';
import {
  UserPlus,
  Trash2,
  Mail,
  CheckCircle2,
  AlertCircle,
  Copy,
  X,
} from 'lucide-react';
import {
  useOrganizationMembers,
  useInviteUser,
  useUpdateMemberRole,
  useRemoveMember,
  useRevokeInvitation,
} from '@/lib/features/organization/queries';
import { useCurrentUser } from '@/lib/features/auth/queries';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { OrganizationRole, Invitation } from '@/lib/types/organization';

interface MembersManagementProps {
  organizationId: string;
  isOwner: boolean;
  pendingInvitations?: Invitation[];
  onRefresh?: () => void;
}

// ============================================================================
// ROLE CONFIGURATION
// ============================================================================

const ROLE_CONFIG: Record<
  OrganizationRole,
  { label: string; description: string; color: string }
> = {
  OWNER: {
    label: 'Owner',
    description: 'Full access and member management',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-600/20 dark:text-orange-300',
  },
  EDITOR: {
    label: 'Editor',
    description: 'Can create and edit data',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-600/20 dark:text-blue-300',
  },
  VIEWER: {
    label: 'Viewer',
    description: 'Read-only access',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-600/20 dark:text-gray-300',
  },
};

// ============================================================================
// INVITE MEMBER DIALOG
// ============================================================================

interface InviteMemberDialogProps {
  organizationId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

function InviteMemberDialog({
  organizationId,
  isOpen,
  onClose,
  onSuccess,
}: InviteMemberDialogProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<OrganizationRole>('VIEWER');
  const [error, setError] = useState('');
  const [invitationCode, setInvitationCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { mutate: inviteUser, isPending } = useInviteUser(organizationId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    inviteUser(
      { email, role, invitationType: 'email' },
      {
        onSuccess: (response) => {
          if (response.success && response.data) {
            setInvitationCode(response.data.id);
            setEmail('');
          } else {
            setError(response.error?.message || 'Failed to send invitation');
          }
        },
        onError: (err) => {
          const errorMessage =
            (err as Record<string, unknown>)?.response?.data?.error ||
            (err as Record<string, unknown>)?.message ||
            'Failed to send invitation';
          setError(String(errorMessage));
        },
      }
    );
  };

  const handleCopyCode = () => {
    if (invitationCode) {
      navigator.clipboard.writeText(invitationCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  // Show success state with invitation code
  if (invitationCode) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <Card className="w-full max-w-md p-6 space-y-4">
          <div className="text-center space-y-2">
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto" />
            <h2 className="text-lg font-semibold">Invitation Sent!</h2>
            <p className="text-sm text-muted-foreground">
              Invitation code generated (expires in 7 days)
            </p>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <p className="text-xs text-muted-foreground">
              Share this code or send the link directly:
            </p>
            <div className="flex gap-2">
              <code className="flex-1 px-3 py-2 bg-background rounded text-sm font-mono break-all">
                {invitationCode}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyCode}
                className="flex-shrink-0"
              >
                {copied ? 'Copied!' : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setInvitationCode(null);
                setEmail('');
              }}
            >
              Send Another
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                setInvitationCode(null);
                onClose();
                onSuccess?.();
              }}
            >
              Done
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Show invite form
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Invite Team Member</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isPending}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@example.com"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={isPending}
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <div className="space-y-2">
              {(['VIEWER', 'EDITOR'] as const).map((r) => (
                <label
                  key={r}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                    role === r
                      ? 'border-primary bg-primary/5'
                      : 'border-input hover:border-primary/50'
                  )}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={role === r}
                    onChange={(e) => setRole(e.target.value as OrganizationRole)}
                    className="mt-1"
                    disabled={isPending}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {ROLE_CONFIG[r].label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {ROLE_CONFIG[r].description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-md">
              <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? 'Sending...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

// ============================================================================
// MEMBERS LIST
// ============================================================================

function MembersList({
  organizationId,
  isOwner,
}: Readonly<{
  organizationId: string;
  isOwner: boolean;
}>) {
  const { data: members = [], isLoading } = useOrganizationMembers(organizationId);
  const { data: currentUser } = useCurrentUser();
  const { mutate: updateRole } = useUpdateMemberRole(organizationId, '');
  const { mutate: removeMember } = useRemoveMember(organizationId, '');

  const ownerCount = useMemo(
    () => members.filter((m) => m.role === 'OWNER').length,
    [members]
  );

  const handleRemoveMember = (memberId: string, name: string) => {
    if (
      !confirm(`Are you sure you want to remove ${name} from this organization?`)
    ) {
      return;
    }

    removeMember();
  };

  const handleChangeRole = (memberId: string, newRole: OrganizationRole) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;

    // Prevent demoting last owner
    if (member.role === 'OWNER' && newRole !== 'OWNER' && ownerCount <= 1) {
      alert('Cannot demote the last owner. Assign another owner first.');
      return;
    }

    updateRole();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading members...</div>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <Card className="p-8 text-center">
        <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p className="font-medium">No members yet</p>
        <p className="text-sm text-muted-foreground">
          Invite your team to get started
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Member
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Role
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Joined
              </th>
              {isOwner && (
                <th className="px-6 py-3 text-right text-sm font-semibold">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {members.map((member) => {
              const isCurrentUser = member.userId === currentUser?.id;
              const roleConfig = ROLE_CONFIG[member.role];

              return (
                <tr
                  key={member.id}
                  className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-sm">
                        {member.name}
                        {isCurrentUser && (
                          <span className="text-xs text-muted-foreground ml-2">
                            (You)
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={cn('text-xs', roleConfig.color)}>
                      {roleConfig.label}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </td>
                  {isOwner && (
                    <td className="px-6 py-4 text-right">
                      {!isCurrentUser && (
                        <div className="flex items-center justify-end gap-2">
                          {/* Role Selector */}
                          <select
                            value={member.role}
                            onChange={(e) =>
                              handleChangeRole(
                                member.id,
                                e.target.value as OrganizationRole
                              )
                            }
                            className="text-sm px-2 py-1 border border-input rounded-md bg-background hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          >
                            <option value="VIEWER">Viewer</option>
                            <option value="EDITOR">Editor</option>
                            {ownerCount > 1 && <option value="OWNER">Owner</option>}
                          </select>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleRemoveMember(member.id, member.name)
                            }
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ============================================================================
// PENDING INVITATIONS
// ============================================================================

function PendingInvitationsList({
  organizationId,
  isOwner,
  invitations = [],
}: {
  organizationId: string;
  isOwner: boolean;
  invitations: Invitation[];
}) {
  const { mutate: revokeInvitation } = useRevokeInvitation(
    organizationId,
    ''
  );

  const pendingInvitations = invitations.filter((inv) => inv.status === 'PENDING');

  if (!isOwner || pendingInvitations.length === 0) return null;

  return (
    <Card>
      <div className="p-6 border-b border-border/50">
        <h3 className="font-semibold flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Pending Invitations ({pendingInvitations.length})
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Role
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Sent
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Expires
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {pendingInvitations.map((invitation) => {
              const expiresAt = new Date(invitation.expiresAt);
              const isExpired = expiresAt < new Date();

              return (
                <tr
                  key={invitation.id}
                  className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm">{invitation.email}</td>
                  <td className="px-6 py-4">
                    <Badge className={cn('text-xs', ROLE_CONFIG[invitation.role].color)}>
                      {ROLE_CONFIG[invitation.role].label}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(invitation.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {isExpired ? (
                      <span className="text-destructive font-medium">Expired</span>
                    ) : (
                      expiresAt.toLocaleDateString()
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => revokeInvitation()}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function MembersManagement({
  organizationId,
  isOwner,
  pendingInvitations = [],
  onRefresh,
}: MembersManagementProps) {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header with Invite Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Members</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage members, roles, and invitations
          </p>
        </div>
        {isOwner && (
          <Button onClick={() => setIsInviteDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        )}
      </div>

      {/* Members List */}
      <MembersList organizationId={organizationId} isOwner={isOwner} />

      {/* Pending Invitations */}
      {isOwner && pendingInvitations.length > 0 && (
        <PendingInvitationsList
          organizationId={organizationId}
          isOwner={isOwner}
          invitations={pendingInvitations}
        />
      )}

      {/* Invite Dialog */}
      <InviteMemberDialog
        organizationId={organizationId}
        isOpen={isInviteDialogOpen}
        onClose={() => setIsInviteDialogOpen(false)}
        onSuccess={() => {
          setIsInviteDialogOpen(false);
          onRefresh?.();
        }}
      />
    </div>
  );
}
