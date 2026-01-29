import { Button } from '@/components/ui/button';
import { Plus, ArrowRightLeft, Trash2, X } from 'lucide-react';

export function FloatingToolbar({
  selectedRowsCount,
  selectedGroupsCount,
  onSpendClick,
  onTransferClick,
  onDeleteClick,
  onClearSelection,
}: {
  selectedRowsCount: number;
  selectedGroupsCount: number;
  onSpendClick: () => void;
  onTransferClick: () => void;
  onDeleteClick: () => void;
  onClearSelection: () => void;
}) {
  const totalSelected = selectedRowsCount + selectedGroupsCount;

  if (totalSelected === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-0 right-0 max-w-5xl mx-auto z-40">
      <div className="flex items-center justify-between gap-6 bg-card border border-border/80 rounded-lg backdrop-blur-sm shadow-sm p-3 mx-6 lg:mx-0">
        {/* Left Section - Info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary/10 flex-shrink-0">
            <span className="text-sm font-bold text-primary">
              {totalSelected}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
                Selected
              </p>
              <p className="text-sm font-semibold">
                {totalSelected} item{totalSelected !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="xs"
            className="gap-2"
            onClick={onSpendClick}
            title="Record spending for selected"
          >
            <Plus className="h-4 w-4" />
            Spend
          </Button>
          <Button
            variant="secondary"
            size="xs"
            className="gap-2"
            onClick={onTransferClick}
            title="Transfer funds"
          >
            <ArrowRightLeft className="h-4 w-4" />
            Transfer
          </Button>
          <Button
            variant="delete"
            size="xs"
            className="gap-2"
            onClick={onDeleteClick}
            title="Delete selected"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={onClearSelection}
            className="ml-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
