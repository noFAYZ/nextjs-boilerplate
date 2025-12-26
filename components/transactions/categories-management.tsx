'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
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
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useTransactionCategories,
  useCreateCustomCategory,
  useUpdateCategory,
  useDeleteCategory,
  useToggleCategoryStatus,
  useCreateCategoryGroup,
} from '@/lib/queries/use-transaction-categories-data';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Checkbox } from '../ui/checkbox';

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

interface GroupFormData {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

const EMOJI_SUGGESTIONS = [
  '🍔', '🍕', '🚗', '🏠', '🛍️', '💼', '🎮', '📚',
  '✈️', '🏥', '💳', '🎓', '⚽', '🎬', '📱', '💻',
  '🌱', '🎨', '🚀', '🔧', '📊', '🎵', '☕', '🍎',
];

export function CategoriesManagement() {
  const { toast, update, dismiss } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<(Category & { groupId: string; }) | null>(null);
  const [deletingCategoryIds, setDeletingCategoryIds] = useState<string[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [showOnlyCustom, setShowOnlyCustom] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [pendingDisableCategoryId, setPendingDisableCategoryId] = useState<string | null>(null);
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);

  // Queries and mutations
  const { data: categoriesData, isLoading } = useTransactionCategories();
  const createCategoryMutation = useCreateCustomCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();
  const toggleStatusMutation = useToggleCategoryStatus();

  const groups = (categoriesData?.groups || []) as CategoryGroup[];

  // Set first group as selected by default
  if (!selectedGroup && groups.length > 0) {
    setSelectedGroup(groups[0].groupId);
  }

  const currentGroup = groups.find(g => g.groupId === selectedGroup);

  // Filter categories
  const filteredCategories = useMemo(() => {
    if (!currentGroup) return [];

    return currentGroup.categories.filter((cat) => {
      const matchesSearch =
        cat.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = !showOnlyCustom || cat.isCustom;
      return matchesSearch && matchesFilter;
    });
  }, [currentGroup, searchTerm, showOnlyCustom]);

  const handleCreateCategory = async (formData: CategoryFormData) => {
    setIsSubmittingCategory(true);
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
      setEditingCategory(null);
    } catch (error) {
      console.error('Failed to create category:', error);
      update(toastId, {
        title: 'Failed to create category',
        variant: 'destructive',
        dismissible: true,
        duration: 5000,
      });
    } finally {
      setIsSubmittingCategory(false);
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
    if (deletingCategoryIds.length === 0) return;
    const toastId = toast({ title: 'Deleting category...', variant: 'loading' });
    try {
      for (const categoryId of deletingCategoryIds) {
        await deleteCategoryMutation.mutateAsync(categoryId);
      }
      update(toastId, {
        title: `${deletingCategoryIds.length} categor${deletingCategoryIds.length === 1 ? 'y' : 'ies'} deleted successfully`,
        variant: 'success',
        dismissible: true,
        duration: 4000,
      });
      setDeletingCategoryIds([]);
      setShowDeleteConfirm(false);
      setSelectedCategoryIds(new Set());
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

  const handleToggleStatus = async (categoryId: string) => {
    setPendingDisableCategoryId(categoryId);
    setShowDisableConfirm(true);
  };

  const confirmToggleStatus = async () => {
    if (!pendingDisableCategoryId) return;
    const category = filteredCategories.find(c => c.id === pendingDisableCategoryId);
    if (!category) return;
    const newStatus = !category.enabled;
    const toastId = toast({
      title: newStatus ? 'Enabling category...' : 'Disabling category...',
      variant: 'loading'
    });
    try {
      await toggleStatusMutation.mutateAsync({
        categoryId: pendingDisableCategoryId,
        enabled: newStatus,
      });
      update(toastId, {
        title: newStatus ? 'Category enabled' : 'Category disabled',
        variant: 'success',
        dismissible: true,
        duration: 4000,
      });
      setShowDisableConfirm(false);
      setPendingDisableCategoryId(null);
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

  return (
    <div >
      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex gap-4">
        {/* Groups Sidebar */}
        <div className="w-80   overflow-y-auto   flex flex-col">
          <div className="flex-1">
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 py-2">
                <p className="text-xs font-semibold text-muted-foreground">CATEGORY GROUPS</p>
                <CreateGroupButton />
              </div>

              {isLoading ? (
                <div className="text-center py-4">
                  <p className="text-xs text-muted-foreground">Loading...</p>
                </div>
              ) : (
                groups.map((group) => {
                  const customCount = group.categories.filter(c => c.isCustom).length;
                  const isSelected = selectedGroup === group.groupId;

                  return (
                    <Button
                      key={group.groupId}
                      onClick={() => setSelectedGroup(group.groupId)}
                      variant={isSelected ? 'outlinecard' : 'ghost'}
                      className={cn(
                        'w-full text-left  h-9 ',
                        'flex items-center justify-between gap-2',
                        'hover:bg-muted/50'
                      )}
                      size='sm'
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {group.groupIcon && <span className="text-xl flex-shrink-0">{group.groupIcon}</span>}
                        <div className="truncate min-w-0">
                          <div className="text-sm font-medium truncate">{group.groupName}</div>
                     
                        </div>
     <Badge variant='soft' size='sm' className="text-xs  rounded-full mt-0.5">
                            {group.categories.length} {customCount > 0 ? `(${customCount} +)` : ''}
                          </Badge>

                      </div>
                 
                      {isSelected && <ChevronRight className='w-4 h-4' /> }
                    </Button>
                  );
                })
              )}
            </div>
          </div>

       
        </div>

        {/* Categories Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {!selectedGroup ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <FolderOpen className="h-12 w-12 mb-2 opacity-50" />
              <p>Select a category group</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <Card className="flex-row items-center justify-between p-4  rounded-none border-border/50 bg-muted ">
                
                <div className="flex items-center gap-2">
                      {/* Select All Checkbox */}
                      {filteredCategories.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedCategoryIds.size === filteredCategories.length && filteredCategories.length > 0}
                        indeterminate={selectedCategoryIds.size > 0 && selectedCategoryIds.size < filteredCategories.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCategoryIds(new Set(filteredCategories.map(c => c.id)));
                          } else {
                            setSelectedCategoryIds(new Set());
                          }
                        }}
                        title="Select all categories"
                      />

                  
                    </div>
                  )}
                  {currentGroup?.groupIcon && <span className="text-3xl">{currentGroup.groupIcon}</span>}
                  <div>
                    <h2 className="text-lg font-semibold">{currentGroup?.groupName}</h2>
                    <p className="text-xs text-muted-foreground">
                      {selectedCategoryIds.size > 0
                        ? `${selectedCategoryIds.size} of ${filteredCategories.length} selected`
                        : `${filteredCategories.length} ${filteredCategories.length === 1 ? 'category' : 'categories'}`
                      }
                    </p>
                  </div>
                </div>

                {/* Group Header Actions */}
                <div className="flex items-center gap-2">
              

                  {/* Create Category Button */}
                  {selectedGroup && (
                    <CreateCategoryButton
                      onOpen={() => setIsCreateOpen(true)}
                      isSubmitting={isSubmittingCategory}
                    />
                  )}
                      {/* Bulk Action Buttons */}
                      {selectedCategoryIds.size > 0 && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            title={`Delete ${selectedCategoryIds.size} categor${selectedCategoryIds.size === 1 ? 'y' : 'ies'}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                </div>
              </Card>

    
              {/* Categories List */}
              <div className="flex-1 overflow-y-auto   ">
                {filteredCategories.length == 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <Tag className="h-12 w-12 mb-2 opacity-50" />
                    <p className="text-sm mb-1">No categories found</p>
                    <p className="text-xs">
                      {searchTerm ? 'Try a different search' : 'Create your first category'}
                    </p>
                  </div>
                ) : (
                  filteredCategories.map((category) => (
                    <CategoryListCard
                      key={category.id}
                      category={category}
                      isSelected={selectedCategoryIds.has(category.id)}
                      onSelectionChange={(selected) => {
                        const newSelected = new Set(selectedCategoryIds);
                        if (selected) {
                          newSelected.add(category.id);
                        } else {
                          newSelected.delete(category.id);
                        }
                        setSelectedCategoryIds(newSelected);
                      }}
                      onEdit={() => setEditingCategory({ ...category, groupId: currentGroup?.groupId || '' })}
                      onDelete={() => {
                        setDeletingCategoryIds([category.id]);
                        setShowDeleteConfirm(true);
                      }}
                      onToggleStatus={() => handleToggleStatus(category.id)}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <CreateCategoryDialog
        onSubmit={editingCategory ? (data) => handleUpdateCategory(editingCategory.id, editingCategory.groupId, data) : handleCreateCategory}
        groups={groups}
        selectedGroupId={selectedGroup || ''}
        isOpen={isCreateOpen}
        setIsOpen={setIsCreateOpen}
        isEdit={false}
        category={null}
      />

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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deletingCategoryIds.length === 1 ? 'Category' : 'Categories'}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingCategoryIds.length === 1 ? 'this category' : `these ${deletingCategoryIds.length} categories`}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deletingCategoryIds.length > 1 && (
            <div className="max-h-40 overflow-y-auto bg-muted/50 rounded p-2 text-sm">
              {filteredCategories
                .filter(c => deletingCategoryIds.includes(c.id))
                .map(c => (
                  <div key={c.id} className="flex items-center gap-2 py-1">
                    {c.emoji && <span className="text-lg">{c.emoji}</span>}
                    <span>{c.displayName}</span>
                  </div>
                ))}
            </div>
          )}
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Disable Confirmation Dialog */}
      <AlertDialog open={showDisableConfirm} onOpenChange={setShowDisableConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Category Status</AlertDialogTitle>
            <AlertDialogDescription>
              {(() => {
                const cat = filteredCategories.find(c => c.id === pendingDisableCategoryId);
                return cat?.enabled
                  ? `Are you sure you want to disable "${cat.displayName}"? It won't be suggested for new transactions.`
                  : `Are you sure you want to enable "${cat?.displayName}"? It will be available for new transactions.`;
              })()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggleStatus}>
              {(() => {
                const cat = filteredCategories.find(c => c.id === pendingDisableCategoryId);
                return cat?.enabled ? 'Disable' : 'Enable';
              })()}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============================================================================
// CATEGORY LIST CARD
// ============================================================================

interface CategoryListCardProps {
  category: Category;
  isSelected?: boolean;
  onSelectionChange?: (selected: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

function CategoryListCard({
  category,
  isSelected = false,
  onSelectionChange,
  onEdit,
  onDelete,
  onToggleStatus,
}: CategoryListCardProps) {
  return (
    <Card className={cn(
      'border-none bg-none',
      'hover:shadow-sm rounded-none',
      category.isDefault && ' ',
      isSelected && 'bg-muted/80  border border-primary/30'
    )}>
      <div className="flex items-center justify-between gap-3">
        {/* Checkbox & Content */}
        <div className="flex items-center gap-3 flex-1">
          {onSelectionChange && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={onSelectionChange}
              className="flex-shrink-0"
              size='sm'
            />
          )}

          {category.emoji && <span className="text-2xl flex-shrink-0">{category.emoji}</span>}
          {!category.emoji && (
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm">{category.displayName}</h3>
        
          </div>
        </div>

        {/* Status Toggle & Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Status Toggle */}
          <Switch
            checked={category.enabled ?? true}
            onCheckedChange={onToggleStatus}
            title={category.enabled ? 'Disable' : 'Enable'}
          />

          {/* Action Buttons */}
          {category.isCustom && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={onEdit}
                className="h-8 w-8"
                title="Edit category"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="h-8 w-8 text-destructive hover:text-destructive"
                title="Delete category"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

// ============================================================================
// CREATE CATEGORY BUTTON
// ============================================================================

interface CreateCategoryButtonProps {
  onOpen: () => void;
  isSubmitting?: boolean;
}

function CreateCategoryButton({ onOpen, isSubmitting }: CreateCategoryButtonProps) {
  return (
    <Button
      size="xs"
      className="gap-1"
      onClick={onOpen}
      disabled={isSubmitting}
    >
      <Plus className="h-4 w-4" />
      Add Category
    </Button>
  );
}

// ============================================================================
// CREATE GROUP BUTTON
// ============================================================================

function CreateGroupButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon-xs"  title="Add Group">
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <CreateGroupDialog setIsOpen={setIsOpen} />
    </Dialog>
  );
}

// ============================================================================
// CREATE GROUP DIALOG
// ============================================================================

interface CreateGroupDialogProps {
  setIsOpen: (open: boolean) => void;
}

function CreateGroupDialog({ setIsOpen }: CreateGroupDialogProps) {
  const { toast, update } = useToast();
  const [formData, setFormData] = useState<GroupFormData>({
    name: '',
    description: '',
    icon: '📁',
  });
  const [selectedEmoji, setSelectedEmoji] = useState('📁');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createGroupMutation = useCreateCategoryGroup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast({ title: 'Creating category group...', variant: 'loading' });
    try {
      await createGroupMutation.mutateAsync({
        name: formData.name,
        description: formData.description,
        icon: formData.icon,
      });
      update(toastId, {
        title: `Group "${formData.name}" created successfully`,
        variant: 'success',
        dismissible: true,
        duration: 4000,
      });
      setFormData({
        name: '',
        description: '',
        icon: '📁',
      });
      setSelectedEmoji('📁');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to create group:', error);
      update(toastId, {
        title: 'Failed to create category group',
        variant: 'destructive',
        dismissible: true,
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Create New Category Group</DialogTitle>
        <DialogDescription>
          Create a custom category group to organize your categories better
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Group Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Group Name</label>
          <Input
            placeholder="e.g. Work Expenses"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Description (Optional)</label>
          <Input
            placeholder="e.g. Business and professional expenses"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* Icon/Emoji Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Icon</label>
          <div className="grid grid-cols-8 gap-2">
            {EMOJI_SUGGESTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  setSelectedEmoji(emoji);
                  setFormData({ ...formData, icon: emoji });
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

        {/* Live Preview */}
        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Preview</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{selectedEmoji}</span>
            <div>
              <p className="font-medium text-sm">{formData.name || 'Group Name'}</p>
              <p className="text-xs text-muted-foreground">{formData.description || 'Group description'}</p>
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
          <Button type="submit" disabled={isSubmitting || !formData.name}>
            {isSubmitting ? 'Creating...' : 'Create Group'}
          </Button>
        </div>
      </form>
    </DialogContent>
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

const ButtonGroup = ({ children }: { children: React.ReactNode }) => (
  <div className="flex border border-input rounded-lg divide-x divide-input overflow-hidden">
    {children}
  </div>
);
ButtonGroup.displayName = 'ButtonGroup';
