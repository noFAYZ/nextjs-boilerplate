import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUpdateCategoryGroup } from '@/lib/queries/use-category-groups-data';
import { useToast } from '@/lib/hooks/useToast';

export function EditGroupPopover({
  group,
  editGroupName,
  setEditGroupName,
  onClose,
  onDelete,
  triggerElement,
}: {
  group: { id: string; name: string };
  editGroupName: string;
  setEditGroupName: (name: string) => void;
  onClose: () => void;
  onDelete: () => void;
  triggerElement?: HTMLElement | null;
}) {
  const toast = useToast();
  const { mutate: updateGroup, isPending } = useUpdateCategoryGroup(group.id);
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
    const trimmedName = editGroupName.trim();

    if (!trimmedName) {
      toast.toast({ title: 'Error', description: 'Group name cannot be empty', variant: 'destructive' });
      return;
    }

    // Only send request if name has actually changed
    if (trimmedName === group.name) {
      onClose();
      return;
    }

    updateGroup(
      { name: trimmedName },
      {
        onSuccess: () => {
          toast.toast({ title: 'Success', description: 'Group updated', variant: 'success' });
          onClose();
        },
        onError: (error: unknown) => {
          toast.toast({ title: 'Error', description: 'Failed to update group', variant: 'destructive' });
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
          <label className="text-xs font-medium text-muted-foreground">Group Name</label>
          <Input
            value={editGroupName}
            onChange={(e) => setEditGroupName(e.target.value)}
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
            disabled={isPending || !editGroupName.trim()}
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
