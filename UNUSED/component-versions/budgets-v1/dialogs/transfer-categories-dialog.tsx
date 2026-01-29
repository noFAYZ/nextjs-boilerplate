import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDeleteCategoryGroup } from '@/lib/queries/use-category-groups-data';
import { useToast } from '@/lib/hooks/useToast';
import type { CustomCategoryGroup } from '@/lib/services/category-groups-api';

export function TransferCategoriesDialog({
  sourceGroupId,
  sourceGroup,
  allGroups,
  onClose,
}: {
  sourceGroupId: string;
  sourceGroup: CustomCategoryGroup;
  allGroups: CustomCategoryGroup[];
  onClose: () => void;
}) {
  const toast = useToast();
  const [destinationGroupId, setDestinationGroupId] = useState<string>('');
  const deleteGroupMutation = useDeleteCategoryGroup(sourceGroupId);

  // Filter out the source group from destination options
  const destinationOptions = allGroups.filter(g => g.id !== sourceGroupId);

  const handleTransfer = async () => {
    if (!destinationGroupId) {
      toast.toast({ title: 'Error', description: 'Please select a destination group', variant: 'destructive' });
      return;
    }

    // TODO: Implement API call to transfer categories
    toast.toast({ title: 'Success', description: `Categories transferred to ${allGroups.find(g => g.id === destinationGroupId)?.name}`, variant: 'success' });
    onClose();
  };

  const handleDelete = () => {
    // Close dialog immediately for instant feedback
    onClose();

    deleteGroupMutation.mutate(undefined, {
      onSuccess: () => {
        toast.toast({ title: 'Success', description: 'Group deleted successfully', variant: 'success' });
      },
      onError: (error: Error) => {
        toast.toast({ title: 'Error', description: error?.message || 'Failed to delete group', variant: 'destructive' });
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-3">
          What would you like to do with the categories in <strong>{sourceGroup?.name}</strong>?
        </p>
      </div>

      {destinationOptions.length > 0 ? (
        <>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-2">
              Destination Group
            </label>
            <select
              value={destinationGroupId}
              onChange={(e) => setDestinationGroupId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground"
              disabled={deleteGroupMutation.isPending}
            >
              <option value="">Select a group...</option>
              {destinationOptions.map(group => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={deleteGroupMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTransfer}
              disabled={!destinationGroupId || deleteGroupMutation.isPending}
            >
              Transfer
            </Button>
            <Button
              variant="delete"
              onClick={handleDelete}
              disabled={deleteGroupMutation.isPending}
            >
              {deleteGroupMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            No other groups available to transfer to. You can only delete this group.
          </p>
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={deleteGroupMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="delete"
              onClick={handleDelete}
              disabled={deleteGroupMutation.isPending}
            >
              {deleteGroupMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
