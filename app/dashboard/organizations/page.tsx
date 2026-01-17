'use client';

import { Suspense, useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import { useOrganizations } from '@/lib/queries/use-organization-data';
import { Button } from '@/components/ui/button';
import { WidgetSkeleton } from '@/components/ui/widget-skeleton';
import { CreateOrgDialog } from '@/components/organization/create-org-dialog';
import { OrgCard } from '@/components/organization/org-card';
import { Input } from '@/components/ui/input';

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
          <h1 className="text-xl font-bold tracking-tight">Organizations</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Manage workspaces and team collaboration</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} size="sm" className="gap-1">
          <Plus className="h-3.5 w-3.5" />
          New
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
        <Input
          type="text"
          placeholder="Search organizations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm pl-9 pr-3 py-2 text-sm rounded-sm"
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
                Other Organizations ({teamOrgs.length})
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
    <div className="container mx-auto max-w-3xl py-6">
      <Suspense fallback={<WidgetSkeleton variant="list" itemsCount={2} />}>
        <OrganizationsContent />
      </Suspense>
    </div>
  );
}
