"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  SortAsc,
  Loader2,
  FolderOpen,
  Settings,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AccountGroupCard } from './AccountGroupCard';
import { CreateGroupDialog } from './CreateGroupDialog';
import { DeleteGroupsDialog } from './DeleteGroupsDialog';
import { useAccountGroupsStore } from '@/lib/stores';
import type { AccountGroup } from '@/lib/types/account-groups';

interface AccountGroupsListProps {
  onGroupSelect?: (group: AccountGroup) => void;
  showCreateButton?: boolean;
  viewMode?: 'grid' | 'list';
  allowSelection?: boolean;
  selectedGroups?: string[];
  onSelectionChange?: (groupIds: string[]) => void;
}

export function AccountGroupsList({
  onGroupSelect,
  showCreateButton = true,
  viewMode: initialViewMode = 'grid',
  allowSelection = false,
  selectedGroups = [],
  onSelectionChange,
}: AccountGroupsListProps) {
  // Local state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Zustand store - use selectors for better reactivity
  const groups = useAccountGroupsStore((state) => state.groups);
  const version = useAccountGroupsStore((state) => state.version); // Force reactivity
  const isLoading = useAccountGroupsStore((state) => state.groupsLoading);
  const error = useAccountGroupsStore((state) => state.groupsError);
  const isCreating = useAccountGroupsStore((state) => state.operationLoading);
  const filters = useAccountGroupsStore((state) => state.filters);
  const viewPreferences = useAccountGroupsStore((state) => state.viewPreferences);
  
  // Actions
  const fetchGroups = useAccountGroupsStore((state) => state.fetchGroups);
  const createDefaultGroups = useAccountGroupsStore((state) => state.createDefaultGroups);
  const deleteGroup = useAccountGroupsStore((state) => state.deleteGroup);
  const setSearchQuery = useAccountGroupsStore((state) => state.setSearchQuery);
  const setSortBy = useAccountGroupsStore((state) => state.setSortBy);
  const setSortOrder = useAccountGroupsStore((state) => state.setSortOrder);
  const setViewMode = useAccountGroupsStore((state) => state.setViewMode);
  const toggleShowEmptyGroups = useAccountGroupsStore((state) => state.toggleShowEmptyGroups);
  const toggleGroupSelection = useAccountGroupsStore((state) => state.toggleGroupSelection);
  
  // Get raw groups and compute filtered groups locally for better reactivity
  const filteredGroups = useMemo(() => {
    let filtered = [...groups];
    
    // Search filter
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(group =>
        group.name.toLowerCase().includes(query) ||
        group.description?.toLowerCase().includes(query)
      );
    }
    
    // Empty groups filter
    if (!filters.showEmptyGroups) {
      filtered = filtered.filter(group =>
        (group._count?.financialAccounts || 0) > 0 ||
        (group._count?.cryptoWallets || 0) > 0 ||
        (group._count?.children || 0) > 0
      );
    }
    
    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (viewPreferences.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'created':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updated':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'sortOrder':
          comparison = a.sortOrder - b.sortOrder;
          break;
      }
      
      return viewPreferences.sortOrder === 'desc' ? -comparison : comparison;
    });
    
    return filtered;
  }, [groups, filters.searchQuery, filters.showEmptyGroups, viewPreferences.sortBy, viewPreferences.sortOrder, version]);

  // Local state for additional filters not in store
  const [showDefaultGroups, setShowDefaultGroups] = useState(true);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Sync initial view mode with store
  useEffect(() => {
    if (initialViewMode !== viewPreferences.viewMode) {
      setViewMode(initialViewMode);
    }
  }, [initialViewMode, viewPreferences.viewMode, setViewMode]);

  // Load groups on mount (but only if not already loaded)
  useEffect(() => {
    if (groups.length === 0 && !isLoading) {
      console.log('AccountGroupsList: Fetching groups...');
      const options = {
        details: true,
        includeAccounts: true,
        includeWallets: true,
        includeCounts: true,
      };
      fetchGroups(options);
    }
  }, [groups.length, isLoading, fetchGroups]);

  // Debug: Log when groups change
  useEffect(() => {
    console.log('AccountGroupsList: Groups updated, total:', groups.length, 'filtered:', filteredGroups.length);
    console.log('AccountGroupsList: Groups data:', groups.map(g => ({ id: g.id, name: g.name })));
  }, [groups, filteredGroups]);

  // Apply additional local filters
  const localFilteredGroups = useMemo(() => {
    return filteredGroups.filter((group) => {
      // Default groups filter (local filter)
      if (!showDefaultGroups && group.isDefault) {
        return false;
      }
      return true;
    });
  }, [filteredGroups, showDefaultGroups]);

  // Handle group selection
  const handleSelectionChange = (groupId: string, selected: boolean) => {
    if (allowSelection) {
      toggleGroupSelection(groupId);
    }
    
    if (onSelectionChange) {
      const newSelection = selected
        ? [...selectedGroups, groupId]
        : selectedGroups.filter(id => id !== groupId);
      onSelectionChange(newSelection);
    }
  };

  // Handle create defaults
  const handleCreateDefaults = async () => {
    await createDefaultGroups();
  };

  // Handle group creation success (Zustand will automatically update the store)
  const handleGroupCreated = (newGroup: AccountGroup) => {
    console.log('AccountGroupsList: New group created:', newGroup);
    console.log('AccountGroupsList: Current groups count before:', groups.length);
    
    // Force re-render by calling a dummy state update
    setIsCreateDialogOpen(false);
    
    // Log again after a short delay to see if store updated
    setTimeout(() => {
      console.log('AccountGroupsList: Groups count after timeout:', groups.length);
    }, 100);
  };

  // Handle single group deletion (from card action)
  const handleGroupDelete = async (group: AccountGroup) => {
    console.log('AccountGroupsList: Deleting group:', group.name);
    
    if (window.confirm(`Are you sure you want to delete the group "${group.name}"? This action cannot be undone.`)) {
      const success = await deleteGroup(group.id);
      if (success) {
        console.log('AccountGroupsList: Successfully deleted group');
      } else {
        console.log('AccountGroupsList: Failed to delete group');
        alert('Failed to delete group. Please try again.');
      }
    }
  };

  // Handle bulk delete mode
  const handleEnterDeleteMode = () => {
    setIsDeleteMode(true);
    setSelectedForDeletion([]);
  };

  const handleExitDeleteMode = () => {
    setIsDeleteMode(false);
    setSelectedForDeletion([]);
  };

  const handleToggleGroupForDeletion = (groupId: string) => {
    setSelectedForDeletion(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleBulkDelete = () => {
    if (selectedForDeletion.length === 0) return;
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async (groupIds: string[]) => {
    console.log('AccountGroupsList: Bulk deleting groups:', groupIds);
    
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
    return localFilteredGroups.filter(group => selectedForDeletion.includes(group.id));
  };
  
  const handleSelectAllForDeletion = () => {
    const deletableGroups = localFilteredGroups
      .filter(group => !group.isDefault)
      .map(group => group.id);
    setSelectedForDeletion(deletableGroups);
  };
  
  const handleDeselectAll = () => {
    setSelectedForDeletion([]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading account groups...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="text-red-600 mb-2">Error loading groups</div>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => fetchGroups({ details: true, includeAccounts: true, includeWallets: true, includeCounts: true })} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Account Groups</h2>
          <p className="text-sm text-muted-foreground">
            {groups.length} group{groups.length !== 1 ? 's' : ''}
            {localFilteredGroups.length !== groups.length && 
              ` (${localFilteredGroups.length} showing)`
            }
          </p>
        </div>

        <div className="flex gap-2">
          {/* Create defaults button if no groups exist */}
          {groups.length === 0 && (
            <Button
              variant="outline"
              onClick={handleCreateDefaults}
              disabled={isCreating}
            >
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Default Groups
            </Button>
          )}

          {/* Create and Delete buttons */}
          <div className="flex items-center gap-2">
            {showCreateButton && (
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                disabled={isDeleteMode}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Group
              </Button>
            )}
            
            {!isDeleteMode ? (
              <Button 
                variant="outline" 
                onClick={handleEnterDeleteMode}
                disabled={localFilteredGroups.filter(g => !g.isDefault).length === 0}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Groups
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  variant="destructive" 
                  onClick={handleBulkDelete}
                  disabled={selectedForDeletion.length === 0}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete ({selectedForDeletion.length})
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleExitDeleteMode}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search groups by name or description..."
                value={filters.searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort */}
            <Select value={viewPreferences.sortBy} onValueChange={(value: 'name' | 'created' | 'updated' | 'sortOrder') => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="created">Sort by Created</SelectItem>
                <SelectItem value="updated">Sort by Updated</SelectItem>
                <SelectItem value="sortOrder">Sort by Order</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(viewPreferences.sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <SortAsc className={`h-4 w-4 ${viewPreferences.sortOrder === 'desc' ? 'rotate-180' : ''}`} />
            </Button>

            {/* View mode toggle */}
            <div className="flex border rounded-lg p-1">
              <Button
                variant={viewPreferences.viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewPreferences.viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Filters dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Display Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={filters.showEmptyGroups}
                  onCheckedChange={toggleShowEmptyGroups}
                >
                  Show Empty Groups
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={showDefaultGroups}
                  onCheckedChange={setShowDefaultGroups}
                >
                  Show Default Groups
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Delete Mode Info */}
      {isDeleteMode && (
        <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800 dark:text-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <strong>Delete Mode:</strong> Select the groups you want to delete, then click the "Delete" button. 
                {selectedForDeletion.length > 0 && (
                  <span className="ml-2 font-medium">
                    {selectedForDeletion.length} group{selectedForDeletion.length > 1 ? 's' : ''} selected for deletion.
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSelectAllForDeletion}
                  disabled={localFilteredGroups.filter(g => !g.isDefault).length === 0}
                  className="text-orange-700 hover:text-orange-800 hover:bg-orange-100 dark:text-orange-300 dark:hover:text-orange-200 dark:hover:bg-orange-900/30"
                >
                  Select All
                </Button>
                {selectedForDeletion.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleDeselectAll}
                    className="text-orange-700 hover:text-orange-800 hover:bg-orange-100 dark:text-orange-300 dark:hover:text-orange-200 dark:hover:bg-orange-900/30"
                  >
                    Deselect All
                  </Button>
                )}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Groups display */}
      {localFilteredGroups.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {groups.length === 0 ? 'No groups yet' : 'No groups found'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {groups.length === 0
                  ? 'Create your first account group to start organizing your finances'
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              {groups.length === 0 && showCreateButton && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Group
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={
          viewPreferences.viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-3'
        }>
          {localFilteredGroups.map((group) => (
            <AccountGroupCard
              key={group.id}
              group={group}
              onClick={isDeleteMode ? undefined : onGroupSelect}
              onDelete={!isDeleteMode ? handleGroupDelete : undefined}
              showActions={!isDeleteMode}
              isSelectable={(isDeleteMode && !group.isDefault) || allowSelection}
              isSelected={
                isDeleteMode 
                  ? selectedForDeletion.includes(group.id)
                  : (allowSelection ? filters.selectedGroupIds.includes(group.id) : selectedGroups.includes(group.id))
              }
              onSelectionChange={(selected) => {
                if (isDeleteMode && !group.isDefault) {
                  handleToggleGroupForDeletion(group.id);
                } else if (!isDeleteMode) {
                  handleSelectionChange(group.id, selected);
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Create group dialog */}
      <CreateGroupDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleGroupCreated}
        parentGroups={groups.filter(g => !g.parentId)} // Only top-level groups can be parents
      />
      
      {/* Delete groups dialog */}
      <DeleteGroupsDialog
        open={isDeleteDialogOpen}
        onOpenChange={handleDeleteDialogClose}
        groups={getSelectedGroups()}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}