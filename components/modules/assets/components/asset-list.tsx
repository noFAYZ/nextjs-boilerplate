'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Plus, Search, Home, Car, Package } from 'lucide-react';
import { AssetCard } from './asset-card';
import { useAssetAccounts } from '@/lib/queries/use-networth-data';
import type { AssetAccount, AccountType } from '@/lib/types/networth';

interface AssetListProps {
  onCreateAsset?: () => void;
  onEditAsset?: (asset: AssetAccount) => void;
  onDeleteAsset?: (asset: AssetAccount) => void;
  onViewAsset?: (asset: AssetAccount) => void;
}

type AssetFilter = AccountType | 'ALL';

export function AssetList({
  onCreateAsset,
  onEditAsset,
  onDeleteAsset,
  onViewAsset,
}: AssetListProps) {
  const [filter, setFilter] = useState<AssetFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'value' | 'name' | 'date'>('value');

  // Fetch assets
  const { data: assetsResponse, isLoading } = useAssetAccounts({
    type: filter === 'ALL' ? undefined : filter,
  });

  const assets = assetsResponse?.data || [];

  // Filter and sort assets
  const filteredAssets = useMemo(() => {
    let filtered = [...assets];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (asset) =>
          asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.assetDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.city?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'value':
          return b.balance - a.balance;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          const dateA = a.purchaseDate ? new Date(a.purchaseDate).getTime() : 0;
          const dateB = b.purchaseDate ? new Date(b.purchaseDate).getTime() : 0;
          return dateB - dateA;
        default:
          return 0;
      }
    });

    return filtered;
  }, [assets, searchQuery, sortBy]);

  // Calculate totals
  const stats = useMemo(() => {
    const total = filteredAssets.reduce((sum, asset) => sum + asset.balance, 0);
    const realEstate = filteredAssets.filter(a => a.type === 'REAL_ESTATE').length;
    const vehicles = filteredAssets.filter(a => a.type === 'VEHICLE').length;
    const other = filteredAssets.filter(a => a.type === 'OTHER_ASSET').length;

    return { total, realEstate, vehicles, other };
  }, [filteredAssets]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Assets</h2>
          <p className="text-sm text-muted-foreground">
            {filteredAssets.length} {filteredAssets.length === 1 ? 'asset' : 'assets'}
          </p>
        </div>
        <Button onClick={onCreateAsset} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Asset
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="border rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">Total Value</p>
          <p className="text-lg font-bold">${stats.total.toLocaleString()}</p>
        </div>
        <div className="border rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Home className="h-3 w-3 text-orange-600" />
            <p className="text-xs text-muted-foreground">Real Estate</p>
          </div>
          <p className="text-lg font-bold">{stats.realEstate}</p>
        </div>
        <div className="border rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Car className="h-3 w-3 text-cyan-600" />
            <p className="text-xs text-muted-foreground">Vehicles</p>
          </div>
          <p className="text-lg font-bold">{stats.vehicles}</p>
        </div>
        <div className="border rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Package className="h-3 w-3 text-yellow-600" />
            <p className="text-xs text-muted-foreground">Other</p>
          </div>
          <p className="text-lg font-bold">{stats.other}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Type Filter */}
        <Select value={filter} onValueChange={(value) => setFilter(value as AssetFilter)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Asset Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="REAL_ESTATE">Real Estate</SelectItem>
            <SelectItem value="VEHICLE">Vehicles</SelectItem>
            <SelectItem value="OTHER_ASSET">Other Assets</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'value' | 'name' | 'date')}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="value">Sort by Value</SelectItem>
            <SelectItem value="name">Sort by Name</SelectItem>
            <SelectItem value="date">Sort by Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Asset Grid */}
      {filteredAssets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onEdit={onEditAsset}
              onDelete={onDeleteAsset}
              onView={onViewAsset}
            />
          ))}
        </div>
      ) : (
        <div className="border border-dashed rounded-lg p-12 text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No assets found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery
              ? 'Try adjusting your search or filters'
              : 'Add your first asset to start tracking its value'}
          </p>
          <Button onClick={onCreateAsset} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Asset
          </Button>
        </div>
      )}
    </div>
  );
}
