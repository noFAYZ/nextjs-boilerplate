"use client";

import { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { AccountGroupCard } from './AccountGroupCard';
import { CreateGroupDialog } from './CreateGroupDialog';
import { useAccountGroups, useAccountGroupMutations } from '@/lib/hooks/use-account-groups';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'updated'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState(initialViewMode);
  const [showEmptyGroups, setShowEmptyGroups] = useState(true);
  const [showDefaultGroups, setShowDefaultGroups] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Create stable options object to prevent infinite re-renders
  const accountGroupsOptions = useMemo(() => ({
    details: true,
    includeAccounts: true,
    includeWallets: true,
    includeCounts: true,
  }), []);

  // Hooks
  const { groups, isLoading, error, refetch } = useAccountGroups(accountGroupsOptions);

  const { createDefaults, isCreating } = useAccountGroupMutations();

  // Filter and sort groups
  const filteredGroups = groups
    .filter((group) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!group.name.toLowerCase().includes(query) &&
            !group.description?.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Empty groups filter
      const totalAccounts = (group._count?.financialAccounts || 0) + 
                           (group._count?.cryptoWallets || 0) +
                           (group._count?.children || 0);
      if (!showEmptyGroups && totalAccounts === 0) {
        return false;
      }

      // Default groups filter
      if (!showDefaultGroups && group.isDefault) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'created':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'updated':
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        default: // name
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'desc') {
        return aValue < bValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });

  // Handle group selection
  const handleSelectionChange = (groupId: string, selected: boolean) => {
    if (!onSelectionChange) return;

    const newSelection = selected
      ? [...selectedGroups, groupId]
      : selectedGroups.filter(id => id !== groupId);
    
    onSelectionChange(newSelection);
  };

  // Handle create defaults
  const handleCreateDefaults = async () => {
    const response = await createDefaults();
    if (response.success) {
      refetch();
    }
  };

  // Handle group creation success
  const handleGroupCreated = (newGroup: AccountGroup) => {
    refetch();
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
            <Button onClick={refetch} variant="outline">
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
            {filteredGroups.length !== groups.length && 
              ` (${filteredGroups.length} showing)`
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

          {/* Create new group button */}
          {showCreateButton && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Group
            </Button>
          )}
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(value: 'name' | 'created' | 'updated') => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="created">Sort by Created</SelectItem>
                <SelectItem value="updated">Sort by Updated</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <SortAsc className={`h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
            </Button>

            {/* View mode toggle */}
            <div className="flex border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
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
                  checked={showEmptyGroups}
                  onCheckedChange={setShowEmptyGroups}
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

      {/* Groups display */}
      {filteredGroups.length === 0 ? (
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
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-3'
        }>
          {filteredGroups.map((group) => (
            <AccountGroupCard
              key={group.id}
              group={group}
              onClick={onGroupSelect}
              isSelectable={allowSelection}
              isSelected={selectedGroups.includes(group.id)}
              onSelectionChange={(selected) => handleSelectionChange(group.id, selected)}
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
    </div>
  );
}