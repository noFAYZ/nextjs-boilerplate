'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateOrganization } from '@/lib/features/organization/queries';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CreateOrgFormData {
  name: string;
  slug: string;
  description: string;
  icon: string;
}

interface CreateOrgDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateOrgDialog({ isOpen, onClose }: CreateOrgDialogProps) {
  const router = useRouter();
  const { mutate: createOrg, isPending } = useCreateOrganization();
  const [formData, setFormData] = useState<CreateOrgFormData>({ name: '', slug: '', description: '', icon: '' });
  const [error, setError] = useState('');

  const generateSlug = useCallback((name: string) => {
    return name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
  }, []);

  const handleNameChange = useCallback(
    (value: string) => {
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: prev.slug || generateSlug(value),
      }));
    },
    [generateSlug]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      if (!formData.name.trim()) {
        setError('Organization name is required');
        return;
      }

      if (!formData.slug.trim()) {
        setError('URL slug is required');
        return;
      }

      createOrg(
        { name: formData.name.trim(), slug: formData.slug.trim(), description: formData.description, icon: formData.icon },
        {
          onSuccess: (response) => {
            if (response.success && response.data) {
              setFormData({ name: '', slug: '', description: '', icon: '' });
              onClose();
              router.push(`/dashboard/organizations/${response.data.id}`);
            } else {
              setError(response.error?.message || 'Failed to create organization');
            }
          },
          onError: (err) => {
            const message = (err as Record<string, unknown>)?.message || 'Failed to create organization';
            setError(String(message));
          },
        }
      );
    },
    [formData, createOrg, onClose, router]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Create Organization</h2>
          <p className="text-xs text-muted-foreground mt-1">Set up a new team workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Acme Corp"
              className="w-full px-3 py-2 text-sm rounded-md bg-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={isPending}
              maxLength={100}
            />
          </div>

          <div>
            <label className="text-xs font-medium">URL Slug *</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              placeholder="acme-corp"
              className="w-full px-3 py-2 text-sm rounded-md bg-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={isPending}
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground mt-1">Auto-generated, can be customized</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs font-medium">Icon (Emoji)</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value.slice(0, 2) }))}
                placeholder="🏢"
                className="w-full px-2 py-2 text-sm text-center text-lg rounded-md bg-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled={isPending}
                maxLength={2}
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="What is this for?"
                className="w-full px-3 py-2 text-sm rounded-md bg-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled={isPending}
                maxLength={100}
              />
            </div>
          </div>

          {error && <div className="p-2 bg-destructive/10 rounded text-xs text-destructive">{error}</div>}

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" className="flex-1" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="flex-1" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
