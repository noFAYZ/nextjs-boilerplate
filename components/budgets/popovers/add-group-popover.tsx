import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateCategoryGroup } from '@/lib/queries/use-category-groups-data';
import { useToast } from '@/lib/hooks/useToast';

export function AddGroupPopover({
  onClose,
  triggerElement,
}: {
  onClose: () => void;
  triggerElement?: HTMLElement | null;
}) {
  const toast = useToast();
  const [groupName, setGroupName] = useState('');
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const { mutate: createGroup, isPending } = useCreateCategoryGroup();

  React.useEffect(() => {
    if (triggerElement) {
      const rect = triggerElement.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: rect.left,
      });
    }
  }, [triggerElement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      toast.toast({ title: 'Error', description: 'Group name required', variant: 'destructive' });
      return;
    }

    const groupNameCopy = groupName.trim();
    // Close popover immediately for instant feedback
    setGroupName('');
    onClose();

    createGroup(
      { name: groupNameCopy },
      {
        onSuccess: () => {
          toast.toast({ title: 'Success', description: `Group "${groupNameCopy}" created successfully`, variant: 'success' });
        },
        onError: (error: unknown) => {
          const errorMessage = error && typeof error === 'object' && 'response' in error &&
            error.response && typeof error.response === 'object' && 'data' in error.response &&
            error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data &&
            typeof error.response.data.message === 'string'
            ? error.response.data.message
            : 'Failed to create group';
          toast.toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
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
        className="fixed z-50 bg-card border border-border/40 rounded-lg shadow-lg p-4 space-y-3 w-56"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-semibold text-sm">Create Budget Group</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            autoFocus
            disabled={isPending}
            className="h-8 text-sm"
          />
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
              type="submit"
              size="xs"
              disabled={isPending || !groupName.trim()}
            >
              {isPending ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
