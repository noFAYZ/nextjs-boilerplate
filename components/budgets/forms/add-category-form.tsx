import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateCategory } from '@/lib/queries/use-category-groups-data';
import { toast } from 'sonner';

export function AddCategoryForm({
  groupId,
  onClose,
}: {
  groupId: string;
  onClose: () => void;
}) {
  const [categoryName, setCategoryName] = useState('');
  const { mutate: createCategory, isPending } = useCreateCategory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error('Category name required');
      return;
    }

    const categoryNameCopy = categoryName.trim();
    // Close dialog immediately for instant feedback
    setCategoryName('');
    onClose();

    createCategory(
      {
        groupId,
        name: categoryNameCopy,
      },
      {
        onSuccess: () => {
          toast.success('Category created successfully');
        },
        onError: (error: unknown) => {
          const message = error instanceof Error ? error.message : 'Failed to create category';
          toast.error(message);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wide">
          Category Name
        </label>
        <Input
          placeholder="Enter category name..."
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="h-8 text-sm"
          autoFocus
          disabled={isPending}
        />
      </div>
      <div className="flex gap-2 justify-end pt-1">
        <Button
          size="sm"
          variant="outline"
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="h-8"
        >
          Cancel
        </Button>
        <Button size="sm" type="submit" disabled={isPending || !categoryName.trim()} className="h-8">
          {isPending ? '...' : 'Add'}
        </Button>
      </div>
    </form>
  );
}
