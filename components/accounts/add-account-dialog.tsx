'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import {
  Search,
  Building2,
  TrendingUp,
  Coins,
  Upload,
  ChevronRight,
  Wallet,
  Home,
  CreditCard,
  Loader2,
  PlusIcon,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateManualAccount } from '@/lib/queries';
import type { AccountType } from '@/lib/types/unified-accounts';

interface AddAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AccountCategory {
  id: string;
  title: string;
  subtitle: string;
  addedCount: number;
  icons: string[];
  iconColors: string[];
  path?: string;
  isManual?: boolean;
}

// Form validation schema
const accountSchema = z.object({
  name: z.string().min(1, 'Account name is required').max(100, 'Name too long'),
  type: z.enum(['CHECKING', 'SAVINGS', 'CREDIT_CARD', 'INVESTMENT', 'LOAN', 'MORTGAGE', 'CRYPTO', 'REAL_ESTATE', 'VEHICLE', 'OTHER_ASSET'] as const),
  balance: z.number().min(0, 'Balance must be a positive number'),
  currency: z.string().min(1, 'Currency is required'),
  institutionName: z.string().max(100, 'Institution name too long').optional(),
  accountNumber: z.string().max(50, 'Account number too long').optional(),
  // Asset-specific fields
  assetDescription: z.string().max(500, 'Description too long').optional(),
  originalValue: z.number().min(0).optional(),
  purchaseDate: z.string().optional(),
  appreciationRate: z.number().optional(),
  address: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
});

type AccountFormData = z.infer<typeof accountSchema>;

const ACCOUNT_TYPES = [
  { value: 'CHECKING', label: 'Checking Account', icon: Building2, description: 'Everyday banking account' },
  { value: 'SAVINGS', label: 'Savings Account', icon: Wallet, description: 'Savings and high-yield accounts' },
  { value: 'CREDIT_CARD', label: 'Credit Card', icon: CreditCard, description: 'Credit card accounts' },
  { value: 'INVESTMENT', label: 'Investment', icon: TrendingUp, description: 'Stocks, bonds, retirement accounts' },
  { value: 'LOAN', label: 'Loan', icon: CreditCard, description: 'Personal loans and lines of credit' },
  { value: 'MORTGAGE', label: 'Mortgage', icon: Home, description: 'Home mortgages and property loans' },
  { value: 'CRYPTO', label: 'Cryptocurrency', icon: Coins, description: 'Bitcoin, Ethereum, and other crypto' },
  { value: 'REAL_ESTATE', label: 'Real Estate', icon: Home, description: 'Properties and land' },
  { value: 'VEHICLE', label: 'Vehicle', icon: Wallet, description: 'Cars, boats, and other vehicles' },
  { value: 'OTHER_ASSET', label: 'Other Asset', icon: Wallet, description: 'Other financial assets' },
] as const;

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'CAD', label: 'CAD ($)' },
  { value: 'AUD', label: 'AUD ($)' },
  { value: 'JPY', label: 'JPY (¥)' },
];

export function AddAccountDialog({ open, onOpenChange }: AddAccountDialogProps) {
  const router = useRouter();
  const [step, setStep] = useState<'selection' | 'form'>('selection');
  const [selectedType, setSelectedType] = useState<AccountType | null>(null);

  const { mutate: createAccount, isPending } = useCreateManualAccount();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      type: 'CHECKING',
      currency: 'USD',
      balance: 0,
    },
  });

  const watchedType = watch('type');

  // Account categories configuration
  const categories: AccountCategory[] = [
    {
      id: 'banks',
      title: 'Banks & credit cards',
      subtitle: 'Connect your bank accounts and credit cards',
      addedCount: 0,
      icons: ['💳', '🏦', '💰'],
      iconColors: ['bg-blue-500', 'bg-indigo-500', 'bg-red-500'],
      path: '/accounts/connection?type=bank&integration=stripe',
    },
    {
      id: 'investments',
      title: 'Investments & loans',
      subtitle: 'Track investment accounts and loans',
      addedCount: 0,
      icons: ['📈', '💼', '🏛️'],
      iconColors: ['bg-green-500', 'bg-cyan-500', 'bg-purple-500'],
      path: '/accounts/connection?type=bank&integration=stripe',
    },
    {
      id: 'crypto',
      title: 'Real estate, crypto, and more',
      subtitle: 'Add crypto wallets, real estate, and other assets',
      addedCount: 0,
      icons: ['₿', '🏠'],
      iconColors: ['bg-violet-500', 'bg-orange-500'],
      path: '/accounts/wallet/manage',
    },
    {
      id: 'import',
      title: 'Import transaction & balance history',
      subtitle: 'Import from CSV',
      addedCount: 0,
      icons: [],
      iconColors: [],
      path: '/accounts/connection?type=bank&integration=stripe',
    },
    {
      id: 'manual',
      title: 'Add manual account',
      subtitle: 'Manually track any account',
      addedCount: 0,
      icons: [],
      iconColors: [],
      isManual: true,
    },
  ];

  const handleCategoryClick = (category: AccountCategory) => {
    if (category.isManual) {
      setStep('form');
    } else if (category.path) {
      onOpenChange(false);
      router.push(category.path);
    }
  };

  const handleBack = () => {
    setStep('selection');
    reset();
  };

  const onSubmit = async (data: AccountFormData) => {
    createAccount(data, {
      onSuccess: () => {
        toast.success('Account created successfully!');
        reset();
        setStep('selection');
        onOpenChange(false);
      },
      onError: (error: any) => {
        const errorMessage = error?.message || 'Failed to create account';
        toast.error(errorMessage);
      },
    });
  };

  const handleClose = () => {
    setStep('selection');
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {step === 'selection' ? (
          <>
            {/* Selection View */}
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl font-semibold">Add an account</DialogTitle>
            </DialogHeader>

            {/* Search Bar */}
            <div className="pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                <Input
                  placeholder="Search 13,000 institutions..."
                  className="pl-10 h-10 "
                />
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className={cn(
                    'w-full flex items-center justify-between p-4 bg-card rounded-lg border shadow-xs border-border cursor-pointer',
                    'hover:bg-muted/30 hover:border-border',
                    'group focus:outline-none focus:ring-0'
                  )}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-sm text-foreground">{category.title}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">{category.subtitle}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {category.id === 'import' || category.id === 'manual' ? (
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-muted border border-bordder/80 flex items-center justify-center">
                            {category.id === 'import' ? (
                              <Upload className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <PlusIcon className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center -space-x-2">
                            {category.icons.map((icon, idx) => (
                              <div
                                key={idx}
                                className={cn(
                                  'h-8 w-8 rounded-full flex items-center justify-center text-sm ring-2 ring-background',
                                  category.iconColors[idx] || 'bg-muted'
                                )}
                              >
                                <span className="text-white">{icon}</span>
                              </div>
                            ))}
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Form View */}
            <DialogHeader className="pb-4">
              <div className="flex gap-3 items-start">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500/70 to-indigo-600/70 rounded-xl flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-sm">Add Manual Account</DialogTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    Manually track any financial account
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="h-8"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Account Name *</Label>
                    <Input
                      id="name"
                      placeholder="My Savings Account"
                      {...register('name')}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Account Type *</Label>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger size="sm">
                            <SelectValue placeholder="Select account type">
                              {field.value && (
                                <div className="flex items-center gap-3 cursor-pointer">
                                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                    {(() => {
                                      const accountType = ACCOUNT_TYPES.find(
                                        (type) => type.value === field.value
                                      );
                                      return accountType ? (
                                        <accountType.icon className="h-4 w-4" />
                                      ) : null;
                                    })()}
                                  </div>
                                  <span className="font-semibold text-xs">
                                    {ACCOUNT_TYPES.find((type) => type.value === field.value)?.label}
                                  </span>
                                </div>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {ACCOUNT_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value} className="cursor-pointer">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                    <type.icon className="h-5 w-5" />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-medium text-xs">{type.label}</span>
                                    <p className="text-[11px] text-muted-foreground">
                                      {type.description}
                                    </p>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.type && (
                      <p className="text-sm text-red-600">{errors.type.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="balance">Initial Balance *</Label>
                    <Input
                      id="balance"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...register('balance', { valueAsNumber: true })}
                      className={errors.balance ? 'border-red-500' : ''}
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
                          <SelectTrigger size="sm">
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

              <Separator />

              {/* Optional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Optional Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="institutionName">Institution Name</Label>
                    <Input
                      id="institutionName"
                      placeholder="Bank of America"
                      {...register('institutionName')}
                      className={errors.institutionName ? 'border-red-500' : ''}
                    />
                    {errors.institutionName && (
                      <p className="text-sm text-red-600">{errors.institutionName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      placeholder="****1234"
                      {...register('accountNumber')}
                      className={errors.accountNumber ? 'border-red-500' : ''}
                    />
                    {errors.accountNumber && (
                      <p className="text-sm text-red-600">{errors.accountNumber.message}</p>
                    )}
                  </div>
                </div>

                {/* Asset-specific fields */}
                {(watchedType === 'REAL_ESTATE' || watchedType === 'VEHICLE' || watchedType === 'OTHER_ASSET') && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="assetDescription">Asset Description</Label>
                      <Textarea
                        id="assetDescription"
                        placeholder="Describe the asset..."
                        {...register('assetDescription')}
                        className={errors.assetDescription ? 'border-red-500' : ''}
                      />
                      {errors.assetDescription && (
                        <p className="text-sm text-red-600">{errors.assetDescription.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="originalValue">Original Value</Label>
                        <Input
                          id="originalValue"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...register('originalValue', { valueAsNumber: true })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="purchaseDate">Purchase Date</Label>
                        <Input
                          id="purchaseDate"
                          type="date"
                          {...register('purchaseDate')}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="123 Main St"
                        {...register('address')}
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" {...register('city')} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" {...register('state')} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" {...register('country')} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input id="postalCode" {...register('postalCode')} />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Submit Buttons */}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isPending}
                  size="sm"
                >
                  Cancel
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
        )}
      </DialogContent>
    </Dialog>
  );
}
