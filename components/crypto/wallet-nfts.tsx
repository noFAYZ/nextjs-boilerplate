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
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  ImageIcon, 
  Search, 
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Filter,
  Trophy,
  Eye,
  Zap,
  TrendingUp,
  Sparkles,
  Star,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

import type { CryptoNFT } from '@/lib/types/crypto';
import { ZERION_CHAINS } from '@/lib/constants/chains';
import { MultiSelect } from '../ui/multi-select';
import { Toggle } from '../ui/toggle';
import { StreamlineFlexFilter2 } from '../icons/icons';
import { CurrencyDisplay } from '@/components/ui/currency-display';

interface WalletNFTsProps {
  nfts: CryptoNFT[];
  isLoading?: boolean;
  selectedChain?: string | null;
}

interface NFTFilters {
  networks: string[];
  collections: string[];
  rarity: 'all' | 'rare' | 'epic' | 'legendary';
  priceRange: 'all' | 'free' | 'low' | 'mid' | 'high';
  hasValue: boolean;
}

const ITEMS_PER_PAGE = 24;

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

const RarityBadge = ({ nft }: { nft: CryptoNFT }) => {
  if (!nft.rarityRank) return null;
  const tier = getRarityTier(nft.rarityRank);
  
  return (
    <div className={cn(
      "absolute top-2 left-2 px-2 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1 z-10",
      "bg-gradient-to-r shadow-lg backdrop-blur-sm",
      rarityColors[tier as keyof typeof rarityColors]
    )}>
      {tier === 'legendary' && <Trophy className="h-3 w-3" />}
      {tier === 'epic' && <Sparkles className="h-3 w-3" />}
      {tier === 'rare' && <Star className="h-3 w-3" />}
      #{nft.rarityRank}
    </div>
  );
};

const NetworkBadge = ({ network }: { network: string }) => {
  const chainData = ZERION_CHAINS.find((chain) => chain.id.toUpperCase() === network.toUpperCase());
  const iconUrl = chainData?.attributes.icon?.url;

  // Get network colors for fallback
  const networkColors: Record<string, string> = {
    ETHEREUM: "bg-blue-600",
    POLYGON: "bg-purple-600", 
    BSC: "bg-yellow-600",
    ARBITRUM: "bg-cyan-600",
    OPTIMISM: "bg-red-600",
    AVALANCHE: "bg-red-500",
    SOLANA: "bg-purple-500"
  };

  return (
    <Badge 
    variant={'outline'}
      className={cn(
        "absolute top-2 right-2 text-white text-[10px] px-1 py-0.5 backdrop-blur-sm border-0 flex items-center gap-1 shadow-none z-10",
        iconUrl ? "bg-black/70" : networkColors[network.toUpperCase()] || "bg-gray-600"
      )}
    >
      {iconUrl ? (
        <Image
          src={iconUrl}
          alt={network}
          width={18}
          height={18}
          className="rounded-full"
          unoptimized
        />
      ) : (
        <div className="w-3 h-3 bg-white/20 rounded-full" />
      )}
      <span className="font-medium truncate max-w-[60px]">{network}</span>
    </Badge>
  );
};

const NFTImage = ({ nft, getOpenseaUrl }: { nft: CryptoNFT; getOpenseaUrl: (nft: CryptoNFT) => string }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div className="aspect-square  relative overflow-hidden">
      {nft.imageUrl && !imageError ? (
        <>
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
              <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
            </div>
          )}
          <Image
            src={nft.imageUrl}
            alt={nft.name || `Token #${nft.tokenId}`}
            fill
            className={cn(
              "object-cover group-hover:scale-105 transition-all duration-100",
              imageLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
            priority={false}
          />
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted">
          <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
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
            className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/20"
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
            className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/20"
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
  );
};

export function WalletNFTs({ nfts, isLoading, selectedChain }: WalletNFTsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'value' | 'rarity' | 'name' | 'collection' | 'network'>('value');
  const [filters, setFilters] = useState<NFTFilters>({
    networks: [],
    collections: [],
    rarity: 'all',
    priceRange: 'all',
    hasValue: false
  });
  const [toggleFilters, setToggleFilters] = useState(false);

  const itemsPerPage = ITEMS_PER_PAGE;

  // Helper function to calculate estimated value in USD
  const getEstimatedValueUsd = (nft: CryptoNFT): number => {
    if (!nft.estimatedValue || !nft.estimatedValue.d || nft.estimatedValue.d.length < 2) return 0;
    // Convert from the decimal format: s * 10^e * d[0].d[1] / 10^7
    const { s, e, d } = nft.estimatedValue;
    return s * Math.pow(10, e) * (d[0] + d[1] / 10000000);
  };

  // Extract unique networks and collections for filter options
  const availableNetworks = [...new Set(nfts?.map(nft => nft?.network))].sort();
  const availableCollections = [...new Set(nfts?.map(nft => nft?.collectionName))]
    .filter(Boolean)
    .sort();

  // Filter and search NFTs
  const filteredNFTs = useMemo(() => {
    return nfts.filter(nft => {
      // Search filter
      const matchesSearch = (nft.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            nft.collectionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            nft.tokenId.includes(searchTerm));
      if (!matchesSearch) return false;

      // Chain filter (from chain buttons)
      if (selectedChain) {
        const nftNetwork = nft.network?.toLowerCase();
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

        const mappedNetwork = networkMapping[nftNetwork] || nftNetwork;
        if (mappedNetwork !== selectedChain) return false;
      }

      // Network filter (from internal filters)
      if (filters.networks.length > 0 && !filters.networks.includes(nft.network)) {
        return false;
      }
    
    // Collection filter
    if (filters.collections.length > 0 && !filters.collections.includes(nft.collectionName)) {
      return false;
    }
    
    // Rarity filter
    if (filters.rarity !== 'all') {
      const tier = getRarityTier(nft.rarityRank);
      if (filters.rarity === 'legendary' && tier !== 'legendary') return false;
      if (filters.rarity === 'epic' && !['legendary', 'epic'].includes(tier)) return false;
      if (filters.rarity === 'rare' && !['legendary', 'epic', 'rare'].includes(tier)) return false;
    }
    
    // Price range filter
    const value = getEstimatedValueUsd(nft);
    if (filters.priceRange !== 'all') {
      if (filters.priceRange === 'free' && value > 0) return false;
      if (filters.priceRange === 'low' && (value === 0 || value > 100)) return false;
      if (filters.priceRange === 'mid' && (value < 100 || value > 1000)) return false;
      if (filters.priceRange === 'high' && value < 1000) return false;
    }
    
    // Has value filter
    if (filters.hasValue && value === 0) return false;
    
      return true;
    });
  }, [nfts, searchTerm, selectedChain, filters]);

  // Sort NFTs
  const sortedNFTs = [...filteredNFTs].sort((a, b) => {
    switch (sortBy) {
      case 'value':
        return getEstimatedValueUsd(b) - getEstimatedValueUsd(a);
      case 'rarity':
        return (a.rarityRank || Infinity) - (b.rarityRank || Infinity);
      case 'name':
        return (a.name || a.tokenId).localeCompare(b.name || b.tokenId);
      case 'collection':
        return a.collectionName.localeCompare(b.collectionName);
      case 'network':
        return a.network.localeCompare(b.network);
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

  const totalValue = nfts.reduce((sum, nft) => sum + Number(nft?.estimatedValue || 0), 0);
  const collectionsCount = new Set(nfts.map(nft => nft.collectionName)).size;
  const rareCount = nfts.filter(nft => nft.rarityRank && nft.rarityRank <= 1000).length;

  const getOpenseaUrl = (nft: CryptoNFT) => {
    const networkPath = nft.network.toLowerCase() === 'ethereum' ? 'ethereum' : 
                       nft.network.toLowerCase() === 'polygon' ? 'matic' : 
                       nft.network.toLowerCase();
    return `https://opensea.io/assets/${networkPath}/${nft.contractAddress}/${nft.tokenId}`;
  };

  return (
    <div className="space-y-4">

      {/* Modern Header with Gradient Stats */}
<div className='px-4 flex justify-between'>
      <div className=" ">
         
         <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Value</span>
    
       <div className="text-xl font-bold">
         <CurrencyDisplay
           amountUSD={totalValue}
           variant="default"
           isLoading={isLoading}
         />
       </div>
     </div>
     <div className='flex gap-2 items-center'>
        {/* Search + Sort */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
    {/* Search */}
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
      <Input
        placeholder="Search NFTs or collections..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 h-9 bg-background"
      />
    </div>

    {/* Sort */}
    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
      <SelectTrigger className="w-full sm:w-[150px] h-9">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="value">By Value</SelectItem>
        <SelectItem value="rarity">By Rarity</SelectItem>
        <SelectItem value="name">By Name</SelectItem>
        <SelectItem value="collection">Collection</SelectItem>
        <SelectItem value="network">Network</SelectItem>
      </SelectContent>
    </Select>
  </div>
     <Toggle className=" px-2 gap-1.5" title='Filters' variant={'outline'} 
onClick={()=>setToggleFilters(!toggleFilters)} >
  <StreamlineFlexFilter2 className="h-4 w-4" />
      Filters
        </Toggle>

    </div>
</div>


  {/* Filters Row */}
  <div className={` px-4 items-center  gap-2 ${toggleFilters ? 'flex flex-wrap sm:justify-end ' : 'hidden'}`}>
    {/* Networks */}
    <MultiSelect
  options={availableNetworks.map((network) => {
    const chainData = ZERION_CHAINS.find(
      (chain) => chain.id.toUpperCase() === network.toUpperCase()
    )
    return {
      label: network,
      value: network,
      icon: chainData
        ? () =>
            <Image
              src={chainData.attributes.icon.url}
              alt={network}
              width={16}
              height={16}
              className="rounded-full"
              unoptimized
            />
        : undefined,
    }
  })}
  selected={filters.networks}
  onChange={(newSelected) =>
    setFilters((prev) => ({ ...prev, networks: newSelected }))
  }
  placeholder="Select Networks..."
  searchPlaceholder="Search networks..."
  emptyMessage="No networks found."
  className="w-[220px]"
/>

    {/* Collections */}
    <MultiSelect
  options={availableCollections.map((collection) => ({
    label: collection,
    value: collection,
  }))}
  selected={filters.collections}
  onChange={(newSelected) =>
    setFilters((prev) => ({ ...prev, collections: newSelected }))
  }
  placeholder="Select Collections..."
  searchPlaceholder="Search collections..."
  emptyMessage="No collections found."
  className="w-[260px]"
/>

    {/* Rarity */}
    <Select
      value={filters.rarity}
      onValueChange={(value: any) => setFilters((prev) => ({ ...prev, rarity: value }))}
    >
      <SelectTrigger className="w-[120px] h-8">
        <Trophy className="h-3 w-3 mr-1" />
        <SelectValue placeholder="Rarity" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Rarity</SelectItem>
        <SelectItem value="rare">Rare+</SelectItem>
        <SelectItem value="epic">Epic+</SelectItem>
        <SelectItem value="legendary">Legendary</SelectItem>
      </SelectContent>
    </Select>

    {/* Price */}
    <Select
      value={filters.priceRange}
      onValueChange={(value: any) => setFilters((prev) => ({ ...prev, priceRange: value }))}
    >
      <SelectTrigger className="w-[120px] h-8">
        <TrendingUp className="h-3 w-3 mr-1" />
        <SelectValue placeholder="Price" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Prices</SelectItem>
        <SelectItem value="free">Free</SelectItem>
        <SelectItem value="low">$1-$100</SelectItem>
        <SelectItem value="mid">$100-$1K</SelectItem>
        <SelectItem value="high">$1K+</SelectItem>
      </SelectContent>
    </Select>

    {/* Has Value */}
    <Button
      variant={filters.hasValue ? "default" : "outline"}
      size="sm"
      className="h-8"
      onClick={() => setFilters((prev) => ({ ...prev, hasValue: !prev.hasValue }))}
    >
      <Zap className="h-3 w-3 mr-1" />
      Valued
    </Button>

    {/* Clear */}
    {(filters.networks.length > 0 ||
      filters.collections.length > 0 ||
      filters.rarity !== "all" ||
      filters.priceRange !== "all" ||
      filters.hasValue) && (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 text-muted-foreground"
        onClick={() =>
          setFilters({
            networks: [],
            collections: [],
            rarity: "all",
            priceRange: "all",
            hasValue: false,
          })
        }
      >
        Clear all
      </Button>
    )}
  </div>


      {/* NFT Grid Display */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6  gap-4">
        {paginatedNFTs.map((nft) => (
          <Card key={nft.id} className="group overflow-hidden hover:shadow-xl transition-all duration-100 transform hover:-translate-y-1 border shadow-sm py-0 rounded-2xl gap-0">
            <NFTImage nft={nft} getOpenseaUrl={getOpenseaUrl} />
            
            <CardContent className="px-4 py-1">
              <div className="">
                <p className="font-medium text-sm truncate" title={nft.name || `Token #${nft.tokenId}`}>
                  {nft.name || `#${nft.tokenId}`}
                </p>
                <p className="text-xs text-muted-foreground truncate" title={nft.collectionName}>
                  {nft.collectionName}
                </p>
                <div className="flex items-center justify-between pt-1">
                  {Number(nft?.estimatedValue) > 0 ? (
                    <div className="flex items-center gap-1">
                      <CurrencyDisplay
                        amountUSD={Number(nft?.estimatedValue)}
                        variant="small"
                        isLoading={isLoading}
                        className="text-sm font-semibold text-green-700"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">N/A</span>
                  )}
                  {nft.rarityRank && nft.rarityRank < 1000 && (
                    <Badge variant="outline" className="text-xs px-1">
                      #{nft.rarityRank}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredNFTs.length === 0 && !isLoading && (
        <Card className="border-0">
          <CardContent className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="h-10 w-10 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm || filters.networks.length > 0 || filters.collections.length > 0 || filters.rarity !== 'all' || filters.priceRange !== 'all' || filters.hasValue ? 'No NFTs match your criteria' : 'No NFTs found'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || filters.networks.length > 0 || filters.collections.length > 0 || filters.rarity !== 'all' || filters.priceRange !== 'all' || filters.hasValue ? 'Try adjusting your search or filters' : 'NFTs will appear here after syncing your wallet'}
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