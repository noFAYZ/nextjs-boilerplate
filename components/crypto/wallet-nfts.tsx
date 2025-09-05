'use client';

import { useState } from 'react';
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
  ImageIcon, 
  Search, 
  Grid3x3,
  List,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Filter,
  Trophy,
  Eye,
  Zap,
  TrendingUp,
  Sparkles,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NFT {
  id: string;
  name?: string;
  tokenId: string;
  image?: string;
  collection: {
    name: string;
    floorPrice?: number;
  };
  estimatedValueUsd?: number;
  rarity?: {
    rank: number;
    score: number;
  };
  network: string;
  contractAddress: string;
}

interface WalletNFTsProps {
  nfts: NFT[];
  isLoading?: boolean;
}

const ITEMS_PER_PAGE_GRID = 16;
const ITEMS_PER_PAGE_LIST = 12;

const rarityColors = {
  legendary: "from-yellow-400 to-orange-500",
  epic: "from-purple-400 to-pink-500", 
  rare: "from-blue-400 to-cyan-500",
  uncommon: "from-green-400 to-emerald-500",
  common: "from-gray-300 to-gray-400"
};

const getRarityTier = (rank?: number) => {
  if (!rank) return 'common';
  if (rank <= 10) return 'legendary';
  if (rank <= 100) return 'epic';
  if (rank <= 1000) return 'rare';
  if (rank <= 5000) return 'uncommon';
  return 'common';
};

const RarityBadge = ({ nft }: { nft: NFT }) => {
  if (!nft.rarity) return null;
  const tier = getRarityTier(nft.rarity.rank);
  
  return (
    <div className={cn(
      "absolute top-2 left-2 px-2 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1",
      "bg-gradient-to-r shadow-lg backdrop-blur-sm",
      rarityColors[tier as keyof typeof rarityColors]
    )}>
      {tier === 'legendary' && <Trophy className="h-3 w-3" />}
      {tier === 'epic' && <Sparkles className="h-3 w-3" />}
      {tier === 'rare' && <Star className="h-3 w-3" />}
      #{nft.rarity.rank}
    </div>
  );
};

const NetworkBadge = ({ network }: { network: string }) => {
  const networkColors: Record<string, string> = {
    ETHEREUM: "bg-blue-500",
    POLYGON: "bg-purple-500", 
    BSC: "bg-yellow-500",
    ARBITRUM: "bg-cyan-500",
    OPTIMISM: "bg-red-500",
    SOLANA: "bg-gradient-to-r from-purple-400 to-pink-500"
  };

  return (
    <Badge 
      className={cn(
        "absolute top-2 right-2 text-white text-xs px-2 py-1 shadow-lg",
        networkColors[network] || "bg-gray-500"
      )}
    >
      {network}
    </Badge>
  );
};

export function WalletNFTs({ nfts, isLoading }: WalletNFTsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'value' | 'rarity' | 'name' | 'collection'>('value');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterBy, setFilterBy] = useState<'all' | 'valued' | 'rare' | 'legendary'>('all');

  const itemsPerPage = viewMode === 'grid' ? ITEMS_PER_PAGE_GRID : ITEMS_PER_PAGE_LIST;

  // Filter and search NFTs
  const filteredNFTs = nfts.filter(nft => {
    const matchesSearch = (nft.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          nft.collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          nft.tokenId.includes(searchTerm));
    
    if (!matchesSearch) return false;
    
    if (filterBy === 'valued') return nft.estimatedValueUsd && nft.estimatedValueUsd > 0;
    if (filterBy === 'rare') return nft.rarity && nft.rarity.rank <= 1000;
    if (filterBy === 'legendary') return nft.rarity && nft.rarity.rank <= 100;
    return true;
  });

  // Sort NFTs
  const sortedNFTs = [...filteredNFTs].sort((a, b) => {
    switch (sortBy) {
      case 'value':
        return (b.estimatedValueUsd || 0) - (a.estimatedValueUsd || 0);
      case 'rarity':
        return (a.rarity?.rank || Infinity) - (b.rarity?.rank || Infinity);
      case 'name':
        return (a.name || a.tokenId).localeCompare(b.name || b.tokenId);
      case 'collection':
        return a.collection.name.localeCompare(b.collection.name);
      default:
        return 0;
    }
  });

  // Paginate NFTs
  const totalPages = Math.ceil(sortedNFTs.length / itemsPerPage);
  const paginatedNFTs = sortedNFTs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalValue = nfts.reduce((sum, nft) => sum + (nft.estimatedValueUsd || 0), 0);
  const collectionsCount = new Set(nfts.map(nft => nft.collection.name)).size;
  const rareCount = nfts.filter(nft => nft.rarity && nft.rarity.rank <= 1000).length;

  const getOpenseaUrl = (nft: NFT) => {
    const networkPath = nft.network.toLowerCase() === 'ethereum' ? 'ethereum' : 
                       nft.network.toLowerCase() === 'polygon' ? 'matic' : 
                       nft.network.toLowerCase();
    return `https://opensea.io/assets/${networkPath}/${nft.contractAddress}/${nft.tokenId}`;
  };

  return (
    <div className="space-y-4">
      {/* Modern Header with Gradient Stats */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 p-6 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <ImageIcon className="h-5 w-5" />
                </div>
                NFT Collection
              </h3>
              <p className="text-white/80 text-sm">
                Discover and manage your digital collectibles
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-9 px-3"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-9 px-3"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <ImageIcon className="h-4 w-4 text-white/80" />
                <span className="text-xs text-white/80 uppercase tracking-wide">Total</span>
              </div>
              <div className="text-xl font-bold">{nfts.length}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-white/80" />
                <span className="text-xs text-white/80 uppercase tracking-wide">Value</span>
              </div>
              <div className="text-xl font-bold">${totalValue.toLocaleString()}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-white/80" />
                <span className="text-xs text-white/80 uppercase tracking-wide">Collections</span>
              </div>
              <div className="text-xl font-bold">{collectionsCount}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="h-4 w-4 text-white/80" />
                <span className="text-xs text-white/80 uppercase tracking-wide">Rare</span>
              </div>
              <div className="text-xl font-bold">{rareCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search NFTs or collections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9 bg-background"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-[120px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="value">By Value</SelectItem>
                  <SelectItem value="rarity">By Rarity</SelectItem>
                  <SelectItem value="name">By Name</SelectItem>
                  <SelectItem value="collection">Collection</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
                <SelectTrigger className="w-[110px] h-9">
                  <Filter className="h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All NFTs</SelectItem>
                  <SelectItem value="valued">Valued</SelectItem>
                  <SelectItem value="rare">Rare</SelectItem>
                  <SelectItem value="legendary">Legendary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NFT Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {paginatedNFTs.map((nft) => (
            <Card key={nft.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
                {nft.image ? (
                  <Image
                    src={nft.image}
                    alt={nft.name || `Token #${nft.tokenId}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                
                <RarityBadge nft={nft} />
                <NetworkBadge network={nft.network} />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      asChild
                      className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                    >
                      <a
                        href={getOpenseaUrl(nft)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View on OpenSea"
                      >
                        <Eye className="h-3 w-3" />
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      asChild
                      className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                    >
                      <a
                        href={getOpenseaUrl(nft)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="External Link"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-3">
                <p className="font-medium text-sm truncate mb-1" title={nft.name || `Token #${nft.tokenId}`}>
                  {nft.name || `#${nft.tokenId}`}
                </p>
                <p className="text-xs text-muted-foreground truncate mb-2" title={nft.collection.name}>
                  {nft.collection.name}
                </p>
                <div className="flex items-center justify-between">
                  {nft.estimatedValueUsd ? (
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-green-500" />
                      <p className="text-xs font-medium text-green-600">
                        ${nft.estimatedValueUsd.toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {paginatedNFTs.map((nft) => (
            <Card key={nft.id} className="group hover:shadow-md transition-all duration-200 border-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex-shrink-0 relative">
                    {nft.image ? (
                      <Image
                        src={nft.image}
                        alt={nft.name || `Token #${nft.tokenId}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium text-lg truncate">{nft.name || `Token #${nft.tokenId}`}</p>
                      {nft.rarity && nft.rarity.rank <= 100 && (
                        <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                          <Trophy className="h-3 w-3 mr-1" />
                          Legendary
                        </Badge>
                      )}
                      {nft.rarity && nft.rarity.rank > 100 && nft.rarity.rank <= 1000 && (
                        <Badge variant="secondary" className="bg-gradient-to-r from-purple-400 to-pink-500 text-white text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Rare
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 truncate">{nft.collection.name}</p>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        {nft.network}
                      </Badge>
                      <span className="text-xs text-muted-foreground">#{nft.tokenId}</span>
                      {nft.rarity && (
                        <span className="text-xs text-muted-foreground">Rank #{nft.rarity.rank}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right flex-shrink-0 flex items-center gap-3">
                    <div>
                      {nft.estimatedValueUsd ? (
                        <div className="flex items-center gap-1 mb-1">
                          <Zap className="h-4 w-4 text-green-500" />
                          <p className="font-medium text-green-600">
                            ${nft.estimatedValueUsd.toLocaleString()}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground mb-1">No valuation</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-8 w-8 p-0"
                    >
                      <a
                        href={getOpenseaUrl(nft)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View on OpenSea"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredNFTs.length === 0 && !isLoading && (
        <Card className="border-0">
          <CardContent className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="h-10 w-10 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm || filterBy !== 'all' ? 'No NFTs match your criteria' : 'No NFTs found'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || filterBy !== 'all' ? 'Try adjusting your search or filters' : 'NFTs will appear here after syncing your wallet'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modern Pagination */}
      {totalPages > 1 && (
        <Card className="border-0 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredNFTs.length)} of {filteredNFTs.length} NFTs
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-9 px-3"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium bg-primary text-primary-foreground px-3 py-1 rounded-md">
                    {currentPage}
                  </span>
                  <span className="text-sm text-muted-foreground">of {totalPages}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-9 px-3"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}