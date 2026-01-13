'use client';

/**
 * Merchant Cell Component
 *
 * Wraps MerchantCombobox for inline merchant selection in the transaction table
 * Memoized to prevent unnecessary re-renders when parent updates but merchant data unchanged
 */

import { memo } from 'react';
import { MerchantCombobox } from '@/components/ui/merchant-combobox';
import { getTypeIcon } from '@/lib/utils/transaction-display-helpers';

interface MerchantCellProps {
  merchantId?: string;
  merchantName: string;
  merchantLogo?: string;
  merchants: Array<{ id: string; name: string; logoUrl?: string; website?: string }>;
  onMerchantChange: (id: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  transactionType: string;
}

/**
 * Memoized to prevent re-renders when parent component updates
 * Props are compared by shallow equality (sufficient for this component)
 */
export const MerchantCell = memo(
  function MerchantCell({
    merchantId,
    merchantName,
    merchantLogo,
    merchants,
    onMerchantChange,
    isLoading = false,
    disabled = false,
    transactionType,
  }: MerchantCellProps) {
    return (
      <MerchantCombobox
        merchantId={merchantId}
        merchantName={merchantName}
        merchantLogo={merchantLogo}
        merchants={merchants}
        onMerchantChange={onMerchantChange}
        isLoading={isLoading}
        disabled={disabled}
        typeIcon={getTypeIcon(transactionType)}
      />
    );
  },
  (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    // Return false if props changed (do re-render)
    return (
      prevProps.merchantId === nextProps.merchantId &&
      prevProps.merchantName === nextProps.merchantName &&
      prevProps.merchantLogo === nextProps.merchantLogo &&
      prevProps.merchants.length === nextProps.merchants.length &&
      prevProps.onMerchantChange === nextProps.onMerchantChange &&
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.disabled === nextProps.disabled &&
      prevProps.transactionType === nextProps.transactionType
    );
  }
);
