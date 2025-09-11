'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ColorPicker } from '@/components/ui/color-picker';
import { EmojiPicker } from '@/components/ui/emoji-picker';
import { Palette, Smile } from 'lucide-react';
import { useToast } from '@/lib/hooks/use-toast';
import { useAccountGroupMutations } from '@/lib/hooks/use-account-groups';
import type { AccountGroup, UpdateAccountGroupRequest } from '@/lib/types/account-groups';

// Validation schema
const editGroupSchema = z.object({
  name: z.string()
    .min(1, 'Group name is required')
    .max(100, 'Group name must be less than 100 characters'),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  icon: z.string()
    .max(50, 'Icon must be less than 50 characters')
    .optional(),
  color: z.string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format')
    .optional(),
  parentId: z.string().optional(),
  sortOrder: z.number()
    .min(0, 'Sort order must be a positive number')
    .optional(),
});

type EditGroupFormData = z.infer<typeof editGroupSchema>;

interface EditGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: AccountGroup;
  parentGroups?: AccountGroup[];
  onSuccess?: (updatedGroup: AccountGroup) => void;
}

const DEFAULT_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  '#64748b', '#78716c', '#dc2626', '#ea580c',
];

const DEFAULT_ICONS = [
  '📁', '💰', '🏦', '💳', '🔗', '⭐', '🎯', '📊',
  '💼', '🏠', '🚗', '🎓', '🛒', '🍕', '✈️', '⚡',
];

export function EditGroupDialog({
  open,
  onOpenChange,
  group,
  parentGroups = [],
  onSuccess,
}: EditGroupDialogProps) {
  const { toast } = useToast();
  const { updateGroup, isUpdating } = useAccountGroupMutations();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const form = useForm<EditGroupFormData>({
    resolver: zodResolver(editGroupSchema),
    defaultValues: {
      name: group.name,
      description: group.description || '',
      icon: group.icon || '',
      color: group.color || '',
      parentId: group.parentId || '',
      sortOrder: group.sortOrder,
    },
  });

  // Reset form when group changes
  useEffect(() => {
    if (group) {
      form.reset({
        name: group.name,
        description: group.description || '',
        icon: group.icon || '',
        color: group.color || '',
        parentId: group.parentId || '',
        sortOrder: group.sortOrder,
      });
    }
  }, [group, form]);

  const onSubmit = async (data: EditGroupFormData) => {
    try {
      // Remove empty strings and convert to null for optional fields
      const updateData: UpdateAccountGroupRequest = {
        name: data.name,
        description: data.description || null,
        icon: data.icon || null,
        color: data.color || null,
        parentId: data.parentId || null,
        sortOrder: data.sortOrder,
      };

      const response = await updateGroup(group.id, updateData);

      if (response.success) {
        toast({
          title: 'Group updated',
          description: `Successfully updated "${data.name}".`,
        });
        onSuccess?.(response.data);
        onOpenChange(false);
      } else {
        toast({
          title: 'Update failed',
          description: response.error?.message || 'Failed to update group.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating group:', error);
      toast({
        title: 'Update failed',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  const handleColorSelect = (color: string) => {
    form.setValue('color', color);
    setShowColorPicker(false);
  };

  const handleEmojiSelect = (emoji: string) => {
    form.setValue('icon', emoji);
    setShowEmojiPicker(false);
  };

  const currentColor = form.watch('color');
  const currentIcon = form.watch('icon');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Account Group</DialogTitle>
          <DialogDescription>
            Update your account group details and organization
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Group Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter group name"
                      {...field}
                      disabled={group.isDefault}
                    />
                  </FormControl>
                  {group.isDefault && (
                    <FormDescription>
                      Default group names cannot be changed
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what this group is for..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional description to help organize your accounts
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Icon and Color Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Icon Picker */}
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-10 w-10 rounded-lg border flex items-center justify-center text-lg cursor-pointer hover:bg-muted transition-colors"
                          style={{
                            backgroundColor: currentColor ? `${currentColor}20` : undefined,
                            color: currentColor || 'inherit',
                          }}
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                          {currentIcon || '📁'}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                          <Smile className="h-4 w-4 mr-2" />
                          Choose
                        </Button>
                      </div>
                      
                      {showEmojiPicker && (
                        <div className="grid grid-cols-8 gap-1 p-3 border rounded-lg bg-muted/20">
                          {DEFAULT_ICONS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              className="h-8 w-8 flex items-center justify-center rounded hover:bg-muted transition-colors text-lg"
                              onClick={() => handleEmojiSelect(emoji)}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Color Picker */}
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-10 w-10 rounded-lg border cursor-pointer hover:scale-105 transition-transform"
                          style={{ backgroundColor: currentColor || '#64748b' }}
                          onClick={() => setShowColorPicker(!showColorPicker)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowColorPicker(!showColorPicker)}
                        >
                          <Palette className="h-4 w-4 mr-2" />
                          Choose
                        </Button>
                      </div>
                      
                      {showColorPicker && (
                        <div className="grid grid-cols-6 gap-2 p-3 border rounded-lg bg-muted/20">
                          {DEFAULT_COLORS.map((color) => (
                            <button
                              key={color}
                              type="button"
                              className="h-8 w-8 rounded-lg border-2 border-white shadow-sm hover:scale-105 transition-transform"
                              style={{ backgroundColor: color }}
                              onClick={() => handleColorSelect(color)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Parent Group */}
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Group</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={group.isDefault}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent group (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">No parent (top level)</SelectItem>
                      {parentGroups
                        .filter(pg => pg.id !== group.id) // Don't allow self as parent
                        .map((parentGroup) => (
                        <SelectItem key={parentGroup.id} value={parentGroup.id}>
                          <div className="flex items-center gap-2">
                            <span>{parentGroup.icon || '📁'}</span>
                            <span>{parentGroup.name}</span>
                            {parentGroup.isDefault && (
                              <Badge variant="secondary" className="text-xs">
                                Default
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {group.isDefault && (
                    <FormDescription>
                      Default groups cannot be moved
                    </FormDescription>
                  )}
                  <FormDescription>
                    Choose a parent group to create a hierarchy
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sort Order */}
            <FormField
              control={form.control}
              name="sortOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Lower numbers appear first in lists
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating && <LoadingSpinner size="sm" className="mr-2" />}
                Update Group
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}