import { Button } from '@/components/ui/button';
import { Switch } from '@/components/budgets/ui/switch';
import { Popover } from '@/components/budgets/ui/popover';
import {
  ChevronsDown,
  ChevronsUp,
  FolderPlus,
  Filter,
  ArrowUpDown,
  Settings,
} from 'lucide-react';

export function TableHeaderControls({
  allGroupsExpanded,
  onExpandAllToggle,
  onCreateGroupClick,
  filterPopoverOpen,
  onFilterPopoverChange,
  filterStatus,
  onFilterStatusChange,
  sortPopoverOpen,
  onSortPopoverChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  columnPopoverOpen,
  onColumnPopoverChange,
  visibleColumns,
  onToggleColumn,
  isRefreshing,
  onRefresh,
  groupsLoading,
}: {
  allGroupsExpanded: boolean;
  onExpandAllToggle: () => void;
  onCreateGroupClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  filterPopoverOpen: boolean;
  onFilterPopoverChange: (open: boolean) => void;
  filterStatus: 'all' | 'active' | 'zero';
  onFilterStatusChange: (status: 'all' | 'active' | 'zero') => void;
  sortPopoverOpen: boolean;
  onSortPopoverChange: (open: boolean) => void;
  sortBy: 'name' | 'allocated' | 'spent';
  onSortByChange: (by: 'name' | 'allocated' | 'spent') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  columnPopoverOpen: boolean;
  onColumnPopoverChange: (open: boolean) => void;
  visibleColumns: Record<string, boolean>;
  onToggleColumn: (column: string) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  groupsLoading: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-border/80">
      <div className='flex items-center gap-1.5'>
        {/* Expand/Collapse All */}
        <Button
          variant="outlinemuted2"
          size="icon-xs"
          onClick={onExpandAllToggle}
          icon={allGroupsExpanded ? <ChevronsUp className="h-4 w-4" /> : <ChevronsDown className="h-4 w-4" />}
          title={allGroupsExpanded ? 'Collapse all groups' : 'Expand all groups'}
        />

        {/* Create Group */}
        <Button
          variant="outlinemuted2"
          size="icon-xs"
          onClick={onCreateGroupClick}
          disabled={groupsLoading || isRefreshing}
          icon={<FolderPlus className="h-4 w-4" />}
          title="Create new group"
        />

        {/* Filter Popover */}
        <Popover
          open={filterPopoverOpen}
          onOpenChange={onFilterPopoverChange}
          trigger={
            <Button
              variant="outlinemuted2"
              size="icon-xs"
              onClick={() => onFilterPopoverChange(!filterPopoverOpen)}
              icon={<Filter className="h-4 w-4" />}
            />
          }
        >
          <div className="p-2 space-y-3 w-40 z-50">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">Status</p>
              <div className="space-y-0">
                {(['all', 'active', 'zero'] as const).map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-muted/50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={filterStatus === status}
                      onChange={(e) =>
                        onFilterStatusChange(e.target.value as typeof status)
                      }
                      className="h-4 w-4"
                    />
                    <span className="text-xs capitalize">{status}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Popover>

        {/* Sort Popover */}
        <Popover
          open={sortPopoverOpen}
          onOpenChange={onSortPopoverChange}
          trigger={
            <Button
              variant="outlinemuted2"
              size="icon-xs"
              icon={<ArrowUpDown className="h-4 w-4" />}
              onClick={() => onSortPopoverChange(!sortPopoverOpen)}
            />
          }
        >
          <div className="p-3 space-y-1 w-40">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">Sort By</p>
              <div className="space-y-0">
                {(['name', 'allocated', 'spent'] as const).map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-muted/50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="sort"
                      value={option}
                      checked={sortBy === option}
                      onChange={(e) =>
                        onSortByChange(e.target.value as typeof option)
                      }
                      className="h-4 w-4"
                    />
                    <span className="text-xs capitalize">{option}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="pt-2 border-t border-border/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  Order
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() =>
                    onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')
                  }
                  className="h-7 text-xs"
                >
                  {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
                </Button>
              </div>
            </div>
          </div>
        </Popover>

        {/* Columns Popover */}
        <Popover
          open={columnPopoverOpen}
          onOpenChange={onColumnPopoverChange}
          trigger={
            <Button
              variant="outlinemuted2"
              size="icon-xs"
              onClick={() => onColumnPopoverChange(!columnPopoverOpen)}
              icon={<Settings className="h-4 w-4" />}
            />
          }
        >
          <div className="p-3 space-y-2 w-40">
            {Object.entries(visibleColumns).map(([key, visible]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-xs capitalize">{key}</span>
                <Switch
                  checked={visible}
                  onChange={() => onToggleColumn(key)}
                />
              </div>
            ))}
          </div>
        </Popover>
      </div>

      {/* Refresh Button */}
      <div>
        <Button
          variant="steel"
          size="icon-xs"
          onClick={onRefresh}
          disabled={isRefreshing || groupsLoading}
          icon={
            <span className={isRefreshing ? 'animate-spin' : ''}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </span>
          }
          title="Refresh data"
        />
      </div>
    </div>
  );
}
