/**
 * Portfolio Helper Utilities
 * Centralized utilities for portfolio calculations and operations
 */

import { getTopN, mapFields, sumBy } from '../arrays/array-helpers';

export interface Asset {
  symbol: string;
  name: string;
  change24h?: number;
  balanceUsd?: number;
  logoUrl?: string;
  [key: string]: unknown;
}

export interface NetworkDistribution {
  network: string;
  valueUsd: number;
  percentage: number;
  assetCount?: number;
  [key: string]: unknown;
}

export interface PortfolioAsset {
  symbol: string;
  name: string;
  change24h: number;
  balanceUsd: number;
  logoUrl?: string;
}

export interface NetworkSummary {
  network: string;
  valueUsd: number;
  percentage: number;
  assetCount: number;
}

/**
 * Get top performing assets by 24h change
 */
export function getTopPerformingAssets(
  assets: Asset[],
  count: number = 5
): PortfolioAsset[] {
  if (!assets || assets.length === 0) return [];

  const topAssets = getTopN(
    assets,
    count,
    (asset) => asset.change24h || 0,
    true
  );

  return mapFields(topAssets, (asset) => ({
    symbol: asset.symbol,
    name: asset.name,
    change24h: asset.change24h || 0,
    balanceUsd: asset.balanceUsd || 0,
    logoUrl: asset.logoUrl,
  }));
}

/**
 * Get top losing assets by 24h change
 */
export function getTopLosingAssets(
  assets: Asset[],
  count: number = 5
): PortfolioAsset[] {
  if (!assets || assets.length === 0) return [];

  const topLosers = getTopN(
    assets,
    count,
    (asset) => asset.change24h || 0,
    false
  );

  return mapFields(topLosers, (asset) => ({
    symbol: asset.symbol,
    name: asset.name,
    change24h: asset.change24h || 0,
    balanceUsd: asset.balanceUsd || 0,
    logoUrl: asset.logoUrl,
  }));
}

/**
 * Get top networks by value
 */
export function getTopNetworks(
  networks: NetworkDistribution[],
  count: number = 5
): NetworkSummary[] {
  if (!networks || networks.length === 0) return [];

  return networks.slice(0, count).map((network) => ({
    network: network.network,
    valueUsd: network.valueUsd,
    percentage: network.percentage,
    assetCount: network.assetCount || 0,
  }));
}

/**
 * Calculate total portfolio value
 */
export function calculatePortfolioValue(assets: Asset[]): number {
  return sumBy(assets, (asset) => asset.balanceUsd || 0);
}

/**
 * Calculate portfolio change percentage
 */
export function calculatePortfolioChange(
  currentValue: number,
  previousValue: number
): { change: number; changePct: number } {
  const change = currentValue - previousValue;
  const changePct = previousValue !== 0 ? (change / previousValue) * 100 : 0;

  return {
    change,
    changePct,
  };
}

/**
 * Get asset allocation percentages
 */
export function calculateAssetAllocation(
  assets: Asset[],
  totalValue?: number
): Array<Asset & { allocationPct: number }> {
  const total = totalValue || calculatePortfolioValue(assets);

  if (total === 0) {
    return assets.map((asset) => ({ ...asset, allocationPct: 0 }));
  }

  return assets.map((asset) => ({
    ...asset,
    allocationPct: ((asset.balanceUsd || 0) / total) * 100,
  }));
}

/**
 * Filter assets by minimum value threshold
 */
export function filterDustAssets(
  assets: Asset[],
  minValue: number = 1
): Asset[] {
  return assets.filter((asset) => (asset.balanceUsd || 0) >= minValue);
}

/**
 * Sort assets by value
 */
export function sortAssetsByValue(
  assets: Asset[],
  descending: boolean = true
): Asset[] {
  return [...assets].sort((a, b) => {
    const comparison = (b.balanceUsd || 0) - (a.balanceUsd || 0);
    return descending ? comparison : -comparison;
  });
}

/**
 * Group assets by network
 */
export function groupAssetsByNetwork(assets: Asset[]): Record<string, Asset[]> {
  return assets.reduce((groups, asset) => {
    const network = (asset.network as string) || 'Unknown';
    if (!groups[network]) {
      groups[network] = [];
    }
    groups[network].push(asset);
    return groups;
  }, {} as Record<string, Asset[]>);
}

/**
 * Calculate portfolio diversity score (0-100)
 * Higher score = more diversified
 */
export function calculateDiversityScore(assets: Asset[]): number {
  if (assets.length === 0) return 0;
  if (assets.length === 1) return 0;

  const totalValue = calculatePortfolioValue(assets);
  if (totalValue === 0) return 0;

  // Calculate Herfindahl-Hirschman Index (HHI)
  const hhi = assets.reduce((sum, asset) => {
    const share = (asset.balanceUsd || 0) / totalValue;
    return sum + share * share;
  }, 0);

  // Convert HHI to diversity score (inverse and normalize to 0-100)
  // HHI ranges from 1/n to 1, where n is number of assets
  const minHHI = 1 / assets.length;
  const diversityScore = ((1 - hhi) / (1 - minHHI)) * 100;

  return Math.round(Math.max(0, Math.min(100, diversityScore)));
}
