'use client';

import Link from 'next/link';
import { Users, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Organization } from '@/lib/types/organization';

interface OrgCardProps {
  org: Organization;
}

export function OrgCard({ org }: OrgCardProps) {
  return (
    <Link href={`/dashboard/organizations/${org.id}`} className="group">
      <Card className="relative h-full overflow-hidden border-border p-3">


        <div className="relative flex flex-col gap-3 ">
          {/* Header */}
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="relative h-9 w-9 flex-shrink-0 rounded-xl bg-gradient-to-br from-primary to-primary/60 p-[1px]">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-background text-sm font-bold">
                {org.icon || org.name[0]?.toUpperCase()}
              </div>
            </div>

            {/* Title */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-sm font-semibold leading-tight">
                  {org.name}
                </h3>

                {org.isActive && (
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                  </span>
                )}
              </div>

              <p className="truncate text-xs text-muted-foreground">
                {org.slug}
              </p>
            </div>
          </div>

          {/* Description */}
          {org.description && (
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {org.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span className="font-medium text-foreground">
                  {org.memberCount || 1}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {new Date(org.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Tags */}
            {org.isPersonal && (
              <Badge
                variant="secondary"
                className="h-5 px-2 text-[10px]"
              >
                Personal
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
