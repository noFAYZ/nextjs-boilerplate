import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUpdateCategory } from '@/lib/queries/use-category-groups-data';
import { toast } from 'sonner';

export function EditCategoryPopover({
  category,
  newCategoryName,
  setNewCategoryName,
  onClose,
  onDelete,
  triggerElement,
}: {
  category: any;
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
  onClose: () => void;
  onDelete: () => void;
  triggerElement?: HTMLElement | null;
}) {
  const { mutate: updateCategory, isPending } = useUpdateCategory(category.id);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    if (triggerElement) {
      const rect = triggerElement.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: rect.left,
      });
    }
  }, [triggerElement]);

  const handleSave = () => {
    const trimmedName = newCategoryName.trim();

    if (!trimmedName) {
      toast.error('Category name cannot be empty');
      return;
    }

    // Only send request if name has actually changed
    if (trimmedName === category.name) {
      onClose();
      return;
    }

    updateCategory(
      { name: trimmedName },
      {
        onSuccess: () => {
          toast.success('Category updated');
          onClose();
        },
        onError: (error: any) => {
          toast.error('Failed to update category');
        },
      }
    );
  };

  return (
    <>
      {/* Click outside to close */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      {/* Popover */}
      <div
        className="fixed z-50 bg-card border border-border/40 rounded-lg shadow-lg p-3 space-y-3 w-56"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <label className="text-xs font-medium text-muted-foreground">Category Name</label>
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="h-8 text-sm mt-1"
            autoFocus
            disabled={isPending}
          />
        </div>
        <div className="flex gap-2 justify-end pt-2 border-t">
          <Button
            variant="outline"
            size="xs"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            size="xs"
            onClick={handleSave}
            disabled={isPending || !newCategoryName.trim()}
          >
            {isPending ? 'Saving...' : 'Save'}
          </Button>
          <Button
            variant="delete"
            size="xs"
            onClick={onDelete}
            disabled={isPending}
          >
            Delete
          </Button>
        </div>
      </div>
    </>
  );
}
