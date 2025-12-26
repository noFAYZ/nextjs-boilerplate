'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Plus,
  Trash2,
  Edit2,
  Tag,
  FolderOpen,
  X,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useTransactionCategories,
  useCreateCustomCategory,
  useUpdateCategory,
  useDeleteCategory,
  useToggleCategoryStatus,
} from '@/lib/queries/use-transaction-categories-data';

interface Category {
  id: string;
  name: string;
  displayName: string;
  emoji?: string;
  color?: string;
  description?: string;
  isDefault: boolean;
  isCustom: boolean;
  enabled?: boolean;
}

interface CategoryGroup {
  groupId: string;
  groupName: string;
  groupColor?: string;
  groupIcon?: string;
  groupDescription?: string;
  categories: Category[];
  enabled?: boolean;
}

interface CategoryFormData {
  groupId: string;
  name: string;
  displayName: string;
  emoji: string;
}

const EMOJI_SUGGESTIONS = [
  '🍔', '🍕', '🚗', '🏠', '🛍️', '💼', '🎮', '📚',
  '✈️', '🏥', '💳', '🎓', '⚽', '🎬', '📱', '💻',
  '🌱', '🎨', '🚀', '🔧', '📊', '🎵', '☕', '🍎',
];

export function CategoriesManagementV2() {
  const { toast, update, dismiss } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCategory, setEditingCategory] = useState<(Category & { groupId: string; }) | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedGroupForCreate, setSelectedGroupForCreate] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [draggedCategory, setDraggedCategory] = useState<{ categoryId: string; fromGroupId: string } | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<CategoryGroup | null>(null);

  // Queries and mutations
  const { data: categoriesData, isLoading } = useTransactionCategories();
  const createCategoryMutation = useCreateCustomCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();
  const toggleStatusMutation = useToggleCategoryStatus();

  const groups = (categoriesData?.groups || []) as CategoryGroup[];

  // Filter groups by search term
  const filteredGroups = useMemo(() => {
    if (!searchTerm) return groups;

    return groups
      .map(group => ({
        ...group,
        categories: group.categories.filter(cat =>
          cat.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cat.name.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }))
      .filter(group => group.categories.length > 0);
  }, [groups, searchTerm]);

  const handleCreateCategory = async (formData: CategoryFormData) => {
    const toastId = toast({ title: 'Creating category...', variant: 'loading' });
    try {
      await createCategoryMutation.mutateAsync({
        groupId: formData.groupId,
        name: formData.name,
        displayName: formData.displayName,
        emoji: formData.emoji,
      });
      update(toastId, {
        title: `Category "${formData.displayName}" created successfully`,
        variant: 'success',
        dismissible: true,
        duration: 4000,
      });
      setIsCreateOpen(false);
      setSelectedGroupForCreate(null);
    } catch (error) {
      console.error('Failed to create category:', error);
      update(toastId, {
        title: 'Failed to create category',
        variant: 'destructive',
        dismissible: true,
        duration: 5000,
      });
    }
  };

  const handleUpdateCategory = async (categoryId: string, groupId: string, formData: CategoryFormData) => {
    const toastId = toast({ title: 'Updating category...', variant: 'loading' });
    try {
      await updateCategoryMutation.mutateAsync({
        categoryId,
        data: {
          name: formData.name,
          displayName: formData.displayName,
          emoji: formData.emoji,
        },
      });
      update(toastId, {
        title: 'Category updated successfully',
        variant: 'success',
        dismissible: true,
        duration: 4000,
      });
      setEditingCategory(null);
    } catch (error) {
      console.error('Failed to update category:', error);
      update(toastId, {
        title: 'Failed to update category',
        variant: 'destructive',
        dismissible: true,
        duration: 5000,
      });
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategoryId) return;
    const toastId = toast({ title: 'Deleting category...', variant: 'loading' });
    try {
      await deleteCategoryMutation.mutateAsync(deletingCategoryId);
      update(toastId, {
        title: 'Category deleted successfully',
        variant: 'success',
        dismissible: true,
        duration: 4000,
      });
      setShowDeleteConfirm(false);
      setDeletingCategoryId(null);
    } catch (error) {
      console.error('Failed to delete category:', error);
      update(toastId, {
        title: 'Failed to delete category',
        variant: 'destructive',
        dismissible: true,
        duration: 5000,
      });
    }
  };

  const handleToggleStatus = async (categoryId: string, newStatus: boolean) => {
    const toastId = toast({
      title: newStatus ? 'Enabling category...' : 'Disabling category...',
      variant: 'loading'
    });
    try {
      await toggleStatusMutation.mutateAsync({
        categoryId,
        enabled: newStatus,
      });
      update(toastId, {
        title: newStatus ? 'Category enabled' : 'Category disabled',
        variant: 'success',
        dismissible: true,
        duration: 4000,
      });
    } catch (error) {
      console.error('Failed to toggle category status:', error);
      update(toastId, {
        title: 'Failed to update category status',
        variant: 'destructive',
        dismissible: true,
        duration: 5000,
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, categoryId: string, groupId: string) => {
    setDraggedCategory({ categoryId, fromGroupId: groupId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, toGroupId: string) => {
    e.preventDefault();
    if (!draggedCategory || draggedCategory.fromGroupId === toGroupId) {
      setDraggedCategory(null);
      return;
    }

    const category = groups
      .find(g => g.groupId === draggedCategory.fromGroupId)
      ?.categories.find(c => c.id === draggedCategory.categoryId);

    if (category && category.isCustom) {
      // Update category to new group
      handleUpdateCategory(category.id, toGroupId, {
        groupId: toGroupId,
        name: category.name,
        displayName: category.displayName,
        emoji: category.emoji || '📝',
      });
    }

    setDraggedCategory(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <p className="text-sm">Loading categories...</p>
      </div>
    );
  }

  if (filteredGroups.length === 0 && searchTerm) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <Tag className="h-12 w-12 mb-2 opacity-50" />
        <p className="text-sm">No categories found</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto">


      {/* Masonry Grid Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-6">
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
            {filteredGroups.map((group) => {
              const catCount = group.categories.length;

              return (
                <div
                  key={group.groupId}
                  className="break-inside-avoid mb-6"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, group.groupId)}
                >
                  <Card className=" hover:shadow-md border-2 border-border/80 overflow-hidden rounded-md">
                    {/* Card Header with Icon */}
             
                      <div className="flex items-center justify-between gap-3 mb-4">
                        {/* Icon & Title */}
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {group.groupIcon && (
                            <div className="text-3xl flex-shrink-0 pt-1">
                              {group.groupIcon}
                            </div>
                          )}
                         
                            <h3 className="font-semibold text-sm leading-snug text-foreground">
                              {group.groupName}
                            </h3>
                        
                       
                        </div>

                        {/* Add & Delete Buttons */}
                        <div className="flex gap-1.5 flex-shrink-0">


                          <Button
                            size="icon-xs"
                            variant="ghost"
                            className="hidden group-hover:flex flex-shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setGroupToDelete(group)}
                            title="Delete this group"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="icon-xs"
                                variant="steel"
                                className="flex-shrink-0"
                                onClick={() => setSelectedGroupForCreate(group.groupId)}
                                title="Add category to this group"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </Button>
                            </DialogTrigger>
                            <CreateCategoryDialog
                              onSubmit={(data) => handleCreateCategory({ ...data, groupId: group.groupId })}
                              groups={groups}
                              selectedGroupId={group.groupId}
                              isOpen={selectedGroupForCreate === group.groupId}
                              setIsOpen={(open) => {
                                if (!open) setSelectedGroupForCreate(null);
                              }}
                              isEdit={false}
                              category={null}
                            />
                          </Dialog>

                        </div>
                      </div>
 

                      {/* Categories Grid */}
                      <div className="flex flex-wrap  gap-2">
                        {group.categories.length === 0 ? (
                          <p className="text-xs text-muted-foreground py-2">
                            No categories yet
                          </p>
                        ) : (
                          group.categories.map((category) => (
                            <div
                              key={category.id}
                              draggable={category.isCustom}
                              onDragStart={(e) => handleDragStart(e, category.id, group.groupId)}
                              className={cn(
                                'group/cat relative inline-flex items-center gap-1 px-2 py-1.5',
                                'text-xs rounded-full border   shadow-xl cursor-pointer',
                                
                                category.enabled !== false
                                  ? 'border-border/80 bg-muted/70 hover:bg-muted/80 hover:border-border/70 text-muted-foreground'
                                  : 'border-border/30 bg-muted text-muted-foreground opacity-60',
                                  category.isCustom && 'cursor-move bg-accent',
                              )}
                              
                            >
                              {category.emoji && (
                                <span className="text-sm  ">{category.emoji}</span>
                              )}
                              <span className="font-medium">{category.displayName}</span>

                              {/* Quick Actions - Appear on Hover */}
                              {category.isCustom && (
                                <div className="hidden group-hover/cat:flex items-center gap-0.5 ml-1 pl-1 border-l border-border/30">
                                  <button
                                    onClick={() => setEditingCategory({ ...category, groupId: group.groupId })}
                                    className="p-0.5 rounded opacity-60 hover:opacity-100 hover:bg-muted transition-all"
                                  >
                                    <Edit2 className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setDeletingCategoryId(category.id);
                                      setShowDeleteConfirm(true);
                                    }}
                                    className="p-0.5 rounded opacity-60 hover:opacity-100 hover:bg-muted transition-all"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => handleToggleStatus(category.id, category.enabled === false ? true : false)}
                                    className="p-0.5 rounded opacity-60 hover:opacity-100 hover:bg-muted transition-all"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                  
                  </Card>
                </div>
              );
            })}
          </div>

          {filteredGroups.length === 0 && !searchTerm && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <FolderOpen className="h-12 w-12 mb-3 opacity-40" />
              <p className="text-sm font-medium">No groups found</p>
              <p className="text-xs text-muted-foreground mt-1">Create one to get started</p>
            </div>
          )}

          {filteredGroups.length === 0 && searchTerm && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Tag className="h-12 w-12 mb-3 opacity-40" />
              <p className="text-sm font-medium">No results for "{searchTerm}"</p>
              <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      {editingCategory && (
        <CreateCategoryDialog
          onSubmit={(data) => handleUpdateCategory(editingCategory.id, editingCategory.groupId, data)}
          groups={groups}
          selectedGroupId={editingCategory.groupId}
          isOpen={!!editingCategory}
          setIsOpen={(open) => !open && setEditingCategory(null)}
          isEdit={true}
          category={editingCategory}
        />
      )}

      {/* Delete Category Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Group Confirmation Dialog */}
      <AlertDialog open={!!groupToDelete} onOpenChange={(open) => !open && setGroupToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the group <span className="font-semibold text-foreground">"{groupToDelete?.groupName}"</span>? This action cannot be undone and will remove all categories in this group.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (groupToDelete) {
                  toast({ title: 'Group deletion not yet implemented', variant: 'default', duration: 3000 });
                  setGroupToDelete(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============================================================================
// CREATE/EDIT DIALOG
// ============================================================================

interface CreateCategoryDialogProps {
  onSubmit: (data: CategoryFormData) => Promise<void>;
  children?: React.ReactNode;
  isEdit?: boolean;
  category?: Category & { groupId: string } | null;
  groups: CategoryGroup[];
  selectedGroupId?: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

function CreateCategoryDialog({
  onSubmit,
  children,
  isEdit,
  category,
  groups,
  selectedGroupId,
  isOpen,
  setIsOpen,
}: CreateCategoryDialogProps) {
  const [formData, setFormData] = useState({
    groupId: category?.groupId || selectedGroupId || groups[0]?.groupId || '',
    name: category?.name || '',
    displayName: category?.displayName || '',
    emoji: category?.emoji || '📝',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(category?.emoji || '📝');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      if (!isEdit) {
        setFormData({
          groupId: selectedGroupId || groups[0]?.groupId || '',
          name: '',
          displayName: '',
          emoji: '📝',
        });
        setSelectedEmoji('📝');
      }
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Category' : 'Create New Category'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update your category details'
              : 'Add a new custom category to organize transactions better'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category Group</label>
            <Select
              value={formData.groupId}
              onValueChange={(value) =>
                setFormData({ ...formData, groupId: value })
              }
              disabled={isEdit}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.groupId} value={group.groupId}>
                    <span className="flex items-center gap-2">
                      {group.groupIcon && <span>{group.groupIcon}</span>}
                      {group.groupName}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Emoji Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Emoji</label>
            <div className="grid grid-cols-8 gap-2">
              {EMOJI_SUGGESTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    setSelectedEmoji(emoji);
                    setFormData({ ...formData, emoji });
                  }}
                  className={cn(
                    'h-10 rounded-lg transition-all duration-150',
                    'hover:scale-110 hover:bg-muted',
                    selectedEmoji === emoji
                      ? 'ring-2 ring-primary bg-primary/20'
                      : 'bg-muted/50'
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className="text-sm font-medium">Selected: {selectedEmoji}</div>
          </div>

          {/* Identifier */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Identifier</label>
            <Input
              placeholder="e.g. MyCategory (no spaces)"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="font-mono"
              required
            />
            <p className="text-xs text-muted-foreground">
              Unique identifier for this category
            </p>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Display Name</label>
            <Input
              placeholder="e.g. My Custom Category"
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
              required
            />
          </div>

          {/* Live Preview */}
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Preview</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedEmoji}</span>
              <div>
                <p className="font-medium text-sm">{formData.displayName || 'Display Name'}</p>
                <p className="text-xs text-muted-foreground font-mono">{formData.name || 'identifier'}</p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.name || !formData.displayName}>
              {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
