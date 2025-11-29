'use client';

import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AccountType, AccountCategory } from '@/lib/types/banking';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Account type display information
 */
export const ACCOUNT_TYPE_INFO: Record<AccountType, {
  displayName: string;
  icon: string;
  category: AccountCategory;
  description: string;
}> = {
  // CASH ACCOUNTS
  [AccountType.CHECKING]: { displayName: 'Checking Account', icon: '🏦', category: AccountCategory.CASH, description: 'Standard checking account' },
  [AccountType.SAVINGS]: { displayName: 'Savings Account', icon: '💾', category: AccountCategory.CASH, description: 'Regular savings account' },
  [AccountType.HIGH_YIELD_SAVINGS]: { displayName: 'High-Yield Savings', icon: '📈', category: AccountCategory.CASH, description: 'High-interest savings account' },
  [AccountType.MONEY_MARKET]: { displayName: 'Money Market', icon: '💰', category: AccountCategory.CASH, description: 'Money market account' },
  [AccountType.CERTIFICATE_OF_DEPOSIT]: { displayName: 'Certificate of Deposit', icon: '📋', category: AccountCategory.CASH, description: 'CD account' },
  [AccountType.CASH_MANAGEMENT]: { displayName: 'Cash Management', icon: '💳', category: AccountCategory.CASH, description: 'Cash management account' },
  [AccountType.PREPAID_CARD]: { displayName: 'Prepaid Card', icon: '💳', category: AccountCategory.CASH, description: 'Prepaid card account' },
  [AccountType.FOREIGN_CURRENCY_ACCOUNT]: { displayName: 'Foreign Currency', icon: '💱', category: AccountCategory.CASH, description: 'Foreign currency account' },
  [AccountType.DIGITAL_WALLET]: { displayName: 'Digital Wallet', icon: '📱', category: AccountCategory.CASH, description: 'Digital wallet account' },
  [AccountType.MOBILE_WALLET]: { displayName: 'Mobile Wallet', icon: '📱', category: AccountCategory.CASH, description: 'Mobile wallet account' },
  [AccountType.PAYMENT_PROCESSOR_BALANCE]: { displayName: 'Payment Processor', icon: '💰', category: AccountCategory.CASH, description: 'Payment processor balance' },
  [AccountType.CASH_ON_HAND]: { displayName: 'Cash on Hand', icon: '💵', category: AccountCategory.CASH, description: 'Physical cash' },
  [AccountType.PETTY_CASH]: { displayName: 'Petty Cash', icon: '💵', category: AccountCategory.CASH, description: 'Petty cash fund' },
  [AccountType.ESCROW_ACCOUNT]: { displayName: 'Escrow Account', icon: '🔒', category: AccountCategory.CASH, description: 'Escrow account' },

  // INVESTMENT ACCOUNTS
  [AccountType.BROKERAGE_ACCOUNT]: { displayName: 'Brokerage Account', icon: '📊', category: AccountCategory.INVESTMENTS, description: 'Stock brokerage account' },
  [AccountType.RETIREMENT_401K]: { displayName: '401(k) Plan', icon: '🏛️', category: AccountCategory.INVESTMENTS, description: '401(k) retirement plan' },
  [AccountType.RETIREMENT_403B]: { displayName: '403(b) Plan', icon: '🏛️', category: AccountCategory.INVESTMENTS, description: '403(b) retirement plan' },
  [AccountType.RETIREMENT_457B]: { displayName: '457(b) Plan', icon: '🏛️', category: AccountCategory.INVESTMENTS, description: '457(b) retirement plan' },
  [AccountType.RETIREMENT_IRA_TRADITIONAL]: { displayName: 'Traditional IRA', icon: '🏦', category: AccountCategory.INVESTMENTS, description: 'Traditional IRA account' },
  [AccountType.RETIREMENT_IRA_ROTH]: { displayName: 'Roth IRA', icon: '🏦', category: AccountCategory.INVESTMENTS, description: 'Roth IRA account' },
  [AccountType.RETIREMENT_IRA_SEP]: { displayName: 'SEP IRA', icon: '🏦', category: AccountCategory.INVESTMENTS, description: 'SEP IRA account' },
  [AccountType.RETIREMENT_IRA_SIMPLE]: { displayName: 'SIMPLE IRA', icon: '🏦', category: AccountCategory.INVESTMENTS, description: 'SIMPLE IRA account' },
  [AccountType.PENSION]: { displayName: 'Pension', icon: '🏛️', category: AccountCategory.INVESTMENTS, description: 'Pension plan' },
  [AccountType.ANNUITY]: { displayName: 'Annuity', icon: '📊', category: AccountCategory.INVESTMENTS, description: 'Annuity account' },
  [AccountType.EDUCATION_529_PLAN]: { displayName: '529 Education Plan', icon: '🎓', category: AccountCategory.INVESTMENTS, description: '529 college savings plan' },
  [AccountType.MUTUAL_FUNDS]: { displayName: 'Mutual Funds', icon: '📊', category: AccountCategory.INVESTMENTS, description: 'Mutual fund account' },
  [AccountType.ETF]: { displayName: 'ETF', icon: '📈', category: AccountCategory.INVESTMENTS, description: 'Exchange-traded fund' },
  [AccountType.STOCKS]: { displayName: 'Stocks', icon: '📈', category: AccountCategory.INVESTMENTS, description: 'Individual stocks' },
  [AccountType.BONDS]: { displayName: 'Bonds', icon: '📋', category: AccountCategory.INVESTMENTS, description: 'Bond investments' },
  [AccountType.TREASURY_SECURITIES]: { displayName: 'Treasury Securities', icon: '📋', category: AccountCategory.INVESTMENTS, description: 'Treasury bonds/bills' },
  [AccountType.PRIVATE_EQUITY]: { displayName: 'Private Equity', icon: '🏢', category: AccountCategory.INVESTMENTS, description: 'Private equity investment' },
  [AccountType.HEDGE_FUND]: { displayName: 'Hedge Fund', icon: '📊', category: AccountCategory.INVESTMENTS, description: 'Hedge fund investment' },
  [AccountType.COMMODITIES]: { displayName: 'Commodities', icon: '🌾', category: AccountCategory.INVESTMENTS, description: 'Commodity investments' },
  [AccountType.REITS]: { displayName: 'REITs', icon: '🏢', category: AccountCategory.INVESTMENTS, description: 'Real estate investment trusts' },
  [AccountType.FOREX]: { displayName: 'Foreign Exchange', icon: '💱', category: AccountCategory.INVESTMENTS, description: 'Forex trading' },
  [AccountType.CROWDFUNDING_INVESTMENTS]: { displayName: 'Crowdfunding', icon: '👥', category: AccountCategory.INVESTMENTS, description: 'Crowdfunded investments' },
  [AccountType.STRUCTURED_PRODUCTS]: { displayName: 'Structured Products', icon: '📊', category: AccountCategory.INVESTMENTS, description: 'Structured investment products' },

  // REAL ESTATE
  [AccountType.PRIMARY_RESIDENCE]: { displayName: 'Primary Home', icon: '🏠', category: AccountCategory.REAL_ESTATE, description: 'Primary residence' },
  [AccountType.INVESTMENT_PROPERTY]: { displayName: 'Investment Property', icon: '🏢', category: AccountCategory.REAL_ESTATE, description: 'Investment property' },
  [AccountType.VACATION_HOME]: { displayName: 'Vacation Home', icon: '🏖️', category: AccountCategory.REAL_ESTATE, description: 'Vacation home' },
  [AccountType.RENTAL_PROPERTY]: { displayName: 'Rental Property', icon: '🏢', category: AccountCategory.REAL_ESTATE, description: 'Rental property' },
  [AccountType.TIMESHARE]: { displayName: 'Timeshare', icon: '🏖️', category: AccountCategory.REAL_ESTATE, description: 'Timeshare property' },
  [AccountType.LAND]: { displayName: 'Land', icon: '🌳', category: AccountCategory.REAL_ESTATE, description: 'Land property' },
  [AccountType.COMMERCIAL_PROPERTY]: { displayName: 'Commercial Property', icon: '🏢', category: AccountCategory.REAL_ESTATE, description: 'Commercial property' },
  [AccountType.INDUSTRIAL_PROPERTY]: { displayName: 'Industrial Property', icon: '🏭', category: AccountCategory.REAL_ESTATE, description: 'Industrial property' },
  [AccountType.DEVELOPMENT_LAND]: { displayName: 'Development Land', icon: '🏗️', category: AccountCategory.REAL_ESTATE, description: 'Development land' },

  // VEHICLE
  [AccountType.CAR]: { displayName: 'Car', icon: '🚗', category: AccountCategory.VEHICLE, description: 'Automobile' },
  [AccountType.TRUCK]: { displayName: 'Truck', icon: '🚙', category: AccountCategory.VEHICLE, description: 'Pickup truck' },
  [AccountType.MOTORCYCLE]: { displayName: 'Motorcycle', icon: '🏍️', category: AccountCategory.VEHICLE, description: 'Motorcycle' },
  [AccountType.RV]: { displayName: 'RV', icon: '🚐', category: AccountCategory.VEHICLE, description: 'Recreational vehicle' },
  [AccountType.BOAT]: { displayName: 'Boat', icon: '🚤', category: AccountCategory.VEHICLE, description: 'Boat' },
  [AccountType.AIRCRAFT]: { displayName: 'Aircraft', icon: '✈️', category: AccountCategory.VEHICLE, description: 'Aircraft' },
  [AccountType.BICYCLE]: { displayName: 'Bicycle', icon: '🚲', category: AccountCategory.VEHICLE, description: 'Bicycle' },
  [AccountType.ELECTRIC_VEHICLE]: { displayName: 'Electric Vehicle', icon: '🔋', category: AccountCategory.VEHICLE, description: 'Electric vehicle' },
  [AccountType.LUXURY_VEHICLE]: { displayName: 'Luxury Vehicle', icon: '💎', category: AccountCategory.VEHICLE, description: 'Luxury vehicle' },
  [AccountType.CLASSIC_CAR]: { displayName: 'Classic Car', icon: '🏎️', category: AccountCategory.VEHICLE, description: 'Classic car' },
  [AccountType.COMMERCIAL_VEHICLE]: { displayName: 'Commercial Vehicle', icon: '🚛', category: AccountCategory.VEHICLE, description: 'Commercial vehicle' },
  [AccountType.ATV]: { displayName: 'ATV', icon: '🏍️', category: AccountCategory.VEHICLE, description: 'All-terrain vehicle' },
  [AccountType.SCOOTER]: { displayName: 'Scooter', icon: '🛴', category: AccountCategory.VEHICLE, description: 'Scooter' },

  // VALUABLES
  [AccountType.JEWELRY]: { displayName: 'Jewelry', icon: '💎', category: AccountCategory.VALUABLES, description: 'Jewelry collection' },
  [AccountType.FINE_ART]: { displayName: 'Fine Art', icon: '🎨', category: AccountCategory.VALUABLES, description: 'Fine art collection' },
  [AccountType.COLLECTIBLES]: { displayName: 'Collectibles', icon: '🎁', category: AccountCategory.VALUABLES, description: 'Collectible items' },
  [AccountType.ANTIQUES]: { displayName: 'Antiques', icon: '🏺', category: AccountCategory.VALUABLES, description: 'Antique items' },
  [AccountType.WATCHES]: { displayName: 'Watches', icon: '⌚', category: AccountCategory.VALUABLES, description: 'Watch collection' },
  [AccountType.PRECIOUS_METALS]: { displayName: 'Precious Metals', icon: '💍', category: AccountCategory.VALUABLES, description: 'Precious metals' },
  [AccountType.GEMSTONES]: { displayName: 'Gemstones', icon: '💎', category: AccountCategory.VALUABLES, description: 'Gemstone collection' },
  [AccountType.FIREARMS]: { displayName: 'Firearms', icon: '🔫', category: AccountCategory.VALUABLES, description: 'Firearms collection' },
  [AccountType.MEMORABILIA]: { displayName: 'Memorabilia', icon: '🎬', category: AccountCategory.VALUABLES, description: 'Memorabilia collection' },
  [AccountType.WINE_COLLECTION]: { displayName: 'Wine Collection', icon: '🍷', category: AccountCategory.VALUABLES, description: 'Wine collection' },
  [AccountType.SPORTS_EQUIPMENT]: { displayName: 'Sports Equipment', icon: '⚽', category: AccountCategory.VALUABLES, description: 'Sports equipment' },

  // CRYPTO
  [AccountType.CRYPTO_WALLET_HOT]: { displayName: 'Hot Wallet', icon: '₿', category: AccountCategory.CRYPTO, description: 'Hot storage wallet' },
  [AccountType.CRYPTO_WALLET_COLD]: { displayName: 'Cold Wallet', icon: '🔒', category: AccountCategory.CRYPTO, description: 'Cold storage wallet' },
  [AccountType.CRYPTO_EXCHANGE_ACCOUNT]: { displayName: 'Crypto Exchange', icon: '📈', category: AccountCategory.CRYPTO, description: 'Exchange account' },
  [AccountType.DEFI_PROTOCOL_POSITION]: { displayName: 'DeFi Protocol', icon: '🔗', category: AccountCategory.CRYPTO, description: 'DeFi position' },
  [AccountType.STAKING_ACCOUNT]: { displayName: 'Staking Account', icon: '📦', category: AccountCategory.CRYPTO, description: 'Staking account' },
  [AccountType.MINING_POOL_ACCOUNT]: { displayName: 'Mining Pool', icon: '⛏️', category: AccountCategory.CRYPTO, description: 'Mining pool account' },
  [AccountType.NFT_COLLECTION]: { displayName: 'NFT Collection', icon: '🖼️', category: AccountCategory.CRYPTO, description: 'NFT collection' },
  [AccountType.WRAPPED_ASSET_ACCOUNT]: { displayName: 'Wrapped Assets', icon: '🎁', category: AccountCategory.CRYPTO, description: 'Wrapped asset account' },
  [AccountType.MULTI_SIG_WALLET]: { displayName: 'Multi-Sig Wallet', icon: '🔐', category: AccountCategory.CRYPTO, description: 'Multi-signature wallet' },

  // OTHER ASSETS
  [AccountType.BUSINESS_OWNERSHIP]: { displayName: 'Business Ownership', icon: '🏢', category: AccountCategory.OTHER_ASSET, description: 'Business ownership stake' },
  [AccountType.PARTNERSHIP_INTEREST]: { displayName: 'Partnership Interest', icon: '🤝', category: AccountCategory.OTHER_ASSET, description: 'Partnership interest' },
  [AccountType.STOCK_OPTIONS]: { displayName: 'Stock Options', icon: '📈', category: AccountCategory.OTHER_ASSET, description: 'Stock options' },
  [AccountType.RESTRICTED_STOCK]: { displayName: 'Restricted Stock', icon: '📈', category: AccountCategory.OTHER_ASSET, description: 'Restricted stock' },
  [AccountType.PATENTS_IP]: { displayName: 'Patents & IP', icon: '📜', category: AccountCategory.OTHER_ASSET, description: 'Patents and intellectual property' },
  [AccountType.ACCOUNTS_RECEIVABLE]: { displayName: 'Accounts Receivable', icon: '💰', category: AccountCategory.OTHER_ASSET, description: 'Accounts receivable' },
  [AccountType.NOTES_RECEIVABLE]: { displayName: 'Notes Receivable', icon: '📋', category: AccountCategory.OTHER_ASSET, description: 'Notes receivable' },
  [AccountType.LIFE_INSURANCE_VALUE]: { displayName: 'Life Insurance Value', icon: '🛡️', category: AccountCategory.OTHER_ASSET, description: 'Life insurance cash value' },
  [AccountType.EMPLOYEE_STOCK_PURCHASE]: { displayName: 'ESPP', icon: '📈', category: AccountCategory.OTHER_ASSET, description: 'Employee stock purchase plan' },
  [AccountType.ROYALTY_INTEREST]: { displayName: 'Royalty Interest', icon: '💿', category: AccountCategory.OTHER_ASSET, description: 'Royalty interest' },
  [AccountType.TIMBER_RIGHTS]: { displayName: 'Timber Rights', icon: '🌲', category: AccountCategory.OTHER_ASSET, description: 'Timber rights' },
  [AccountType.MINERAL_RIGHTS]: { displayName: 'Mineral Rights', icon: '⛰️', category: AccountCategory.OTHER_ASSET, description: 'Mineral rights' },

  // CREDIT CARDS
  [AccountType.PERSONAL_CREDIT_CARD]: { displayName: 'Personal Credit Card', icon: '💳', category: AccountCategory.CREDIT_CARD, description: 'Personal credit card' },
  [AccountType.BUSINESS_CREDIT_CARD]: { displayName: 'Business Credit Card', icon: '💼', category: AccountCategory.CREDIT_CARD, description: 'Business credit card' },
  [AccountType.SECURED_CREDIT_CARD]: { displayName: 'Secured Credit Card', icon: '🔒', category: AccountCategory.CREDIT_CARD, description: 'Secured credit card' },
  [AccountType.STORE_CREDIT_CARD]: { displayName: 'Store Credit Card', icon: '🏪', category: AccountCategory.CREDIT_CARD, description: 'Store credit card' },
  [AccountType.GAS_CREDIT_CARD]: { displayName: 'Gas Credit Card', icon: '⛽', category: AccountCategory.CREDIT_CARD, description: 'Gas credit card' },
  [AccountType.CHARGE_CARD]: { displayName: 'Charge Card', icon: '💳', category: AccountCategory.CREDIT_CARD, description: 'Charge card' },
  [AccountType.PREPAID_CREDIT_CARD]: { displayName: 'Prepaid Credit Card', icon: '💳', category: AccountCategory.CREDIT_CARD, description: 'Prepaid credit card' },

  // MORTGAGES
  [AccountType.MORTGAGE_PRIMARY]: { displayName: 'Primary Mortgage', icon: '🏠', category: AccountCategory.MORTGAGE, description: 'Primary home mortgage' },
  [AccountType.MORTGAGE_SECOND_HOME]: { displayName: 'Second Home Mortgage', icon: '🏖️', category: AccountCategory.MORTGAGE, description: 'Second home mortgage' },
  [AccountType.MORTGAGE_RENTAL]: { displayName: 'Rental Mortgage', icon: '🏢', category: AccountCategory.MORTGAGE, description: 'Rental property mortgage' },
  [AccountType.HOME_EQUITY_LINE]: { displayName: 'Home Equity Line', icon: '🏠', category: AccountCategory.MORTGAGE, description: 'Home equity line of credit' },
  [AccountType.HOME_EQUITY_LOAN]: { displayName: 'Home Equity Loan', icon: '🏠', category: AccountCategory.MORTGAGE, description: 'Home equity loan' },
  [AccountType.CONSTRUCTION_LOAN]: { displayName: 'Construction Loan', icon: '🏗️', category: AccountCategory.MORTGAGE, description: 'Construction loan' },
  [AccountType.BRIDGE_LOAN]: { displayName: 'Bridge Loan', icon: '🌉', category: AccountCategory.MORTGAGE, description: 'Bridge loan' },

  // LOANS
  [AccountType.PERSONAL_LOAN]: { displayName: 'Personal Loan', icon: '💰', category: AccountCategory.LOAN, description: 'Personal loan' },
  [AccountType.BUSINESS_LOAN]: { displayName: 'Business Loan', icon: '💼', category: AccountCategory.LOAN, description: 'Business loan' },
  [AccountType.STUDENT_LOAN]: { displayName: 'Student Loan', icon: '🎓', category: AccountCategory.LOAN, description: 'Student loan' },
  [AccountType.AUTO_LOAN]: { displayName: 'Auto Loan', icon: '🚗', category: AccountCategory.LOAN, description: 'Auto loan' },
  [AccountType.BOAT_LOAN]: { displayName: 'Boat Loan', icon: '🚤', category: AccountCategory.LOAN, description: 'Boat loan' },
  [AccountType.RV_LOAN]: { displayName: 'RV Loan', icon: '🚐', category: AccountCategory.LOAN, description: 'RV loan' },
  [AccountType.CONSOLIDATED_LOAN]: { displayName: 'Consolidated Loan', icon: '📋', category: AccountCategory.LOAN, description: 'Consolidated loan' },
  [AccountType.PAYDAY_LOAN]: { displayName: 'Payday Loan', icon: '💸', category: AccountCategory.LOAN, description: 'Payday loan' },
  [AccountType.PEER_TO_PEER_LOAN]: { displayName: 'P2P Loan', icon: '👥', category: AccountCategory.LOAN, description: 'Peer-to-peer loan' },
  [AccountType.MICROLOAN]: { displayName: 'Microloan', icon: '💰', category: AccountCategory.LOAN, description: 'Microloan' },

  // OTHER LIABILITY
  [AccountType.ACCOUNT_PAYABLE]: { displayName: 'Accounts Payable', icon: '📄', category: AccountCategory.OTHER_LIABILITY, description: 'Accounts payable' },
  [AccountType.ACCRUED_EXPENSE]: { displayName: 'Accrued Expenses', icon: '📋', category: AccountCategory.OTHER_LIABILITY, description: 'Accrued expenses' },
  [AccountType.TAX_PAYABLE]: { displayName: 'Tax Payable', icon: '📊', category: AccountCategory.OTHER_LIABILITY, description: 'Taxes owed' },
  [AccountType.PENSION_LIABILITY]: { displayName: 'Pension Liability', icon: '🏛️', category: AccountCategory.OTHER_LIABILITY, description: 'Pension obligation' },
  [AccountType.DEFERRED_REVENUE]: { displayName: 'Deferred Revenue', icon: '💰', category: AccountCategory.OTHER_LIABILITY, description: 'Deferred revenue' },
  [AccountType.WARRANTIES_LIABILITY]: { displayName: 'Warranties Liability', icon: '🛡️', category: AccountCategory.OTHER_LIABILITY, description: 'Warranty obligations' },
  [AccountType.LEGAL_SETTLEMENT]: { displayName: 'Legal Settlement', icon: '⚖️', category: AccountCategory.OTHER_LIABILITY, description: 'Legal settlement' },
  [AccountType.BUSINESS_PAYABLE]: { displayName: 'Business Payable', icon: '💼', category: AccountCategory.OTHER_LIABILITY, description: 'Business payables' },
  [AccountType.LEASE_LIABILITY]: { displayName: 'Lease Liability', icon: '📄', category: AccountCategory.OTHER_LIABILITY, description: 'Lease obligation' },
  [AccountType.CONTINGENT_LIABILITY]: { displayName: 'Contingent Liability', icon: '⚠️', category: AccountCategory.OTHER_LIABILITY, description: 'Contingent liability' },
};

interface AccountTypeSelectorProps {
  value: string;
  onChange: (type: AccountType | string) => void;
  showOnlyAssets?: boolean;
  showOnlyLiabilities?: boolean;
}

export function AccountTypeSelector({
  value,
  onChange,
  showOnlyAssets = false,
  showOnlyLiabilities = false,
}: AccountTypeSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<AccountCategory>>(new Set());

  // Filter account types based on search and asset/liability filter
  const filteredTypes = useMemo(() => {
    return (Object.entries(ACCOUNT_TYPE_INFO) as [AccountType, typeof ACCOUNT_TYPE_INFO[AccountType]][])
      .filter(([type, info]) => {
        // Filter by asset/liability
        const isAsset = [AccountCategory.ASSETS, AccountCategory.CASH, AccountCategory.INVESTMENTS,
                        AccountCategory.REAL_ESTATE, AccountCategory.VEHICLE, AccountCategory.VALUABLES,
                        AccountCategory.CRYPTO, AccountCategory.OTHER_ASSET].includes(info.category);

        if (showOnlyAssets && !isAsset) return false;
        if (showOnlyLiabilities && isAsset) return false;

        // Filter by search query
        const query = searchQuery.toLowerCase();
        return (
          type.toLowerCase().includes(query) ||
          info.displayName.toLowerCase().includes(query) ||
          info.description.toLowerCase().includes(query)
        );
      });
  }, [searchQuery, showOnlyAssets, showOnlyLiabilities]);

  // Group by category
  const groupedTypes = useMemo(() => {
    const grouped: Record<AccountCategory, typeof filteredTypes> = {} as any;

    filteredTypes.forEach(([type, info]) => {
      if (!grouped[info.category]) {
        grouped[info.category] = [];
      }
      grouped[info.category].push([type, info]);
    });

    return grouped;
  }, [filteredTypes]);

  const toggleCategory = (category: AccountCategory) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
        <Input
          placeholder="Search account types..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Account Types List */}
      <ScrollArea className="h-[400px] border rounded-lg p-4">
        <div className="space-y-2">
          {Object.entries(groupedTypes).map(([category, types]) => (
            <div key={category}>
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category as AccountCategory)}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 mb-2"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{types.length}</Badge>
                  <span className="font-semibold text-sm">{category}</span>
                </div>
                {expandedCategories.has(category as AccountCategory) ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {/* Types in Category */}
              {expandedCategories.has(category as AccountCategory) && (
                <div className="ml-2 space-y-1 mb-3">
                  {types.map(([type, info]) => (
                    <button
                      key={type}
                      onClick={() => onChange(type)}
                      className={cn(
                        'w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-colors',
                        'hover:bg-muted/60',
                        value === type && 'bg-primary/10 border border-primary'
                      )}
                      title={`${info.displayName} (${type})`}
                    >
                      <span className="text-xl mt-0.5 flex-shrink-0">{info.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-foreground">{info.displayName}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{info.description}</div>
                        <div className="text-xs text-muted-foreground/60 mt-0.5 font-mono">{type}</div>
                      </div>
                      {value === type && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Selected Type Display */}
      {value && ACCOUNT_TYPE_INFO[value as AccountType] && (
        <div className="p-3 rounded-lg bg-muted/50 border">
          <div className="text-sm">
            <span className="text-muted-foreground">Selected: </span>
            <span className="font-semibold">
              {ACCOUNT_TYPE_INFO[value as AccountType]?.icon} {ACCOUNT_TYPE_INFO[value as AccountType]?.displayName}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
