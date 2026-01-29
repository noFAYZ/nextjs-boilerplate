'use client';

import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface InviteMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string, role: string) => void;
}

export function InviteMemberDialog({ isOpen, onClose, onInvite }: InviteMemberDialogProps) {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('MEMBER');

  const handleSendInvite = useCallback(() => {
    if (!inviteEmail.trim()) {
      alert('Please enter an email address');
      return;
    }
    onInvite(inviteEmail, inviteRole);
    setInviteEmail('');
    setInviteRole('MEMBER');
    onClose();
  }, [inviteEmail, inviteRole, onInvite, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Invite Member</h2>
          <p className="text-xs text-muted-foreground mt-1">Send an invitation to join this organization</p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium">Email Address *</label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="member@example.com"
              className="w-full px-3 py-2 text-sm rounded-md bg-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/50 mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-medium">Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-md bg-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/50 mt-1"
            >
              <option value="MEMBER">Member</option>
              <option value="EDITOR">Editor</option>
              <option value="VIEWER">Viewer</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            className="flex-1"
            onClick={handleSendInvite}
          >
            Send Invite
          </Button>
        </div>
      </Card>
    </div>
  );
}
