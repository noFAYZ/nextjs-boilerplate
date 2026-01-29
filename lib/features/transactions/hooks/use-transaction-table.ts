'use client';

/**
 * useTransactionTable Hook
 *
 * Encapsulates all transaction table business logic:
 * - Filtering (search, type, status, source)
 * - Sorting (date, amount)
 * - Pagination
 * - Data transformations
 * - Mutations (inline editing with optimistic updates)
 * - Modal state management
 *
 * PERFORMANCE OPTIMIZATIONS:
 * - useMemo: Filtering, grouping, pagination computations are memoized to avoid recalculation
 * - useCallback: Event handlers are memoized to maintain referential equality for child components
 * - TanStack Query: All server state queries use built-in caching with strategic staleTime
 * - Optimistic Updates: Mutations update UI immediately, rollback on error via queryClient
 * - Custom Hooks: Separated data fetching from business logic for testability
 *
 * MEMOIZATION STRATEGY:
 * 1. useMemo for expensive computations:
 *    - filteredTransactions: O(n) filtering + sorting operation
 *    - groupedTransactions: Grouping by date (used by table for rendering)
 *    - paginatedTransactions: Slice operation (fast but memoized for reference stability)
 *    - accountsList/merchantsList/categoriesList: Transform API responses for comboboxes
 *
 * 2. useCallback for event handlers:
 *    - All callbacks are memoized to prevent child component re-renders
 *    - Handlers passed to TransactionTable won't change unless their dependencies change
 *
 * 3. Child Component Memoization (via React.memo):
 *    - TransactionTable: Wrapped in memo to prevent re-renders
 *    - TransactionTableRow: Wrapped in memo with custom equality check
 *    - MerchantCell: Wrapped in memo for cell-level optimization
 *
 * MUTATION OPTIMIZATION:
 * - useUpdateTransaction uses optimistic updates pattern:
 *   1. Cancel outgoing queries
 *   2. Snapshot previous state
 *   3. Optimistically update UI immediately
 *   4. Rollback on error
 *   5. Refetch on success (background)
 *
 * FUTURE OPTIMIZATION OPPORTUNITIES:
 * 1. Virtualization: Use react-window for tables with 1000+ transactions
 * 2. Prefetching: useEffect to prefetch next page before user navigates
 * 3. Worker Threads: Move sorting/filtering to Web Worker for large datasets
 * 4. Cache Strategies: Adjust staleTime based on data freshness requirements
 * 5. Selective Invalidation: Only invalidate affected cache keys on mutation
 */

import { useState, useMemo, useCallback } from 'react';
import { ITEMS_PER_PAGE } from '@/lib/constants/transaction-constants';
import { groupTransactionsByDate } from '@/lib/utils/transaction-helpers';
import {
  useAllAccounts,
  useMerchants,
  useTransactionCategories,
  useUpdateTransaction,
} from '@/lib/queries';
import type { UnifiedTransaction, SortOption } from '@/lib/types';
import { getLogoUrl } from '@/lib/services/logo-service';

/**
 * Options for configuring the useTransactionTable hook
 */
export interface UseTransactionTableOptions {
  /** Array of transactions to manage */
  transactions: UnifiedTransaction[];

  /** Search term for filtering transactions */
  searchTerm?: string;

  /** Filter by transaction type */
  typeFilter?: string;

  /** Filter by transaction status */
  statusFilter?: string;

  /** Filter by transaction source (CRYPTO or BANKING) */
  sourceFilter?: string;

  /** Callback when user clicks on a transaction row */
  onRowClick?: (tx: UnifiedTransaction) => void;
}

/**
 * Return value from useTransactionTable hook
 */
export interface UseTransactionTableReturn {
  // Pagination
  currentPage: number;
  totalPages: number;
  paginatedTransactions: UnifiedTransaction[];
  handlePageChange: (page: number) => void;

  // Sorting
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;

  // Filtering
  filteredTransactions: UnifiedTransaction[];
  groupedTransactions: Record<string, UnifiedTransaction[]>;

  // Data Lists for Comboboxes
  accountsList: Array<{ id: string; name: string; mask?: string; logo?: string }>;
  merchantsList: Array<{ id: string; name: string; logoUrl?: string; website?: string }>;
  categoriesList: Array<{ id: string; displayName: string; emoji?: string; groupName?: string }>;

  // Loading States
  isLoading: boolean;
  accountsLoading: boolean;
  merchantsLoading: boolean;
  categoriesLoading: boolean;
  isUpdatingTransaction: boolean;

  // Mutations
  handleAccountChange: (txId: string, accountId: string) => void;
  handleMerchantChange: (txId: string, merchantId: string) => void;
  handleCategoryChange: (txId: string, categoryId: string) => void;

  // Attachment Modal
  attachmentModalOpen: boolean;
  selectedTransactionForAttachment: UnifiedTransaction | null;
  openAttachmentModal: (tx: UnifiedTransaction) => void;
  closeAttachmentModal: () => void;
}

/**
 * Custom hook for managing transaction table logic
 *
 * Handles all business logic for the transaction data table:
 * - Filtering by search term, type, status, and source
 * - Sorting by date and amount
 * - Pagination with configurable items per page
 * - Data transformations for comboboxes
 * - Transaction mutations (inline editing)
 * - Attachment modal state
 *
 * @param options - Configuration options
 * @returns Object with all table state and handlers
 */
export function useTransactionTable(options: UseTransactionTableOptions): UseTransactionTableReturn {
  const {
    transactions,
    searchTerm = '',
    typeFilter = 'all',
    statusFilter = 'all',
    sourceFilter = 'all',
    onRowClick,
  } = options;

  // ============================================
  // Local State Management
  // ============================================

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
  const [selectedTransactionForAttachment, setSelectedTransactionForAttachment] =
    useState<UnifiedTransaction | null>(null);

  // ============================================
  // Server Data Queries
  // ============================================

  const { data: accountsResponse, isLoading: accountsLoading } = useAllAccounts();
  const { data: merchantsResponse, isLoading: merchantsLoading } = useMerchants({ limit: 1000 });
  const { data: categoriesResponse, isLoading: categoriesLoading } = useTransactionCategories();
  const { mutate: updateTransaction, isPending: isUpdatingTransaction } = useUpdateTransaction();

  // ============================================
  // Filtering Logic
  // ============================================

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (tx) =>
          tx.description.toLowerCase().includes(term) ||
          tx.account?.name.toLowerCase().includes(term) ||
          tx.hash?.toLowerCase().includes(term) ||
          tx.merchant?.displayName?.toLowerCase().includes(term)
      );
    }

    // Apply type filter
    if (typeFilter && typeFilter !== 'all') {
      filtered = filtered.filter((tx) => tx.type === typeFilter);
    }

    // Apply status filter
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter((tx) => tx.status === statusFilter);
    }

    // Apply source filter
    if (sourceFilter && sourceFilter !== 'all') {
      filtered = filtered.filter((tx) => tx.source === sourceFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'date-asc':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'amount-desc':
          return Math.abs(b.amount) - Math.abs(a.amount);
        case 'amount-asc':
          return Math.abs(a.amount) - Math.abs(b.amount);
        default:
          return 0;
      }
    });

    return filtered;
  }, [transactions, searchTerm, typeFilter, statusFilter, sourceFilter, sortBy]);

  // ============================================
  // Data Transformations for Comboboxes
  // ============================================

  /**
   * Helper to get institution logo URL
   */
  const getInstitutionLogo = useCallback((url?: string): string | undefined => {
    if (!url) return undefined;
    try {
      return getLogoUrl(url) || undefined;
    } catch (error) {
      console.warn('Failed to get institution logo:', error);
      return undefined;
    }
  }, []);

  /**
   * Transform accounts for combobox
   */
  const accountsList = useMemo(() => {
    if (!accountsResponse?.groups) return [];

    const allAccounts: Array<{ id: string; name: string; mask?: string; logo?: string }> = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.values(accountsResponse.groups).forEach((group: any) => {
      if (group.accounts && Array.isArray(group.accounts)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        group.accounts.forEach((account: any) => {
          allAccounts.push({
            id: account.id,
            name: account.name,
            mask: account.mask || '',
            logo: getInstitutionLogo(account?.institutionUrl),
          });
        });
      }
    });
    return allAccounts;
  }, [accountsResponse, getInstitutionLogo]);

  /**
   * Transform merchants for combobox
   */
  const merchantsList = useMemo(() => {
    if (!merchantsResponse) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return merchantsResponse.map((merchant: any) => ({
      id: merchant.id,
      name: merchant.name,
      logoUrl: merchant.logo,
      website: merchant.website,
    }));
  }, [merchantsResponse]);

  /**
   * Transform categories for combobox
   */
  const categoriesList = useMemo(() => {
    if (!categoriesResponse?.groups) return [];

    const allCategories: Array<{
      id: string;
      displayName: string;
      emoji?: string;
      groupName?: string;
    }> = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    categoriesResponse.groups.forEach((group: any) => {
      if (group.categories && Array.isArray(group.categories)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        group.categories.forEach((category: any) => {
          allCategories.push({
            id: category.id,
            displayName: category.displayName,
            emoji: category.emoji,
            groupName: group.groupName,
          });
        });
      }
    });
    return allCategories;
  }, [categoriesResponse]);

  // ============================================
  // Grouping and Pagination
  // ============================================

  /**
   * Group transactions by date
   */
  const groupedTransactions = useMemo(
    () => groupTransactionsByDate(filteredTransactions),
    [filteredTransactions]
  );

  /**
   * Pagination calculations
   */
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = useMemo(
    () =>
      filteredTransactions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      ),
    [filteredTransactions, currentPage]
  );

  // ============================================
  // Event Handlers
  // ============================================

  /**
   * Handle pagination page change
   */
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
  }, [totalPages]);

  /**
   * Handle account change (optimistic update handled in mutation)
   */
  const handleAccountChange = useCallback(
    (transactionId: string, newAccountId: string) => {
      updateTransaction({
        id: transactionId,
        data: { accountId: newAccountId },
      });
    },
    [updateTransaction]
  );

  /**
   * Handle merchant change (optimistic update handled in mutation)
   */
  const handleMerchantChange = useCallback(
    (transactionId: string, newMerchantId: string) => {
      updateTransaction({
        id: transactionId,
        data: { merchantId: newMerchantId },
      });
    },
    [updateTransaction]
  );

  /**
   * Handle category change (optimistic update handled in mutation)
   */
  const handleCategoryChange = useCallback(
    (transactionId: string, newCategoryId: string) => {
      updateTransaction({
        id: transactionId,
        data: { categoryId: newCategoryId },
      });
    },
    [updateTransaction]
  );

  /**
   * Open attachment modal for a transaction
   */
  const openAttachmentModal = useCallback((tx: UnifiedTransaction) => {
    setSelectedTransactionForAttachment(tx);
    setAttachmentModalOpen(true);
  }, []);

  /**
   * Close attachment modal
   */
  const closeAttachmentModal = useCallback(() => {
    setAttachmentModalOpen(false);
    setSelectedTransactionForAttachment(null);
  }, []);

  // ============================================
  // Return Hook Value
  // ============================================

  return {
    // Pagination
    currentPage,
    totalPages,
    paginatedTransactions,
    handlePageChange,

    // Sorting
    sortBy,
    setSortBy,

    // Filtering
    filteredTransactions,
    groupedTransactions,

    // Data Lists
    accountsList,
    merchantsList,
    categoriesList,

    // Loading States
    isLoading: accountsLoading || merchantsLoading || categoriesLoading,
    accountsLoading,
    merchantsLoading,
    categoriesLoading,
    isUpdatingTransaction,

    // Mutations
    handleAccountChange,
    handleMerchantChange,
    handleCategoryChange,

    // Attachment Modal
    attachmentModalOpen,
    selectedTransactionForAttachment,
    openAttachmentModal,
    closeAttachmentModal,
  };
}
