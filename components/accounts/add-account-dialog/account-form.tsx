'use client';

import React from 'react';
import { UseFormRegister, UseFormWatch, Control, Controller, FieldValues } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Loader2, PlusIcon } from 'lucide-react';
import {
  CURRENCIES,
  ACCOUNT_TYPE_SUBTYPES,
  ASSET_TYPES,
  BANK_ACCOUNT_TYPES,
  INVESTMENT_ACCOUNT_TYPES,
  CREDIT_CARD_TYPES,
  MORTGAGE_TYPES,
  LOAN_TYPES,
  OTHER_LIABILITY_TYPES,
  CRYPTO_TYPES,
} from './constants';
import { getSubtypesForAccountType, formatEnumLabel } from './utils';

const shouldShowAssetFields = (accountType: string): boolean => {
  return ASSET_TYPES.includes(accountType);
};

const shouldShowAccountDetails = (accountType: string): boolean => {
  return (
    BANK_ACCOUNT_TYPES.includes(accountType) ||
    INVESTMENT_ACCOUNT_TYPES.includes(accountType) ||
    CRYPTO_TYPES.includes(accountType) ||
    CREDIT_CARD_TYPES.includes(accountType) ||
    MORTGAGE_TYPES.includes(accountType) ||
    LOAN_TYPES.includes(accountType) ||
    OTHER_LIABILITY_TYPES.includes(accountType)
  );
};

interface AccountFormProps {
  onSubmit: (data: Record<string, unknown>) => void;
  onBack: () => void;
  register: UseFormRegister<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  control: Control<FieldValues>;
  errors: Record<string, unknown>;
  isPending: boolean;
}

export function AccountForm({
  onSubmit,
  onBack,
  register,
  watch,
  control,
  errors,
  isPending,
}: AccountFormProps) {
  const watchedType = watch('type');

  return (
    <>
      <DialogHeader className="pb-4">
        <div className="flex gap-3 items-start">
          <Button variant="ghost" size="sm" onClick={onBack} className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <DialogTitle className="text-sm">Add Manual Account</DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {ACCOUNT_TYPE_SUBTYPES[watchedType]?.label}
            </p>
          </div>
        </div>
      </DialogHeader>

      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>

          <div className="space-y-2">
            <Label htmlFor="name">Account Name *</Label>
            <Input
              id="name"
              placeholder={
                watchedType === 'CHECKING' ? 'e.g., My Checking Account' :
                watchedType === 'SAVINGS' ? 'e.g., Emergency Fund' :
                watchedType === 'INVESTMENT' ? 'e.g., Fidelity Brokerage' :
                watchedType === 'CRYPTO' ? 'e.g., Bitcoin Wallet' :
                watchedType === 'CREDIT_CARD' ? 'e.g., Chase Sapphire' :
                watchedType === 'LOAN' || watchedType === 'MORTGAGE' ? 'e.g., Home Mortgage' :
                watchedType === 'REAL_ESTATE' ? 'e.g., Primary Residence' :
                watchedType === 'VEHICLE' ? 'e.g., 2022 Tesla Model 3' :
                'e.g., My Account'
              }
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="flex justify-between gap-4">
            <div className="space-y-2 w-full">
              <Label htmlFor="balance">
                {watchedType === 'CREDIT_CARD' ? 'Current Balance *' :
                 watchedType === 'LOAN' || watchedType === 'MORTGAGE' ? 'Loan Balance *' :
                 watchedType === 'CRYPTO' ? 'Wallet Balance *' :
                 'Current Balance *'}
              </Label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                className='w-full'
                placeholder="0.00"
                {...register('balance', { valueAsNumber: true })}
              />
              {errors.balance && (
                <p className="text-sm text-red-600">{errors.balance.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger variant='outlinemuted'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </div>

        {/* Subtype/Classification 
        <div className="space-y-2">
          <Label htmlFor="subtype">
            {watchedType === 'CHECKING' || watchedType === 'SAVINGS' ? 'Account Type (Optional)' :
             watchedType === 'INVESTMENT' ? 'Investment Type (Optional)' :
             watchedType === 'CRYPTO' ? 'Blockchain/Chain (Optional)' :
             watchedType === 'CREDIT_CARD' ? 'Card Type (Optional)' :
             watchedType === 'LOAN' || watchedType === 'MORTGAGE' ? 'Loan Type (Optional)' :
             'Account Classification (Optional)'}
          </Label>
          <Controller
            name="subtype"
            control={control}
            render={({ field }) => (
              <div className="flex gap-2">
                <Select onValueChange={field.onChange} value={field.value || undefined}>
                  <SelectTrigger className="" variant='outlinemuted'>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="max-h-80 w-full">
                    {getSubtypesForAccountType(watchedType).map((subtype) => (
                      <SelectItem key={subtype} value={subtype}>
                        {formatEnumLabel(subtype)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />
        </div>*/}

        <Separator />

        {/* Account Type Specific Fields */}
        <div className="space-y-4">
          {/* Show appropriate heading based on account type */}
          {shouldShowAssetFields(watchedType) && (
            <h3 className="text-lg font-semibold">Asset Details</h3>
          )}

          {shouldShowAccountDetails(watchedType) && !shouldShowAssetFields(watchedType) && (
            <h3 className="text-lg font-semibold">
              {BANK_ACCOUNT_TYPES.includes(watchedType) ? 'Bank Account Details' :
               INVESTMENT_ACCOUNT_TYPES.includes(watchedType) ? 'Investment Account Details' :
               CRYPTO_TYPES.includes(watchedType) ? 'Wallet Details' :
               CREDIT_CARD_TYPES.includes(watchedType) ? 'Credit Card Details' :
               (MORTGAGE_TYPES.includes(watchedType) || LOAN_TYPES.includes(watchedType)) ? 'Loan Details' :
               OTHER_LIABILITY_TYPES.includes(watchedType) ? 'Account Details' :
               'Account Details'}
            </h3>
          )}

          {/* BANK ACCOUNTS Fields (Checking, Savings, etc.) */}
          {BANK_ACCOUNT_TYPES.includes(watchedType) && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="institutionName">Bank Name</Label>
                  <Input
                    id="institutionName"
                    placeholder="e.g., Chase, Bank of America"
                    {...register('institutionName')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    placeholder="Last 4 digits: ****1234"
                    {...register('accountNumber')}
                  />
                </div>
              </div>
            </>
          )}

          {/* INVESTMENT ACCOUNTS Fields (401k, IRA, Brokerage, etc.) */}
          {INVESTMENT_ACCOUNT_TYPES.includes(watchedType) && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="institutionName">Broker/Firm Name</Label>
                  <Input
                    id="institutionName"
                    placeholder="e.g., Fidelity, Vanguard, Charles Schwab"
                    {...register('institutionName')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    placeholder="e.g., ACC-12345678"
                    {...register('accountNumber')}
                  />
                </div>
              </div>
            </>
          )}

          {/* CRYPTO Fields */}
          {CRYPTO_TYPES.includes(watchedType) && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="institutionName">Exchange/Wallet Provider</Label>
                  <Input
                    id="institutionName"
                    placeholder="e.g., Coinbase, Metamask, Kraken"
                    {...register('institutionName')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Wallet Address</Label>
                  <Input
                    id="accountNumber"
                    placeholder="e.g., 0x742d35Cc6634C0532925a3b844Bc..."
                    {...register('accountNumber')}
                  />
                </div>
              </div>
            </>
          )}

          {/* CREDIT CARD Fields */}
          {CREDIT_CARD_TYPES.includes(watchedType) && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="institutionName">Card Issuer</Label>
                  <Input
                    id="institutionName"
                    placeholder="e.g., Chase, American Express, Visa"
                    {...register('institutionName')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Card Last 4 Digits</Label>
                  <Input
                    id="accountNumber"
                    placeholder="e.g., 4242"
                    {...register('accountNumber')}
                  />
                </div>
              </div>
            </>
          )}

          {/* MORTGAGE Fields */}
          {MORTGAGE_TYPES.includes(watchedType) && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="institutionName">Lender Name</Label>
                  <Input
                    id="institutionName"
                    placeholder="e.g., Wells Fargo Mortgage"
                    {...register('institutionName')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Loan Number</Label>
                  <Input
                    id="accountNumber"
                    placeholder="e.g., LOAN-123456"
                    {...register('accountNumber')}
                  />
                </div>
              </div>
            </>
          )}

          {/* LOAN Fields */}
          {LOAN_TYPES.includes(watchedType) && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="institutionName">Lender Name</Label>
                  <Input
                    id="institutionName"
                    placeholder="e.g., SoFi, LendingClub"
                    {...register('institutionName')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Loan Number</Label>
                  <Input
                    id="accountNumber"
                    placeholder="e.g., LOAN-123456"
                    {...register('accountNumber')}
                  />
                </div>
              </div>
            </>
          )}

          {/* OTHER LIABILITY Fields */}
          {OTHER_LIABILITY_TYPES.includes(watchedType) && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="institutionName">Creditor/Entity Name</Label>
                  <Input
                    id="institutionName"
                    placeholder="e.g., Entity name"
                    {...register('institutionName')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account/Reference Number</Label>
                  <Input
                    id="accountNumber"
                    placeholder="e.g., REF-123456"
                    {...register('accountNumber')}
                  />
                </div>
              </div>
            </>
          )}

          {/* ASSET Fields - Real Estate, Vehicles, Collectibles, etc. */}
          {shouldShowAssetFields(watchedType) && (
            <AssetFields watchedType={watchedType} register={register} />
          )}
        </div>

        {/* Submit Buttons */}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isPending}
            size="sm"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2"
            size="sm"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <PlusIcon className="h-4 w-4" />
                Create Account
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

function AssetFields({ watchedType, register }: { watchedType: string; register: UseFormRegister<FieldValues> }) {
  const realEstateTypes = ['PRIMARY_RESIDENCE', 'INVESTMENT_PROPERTY', 'RENTAL_PROPERTY', 'VACATION_HOME', 'LAND', 'COMMERCIAL_PROPERTY', 'INDUSTRIAL_PROPERTY', 'TIMESHARE', 'DEVELOPMENT_LAND'];
  const vehicleTypes = ['CAR', 'TRUCK', 'MOTORCYCLE', 'BOAT', 'RV', 'AIRCRAFT', 'ELECTRIC_VEHICLE', 'LUXURY_VEHICLE', 'CLASSIC_CAR'];
  const jewelryTypes = ['JEWELRY', 'WATCHES', 'PRECIOUS_METALS', 'GEMSTONES'];
  const artTypes = ['FINE_ART', 'COLLECTIBLES', 'ANTIQUES', 'WINE_COLLECTION'];
  const businessTypes = ['BUSINESS_OWNERSHIP', 'PARTNERSHIP_INTEREST'];
  const stockTypes = ['STOCK_OPTIONS', 'RESTRICTED_STOCK'];
  const insuranceTypes = ['LIFE_INSURANCE_VALUE', 'ACCOUNTS_RECEIVABLE', 'EMPLOYEE_STOCK_PURCHASE'];

  return (
    <>
      {/* Asset Description */}
      <div className="space-y-2">
        <Label htmlFor="assetDescription">
          {realEstateTypes.includes(watchedType) ? 'Property Description' :
           vehicleTypes.includes(watchedType) ? 'Vehicle Details' :
           jewelryTypes.includes(watchedType) ? 'Item Description' :
           artTypes.includes(watchedType) ? 'Item Details' :
           businessTypes.includes(watchedType) ? 'Business Description' :
           stockTypes.includes(watchedType) ? 'Stock Details' :
           'Asset Description'}
        </Label>
        <Textarea
          id="assetDescription"
          placeholder={
            realEstateTypes.includes(watchedType) ? 'e.g., 3-bedroom house with 2-car garage, recently renovated kitchen' :
            vehicleTypes.includes(watchedType) ? 'e.g., 2022 Tesla Model 3, Black, Excellent condition, 15k miles' :
            jewelryTypes.includes(watchedType) ? 'e.g., 14K gold engagement ring with diamond, Size 7' :
            'Describe the asset...'
          }
          {...register('assetDescription')}
          rows={3}
        />
      </div>

      {/* Valuation Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="originalValue">
            {realEstateTypes.includes(watchedType) ? 'Purchase Price' :
             vehicleTypes.includes(watchedType) ? 'Original Cost' :
             businessTypes.includes(watchedType) ? 'Initial Investment' :
             stockTypes.includes(watchedType) ? 'Strike/Cost Price' :
             'Purchase Price'}
          </Label>
          <Input
            id="originalValue"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('originalValue', { valueAsNumber: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchaseDate">
            {vehicleTypes.includes(watchedType) ? 'Purchase Date' :
             stockTypes.includes(watchedType) ? 'Grant Date' :
             'Acquired Date'}
          </Label>
          <Input
            id="purchaseDate"
            type="date"
            {...register('purchaseDate')}
          />
        </div>
      </div>

      {/* Real Estate Specific */}
      {realEstateTypes.includes(watchedType) && (
        <>
          <div className="space-y-2">
            <Label htmlFor="address">Property Address</Label>
            <Input
              id="address"
              placeholder="123 Main Street"
              {...register('address')}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="City" {...register('city')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" placeholder="State" {...register('state')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" placeholder="Country" {...register('country')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input id="postalCode" placeholder="ZIP" {...register('postalCode')} />
            </div>
          </div>
        </>
      )}

      {/* Vehicle Specific */}
      {vehicleTypes.includes(watchedType) && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="institutionName">Make & Model</Label>
              <Input
                id="institutionName"
                placeholder="e.g., Tesla Model 3"
                {...register('institutionName')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">VIN (Optional)</Label>
              <Input
                id="accountNumber"
                placeholder="Vehicle Identification Number"
                {...register('accountNumber')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="City" {...register('city')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" placeholder="State" {...register('state')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" placeholder="Country" {...register('country')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input id="postalCode" placeholder="ZIP" {...register('postalCode')} />
            </div>
          </div>
        </>
      )}

      {/* Jewelry & Precious Metals */}
      {jewelryTypes.includes(watchedType) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="institutionName">
              {watchedType === 'PRECIOUS_METALS' ? 'Metal Type' : 'Material/Type'}
            </Label>
            <Input
              id="institutionName"
              placeholder={watchedType === 'PRECIOUS_METALS' ? 'e.g., Gold, Silver, Platinum' : 'e.g., 14K Gold'}
              {...register('institutionName')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Weight/Carat</Label>
            <Input
              id="accountNumber"
              placeholder={watchedType === 'PRECIOUS_METALS' ? 'e.g., 1 oz' : 'e.g., 2.5 carats'}
              {...register('accountNumber')}
            />
          </div>
        </div>
      )}

      {/* Fine Art & Collectibles */}
      {artTypes.includes(watchedType) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="institutionName">
              {watchedType === 'FINE_ART' ? 'Artist Name' : 'Name/Title'}
            </Label>
            <Input
              id="institutionName"
              placeholder={watchedType === 'FINE_ART' ? 'e.g., Pablo Picasso' : 'e.g., Item name'}
              {...register('institutionName')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountNumber">
              {watchedType === 'FINE_ART' ? 'Medium' : 'Condition'}
            </Label>
            <Input
              id="accountNumber"
              placeholder={watchedType === 'FINE_ART' ? 'e.g., Oil on canvas' : 'e.g., Excellent'}
              {...register('accountNumber')}
            />
          </div>
        </div>
      )}

      {/* Business Ownership */}
      {businessTypes.includes(watchedType) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="institutionName">Business Name</Label>
            <Input
              id="institutionName"
              placeholder="e.g., Acme Tech Inc."
              {...register('institutionName')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Ownership %</Label>
            <Input
              id="accountNumber"
              type="number"
              step="0.1"
              placeholder="e.g., 25"
              {...register('accountNumber')}
            />
          </div>
        </div>
      )}

      {/* Stock Options & RSUs */}
      {stockTypes.includes(watchedType) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="institutionName">Company Name</Label>
            <Input
              id="institutionName"
              placeholder="e.g., ACME Corp"
              {...register('institutionName')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Shares</Label>
            <Input
              id="accountNumber"
              type="number"
              step="1"
              placeholder="e.g., 1000"
              {...register('accountNumber')}
            />
          </div>
        </div>
      )}

      {/* Patents & Insurance */}
      {watchedType === 'PATENTS_IP' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="institutionName">Patent/IP Type</Label>
            <Input
              id="institutionName"
              placeholder="e.g., Patent, Trademark"
              {...register('institutionName')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Reference Number</Label>
            <Input
              id="accountNumber"
              placeholder="e.g., US 10,123,456"
              {...register('accountNumber')}
            />
          </div>
        </div>
      )}

      {insuranceTypes.includes(watchedType) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="institutionName">
              {watchedType === 'LIFE_INSURANCE_VALUE' ? 'Insurance Provider' : 'Provider Name'}
            </Label>
            <Input
              id="institutionName"
              placeholder={watchedType === 'LIFE_INSURANCE_VALUE' ? 'e.g., Prudential' : 'e.g., Provider'}
              {...register('institutionName')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Policy/Account Number</Label>
            <Input
              id="accountNumber"
              placeholder="e.g., POL-123456"
              {...register('accountNumber')}
            />
          </div>
        </div>
      )}
    </>
  );
}
