/**
 * Blockchain Explorer URL Utilities
 * Centralized blockchain explorer link generation
 */

export type BlockchainNetwork =
  | 'ETHEREUM'
  | 'POLYGON'
  | 'BSC'
  | 'ARBITRUM'
  | 'OPTIMISM'
  | 'AVALANCHE'
  | 'SOLANA'
  | 'BASE'
  | 'FANTOM'
  | 'GNOSIS';

export type ExplorerType = 'address' | 'tx' | 'token' | 'block';

interface ExplorerConfig {
  baseUrl: string;
  paths: {
    address: string;
    tx: string;
    token: string;
    block: string;
  };
}

const EXPLORER_CONFIGS: Record<BlockchainNetwork, ExplorerConfig> = {
  ETHEREUM: {
    baseUrl: 'https://etherscan.io',
    paths: {
      address: '/address/',
      tx: '/tx/',
      token: '/token/',
      block: '/block/',
    },
  },
  POLYGON: {
    baseUrl: 'https://polygonscan.com',
    paths: {
      address: '/address/',
      tx: '/tx/',
      token: '/token/',
      block: '/block/',
    },
  },
  BSC: {
    baseUrl: 'https://bscscan.com',
    paths: {
      address: '/address/',
      tx: '/tx/',
      token: '/token/',
      block: '/block/',
    },
  },
  ARBITRUM: {
    baseUrl: 'https://arbiscan.io',
    paths: {
      address: '/address/',
      tx: '/tx/',
      token: '/token/',
      block: '/block/',
    },
  },
  OPTIMISM: {
    baseUrl: 'https://optimistic.etherscan.io',
    paths: {
      address: '/address/',
      tx: '/tx/',
      token: '/token/',
      block: '/block/',
    },
  },
  AVALANCHE: {
    baseUrl: 'https://snowtrace.io',
    paths: {
      address: '/address/',
      tx: '/tx/',
      token: '/token/',
      block: '/block/',
    },
  },
  SOLANA: {
    baseUrl: 'https://explorer.solana.com',
    paths: {
      address: '/address/',
      tx: '/tx/',
      token: '/token/',
      block: '/block/',
    },
  },
  BASE: {
    baseUrl: 'https://basescan.org',
    paths: {
      address: '/address/',
      tx: '/tx/',
      token: '/token/',
      block: '/block/',
    },
  },
  FANTOM: {
    baseUrl: 'https://ftmscan.com',
    paths: {
      address: '/address/',
      tx: '/tx/',
      token: '/token/',
      block: '/block/',
    },
  },
  GNOSIS: {
    baseUrl: 'https://gnosisscan.io',
    paths: {
      address: '/address/',
      tx: '/tx/',
      token: '/token/',
      block: '/block/',
    },
  },
};

/**
 * Get blockchain explorer URL for an address
 */
export function getExplorerUrl(
  network: string,
  identifier: string,
  type: ExplorerType = 'address'
): string {
  const networkKey = network.toUpperCase() as BlockchainNetwork;
  const config = EXPLORER_CONFIGS[networkKey];

  if (!config) {
    console.warn(`Unknown network: ${network}`);
    return '#';
  }

  return `${config.baseUrl}${config.paths[type]}${identifier}`;
}

/**
 * Get address explorer URL (most common use case)
 */
export function getAddressExplorerUrl(network: string, address: string): string {
  return getExplorerUrl(network, address, 'address');
}

/**
 * Get transaction explorer URL
 */
export function getTransactionExplorerUrl(network: string, txHash: string): string {
  return getExplorerUrl(network, txHash, 'tx');
}

/**
 * Get token explorer URL
 */
export function getTokenExplorerUrl(network: string, tokenAddress: string): string {
  return getExplorerUrl(network, tokenAddress, 'token');
}

/**
 * Get block explorer URL
 */
export function getBlockExplorerUrl(network: string, blockNumber: string): string {
  return getExplorerUrl(network, blockNumber, 'block');
}

/**
 * Check if network has explorer support
 */
export function hasExplorerSupport(network: string): boolean {
  const networkKey = network.toUpperCase() as BlockchainNetwork;
  return networkKey in EXPLORER_CONFIGS;
}

/**
 * Get explorer base URL for network
 */
export function getExplorerBaseUrl(network: string): string {
  const networkKey = network.toUpperCase() as BlockchainNetwork;
  const config = EXPLORER_CONFIGS[networkKey];
  return config?.baseUrl || '';
}

/**
 * Get all supported networks
 */
export function getSupportedNetworks(): BlockchainNetwork[] {
  return Object.keys(EXPLORER_CONFIGS) as BlockchainNetwork[];
}
