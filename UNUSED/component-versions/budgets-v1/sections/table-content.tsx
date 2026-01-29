import React from 'react';
import {
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CategoryRow } from '../rows/category-row';
import { EditGroupPopover } from '../popovers/edit-group-popover';

export function TableContent({
  isLoading,
  sortedGroups,
  expandedGroups,
  onToggleGroup,
  selectedGroups,
  selectedRows,
  onSelectGroup,
  onSelectRow,
  visibleColumns,
  showBalances,
  onAddCategoryClick,
  onSpendClick,
  onDeleteClick,
  editGroupPopover,
  editGroupId,
  editGroupName,
  setEditGroupName,
  setEditGroupPopover,
  groupPopoverTrigger,
  setGroupPopoverTrigger,
  onGroupDelete,
}: {
  isLoading: boolean;
  sortedGroups: Array<Record<string, unknown>>;
  expandedGroups: Set<string>;
  onToggleGroup: (id: string) => void;
  selectedGroups: Set<string>;
  selectedRows: Set<string>;
  onSelectGroup: (id: string) => void;
  onSelectRow: (id: string) => void;
  visibleColumns: Record<string, boolean>;
  showBalances: boolean;
  onAddCategoryClick: (groupId: string) => void;
  onSpendClick: (envelope: Record<string, unknown>) => void;
  onDeleteClick: (envelope: Record<string, unknown>) => void;
  editGroupPopover: string | null;
  editGroupId: string | null;
  editGroupName: string;
  setEditGroupName: (name: string) => void;
  setEditGroupPopover: (id: string | null) => void;
  groupPopoverTrigger: HTMLElement | null;
  setGroupPopoverTrigger: (el: HTMLElement | null) => void;
  onGroupDelete: (groupId: string) => void;
}) {
  return (
    <TableBody>
      {isLoading ? (
        <TableRow className="hover:bg-transparent">
          <TableCell
            colSpan={
              1 +
              Object.values(visibleColumns).filter(Boolean).length
            }
            className="px-4 py-8 text-center"
          >
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </TableCell>
        </TableRow>
      ) : sortedGroups.length === 0 ? (
        <TableRow className="hover:bg-transparent">
          <TableCell
            colSpan={
              1 +
              Object.values(visibleColumns).filter(Boolean).length
            }
            className="px-4 py-8 text-center text-muted-foreground text-sm"
          >
            No categories found
          </TableCell>
        </TableRow>
      ) : (
        sortedGroups.map((group: Record<string, unknown>) => {
          const groupEnvelopes = group.categories || [];
          const isExpanded = expandedGroups.has(group.id);

          return (
            <React.Fragment key={group.id}>
              {/* Group Header */}
              <TableRow
                className="group/row bg-card border-border/50 hover:bg-card/80 transition-colors"
              >
                <TableCell className="px-4 font-medium">
                  <input
                    type="checkbox"
                    checked={selectedGroups.has(group.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      onSelectGroup(group.id);
                    }}
                    className={cn(
                      "h-4 w-4 rounded border-border transition-opacity",
                      selectedGroups.has(group.id)
                        ? "opacity-100"
                        : "opacity-0 group-hover/row:opacity-100"
                    )}
                  />
                </TableCell>
                <TableCell className="px-4 font-medium relative overflow-visible">
                  <div className="flex items-center gap-2 group/label relative overflow-visible">
                    {/* Left - Expand Icon */}
                    <div
                      className="flex items-center gap-2 cursor-pointer "
                      onClick={() => onToggleGroup(group.id)}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 flex-shrink-0" />
                      )}
                      {group.icon ? (
                        <span className="text-lg">{group.icon}</span>
                      ) : isExpanded ? '📂' : '📁'

                      }

                      <span
                        className="truncate underline decoration-transparent group-hover/label:decoration-current transition-all cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditGroupId(group.id);
                          setEditGroupName(group.name);
                          setGroupPopoverTrigger(e.currentTarget as HTMLElement);
                          setEditGroupPopover(group.id);
                        }}
                      >
                        {group.name}
                      </span>
                    </div>

                    {/* Badge */}
                    <span className="text-xs text-muted-foreground bg-muted/60 px-2 py-1 rounded-full border border-border/40 whitespace-nowrap flex-shrink-0">
                      {groupEnvelopes.reduce((sum, cat) => sum + (Number(cat.percentageUsed) || 0), 0).toFixed(0)}%
                    </span>
                  </div>

                  {/* Edit Group Popover */}
                  {editGroupPopover === group.id && (
                    <EditGroupPopover
                      group={group}
                      editGroupName={editGroupName}
                      setEditGroupName={setEditGroupName}
                      onClose={() => setEditGroupPopover(null)}
                      onDelete={() => {
                        setEditGroupPopover(null);
                        onGroupDelete(group.id);
                      }}
                      triggerElement={groupPopoverTrigger}
                    />
                  )}
                </TableCell>

                {/* Actions - Span remaining columns */}
                {visibleColumns.leftover && <TableCell className="px-4" />}
                {visibleColumns.assigned && <TableCell className="px-4" />}
                {visibleColumns.activity && <TableCell className="px-4" />}
                {visibleColumns.available && <TableCell className="px-4" />}
                {visibleColumns.actions && (
                  <TableCell className="px-4 text-center">
                    <Button
                      size="icon-xs"
                      variant="outlinemuted2"
                      onClick={() => onAddCategoryClick(group.id)}
                      className="h-5 w-5 p-0.5 opacity-0 group-hover/row:opacity-100 transition-opacity"
                      title="Add category to this group"
                      icon={<Plus className="h-4 w-4" />}
                    />
                  </TableCell>
                )}
              </TableRow>

              {/* Category Rows */}
              {isExpanded &&
                groupEnvelopes.map((envelope: Record<string, unknown>, idx: number) => (
                  <CategoryRow
                    key={envelope.id}
                    envelope={envelope}
                    showBalances={showBalances}
                    visibleColumns={visibleColumns}
                    isLast={
                      idx === groupEnvelopes.length - 1
                    }
                    isSelected={selectedRows.has(envelope.id)}
                    onSelect={() => onSelectRow(envelope.id)}
                    onSpendClick={() => onSpendClick(envelope)}
                    onDeleteClick={() => onDeleteClick(envelope)}
                  />
                ))}
            </React.Fragment>
          );
        })
      )}
    </TableBody>
  );
}

// Add missing state setters
function setEditGroupId(id: string): void;
function setEditGroupId(id: string): void {}
