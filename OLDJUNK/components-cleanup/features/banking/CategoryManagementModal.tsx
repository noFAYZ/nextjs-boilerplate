'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CustomCategoryForm } from './CustomCategoryForm';
import { CategoryTreeView } from './CategoryTreeView';
import { useDeleteCategory } from '@/lib/queries/use-categories-data';
import type { CustomAccountCategory } from '@/lib/types/custom-categories';

interface CategoryManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type EditMode = 'create' | 'edit' | 'addChild';

export function CategoryManagementModal({
  open,
  onOpenChange,
}: CategoryManagementModalProps) {
  const [editMode, setEditMode] = useState<EditMode | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CustomAccountCategory | null>(null);
  const [parentCategory, setParentCategory] = useState<CustomAccountCategory | null>(null);

  const deleteMutation = useDeleteCategory(selectedCategory?.id || '');

  const handleCreateNew = () => {
    setEditMode('create');
    setSelectedCategory(null);
    setParentCategory(null);
  };

  const handleEdit = (category: CustomAccountCategory) => {
    setEditMode('edit');
    setSelectedCategory(category);
    setParentCategory(null);
  };

  const handleAddChild = (parent: CustomAccountCategory) => {
    setEditMode('addChild');
    setSelectedCategory(null);
    setParentCategory(parent);
  };

  const handleDelete = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          setSelectedCategory(null);
          setEditMode(null);
        },
      });
    }
  };

  const handleFormCancel = () => {
    setEditMode(null);
    setSelectedCategory(null);
    setParentCategory(null);
  };

  const handleFormSuccess = () => {
    setEditMode(null);
    setSelectedCategory(null);
    setParentCategory(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Account Categories</DialogTitle>
          <DialogDescription>
            Create hierarchical categories to organize your accounts
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="tree" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tree">Categories</TabsTrigger>
            <TabsTrigger value="edit">
              {editMode ? 'Edit Category' : 'Create New'}
            </TabsTrigger>
          </TabsList>

          {/* Tree View Tab */}
          <TabsContent value="tree" className="space-y-4">
            <Button onClick={handleCreateNew} className="w-full">
              Create New Category
            </Button>

            <CategoryTreeView
              onEdit={handleEdit}
              onAddChild={handleAddChild}
              onDelete={handleDelete}
            />
          </TabsContent>

          {/* Edit Tab */}
          <TabsContent value="edit" className="space-y-4">
            {editMode && (
              <CustomCategoryForm
                category={selectedCategory}
                parentId={parentCategory?.id}
                parentCategory={parentCategory}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
