'use client';

/**
 * Create/Edit Organization Modal
 *
 * Modern dialog-based modal for creating/editing organizations
 * - Built on Radix Dialog component for accessibility
 * - Organized form sections with proper spacing
 * - Advanced emoji picker with suggestions
 * - Real-time form validation
 * - Loading states and error handling
 */

import { useState, useEffect } from 'react';
import { Check, AlertCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCreateOrganization, useUpdateOrganization } from '@/lib/queries/use-organization-data';
import { useOrganizationUIStore } from '@/lib/stores/ui-stores';
import type { Organization, CreateOrganizationInput, UpdateOrganizationInput } from '@/lib/types/organization';

interface CreateOrganizationModalProps {
  organization?: Organization | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (org: Organization) => void;
}

const EMOJI_SUGGESTIONS = ['🏢', '💼', '🚀', '💡', '🎯', '📊', '💰', '🏦', '🎨', '⚙️', '🔧', '📱', '🌟', '💎', '🎭', '🎪'];

/**
 * Compact Emoji Picker Component
 * Provides quick selection and manual input for workspace icon
 * Designed to be compact and space-efficient
 */
function CompactEmojiPicker({ value, onChange }: { value: string; onChange: (emoji: string) => void }) {
  const [showAll, setShowAll] = useState(false);

  // Show 6 or 12 emojis depending on expanded state
  const displayEmojis = showAll ? EMOJI_SUGGESTIONS : EMOJI_SUGGESTIONS.slice(0, 6);

  return (
    <div className="space-y-2">
      {/* Grid of emoji buttons - compact */}
      <div className="grid grid-cols-6 gap-1.5">
        {displayEmojis.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onChange(emoji)}
            className={cn(
              'p-1.5 text-base rounded-md transition-all duration-150 flex items-center justify-center',
              'border cursor-pointer aspect-square',
              value === emoji
                ? 'bg-primary/20 border-primary shadow-sm'
                : 'border-input hover:border-primary/50 hover:bg-muted/50'
            )}
            aria-pressed={value === emoji}
            title={emoji}
          >
            {emoji}
          </button>
        ))}

        {/* Manual Input Inline */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.substring(0, 2))}
          placeholder="📝"
          maxLength={2}
          className={cn(
            'w-full p-1.5 border rounded-md bg-background text-base text-center',
            'placeholder:text-muted-foreground focus:outline-none focus:ring-2 aspect-square',
            'focus:ring-primary/50 focus:border-primary transition-all'
          )}
          title="Paste custom emoji"
        />
      </div>

      {/* Show More Button */}
      {!showAll && EMOJI_SUGGESTIONS.length > 6 && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="text-xs text-primary hover:text-primary/80 font-medium mt-1"
        >
          + {EMOJI_SUGGESTIONS.length - 6} more
        </button>
      )}
    </div>
  );
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
    icon: EMOJI_SUGGESTIONS[0],
    logoUrl: '',
  });
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateOrganization();
  const updateMutation = useUpdateOrganization(organization?.id || '');

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name,
        slug: organization.slug,
        description: organization.description || '',
        icon: organization.icon || EMOJI_SUGGESTIONS[0],
        logoUrl: organization.logoUrl || '',
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        icon: EMOJI_SUGGESTIONS[0],
        logoUrl: '',
      });
    }
    setError('');
    setValidationErrors({});
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
    if (name === 'name' && !isEditMode) {
      setFormData((prev) => ({
        ...prev,
        slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
      }));
    }

    // Clear error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleIconChange = (emoji: string) => {
    setFormData((prev) => ({
      ...prev,
      icon: emoji,
    }));
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.icon;
      return newErrors;
    });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Workspace name is required';
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (formData.name.length > 100) {
      errors.name = 'Name must not exceed 100 characters';
    }

    if (!isEditMode) {
      if (!formData.slug.trim()) {
        errors.slug = 'Slug is required';
      } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
        errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
      } else if (formData.slug.length < 2) {
        errors.slug = 'Slug must be at least 2 characters';
      } else if (formData.slug.length > 50) {
        errors.slug = 'Slug must not exceed 50 characters';
      }
    }

    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description must not exceed 500 characters';
    }

    if (formData.logoUrl && !isValidUrl(formData.logoUrl)) {
      errors.logoUrl = 'Please enter a valid URL';
    }

    return errors;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
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
      setError((err as any)?.error?.message || 'Failed to save workspace');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="px-5 py-3 border-b border-border">
          <div className="space-y-1">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              {isEditMode ? 'Edit Workspace' : 'Create Workspace'}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {isEditMode ? 'Update your workspace settings' : 'Set up your workspace'}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Form Content */}
        <ScrollArea className="flex-1 px-5">
          <form onSubmit={handleSubmit} className="space-y-4 pb-4">
            {/* Error Alert */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3 pt-2">
                <AlertCircle size={16} className="text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-xs text-destructive font-medium">{error}</p>
              </div>
            )}

            {/* Workspace Name & Icon */}
            <div className="grid grid-cols-4 gap-3 pt-2">
              {/* Icon Picker First */}
              <div className="col-span-1">
                <label className="block text-xs font-medium mb-2">Icon</label>
                <CompactEmojiPicker value={formData.icon} onChange={handleIconChange} />
              </div>

              {/* Name & URL */}
              <div className="col-span-3 space-y-3">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-xs font-medium mb-1">
                    Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Acme Corp"
                    className={cn(
                      'w-full px-2.5 py-1.5 border rounded-md bg-background text-xs',
                      'placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all',
                      validationErrors.name
                        ? 'border-destructive/50 focus:ring-destructive/50'
                        : 'border-input focus:ring-primary/50 focus:border-primary'
                    )}
                    disabled={isLoading}
                    maxLength={100}
                  />
                  {validationErrors.name && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-0.5">
                      <AlertCircle size={12} />
                      {validationErrors.name}
                    </p>
                  )}
                </div>

                {/* Slug */}
                {!isEditMode && (
                  <div>
                    <label htmlFor="slug" className="block text-xs font-medium mb-1">
                      URL <span className="text-destructive">*</span>
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">ws.com/</span>
                      <input
                        id="slug"
                        name="slug"
                        type="text"
                        value={formData.slug}
                        onChange={handleChange}
                        placeholder="my-org"
                        className={cn(
                          'flex-1 px-2.5 py-1.5 border rounded-md bg-background text-xs',
                          'placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all',
                          validationErrors.slug
                            ? 'border-destructive/50 focus:ring-destructive/50'
                            : 'border-input focus:ring-primary/50 focus:border-primary'
                        )}
                        disabled={isLoading}
                        maxLength={50}
                      />
                    </div>
                    {validationErrors.slug && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-0.5">
                        <AlertCircle size={12} />
                        {validationErrors.slug}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Separator className="my-3" />

            {/* Description & Logo */}
            <div className="space-y-3">
              <div>
                <label htmlFor="description" className="block text-xs font-medium mb-1">
                  Description <span className="text-muted-foreground">(Optional)</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="What's this workspace for?"
                  rows={2}
                  className={cn(
                    'w-full px-2.5 py-1.5 border rounded-md bg-background text-xs',
                    'placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all resize-none',
                    validationErrors.description
                      ? 'border-destructive/50 focus:ring-destructive/50'
                      : 'border-input focus:ring-primary/50 focus:border-primary'
                  )}
                  disabled={isLoading}
                  maxLength={500}
                />
                {validationErrors.description && (
                  <p className="text-xs text-destructive mt-1 flex items-center gap-0.5">
                    <AlertCircle size={12} />
                    {validationErrors.description}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="logoUrl" className="block text-xs font-medium mb-1">
                  Logo URL <span className="text-muted-foreground">(Optional)</span>
                </label>
                <input
                  id="logoUrl"
                  name="logoUrl"
                  type="url"
                  value={formData.logoUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                  className={cn(
                    'w-full px-2.5 py-1.5 border rounded-md bg-background text-xs',
                    'placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all',
                    validationErrors.logoUrl
                      ? 'border-destructive/50 focus:ring-destructive/50'
                      : 'border-input focus:ring-primary/50 focus:border-primary'
                  )}
                  disabled={isLoading}
                />
                {validationErrors.logoUrl && (
                  <p className="text-xs text-destructive mt-1 flex items-center gap-0.5">
                    <AlertCircle size={12} />
                    {validationErrors.logoUrl}
                  </p>
                )}
              </div>
            </div>
          </form>
        </ScrollArea>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className={cn(
              'px-3 py-1.5 border border-border rounded-md text-xs font-medium',
              'hover:bg-muted transition-colors disabled:opacity-50'
            )}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className={cn(
              'px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-semibold',
              'hover:bg-primary/90 transition-colors disabled:opacity-50',
              'flex items-center gap-1.5'
            )}
          >
            {isLoading ? (
              <>
                <div className="w-3 h-3 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                {isEditMode ? 'Updating' : 'Creating'}
              </>
            ) : (
              <>
                <Check size={14} />
                {isEditMode ? 'Update' : 'Create'}
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
