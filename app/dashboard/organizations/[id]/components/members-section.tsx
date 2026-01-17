'use client';

import { Users, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MemberRow {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface MembersSectionProps {
  members: MemberRow[];
  isOwner: boolean;
  onRemove: (id: string) => void;
  onInvite: () => void;
  MemberRowComponent: React.ComponentType<{ member: MemberRow; isOwner: boolean; onRemove: (id: string) => void }>;
}

export function MembersSection({ members, isOwner, onRemove, onInvite, MemberRowComponent }: MembersSectionProps) {
  return (
    <Card className=" bg-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-semibold">Members</h2>
        
        </div>
        <Button
          size="xs"
    
          className="gap-1"
          onClick={onInvite}
          disabled={!isOwner}
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      {members.length > 0 ? (
        <div className="divide-y divide-border/50">
          {members.map((member) => (
            <MemberRowComponent key={member.id} member={member} isOwner={isOwner} onRemove={onRemove} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground">No members yet</p>
          <p className="text-xs text-muted-foreground mt-1">Invite team members to collaborate</p>
        </div>
      )}
    </Card>
  );
}
