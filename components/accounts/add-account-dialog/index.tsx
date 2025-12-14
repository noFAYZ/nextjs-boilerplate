'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  useCreateManualAccount,
  useAllAccounts,
  useCreateCryptoWallet,
  useInvalidateTransactionCache,
} from '@/lib/queries';
import { usePlaidIntegration } from '@/lib/hooks/use-plaid-integration';
import { AccountForm } from './account-form';
import { StatementUpload } from './statement-upload';
import { SuccessScreen } from './success-screen';
import { InitialView } from './initial-view';
import { ManualAccountSelection } from './manual-account-selection';
import { AccountTypeSelection } from './account-type-selection';
import { shouldShowBankStatementUpload } from './utils';
import { PlaidErrorScreen } from './plaid-error-screen';
import { CryptoWalletForm } from './crypto-wallet-form';

interface AddAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Form validation schema
const accountSchema = z.object({
  name: z.string().min(1, 'Account name is required').max(100, 'Name too long'),
  type: z.string().min(1, 'Account type is required'),
  balance: z.number().min(0, 'Balance must be a positive number'),
  currency: z.string().min(1, 'Currency is required'),
  accountSource: z.enum(['MANUAL', 'LINKED']).default('MANUAL'),
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

export function AddAccountDialog({ open, onOpenChange }: AddAccountDialogProps) {
  const router = useRouter();
  const [view, setView] = useState<'initial' | 'manual'>('initial');
  const [step, setStep] = useState<'selection' | 'accountType' | 'form' | 'statement-upload' | 'success' | 'plaid-success' | 'plaid-error' | 'crypto'>('selection');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'ASSETS' | 'LIABILITIES' | null>(null);
  const [selectedCategoryItem, setSelectedCategoryItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [plaidError, setPlaidError] = useState<string | null>(null);
  const [createdAccountName, setCreatedAccountName] = useState<string>('');
  const [plaidResult, setPlaidResult] = useState<{ success: boolean; accounts?: Array<Record<string, unknown>>; error?: unknown } | null>(null);

  const { mutate: createAccount, isPending } = useCreateManualAccount();
  const { refetch: refetchAccounts } = useAllAccounts();
  const { invalidateAll: invalidateTransactions } = useInvalidateTransactionCache();

  const { open: openPlaidLink, loading: plaidLoading, error: plaidLinkError, isReady: plaidReady } = usePlaidIntegration({
    onSuccess: (accounts) => {
      // Success handled in onPlaidClose callback
    },
    onError: (error: unknown) => {
      // Error handled in onPlaidClose callback
    },
    onExit: () => {
      // Plaid link closed
    },
    onPlaidOpen: () => {
      // Close dialog when Plaid opens
      onOpenChange(false);
    },
    onPlaidClose: (result) => {
      // Store result and reopen dialog
      setPlaidResult(result);
      if (result.success) {
        toast.success(`Successfully connected ${result.accounts?.length || 1} account(s)!`);
        setStep('plaid-success');
      } else {
        const errorMsg = result.error?.error_message || result.error?.error || 'Failed to connect account. Please try again.';
        toast.error(errorMsg);
        setStep('plaid-error');
        setPlaidError(errorMsg);
      }
      // Reopen dialog
      onOpenChange(true);
      // Refetch accounts and invalidate caches with a small delay to allow backend processing
      setTimeout(() => {
        refetchAccounts();
        invalidateTransactions();
      }, 500);
    },
  });

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
      accountSource: 'MANUAL',
    },
  });

  const handleSelectCategoryItem = (
    categoryKey: 'ASSETS' | 'LIABILITIES',
    categoryItem: { id: string; name: string; subtypes: Array<{ value: string; label: string }> }
  ) => {
    setSelectedCategory(categoryKey);
    setSelectedCategoryItem(categoryItem.id);
    setStep('accountType');
  };

  const handleSelectAccountType = (type: string) => {
    setSelectedType(type);
    setValue('type', type);
    setStep('form');
  };

  const handleBack = () => {
    if (step === 'form') {
      setStep('accountType');
    } else if (step === 'accountType') {
      setSelectedCategoryItem(null);
      setStep('selection');
    } else if (step === 'statement-upload') {
      setStep('success');
    } else if (step === 'crypto') {
      setView('initial');
      setStep('selection');
    } else if (step === 'selection' && view === 'manual') {
      setView('initial');
      setStep('selection');
    }
    reset();
  };

  const handleManualAccountClick = () => {
    setView('manual');
    setStep('selection');
  };

  const onSubmit = useCallback((data: AccountFormData) => {
    createAccount(data, {
      onSuccess: () => {
        toast.success('Account created successfully!');
        setCreatedAccountName(data.name);
        // Show statement upload step for bank accounts
        if (shouldShowBankStatementUpload(data.type)) {
          setStep('statement-upload');
        } else {
          setStep('success');
        }
        // Refetch accounts and invalidate related caches
        refetchAccounts();
        invalidateTransactions();
      },
      onError: (error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
        toast.error(errorMessage);
      },
    });
  }, [createAccount, refetchAccounts, invalidateTransactions]);

  const handleSuccessClose = () => {
    reset();
    setStep('selection');
    setSelectedType(null);
    setSelectedCategory(null);
    setSelectedCategoryItem(null);
    setView('initial');
    setCreatedAccountName('');
    onOpenChange(false);
  };

  const handlePlaidResultClose = () => {
    setPlaidResult(null);
    setPlaidError(null);
    setView('initial');
    setStep('selection');
    setSelectedType(null);
    setSelectedCategory(null);
    setSelectedCategoryItem(null);
    reset();
    onOpenChange(false);
  };

  const handleClose = () => {
    setView('initial');
    setStep('selection');
    setSelectedType(null);
    setSelectedCategory(null);
    setSelectedCategoryItem(null);
    reset();
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* INITIAL VIEW */}
        {view === 'initial' && step === 'selection' && (
          <InitialView
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            plaidError={plaidError}
            plaidLinkError={plaidLinkError}
            plaidReady={plaidReady}
            plaidLoading={plaidLoading}
            openPlaidLink={openPlaidLink}
            handleManualAccountClick={handleManualAccountClick}
            handleAddCryptoWallet={() => setStep('crypto')}
          />
        )}

        {/* MANUAL ACCOUNT SELECTION */}
        {view === 'manual' && step === 'selection' && (
          <ManualAccountSelection
            selectedCategory={selectedCategory}
            selectedCategoryItem={selectedCategoryItem}
            handleSelectCategoryItem={handleSelectCategoryItem}
            handleBack={handleBack}
          />
        )}

        {/* ACCOUNT TYPE SELECTION */}
        {step === 'accountType' && selectedCategory && selectedCategoryItem && (
          <AccountTypeSelection
            selectedCategory={selectedCategory}
            selectedCategoryItem={selectedCategoryItem}
            handleSelectAccountType={handleSelectAccountType}
            handleBack={handleBack}
          />
        )}

        {/* FORM */}
        {step === 'form' && (
          <AccountForm
            onSubmit={handleSubmit(onSubmit)}
            onBack={handleBack}
            register={register}
            watch={watch}
            control={control}
            errors={errors}
            isPending={isPending}
          />
        )}

        {/* STATEMENT UPLOAD */}
        {step === 'statement-upload' && (
          <StatementUpload
            onSkip={() => setStep('success')}
            onBack={handleBack}
          />
        )}

        {/* SUCCESS */}
        {step === 'success' && (
          <SuccessScreen
            accountName={createdAccountName}
            selectedType={selectedType}
            onAddAnother={() => {
              reset();
              setStep('selection');
              setSelectedType(null);
              setSelectedCategory(null);
              setSelectedCategoryItem(null);
              setView('manual');
            }}
            onDone={handleSuccessClose}
          />
        )}

        {/* PLAID SUCCESS */}
        {step === 'plaid-success' && plaidResult?.success && (
          <SuccessScreen
            accountName=""
            selectedType={null}
            isPlaidSuccess={true}
            plaidAccounts={plaidResult.accounts}
            onAddAnother={() => {
              setPlaidResult(null);
              setView('initial');
              setStep('selection');
            }}
            onDone={handlePlaidResultClose}
          />
        )}

        {/* PLAID ERROR */}
        {step === 'plaid-error' && !plaidResult?.success && (
          <PlaidErrorScreen
            plaidError={plaidError}
            plaidResult={plaidResult}
            onTryAgain={() => {
              setPlaidResult(null);
              setPlaidError(null);
              setView('initial');
              setStep('selection');
            }}
            onDone={handlePlaidResultClose}
          />
        )}

        {/* CRYPTO WALLET */}
        {step === 'crypto' && (
          <CryptoWalletForm
            onSuccess={() => {
              toast.success('Wallet added successfully!');
              setStep('selection');
              setView('initial');
              refetchAccounts();
              invalidateTransactions();
            }}
            onBack={handleBack}
          />
        )}
      </DialogContent>
      </Dialog>
    </>
  );
}
