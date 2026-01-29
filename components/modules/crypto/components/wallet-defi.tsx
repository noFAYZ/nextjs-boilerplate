'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Coins,
  Search,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  ExternalLink,
  Wallet,
  DollarSign,
  Target,
  ArrowUpDown,
  Sparkles,
  Crown,
  Eye,
  MoreHorizontal,
  BadgeDollarSign,
  MoreVertical,
  AlertCircle,
  Lock,
  Clock,
  Percent,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useViewMode } from '@/lib/contexts/view-mode-context';
import {
  TokenIconSkeleton,
  TokenNameSkeleton,
  TokenSymbolSkeleton,
  TokenBalanceSkeleton
} from './wallet-skeletons';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import type { DeFiAppData, DeFiPosition } from '@/lib/types/crypto';

interface WalletDeFiProps {
  defiApps: DeFiAppData[];
  isLoading?: boolean;
  selectedChain?: string | null;
}

const ITEMS_PER_PAGE = 15;

const getPositionTier = (balanceUSD: number, apy?: number) => {
  if (balanceUSD >= 10000 && (apy || 0) >= 20) return 'superstar';
  if (balanceUSD >= 5000 && (apy || 0) >= 10) return 'strong';
  if (balanceUSD >= 1000) return 'major';
  if (balanceUSD >= 100) return 'standard';
  return 'small';
};

const PositionBadge = ({ position }: { position: DeFiPosition }) => {
  const tier = getPositionTier(position.balanceUSD, position.apy);

  const tierConfig = {
    superstar: { icon: Crown, label: 'Top', className: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' },
    strong: { icon: Sparkles, label: 'Strong', className: 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white' },
    major: { icon: TrendingUp, label: 'Major', className: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
    standard: { icon: Wallet, label: '', className: '' },
    small: { icon: Coins, label: '', className: '' }
  };

  const config = tierConfig[tier as keyof typeof tierConfig];
  if (tier === 'standard' || tier === 'small') return null;

  const Icon = config.icon;

  return (
    <div className={cn(
      "absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-xs font-medium flex items-center gap-1 shadow-sm",
      config.className
    )}>
      <Icon className="h-2.5 w-2.5" />
      {config.label}
    </div>
  );
};

const AppIcon = ({ app, isLoading }: { app: Record<string, unknown>; isLoading?: boolean }) => {
  if (isLoading) {
    return <TokenIconSkeleton />;
  }

  const imgUrl = app?.imgUrl as string | undefined;
  const displayName = app?.displayName as string | undefined;

  return (
    <div className="relative h-10 w-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
      {imgUrl ? (
        <Image
          src={imgUrl}
          alt={displayName || 'DeFi App'}
          fill
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground">
          <span className="font-bold text-xs">
            {displayName?.charAt(0) || 'D'}
          </span>
        </div>
      )}
    </div>
  );
};

const TokenPairIcons = ({ position, isLoading }: { position: DeFiPosition; isLoading?: boolean }) => {
  if (isLoading) {
    return (
      <div className="flex -space-x-1">
        <TokenIconSkeleton className="h-6 w-6" />
        <TokenIconSkeleton className="h-6 w-6" />
      </div>
    );
  }

  const images = position.displayProps?.images || [];

  return (
    <div className="flex -space-x-1">
      {images.slice(0, 2).map((imageUrl, idx) => (
        <div key={idx} className="relative h-6 w-6 rounded-full border-2 border-background overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={`Token ${idx + 1}`}
            fill
            className="object-cover"
          />
        </div>
      ))}
      {images.length > 2 && (
        <div className="h-6 w-6 rounded-full border-2 border-background bg-muted flex items-center justify-center">
          <span className="text-xs font-medium">+{images.length - 2}</span>
        </div>
      )}
    </div>
  );
};

export function WalletDeFi({ defiApps, isLoading, selectedChain }: WalletDeFiProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'value' | 'apy' | 'name'>('value');
  const [filterBy, setFilterBy] = useState<'all' | 'pools' | 'lending' | 'staking' | 'high-yield'>('all');
  const { isBeginnerMode, isProMode } = useViewMode();

  // Flatten all positions from all apps
  const allPositions = defiApps?.flatMap(app =>
    app.positions.map(position => ({ ...position, app: app.app }))
  ) || [];

  // Calculate metrics
  const totalValue = allPositions.reduce((sum, position) => sum + (position.balanceUSD || 0), 0);
  const totalApps = defiApps?.length || 0;
  const totalPositions = allPositions.length;
  const highYieldPositions = allPositions.filter(p => p.apy && p.apy > 0);
  const avgAPY = highYieldPositions.length > 0
    ? highYieldPositions.reduce((sum, p) => sum + (p.apy || 0), 0) / highYieldPositions.length
    : 0;

  // Filter and search positions
  const filteredPositions = useMemo(() => {
    return allPositions.filter(position => {
      const app = position.app as Record<string, unknown> | undefined;
      const displayProps = position.displayProps as Record<string, unknown> | undefined;

      const matchesSearch =
        (app?.displayName as string)?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        (displayProps?.label as string)?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        (position.groupLabel as string)?.toLowerCase()?.includes(searchTerm?.toLowerCase());

      if (!matchesSearch) return false;

      // Filter by selected chain
      if (selectedChain) {
        const positionNetwork = (position.network as string)?.toLowerCase();
        // Map some network names to match chain keys
        const networkMapping: Record<string, string> = {
          'binance-smart-chain': 'bsc',
          'bsc': 'bsc',
          'ethereum': 'ethereum',
          'arbitrum': 'arbitrum',
          'polygon': 'polygon',
          'base': 'base',
          'avalanche': 'avalanche',
          'fantom': 'fantom',
          'linea': 'linea',
          'celo': 'celo',
        };

        const mappedNetwork = networkMapping[positionNetwork] || positionNetwork;
        if (mappedNetwork !== selectedChain) return false;
      }

      if (filterBy === 'pools') return position.groupId === 'pool' || position.positionType === 'LIQUIDITY_POOL';
      if (filterBy === 'lending') return position.metaType === 'SUPPLIED' || position.metaType === 'BORROWED';
      if (filterBy === 'staking') return position.metaType === 'STAKED' || position.metaType === 'LOCKED';
      if (filterBy === 'high-yield') return ((position.apy as number) || 0) >= 10;
      return true;
    });
  }, [allPositions, searchTerm, selectedChain, filterBy]);

  // Sort positions
  const sortedPositions = [...filteredPositions].sort((a, b) => {
    switch (sortBy) {
      case 'value':
        return ((b.balanceUSD as number) || 0) - ((a.balanceUSD as number) || 0);
      case 'apy':
        return ((b.apy as number) || 0) - ((a.apy as number) || 0);
      case 'name':
        const aAppName = ((a.app as Record<string, unknown>)?.displayName as string) || '';
        const bAppName = ((b.app as Record<string, unknown>)?.displayName as string) || '';
        return aAppName.localeCompare(bAppName);
      default:
        return 0;
    }
  });

  // Group positions by app for display
  const groupedPositions = sortedPositions.reduce((acc, position) => {
    const appId = position.app?.id;
    if (appId && !acc[appId]) {
      acc[appId] = {
        app: position.app,
        positions: [],
        totalValue: 0
      };
    }
    if (appId && acc[appId]) {
      acc[appId].positions.push(position);
      acc[appId].totalValue += position.balanceUSD || 0;
    }
    return acc;
  }, {} as Record<string, { app: Record<string, unknown>; positions: DeFiPosition[]; totalValue: number }>);

  // Paginate
  const groupedArray = Object.values(groupedPositions);
  const totalPages = Math.ceil(groupedArray.length / ITEMS_PER_PAGE);
  const paginatedGroups = groupedArray.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );


console.log(defiApps );
  return (
    <div className="space-y-2 ">
      {/* DeFi Portfolio Overview */}
      <div className=" px-4">
         
         <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Value</span>
    
       <div className="text-xl font-bold">
         <CurrencyDisplay
           amountUSD={totalValue}
           variant="default"
           isLoading={isLoading}
         />
       </div>
     </div>
    {/*   <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

        <Card size="sm" className="p-3">
          <div className="text-center">
            <div className="text-lg font-bold">
              {isLoading ? (
                <TokenBalanceSkeleton />
              ) : (
                <CurrencyDisplay amountUSD={totalValue || 0} variant="small" />
              )}
            </div>
            <div className="text-xs text-muted-foreground">Total Value</div>
          </div>
        </Card>

        <Card size="sm" className="p-3">
          <div className="text-center">
            <div className="text-lg font-bold">
              {isLoading ? <TokenBalanceSkeleton /> : totalApps}
            </div>
            <div className="text-xs text-muted-foreground">DeFi Apps</div>
          </div>
        </Card>

        <Card size="sm" className="p-3">
          <div className="text-center">
            <div className="text-lg font-bold">
              {isLoading ? <TokenBalanceSkeleton /> : totalPositions}
            </div>
            <div className="text-xs text-muted-foreground">Positions</div>
          </div>
        </Card>

        <Card size="sm" className="p-3">
          <div className="text-center">
            <div className="text-lg font-bold">
              {isLoading ? (
                <TokenBalanceSkeleton />
              ) : avgAPY > 0 ? (
                `${avgAPY.toFixed(1)}%`
              ) : (
                '—'
              )}
            </div>
            <div className="text-xs text-muted-foreground">Avg APY</div>
          </div>
        </Card>
      </div> */}

      {/* Filters - Beginner View Only */}
      {isBeginnerMode && (
        <div className="flex flex-col sm:flex-row gap-2 px-4 py-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              placeholder="Search DeFi apps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 h-8 text-xs"
            />
          </div>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
              <SelectTrigger className="w-[100px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="value">Value</SelectItem>
                <SelectItem value="apy">APY</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterBy} onValueChange={(value) => setFilterBy(value as typeof filterBy)}>
              <SelectTrigger className="w-[100px] h-8 text-xs">
                <Filter className="h-3 w-3" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pools">Pools</SelectItem>
                <SelectItem value="lending">Lending</SelectItem>
                <SelectItem value="staking">Staking</SelectItem>
                <SelectItem value="high-yield">High Yield</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* DeFi Apps and Positions */}
  
        <Accordion type="multiple" className="w-full bg-card rounded-2xl ">
          {defiApps.map((group) => (
            <AccordionItem key={group.app.id} value={group.app.id}>
              <AccordionTrigger className="px-6 py-4 hover:no-underline cursor-pointer  ">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <AppIcon app={group.app} isLoading={isLoading} />
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        {isLoading ? (
                          <TokenNameSkeleton />
                        ) : (
                          <h3 className="font-semibold">{group.app.displayName}</h3>
                        )}
                        {!isLoading && (
                          <Badge variant={group.app.isVerified ? 'default' : 'secondary'} className="text-xs">
                            {group.app.category}
                          </Badge>
                        )}
                        {!isLoading && group.app.isVerified && (
                          <Badge variant="outline" className="text-xs">
                            Verified
                          </Badge>
                        )}
                         <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      
                      {group.app.riskScore <= 30 && (
                        <Badge variant="secondary" className="text-xs text-green-600 bg-green-500/20">Low Risk</Badge>
                      )}
                      {group.app.riskScore > 30 && group.app.riskScore <= 70 && (
                        <Badge variant="secondary"  className="text-xs text-yellow-600 bg-yellow-500/25">Medium Risk</Badge>
                      )}
                      {group.app.riskScore > 70 && (
                        <Badge variant="destructive" className="text-xs text-red-600">High Risk</Badge>
                      )}
                    </div>
                      </div>
                      {!isLoading && (
                        <p className="text-xs text-muted-foreground truncate max-w-md">
                          {group.app.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right mr-4">
                    <div className="font-semibold">
                      {isLoading ? (
                        <TokenBalanceSkeleton />
                      ) : (
                        <CurrencyDisplay amountUSD={group?.totalValueUsd || 0} variant="small" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {isLoading ? (
                        <TokenBalanceSkeleton className="h-3 w-16" />
                      ) : (
                        `${group.positions.length} position${group.positions.length !== 1 ? 's' : ''}`
                      )}
                    </div>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-6 pb-6">
                <div className="space-y-3">
                  {group.positions.map((position) => (
                    <div key={position.id} className="relative bg-background/80 border rounded-lg p-3 hover:bg-background/90 transition-colors">
                      <PositionBadge position={position} />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <TokenPairIcons position={position} isLoading={isLoading} />

                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {isLoading ? (
                                <TokenNameSkeleton />
                              ) : (
                                <p className="font-medium text-sm">{position.displayProps.label}</p>
                              )}
                              {!isLoading && (
                                <Badge variant="outline" className="text-xs">
                                  {position.groupLabel}
                                </Badge>
                              )}
                              {!isLoading && position.metaType && (
                                <Badge
                                  variant={position.metaType === 'SUPPLIED' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {position.metaType}
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              {isLoading ? (
                                <TokenBalanceSkeleton className="h-3 w-32" />
                              ) : (
                                <>
                                  <span>{position.balanceFormatted} {position.symbol}</span>
                                  <span>•</span>
                                  <span>{position.network}</span>
                                  {position.apy && (
                                    <>
                                      <span>•</span>
                                      <div className="flex items-center gap-1 text-green-600">
                                        <Percent className="h-2.5 w-2.5" />
                                        <span>{position.apy.toFixed(2)}% APY</span>
                                      </div>
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-semibold">
                            {isLoading ? (
                              <TokenBalanceSkeleton />
                            ) : (
                              <CurrencyDisplay amountUSD={position.balanceUSD || 0} variant="small" />
                            )}
                          </div>

                          {!isLoading && position.canWithdraw && (
                            <div className="flex items-center gap-1 text-xs text-green-600">
                              <ArrowUpDown className="h-2.5 w-2.5" />
                              <span>Can Withdraw</span>
                            </div>
                          )}

                          {!isLoading && position.lockupEnd && (
                            <div className="flex items-center gap-1 text-xs text-orange-600">
                              <Lock className="h-2.5 w-2.5" />
                              <span>Locked</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Token Breakdown */}
                      {!isLoading && position.tokens && position.tokens.length > 0 && (
                        <div className="mt-2 pt-2 border-t">
                          <div className="flex items-center gap-1 mb-2">
                            <Coins className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground font-medium">Token Breakdown</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {position.tokens.map((token, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{token.symbol}</span>
                                  <Badge variant="outline" className="text-[10px] px-1 py-0">
                                    {token.network}
                                  </Badge>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium">
                              {/*       {parseFloat(token.balance)?.toLocaleString('en', { maximumFractionDigits: 4 })} */}
                                  </div>
                                  <div className="text-muted-foreground">
                                    <CurrencyDisplay amountUSD={token.balanceUSD || 0} variant="small" />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* App Actions */}
                {!isLoading && (
                  <div className="flex items-center justify-between mt-4 pt-3 border-t">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Risk Score: {group.app.riskScore}/100</span>
                      {group.app.riskScore <= 30 && (
                        <Badge variant="outline" className="text-xs text-green-600">Low Risk</Badge>
                      )}
                      {group.app.riskScore > 30 && group.app.riskScore <= 70 && (
                        <Badge variant="outline" className="text-xs text-yellow-600">Medium Risk</Badge>
                      )}
                      {group.app.riskScore > 70 && (
                        <Badge variant="outline" className="text-xs text-red-600">High Risk</Badge>
                      )}
                    </div>

                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={group.app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Visit App</span>
                      </a>
                    </Button>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
   

      {/* Empty State */}
      {!isLoading && defiApps.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
              <BadgeDollarSign className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">
              {searchTerm || filterBy !== 'all' ? 'No DeFi positions found' : 'No DeFi activity'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm || filterBy !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start using DeFi protocols to see positions here'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pagination - Beginner View Only */}
      {isBeginnerMode && totalPages > 1 && (
        <Card className="py-3">
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, groupedArray.length)} of {groupedArray.length} apps
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-7 px-2 text-xs"
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>

                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                  {currentPage}/{totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-7 px-2 text-xs"
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}