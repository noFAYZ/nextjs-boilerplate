'use client';

/**
 * Create/Edit Organization Modal
 *
 * Modal for creating new organization or editing existing one
 * - Form with name, description, icon, and logo
 * - Validation and error handling
 * - Loading state during submission
 */

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCreateOrganization, useUpdateOrganization } from '@/lib/queries/use-organization-data';
import { useOrganizationUIStore } from '@/lib/stores/ui-stores';
import type { Organization, CreateOrganizationInput, UpdateOrganizationInput } from '@/lib/types/organization';

interface CreateOrganizationModalProps {
  organization?: Organization | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (org: Organization) => void;
}

export function CreateOrganizationModal({
  organization,
  isOpen,
  onClose,
  onSuccess,
}: CreateOrganizationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    logoUrl: '',
  });
  const [error, setError] = useState('');

  const createMutation = useCreateOrganization();
  const updateMutation = useUpdateOrganization(organization?.id || '');

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name,
        slug: organization.slug,
        description: organization.description || '',
        icon: organization.icon || '',
        logoUrl: organization.logoUrl || '',
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        icon: '',
        logoUrl: '',
      });
    }
    setError('');
  }, [organization, isOpen]);

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const isEditMode = !!organization;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-generate slug from name
    if (name === 'name') {
      setFormData((prev) => ({
        ...prev,
        slug: value.toLowerCase().replace(/\s+/g, '-'),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Organization name is required');
      return;
    }

    if (!formData.slug.trim()) {
      setError('Slug is required');
      return;
    }

    try {
      if (isEditMode && organization) {
        const updateInput: UpdateOrganizationInput = {
          name: formData.name,
          description: formData.description || undefined,
          icon: formData.icon || undefined,
          logoUrl: formData.logoUrl || undefined,
        };
        const response = await updateMutation.mutateAsync(updateInput);
        if (response.success && response.data) {
          onSuccess?.(response.data);
          onClose();
        }
      } else {
        const createInput: CreateOrganizationInput = {
          name: formData.name,
          slug: formData.slug,
          description: formData.description || undefined,
          icon: formData.icon || undefined,
          logoUrl: formData.logoUrl || undefined,
        };
        const response = await createMutation.mutateAsync(createInput);
        if (response.success && response.data) {
          onSuccess?.(response.data);
          onClose();
        }
      }
    } catch (err) {
      setError(
        (err as any)?.error?.message || 'Failed to save organization'
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-background">
          <h2 className="text-lg font-semibold">
            {isEditMode ? 'Edit Organization' : 'Create Organization'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-md transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Organization Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Acme Corp"
              className="w-full px-3 py-2 border border-input rounded-md bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
          </div>

          {/* Slug */}
          {!isEditMode && (
            <div>
              <label htmlFor="slug" className="block text-sm font-medium mb-1">
                Slug (URL) *
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                value={formData.slug}
                onChange={handleChange}
                placeholder="acme-corp"
                className="w-full px-3 py-2 border border-input rounded-md bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">Auto-generated from name</p>
            </div>
          )}

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of your organization"
              rows={3}
              className="w-full px-3 py-2 border border-input rounded-md bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
          </div>

          {/* Icon */}
          <div>
            <label htmlFor="icon" className="block text-sm font-medium mb-1">
              Icon (Emoji)
            </label>
            <input
              id="icon"
              name="icon"
              type="text"
              value={formData.icon}
              onChange={handleChange}
              placeholder="🏢"
              maxLength={2}
              className="w-full px-3 py-2 border border-input rounded-md bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-center text-xl"
              disabled={isLoading}
            />
          </div>

          {/* Logo URL */}
          <div>
            <label htmlFor="logoUrl" className="block text-sm font-medium mb-1">
              Logo URL
            </label>
            <input
              id="logoUrl"
              name="logoUrl"
              type="url"
              value={formData.logoUrl}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
              className="w-full px-3 py-2 border border-input rounded-md bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-input rounded-md hover:bg-muted transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
