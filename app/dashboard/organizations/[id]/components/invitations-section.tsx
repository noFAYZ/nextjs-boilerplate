'use client';

import { Card } from '@/components/ui/card';

interface Invitation {
  id: string;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
}

interface InvitationsSectionProps {
  invitations: Invitation[];
  pending: Invitation[];
  accepted: Invitation[];
  InvitationRowComponent: React.ComponentType<{ invitation: Invitation }>;
}

export function InvitationsSection({
  invitations,
  pending,
  accepted,
  InvitationRowComponent,
}: InvitationsSectionProps) {
  if (invitations.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 bg-card">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Invitations</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {pending.length} pending, {accepted.length} accepted
        </p>
      </div>

      <div className="space-y-3">
        {invitations.map((inv) => (
          <InvitationRowComponent key={inv.id} invitation={inv} />
        ))}
      </div>
    </Card>
  );
}
