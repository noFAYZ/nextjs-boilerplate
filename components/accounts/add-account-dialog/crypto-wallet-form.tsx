'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Wallet,
  Shield,
  Building,
  Server,
  Coins,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCreateCryptoWallet } from '@/lib/queries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { NetworkType } from '@/lib/types/crypto';

// Form validation schema
const walletSchema = z.object({
  name: z.string().min(1, 'Wallet name is required').max(50, 'Name too long'),
  address: z.string()
    .min(1, 'Wallet address is required')
    .regex(/^0x[a-fA-F0-9]{40}$|^[1-9A-HJ-NP-Za-km-z]{25,62}$/, 'Invalid wallet address format'),
  type: z.enum(['HOT_WALLET', 'COLD_WALLET', 'EXCHANGE', 'MULTI_SIG', 'SMART_CONTRACT'] as const),
  network: z.enum(['ETHEREUM', 'POLYGON', 'BSC', 'ARBITRUM', 'OPTIMISM', 'AVALANCHE', 'SOLANA', 'BITCOIN'] as const),
  label: z.string().max(30, 'Label too long').optional(),
  notes: z.string().max(500, 'Notes too long').optional(),
  tags: z.string().optional(),
});

type WalletFormData = z.infer<typeof walletSchema>;

const WALLET_TYPES = [
  { value: 'HOT_WALLET', label: 'Hot Wallet', icon: Wallet, description: 'Software wallet connected to the internet' },
  { value: 'COLD_WALLET', label: 'Cold Wallet', icon: Shield, description: 'Hardware wallet or offline storage' },
  { value: 'EXCHANGE', label: 'Exchange Wallet', icon: Building, description: 'Wallet on a centralized exchange' },
  { value: 'MULTI_SIG', label: 'Multi-Signature', icon: Server, description: 'Wallet requiring multiple signatures' },
  { value: 'SMART_CONTRACT', label: 'Smart Contract', icon: Coins, description: 'Contract-based wallet' },
] as const;

interface CryptoWalletFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

interface LimitExceededError {
  currentCount: number;
  limit: number;
  planType: string;
}

export function CryptoWalletForm({ onSuccess, onBack }: CryptoWalletFormProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [addressStatus, setAddressStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [limitExceededError, setLimitExceededError] = useState<LimitExceededError | null>(null);

  const { mutate: createWallet, isPending } = useCreateCryptoWallet();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<WalletFormData>({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      type: 'HOT_WALLET',
      network: 'ETHEREUM',
    }
  });

  const watchedAddress = watch('address');
  const watchedNetwork = watch('network');

  // Validate wallet address format
  const validateAddress = async (address: string, network: NetworkType) => {
    if (!address) return;

    setIsValidating(true);
    try {
      let isValid = false;

      if (network === 'ETHEREUM' || network === 'POLYGON' || network === 'BSC' ||
          network === 'ARBITRUM' || network === 'OPTIMISM' || network === 'AVALANCHE') {
        isValid = /^0x[a-fA-F0-9]{40}$/.test(address);
      } else if (network === 'SOLANA') {
        isValid = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
      } else if (network === 'BITCOIN') {
        isValid = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/.test(address);
      }

      setAddressStatus(isValid ? 'valid' : 'invalid');
    } catch (error) {
      setAddressStatus('invalid');
    } finally {
      setIsValidating(false);
    }
  };

  React.useEffect(() => {
    if (watchedAddress && watchedNetwork) {
      const timeoutId = setTimeout(() => {
        validateAddress(watchedAddress, watchedNetwork);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setAddressStatus('idle');
    }
  }, [watchedAddress, watchedNetwork]);

  const onSubmit = async (data: WalletFormData) => {
    const formattedData = {
      ...data,
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined,
    };

    createWallet(formattedData, {
      onSuccess: () => {
        reset();
        onSuccess();
      },
      onError: (error: any) => {
        console.error('❌ Create wallet error:', error);
        console.log('Error type:', typeof error);
        console.log('Error keys:', Object.keys(error || {}));

        // The error structure from the mutation is the response object
        // Check all possible locations for the error code
        const code = error?.code;
        const details = error?.details;
        const message = error?.message;

        console.log('Extracted - Code:', code, 'Details:', details);

        if (code === 'WALLET_LIMIT_EXCEEDED' && details) {
          console.log('✅ Showing upgrade screen for wallet limit');
          setLimitExceededError({
            currentCount: details.currentCount,
            limit: details.limit,
            planType: details.planType,
          });
          return;
        }

        // Show toast for other errors
        console.log('Showing toast error:', message);
        toast.error(message || 'Failed to add wallet');
      }
    });
  };

  // Show upgrade screen if wallet limit exceeded
  if (limitExceededError) {
    return (
      <>
        <DialogHeader className='pb-4 flex flex-row items-center gap-3'>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setLimitExceededError(null)}
            className="h-8 w-8 -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <DialogTitle className="text-sm">Wallet Limit Reached</DialogTitle>
          </div>
        </DialogHeader>

        <div className="px-6 py-8 space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Lock className="h-8 w-8 text-amber-600 dark:text-amber-500" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-semibold">Wallet Limit Reached</h2>
            <p className="text-sm text-muted-foreground">
              Your current plan allows you to add up to <span className="font-semibold text-foreground">{limitExceededError.limit}</span> crypto wallet{limitExceededError.limit !== 1 ? 's' : ''}.
            </p>
          </div>

          {/* Plan Info Card */}
          <Card className="border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Plan</span>
                <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900">
                  {limitExceededError.planType}
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-muted-foreground">Wallets Used</span>
                <span className="text-sm font-semibold text-foreground">
                  {limitExceededError.currentCount} / {limitExceededError.limit}
                </span>
              </div>

              <Separator className="bg-amber-200 dark:bg-amber-900/30" />

              <div className="text-sm text-center text-amber-800 dark:text-amber-300">
                Upgrade your plan to add more wallets and unlock additional features.
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setLimitExceededError(null);
              }}
            >
              Try Another Wallet
            </Button>
            <Button
              type="button"
              className="flex-1"
              onClick={() => {
                // Navigate to subscription page
                window.location.href = '/subscriptions';
              }}
            >
              Upgrade Plan
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DialogHeader className='pb-4 flex flex-row items-center gap-3'>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onBack}
          className="h-8 w-8 -ml-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <DialogTitle className="text-sm">Add Crypto Wallet</DialogTitle>

        </div>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold">Basic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Wallet Name *</Label>
              <Input
                id="name"
                placeholder="My Primary Wallet"
                {...register('name')}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                placeholder="Personal"
                {...register('label')}
                className={errors.label ? 'border-red-500' : ''}
              />
              {errors.label && (
                <p className="text-sm text-red-600">{errors.label.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Wallet Address *</Label>
            <div className="relative">
              <Input
                id="address"
                placeholder="0x742d3ab8..."
                {...register('address')}
                className={`pr-10 ${
                  errors.address ? 'border-red-500' :
                  addressStatus === 'valid' ? 'border-green-500' :
                  addressStatus === 'invalid' ? 'border-red-500' : ''
                }`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isValidating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                {!isValidating && addressStatus === 'valid' && <CheckCircle className="h-4 w-4 text-green-600" />}
                {!isValidating && addressStatus === 'invalid' && <AlertCircle className="h-4 w-4 text-red-600" />}
              </div>
            </div>
            {errors.address && (
              <p className="text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>
        </div>

        <Separator />

        {/* Wallet Type Selection */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-base font-semibold">Wallet Type</h3>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger size='sm'>
                    <SelectValue placeholder="Select wallet type">
                      {field.value && (
                        <div className="flex items-center gap-3 cursor-pointer">
                          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-muted-foreground">
                            {(() => {
                              const walletType = WALLET_TYPES.find(type => type.value === field.value);
                              return walletType ? <walletType.icon className="h-4 w-4" /> : null;
                            })()}
                          </div>
                          <span className="font-semibold text-xs">
                            {WALLET_TYPES.find(type => type.value === field.value)?.label}
                          </span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {WALLET_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value} className='cursor-pointer'>
                        <div className="flex items-center gap-3">
                          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-muted text-muted-foreground">
                            <type.icon className="h-3.5 w-3.5" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium">{type.label}</p>
                            <p className="text-xs text-muted-foreground">{type.description}</p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold">Network</h3>
            <Controller
              name="network"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger size='sm'>
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ETHEREUM">Ethereum</SelectItem>
                    <SelectItem value="POLYGON">Polygon</SelectItem>
                    <SelectItem value="BSC">Binance Smart Chain</SelectItem>
                    <SelectItem value="ARBITRUM">Arbitrum</SelectItem>
                    <SelectItem value="OPTIMISM">Optimism</SelectItem>
                    <SelectItem value="AVALANCHE">Avalanche</SelectItem>
                    <SelectItem value="SOLANA">Solana</SelectItem>
                    <SelectItem value="BITCOIN">Bitcoin</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold">Additional Information</h3>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this wallet..."
              {...register('notes')}
              className={`min-h-24 ${errors.notes ? 'border-red-500' : ''}`}
            />
            {errors.notes && (
              <p className="text-sm text-red-600">{errors.notes.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              placeholder="trading, vault, personal"
              {...register('tags')}
            />
          </div>
        </div>

        <Separator />

        {/* Form Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
         
            size='sm'
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            type="submit"
          
            size='sm'
            disabled={isPending || isSubmitting}
          >
            {isPending || isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Wallet'
            )}
          </Button>
        </div>
      </form>
    </>
  );
}
