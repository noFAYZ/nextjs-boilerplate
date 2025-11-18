'use client';

/**
 * Organization Members List
 *
 * Displays all members in an organization
 * - Shows member roles and join dates
 * - Allows changing roles and removing members
 * - Shows pending invitations
 * - Owner-only actions (invite, remove, change role)
 */

import { useState } from 'react';
import { Trash2, MoreVertical, UserPlus, AlertCircle } from 'lucide-react';
import { useOrganizationMembers, useUpdateMemberRole, useRemoveMember } from '@/lib/queries/use-organization-data';
import { useCurrentUser } from '@/lib/queries/use-auth-data';
import type { OrganizationMember, OrganizationRole } from '@/lib/types/organization';
import { InviteUserModal } from './invite-user-modal';

interface MembersListProps {
  organizationId: string;
  isOwner: boolean;
}

const ROLES: OrganizationRole[] = ['OWNER', 'EDITOR', 'VIEWER'];

export function MembersList({ organizationId, isOwner }: MembersListProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // Data hooks
  const { data: members = [], isLoading } = useOrganizationMembers(organizationId);
  const { data: currentUser } = useCurrentUser();

  // Mutation hooks
  const updateRoleMutation = useUpdateMemberRole(organizationId, selectedMemberId || '');
  const removeMutation = useRemoveMember(organizationId, selectedMemberId || '');

  const currentUserId = currentUser?.id;
  const isCurrentUserOwner = isOwner;
  const ownerCount = members.filter((m) => m.role === 'OWNER').length;

  const handleRoleChange = async (member: OrganizationMember, newRole: OrganizationRole) => {
    // Prevent demoting last owner
    if (member.role === 'OWNER' && newRole !== 'OWNER' && ownerCount === 1) {
      alert('Cannot demote the last owner');
      return;
    }

    setSelectedMemberId(member.userId);
    try {
      await updateRoleMutation.mutateAsync({ role: newRole });
      setMenuOpenId(null);
    } catch (error) {
      alert('Failed to update member role');
    }
  };

  const handleRemoveMember = async (member: OrganizationMember) => {
    // Prevent removing last owner
    if (member.role === 'OWNER' && ownerCount === 1) {
      alert('Cannot remove the last owner');
      return;
    }

    if (!confirm(`Remove ${member.name} from this organization?`)) {
      return;
    }

    setSelectedMemberId(member.userId);
    try {
      await removeMutation.mutateAsync();
      setMenuOpenId(null);
    } catch (error) {
      alert('Failed to remove member');
    }
  };

  const getRoleColor = (role: OrganizationRole) => {
    switch (role) {
      case 'OWNER':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'EDITOR':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'VIEWER':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading members...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with invite button */}
      {isOwner && (
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Team Members ({members.length})</h3>
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm"
          >
            <UserPlus size={16} />
            Invite Member
          </button>
        </div>
      )}

      {/* Members Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Member</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Joined</th>
              {isOwner && <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan={isOwner ? 5 : 4} className="px-4 py-8 text-center text-muted-foreground">
                  No members yet
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-xs font-semibold">
                        {member.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        {member.userId === currentUserId && (
                          <p className="text-xs text-muted-foreground">(You)</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{member.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </td>
                  {isOwner && (
                    <td className="px-4 py-3 relative">
                      {member.userId === currentUserId ? (
                        <span className="text-xs text-muted-foreground">Owner</span>
                      ) : (
                        <div className="relative">
                          <button
                            onClick={() => setMenuOpenId(menuOpenId === member.id ? null : member.id)}
                            className="p-1 hover:bg-muted rounded transition-colors"
                          >
                            <MoreVertical size={16} />
                          </button>

                          {menuOpenId === member.id && (
                            <div className="absolute right-0 top-full mt-1 bg-background border border-input rounded-lg shadow-lg z-10 min-w-[180px]">
                              {/* Role Change */}
                              <div className="p-2 border-b border-input">
                                <p className="text-xs font-medium text-muted-foreground px-2 py-1">Change Role</p>
                                {ROLES.filter((r) => r !== member.role).map((role) => (
                                  <button
                                    key={role}
                                    onClick={() => handleRoleChange(member, role)}
                                    disabled={updateRoleMutation.isPending}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded transition-colors disabled:opacity-50"
                                  >
                                    {role}
                                  </button>
                                ))}
                              </div>

                              {/* Remove */}
                              <button
                                onClick={() => handleRemoveMember(member)}
                                disabled={removeMutation.isPending || (member.role === 'OWNER' && ownerCount === 1)}
                                className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded transition-colors disabled:opacity-50 flex items-center gap-2"
                              >
                                <Trash2 size={14} />
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Warning message */}
      {isOwner && ownerCount === 1 && (
        <div className="flex items-gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md dark:bg-amber-900/20 dark:border-amber-800">
          <AlertCircle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800 dark:text-amber-200 ml-2">
            You are the only owner. Consider promoting another member to owner for security.
          </p>
        </div>
      )}

      {/* Invite Modal */}
      <InviteUserModal
        organizationId={organizationId}
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />

      {/* Backdrop for menu */}
      {menuOpenId && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setMenuOpenId(null)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
