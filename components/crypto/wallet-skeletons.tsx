import { Skeleton } from '@/components/ui/skeleton';
import { LucideIcon } from 'lucide-react';

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

// Complete wallet details page skeleton components
export function WalletDetailsSkeleton({ activeTab = 'tokens' }: { activeTab?: string }) {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'nfts':
        return <NFTsTabSkeleton />;
      case 'transactions':
        return <TransactionsTabSkeleton />;
      default:
        return <TokensTabSkeleton />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-16" />
      </div>

      {/* Wallet Header */}
      <div className="rounded-lg border bg-card">
        <div className="p-6 pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </div>
        <div className="px-6 pb-6">
          {/* Wallet Address */}
          <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-lg">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>

          {/* Wallet Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center p-3 bg-muted rounded-lg">
                <Skeleton className="h-6 w-20 mx-auto mb-2" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wallet Sync Progress Skeleton */}
      <WalletSyncProgressSkeleton />

      {/* Wallet Details Tabs */}
      <div className="rounded-lg border bg-card">
        <div className="p-6 pb-3">
          <div className="flex gap-4">
            {['Tokens', 'NFTs', 'Transactions'].map((tab, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        </div>
        <div className="px-6 pb-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

export function WalletSyncProgressSkeleton() {
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-6 pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
      </div>
      <div className="px-6 pb-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </div>
  );
}

export function TokensTabSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="px-5 py-3 border rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-5 w-12 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="text-right space-y-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NFTsTabSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border rounded-lg overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TransactionsTabSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-20" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-12 rounded-full" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                  <Skeleton className="h-4 w-14 rounded-full" />
                </div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="text-right space-y-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-6 w-6 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WalletEmptyState({
  icon: Icon,
  title,
  description
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center py-8">
      <Icon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
      <p className="text-muted-foreground">{title}</p>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  );
}

