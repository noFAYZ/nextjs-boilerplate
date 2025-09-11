'use client';

import { use, Suspense } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { 
  ArrowLeft, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  Wallet,
  Coins,
  Image as ImageIcon,
  ArrowUpDown,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { toast } from 'sonner';

// Import custom hooks
import {
  useWalletFullData,
  useSyncWallet,
  useSyncStatus
} from '@/lib/hooks/use-crypto';

// Import new components
import { WalletTokens } from '@/components/crypto/wallet-tokens';
import { WalletNFTs } from '@/components/crypto/wallet-nfts';
import { WalletTransactions } from '@/components/crypto/wallet-transactions';
import { WalletChart } from '@/components/crypto/wallet-chart';
import { SolarWalletBoldDuotone, StreamlineFlexWallet } from '@/components/icons/icons';
import { useViewModeClasses } from '@/lib/contexts/view-mode-context';

interface WalletPageProps {
  params: Promise<{
    wallet: string;
  }>;
}

interface ErrorBoundaryProps {
  error: Error;
  reset: () => void;
}

function WalletErrorFallback({ error, reset }: ErrorBoundaryProps) {
  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6">
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">
            {error.message || 'An unexpected error occurred while loading the wallet details.'}
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={reset} variant="outline">
              Try Again
            </Button>
            <Link href="/dashboard/accounts/wallet">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Wallets
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingSpinner({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center h-32">
      <Loader2 className="h-6 w-6 animate-spin mr-2" />
      <span className="text-muted-foreground">{text}</span>
    </div>
  );
}

function WalletSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-8 w-16 bg-muted animate-pulse rounded" />
      </div>
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 bg-muted animate-pulse rounded-full" />
                <div className="space-y-2">
                  <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-16 bg-muted animate-pulse rounded-lg" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <div className="h-6 w-24 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-10 bg-muted animate-pulse rounded" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function WalletPageContent({ walletIdentifier }: { walletIdentifier: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('tokens');
  const { pageClass } = useViewModeClasses();
  
  // Use the optimized hook that fetches all data efficiently
  const { 
    wallet, 
    transactions, 
    nfts,
    isLoading, 
    error,
    refetch 
  } = useWalletFullData(walletIdentifier);

  const syncWallet = useSyncWallet();
  const { syncStatus } = useSyncStatus(walletIdentifier);
  const prevSyncStatusRef = useRef<string>();

  // Auto-refresh data when sync completes
  useEffect(() => {
    const currentStatus = syncStatus?.status;
    const prevStatus = prevSyncStatusRef.current;
    
    // If sync status changed from 'processing' to 'completed', refetch data
    if (prevStatus === 'processing' && currentStatus === 'completed') {
      console.log('Sync completed, refreshing wallet data...');
      setTimeout(() => {
        refetch();
        toast.success('Wallet data updated!');
      }, 1000); // Small delay to ensure backend has processed the sync
    }
    
    // Update the previous status
    prevSyncStatusRef.current = currentStatus;
  }, [syncStatus?.status, refetch]);

  // Memoize expensive calculations
  const walletStats = useMemo(() => {
    if (!wallet) return null;
    return {
      totalBalance: parseFloat(wallet?.portfolio?.totalPositionsValue || '0'),
      assetCount: wallet?.assets?.length || 0,
      nftCount: wallet.nfts?.length || 0,
      lastSyncFormatted: wallet.lastSyncAt ? 
        new Date(wallet.lastSyncAt).toLocaleDateString() : 
        'Never'
    };
  }, [wallet]);

  const handleCopyAddress = useCallback(async () => {
    if (!wallet?.walletData?.address) return;
    
    try {
      await navigator.clipboard.writeText(wallet.walletData.address);
      toast.success('Address copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy address');
    }
  }, [wallet?.walletData?.address]);

  const handleSync = useCallback(() => {
    if (!walletIdentifier || syncWallet.isPending) return;
    
    syncWallet.mutate(
      { walletId: walletIdentifier, syncData: { syncAssets: true, syncNFTs: true,syncTypes: ['assets', 'transactions','nfts'] }},
      {
        onSuccess: () => {
          toast.success('Wallet sync started');
          refetch();
        },
        onError: (error: Error) => {
          toast.error(error.message || 'Failed to start sync');
        }
      }
    );
  }, [walletIdentifier, syncWallet, refetch]);

  const getNetworkExplorerUrl = useCallback((network: string, address: string) => {
    const explorers: Record<string, string> = {
      ETHEREUM: `https://etherscan.io/address/${address}`,
      POLYGON: `https://polygonscan.com/address/${address}`,
      BSC: `https://bscscan.com/address/${address}`,
      ARBITRUM: `https://arbiscan.io/address/${address}`,
      OPTIMISM: `https://optimistic.etherscan.io/address/${address}`,
      AVALANCHE: `https://snowtrace.io/address/${address}`,
      SOLANA: `https://explorer.solana.com/address/${address}`,
    };
    return explorers[network] || '#';
  }, []);

  if (isLoading) {
    return <WalletSkeleton />;
  }

  if (error) {
    return <WalletErrorFallback error={error} reset={refetch} />;
  }

  if (!wallet) {
    return (
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Wallet Not Found</h2>
            <p className="text-muted-foreground mb-4">
              Could not find wallet with identifier: {walletIdentifier}
            </p>
            <Link href="/dashboard/accounts/wallet">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Wallets
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`${pageClass} p-4 lg:p-6 space-y-6`}>
      {/* Back Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
      
          <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSync}
                    disabled={syncWallet.isPending || syncStatus?.status === 'processing'}
                    className="min-w-[80px]"
                  >
                    {syncWallet.isPending || syncStatus?.status === 'processing' ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Sync
                  </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Wallet Header */}
        <Card className="p-3 sm:p-4 lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            {/* Left Side - Wallet Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center flex-shrink-0">
                <StreamlineFlexWallet className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-base sm:text-lg font-semibold truncate">{wallet?.walletData?.name}</h1>
                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary flex-shrink-0">
                    {wallet?.walletData?.network}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                  <span className="font-mono text-xs">
                    {wallet?.walletData?.address?.slice(0, 6)}...{wallet?.walletData?.address?.slice(-4)}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyAddress}
                      className="h-5 w-5 p-0"
                      title="Copy"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-5 w-5 p-0"
                      title="Explorer"
                    >
                      <a
                        href={getNetworkExplorerUrl(wallet?.walletData?.network, wallet?.walletData?.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Balance & Quick Stats */}
            <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-4">
              <div className="flex gap-3 sm:gap-4">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Tokens</div>
                  <div className="text-sm font-semibold">{walletStats?.assetCount || 0}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">NFTs</div>
                  <div className="text-sm font-semibold">{walletStats?.nftCount || 0}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Total Balance</div>
                <div className="text-base sm:text-lg font-bold">
                  ${walletStats?.totalBalance.toLocaleString() || '0'}
                </div>
              </div>
            </div>
          </div>

          {/* Fluid Chart */}
          <div className="mt-4 -mx-3 sm:-mx-4 -mb-3 sm:-mb-4">
            <WalletChart 
              walletAddress={wallet?.walletData?.address}
              className="w-full"
              height={100}
              compact={true}
            />
          </div>
        </Card>

        {/* Quick Analysis & Actions Card */}
        <Card className="p-3 sm:p-4 lg:col-span-1">
          <div className="space-y-3 sm:space-y-4">
      

            {/* Action Shortcuts */}
            <div className="space-y-1.5 sm:space-y-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start h-7 sm:h-8 text-xs"
                onClick={() => setActiveTab('tokens')}
              >
                <Coins className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-2" />
                View All Tokens
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start h-7 sm:h-8 text-xs"
                onClick={() => setActiveTab('nfts')}
              >
                <ImageIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-2" />
                Browse NFTs
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start h-7 sm:h-8 text-xs"
                onClick={() => setActiveTab('transactions')}
              >
                <ArrowUpDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-2" />
                Transaction History
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start h-7 sm:h-8 text-xs"
                onClick={handleSync}
                disabled={syncWallet.isPending}
              >
                {syncWallet.isPending ? (
                  <Loader2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-2" />
                )}
                Sync Wallet
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="pt-2 border-t space-y-1.5 sm:space-y-2">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Quick Stats
              </div>
              
              <div className="space-y-1 sm:space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Last Sync</span>
                  <span className="font-medium">{walletStats?.lastSyncFormatted || 'Never'}</span>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Network</span>
                  <span className="font-medium">{wallet?.walletData?.network}</span>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Status</span>
                  <Badge 
                    variant={wallet?.walletData?.syncStatus === 'SUCCESS' ? 'default' : 'destructive'}
                    className="text-[10px] py-0 px-1.5 h-4"
                  >
                    {wallet?.walletData?.syncStatus || 'Unknown'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* External Links */}
            <div className="pt-2 border-t">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                External
              </div>
              
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex-1 h-6 sm:h-7 text-xs"
                >
                  <a
                    href={getNetworkExplorerUrl(wallet?.walletData?.network, wallet?.walletData?.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Explorer
                  </a>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyAddress}
                  className="h-6 sm:h-7 px-2"
                  title="Copy Address"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Wallet Details Tabs */}
   
        <Tabs value={activeTab} onValueChange={setActiveTab}    >
     
            <TabsList className="  mb-4 "
            variant='card' 
            >
              <TabsTrigger value="tokens" className="flex items-center gap-2 cursor-pointer  " variant='card' >
               
                <span className="hidden sm:inline">Tokens</span>
                <span className="sm:hidden">({walletStats?.assetCount || 0})</span>
                <Badge variant="secondary" className="ml-1 hidden sm:inline-flex text-xs">
                  {walletStats?.assetCount || 0}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="nfts" className="flex items-center gap-2 cursor-pointer" variant='animated'>
               
                <span className="hidden sm:inline">NFTs</span>
                <span className="sm:hidden">({walletStats?.nftCount || 0})</span>
                <Badge variant="secondary" className="ml-1 hidden sm:inline-flex text-xs">
                  {walletStats?.nftCount || 0}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex items-center gap-2 cursor-pointer" variant='animated'>
               
                <span className="hidden sm:inline">Transactions</span>
                <span className="sm:hidden">({transactions?.length || 0})</span>
                <Badge variant="secondary" className="ml-1 hidden sm:inline-flex text-xs">
                  {transactions?.length || 0}
                </Badge>
              </TabsTrigger>
            </TabsList>
         

    
            <TabsContent value="tokens" className=" ">
              <WalletTokens 
                tokens={wallet?.assets || []} 
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="nfts" className=" ">
              <WalletNFTs 
                nfts={nfts || []} 
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="transactions" className=" ">
              <WalletTransactions 
                transactions={transactions || []} 
                isLoading={isLoading}
                walletAddress={wallet?.walletData?.address}
              />
            </TabsContent>

        </Tabs>
   
    </div>
  );
}

export default function WalletPage({ params }: WalletPageProps) {
  const resolvedParams = use(params);
  const walletIdentifier = resolvedParams?.wallet;

  return (
    <Suspense fallback={<WalletSkeleton />}>
      <WalletPageContent walletIdentifier={walletIdentifier} />
    </Suspense>
  );
}