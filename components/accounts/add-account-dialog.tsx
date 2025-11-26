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

  const handleDirectTypeSelect = (type: string, category: 'ASSETS' | 'LIABILITIES') => {
    setSelectedType(type);
    setSelectedCategory(category);
    setValue('type', type as any);
    setStep('form');
  };

  const handleBack = () => {
    if (step === 'form') {
      if (view === 'manual') {
        // In manual mode, go back to account type selection
        setStep('selection');
      } else {
        // In initial mode, go back through accountType step
        setStep('accountType');
      }
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
        {/* INITIAL VIEW - Connect accounts, Import, or Add Manual */}
        {view === 'initial' && step === 'selection' && (
          <>
            <DialogHeader className="pb-6">
              <DialogTitle className="text-2xl font-bold">Add an Account</DialogTitle>
              <p className="text-sm text-muted-foreground mt-2">Choose how you want to add your account</p>
            </DialogHeader>

            <div className="space-y-3">
              {/* CONNECT ACCOUNT OPTION */}
              <button
                onClick={() => {}}
                className={cn(
                  'group relative w-full p-5 rounded-xl border-2 border-border transition-all duration-200',
                  'hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg hover:shadow-blue-500/10',
                  'bg-card hover:bg-blue-50 dark:hover:bg-blue-950/20 cursor-pointer'
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Icon Container */}
                  <div className="flex-shrink-0">
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
                      <Building2 className="h-6 w-6" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-base text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Connect Account
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 group-hover:text-muted-foreground/80 transition-colors">
                      Link your bank, investment, or credit accounts securely
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
                        Banks
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
                        Investments
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
                        More
                      </Badge>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0 pt-2">
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </div>
                </div>
              </button>

              {/* IMPORT OPTION */}
              <button
                onClick={() => {}}
                className={cn(
                  'group relative w-full p-5 rounded-xl border-2 border-border transition-all duration-200',
                  'hover:border-green-400 dark:hover:border-green-600 hover:shadow-lg hover:shadow-green-500/10',
                  'bg-card hover:bg-green-50 dark:hover:bg-green-950/20 cursor-pointer'
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Icon Container */}
                  <div className="flex-shrink-0">
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white shadow-lg shadow-green-500/30 group-hover:shadow-green-500/50 transition-shadow">
                      <Upload className="h-6 w-6" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-base text-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      Import from File
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 group-hover:text-muted-foreground/80 transition-colors">
                      Bulk import accounts from CSV or spreadsheet files
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
                        CSV
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
                        Excel
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
                        Quick
                      </Badge>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0 pt-2">
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
                  </div>
                </div>
              </button>

              {/* ADD MANUAL ACCOUNT OPTION */}
              <button
                onClick={handleManualAccountClick}
                className={cn(
                  'group relative w-full p-5 rounded-xl border-2 transition-all duration-200',
                  'border-orange-300 dark:border-orange-700/50 hover:border-orange-400 dark:hover:border-orange-500',
                  'bg-orange-50/50 dark:bg-orange-950/20 hover:bg-orange-100/70 dark:hover:bg-orange-950/40',
                  'hover:shadow-lg hover:shadow-orange-500/15 cursor-pointer'
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Icon Container */}
                  <div className="flex-shrink-0">
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-shadow">
                      <Plus className="h-6 w-6" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-base text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      Add Manually
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 group-hover:text-muted-foreground/80 transition-colors">
                      Create a custom account entry for any financial account type
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="outline" className="text-xs bg-orange-100 dark:bg-orange-950/40 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300">
                        Cash
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-orange-100 dark:bg-orange-950/40 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300">
                        Assets
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-orange-100 dark:bg-orange-950/40 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300">
                        Loans
                      </Badge>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0 pt-2">
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors" />
                  </div>
                </div>
              </button>
            </div>
          </>
        )}

        {/* MANUAL ACCOUNT FLOW - Choose Account Type Directly */}
        {view === 'manual' && step === 'selection' && (
          <>
            <DialogHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={handleBack} className="h-8 w-8 p-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <DialogTitle className="text-lg">Add manual account</DialogTitle>
                  <p className="text-xs text-muted-foreground mt-1">Select account type</p>
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
                      onClick={() => handleDirectTypeSelect(category.type, 'ASSETS')}
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
                      onClick={() => handleDirectTypeSelect(category.type, 'LIABILITIES')}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
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
                    <div className="space-y-2">
                      <Select onValueChange={field.onChange} value={field.value || undefined}>
                        <SelectTrigger size="sm" className="w-full">
                          <SelectValue placeholder="Select type (optional)" />
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
              </div>

              <Separator />

              {/* Account Type Specific Fields */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {watchedType === 'CHECKING' || watchedType === 'SAVINGS' ? 'Bank Account Details' :
                   watchedType === 'INVESTMENT' ? 'Investment Account Details' :
                   watchedType === 'CRYPTO' ? 'Wallet Details' :
                   watchedType === 'CREDIT_CARD' ? 'Credit Card Details' :
                   watchedType === 'LOAN' || watchedType === 'MORTGAGE' ? 'Loan Details' :
                   'Asset Details'}
                </h3>

                {/* CHECKING/SAVINGS Fields */}
                {(watchedType === 'CHECKING' || watchedType === 'SAVINGS') && (
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

                {/* INVESTMENT Fields */}
                {watchedType === 'INVESTMENT' && (
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
                {watchedType === 'CRYPTO' && (
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

                {/* CREDIT_CARD Fields */}
                {watchedType === 'CREDIT_CARD' && (
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

                {/* LOAN/MORTGAGE Fields */}
                {(watchedType === 'LOAN' || watchedType === 'MORTGAGE') && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="institutionName">Lender Name</Label>
                        <Input
                          id="institutionName"
                          placeholder={watchedType === 'MORTGAGE' ? 'e.g., Wells Fargo Mortgage' : 'e.g., SoFi, LendingClub'}
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

                {/* REAL_ESTATE/VEHICLE/OTHER_ASSET Fields */}
                {(watchedType === 'REAL_ESTATE' || watchedType === 'VEHICLE' || watchedType === 'OTHER_ASSET') && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="assetDescription">
                        {watchedType === 'REAL_ESTATE' ? 'Property Description' :
                         watchedType === 'VEHICLE' ? 'Vehicle Details' :
                         'Asset Description'}
                      </Label>
                      <Textarea
                        id="assetDescription"
                        placeholder={
                          watchedType === 'REAL_ESTATE' ? 'e.g., 3-bedroom house with 2-car garage' :
                          watchedType === 'VEHICLE' ? 'e.g., 2022 Tesla Model 3, Black, Excellent condition' :
                          'Describe the asset...'
                        }
                        {...register('assetDescription')}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="originalValue">
                          {watchedType === 'REAL_ESTATE' ? 'Purchase Price' :
                           watchedType === 'VEHICLE' ? 'Original Cost' :
                           'Original Value'}
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
                          {watchedType === 'VEHICLE' ? 'Purchase Date' : 'Acquired Date'}
                        </Label>
                        <Input
                          id="purchaseDate"
                          type="date"
                          {...register('purchaseDate')}
                        />
                      </div>
                    </div>

                    {watchedType === 'REAL_ESTATE' && (
                      <div className="space-y-2">
                        <Label htmlFor="address">Property Address</Label>
                        <Input
                          id="address"
                          placeholder="123 Main Street"
                          {...register('address')}
                        />
                      </div>
                    )}

                    {watchedType === 'VEHICLE' && (
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
                      </>
                    )}

                    {(watchedType === 'REAL_ESTATE' || watchedType === 'VEHICLE') && (
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
                          <Input id="country" {...register('country')} />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input id="postalCode" {...register('postalCode')} />
                        </div>
                      </div>
                    )}
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
