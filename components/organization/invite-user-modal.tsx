'use client';

/**
 * Invite User Modal
 *
 * Modal for inviting users to organization
 * - Email input and role selection
 * - Shows invitation code for sharing
 * - Handles email token invitations
 */

import { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { useInviteUser } from '@/lib/queries/use-organization-data';
import { useOrganizationUIStore } from '@/lib/stores/ui-stores';
import type { OrganizationRole, Invitation } from '@/lib/types/organization';

interface InviteUserModalProps {
  organizationId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (invitation: Invitation) => void;
}

const ROLES: { value: OrganizationRole; label: string; description: string }[] = [
  {
    value: 'EDITOR',
    label: 'Editor',
    description: 'Can create and modify data',
  },
  {
    value: 'VIEWER',
    label: 'Viewer',
    description: 'Read-only access',
  },
];

export function InviteUserModal({
  organizationId,
  isOpen,
  onClose,
  onSuccess,
}: InviteUserModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<OrganizationRole>('EDITOR');
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [invitation, setInvitation] = useState<Invitation | null>(null);

  const inviteMutation = useInviteUser(organizationId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    try {
      const response = await inviteMutation.mutateAsync({
        email: email.trim(),
        role,
        invitationType: 'email',
      });

      if (response.success && response.data) {
        setInvitation(response.data);
        onSuccess?.(response.data);
        // Don't close immediately - show the invitation code
      }
    } catch (err) {
      setError(
        (err as any)?.error?.message || 'Failed to send invitation'
      );
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // Fallback to manual copy
    }
  };

  const handleClose = () => {
    setEmail('');
    setRole('EDITOR');
    setError('');
    setInvitation(null);
    setCopiedCode(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-background">
          <h2 className="text-lg font-semibold">Invite User</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-muted rounded-md transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {invitation ? (
            // Show invitation code
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Invitation sent to:</p>
                <p className="font-medium">{invitation.email}</p>
                <p className="text-sm text-muted-foreground">Role: {invitation.role}</p>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <p className="text-xs text-muted-foreground mb-2">
                  Share this code (expires in 7 days):
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 font-mono text-sm bg-background p-2 rounded border border-input">
                    {invitation.code}
                  </code>
                  <button
                    onClick={() => handleCopyCode(invitation.code)}
                    className="p-2 hover:bg-background rounded transition-colors"
                  >
                    {copiedCode ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                The user can accept the invitation via email link or by entering this code.
              </p>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Done
                </button>
                <button
                  onClick={() => {
                    setEmail('');
                    setInvitation(null);
                    setError('');
                  }}
                  className="flex-1 px-4 py-2 border border-input rounded-md hover:bg-muted transition-colors"
                >
                  Invite Another
                </button>
              </div>
            </div>
          ) : (
            // Show invitation form
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={inviteMutation.isPending}
                  autoFocus
                />
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium mb-2">
                  Role *
                </label>
                <div className="space-y-2">
                  {ROLES.map(({ value, label, description }) => (
                    <label
                      key={value}
                      className="flex items-center gap-3 p-2 border border-input rounded-md hover:bg-muted cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name="role"
                        value={value}
                        checked={role === value}
                        onChange={() => setRole(value)}
                        disabled={inviteMutation.isPending}
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-xs text-muted-foreground">{description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={inviteMutation.isPending}
                  className="flex-1 px-4 py-2 border border-input rounded-md hover:bg-muted transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviteMutation.isPending}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {inviteMutation.isPending ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
