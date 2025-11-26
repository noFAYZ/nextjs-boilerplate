import { cn } from "@/lib/utils";
import { Card } from "./card";
import { Skeleton } from "./skeleton";

interface CardSkeletonProps {
  className?: string;
  lines?: number;
  variant?: "default" | "chart" | "grid" | "list";
  itemsCount?: number;
}

export function CardSkeleton({
  className,
  lines = 3,
  variant = "default",
  itemsCount = 3,
}: CardSkeletonProps) {
  if (variant === "chart") {
    return (
      <Card className={cn("p-6", className)}>
        <div className="space-y-4">
          {/* Title skeleton */}
          <Skeleton className="h-4 w-32" />

          {/* Chart placeholder - tall rectangle */}
          <Skeleton className="h-64 w-full rounded-lg" />

          {/* Legend/stats below chart */}
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-10 rounded-lg" />
            <Skeleton className="h-10 rounded-lg" />
          </div>
        </div>
      </Card>
    );
  }

  if (variant === "grid") {
    return (
      <Card className={cn("p-6", className)}>
        <div className="space-y-3">
          {/* Title */}
          <Skeleton className="h-4 w-32" />

          {/* Grid items */}
          <div className="grid grid-cols-2 gap-4">
            {[...Array(itemsCount)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (variant === "list") {
    return (
      <Card className={cn("p-6", className)}>
        <div className="space-y-4">
          {/* Title */}
          <Skeleton className="h-4 w-32" />

          {/* List items */}
          <div className="space-y-3">
            {[...Array(itemsCount)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={cn("p-6", className)}>
      <div className="space-y-4">
        {[...Array(lines)].map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              "h-4 rounded",
              i === 0 ? "w-32" : i === lines - 1 ? "w-24" : "w-full"
            )}
          />
        ))}
      </div>
    </Card>
  );
}
