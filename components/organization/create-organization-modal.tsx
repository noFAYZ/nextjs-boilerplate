'use client';

/**
 * Create/Edit Organization Modal
 *
 * Modern dialog-based modal for creating/editing organizations
 * - Built on Radix Dialog component for accessibility
 * - Organized form sections with icon/logo management
 * - Real-time form validation with character counts
 * - File upload support for logo
 * - Loading states and error handling
 */

import { useState, useEffect, useRef } from 'react';
import { Loader2, AlertCircle, Sparkles, Building2, Upload, X as XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useCreateOrganization, useUpdateOrganization } from '@/lib/queries/use-organization-data';
import { useOrganizationUIStore } from '@/lib/stores/ui-stores';
import { useToast } from '@/lib/hooks/use-toast';
import type { Organization, CreateOrganizationInput, UpdateOrganizationInput } from '@/lib/types/organization';

interface CreateOrganizationModalProps {
  organization?: Organization | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (org: Organization) => void;
}

const EMOJI_SUGGESTIONS = ['🏢', '💼', '🚀', '💡', '🎯', '📊', '💰', '🏦', '🎨', '⚙️', '🔧', '📱', '🌟', '💎', '🎭', '🎪'];

/**
 * Emoji Icon Selector Component
 * Similar to budget icon selector for consistency
 */
function IconSelector({ value, onChange }: { value: string; onChange: (emoji: string) => void }) {
  const [showAll, setShowAll] = useState(false);

  const displayEmojis = showAll ? EMOJI_SUGGESTIONS : EMOJI_SUGGESTIONS.slice(0, 6);

  return (
    <div className="space-y-2">
      {/* Emoji Grid */}
      <div className="grid grid-cols-6 gap-2">
        {displayEmojis.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onChange(emoji)}
            className={cn(
              'p-2 text-2xl rounded-lg border-2 transition-all',
              value === emoji
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-muted-foreground'
            )}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Show More Button */}
      {!showAll && EMOJI_SUGGESTIONS.length > 6 && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="text-xs text-primary hover:text-primary/80 font-medium"
        >
          + {EMOJI_SUGGESTIONS.length - 6} more
        </button>
      )}

      {/* Custom Emoji Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.substring(0, 2))}
        placeholder="Or paste emoji"
        maxLength={2}
        className={cn(
          'w-full p-2 border rounded-lg bg-background text-xs text-center',
          'placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all',
          'focus:ring-primary/50 focus:border-primary'
        )}
      />
    </div>
  );
}

export function CreateOrganizationModal({
  organization,
  isOpen,
  onClose,
  onSuccess,
}: CreateOrganizationModalProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: EMOJI_SUGGESTIONS[0],
    logoFile: null as File | null,
    logoPreview: '',
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
        logoFile: null,
        logoPreview: organization.logoUrl || '',
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        icon: EMOJI_SUGGESTIONS[0],
        logoFile: null,
        logoPreview: '',
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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file',
          variant: 'destructive',
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select an image smaller than 5MB',
          variant: 'destructive',
        });
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          logoFile: file,
          logoPreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setFormData((prev) => ({
      ...prev,
      logoFile: null,
      logoPreview: '',
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {isEditMode ? 'Edit Workspace' : 'Create Workspace'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update your workspace details'
              : 'Set up a new workspace'}
          </DialogDescription>
        </DialogHeader>

        {/* Form Content */}
        <ScrollArea className="h-[calc(90vh-16rem)] pr-4">
          <form id="org-form" onSubmit={handleSubmit} className="space-y-5 pb-2">
            {/* Error Alert */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
                <AlertCircle size={16} className="text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-xs text-destructive">{error}</p>
              </div>
            )}

            {/* Workspace Preview Card */}
            <div className="p-4 border border-border rounded-lg bg-gradient-to-br from-muted/50 to-muted/25">
              <p className="text-xs font-medium text-muted-foreground mb-3">Preview</p>
              <div className="flex items-center gap-4">
                {/* Icon/Logo Preview */}
                <div className="flex-shrink-0">
                  {formData.logoPreview ? (
                    <img
                      src={formData.logoPreview}
                      alt="Logo preview"
                      className="h-16 w-16 rounded-lg object-cover border border-border shadow-sm"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-3xl">
                      {formData.icon}
                    </div>
                  )}
                </div>

                {/* Preview Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {formData.name || 'Workspace Name'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {!isEditMode ? `ws.com/${formData.slug || 'my-workspace'}` : 'Workspace'}
                  </p>
                  {formData.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {formData.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Basic Information Section */}
            <div className="space-y-4 pt-2">
              <div>
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  Basic Information
                </h3>

                <div className="space-y-3.5">
                  {/* Name */}
                  <div>
                    <Input
                      label="Workspace Name"
                      id="name"
                      name="name"
                      required
                      placeholder="Acme Corporation"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isLoading}
                      maxLength={100}
                    />
                    {validationErrors.name && (
                      <p className="text-xs text-destructive mt-1">{validationErrors.name}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.name.length}/100 characters
                    </p>
                  </div>

                  {/* Slug - Only show on create */}
                  {!isEditMode && (
                    <div>
                      <label htmlFor="slug" className="text-sm font-medium mb-1.5 block">
                        Workspace URL <span className="text-destructive">*</span>
                      </label>
                      <div className="flex items-center gap-2 px-3 py-2.5 border border-input rounded-lg bg-background focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all">
                        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                          ws.com/
                        </span>
                        <input
                          id="slug"
                          name="slug"
                          type="text"
                          value={formData.slug}
                          onChange={handleChange}
                          placeholder="my-workspace"
                          className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground font-medium"
                          disabled={isLoading}
                          maxLength={50}
                        />
                      </div>
                      {validationErrors.slug && (
                        <p className="text-xs text-destructive mt-1">{validationErrors.slug}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formData.slug.length}/50 characters
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator className="my-3" />

            {/* Branding Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Branding
                </h3>

                <div className="space-y-4">
                  {/* Icon Selector */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Icon</label>
                    <IconSelector value={formData.icon} onChange={handleIconChange} />
                  </div>

                  {/* Logo Upload */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Logo Image <span className="text-muted-foreground text-xs font-normal">(Optional)</span>
                    </label>

                    {formData.logoPreview ? (
                      <div className="space-y-2.5">
                        {/* Logo Preview */}
                        <div className="flex items-center gap-3 p-3 border border-border rounded-lg bg-muted/30">
                          <img
                            src={formData.logoPreview}
                            alt="Logo preview"
                            className="h-14 w-14 rounded-lg object-cover border border-border/50"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">
                              {formData.logoFile?.name || 'Current logo'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formData.logoFile
                                ? (formData.logoFile.size / 1024).toFixed(2) + ' KB'
                                : 'Uploaded'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={removeLogo}
                            disabled={isLoading}
                            className="p-2 hover:bg-muted rounded-md transition-colors flex-shrink-0"
                            title="Remove logo"
                          >
                            <XIcon className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </div>

                        {/* Change Logo Button */}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isLoading}
                          className="w-full px-3 py-2.5 border border-input rounded-lg text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
                        >
                          Change Logo
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                        className="w-full flex flex-col items-center justify-center gap-2.5 p-7 border-2 border-dashed border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all disabled:opacity-50 group"
                      >
                        <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        <div className="text-center">
                          <p className="text-sm font-medium">Upload Logo</p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG or GIF (Max 5MB)
                          </p>
                        </div>
                      </button>
                    )}

                    {/* Hidden File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={isLoading}
                      className="hidden"
                    />
                    {validationErrors.logoUrl && (
                      <p className="text-xs text-destructive mt-1">{validationErrors.logoUrl}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-3" />

            {/* Additional Details Section */}
            <div className="space-y-4 pb-2">
              <div>
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  Additional Details
                </h3>

                <div>
                  <Textarea
                    label="Description"
                    id="description"
                    name="description"
                    placeholder="Describe your workspace purpose and goals..."
                    value={formData.description}
                    onChange={handleChange}
                    disabled={isLoading}
                    rows={3}
                    maxLength={500}
                  />
                  {validationErrors.description && (
                    <p className="text-xs text-destructive mt-1">{validationErrors.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.description.length}/500 characters
                  </p>
                </div>
              </div>
            </div>
          </form>
        </ScrollArea>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" form="org-form" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? 'Update' : 'Create'} Workspace
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
