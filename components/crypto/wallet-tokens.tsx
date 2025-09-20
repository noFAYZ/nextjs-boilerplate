'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
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
  Coins, 
  Search, 
  TrendingUp, 
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  DollarSign,
  Target,
  PieChart,
  ArrowUpDown,
  Sparkles,
  Crown,
  Eye,
  MoreHorizontal,
  BadgeDollarSign,
  MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TokensDataTable } from './tokens-data-table';
import { useViewMode } from '@/lib/contexts/view-mode-context';
import {
  TokenIconSkeleton,
  TokenNameSkeleton,
  TokenSymbolSkeleton,
  TokenBalanceSkeleton
} from './wallet-skeletons';
import { CurrencyDisplay } from '@/components/ui/currency-display';

interface TokenPosition {
  id: string;
  asset: {
    name: string;
    symbol: string;
    logoUrl?: string;
    network: string;
  };
  balance: string;
  balanceUsd: number;
  dayChangePct?: number;
  assets?: Array<{
    symbol: string;
    amount: string;
  }>;
}

interface WalletTokensProps {
  tokens: TokenPosition[];
  isLoading?: boolean;
  selectedChain?: string | null;
}

const ITEMS_PER_PAGE = 15;

const getPerformanceTier = (changePct?: number, value?: number) => {
  if (!changePct || !value) return 'standard';
  if (changePct >= 10 && value >= 1000) return 'superstar';
  if (changePct >= 5 && value >= 500) return 'strong';
  if (changePct >= 0) return 'positive';
  if (changePct >= -5) return 'mild';
  return 'declining';
};

const PerformanceBadge = ({ token }: { token: TokenPosition }) => {
  const tier = getPerformanceTier(token.dayChangePct, token.balanceUsd);
  
  const tierConfig = {
    superstar: { icon: Crown, label: 'Top', className: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' },
    strong: { icon: Sparkles, label: 'Strong', className: 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white' },
    positive: { icon: TrendingUp, label: '+', className: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
    mild: { icon: ArrowUpDown, label: '~', className: 'bg-muted text-muted-foreground' },
    declining: { icon: TrendingDown, label: '-', className: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
    standard: { icon: Coins, label: '', className: '' }
  };
  
  const config = tierConfig[tier as keyof typeof tierConfig];
  if (tier === 'standard') return null;
  
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

const TokenIcon = ({ token, isLoading }: { token: TokenPosition; isLoading?: boolean }) => {
  if (isLoading) {
    return <TokenIconSkeleton />;
  }

  return (
    <div className="relative h-10 w-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
      {token.asset.logoUrl ? (
        <Image
          src={token.asset.logoUrl}
          alt={token.asset.name}
          fill
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground">
          <span className="font-bold text-xs">
            {token.asset.symbol.charAt(0)}
          </span>
        </div>
      )}
    </div>
  );
};

export function WalletTokens({ tokens, isLoading, selectedChain }: WalletTokensProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'value' | 'change' | 'name'>('value');
  const [filterBy, setFilterBy] = useState<'all' | 'profitable' | 'losing' | 'major'>('all');
  const { isBeginnerMode, isProMode } = useViewMode();

  // Calculate portfolio metrics
  const totalValue = tokens.reduce((sum, token) => sum + token.balanceUsd, 0);
  const profitableCount = tokens.filter(token => (token.dayChangePct || 0) > 0).length;
  const majorHoldings = tokens.filter(t => t.balanceUsd >= 100).length;
  const topPerformers = tokens.filter(token => token.dayChangePct && token.dayChangePct >= 5).length;

  // Filter and search tokens
  const filteredTokens = useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('WalletTokens filtering with selectedChain:', selectedChain, 'tokens count:', tokens.length);
      console.log('Available networks in tokens:', [...new Set(tokens.map(t => t.asset.network))]);
    }

    const filtered = tokens.filter(token => {
      const matchesSearch = token.asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           token.asset.symbol.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Filter by selected chain
      if (selectedChain) {
        const tokenNetwork = token.asset.network?.toLowerCase();

        // Map some network names to match chain keys - more comprehensive mapping
        const networkMapping: Record<string, string> = {
          'binance-smart-chain': 'bsc',
          'bsc': 'bsc',
          'bnb': 'bsc',
          'bnb-smart-chain': 'bsc',
          'ethereum': 'ethereum',
          'eth': 'ethereum',
          'arbitrum': 'arbitrum',
          'arbitrum-one': 'arbitrum',
          'polygon': 'polygon',
          'matic': 'polygon',
          'polygon-matic': 'polygon',
          'base': 'base',
          'avalanche': 'avalanche',
          'avax': 'avalanche',
          'avalanche-c-chain': 'avalanche',
          'fantom': 'fantom',
          'ftm': 'fantom',
          'linea': 'linea',
          'celo': 'celo',
        };

        const mappedNetwork = networkMapping[tokenNetwork] || tokenNetwork;
        const shouldInclude = mappedNetwork === selectedChain;

        if (process.env.NODE_ENV === 'development') {
          console.log(`🔍 Token "${token.asset.symbol}": network="${tokenNetwork}" mapped="${mappedNetwork}" selectedChain="${selectedChain}" include=${shouldInclude}`);
        }

        if (!shouldInclude) return false;
      }

      if (filterBy === 'profitable') return (token.dayChangePct || 0) > 0;
      if (filterBy === 'losing') return (token.dayChangePct || 0) < 0;
      if (filterBy === 'major') return token.balanceUsd >= 100;
      return true;
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('WalletTokens filtered result:', filtered.length, 'tokens');
    }

    return filtered;
  }, [tokens, searchTerm, selectedChain, filterBy]);

  // Sort tokens
  const sortedTokens = [...filteredTokens].sort((a, b) => {
    switch (sortBy) {
      case 'value':
        return b.balanceUsd - a.balanceUsd;
      case 'change':
        return (b.dayChangePct || 0) - (a.dayChangePct || 0);
      case 'name':
        return a.asset.name.localeCompare(b.asset.name);
      default:
        return 0;
    }
  });

  // Paginate tokens
  const totalPages = Math.ceil(sortedTokens.length / ITEMS_PER_PAGE);
  const paginatedTokens = sortedTokens.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  

  return (
    <div className="space-y-3">

      {/* Compact Filters - Beginner View Only */}
      {isBeginnerMode && (
        <div className="flex flex-col sm:flex-row gap-2 px-4 py-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder="Search tokens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 h-8 text-xs"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-[100px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="value">Value</SelectItem>
                  <SelectItem value="change">Change</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
                <SelectTrigger className="w-[90px] h-8 text-xs">
                  <Filter className="h-3 w-3" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="profitable">Profit</SelectItem>
                  <SelectItem value="losing">Loss</SelectItem>
                  <SelectItem value="major">Major</SelectItem>
                </SelectContent>
              </Select>
            </div>
        </div>
      )}
  

      {/* Conditional Rendering based on View Mode */}
      {isBeginnerMode ? (
        /* Beginner View - Cards */
        <div className="space-y-3 ">
          {paginatedTokens.map((token) => (
          <Card key={token.id} className={cn(
            "group transition-all duration-100 hover:shadow-md relative py-2",
            token.dayChangePct && token.dayChangePct > 0 ? "bg-green-50/50 dark:bg-green-950/20" :
            token.dayChangePct && token.dayChangePct < 0 ? "bg-red-50/50 dark:bg-red-950/20" :
            "bg-background"
          )}>
            <PerformanceBadge token={token} />
            
            <CardContent >
              <div className="flex items-center gap-3">
                <TokenIcon token={token} isLoading={isLoading} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {isLoading ? (
                      <TokenNameSkeleton />
                    ) : (
                      <p className="font-medium text-sm truncate">{token.asset.name}</p>
                    )}
                    {isLoading ? (
                      <TokenSymbolSkeleton />
                    ) : (
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        {token.asset.symbol}
                      </Badge>
                    )}
                    <div className="flex items-center gap-1">
                    <div className="w-12 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-100"
                        style={{ width: isLoading ? '0%' : `${Math.min(((token.balanceUsd / totalValue) * 100), 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {isLoading ? '—' : `${((token.balanceUsd / totalValue) * 100).toFixed(1)}%`}
                    </span>
                  </div>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {isLoading ? (
                      <TokenBalanceSkeleton className="h-3 w-24" />
                    ) : (
                      `${Number(token.balance).toLocaleString(undefined, { maximumFractionDigits: 4 })} ${token.asset.symbol}`
                    )}
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    {isLoading ? (
                      <TokenBalanceSkeleton />
                    ) : (
                      <CurrencyDisplay
                        amountUSD={token.balanceUsd}
                        variant="small"
                        isLoading={isLoading}
                        className="font-semibold"
                      />
                    )}
                    {!isLoading && token.dayChangePct !== undefined && (
                      <div className={cn(
                        "flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs",
                        token.dayChangePct >= 0
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      )}>
                        {token.dayChangePct >= 0 ? (
                          <TrendingUp className="h-2.5 w-2.5" />
                        ) : (
                          <TrendingDown className="h-2.5 w-2.5" />
                        )}
                        {Math.abs(token.dayChangePct).toFixed(1)}%
                      </div>
                    )}
                  </div>

                  {/* Portfolio Weight Bar
                  <div className="flex items-center gap-1">
                    <div className="w-8 bg-muted rounded-full h-1">
                      <div
                        className="bg-primary h-1 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(((token.balanceUsd / totalValue) * 100), 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {((token.balanceUsd / totalValue) * 100).toFixed(1)}%
                    </span>
                  </div>*/}
                </div>
                
           
              </div>
              
              {/* Compact DeFi Assets */}
              {token.assets && token.assets.length > 0 && (
                <div className="mt-2 pt-2 border-t">
                  <div className="flex items-center gap-1 mb-1">
                    <Eye className="h-2.5 w-2.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Assets</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {token.assets.slice(0, 3).map((asset, idx) => (
                      <span key={idx} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                        {asset.symbol}: {asset.amount}
                      </span>
                    ))}
                    {token.assets.length > 3 && (
                      <span className="text-xs text-muted-foreground">+{token.assets.length - 3}</span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          ))}
        </div>
      ) : (
        /* Pro View - Data Table */
          <TokensDataTable
            tokens={sortedTokens}
            totalValue={totalValue}
            isLoading={isLoading}
          />
        
      )}

      {/* Empty State for Beginner View Only */}
      {isBeginnerMode && filteredTokens.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
              <Coins className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">
              {searchTerm || filterBy !== 'all' ? 'No matches found' : 'No tokens found'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm || filterBy !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Sync your wallet to see token holdings'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Compact Pagination for Beginner View Only */}
      {isBeginnerMode && totalPages > 1 && (
        <Card className='py-3'>
          <CardContent >
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredTokens.length)} of {filteredTokens.length}
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