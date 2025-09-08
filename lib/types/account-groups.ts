// Account Groups Types based on API documentation

export interface AccountGroup {
  id: string;                    // Unique identifier (cuid)
  userId: string;                // Owner's user ID
  name: string;                  // Group name (1-100 chars)
  description?: string | null;   // Optional description (max 500 chars)
  icon?: string | null;          // Optional icon/emoji (max 50 chars)
  color?: string | null;         // Optional hex color (#RRGGBB or #RGB)
  sortOrder: number;             // Display sort order (>= 0)
  parentId?: string | null;      // Parent group ID for hierarchy
  isDefault: boolean;            // System default group flag
  createdAt: string;             // ISO 8601 timestamp
  updatedAt: string;             // ISO 8601 timestamp
  
  // Optional relations (included based on query params)
  financialAccounts?: FinancialAccount[];
  cryptoWallets?: CryptoWallet[];
  children?: AccountGroup[];
  _count?: {
    financialAccounts: number;
    cryptoWallets: number;
    children: number;
  };
}

// Request Types
export interface CreateAccountGroupRequest {
  name: string;                  // Required: 1-100 characters
  description?: string;          // Optional: max 500 characters
  icon?: string;                 // Optional: max 50 characters
  color?: string;                // Optional: hex format (#RRGGBB or #RGB)
  parentId?: string;             // Optional: parent group cuid
}

export interface UpdateAccountGroupRequest {
  name?: string;                 // Optional: 1-100 characters
  description?: string | null;   // Optional: max 500 chars, null to clear
  icon?: string | null;          // Optional: max 50 chars, null to clear
  color?: string | null;         // Optional: hex format, null to clear
  parentId?: string | null;      // Optional: parent ID, null to make top-level
  sortOrder?: number;            // Optional: >= 0
}

export interface MoveAccountRequest {
  accountId: string;             // Required: account cuid to move
  groupId: string | null;        // Required: target group ID or null to ungroup
  accountType: 'financial' | 'crypto'; // Required: account type
}

// Related Entity Types (basic definitions for grouping)
export interface FinancialAccount {
  id: string;
  userId: string;
  name: string;
  type: 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD' | 'INVESTMENT' | 'LOAN' | 'MORTGAGE' | 'CRYPTO';
  institutionName?: string | null;
  accountNumber?: string | null;
  routingNumber?: string | null;
  balance: number;               // Decimal as number
  currency: string;              // ISO currency code
  isActive: boolean;
  plaidAccountId?: string | null;
  plaidItemId?: string | null;
  groupId?: string | null;       // Associated group ID
  createdAt: string;
  updatedAt: string;
}

export interface CryptoWallet {
  id: string;
  userId: string;
  name: string;
  address: string;
  type: 'HOT_WALLET' | 'COLD_WALLET' | 'EXCHANGE' | 'MULTI_SIG' | 'SMART_CONTRACT';
  network: 'ETHEREUM' | 'POLYGON' | 'BSC' | 'ARBITRUM' | 'OPTIMISM' | 'AVALANCHE' | 'SOLANA' | 'BITCOIN' | 'BASE' | 'FANTOM';
  isActive: boolean;
  isWatching: boolean;
  label?: string | null;
  notes?: string | null;
  tags: string[];
  groupId?: string | null;       // Associated group ID
  totalBalance: number;          // Decimal as number
  totalBalanceUsd: number;       // Decimal as number
  assetCount: number;
  nftCount: number;
  createdAt: string;
  updatedAt: string;
}

// Query options
export interface AccountGroupsQueryOptions {
  details?: boolean;             // Include accounts and children
  includeAccounts?: boolean;     // Include financial accounts
  includeWallets?: boolean;      // Include crypto wallets
  includeChildren?: boolean;     // Include child groups
  includeCounts?: boolean;       // Include _count statistics
}

// Hierarchical structure for tree display
export interface AccountGroupHierarchy extends AccountGroup {
  children: AccountGroupHierarchy[];
}