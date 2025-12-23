import { ReactNode } from 'react';
import type { AccountCategory } from '@/lib/types';
import {
  CategoryCashIcon,
  CategoryCreditCardIcon,
  CategoryCryptoIcon,
  CategoryInvestmentsIcon,
  CategoryLiabilityIcon,
  CategoryLoanIcon,
  CategoryMortgageIcon,
  CategoryOtherAssetsIcon,
  CategoryRealEstateIcon,
  CategoryValuablesIcon,
  CategoryVehicleIcon,
} from '@/components/icons/icons';

export interface CategoryConfig {
  label: string;
  icon: ReactNode;
}

export const accountCategoryConfig: Record<AccountCategory | string, CategoryConfig> = {
  // Assets
  CASH: { label: 'Cash', icon: <CategoryCashIcon className="h-6 w-6" /> },
  INVESTMENTS: { label: 'Investments', icon: <CategoryInvestmentsIcon className="h-6 w-6" /> },
  REAL_ESTATE: { label: 'Real Estate', icon: <CategoryRealEstateIcon className="h-6 w-6" /> },
  VEHICLE: { label: 'Vehicles', icon: <CategoryVehicleIcon className="h-6 w-6" /> },
  VALUABLES: { label: 'Valuables', icon: <CategoryValuablesIcon className="h-6 w-6" /> },
  CRYPTO: { label: 'Crypto', icon: <CategoryCryptoIcon className="h-7 w-7" /> },
  OTHER_ASSET: { label: 'Other Assets', icon: <CategoryOtherAssetsIcon className="h-6 w-6" /> },

  // Liabilities
  CREDIT_CARD: { label: 'Credit Cards', icon: <CategoryCreditCardIcon className="h-6 w-6" /> },
  MORTGAGE: { label: 'Mortgages', icon: <CategoryMortgageIcon className="h-6 w-6" /> },
  LOAN: { label: 'Loans', icon: <CategoryLoanIcon className="h-6 w-6" /> },
  OTHER_LIABILITY: { label: 'Other Liabilities', icon: <CategoryLiabilityIcon className="h-6 w-6" /> },

  // Legacy/Fallback
  CREDIT: { label: 'Credit Cards', icon: <CategoryCreditCardIcon className="h-6 w-6" /> },
  ASSETS: { label: 'Assets', icon: <CategoryCashIcon className="h-6 w-6" /> },
  LIABILITIES: { label: 'Liabilities', icon: <CategoryLiabilityIcon className="h-6 w-6" /> },
  OTHER: { label: 'Other Accounts', icon: <CategoryOtherAssetsIcon className="h-6 w-6" /> },
};

export interface AccountCategoryIconProps {
  category: AccountCategory | string;
  className?: string;
}

export function AccountCategoryIcon({ category, className }: AccountCategoryIconProps) {
  const config = accountCategoryConfig[category] || accountCategoryConfig.OTHER;

  if (className) {
    return <div className={className}>{config.icon}</div>;
  }

  return config.icon;
}

export function getAccountCategoryConfig(category: AccountCategory | string): CategoryConfig {
  return accountCategoryConfig[category] || accountCategoryConfig.OTHER;
}
