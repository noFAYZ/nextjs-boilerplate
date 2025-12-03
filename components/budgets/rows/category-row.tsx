import { useState } from 'react';
import {
  TableCell,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Edit,
  ArrowRightLeft,
  Trash2,
  MoreVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useAllocateFunds,
} from '@/lib/queries/use-category-groups-data';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { toast } from 'sonner';
import { EditCategoryPopover } from '../popovers/edit-category-popover';

export function CategoryRow({
  envelope,
  showBalances,
  visibleColumns,
  isLast,
  isSelected,
  onSelect,
  onSpendClick,
  onDeleteClick,
}: {
  envelope: any;
  showBalances: boolean;
  visibleColumns: Record<string, boolean>;
  isLast: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onSpendClick: (envelope: any) => void;
  onDeleteClick: (envelope: any) => void;
}) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editCategoryNameOpen, setEditCategoryNameOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState(envelope.name);
  const [categoryPopoverTrigger, setCategoryPopoverTrigger] = useState<HTMLElement | null>(null);

  const allocateMutation = useAllocateFunds(envelope.id);

  const allocated = Number(envelope.allocatedAmount) || 0;
  const spent = Number(envelope.totalSpent) || 0;
  const balance = Number(envelope.currentBalance) || 0;
  const percentage = Number(envelope.percentageUsed) || 0;

  const handleEditAllocation = (value: string) => {
    const amount = parseFloat(value);
    if (isNaN(amount) || amount < 0) {
      toast.error('Invalid amount');
      return;
    }

    // Only send request if value has changed
    if (amount === allocated) {
      setEditingField(null);
      return;
    }

    allocateMutation.mutate(
      { amount, description: 'Allocation adjustment' },
      {
        onSuccess: () => {
          toast.success('Allocation updated');
          setEditingField(null);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to update');
        },
      }
    );
  };

  return (
    <TableRow
      className={cn(
        'group/row bg-background/50 border-border/40 hover:bg-muted/50',
        isSelected && 'bg-primary/5'
      )}
    >
      {/* Checkbox */}
      <TableCell className="px-4 py-1">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className={cn(
            "h-4 w-4 rounded border-border transition-opacity",
            isSelected
              ? "opacity-100"
              : "opacity-0 group-hover/row:opacity-100"
          )}
        />
      </TableCell>

      {/* Category Column */}
      <TableCell className="px-4 py-1 relative overflow-visible">
        <div className="flex items-center gap-2 group/category relative overflow-visible">
          {/* Category Info */}
          <div
            className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
            onClick={(e) => {
              setNewCategoryName(envelope.name);
              setCategoryPopoverTrigger(e.currentTarget);
              setEditCategoryNameOpen(true);
            }}
          >
            {envelope.icon && <span className="text-lg flex-shrink-0">{envelope.icon}</span>}
            <div className="flex-1 min-w-0">
              <div
                className="text-sm font-medium truncate underline decoration-transparent group-hover/category:decoration-current transition-all"
              >
                {envelope.name}
              </div>
            </div>
          </div>

          {/* Edit Category Name Popover */}
          {editCategoryNameOpen && (
            <EditCategoryPopover
              category={envelope}
              newCategoryName={newCategoryName}
              setNewCategoryName={setNewCategoryName}
              onClose={() => setEditCategoryNameOpen(false)}
              onDelete={() => {
                setEditCategoryNameOpen(false);
                onDeleteClick(envelope);
              }}
              triggerElement={categoryPopoverTrigger}
            />
          )}
        </div>
      </TableCell>

      {visibleColumns.leftover && (
        <TableCell className="px-4 py-2 text-right">
          <div
            className={cn(
              'text-xs font-semibold',
              balance < 0
                ? 'text-red-600 dark:text-red-400'
                : 'text-emerald-600 dark:text-emerald-400'
            )}
          >
            {showBalances ? (
              <CurrencyDisplay amountUSD={Math.abs(balance)} variant="small" />
            ) : (
              '••••'
            )}
          </div>
        </TableCell>
      )}

      {visibleColumns.assigned && (
        <TableCell className="px-4 py-2 text-right">
          {editingField === 'assigned' ? (
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => {
                handleEditAllocation(editValue);
                setEditingField(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleEditAllocation(editValue);
                  setEditingField(null);
                }
                if (e.key === 'Escape') setEditingField(null);
              }}
              autoFocus
              className="w-24 px-2 py-1 text-sm text-right border border-primary rounded bg-background"
              placeholder="0.00"
            />
          ) : (
            <button
              onClick={() => {
                setEditValue(allocated.toString());
                setEditingField('assigned');
              }}
              className="text-sm font-semibold cursor-pointer hover:text-primary transition-colors"
            >
              {showBalances ? (
                <CurrencyDisplay amountUSD={allocated} variant="small" />
              ) : (
                '••••'
              )}
            </button>
          )}
        </TableCell>
      )}

      {visibleColumns.activity && (
        <TableCell className="px-4 py-2 text-right">
          <button
            onClick={() => onSpendClick(envelope)}
            className="text-sm font-semibold cursor-pointer hover:text-primary transition-colors"
            title="Record spending"
          >
            {showBalances ? (
              <CurrencyDisplay amountUSD={spent} variant="small" />
            ) : (
              '••••'
            )}
          </button>
        </TableCell>
      )}

      {visibleColumns.available && (
        <TableCell className="px-4 py-2">
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all',
                percentage > 100
                  ? 'bg-red-500'
                  : percentage >= 80
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              )}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </TableCell>
      )}

      {visibleColumns.actions && (
        <TableCell className="px-4 py-2 text-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline2"
                size="sm"
                className={cn(
                  "h-7 w-7 p-0 transition-opacity",
                  isSelected
                    ? "opacity-100"
                    : "opacity-0 group-hover/row:opacity-100"
                )}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => onSpendClick(envelope)}
                className="cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span>Record Spending</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setEditValue(allocated.toString());
                  setEditingField('assigned');
                }}
                className="cursor-pointer"
              >
                <Edit className="h-4 w-4 mr-2" />
                <span>Edit Allocation</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
              >
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                <span>Transfer Funds</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer"
                onClick={() => onDeleteClick(envelope)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                <span>Delete Category</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      )}
    </TableRow>
  );
}
