'use client';

import React, { useState, useMemo } from 'react';
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
import { Badge } from '@/components/ui/badge';
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
  AlertCircle,
  DollarSign,
  Zap,
  PoundSterling,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateManualAccount } from '@/lib/queries';
import { useCategoriesByType } from '@/lib/queries/use-categories-data';
import type { AccountType } from '@/lib/types/unified-accounts';

interface AddAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Form validation schema
const accountSchema = z.object({
  name: z.string().min(1, 'Account name is required').max(100, 'Name too long'),
  type: z.enum(['CHECKING', 'SAVINGS', 'CREDIT_CARD', 'INVESTMENT', 'LOAN', 'MORTGAGE', 'CRYPTO', 'REAL_ESTATE', 'VEHICLE', 'OTHER_ASSET'] as const),
  balance: z.number().min(0, 'Balance must be a positive number'),
  currency: z.string().min(1, 'Currency is required'),
  institutionName: z.string().max(100, 'Institution name too long').optional(),
  accountNumber: z.string().max(50, 'Account number too long').optional(),
  subtype: z.string().optional(),
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

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'CAD', label: 'CAD ($)' },
  { value: 'AUD', label: 'AUD ($)' },
  { value: 'JPY', label: 'JPY (¥)' },
];

// Comprehensive subtype mappings
const ACCOUNT_TYPE_SUBTYPES: Record<string, { label: string; subtypes: string[] }> = {
  CHECKING: {
    label: 'Cash Account',
    subtypes: ['STANDARD', 'INTEREST_BEARING', 'STUDENT', 'HIGH_YIELD', 'MONEY_MARKET', 'GIFT_CARD', 'TRAVEL', 'RELOADABLE', 'SWEEP', 'TREASURY', 'LIQUIDITY_POOL'],
  },
  SAVINGS: {
    label: 'Cash Account',
    subtypes: ['STANDARD', 'INTEREST_BEARING', 'STUDENT', 'HIGH_YIELD', 'MONEY_MARKET', 'GIFT_CARD', 'TRAVEL', 'RELOADABLE', 'SWEEP', 'TREASURY', 'LIQUIDITY_POOL'],
  },
  INVESTMENT: {
    label: 'Investment Account',
    subtypes: ['STANDARD', 'MARGIN', 'COMMISSION_FREE', 'TAXABLE', 'CUSTODIAL', 'TRADITIONAL', 'ROTH', 'SAFE_HARBOR', 'SEP', 'ROLLOVER', 'INHERITED', 'ACTIVE', 'INDEX', 'TARGET_DATE', 'GOVERNMENT', 'MUNICIPAL', 'ZERO_COUPON', 'HEDGE_FUND', 'PRIVATE_EQUITY', 'PRIVATE_CREDIT', 'VESTED', 'UNVESTED'],
  },
  CRYPTO: {
    label: 'Crypto Account',
    subtypes: ['ETHEREUM', 'BITCOIN', 'SOLANA', 'POLYGON', 'AVALANCHE', 'OPTIMISM', 'ARBITRUM', 'BASE', 'ZKSYNC', 'SCROLL', 'LINEA', 'AAVE', 'CURVE', 'UNISWAP', 'BALANCER', 'COMPOUND', 'MAKERDAO'],
  },
  REAL_ESTATE: {
    label: 'Asset Account',
    subtypes: ['PRIMARY_RESIDENCE', 'RENTAL', 'COMMERCIAL', 'LAND', 'VACATION_HOME', 'AUTO', 'MOTORCYCLE', 'BOAT', 'RV', 'AIRCRAFT', 'EQUIPMENT', 'FINE_ART', 'VINTAGE_ART', 'SCULPTURES', 'ANTIQUES', 'MEMORABILIA', 'WINE', 'SPORTS_MEMORABILIA', 'COMIC_BOOKS', 'TRADING_CARDS', 'WATCHES', 'JEWELRY', 'STAMPS', 'GOLD_BULLION', 'GOLD_COINS', 'SILVER_BULLION', 'SILVER_COINS', 'PLATINUM', 'PALLADIUM', 'PATENT', 'TRADEMARK', 'COPYRIGHT', 'TRADE_SECRET', 'DOMAIN_NAME', 'BRAND', 'SOLE_PROPRIETOR', 'LLC', 'S_CORP', 'C_CORP', 'PARTNERSHIP', 'STARTUP_EQUITY', 'WHOLE_LIFE', 'UNIVERSAL_LIFE', 'VARIABLE_LIFE', 'INDEXED_LIFE', 'PENSION', 'ANNUITY', 'IMMEDIATE_ANNUITY', 'DEFERRED_ANNUITY'],
  },
  VEHICLE: {
    label: 'Asset Account',
    subtypes: ['AUTO', 'MOTORCYCLE', 'BOAT', 'RV', 'AIRCRAFT'],
  },
  OTHER_ASSET: {
    label: 'Asset Account',
    subtypes: ['EQUIPMENT', 'FINE_ART', 'VINTAGE_ART', 'SCULPTURES', 'ANTIQUES', 'MEMORABILIA', 'WINE', 'SPORTS_MEMORABILIA', 'COMIC_BOOKS', 'TRADING_CARDS', 'WATCHES', 'JEWELRY', 'STAMPS', 'GOLD_BULLION', 'GOLD_COINS', 'SILVER_BULLION', 'SILVER_COINS', 'PLATINUM', 'PALLADIUM'],
  },
  CREDIT_CARD: {
    label: 'Credit Account',
    subtypes: ['PERSONAL', 'BUSINESS', 'CORPORATE', 'NO_ANNUAL_FEE', 'HELOC', 'PERSONAL_LOC', 'BUSINESS_LOC', 'FEDERAL', 'PRIVATE', 'PARENT_PLUS', 'CONSOLIDATION', 'INCOME', 'PROPERTY', 'CORPORATE_TAX', 'QUARTERLY_EST', 'MONTHLY', 'ANNUAL', 'PROFESSIONAL'],
  },
  LOAN: {
    label: 'Loan Account',
    subtypes: ['PRIMARY_RESIDENCE_MORTGAGE', 'INVESTMENT_PROPERTY', 'CONSTRUCTION_LOAN', 'ARM', 'FIXED_RATE', 'AUTO', 'MOTORCYCLE', 'BOAT', 'RV', 'UNSECURED', 'SECURED', 'DEBT_CONSOLIDATION', 'PAYDAY', 'FEDERAL', 'PRIVATE', 'PARENT_PLUS', 'PERKINS', 'STAFFORD', 'CONSOLIDATION', 'INCOME_TAX', 'PROPERTY_TAX', 'CORPORATE_TAX', 'SALES_TAX', 'PAYROLL_TAX', 'QUARTERLY_EST', 'MONTHLY', 'ANNUAL', 'QUARTERLY', 'PROFESSIONAL_SERVICE', 'MEMBERSHIP', 'SETTLEMENT', 'JUDGMENT', 'CHILD_SUPPORT', 'ALIMONY', 'CONTRACT_OBLIGATION', 'BOND_ISSUANCE', 'NOTE', 'DEBENTURE', 'CONVERTIBLE_DEBT'],
  },
  MORTGAGE: {
    label: 'Loan Account',
    subtypes: ['PRIMARY_RESIDENCE_MORTGAGE', 'INVESTMENT_PROPERTY', 'CONSTRUCTION_LOAN', 'ARM', 'FIXED_RATE'],
  },
};

// Account type categories
const ACCOUNT_TYPES_BY_CATEGORY = {
  ASSETS: [
    {
      id: 'cash',
      type: 'CHECKING',
      name: 'Cash Account',
      description: 'Checking, savings, high-yield accounts',
      icon: DollarSign,
      color: 'from-blue-500 to-blue-600',
      label: 'Cash',
    },
    {
      id: 'investments',
      type: 'INVESTMENT',
      name: 'Investments',
      description: 'Stocks, bonds, retirement accounts',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      label: 'Investments',
    },
    {
      id: 'crypto',
      type: 'CRYPTO',
      name: 'Cryptocurrency',
      description: 'Bitcoin, Ethereum, and other crypto',
      icon: Coins,
      color: 'from-violet-500 to-violet-600',
      label: 'Crypto',
    },
    {
      id: 'assets',
      type: 'REAL_ESTATE',
      name: 'Assets',
      description: 'Real estate, vehicles, collections',
      icon: Home,
      color: 'from-orange-500 to-orange-600',
      label: 'Assets',
    },
  ],
  LIABILITIES: [
    {
      id: 'creditcard',
      type: 'CREDIT_CARD',
      name: 'Credit Card',
      description: 'Personal & business credit cards',
      icon: CreditCard,
      color: 'from-red-500 to-red-600',
      label: 'Credit Card',
    },
    {
      id: 'loans',
      type: 'LOAN',
      name: 'Loans',
      description: 'Personal loans, mortgages, auto loans',
      icon: Building2,
      color: 'from-pink-500 to-pink-600',
      label: 'Loans',
    },
  ],
};

export function AddAccountDialog({ open, onOpenChange }: AddAccountDialogProps) {
  const router = useRouter();
  const [view, setView] = useState<'initial' | 'manual'>('initial');
  const [step, setStep] = useState<'selection' | 'accountType' | 'form'>('selection');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof ACCOUNT_TYPES_BY_CATEGORY | null>(null);

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
  const { data: availableCategories = [] } = useCategoriesByType(watchedType as AccountType, undefined);

  const handleSelectAccountType = (type: string, category: keyof typeof ACCOUNT_TYPES_BY_CATEGORY) => {
    setSelectedType(type as any);
    setSelectedCategory(category);
    setValue('type', type as any);
    setStep('form');
  };

  const handleBack = () => {
    if (step === 'form') {
      setStep('accountType');
    } else if (step === 'accountType') {
      setStep('selection');
    } else if (step === 'selection' && view === 'manual') {
      setView('initial');
      setStep('selection');
    }
    reset();
  };

  const handleCategorySelect = (category: keyof typeof ACCOUNT_TYPES_BY_CATEGORY) => {
    setSelectedCategory(category);
    setStep('accountType');
  };

  const handleManualAccountClick = () => {
    setView('manual');
    setStep('selection');
  };

  const onSubmit = async (data: AccountFormData) => {
    createAccount(data, {
      onSuccess: () => {
        toast.success('Account created successfully!');
        reset();
        setStep('selection');
        setSelectedType(null);
        setSelectedCategory(null);
        setView('initial');
        onOpenChange(false);
      },
      onError: (error: any) => {
        const errorMessage = error?.message || 'Failed to create account';
        toast.error(errorMessage);
      },
    });
  };

  const handleClose = () => {
    setView('initial');
    setStep('selection');
    setSelectedType(null);
    setSelectedCategory(null);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* INITIAL VIEW - Connect accounts or manual */}
        {view === 'initial' && step === 'selection' && (
          <>
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl font-semibold">Add an account</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              {/* Banks & Credit Cards */}
              <button
                onClick={() => {}}
                className={cn(
                  'flex items-center justify-between p-4 bg-card rounded-lg border border-border',
                  'hover:bg-muted/40 hover:border-border/60 transition-colors cursor-pointer'
                )}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center text-white flex-shrink-0 bg-blue-500">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-sm">Banks & credit cards</h3>
                    <p className="text-xs text-muted-foreground">Connect your bank accounts</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>

              {/* Investments & Loans */}
              <button
                onClick={() => {}}
                className={cn(
                  'flex items-center justify-between p-4 bg-card rounded-lg border border-border',
                  'hover:bg-muted/40 hover:border-border/60 transition-colors cursor-pointer'
                )}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center text-white flex-shrink-0 bg-green-500">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-sm">Investments & loans</h3>
                    <p className="text-xs text-muted-foreground">Brokerages, retirement accounts, mortgages</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>

              {/* Crypto & Real Estate */}
              <button
                onClick={() => {}}
                className={cn(
                  'flex items-center justify-between p-4 bg-card rounded-lg border border-border',
                  'hover:bg-muted/40 hover:border-border/60 transition-colors cursor-pointer'
                )}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center text-white flex-shrink-0 bg-purple-500">
                    <Coins className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-sm">Real estate, crypto, and more</h3>
                    <p className="text-xs text-muted-foreground">Properties, cryptocurrencies, collectibles</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>

              <Separator className="my-2" />

              {/* Import from CSV */}
              <button
                onClick={() => {}}
                className={cn(
                  'flex items-center justify-between p-4 bg-card rounded-lg border border-border',
                  'hover:bg-muted/40 hover:border-border/60 transition-colors cursor-pointer'
                )}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center text-muted-foreground flex-shrink-0 bg-muted">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-sm">Import from CSV</h3>
                    <p className="text-xs text-muted-foreground">Bulk import account data</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>

              <Separator className="my-2" />

              {/* Add Manual Account */}
              <button
                onClick={handleManualAccountClick}
                className={cn(
                  'flex items-center justify-between p-4 bg-card rounded-lg border-2 border-orange-200 dark:border-orange-900/30',
                  'hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:border-orange-300 dark:hover:border-orange-800/50 transition-colors cursor-pointer'
                )}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center text-orange-600 dark:text-orange-400 flex-shrink-0 bg-orange-100 dark:bg-orange-950/40">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-sm">Add manual account</h3>
                    <p className="text-xs text-muted-foreground">Create a custom account entry</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </>
        )}

        {/* MANUAL ACCOUNT FLOW - Choose Assets or Liabilities */}
        {view === 'manual' && step === 'selection' && (
          <>
            <DialogHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={handleBack} className="h-8 w-8 p-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <DialogTitle className="text-lg">Add manual account</DialogTitle>
                  <p className="text-xs text-muted-foreground mt-1">Select account category</p>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              {/* Assets */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-300">ASSETS</Badge>
                  <p className="text-sm text-muted-foreground">Money and valuables you own</p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {ACCOUNT_TYPES_BY_CATEGORY.ASSETS.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect('ASSETS')}
                      className={cn(
                        'flex items-center justify-between p-4 bg-card rounded-lg border border-border',
                        'hover:bg-muted/40 hover:border-border/60 transition-colors cursor-pointer'
                      )}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="h-10 w-10 rounded-lg flex items-center justify-center text-white flex-shrink-0 bg-blue-500">
                          <category.icon className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-sm">{category.name}</h3>
                          <p className="text-xs text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Liabilities */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300">LIABILITIES</Badge>
                  <p className="text-sm text-muted-foreground">Money and obligations you owe</p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {ACCOUNT_TYPES_BY_CATEGORY.LIABILITIES.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect('LIABILITIES')}
                      className={cn(
                        'flex items-center justify-between p-4 bg-card rounded-lg border border-border',
                        'hover:bg-muted/40 hover:border-border/60 transition-colors cursor-pointer'
                      )}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="h-10 w-10 rounded-lg flex items-center justify-center text-white flex-shrink-0 bg-red-500">
                          <category.icon className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-sm">{category.name}</h3>
                          <p className="text-xs text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ACCOUNT TYPE VIEW - Select specific type */}
        {step === 'accountType' && selectedCategory && (
          <>
            <DialogHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={handleBack} className="h-8 w-8 p-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <DialogTitle className="text-lg">
                    {selectedCategory === 'ASSETS' ? 'Select Asset Type' : 'Select Liability Type'}
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground mt-1">Choose the specific account type</p>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-2">
              {ACCOUNT_TYPES_BY_CATEGORY[selectedCategory].map((category) => {
                // Map color names to solid colors
                const colorMap: Record<string, string> = {
                  'from-blue-500': 'bg-blue-500',
                  'from-green-500': 'bg-green-500',
                  'from-violet-500': 'bg-violet-500',
                  'from-orange-500': 'bg-orange-500',
                  'from-red-500': 'bg-red-500',
                  'from-pink-500': 'bg-pink-500',
                };
                const baseColor = category.color.split(' ')[0];
                const solidColor = colorMap[baseColor] || 'bg-gray-500';

                return (
                  <button
                    key={category.id}
                    onClick={() => handleSelectAccountType(category.type, selectedCategory)}
                    className={cn(
                      'flex items-center justify-between p-4 bg-card rounded-lg border border-border',
                      'hover:bg-muted/40 hover:border-border/60 transition-colors cursor-pointer'
                    )}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={cn(
                        'h-10 w-10 rounded-lg flex items-center justify-center text-white flex-shrink-0',
                        solidColor
                      )}>
                        <category.icon className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-sm">{category.name}</h3>
                        <p className="text-xs text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* FORM VIEW */}
        {step === 'form' && (
          <>
            <DialogHeader className="pb-4">
              <div className="flex gap-3 items-start">
                <Button variant="ghost" size="sm" onClick={handleBack} className="h-8 w-8 p-0">
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="name">Account Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., My Savings Account"
                    {...register('name')}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                  )}
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

              {/* Subtype/Classification */}
              <div className="space-y-2">
                <Label htmlFor="subtype">Account Classification (Optional)</Label>
                <Controller
                  name="subtype"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Select onValueChange={field.onChange} value={field.value || undefined}>
                        <SelectTrigger size="sm" className="w-full">
                          <SelectValue placeholder="Select a subtype (optional)" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {ACCOUNT_TYPE_SUBTYPES[watchedType]?.subtypes.map((subtype) => (
                            <SelectItem key={subtype} value={subtype}>
                              {subtype.replace(/_/g, ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {field.value && (
                        <Badge variant="secondary" className="w-fit text-xs">
                          {field.value.replace(/_/g, ' ')}
                        </Badge>
                      )}
                    </div>
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  Specific account subtype for better categorization
                </p>
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
                      placeholder="e.g., Bank of America"
                      {...register('institutionName')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      placeholder="****1234"
                      {...register('accountNumber')}
                    />
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
                        rows={3}
                      />
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
        )}
      </DialogContent>
    </Dialog>
  );
}
