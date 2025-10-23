"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SubscriptionCardSkeletonProps {
  className?: string;
}

export function SubscriptionCardSkeleton({
  className,
}: SubscriptionCardSkeletonProps) {
  return (
    <Card
      className={cn(
        "relative flex flex-col justify-between rounded-2xl border border-border bg-gradient-to-b from-muted/50 to-muted/30 p-4 opacity-60 pointer-events-none",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Skeleton className="h-10 w-10 rounded-full" />

          <div className="min-w-0 flex-1">
            <Skeleton className="h-4 w-28 mb-2" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>

        <div className="flex items-center justify-between border-t border-border/60 pt-2 mt-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>

        <div className="flex items-center justify-between border-t border-border/60 pt-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      {/* Deleting overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-[2px] rounded-2xl">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-full border-2 border-muted-foreground/30 border-t-primary animate-spin" />
          <p className="text-xs text-muted-foreground font-medium">Deleting...</p>
        </div>
      </div>
    </Card>
  );
}
