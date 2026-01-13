'use client';

/**
 * Merchant Cell Component
 *
 * Wraps MerchantCombobox for inline merchant selection in the transaction table
 */

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

export function MerchantCell({
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
}
