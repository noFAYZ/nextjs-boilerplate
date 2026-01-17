'use client';

import { Suspense, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Users, Calendar } from 'lucide-react';
import { useOrganizations, useCreateOrganization } from '@/lib/queries/use-organization-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WidgetSkeleton } from '@/components/ui/widget-skeleton';
import Link from 'next/link';
import type { Organization } from '@/lib/types/organization';

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

// ============================================================================
// CREATE ORG DIALOG
// ============================================================================

function CreateOrgDialog({ isOpen, onClose }: CreateOrgDialogProps) {
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

// ============================================================================
// ORG CARD (COMPACT)
// ============================================================================

interface OrgCardProps {
  org: Organization;
}

function OrgCard({ org }: OrgCardProps) {
  return (
    <Link href={`/dashboard/organizations/${org.id}`}>
      <Card className="p-2 hover:shadow-sm transition-all cursor-pointer group h-full">
        <div className="flex flex-col gap-2">
          {/* Header Row */}
          <div className="flex items-start gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-bold group-hover:shadow-sm transition-all">
              {org.icon || org.name[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate leading-tight">{org.name}</h3>
              <p className="text-xs text-muted-foreground truncate">{org.slug}</p>
            </div>
          </div>

          {/* Description */}
          {org.description && (
            <p className="text-xs text-muted-foreground truncate px-0.5">{org.description}</p>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-1 pt-1">
            <div className="bg-muted/30 rounded px-2 py-1">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-semibold">{org.memberCount || 1}</span>
              </div>
            </div>
            <div className="bg-muted/30 rounded px-2 py-1">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{new Date(org.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex gap-1">
              {org.isPersonal && (
                <Badge variant="secondary" className="text-xs h-5">
                  Personal
                </Badge>
              )}
              {org.isActive && (
                <Badge className="text-xs h-5 bg-green-500/10 text-green-700">
                  <div className="h-1 w-1 rounded-full bg-green-500 mr-1" />
                  Active
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

// ============================================================================
// CONTENT COMPONENT
// ============================================================================

function OrganizationsContent() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: organizations = [], isLoading } = useOrganizations();

  const { personalOrg, teamOrgs } = useMemo(() => {
    const personal = organizations.find((org) => org.isPersonal);
    const team = organizations.filter((org) => !org.isPersonal);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return {
        personalOrg: personal?.name.toLowerCase().includes(query) || personal?.slug.toLowerCase().includes(query) ? personal : undefined,
        teamOrgs: team.filter((org) => org.name.toLowerCase().includes(query) || org.slug.toLowerCase().includes(query)),
      };
    }

    return { personalOrg: personal, teamOrgs: team };
  }, [organizations, searchQuery]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <WidgetSkeleton variant="list" itemsCount={2} />
      </div>
    );
  }

  const hasResults = !!(personalOrg || teamOrgs.length > 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Organizations</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage workspaces and team collaboration</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} size="sm" className="gap-1.5 h-8">
          <Plus className="h-3.5 w-3.5" />
          New
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search organizations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-md bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {hasResults ? (
        <>
          {/* Personal Workspace */}
          {personalOrg && (
            <div className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-1">Your Workspace</h2>
              <OrgCard org={personalOrg} />
            </div>
          )}

          {/* Team Organizations */}
          {teamOrgs.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-1">
                Team Organizations ({teamOrgs.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {teamOrgs.map((org) => (
                  <OrgCard key={org.id} org={org} />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-3xl mb-3">🏢</div>
          <p className="font-semibold text-sm">No organizations found</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            {searchQuery ? 'Try a different search term' : 'Create your first team organization'}
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsCreateOpen(true)} size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Create Organization
            </Button>
          )}
        </div>
      )}

      {/* Create Dialog */}
      <CreateOrgDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default function OrganizationsPage() {
  return (
    <div className="container mx-auto max-w-5xl py-6">
      <Suspense fallback={<WidgetSkeleton variant="list" itemsCount={2} />}>
        <OrganizationsContent />
      </Suspense>
    </div>
  );
}
