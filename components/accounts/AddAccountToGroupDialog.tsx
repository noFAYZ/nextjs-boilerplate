"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Building2,
  Wallet,
  Plus,
  Loader2,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  X,
  Search,
  Filter,
} from 'lucide-react';
import Link from 'next/link';
import { useAccountGroupMutations } from '@/lib/hooks/use-account-groups';
import { useOrganizationCryptoWallets } from '@/lib/queries/use-organization-data-context';
import type { AccountGroup } from '@/lib/types/account-groups';
import type { CryptoWallet } from '@/lib/types/crypto';
import { Input } from '@/components/ui/input';
import { StreamlineFlexWallet } from '../icons/icons';

const addAccountSchema = z.object({
  accountId: z.string().min(1, 'Please select an account'),
  accountType: z.enum(['financial', 'crypto']),
});

type AddAccountForm = z.infer<typeof addAccountSchema>;

interface AddAccountToGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: AccountGroup | null;
  onSuccess: () => void;
}

// Mock financial accounts - in real app, you'd fetch these
const mockFinancialAccounts = [
  {
    id: 'acc1',
    name: 'Chase Checking',
    institutionName: 'Chase Bank',
    type: 'CHECKING',
    balance: 2500.75,
    currency: 'USD',
    groupId: null,
  },
  {
    id: 'acc2', 
    name: 'Savings Account',
    institutionName: 'Bank of America',
    type: 'SAVINGS',
    balance: 15000.00,
    currency: 'USD',
    groupId: null,
  },
];

export function AddAccountToGroupDialog({
  open,
  onOpenChange,
  group,
  onSuccess,
}: AddAccountToGroupDialogProps) {
  const [activeTab, setActiveTab] = useState('existing');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterNetwork, setFilterNetwork] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { moveAccount, isMoving } = useAccountGroupMutations();
  
  // Get crypto wallets (organization-aware)
  const { data: wallets = [], isLoading: isLoadingWallets } = useOrganizationCryptoWallets();
  
  // Filter out wallets that are already in groups
  const availableWallets = useMemo(() => {
    let filtered = wallets?.filter(wallet => !(wallet as any).groupId) || [];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(wallet => 
        wallet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wallet.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wallet.network.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply network filter
    if (filterNetwork && filterNetwork !== 'all') {
      filtered = filtered.filter(wallet => wallet.network === filterNetwork);
    }
    
    return filtered;
  }, [wallets, searchQuery, filterNetwork]);
  
  // Filter out financial accounts that are already in groups  
  const availableFinancialAccounts = useMemo(() => {
    let filtered = mockFinancialAccounts.filter(account => !account.groupId);
    
    // Apply search filter for financial accounts
    if (searchQuery) {
      filtered = filtered.filter(account =>
        account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [searchQuery]);

  // Get unique networks for filtering
  const availableNetworks = useMemo(() => {
    const networks = new Set((wallets || []).map(wallet => wallet.network));
    return Array.from(networks);
  }, [wallets]);

  const form = useForm<AddAccountForm>({
    resolver: zodResolver(addAccountSchema),
    defaultValues: {
      accountId: '',
      accountType: 'crypto',
    },
  });

  const watchedAccountType = form.watch('accountType');

  const onSubmit = async (data: AddAccountForm) => {
    if (!group) return;

    setError(null);
    setSuccess(null);

    try {
      const response = await moveAccount({
        accountId: data.accountId,
        groupId: group.id,
        accountType: data.accountType,
      });

      if (response.success) {
        const accountName = data.accountType === 'crypto' 
          ? availableWallets.find(w => w.id === data.accountId)?.name
          : availableFinancialAccounts.find(a => a.id === data.accountId)?.name;
        
        setSuccess(`Successfully added ${accountName} to ${group.name}`);
        
        // Auto-close after showing success message
        setTimeout(() => {
          onSuccess();
          form.reset();
          setActiveTab('existing');
          setSuccess(null);
          setError(null);
          setSearchQuery('');
          setFilterNetwork('all');
        }, 1500);
      } else {
        setError(response.error?.message || 'Failed to add account to group. Please try again.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please check your connection and try again.');
      console.error('Error adding account to group:', error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    form.reset();
    setActiveTab('existing');
    setSearchQuery('');
    setFilterNetwork('all');
    setError(null);
    setSuccess(null);
  };

  // Reset form and state when dialog opens
  useEffect(() => {
    if (open) {
      form.reset();
      setSearchQuery('');
      setFilterNetwork('all');
      setError(null);
      setSuccess(null);
    }
  }, [open, form]);

  if (!group) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center text-lg"
              style={{
                backgroundColor: group.color ? `${group.color}20` : 'rgb(243 244 246)',
                color: group.color || 'rgb(107 114 128)',
              }}
            >
              {group.icon || '📁'}
            </div>
            <div className="text-lg font-semibold">Add Account to {group.name}</div>
          </DialogTitle>
          <DialogDescription>
            Add existing accounts or create new ones to organize in this group.
          </DialogDescription>
        </DialogHeader>

        {/* Success/Error Alerts */}
        {success && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2"
              onClick={() => setError(null)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" >
          <TabsList className="grid w-full grid-cols-2 h-12 p-2 items-center text-xs" >
            <TabsTrigger value="existing" className='text-xs'>Existing Accounts</TabsTrigger>
            <TabsTrigger value="new">Add New</TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Account Type Selection */}
                <FormField
                  control={form.control}
                  name="accountType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Account Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="crypto">
                            <div className="flex items-center gap-3">
                              <StreamlineFlexWallet className="h-5 w-5" />
                              <div>
                                <div className="font-medium">Crypto Wallets</div>
                                <div className="text-xs text-muted-foreground">
                                  {availableWallets.length} available
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="financial">
                            <div className="flex items-center gap-3">
                              <Building2 className="h-5 w-5" />
                              <div>
                                <div className="font-medium">Bank Accounts</div>
                                <div className="text-xs text-muted-foreground">
                                  {availableFinancialAccounts.length} available
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Search and Filter Controls */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={`Search ${watchedAccountType === 'crypto' ? 'wallets' : 'accounts'}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    {watchedAccountType === 'crypto' && availableNetworks.length > 1 && (
                      <Select value={filterNetwork} onValueChange={setFilterNetwork}>
                        <SelectTrigger className="w-[140px]">
                          <Filter className="h-4 w-4 mr-1" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Networks</SelectItem>
                          {availableNetworks.map((network) => (
                            <SelectItem key={network} value={network}>
                              {network}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  
                  {(searchQuery || filterNetwork !== 'all') && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        Showing {watchedAccountType === 'crypto' ? availableWallets.length : availableFinancialAccounts.length} 
                        {' '}of{' '} 
                        {watchedAccountType === 'crypto' ? wallets?.length || 0 : mockFinancialAccounts.length} 
                        {' '}{watchedAccountType === 'crypto' ? 'wallets' : 'accounts'}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-1 text-xs"
                        onClick={() => {
                          setSearchQuery('');
                          setFilterNetwork('all');
                        }}
                      >
                        Clear filters
                      </Button>
                    </div>
                  )}
                </div>

                {/* Account Selection - Card Based */}
                <FormField
                  control={form.control}
                  name="accountId"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-medium">
                        Select {watchedAccountType === 'crypto' ? 'Wallet' : 'Account'} to Add
                      </FormLabel>
                      
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {watchedAccountType === 'crypto' ? (
                          <>
                            {isLoadingWallets ? (
                              <div className="flex items-center justify-center py-8 text-muted-foreground">
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                Loading wallets...
                              </div>
                            ) : availableWallets.length === 0 ? (
                              <div className="text-center py-8">
                                <div className="text-muted-foreground">
                                  {searchQuery || filterNetwork !== 'all' 
                                    ? 'No wallets match your search criteria' 
                                    : 'No ungrouped wallets available'
                                  }
                                </div>
                                {searchQuery || filterNetwork !== 'all' ? (
                                  <Button
                                    variant="link"
                                    size="sm"
                                    onClick={() => {
                                      setSearchQuery('');
                                      setFilterNetwork('all');
                                    }}
                                    className="text-xs"
                                  >
                                    Clear filters to see all available wallets
                                  </Button>
                                ) : null}
                              </div>
                            ) : (
                              availableWallets.map((wallet: CryptoWallet) => (
                                <Card 
                                  key={wallet.id}
                                  className={`hover:shadow-sm  cursor-pointer py-0 ${
                                    field.value === wallet.id 
                                      ? 'border ring-primary bg-primary/10' 
                                      : 'hover:bg-muted/50'
                                  }`}
                                  onClick={() => field.onChange(wallet.id)}
                                >
                                  <CardContent className="p-3">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                          <StreamlineFlexWallet className="h-5 w-5 text-orange-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div className="font-medium truncate">{wallet.name}</div>
                                          <div className="text-sm text-muted-foreground">
                                            {wallet.network}
                                          </div>
                                          <div className="text-xs font-mono text-muted-foreground">
                                            {wallet.address.slice(0, 10)}...{wallet.address.slice(-6)}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="font-semibold">
                                          ${parseFloat(wallet.totalBalanceUsd).toLocaleString()}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          {wallet.assetCount} assets
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))
                            )}
                          </>
                        ) : (
                          <>
                            {availableFinancialAccounts.length === 0 ? (
                              <div className="text-center py-8 text-muted-foreground">
                                {searchQuery 
                                  ? 'No accounts match your search criteria' 
                                  : 'No ungrouped accounts available'
                                }
                                {searchQuery ? (
                                  <Button
                                    variant="link"
                                    size="sm"
                                    onClick={() => setSearchQuery('')}
                                    className="text-xs block"
                                  >
                                    Clear search to see all available accounts
                                  </Button>
                                ) : null}
                              </div>
                            ) : (
                              availableFinancialAccounts.map((account) => (
                                <Card 
                                  key={account.id}
                                  className={`cursor-pointer  hover:shadow-sm ${
                                    field.value === account.id 
                                      ? 'ring-2 ring-primary bg-primary/5' 
                                      : 'hover:bg-muted/50'
                                  }`}
                                  onClick={() => field.onChange(account.id)}
                                >
                                  <CardContent className="p-3">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                                          <Building2 className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div className="font-medium truncate">{account.name}</div>
                                          <div className="text-sm text-muted-foreground">
                                            {account.institutionName}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            {account.type}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="font-semibold">
                                          ${account.balance.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          {account.currency}
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))
                            )}
                          </>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Actions */}
                <div className="flex justify-between pt-6">
                  <div className="text-sm text-muted-foreground">
                    {form.watch('accountId') && (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        Ready to add to group
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      disabled={isMoving || success}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isMoving || !form.watch('accountId') || success}
                      className="min-w-[120px]"
                    >
                      {isMoving ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Adding...
                        </span>
                      ) : success ? (
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Added!
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Add to {group.name}
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="new" className="space-y-6">
            {/* Add New Account/Wallet Options */}
            <div className="space-y-4">
              <div className="text-center py-4">
                <h3 className="text-lg font-semibold mb-2">Create New Accounts</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Add new accounts or wallets that will be automatically organized in <span className="font-medium">{group.name}</span>
                </p>
                
                <div className="grid gap-4">
                  <Card className="hover:shadow-sm ">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <StreamlineFlexWallet className="h-5 w-5 text-orange-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Add Crypto Wallet</div>
                            <div className="text-sm text-muted-foreground">
                              Connect a wallet and track your crypto assets
                            </div>
                          </div>
                        </div>
                        <Button asChild size="sm">
                          <Link href="/accounts/wallet/add" target="_blank" className="inline-flex items-center">
                            Connect Wallet
                            <ExternalLink className="ml-2 h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="opacity-60">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Add Bank Account</div>
                            <div className="text-sm text-muted-foreground">
                              Link your traditional banking accounts
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                          <Button size="sm" disabled>
                            Connect Bank
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="opacity-60">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Add Exchange Account</div>
                            <div className="text-sm text-muted-foreground">
                              Connect your crypto exchange via API
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                          <Button size="sm" disabled>
                            Connect API
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>Tip:</strong> New accounts will be automatically added to this group after they're created.
                    You can change their group assignment later if needed.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}