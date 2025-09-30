'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  ArrowLeft,
  Users,
  Wallet,
  Building2,
  DollarSign,
  PieChart,
  Activity,
  Plus,
  Move,
  Trash2,
  Edit,
  RefreshCw,
  Download,
} from 'lucide-react';
import Link from 'next/link';
import { useAccountGroup } from '@/lib/hooks/use-account-groups';
import { useToast } from '@/lib/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { EditGroupDialog } from '@/components/accounts/EditGroupDialog';
import { GroupSettings } from '@/components/accounts/GroupSettings';
import { GroupAnalytics } from '@/components/accounts/GroupAnalytics';
import type { AccountGroup, FinancialAccount, CryptoWallet } from '@/lib/types/account-groups';

export default function GroupDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const groupId = params.groupId as string;
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch group data with all details
  const { group, isLoading, error, refetch } = useAccountGroup(groupId, {
    details: true,
    includeAccounts: true,
    includeWallets: true,
    includeChildren: true,
    includeCounts: true,
  });

  // Calculate statistics
  const stats = useMemo(() => {
    if (!group) return null;

    const financialAccounts = group.financialAccounts || [];
    const cryptoWallets = group.cryptoWallets || [];
    const childGroups = group.children || [];

    // Calculate total balances
    const totalFiatBalance = financialAccounts.reduce((sum, account) => sum + (account.balance || 0), 0);
    const totalCryptoBalance = cryptoWallets.reduce((sum, wallet) => sum + (wallet.totalBalanceUsd || 0), 0);
    const totalBalance = totalFiatBalance + totalCryptoBalance;

    // Calculate percentage distribution
    const fiatPercentage = totalBalance > 0 ? (totalFiatBalance / totalBalance) * 100 : 0;
    const cryptoPercentage = totalBalance > 0 ? (totalCryptoBalance / totalBalance) * 100 : 0;

    // Account type distribution
    const accountTypes = financialAccounts.reduce((acc, account) => {
      acc[account.type] = (acc[account.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Wallet type distribution
    const walletTypes = cryptoWallets.reduce((acc, wallet) => {
      acc[wallet.type] = (acc[wallet.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalAccounts: financialAccounts.length,
      totalWallets: cryptoWallets.length,
      totalChildGroups: childGroups.length,
      totalFiatBalance,
      totalCryptoBalance,
      totalBalance,
      fiatPercentage,
      cryptoPercentage,
      accountTypes,
      walletTypes,
      activeAccounts: financialAccounts.filter(a => a.isActive).length,
      activeWallets: cryptoWallets.filter(w => w.isActive).length,
    };
  }, [group]);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refetch();
      toast({
        title: 'Group data refreshed',
        description: 'The latest group information has been loaded.',
      });
    } catch {
      toast({
        title: 'Refresh failed',
        description: 'Failed to refresh group data.',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleEditGroup = () => {
    setIsEditDialogOpen(true);
  };

  const handleGroupUpdated = (updatedGroup: AccountGroup) => {
    // Refetch to get the latest data
    refetch();
    toast({
      title: 'Group updated',
      description: `Successfully updated "${updatedGroup.name}".`,
    });
  };

  const handleDeleteGroup = () => {
    // TODO: Implement delete functionality
    toast({
      title: 'Coming soon',
      description: 'Group deletion functionality will be available soon.',
    });
  };

  const handleAddAccount = () => {
    // TODO: Implement add account functionality
    toast({
      title: 'Coming soon',
      description: 'Add account functionality will be available soon.',
    });
  };

  const handleMoveAccounts = () => {
    // TODO: Implement move accounts functionality
    toast({
      title: 'Coming soon',
      description: 'Move accounts functionality will be available soon.',
    });
  };

  const handleExportData = () => {
    // TODO: Implement export functionality
    toast({
      title: 'Coming soon',
      description: 'Data export functionality will be available soon.',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3">
          <LoadingSpinner className="w-6 h-6" />
          <span>Loading group details...</span>
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="text-red-600 mb-2">Error loading group</div>
              <p className="text-muted-foreground mb-4">
                {error || 'Group not found'}
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => refetch()} variant="outline">
                  Try Again
                </Button>
                <Button onClick={() => router.back()} variant="ghost">
                  Go Back
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto py-6 max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/accounts/groups" className="inline-flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Groups
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div
              className="h-12 w-12 rounded-lg flex items-center justify-center text-lg font-medium"
              style={{
                backgroundColor: group.color ? `${group.color}20` : '#f1f5f9',
                color: group.color || '#64748b',
              }}
            >
              {group.icon || '📁'}
            </div>
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-2">
                {group.name}
                {group.isDefault && (
                  <Badge variant="secondary" className="text-xs">
                    Default
                  </Badge>
                )}
              </h1>
              <p className="text-muted-foreground">
                {group.description || 'No description provided'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEditGroup}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteGroup}
            disabled={group.isDefault}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(stats.totalBalance)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Accounts</p>
                  <p className="text-2xl font-bold">
                    {stats.totalAccounts + stats.totalWallets}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalAccounts} financial, {stats.totalWallets} crypto
                  </p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Accounts</p>
                  <p className="text-2xl font-bold">
                    {stats.activeAccounts + stats.activeWallets}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {((stats.activeAccounts + stats.activeWallets) / (stats.totalAccounts + stats.totalWallets) * 100).toFixed(0)}% active
                  </p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Child Groups</p>
                  <p className="text-2xl font-bold">{stats.totalChildGroups}</p>
                  <p className="text-xs text-muted-foreground">
                    Nested organization
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Balance Distribution */}
            {stats && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Balance Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Traditional Assets</span>
                      <span className="font-medium">
                        {formatCurrency(stats.totalFiatBalance)}
                      </span>
                    </div>
                    <Progress value={stats.fiatPercentage} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{stats.fiatPercentage.toFixed(1)}%</span>
                      <span>{stats.totalAccounts} accounts</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Crypto Assets</span>
                      <span className="font-medium">
                        {formatCurrency(stats.totalCryptoBalance)}
                      </span>
                    </div>
                    <Progress value={stats.cryptoPercentage} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{stats.cryptoPercentage.toFixed(1)}%</span>
                      <span>{stats.totalWallets} wallets</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity data available</p>
                  <p className="text-sm">Activity tracking coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Child Groups */}
          {group.children && group.children.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Child Groups
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.children.map((child) => (
                    <div
                      key={child.id}
                      className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => router.push(`/dashboard/accounts/groups/${child.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-8 w-8 rounded flex items-center justify-center text-sm"
                          style={{
                            backgroundColor: child.color ? `${child.color}20` : '#f1f5f9',
                            color: child.color || '#64748b',
                          }}
                        >
                          {child.icon || '📁'}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{child.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {(child._count?.financialAccounts || 0) + (child._count?.cryptoWallets || 0)} accounts
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="accounts" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Account Management</h3>
            <div className="flex gap-2">
              <Button onClick={handleAddAccount}>
                <Plus className="h-4 w-4 mr-2" />
                Add Account
              </Button>
              <Button variant="outline" onClick={handleMoveAccounts}>
                <Move className="h-4 w-4 mr-2" />
                Move Accounts
              </Button>
            </div>
          </div>

          {/* Financial Accounts */}
          {group.financialAccounts && group.financialAccounts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Financial Accounts ({group.financialAccounts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {group.financialAccounts.map((account: FinancialAccount) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{account.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {account.type} • {account.institutionName}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {formatCurrency(account.balance, account.currency)}
                        </div>
                        <Badge variant={account.isActive ? 'default' : 'secondary'} className="text-xs">
                          {account.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Crypto Wallets */}
          {group.cryptoWallets && group.cryptoWallets.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Crypto Wallets ({group.cryptoWallets.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {group.cryptoWallets.map((wallet: CryptoWallet) => (
                    <div
                      key={wallet.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Wallet className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-medium">{wallet.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {wallet.type} • {wallet.network}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {formatCurrency(wallet.totalBalanceUsd)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {wallet.assetCount} assets • {wallet.nftCount} NFTs
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {(!group.financialAccounts || group.financialAccounts.length === 0) &&
           (!group.cryptoWallets || group.cryptoWallets.length === 0) && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No accounts in this group</h3>
                  <p className="text-muted-foreground mb-4">
                    Add financial accounts or crypto wallets to get started
                  </p>
                  <Button onClick={handleAddAccount}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <GroupAnalytics group={group} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <GroupSettings 
            group={group} 
            onUpdate={handleGroupUpdated}
            onDelete={() => {
              router.push('/dashboard/accounts/groups');
              toast({
                title: 'Group deleted',
                description: `"${group.name}" has been deleted.`,
              });
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Edit Group Dialog */}
      <EditGroupDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        group={group}
        onSuccess={handleGroupUpdated}
      />
    </div>
  );
}