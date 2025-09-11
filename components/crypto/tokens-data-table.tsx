'use client';

import { useState } from 'react';
import Image from 'next/image';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  Coins,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface TokensDataTableProps {
  tokens: TokenPosition[];
  totalValue: number;
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 20;

export function TokensDataTable({ tokens, totalValue, isLoading }: TokensDataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'value' | 'change' | 'name'>('value');
  const [filterBy, setFilterBy] = useState<'all' | 'profitable' | 'losing' | 'major'>('all');

  // Filter and search tokens
  const filteredTokens = tokens.filter(token => {
    const matchesSearch = token.asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         token.asset.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (filterBy === 'profitable') return (token.dayChangePct || 0) > 0;
    if (filterBy === 'losing') return (token.dayChangePct || 0) < 0;
    if (filterBy === 'major') return token.balanceUsd >= 100;
    return true;
  });

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

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="border rounded-lg">
          <div className="h-12 bg-muted animate-pulse" />
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-16 border-t bg-muted/50 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tokens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)} >
            <SelectTrigger className="w-[130px] h-9" >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="value">By Value</SelectItem>
              <SelectItem value="change">By Change</SelectItem>
              <SelectItem value="name">By Name</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
            <SelectTrigger className="w-[120px] h-9">
              <Filter className="h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tokens</SelectItem>
              <SelectItem value="profitable">Profitable</SelectItem>
              <SelectItem value="losing">Losing</SelectItem>
              <SelectItem value="major">Major ($100+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Data Table */}
      <div className=" rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-none ">
              <TableHead className="w-[200px] font-bold">Token</TableHead>
             <TableHead className="text-right font-bold">Portfolio %</TableHead> 
              <TableHead className="text-right font-bold">Balance</TableHead>
              <TableHead className="text-right font-bold">Value (USD)</TableHead>
              <TableHead className="text-right font-bold">24h Change</TableHead>
              
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTokens.map((token) => (
              <TableRow key={token.id} className="group border-none">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
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
                    <div className="min-w-0">
                    
                      <div className="flex items-center gap-1">
                                              <p className="font-semibold text-sm truncate">{token.asset.name}</p>

                        <Badge variant="outline" className="text-xs">
                          {token.asset.symbol}
                        </Badge>
                     
                      </div>   <span className="text-xs text-muted-foreground">{token.asset.network}</span>
                    </div>
                  </div>
                </TableCell>
                 <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-12 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(((token.balanceUsd / totalValue) * 100), 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium min-w-[40px]">
                      {((token.balanceUsd / totalValue) * 100).toFixed(1)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div>
                    <p className="font-medium text-sm">
                      {Number(token.balance).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    </p>
                    <p className="text-xs text-muted-foreground">{token.asset.symbol}</p>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <p className="font-medium">${token.balanceUsd.toLocaleString()}</p>
                </TableCell>
                <TableCell className="text-right">
                  {token.dayChangePct !== undefined ? (
                    <div className={cn(
                      "flex items-center justify-end gap-1",
                      token.dayChangePct >= 0 ? 'text-green-600' : 'text-red-600'
                    )}>
                      {token.dayChangePct >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span className="font-medium">
                        {Math.abs(token.dayChangePct).toFixed(2)}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
               
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Sub-assets expansion for DeFi tokens */}
      {paginatedTokens.some(token => token.assets && token.assets.length > 0) && (
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Eye className="h-3 w-3" />
          <span>Some tokens contain underlying DeFi assets</span>
        </div>
      )}

      {/* Empty State */}
      {filteredTokens.length === 0 && (
        <div className="text-center py-12 border rounded-lg">
          <Coins className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-2">
            {searchTerm || filterBy !== 'all' ? 'No tokens match your criteria' : 'No tokens found'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm || filterBy !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Sync your wallet to see token holdings'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredTokens.length)} of {filteredTokens.length} tokens
          </p>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 px-3"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium bg-primary text-primary-foreground px-3 py-1 rounded">
                {currentPage}
              </span>
              <span className="text-sm text-muted-foreground">of {totalPages}</span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 px-3"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}