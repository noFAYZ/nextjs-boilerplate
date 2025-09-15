import { Skeleton } from '@/components/ui/skeleton';

// Skeleton for individual data elements
export function BalanceSkeleton({ className }: { className?: string }) {
  return <Skeleton className={`h-8 w-40 ${className}`} />;
}

export function WalletNameSkeleton({ className }: { className?: string }) {
  return <Skeleton className={`h-5 w-32 ${className}`} />;
}

export function NetworkBadgeSkeleton({ className }: { className?: string }) {
  return <Skeleton className={`h-5 w-16 rounded-full ${className}`} />;
}

export function AddressSkeleton({ className }: { className?: string }) {
  return <Skeleton className={`h-4 w-24 ${className}`} />;
}

export function ChangeBadgeSkeleton({ className }: { className?: string }) {
  return <Skeleton className={`h-6 w-16 rounded-sm ${className}`} />;
}

export function StatsValueSkeleton({ className }: { className?: string }) {
  return <Skeleton className={`h-4 w-16 ${className}`} />;
}

export function TokenIconSkeleton({ className }: { className?: string }) {
  return <Skeleton className={`h-10 w-10 rounded-full ${className}`} />;
}

export function TokenNameSkeleton({ className }: { className?: string }) {
  return <Skeleton className={`h-4 w-16 ${className}`} />;
}

export function TokenSymbolSkeleton({ className }: { className?: string }) {
  return <Skeleton className={`h-3 w-12 ${className}`} />;
}

export function TokenBalanceSkeleton({ className }: { className?: string }) {
  return <Skeleton className={`h-5 w-20 ${className}`} />;
}

export function NFTImageSkeleton({ className }: { className?: string }) {
  return <Skeleton className={`aspect-square w-full ${className}`} />;
}

export function NFTNameSkeleton({ className }: { className?: string }) {
  return <Skeleton className={`h-4 w-full ${className}`} />;
}

export function NFTCollectionSkeleton({ className }: { className?: string }) {
  return <Skeleton className={`h-3 w-3/4 ${className}`} />;
}

export function TransactionHashSkeleton({ className }: { className?: string }) {
  return <Skeleton className={`h-4 w-24 ${className}`} />;
}

export function TransactionAmountSkeleton({ className }: { className?: string }) {
  return <Skeleton className={`h-4 w-20 ${className}`} />;
}

export function TimestampSkeleton({ className }: { className?: string }) {
  return <Skeleton className={`h-3 w-16 ${className}`} />;
}

// Chart skeleton remains the same since chart is a complete component
export function WalletChartSkeleton({ height = 100, compact = false }: { height?: number; compact?: boolean }) {
  return (
    <div className={`w-full relative ${compact ? "bg-transparent" : "bg-background rounded-lg p-4"}`}>
      <Skeleton className={`w-full rounded-lg`} style={{ height: `${height}px` }} />
      {!compact && (
        <div className="absolute top-4 left-4 space-y-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      )}
    </div>
  );
}

