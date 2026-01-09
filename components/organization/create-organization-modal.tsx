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
import { Loader2, AlertCircle, Sparkles, Building2, Upload, X as XIcon, ChevronDown, Search } from 'lucide-react';
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
import { useToast } from "@/lib/hooks/useToast";
import type { Organization, CreateOrganizationInput, UpdateOrganizationInput } from '@/lib/types/organization';

interface CreateOrganizationModalProps {
  organization?: Organization | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (org: Organization) => void;
}

const EMOJI_CATEGORIES = {
  Business: ['🏢', '💼', '🏭', '🏗️', '🏛️', '🏦', '💳', '💰', '💸', '💵', '💴', '💶'],
  Creative: ['🎨', '🖼️', '🎭', '🎪', '🎬', '🎤', '🎧', '📸', '✏️', '🖌️', '🖍️', '✒️'],
  Tech: ['💻', '📱', '⌨️', '🖥️', '🔧', '⚙️', '🔩', '🛠️', '⚡', '🔌', '📡', '🤖'],
  Growth: ['🚀', '📈', '📊', '💹', '🎯', '🎲', '🏆', '🥇', '⭐', '🌟', '✨', '💫'],
  Lifestyle: ['🌍', '🌎', '🌏', '🌐', '🏖️', '🏝️', '🌴', '🌺', '🌸', '🌼', '🌻', '🌷'],
  General: ['📝', '📋', '📂', '📁', '📚', '📖', '📕', '📗', '📘', '📙', '🎁', '🎀'],
};

const ALL_EMOJIS = Object.values(EMOJI_CATEGORIES).flat();

/**
 * Enhanced Icon Selector Component with categories and search
 */
function IconSelector({ value, onChange }: { value: string; onChange: (emoji: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof EMOJI_CATEGORIES>('Business');

  const categoryEmojis = EMOJI_CATEGORIES[selectedCategory];
  const filteredEmojis = searchQuery
    ? ALL_EMOJIS.filter(emoji =>
        Object.entries(EMOJI_CATEGORIES).some(([_, emojis]) =>
          emojis.includes(emoji) && emoji.includes(searchQuery)
        )
      )
    : categoryEmojis;

  return (
    <div className="space-y-2">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Search emoji..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            'w-full pl-8 pr-3 py-1.5 rounded-lg bg-secondary/40 text-xs',
            'placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all duration-100',
            'focus:ring-primary/50'
          )}
        />
      </div>

      {/* Category Tabs */}
      {!searchQuery && (
        <div className="flex gap-0.5 flex-wrap">
          {Object.keys(EMOJI_CATEGORIES).map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category as keyof typeof EMOJI_CATEGORIES)}
              className={cn(
                'px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-100',
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/50 hover:bg-secondary/70 text-foreground'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Emoji Grid */}
      <div className="grid grid-cols-8 gap-0.5 p-1.5 bg-secondary/40 rounded-lg max-h-[180px] overflow-y-auto">
        {filteredEmojis.length > 0 ? (
          filteredEmojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                onChange(emoji);
                setSearchQuery('');
              }}
              className={cn(
                'p-1.5 text-lg rounded-md transition-all duration-100 hover:scale-110 hover:bg-secondary/60',
                value === emoji
                  ? 'bg-primary/20 scale-110'
                  : ''
              )}
              title={emoji}
            >
              {emoji}
            </button>
          ))
        ) : (
          <div className="col-span-8 text-center py-6 text-xs text-muted-foreground">
            No emoji found
          </div>
        )}
      </div>

      {/* Custom Emoji Input */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">
          Custom emoji
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.substring(0, 2))}
          placeholder="😊"
          maxLength={2}
          className={cn(
            'w-full p-1.5 rounded-lg bg-secondary/40 text-lg text-center text-sm',
            'placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all duration-100',
            'focus:ring-primary/50'
          )}
        />
      </div>
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
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: EMOJI_CATEGORIES.Business[0],
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
        icon: organization.icon || EMOJI_CATEGORIES.Business[0],
        logoFile: null,
        logoPreview: organization.logoUrl || '',
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        icon: EMOJI_CATEGORIES.Business[0],
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
      setError((err as { error?: { message?: string } })?.error?.message || 'Failed to save workspace');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm max-h-[90vh] overflow-hidden flex flex-col p-0">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 bg-secondary/40">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-base font-semibold">{isEditMode ? 'Edit Workspace' : 'Create Workspace'}</DialogTitle>
            <DialogDescription className="text-xs">
              {isEditMode ? 'Update your workspace details' : 'Set up your new workspace'}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Form Content */}
        <form id="org-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {/* Error Alert */}
          {error && (
            <div className="p-2.5 bg-destructive/10 rounded-lg flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-150">
              <AlertCircle size={14} className="text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          {/* Live Preview Card */}
          <div className="p-3 rounded-lg bg-secondary/50 space-y-2">
            <div className="flex items-center gap-3">
              {/* Icon/Logo Preview */}
              <div className="flex-shrink-0">
                {formData.logoPreview ? (
                  <img
                    src={formData.logoPreview}
                    alt="Logo"
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-primary/15 flex items-center justify-center text-2xl font-semibold">
                    {formData.icon}
                  </div>
                )}
              </div>

              {/* Preview Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {formData.name || 'Workspace'}
                </p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {!isEditMode ? `ws.com/${formData.slug || 'workspace'}` : 'Workspace'}
                </p>
              </div>
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-1">
            <label htmlFor="name" className="text-xs font-semibold text-foreground">Workspace Name</label>
            <Input
              id="name"
              name="name"
              required
              placeholder="Acme Corporation"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              maxLength={100}
              className="h-9 text-sm transition-colors duration-100"
            />
            {validationErrors.name && (
              <p className="text-xs text-destructive">{validationErrors.name}</p>
            )}
          </div>

          {/* Icon Selector - Enhanced */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Choose Icon
            </label>
            <IconSelector value={formData.icon} onChange={handleIconChange} />
          </div>

          {/* Collapsible Additional Details */}
          <button
            type="button"
            onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
            className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-secondary/60 active:bg-secondary transition-colors duration-100 group"
          >
            <span className="text-xs font-semibold text-foreground">Additional Details</span>
            <ChevronDown
              className={cn(
                'h-4 w-4 text-muted-foreground transition-transform duration-100 group-hover:text-foreground',
                isDetailsExpanded && 'rotate-180'
              )}
            />
          </button>

          {/* Collapsible Content */}
          {isDetailsExpanded && (
            <div className="space-y-3 px-2.5 py-2.5 rounded-lg bg-secondary/40 animate-in fade-in slide-in-from-top-2 duration-100">
              {/* Description */}
              <div className="space-y-1">
                <label htmlFor="description" className="text-xs font-semibold text-foreground">Description</label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your workspace..."
                  value={formData.description}
                  onChange={handleChange}
                  disabled={isLoading}
                  rows={2}
                  maxLength={500}
                  className="text-xs resize-none"
                />
                {validationErrors.description && (
                  <p className="text-xs text-destructive">{validationErrors.description}</p>
                )}
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">Optional</p>
                  <p className="text-xs text-muted-foreground">{formData.description.length}/500</p>
                </div>
              </div>

              {/* Logo Upload */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Logo Image</label>
                {formData.logoPreview ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors duration-100">
                      <img
                        src={formData.logoPreview}
                        alt="Logo"
                        className="h-10 w-10 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{formData.logoFile?.name || 'Logo'}</p>
                        <p className="text-xs text-muted-foreground">
                          {formData.logoFile ? ((formData.logoFile.size / 1024).toFixed(2) + ' KB') : 'Uploaded'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removeLogo}
                        disabled={isLoading}
                        className="p-1.5 hover:bg-secondary rounded transition-colors duration-100 flex-shrink-0"
                      >
                        <XIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                      className="w-full px-2 py-1.5 rounded-lg text-xs font-medium hover:bg-secondary/60 active:bg-secondary transition-colors duration-100 disabled:opacity-50"
                    >
                      Change Logo
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="w-full flex flex-col items-center justify-center gap-2 p-4 rounded-lg hover:bg-secondary/60 active:bg-secondary transition-all duration-100 group disabled:opacity-50 bg-secondary/40"
                  >
                    <Upload className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-100" />
                    <div className="text-center">
                      <p className="text-xs font-medium">Upload Logo</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">PNG, JPG, GIF (Max 5MB)</p>
                    </div>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={isLoading}
                  className="hidden"
                />
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-4 py-3 bg-secondary/30 flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            size="sm"
            className="flex-1 h-9 text-sm"
          >
            Cancel
          </Button>
          <Button type="submit" form="org-form" disabled={isLoading} size="sm" className="flex-1 h-9 text-sm gap-2">
            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {isEditMode ? 'Update' : 'Create'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
