'use client';

import { Card } from '@/components/ui/card';
import type { Organization } from '@/lib/types/organization';

interface QuickStatsProps {
  organization: Organization;
  memberCount: number;
  pendingCount: number;
  ownerCount: number;
}

export function QuickStats({ organization, memberCount, pendingCount, ownerCount }: QuickStatsProps) {
  return (
    <div className="grid gap-3 grid-cols-3">
      <Card className=" bg-card hover:shadow-sm transition-shadow">
        <div className="text-xs text-muted-foreground font-medium mb-1">Members</div>
        <div className="text-2xl font-bold">{memberCount}</div>
        <p className="text-xs text-muted-foreground mt-1">{ownerCount} owner{ownerCount !== 1 ? 's' : ''}</p>
      </Card>
      <Card className=" bg-card hover:shadow-sm transition-shadow">
        <div className="text-xs text-muted-foreground font-medium mb-1">Pending</div>
        <div className="text-2xl font-bold">{pendingCount}</div>
        <p className="text-xs text-muted-foreground mt-1">Awaiting response</p>
      </Card>
      <Card className=" bg-card hover:shadow-sm transition-shadow">
        <div className="text-xs text-muted-foreground font-medium mb-1">Created</div>
        <div className="text-sm font-bold">{new Date(organization.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
        <p className="text-xs text-muted-foreground mt-1">{new Date(organization.createdAt).getFullYear()}</p>
      </Card>
    </div>
  );
}
