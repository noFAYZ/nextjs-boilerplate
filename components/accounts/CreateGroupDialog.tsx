"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Loader2, 
  Palette, 
  Smile, 
  CheckCircle2,
  AlertCircle,
  Sparkles,
  X
} from 'lucide-react';
import { useAccountGroupMutations } from '@/lib/hooks/use-account-groups';
import type { AccountGroup, CreateAccountGroupRequest } from '@/lib/types/account-groups';

const createGroupSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less'),
  description: z.string()
    .max(500, 'Description must be 500 characters or less')
    .optional(),
  icon: z.string()
    .max(50, 'Icon must be 50 characters or less')
    .optional(),
  color: z.string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format')
    .optional()
    .or(z.literal('')),
  parentId: z.string().optional(),
});

type CreateGroupForm = z.infer<typeof createGroupSchema>;

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (group: AccountGroup) => void;
  parentGroups?: AccountGroup[];
  defaultParentId?: string;
}

const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green  
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6B7280', // Gray
];

const PRESET_ICONS = [
  '🏦', '💰', '💳', '📊', '💼', '🏪', 
  '🚀', '💎', '⚡', '🔒', '📈', '🎯',
  '💡', '🔥', '⭐', '🌟', '🎨', '🎪',
];

export function CreateGroupDialog({
  open,
  onOpenChange,
  onSuccess,
  parentGroups = [],
  defaultParentId,
}: CreateGroupDialogProps) {
  const [selectedColor, setSelectedColor] = useState<string>('#3B82F6');
  const [selectedIcon, setSelectedIcon] = useState<string>('📁');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { createGroup, isCreating } = useAccountGroupMutations();

  const form = useForm<CreateGroupForm>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: '',
      description: '',
      icon: selectedIcon,
      color: selectedColor,
      parentId: defaultParentId || 'no-parent',
    },
  });

  const onSubmit = async (data: CreateGroupForm) => {
    setError(null);
    setSuccess(null);

    try {
      const payload: CreateAccountGroupRequest = {
        name: data.name,
        description: data.description || undefined,
        icon: data.icon || undefined,
        color: data.color || undefined,
        parentId: data.parentId && data.parentId !== 'no-parent' ? data.parentId : undefined,
      };

      const response = await createGroup(payload);

      if (response.success && response.data) {
        setSuccess(`Successfully created "${data.name}" group!`);
        
        // Auto-close after showing success message
        setTimeout(() => {
          onSuccess(response.data);
          onOpenChange(false);
          handleReset();
        }, 1500);
      } else {
        setError(response.error?.message || 'Failed to create group. Please try again.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please check your connection and try again.');
      console.error('Error creating group:', error);
    }
  };

  const handleReset = () => {
    form.reset();
    setSelectedColor('#3B82F6');
    setSelectedIcon('📁');
    setError(null);
    setSuccess(null);
  };

  const handleClose = () => {
    onOpenChange(false);
    handleReset();
  };

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      handleReset();
    }
  }, [open]);

  // Update form values when preset selections change
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    form.setValue('color', color);
  };

  const handleIconSelect = (icon: string) => {
    setSelectedIcon(icon);
    form.setValue('icon', icon);
  };
console.log('Render CreateGroupDialog', { open, parentGroups, defaultParentId });
if (!open) return null; // Prevent rendering when dialog is closed

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            Create New Group
          </DialogTitle>
          <DialogDescription className="text-base">
            Organize your accounts and wallets into custom groups for better financial management.
          </DialogDescription>
        </DialogHeader>

        {/* Success/Error Alerts */}
        {success && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2"
              onClick={() => setError(null)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Basic Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b">
                <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Basic Information</h3>
              </div>

              {/* Group Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium flex items-center gap-2">
                      Group Name
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Personal Banking, Investment Portfolio" 
                        className="h-11"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Choose a descriptive name that helps you identify this group
                    </FormDescription>
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
                    <FormLabel className="text-base font-medium">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what this group is for..."
                        rows={3}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional: Help you remember what accounts belong in this group
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Parent Group */}
              {parentGroups && parentGroups.length > 0 && (
                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Parent Group</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select a parent group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="no-parent">
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 rounded bg-muted flex items-center justify-center text-xs">
                                📁
                              </div>
                              No parent (top-level)
                            </div>
                          </SelectItem>
                          {parentGroups?.map((group) => (
                            <SelectItem key={group?.id} value={group?.id}>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="h-4 w-4 rounded flex items-center justify-center text-xs"
                                  style={{ 
                                    backgroundColor: group.color ? `${group.color}20` : 'rgb(243 244 246)',
                                    color: group.color || 'rgb(107 114 128)' 
                                  }}
                                >
                                  {group.icon || '📁'}
                                </div>
                                {group?.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Optional: Create a subgroup under another group for better organization
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Appearance Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b">
                <div className="h-5 w-5 rounded bg-orange-100 flex items-center justify-center">
                  <Palette className="h-3 w-3 text-orange-600" />
                </div>
                <h3 className="font-semibold text-lg">Appearance</h3>
              </div>

              {/* Icon Selection */}
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium flex items-center gap-2">
                      <Smile className="h-4 w-4" />
                      Choose Icon
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <Input
                          placeholder="Enter custom emoji or leave empty"
                          {...field}
                          className="h-11"
                        />
                        
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-sm font-medium mb-3">Popular Icons</div>
                            <div className="grid grid-cols-9 gap-2">
                              {PRESET_ICONS.map((icon) => (
                                <Button
                                  key={icon}
                                  type="button"
                                  variant={selectedIcon === icon ? 'default' : 'outline'}
                                  className="h-10 w-10 p-0 text-lg hover:scale-110 transition-transform"
                                  onClick={() => handleIconSelect(icon)}
                                >
                                  {icon}
                                </Button>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Choose a visual icon that represents this group's purpose
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Color Selection */}
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Choose Color
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Input
                            placeholder="#3B82F6"
                            {...field}
                            className="h-11 font-mono"
                          />
                          <div
                            className="h-11 w-16 rounded-md border flex-shrink-0"
                            style={{ backgroundColor: selectedColor }}
                          />
                        </div>
                        
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-sm font-medium mb-3">Popular Colors</div>
                            <div className="grid grid-cols-5 gap-3">
                              {PRESET_COLORS.map((color) => (
                                <Button
                                  key={color}
                                  type="button"
                                  variant="outline"
                                  className="h-12 w-full p-0 relative hover:scale-105 transition-transform"
                                  style={{ backgroundColor: color }}
                                  onClick={() => handleColorSelect(color)}
                                >
                                  {selectedColor === color && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <CheckCircle2 className="h-6 w-6 text-white drop-shadow-lg" />
                                    </div>
                                  )}
                                </Button>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Pick a color theme to make this group easily recognizable
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Preview Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b">
                <div className="h-5 w-5 rounded bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg">Preview</h3>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-4 p-6 border rounded-lg bg-gradient-to-br from-background to-muted/30">
                      <div
                        className="h-16 w-16 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                        style={{
                          backgroundColor: `${selectedColor}15`,
                          color: selectedColor,
                          border: `2px solid ${selectedColor}30`
                        }}
                      >
                        {selectedIcon}
                      </div>
                      <div className="text-left">
                        <div className="text-xl font-semibold">
                          {form.watch('name') || 'Group Name'}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {form.watch('description') || 'Group description will appear here'}
                        </div>
                        {form.watch('parentId') && form.watch('parentId') !== 'no-parent' && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Under: {parentGroups?.find(g => g.id === form.watch('parentId'))?.name}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      This is how your group will appear in the groups list
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isCreating || success}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isCreating || !form.watch('name') || success}
                className="min-w-[120px]"
              >
                {isCreating ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </span>
                ) : success ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Created!
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Create Group
                  </span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}