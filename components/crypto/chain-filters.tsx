'use client'

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { cn } from '@/lib/utils';
import { ZERION_CHAINS } from '@/lib/constants/chains';
import { MageDashboard, RivetIconsCheckAll } from '../icons/icons';

interface ChainConfig {
  name: string;
  icon?: string;
  id: string;
}

// Create a map of chain configs from ZERION_CHAINS for easy lookup
const CHAIN_CONFIGS = (() => {
  const configs: Record<string, ChainConfig> = {};

  ZERION_CHAINS.forEach(chain => {
    // Map some chain IDs to match the portfolio value keys
    let key = chain.id;
    if (chain.id === 'binance-smart-chain') key = 'bsc';

    configs[key] = {
      name: chain.attributes.name,
      icon: chain.attributes.icon?.url,
      id: chain.id,
    };
  });

  return configs;
})();

interface ChainFiltersProps {
  portfolio: {
    arbitrumValue?: number;
    avalancheValue?: number;
    baseValue?: number;
    bscValue?: number;
    celoValue?: number;
    ethereumValue?: number;
    fantomValue?: number;
    lineaValue?: number;
    polygonValue?: number;
    [key: string]: number | string | Date | null | undefined;
  };
  selectedChain: string | null;
  onChainSelect: (chain: string | null) => void;
  isLoading?: boolean;
}

export function ChainFilters({
  portfolio,
  selectedChain,
  onChainSelect,
  isLoading = false
}: ChainFiltersProps) {
  // Extract chain values from portfolio
  const chainData = React.useMemo(() => {
    if (!portfolio) return [];

    const chains = Object.entries(CHAIN_CONFIGS).map(([key, config]) => {
      const valueKey = `${key}Value`;
      const value = portfolio[valueKey] || 0;

      return {
        key,
        name: config.name,
        icon: config.icon,
        value,
      };
    }).filter(chain => chain.value > 0); // Only show chains with value

    // Sort by value descending
    return chains.sort((a, b) => b.value - a.value);
  }, [portfolio]);

  // Calculate total value for "All Chains"
  const totalValue = React.useMemo(() => {
    return chainData.reduce((sum, chain) => sum + chain.value, 0);
  }, [chainData]);

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2 ">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-12 w-32 bg-muted animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (chainData.length === 0) {
    return null; // Don't show if no chains have value
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('ChainFilters render:', {
      selectedChain,
      chainCount: chainData.length,
      availableChains: chainData.map(c => c.key),
      portfolio: Object.keys(portfolio).filter(k => k.endsWith('Value'))
    });
  }

  return (
    <div className="">
      <div className="flex flex-wrap gap-2">
        {/* All Chains Button */}
        <Button
           variant={selectedChain === null ? "secondary" : "outline"}
          size="xs"
          onClick={() => {
    
            onChainSelect(null);
          }}
          className={cn(
            "px-2 h-8 flex items-center gap-2 duration-0 ",
      
          )}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6  flex items-center justify-center text-xs font-bold">
              <MageDashboard className='w-5 h-5'/>
            </div>
            <div className="text-left">
    
              <div className="text-[10px] ">
                <CurrencyDisplay
                  amountUSD={totalValue}
                  variant="small"
                  className="text-xs"
                />
              </div>
            </div>
          </div>
        </Button>

        {/* Individual Chain Buttons */}
        {chainData.map((chain) => (
          <Button
            key={chain.key}
            variant={selectedChain === chain.key ? "secondary" : "outline"}
            size="xs"
            onClick={() => {
              console.log('🔵 Chain selected:', chain.key, chain.name);
              onChainSelect(chain.key);
            }}
            className={cn(
              "px-2 h-8 flex items-center gap-2 duration-0",
           
            )}
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center">
                {chain.icon ? (
                  <Image
                    src={chain.icon}
                    alt={chain.name}
                    width={20}
                    height={20}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {chain.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="text-left">
               {/*  <div className="text-xs font-medium">{chain.name}</div> */}
                <div className="text-[10px] ">
                  <CurrencyDisplay
                    amountUSD={chain.value}
                    variant="small"
                    className="text-xs"
                  />
                </div>
              </div>
            </div>
       
          </Button>
        ))}
      </div>

      {/* Selected Chain Info
      {selectedChain ? (
        <div className="mt-3 text-sm text-muted-foreground">
          Showing data for <strong>{chainData.find(c => c.key === selectedChain)?.name}</strong> only
        </div>
      ) : (
        <div className="mt-3 text-sm text-muted-foreground">
          Showing data for <strong>All Chains</strong>
        </div>
      )} */}
    </div>
  );
}