"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Plus,
  ArrowRight,
  Loader2,
  ArrowLeft,
  Trash2,
  FolderOpen,
  AlertTriangle,
  AlertOctagonIcon,
  Eye,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccountGroupsStore } from "@/lib/stores";
import type { AccountGroup } from "@/lib/types/account-groups";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreateGroupDialog } from "./CreateGroupDialog";
import { AddAccountToGroupDialog } from "./AddAccountToGroupDialog";
import { DeleteGroupsDialog } from "./DeleteGroupsDialog";
import { ProiconsFolderAdd, SolarWallet2Outline, StreamlineFlexLabelFolderTag, StreamlineFlexWallet, StreamlineFlexWalletAdd } from "../icons/icons";
import { Separator } from "../ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarImage } from "../ui/avatar";
import AvatarGroup from "../ui/avatar-group";

interface AccountGroupsGridProps {
  onGroupSelect?: (group: AccountGroup) => void;
  limit?: number; // Limit number of groups shown
  onCreateGroup?: () => void;
}

interface GroupDetailsViewProps {
  group: AccountGroup;
  onBack: () => void;
  onAddAccount: (group: AccountGroup) => void;
}

function GroupDetailsView({
  group,
  onBack,
  onAddAccount,
}: GroupDetailsViewProps) {
  const router = useRouter();
  const [removingWallet, setRemovingWallet] = useState<string | null>(null);
  const [removingAccount, setRemovingAccount] = useState<string | null>(null);
  const [isRemoveMode, setIsRemoveMode] = useState(false);
  const [selectedWallets, setSelectedWallets] = useState<Set<string>>(
    new Set()
  );
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(
    new Set()
  );

  const handleRemoveWallet = async (walletId: string) => {
    try {
      setRemovingWallet(walletId);
      // TODO: Implement API call to remove wallet from group

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // The hook will automatically refresh the data
    } catch (error) {
      console.error("Failed to remove wallet from group:", error);
    } finally {
      setRemovingWallet(null);
    }
  };

  const handleRemoveAccount = async (accountId: string) => {
    try {
      setRemovingAccount(accountId);
      // TODO: Implement API call to remove account from group

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // The hook will automatically refresh the data
    } catch (error) {
      console.error("Failed to remove account from group:", error);
    } finally {
      setRemovingAccount(null);
    }
  };

  const handleBatchRemove = async () => {
    try {
      const walletIds = Array.from(selectedWallets);
      const accountIds = Array.from(selectedAccounts);


      // TODO: Implement API calls for batch removal
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Reset selection and exit remove mode
      setSelectedWallets(new Set());
      setSelectedAccounts(new Set());
      setIsRemoveMode(false);

      // The hook will automatically refresh the data
    } catch (error) {
      console.error("Failed to batch remove accounts from group:", error);
    }
  };

  const toggleWalletSelection = (walletId: string) => {
    const newSelection = new Set(selectedWallets);
    if (newSelection.has(walletId)) {
      newSelection.delete(walletId);
    } else {
      newSelection.add(walletId);
    }
    setSelectedWallets(newSelection);
  };

  const toggleAccountSelection = (accountId: string) => {
    const newSelection = new Set(selectedAccounts);
    if (newSelection.has(accountId)) {
      newSelection.delete(accountId);
    } else {
      newSelection.add(accountId);
    }
    setSelectedAccounts(newSelection);
  };

  const handleWalletClick = (wallet: { id: string }) => {
    if (isRemoveMode) {
      toggleWalletSelection(wallet.id);
    } else {
      // Navigate to wallet page
      router.push(`/dashboard/accounts/wallet/${wallet.id}`);
    }
  };

  const cancelRemoveMode = () => {
    setIsRemoveMode(false);
    setSelectedWallets(new Set());
    setSelectedAccounts(new Set());
  };

  const hasSelectedItems =
    selectedWallets.size > 0 || selectedAccounts.size > 0;

  const hasAccounts =
    (group.financialAccounts && group.financialAccounts.length > 0) ||
    (group.cryptoWallets && group.cryptoWallets.length > 0);

  return (
    <div className="space-y-8">
      {/* Header - Fully Responsive */}
      <div className="flex flex-col gap-4 sm:gap-0">
        {/* Top Row - Back button and Group Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="subtle"
              size="sm"
              className="text-xs font-semibold shrink-0"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden xs:inline">Back</span>
            </Button>

            <Separator orientation="vertical" className="h-6 hidden sm:block" />

            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-[0.7rem] flex items-center justify-center text-base sm:text-lg shrink-0"
                style={{
                  backgroundColor: group.color
                    ? `${group.color}30`
                    : "rgb(243 244 246)",
                  color: group.color || "rgb(107 114 128)",
                }}
              >
                {group.icon || "📁"}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold truncate">
                  {group.name}
                </h2>
                {group.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 sm:line-clamp-none">
                    {group.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Action Button (Only show main action on small screens) */}
          <div className="sm:hidden">
            {isRemoveMode ? (
              <Button
                onClick={cancelRemoveMode}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Cancel
              </Button>
            ) : (
              <Button
                onClick={() => onAddAccount(group)}
                size="sm"
                className="text-xs"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Desktop Action Buttons - Hidden on mobile, full on desktop */}
        <div className="hidden sm:flex sm:items-center sm:justify-end sm:-mt-2">
          {isRemoveMode ? (
            <div className="flex items-center gap-2">
              <Button
                onClick={cancelRemoveMode}
                variant="subtle"
                size="sm"
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBatchRemove}
                size="sm"
                variant="destructive"
                disabled={!hasSelectedItems}
                className="text-xs shadow-none"
              >
                <span className="flex items-center gap-1">
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden md:inline">Remove Selected</span>
                  <span className="md:hidden">Remove</span>(
                  {selectedWallets.size + selectedAccounts.size})
                </span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {hasAccounts && (
                <Button
                  onClick={() => setIsRemoveMode(true)}
                  variant="soft"
                  size="sm"
                  className="text-xs shadow-none"
                >
                  <span className="flex items-center gap-1">
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden lg:inline">Remove</span>
                  </span>
                </Button>
              )}
              <Button
                onClick={() => onAddAccount(group)}
                size="sm"
                className="text-xs shadow-none"
              >
                <span className="flex items-center gap-1">
                  <StreamlineFlexWalletAdd className="h-4 w-4" />
                  <span className="hidden md:inline">Add Account</span>
                  <span className="md:hidden">Add</span>
                </span>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Remove Mode Actions - Only show when in remove mode on mobile */}
        {isRemoveMode && (
          <div className="sm:hidden flex items-center justify-between bg-destructive/10 dark:bg-destructive/20 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
              <span className="text-sm font-medium text-destructive">
                Remove Mode Active
              </span>
            </div>
            <Button
              onClick={handleBatchRemove}
              size="sm"
              variant="destructive"
              disabled={!hasSelectedItems}
              className="text-xs"
            >
              <span className="flex items-center gap-1">
                <Trash2 className="h-3 w-3" />
                Remove ({selectedWallets.size + selectedAccounts.size})
              </span>
            </Button>
          </div>
        )}
      </div>

      {/* Accounts in this group - Enhanced Accordions */}
      {hasAccounts ? (
        <div className="space-y-4">
          <Accordion
          
            type="multiple"
            defaultValue={["bank-accounts", "crypto-wallets"]}
            className="w-full "
          >
            {/* Bank Accounts Accordion */}
            {group.financialAccounts && group.financialAccounts.length > 0 && (
              <AccordionItem
                value="bank-accounts"
                className="border rounded-lg"
              >
                <AccordionTrigger className="text-sm sm:text-base font-semibold px-4 sm:px-6 py-3 sm:py-4 hover:no-underline hover:bg-muted/50 border-none">
                  <div className="flex items-center gap-2 sm:gap-3 w-full min-w-0">
                    <div className="size-8 sm:size-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                      <Building2 className="size-4 sm:size-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex flex-col items-start min-w-0 flex-1">
                      <span className="font-semibold truncate">
                        Bank Accounts
                      </span>
                      <span className="text-xs text-muted-foreground font-normal truncate sm:text-wrap">
                        <span className="inline sm:hidden">
                          {group.financialAccounts.length} • $
                          {group.financialAccounts
                            .reduce((sum, acc) => sum + acc.balance, 0)
                            .toLocaleString()}
                        </span>
                        <span className="hidden sm:inline">
                          {group.financialAccounts.length} account
                          {group.financialAccounts.length !== 1 ? "s" : ""} • $
                          {group.financialAccounts
                            .reduce((sum, acc) => sum + acc.balance, 0)
                            .toLocaleString()}
                        </span>
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2">
                  <div className="grid grid-cols-1 gap-3 sm:gap-4 ">
                    {group.financialAccounts.map((account, index) => (
                      <Card
                        key={account.id}
                        variant="elevated"
                        interactive
                        className={`
                          group hover-lift click-shrink border-green-100/50 dark:border-green-800/30 bg-white/60 dark:bg-green-950/20 backdrop-blur-sm
                          ${isRemoveMode ? "hover:bg-green-50/80 dark:hover:bg-green-900/30" : ""}
                          ${selectedAccounts.has(account.id) ? "ring-2 ring-green-500/50 bg-green-50 dark:bg-green-900/40 shadow-lg scale-[1.02]" : ""}
                        `}
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() => isRemoveMode && toggleAccountSelection(account.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              {isRemoveMode && (
                                <div className="flex items-center">
                                  <div
                                    className={`size-5 rounded-md border-2 flex items-center justify-center state-transition ${
                                      selectedAccounts.has(account.id)
                                        ? "bg-green-500 border-green-500 scale-110"
                                        : "border-green-300 hover:border-green-400"
                                    }`}
                                  >
                                    {selectedAccounts.has(account.id) && (
                                      <svg className="size-3 text-white animate-scale-in" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                </div>
                              )}
                              <div className="size-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-green-400 to-green-500 shadow-md group-hover:shadow-lg hover-scale">
                                <Building2 className="size-6 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-300 color-transition">
                                  {account.name}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                  {account.institutionName || account.type}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-sm text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 color-transition">
                                ${account.balance.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {account.currency}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Crypto Wallets Accordion */}
            {group.cryptoWallets && group.cryptoWallets.length > 0 && (
              <AccordionItem
                value="crypto-wallets"
                className="border rounded-2xl"
              >
                <AccordionTrigger className="text-sm bg-muted/60 sm:text-base font-semibold px-4 sm:px-6 py-3 sm:py-4 hover:no-underline hover:bg-muted/50 rounded-t-2xl aria-expanded:rounded-b-none">
                  <div className="flex items-center justify-between w-full min-w-0 gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="size-8 sm:size-10 rounded-lg flex items-center justify-center bg-accent shrink-0">
                        <StreamlineFlexWallet className="size-4 sm:size-5 " />
                      </div>
                      <div className="flex flex-col items-start min-w-0">
                        <span className="font-semibold truncate">
                          Crypto Wallets
                        </span>
                        <span className="text-xs text-muted-foreground truncate sm:hidden">
                          {group.cryptoWallets.length} wallets
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm sm:text-base font-semibold">
                        $
                        {group.cryptoWallets
                          .reduce(
                            (sum, wallet) =>
                              sum + parseFloat(wallet.totalBalanceUsd || "0"),
                            0
                          )
                          .toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground hidden sm:block">
                        {group.cryptoWallets.length} wallet
                        {group.cryptoWallets.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2  gap-3 sm:gap-4 ">
                    {group.cryptoWallets.map((wallet, index) => (
                      <Card
                        key={wallet.id}
                        className={`
                          group transition-all duration-75 py-0 cursor-pointer hover:shadow-md
                          ${selectedWallets.has(wallet.id) ? "ring-2 ring-amber-500/50 bg-amber-50/50 dark:bg-amber-900/20" : ""}
                        `}
                        onClick={() => handleWalletClick(wallet)}
                      >
                        <CardContent className="px-3 sm:px-4 py-3 relative overflow-hidden">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1">
                              {isRemoveMode && (
                                <div className="flex items-center">
                                  <div
                                    className={`size-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                      selectedWallets.has(wallet.id)
                                        ? "bg-primary border-primary"
                                        : "border-primary/50 hover:border-primary/60"
                                    }`}
                                  >
                                    {selectedWallets.has(wallet.id) && (
                                      <svg className="size-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                </div>
                              )}
                              <div className="size-10 rounded-lg flex items-center justify-center bg-muted">
                                <StreamlineFlexWallet className="size-5 " />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm">
                                  {wallet.name}
                                </p>
                                <p className="text-xs font-mono text-muted-foreground mt-0.5">
                                  {wallet.address?.slice(0, 8)}...{wallet.address?.slice(-4)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-sm">
                                $
                                {parseFloat(
                                  wallet?.totalBalanceUsd || "0"
                                ).toLocaleString()}
                              </p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <p className="text-xs text-muted-foreground">
                                  {wallet.assetCount} assets
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      ) : (
        /* Empty state */
        <div className="text-center py-8">
          <div className="mb-4">
            <Plus className="size-12 text-muted-foreground mx-auto mb-3" />
            <h4 className="text-base font-semibold mb-2">No accounts in this group</h4>
            <p className="text-sm text-muted-foreground">
              Add your first bank account or crypto wallet to start tracking your finances.
            </p>
          </div>
          <Button onClick={() => onAddAccount(group)} size="sm">
            <Plus className="size-4 mr-2" />
            Add Account
          </Button>
        </div>
      )}
    </div>
  );
}

export function AccountGroupsGrid({
  onGroupSelect,
  limit = 6, // Show max 6 groups on main page
  onCreateGroup,
}: AccountGroupsGridProps) {
  const [selectedGroup, setSelectedGroup] = useState<AccountGroup | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);
  const [groupForAddingAccount, setGroupForAddingAccount] =
    useState<AccountGroup | null>(null);
  
  // Delete mode states
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Zustand store - use selectors for better reactivity
  const groups = useAccountGroupsStore((state) => state.groups);
  const isLoading = useAccountGroupsStore((state) => state.groupsLoading);
  const error = useAccountGroupsStore((state) => state.groupsError);
  const fetchGroups = useAccountGroupsStore((state) => state.fetchGroups);
  const deleteGroup = useAccountGroupsStore((state) => state.deleteGroup);
  
  // Load groups on mount
  React.useEffect(() => {
    if (groups.length === 0 && !isLoading) {
      fetchGroups({
        details: true,
        includeAccounts: true,
        includeWallets: true,
        includeCounts: true,
      });
    }
  }, [groups.length, isLoading, fetchGroups]);

  // Get limited groups for display
  const displayGroups = useMemo(() => groups.slice(0, limit), [groups, limit]);
  const hasMore = groups.length > limit;

  // Calculate total values for all groups
  const groupTotalValues = useMemo(() => {
    return displayGroups.reduce((acc, group) => {
      const cryptoTotal = group.cryptoWallets?.reduce(
        (sum, wallet) => sum + parseFloat(wallet.totalBalanceUsd || "0"),
        0
      ) || 0;
      const bankTotal = group.financialAccounts?.reduce(
        (sum, account) => sum + account.balance,
        0
      ) || 0;
      acc[group.id] = cryptoTotal + bankTotal;
      return acc;
    }, {} as Record<string, number>);
  }, [displayGroups]);

  const handleToggleGroupForDeletion = useCallback((groupId: string) => {
    setSelectedForDeletion(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  }, []);

  const handleGroupClick = useCallback((group: AccountGroup) => {
    if (isDeleteMode) {
      // In delete mode, toggle selection instead of navigating
      if (!group.isDefault) {
        handleToggleGroupForDeletion(group.id);
      }
    } else {
      if (onGroupSelect) {
        onGroupSelect(group);
      }
      setSelectedGroup(group);
    }
  }, [isDeleteMode, onGroupSelect, handleToggleGroupForDeletion]);

  const handleCreateGroup = useCallback(() => {
    if (onCreateGroup) {
      onCreateGroup();
    }
    setIsCreateDialogOpen(true);
  }, [onCreateGroup]);
  
  // Delete mode handlers
  const handleEnterDeleteMode = useCallback(() => {
    setIsDeleteMode(true);
    setSelectedForDeletion([]);
  }, []);

  const handleExitDeleteMode = useCallback(() => {
    setIsDeleteMode(false);
    setSelectedForDeletion([]);
  }, []);

  const handleBulkDelete = useCallback(() => {
    if (selectedForDeletion.length === 0) return;
    setIsDeleteDialogOpen(true);
  }, [selectedForDeletion.length]);

  const handleConfirmDelete = async (groupIds: string[]) => {
    const successGroups: string[] = [];
    const failedGroups: string[] = [];
    
    for (const groupId of groupIds) {
      const success = await deleteGroup(groupId);
      if (success) {
        successGroups.push(groupId);
      } else {
        failedGroups.push(groupId);
      }
    }
    
    return { success: successGroups, failed: failedGroups };
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
    handleExitDeleteMode();
  };
  
  const getSelectedGroups = () => {
    return displayGroups.filter(group => selectedForDeletion.includes(group.id));
  };
  
  const handleSelectAllForDeletion = useCallback(() => {
    const deletableGroups = displayGroups
      .filter(group => !group.isDefault)
      .map(group => group.id);
    setSelectedForDeletion(deletableGroups);
  }, [displayGroups]);
  
  const handleDeselectAll = useCallback(() => {
    setSelectedForDeletion([]);
  }, []);

  const handleGroupCreated = (newGroup: AccountGroup) => {
    // Refresh will happen automatically due to the hook
    setIsCreateDialogOpen(false);
  };

  const handleAddAccount = (group: AccountGroup) => {
    setGroupForAddingAccount(group);
    setIsAddAccountDialogOpen(true);
  };

  const handleAccountAdded = () => {
    // Refresh will happen automatically
    setIsAddAccountDialogOpen(false);
    setGroupForAddingAccount(null);
  };

  // If a group is selected, show its details
  if (selectedGroup) {
    return (
      <div>
        <GroupDetailsView
          group={selectedGroup}
          onBack={() => setSelectedGroup(null)}
          onAddAccount={handleAddAccount}
        />

        {/* Add Account Dialog */}
        <AddAccountToGroupDialog
          open={isAddAccountDialogOpen}
          onOpenChange={setIsAddAccountDialogOpen}
          group={groupForAddingAccount}
          onSuccess={handleAccountAdded}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-5 rounded bg-muted animate-pulse" />
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} loading className="h-48">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-12 rounded-xl bg-muted skeleton" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted skeleton rounded w-3/4" />
                    <div className="h-3 bg-muted skeleton rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-16 bg-muted skeleton rounded-lg" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-12 bg-muted skeleton rounded-lg" />
                    <div className="h-12 bg-muted skeleton rounded-lg" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card variant="destructive" className="text-center p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="size-6 text-destructive" />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-destructive">Failed to load groups</div>
            <p className="text-xs text-muted-foreground">{error}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchGroups({
              details: true,
            })}
          >
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  if (groups.length === 0) {
    return (
      <Card variant="ghost" className="text-center p-12">
        <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
          <div className="size-16 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center animate-float">
            <FolderOpen className="size-8 text-primary" />
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">No groups yet</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Create your first account group to organize your finances and get better insights into your spending patterns.
            </p>
          </div>
          <Button onClick={handleCreateGroup} size="lg" className="animate-scale-in">
            <Plus className="size-4 mr-2" />
            Create First Group
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
                <StreamlineFlexLabelFolderTag className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">Groups</h1>
                <p className="text-xs text-muted-foreground">
                  Monitor and manage your crypto wallets and bank accounts 
                </p>
              </div>
            </div>
        
        {/* Create and Delete buttons */}
        <div className="flex items-center gap-2">
          {!isDeleteMode ? (
            <>
              <Button 
                variant="secondary" 
                size="xs"
                onClick={handleEnterDeleteMode}
                disabled={displayGroups.filter(g => !g.isDefault).length === 0}
                className="flex items-center gap-2 text-xs"
              >
                <Trash2 className="size-4" />
                <span className="hidden sm:inline">Manage</span>
              </Button>
              <Button
                onClick={handleCreateGroup}
                size="xs"
                className="flex items-center gap-2 text-xs"
                disabled={isDeleteMode}
              >
                <Plus className="size-4" />
                <span className="hidden sm:inline">Create Group</span>
                <span className="sm:hidden">Create</span>
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
         
                size="xs"
                onClick={handleBulkDelete}
                disabled={selectedForDeletion.length === 0}
                className="flex items-center gap-2 text-xs bg-destructive"
              >
                <Trash2 className="size-4" />
                Delete ({selectedForDeletion.length})
              </Button>
              <Button 
                variant="outline" 
                size="xs"
                onClick={handleExitDeleteMode}
                className="text-xs"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Mode Info */}
      {isDeleteMode && (
        <Card variant="destructive" className="animate-slide-down py-0">
          <CardContent className="p-2">
            <div className="flex items-start gap-3">
              <div className="size-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 mt-1">
                <AlertOctagonIcon className="size-4 text-destructive" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-destructive">Delete Mode Active</h4>
                    <p className="text-xs text-muted-foreground">
                      Click groups to select them for deletion. Default groups cannot be deleted.
                      {selectedForDeletion.length > 0 && (
                        <span className="block mt-1 font-medium text-destructive">
                          {selectedForDeletion.length} group{selectedForDeletion.length > 1 ? 's' : ''} selected
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button 
                      variant="soft" 
                      size="sm" 
                      onClick={handleSelectAllForDeletion}
                      disabled={displayGroups.filter(g => !g.isDefault).length === 0}
                      className="text-xs"
                    >
                      Select All
                    </Button>
                    {selectedForDeletion.length > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleDeselectAll}
                        className="text-xs"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Groups Grid */}
      <div className="grid grid-cols-1  gap-4 ">
        {displayGroups.map((group, index) => {
          const totalValue = groupTotalValues[group.id] || 0;
          const accountsCount = (group._count?.financialAccounts || 0) + (group._count?.cryptoWallets || 0);

          return (
            <Card
              key={group.id}    
              className={` border bg-muted/60 rounded-xl hover:bg-muted
                relative py-4 cursor-pointer
                ${isDeleteMode && group.isDefault ? 'opacity-50 cursor-not-allowed' : ''}
                ${isDeleteMode ? '' : ''}
              `}
             
              onClick={() => handleGroupClick(group)}
            >
              {/* Selection indicator for delete mode */}
              {isDeleteMode && (
                <div className="absolute bottom-3 right-3 z-10">
                  {group.isDefault ? (
                    <div className="size-6 rounded-full bg-muted border-2 border-muted-foreground/20 flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">✕</span>
                    </div>
                  ) : (
                    <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all state-transition ${
                      selectedForDeletion.includes(group.id) 
                        ? 'bg-destructive border-destructive text-destructive-foreground scale-110' 
                        : 'bg-background border-border hover:border-destructive'
                    }`}>
                      {selectedForDeletion.includes(group.id) && (
                        <span className="text-xs animate-scale-in">✓</span>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              <CardHeader className="pb-0" >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {/* Group Icon */}
                    <div
                      className="size-10 rounded-lg flex items-center justify-center text-lg font-semibold shadow-sm"
                      style={{
                        backgroundColor: group.color
                          ? `${group.color}40`
                          : "hsl(var(--muted))",
                        color: group.color || "hsl(var(--muted-foreground))",
                 
                      }}
                    >
                      {group.icon || "📁"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-sm truncate">{group.name}</CardTitle>
                      <div className="flex items-center gap-2 ">
                        {group.isDefault && (
                          <Badge variant="secondary" className="text-[10px] px-2 py-0">
                            Default
                          </Badge>
                        )}
                        {accountsCount > 0 && (
                          <span className="text-[10px] text-muted-foreground">
                            {accountsCount} account{accountsCount !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                     {/* Total Value Display */}
                {totalValue > 0 && (
                  <div className="">
                    <div className="text-[10px] text-muted-foreground text-end ">Total Value</div>
                    <div className="text-base font-semibold text-foreground">
                      ${totalValue.toLocaleString()}
                    </div>
                  </div>
                )}

                  
                  {!isDeleteMode && (
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                      <ArrowRight className="size-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0 ">
             
                {/* Account Types Summary */}
                <div className="flex items-baseline gap-2">
                  <div className="flex items-center gap-1 ">
                    <div className="size-6 rounded-sm bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-sm">
                      <Building2 className="size-4 text-white" />
                    </div>
                    <div className="min-w-0">
                   
                      <div className="text-sm font-semibold text-foreground ">
                        {group._count?.financialAccounts || 0}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ">
                    <div className="size-6 rounded-sm bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-sm">
                      <StreamlineFlexWallet className="size-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      
                      <div className="text-sm font-semibold text-foreground">
                        {group._count?.cryptoWallets || 0}
                      </div>
                    </div>
                  </div>
                </div>

          
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Actions */}
      {hasMore && (
        <div className="flex items-center justify-center pt-4">
          <Button variant="outline" size="sm" asChild className="group">
            <Link href="/dashboard/accounts/groups" className="inline-flex items-center gap-2">
              <Eye className="size-4" />
              <span>View all {groups.length} groups</span>
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      )}

      {/* Dialogs */}
      <CreateGroupDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleGroupCreated}
        parentGroups={groups.filter((g) => !g.parentId)}
      />

      <AddAccountToGroupDialog
        open={isAddAccountDialogOpen}
        onOpenChange={setIsAddAccountDialogOpen}
        group={groupForAddingAccount}
        onSuccess={handleAccountAdded}
      />
      
      <DeleteGroupsDialog
        open={isDeleteDialogOpen}
        onOpenChange={handleDeleteDialogClose}
        groups={getSelectedGroups()}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
