"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  FolderOpen,
  Grid3X3,
  List,
  TreePine,
  BarChart3,
  Wallet,
  Building2,
  GitMerge,
  Move,
} from 'lucide-react';
import Link from 'next/link';
import { AccountGroupsList } from '@/components/accounts/AccountGroupsList';
import { useGroupedAccounts, useAccountGroupsHierarchy } from '@/lib/hooks/use-account-groups';
import { useAccountGroupsStore } from '@/lib/stores';
import type { AccountGroup } from '@/lib/types/account-groups';
import { DeleteGroupsDialog } from '@/components/accounts/DeleteGroupsDialog';
import { ProgressDialog } from '@/components/ui/progress-dialog';
import { createOperationItem } from '@/lib/types/progress';
import type { OperationItem } from '@/lib/types/progress';

export default function AccountGroupsPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMergeDialogOpen, setIsMergeDialogOpen] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  
  const { stats } = useGroupedAccounts();
  const { groups, deleteGroup } = useAccountGroupsStore((state) => ({
    groups: state.groups,
    deleteGroup: state.deleteGroup
  }));
  // Create stable options object to prevent infinite re-renders
  const hierarchyOptions = useMemo(() => ({
    details: true,
    includeAccounts: true,
    includeWallets: true,
    includeCounts: true,
  }), []);
  
  const { hierarchy, isLoading: isLoadingHierarchy } = useAccountGroupsHierarchy(hierarchyOptions);

  const handleGroupSelect = (group: AccountGroup) => {
    // Navigate to individual group page
    console.log('Selected group:', group);
    // router.push(`/dashboard/accounts/groups/${group.id}`);
  };

  const handleBulkAction = (action: 'delete' | 'merge' | 'move') => {
    if (selectedGroups.length === 0) return;
    
    switch (action) {
      case 'delete':
        setIsDeleteDialogOpen(true);
        break;
      case 'merge':
        setIsMergeDialogOpen(true);
        break;
      case 'move':
        setIsMoveDialogOpen(true);
        break;
    }
  };

  const handleDeleteConfirm = async (groupIds: string[]) => {
    const successGroups: string[] = [];
    const failedGroups: string[] = [];
    
    for (const groupId of groupIds) {
      try {
        const success = await deleteGroup(groupId);
        if (success) {
          successGroups.push(groupId);
        } else {
          failedGroups.push(groupId);
        }
      } catch (error) {
        failedGroups.push(groupId);
      }
    }
    
    return { success: successGroups, failed: failedGroups };
  };

  const handleMergeConfirm = async (groupIds: string[]) => {
    // Simulate merge operation - in real app this would merge groups
    const successGroups: string[] = [];
    const failedGroups: string[] = [];
    
    // For demo, simulate some successes and failures
    for (const groupId of groupIds) {
      // Simulate merge logic here
      const success = Math.random() > 0.2; // 80% success rate for demo
      if (success) {
        successGroups.push(groupId);
      } else {
        failedGroups.push(groupId);
      }
    }
    
    return { success: successGroups, failed: failedGroups };
  };

  const handleMoveConfirm = async (groupIds: string[]) => {
    // Simulate move operation - in real app this would move accounts between groups
    const successGroups: string[] = [];
    const failedGroups: string[] = [];
    
    // For demo, simulate some successes and failures
    for (const groupId of groupIds) {
      // Simulate move logic here
      const success = Math.random() > 0.1; // 90% success rate for demo
      if (success) {
        successGroups.push(groupId);
      } else {
        failedGroups.push(groupId);
      }
    }
    
    return { success: successGroups, failed: failedGroups };
  };

  const getSelectedGroupsData = () => {
    return groups.filter(group => selectedGroups.includes(group.id));
  };

  return (
    <div className="mx-auto py-6 max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/accounts" className="inline-flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Accounts
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Account Groups</h1>
            <p className="text-muted-foreground">
              Organize your financial accounts and crypto wallets into custom groups
            </p>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedGroups.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">
                  {selectedGroups.length} group{selectedGroups.length > 1 ? 's' : ''} selected
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('move')}
                >
                  Move Accounts
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('merge')}
                >
                  Merge Groups
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBulkAction('delete')}
                >
                  Delete Groups
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedGroups([])}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            Grid View
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            List View
          </TabsTrigger>
          <TabsTrigger value="hierarchy" className="flex items-center gap-2">
            <TreePine className="h-4 w-4" />
            Hierarchy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          <AccountGroupsList
            onGroupSelect={handleGroupSelect}
            showCreateButton={true}
            viewMode="grid"
            allowSelection={true}
            selectedGroups={selectedGroups}
            onSelectionChange={setSelectedGroups}
          />
        </TabsContent>

        <TabsContent value="table" className="space-y-6">
          <AccountGroupsList
            onGroupSelect={handleGroupSelect}
            showCreateButton={true}
            viewMode="list"
            allowSelection={true}
            selectedGroups={selectedGroups}
            onSelectionChange={setSelectedGroups}
          />
        </TabsContent>

        <TabsContent value="hierarchy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Group Hierarchy</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingHierarchy ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-muted-foreground">Loading hierarchy...</div>
                </div>
              ) : hierarchy.length === 0 ? (
                <div className="text-center py-8">
                  <TreePine className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No hierarchical groups found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {hierarchy.map((group) => (
                    <div key={group.id} className="space-y-2">
                      {/* Top level group */}
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <div
                          className="h-8 w-8 rounded flex items-center justify-center text-sm"
                          style={{
                            backgroundColor: group.color ? `${group.color}20` : undefined,
                            color: group.color || 'inherit',
                          }}
                        >
                          {group.icon || '📁'}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{group.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {(group._count?.financialAccounts || 0) + (group._count?.cryptoWallets || 0)} accounts
                          </div>
                        </div>
                        {group.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>

                      {/* Child groups */}
                      {group.children?.map((child) => (
                        <div key={child.id} className="ml-6 flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                          <div
                            className="h-6 w-6 rounded flex items-center justify-center text-xs"
                            style={{
                              backgroundColor: child.color ? `${child.color}20` : undefined,
                              color: child.color || 'inherit',
                            }}
                          >
                            {child.icon || '📁'}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{child.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {(child._count?.financialAccounts || 0) + (child._count?.cryptoWallets || 0)} accounts
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Progress Dialogs */}
      <DeleteGroupsDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        groups={getSelectedGroupsData()}
        onConfirm={handleDeleteConfirm}
      />

      <ProgressDialog
        open={isMergeDialogOpen}
        onOpenChange={setIsMergeDialogOpen}
        items={getSelectedGroupsData().map(group => createOperationItem(group.id, group.name))}
        onConfirm={handleMergeConfirm}
        title="Merge Account Groups"
        description="Merging selected account groups. This will combine all accounts and settings into a single group."
        confirmButtonText="Merge Groups"
        destructive={false}
        icon={GitMerge}
        iconColor="text-purple-600"
        iconBgColor="bg-purple-100 dark:bg-purple-900/20"
      />

      <ProgressDialog
        open={isMoveDialogOpen}
        onOpenChange={setIsMoveDialogOpen}
        items={getSelectedGroupsData().map(group => createOperationItem(group.id, `Move accounts from ${group.name}`))}
        onConfirm={handleMoveConfirm}
        title="Move Account Groups"
        description="Moving accounts between selected groups. This will reorganize your account structure."
        confirmButtonText="Move Accounts"
        destructive={false}
        icon={Move}
        iconColor="text-indigo-600"
        iconBgColor="bg-indigo-100 dark:bg-indigo-900/20"
      />
    </div>
  );
}