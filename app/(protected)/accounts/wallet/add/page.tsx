'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Wallet,
  Shield,
  Building,
  Server,
  Coins,
  CheckCircle,
  AlertCircle,
  Loader2,
  CheckCircle2,
  PlusCircle,
  PlusIcon
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import posthog from 'posthog-js';

import { useOrganizationCreateCryptoWallet } from '@/lib/queries/use-organization-data-context';
import type { WalletType, NetworkType } from '@/lib/types/crypto';
import React from 'react';
import { ZERION_CHAINS } from '@/lib/constants/chains';
import { NetworkSelector } from '@/components/crypto/ui/network-selector';
import { cn } from '@/lib/utils';
import { SolarWalletBoldDuotone } from '@/components/icons/icons';
import { PlanLimitDialog, usePlanLimitDialog } from '@/components/ui/plan-limit-dialog';
import { handlePlanLimitError } from '@/lib/utils/plan-limit-handler';
import { useSubscriptionPlans, useUpgradeBillingSubscription } from '@/lib/queries/use-billing-subscription-data';
import { DebugPlanLimit } from '@/components/ui/debug-plan-limit';

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

const NETWORKS = [
  { value: 'ETHEREUM', label: 'Ethereum', color: 'bg-blue-100 text-blue-800' },
  { value: 'POLYGON', label: 'Polygon', color: 'bg-purple-100 text-purple-800' },
  { value: 'BSC', label: 'Binance Smart Chain', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'ARBITRUM', label: 'Arbitrum', color: 'bg-blue-100 text-blue-800' },
  { value: 'OPTIMISM', label: 'Optimism', color: 'bg-red-100 text-red-800' },
  { value: 'AVALANCHE', label: 'Avalanche', color: 'bg-red-100 text-red-800' },
  { value: 'SOLANA', label: 'Solana', color: 'bg-green-100 text-green-800' },
  { value: 'BITCOIN', label: 'Bitcoin', color: 'bg-orange-100 text-orange-800' },
] as const;

export default function AddWalletPage() {
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(false);
  const [addressStatus, setAddressStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [searchTerm, setSearchTerm] = useState("");

  const { mutate: createWallet, isPending } = useOrganizationCreateCryptoWallet();

  // PRODUCTION-GRADE: Only fetch specific data needed, not full subscription
  const { data: plans = [] } = useSubscriptionPlans();
  const { mutateAsync: upgradeSubscription } = useUpgradeBillingSubscription();
  const planLimitDialog = usePlanLimitDialog();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
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
      // Basic format validation based on network
      let isValid = false;
      
      if (network === 'ETHEREUM' || network === 'POLYGON' || network === 'BSC' || 
          network === 'ARBITRUM' || network === 'OPTIMISM' || network === 'AVALANCHE') {
        // EVM address format
        isValid = /^0x[a-fA-F0-9]{40}$/.test(address);
      } else if (network === 'SOLANA') {
        // Solana address format
        isValid = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
      } else if (network === 'BITCOIN') {
        // Bitcoin address format
        isValid = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/.test(address);
      }
      
      setAddressStatus(isValid ? 'valid' : 'invalid');
    } catch (error) {
      setAddressStatus('invalid');
    } finally {
      setIsValidating(false);
    }
  };

  // Validate address when it changes
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
    posthog.capture('add-wallet-form-submitted', {
        wallet_type: data.type,
        network: data.network,
        has_label: !!data.label,
        has_tags: !!data.tags,
        has_notes: !!data.notes,
    });
    try {
      const formattedData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined,
      };

      // ✅ Use TanStack Query mutation
      createWallet(formattedData, {
        onSuccess: () => {
          toast.success('Wallet added successfully!');
          router.push('/accounts/wallet');
        },
        onError: (err: Error) => {
          // Handle plan limit errors
          const planLimitError = handlePlanLimitError(err, 'wallet-creation', planLimitDialog.showDialog);

          if (planLimitError) {
            return; // Plan limit dialog is shown
          }

          toast.error((err as { message?: string })?.message || 'Failed to add wallet. Please try again.');
        }
      });
    } catch (error: unknown) {
      // This should not be reached since errors are handled in onError callback
      console.error('Unexpected create wallet error:', error);
    }
  };

  const handleUpgrade = async (planType: string) => {
    posthog.capture('plan-upgrade-initiated', {
        plan_type: planType,
        source: 'add-wallet-limit'
    });
    try {
      await upgradeSubscription({
        planType,
        billingPeriod: 'MONTHLY'
      });

      toast.success(`Successfully upgraded to ${planType} plan!`);
      planLimitDialog.hideDialog();
    } catch (error) {
      console.error('Upgrade error:', error);
      toast.error('Failed to upgrade plan. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Main Form Card */}
      <Card>
        <CardHeader className='flex justify-between'>
          <div className="flex gap-3">
            <div className="h-12 w-12 bg-gradient-to-br from-orange-500/70 to-pink-600/70 rounded-xl flex items-center justify-center">
              <SolarWalletBoldDuotone className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Add New Wallet</CardTitle>
              <CardDescription className='text-xs'>
                Connect a crypto wallet to track your portfolio
              </CardDescription>
            </div>
          </div>
          <NetworkSelector
            defaultNetworkId="ethereum"
            onChange={(id) => setValue("network", id?.toUpperCase() as NetworkType)}
          />
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
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
                      <SelectTrigger className="h-16 cursor-ponter">
                        <SelectValue placeholder="Select wallet type">
                          {field.value && (
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                {(() => {
                                  const walletType = WALLET_TYPES.find(type => type.value === field.value);
                                  return walletType ? <walletType.icon className="h-4 w-4" /> : null;
                                })()}
                              </div>
                              <span className="font-medium">
                                {WALLET_TYPES.find(type => type.value === field.value)?.label}
                              </span>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {WALLET_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground cursor-pointer">
                                <type.icon className="h-5 w-5" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-sm">{type.label}</span>
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
            
            <Separator />

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="defi, trading, personal (comma separated)"
                  {...register('tags')}
                />
                <p className="text-sm text-muted-foreground">
                  Add tags to help organize your wallets
                </p>
              </div>
              

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes about this wallet..."
                  {...register('notes')}
                  className={errors.notes ? 'border-red-500' : ''}
                />
                {errors.notes && (
                  <p className="text-sm text-red-600">{errors.notes.message}</p>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isPending}
                className=""
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || isValidating || (watchedAddress && addressStatus === 'invalid')}
                className="flex items-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <PlusIcon className="h-4 w-4" />
                    Add Wallet
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Debug Tool - Remove in production */}
      <DebugPlanLimit />

      {/* Plan Limit Dialog */}
      {planLimitDialog.error && (
        <PlanLimitDialog
          open={planLimitDialog.isOpen}
          onClose={planLimitDialog.hideDialog}
          error={planLimitDialog.error}
          availablePlans={plans}
          onUpgrade={handleUpgrade}
          isUpgrading={isPending}
        />
      )}
    </div>
  );
}
