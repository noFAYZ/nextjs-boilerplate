'use client';

import { use, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { 
  ArrowLeft, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  TrendingUp, 
  Wallet,
  Coins,
  Image as ImageIcon,
  ArrowUpDown,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

// Import custom hooks
import {
  useWalletFullData,
  useSyncWallet,
  useSyncStatus
} from '@/lib/hooks/use-crypto';
import type { CryptoWallet, CryptoTransaction, CryptoNFT } from '@/lib/types/crypto';

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
    <div className="max-w-3xl mx-auto p-6">
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
            <Link href="/dashboard/crypto/wallets">
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

function WalletPageContent({ walletIdentifier }: { walletIdentifier: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('tokens');
  
  // Use the optimized hook that fetches all data efficiently
  const { 
    
    wallet, 
    transactions, 
    nfts, 
    defiPositions,
    isLoading, 
    error,
    refetch 
  } = useWalletFullData(walletIdentifier);

  
  
  const syncWallet = useSyncWallet();
  const { syncStatus } = useSyncStatus(walletIdentifier);
console.log('Wallet:', wallet);
  // Memoize expensive calculations
  const walletStats = useMemo(() => {
    if (!wallet) return null;
    return {
      totalBalance: parseFloat(wallet.totalValueUsd || '0'),
      assetCount: wallet.totalAssets || 0,
      nftCount: wallet.totalNfts || 0,
      lastSyncFormatted: wallet.lastSyncAt ? 
        new Date(wallet.lastSyncAt).toLocaleDateString() : 
        'Never'
    };
  }, [wallet]);

  const handleCopyAddress = useCallback(async () => {
    if (!wallet?.address) return;
    
    try {
      await navigator.clipboard.writeText(wallet.address);
      toast.success('Address copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy address');
    }
  }, [wallet?.address]);

  const handleSync = useCallback(() => {
    if (!walletIdentifier || syncWallet.isPending) return;
    
    syncWallet.mutate(
      { walletId: walletIdentifier },
      {
        onSuccess: () => {
          toast.success('Wallet sync started');
          refetch();
        },
        onError: (error: any) => {
          toast.error(error.message || 'Failed to start sync');
        }
      }
    );
  }, [walletIdentifier, syncWallet, refetch]);

  const formatAddress = useCallback((address: string) => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

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
  
  const getTransactionExplorerUrl = useCallback((network: string, hash: string) => {
    const explorers: Record<string, string> = {
      ETHEREUM: `https://etherscan.io/tx/${hash}`,
      POLYGON: `https://polygonscan.com/tx/${hash}`,
      BSC: `https://bscscan.com/tx/${hash}`,
      ARBITRUM: `https://arbiscan.io/tx/${hash}`,
      OPTIMISM: `https://optimistic.etherscan.io/tx/${hash}`,
      AVALANCHE: `https://snowtrace.io/tx/${hash}`,
      SOLANA: `https://explorer.solana.com/tx/${hash}`,
    };
    return explorers[network] || '#';
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-16 bg-muted animate-pulse rounded" />
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-muted animate-pulse rounded-full" />
              <div className="space-y-2">
                <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <LoadingSpinner text="Loading wallet details..." />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return <WalletErrorFallback error={error} reset={refetch} />;
  }

  if (!wallet) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Wallet Not Found</h2>
            <p className="text-muted-foreground mb-4">
              Could not find wallet with identifier: {walletIdentifier}
            </p>
            <Link href="/dashboard/crypto/wallets">
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
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Wallet Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{wallet.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{wallet.network}</Badge>
                  <Badge variant="secondary">{wallet?.type?.replace('_', ' ')}</Badge>
                  {wallet.syncStatus && (
                    <Badge 
                      variant={wallet.syncStatus === 'SUCCESS' ? 'default' : 'destructive'}
                    >
                      {wallet.syncStatus}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={syncWallet.isPending || syncStatus?.status === 'processing'}
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
        </CardHeader>
        <CardContent>
          {/* Wallet Address */}
          <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-lg">
            <span className="text-sm font-mono text-muted-foreground">Address:</span>
            <span className="font-mono text-sm flex-1">{wallet.address}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyAddress}
              className="h-8 w-8 p-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 w-8 p-0"
            >
              <a
                href={getNetworkExplorerUrl(wallet?.network, wallet?.address)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>

          {/* Wallet Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">
                ${walletStats?.totalBalance.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-muted-foreground">Total Balance</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{walletStats?.assetCount || 0}</div>
              <div className="text-sm text-muted-foreground">Assets</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{walletStats?.nftCount || 0}</div>
              <div className="text-sm text-muted-foreground">NFTs</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-lg font-bold">
                {new Date(syncStatus?.lastSyncAt)?.toLocaleDateString() || 'Never'}
              </div>
              <div className="text-sm text-muted-foreground">Last Sync</div>
            </div>
          </div>

          {/* Sync Status */}
          {syncStatus && (
            <div className={`mt-4 p-3 rounded-lg ${
              syncStatus.status === 'processing'?.toUpperCase() ? 'bg-blue-50 dark:bg-blue-950' :
              syncStatus.status === 'completed'?.toUpperCase() ? 'bg-green-50 dark:bg-green-950' :
              syncStatus.status === 'failed'?.toUpperCase() ? 'bg-red-50 dark:bg-red-950' :
              'bg-yellow-50 dark:bg-yellow-950'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {syncStatus.status === 'processing'?.toUpperCase() && <Loader2 className="h-4 w-4 animate-spin" />}
                {syncStatus.status === 'completed'?.toUpperCase() && <CheckCircle className="h-4 w-4 text-green-600" />}
                {syncStatus.status === 'failed'?.toUpperCase() && <AlertCircle className="h-4 w-4 text-red-600" />}
                {syncStatus.status === 'queued'?.toUpperCase() && <Clock className="h-4 w-4 text-yellow-600" />}
                <span className="text-sm font-medium">
                  {syncStatus.status === 'processing'?.toUpperCase() && 'Syncing wallet data...'}
                  {syncStatus.status === 'completed'?.toUpperCase() && 'Sync completed successfully'}
                  {syncStatus.status === 'failed'?.toUpperCase() && 'Sync failed'}
                  {syncStatus.status === 'queued'?.toUpperCase() && 'Sync queued'}
                </span>
              </div>
              {syncStatus.progress && syncStatus.status === 'processing'?.toUpperCase() && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${syncStatus.progress}%` }}
                  />
                </div>
              )}
              {syncStatus.message && (
                <p className="text-xs text-muted-foreground mt-2">{syncStatus.message}</p>
              )}
              {syncStatus.error && syncStatus.status === 'failed'?.toUpperCase() && (
                <p className="text-xs text-red-600 mt-2">{syncStatus.error}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Wallet Details Tabs */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}  className="w-auto " >
          <CardHeader className="pb-3">
            <TabsList className=" w-fit p-2 h-12 bg-transparent gap-4" >
              <TabsTrigger value="tokens"  className="flex items-center  gap-2 cursor-pointer" >
                <Coins className="h-5 w-5" />
                Tokens
              </TabsTrigger>
              <TabsTrigger value="nfts" className="flex items-center cursor-pointer gap-2">
                <ImageIcon className="h-5 w-5" />
                NFTs
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex items-center cursor-pointer gap-2">
                <ArrowUpDown className="h-5 w-5" />
                Transactions
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            <TabsContent value="tokens" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Token Holdings</h3>
                <Badge variant="outline">{walletStats?.assetCount || 0} assets</Badge>
              </div>
              
              {/* DeFi Positions */}
              {wallet && wallet?.topAssets.length > 0 ? (
                <div className="space-y-3">
                  {wallet?.topAssets?.map((position) => (
                    <div key={position.id} className="px-5 py-1 border rounded-xl">
                      <div className="flex items-center justify-between ">
                        <div className="flex items-center gap-3">


                          <div className="h-10 w-10  rounded-full flex items-center justify-center">
                           <Image src={position?.logoUrl || '/ss.png'} alt={''} width={32} height={32} />
                          </div>
                          <div>
                            <p className="font-medium">{position.name}</p>
                            <div className="flex items-center gap-2">
                          <span className='text-xs'> {Number(position.balance).toFixed(3)}</span>
                              <Badge variant="outline">{position?.symbol?.replace('_', ' ')}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${position?.balanceUsd?.toLocaleString()}</p>
                          {position?.change24h && (
                            <p className="text-sm text-green-600"> {position?.change24h?.toFixed(2)}%</p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {position?.assets?.map((asset, idx) => (
                          <div key={idx} className="text-sm p-2 bg-muted rounded">
                            <span className="font-medium">{asset.symbol}:</span> {asset.amount}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Coins className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No token holdings found in this wallet</p>
                  <p className="text-sm text-muted-foreground mt-1">Try syncing the wallet to get the latest data</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="nfts" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">NFT Collection</h3>
                <Badge variant="outline">{walletStats?.nftCount || 0} NFTs</Badge>
              </div>
              
              {nfts && nfts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {nfts.map((nft: CryptoNFT) => (
                    <div key={nft.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-square bg-muted flex items-center justify-center relative">
                        {nft.imageUrl ? (
                          <Image
                            src={nft.imageUrl}
                            alt={nft.name || 'NFT'}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        )}
                        {nft.rarity && (
                          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            #{nft.rarityRank || 'N/A'}
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="font-medium text-sm truncate" title={nft.name}>
                          {nft.name || `Token #${nft.tokenId}`}
                        </p>
                        <p className="text-xs text-muted-foreground truncate" title={nft.collectionName}>
                          {nft.collectionName}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          {nft.estimatedValue ? (
                            <p className="text-xs font-medium text-green-600">
                              ${typeof nft.estimatedValue === 'object' && nft.estimatedValue ? 'Estimated' : 'N/A'}
                            </p>
                          ) : (
                            <span className="text-xs text-muted-foreground">No valuation</span>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {nft.network}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No NFTs found in this wallet</p>
                  <p className="text-sm text-muted-foreground mt-1">NFTs will appear here after syncing</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Transactions</h3>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/crypto/wallets/${walletIdentifier}/transactions`}>
                    View All
                  </Link>
                </Button>
              </div>
              
              {transactions && transactions.length > 0 ? (
                <div className="space-y-3">
                  {transactions.slice(0, 10).map((tx: CryptoTransaction) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          tx.type === 'RECEIVE' ? 'bg-green-100 dark:bg-green-900 text-green-600' : 
                          tx.type === 'SEND' ? 'bg-red-100 dark:bg-red-900 text-red-600' : 
                          tx.type === 'SWAP' ? 'bg-purple-100 dark:bg-purple-900 text-purple-600' :
                          'bg-blue-100 dark:bg-blue-900 text-blue-600'
                        }`}>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge 
                              variant={tx.status === 'CONFIRMED' ? 'default' : 
                                      tx.status === 'PENDING' ? 'secondary' : 'destructive'} 
                              className="text-xs"
                            >
                              {tx.type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {tx.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {tx.network}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium truncate">
                            {tx.valueFormatted} {tx.assetSymbol}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(tx.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {tx.valueUsd && (
                          <p className="font-medium">${tx.valueUsd.toLocaleString()}</p>
                        )}
                        {tx.gasCostUsd && (
                          <p className="text-xs text-muted-foreground">Gas: ${tx.gasCostUsd.toFixed(2)}</p>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-6 w-6 p-0 mt-1"
                        >
                          <a
                            href={getTransactionExplorerUrl(tx.network, tx.hash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View on explorer"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ArrowUpDown className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No transactions found</p>
                  <p className="text-sm text-muted-foreground mt-1">Transactions will appear here after syncing</p>
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}

export default function WalletPage({ params }: WalletPageProps) {
  const resolvedParams = use(params);
  const walletIdentifier = resolvedParams.wallet;

  return (
    <Suspense fallback={
      <div className="max-w-3xl mx-auto p-6">
        <LoadingSpinner text="Loading wallet..." />
      </div>
    }>
      <WalletPageContent walletIdentifier={walletIdentifier} />
    </Suspense>
  );
}