'use client';

import { Suspense, use, useMemo, useState, useCallback } from 'react';
import { ChevronLeft, Users, Clock, CheckCircle2, AlertCircle, Trash2, Edit2, Copy, Check, Plus } from 'lucide-react';
import {
  useOrganization,
  useOrganizationMembers,
  usePendingInvitations,
} from '@/lib/queries/use-organization-data';
import { useCurrentUser } from '@/lib/queries/use-auth-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WidgetSkeleton } from '@/components/ui/widget-skeleton';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  copyable?: boolean;
  onCopy?: () => void;
  copied?: boolean;
  mono?: boolean;
}

function DetailRow({ label, value, icon, copyable, onCopy, copied, mono }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between py-3 px-2 group hover:bg-muted/30 rounded-md transition-colors">
      <div className="flex items-center gap-2">
        {icon && <div className="text-muted-foreground">{icon}</div>}
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <span className={cn('text-sm font-medium text-right', mono ? 'font-mono text-xs' : '')}>
          {value}
        </span>
        {copyable && onCopy && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onCopy}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-600" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

// Member Row Component
function MemberRow({
  member,
  isOwner,
  onRemove,
}: {
  member: Record<string, unknown>;
  isOwner: boolean;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="group flex items-center justify-between py-3 px-3 border-b border-border/50 last:border-0 hover:bg-muted/40 transition-colors rounded-md">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
          {String(member.name)[0]?.toUpperCase() || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{String(member.name)}</p>
          <p className="text-xs text-muted-foreground truncate">{String(member.email)}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
        <Badge variant="outline" className="text-xs">
          {String(member.role)}
        </Badge>
        {isOwner && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onRemove(String(member.id))}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Invitation Row Component
function InvitationRow({ invitation }: { invitation: Record<string, unknown> }) {
  const status = String(invitation.status);
  const expiresAt = new Date(String(invitation.expiresAt));

  const statusConfig = {
    PENDING: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' },
    ACCEPTED: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/30' },
    EXPIRED: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/30' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
  const StatusIcon = config.icon;

  return (
    <div className={cn('group flex items-center justify-between py-3 px-3 rounded-lg transition-colors', config.bg)}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <StatusIcon className={cn('h-4 w-4 flex-shrink-0', config.color)} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{String(invitation.email)}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Expires {expiresAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
        <Badge variant="outline" className="text-xs">
          {String(invitation.role)}
        </Badge>
        <Badge className="text-xs font-medium" variant="secondary">
          {status}
        </Badge>
      </div>
    </div>
  );
}

// ============================================================================
// CONTENT COMPONENT
// ============================================================================

function OrganizationContent({ organizationId }: { organizationId: string }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const { data: organization, isLoading: isLoadingOrg } = useOrganization(organizationId);
  const { data: members = [] } = useOrganizationMembers(organizationId);
  const { data: invitationsData } = usePendingInvitations();
  const { data: currentUser } = useCurrentUser();

  const invitations = useMemo(() => {
    const data = Array.isArray(invitationsData) ? invitationsData : (invitationsData as Record<string, unknown>)?.data ?? [];
    return data.filter((inv: Record<string, unknown>) => inv.organizationId === organizationId);
  }, [invitationsData, organizationId]);

  const isOwner = useMemo(() => organization?.ownerId === currentUser?.id, [organization?.ownerId, currentUser?.id]);

  const { pending, accepted, ownerCount } = useMemo(
    () => ({
      pending: invitations.filter((inv: Record<string, unknown>) => inv.status === 'PENDING'),
      accepted: invitations.filter((inv: Record<string, unknown>) => inv.status === 'ACCEPTED'),
      ownerCount: members.filter((m: Record<string, unknown>) => m.role === 'OWNER').length,
    }),
    [invitations, members]
  );

  const handleRemoveMember = useCallback((memberId: string) => {
    if (confirm('Remove this member from the organization?')) {
      console.log('Remove member:', memberId);
    }
  }, []);

  const handleDeleteOrg = useCallback(() => {
    if (confirm(`Permanently delete "${organization?.name}"? This cannot be undone.`)) {
      console.log('Delete organization:', organizationId);
    }
  }, [organization?.name, organizationId]);

  const copyToClipboard = useCallback((text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  }, []);

  if (isLoadingOrg) {
    return <WidgetSkeleton variant="chart" />;
  }

  if (!organization) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold">Organization not found</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-6">The organization you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/dashboard/organizations">
          <Button size="sm">Back to Organizations</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-6 max-w-5xl">
      {/* Breadcrumb & Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-3">
          <Link href="/dashboard/organizations">
            <Button variant="ghost" size="sm" className="gap-1.5 h-8 -ml-2 text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
              Organizations
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-2xl font-bold">
              {organization.icon || '🏢'}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{organization.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">{organization.description}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {organization.isActive && (
            <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2" />
              Active
            </Badge>
          )}
          {isOwner && (
            <Button variant="outline" size="sm" disabled className="gap-1.5">
              <Edit2 className="h-3.5 w-3.5" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid gap-3 grid-cols-3">
            <Card className="p-3 bg-card hover:shadow-sm transition-shadow">
              <div className="text-xs text-muted-foreground font-medium mb-1">Members</div>
              <div className="text-2xl font-bold">{members.length}</div>
              <p className="text-xs text-muted-foreground mt-1">{ownerCount} owner{ownerCount !== 1 ? 's' : ''}</p>
            </Card>
            <Card className="p-3 bg-card hover:shadow-sm transition-shadow">
              <div className="text-xs text-muted-foreground font-medium mb-1">Pending</div>
              <div className="text-2xl font-bold">{pending.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting response</p>
            </Card>
            <Card className="p-3 bg-card hover:shadow-sm transition-shadow">
              <div className="text-xs text-muted-foreground font-medium mb-1">Created</div>
              <div className="text-sm font-bold">{new Date(organization.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
              <p className="text-xs text-muted-foreground mt-1">{new Date(organization.createdAt).getFullYear()}</p>
            </Card>
          </div>

          {/* Members Section */}
          <Card className="p-6 bg-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">Members</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {members.length} member{members.length !== 1 ? 's' : ''} in this organization
                </p>
              </div>
              <Button size="sm" disabled variant="outline" className="gap-1.5">
                <Plus className="h-4 w-4" />
                Add Member
              </Button>
            </div>

            {members.length > 0 ? (
              <div className="divide-y divide-border/50">
                {members.map((member: Record<string, unknown>) => (
                  <MemberRow key={String(member.id)} member={member} isOwner={isOwner} onRemove={handleRemoveMember} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">No members yet</p>
                <p className="text-xs text-muted-foreground mt-1">Invite team members to collaborate</p>
              </div>
            )}
          </Card>

          {/* Invitations Section */}
          {invitations.length > 0 && (
            <Card className="p-6 bg-card">
              <div className="mb-6">
                <h2 className="text-lg font-semibold">Invitations</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {pending.length} pending, {accepted.length} accepted
                </p>
              </div>

              <div className="space-y-3">
                {invitations.map((inv: Record<string, unknown>) => (
                  <InvitationRow key={String(inv.id)} invitation={inv} />
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right Column - Settings & Info */}
        <div className="space-y-6">
          {/* Organization Settings */}
          <Card className="p-6 bg-card">
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide text-muted-foreground">Settings</h3>

            <div className="space-y-4 divide-y divide-border/50">
              <DetailRow
                label="Organization Type"
                value={organization.isPersonal ? 'Personal' : 'Team'}
              />
              <DetailRow
                label="URL Slug"
                value={<code className="text-xs bg-muted/50 px-1.5 py-0.5 rounded">{organization.slug}</code>}
                copyable
                onCopy={() => copyToClipboard(organization.slug, 'Slug')}
                copied={copiedField === 'Slug'}
              />
              <DetailRow
                label="Created"
                value={new Date(organization.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              />
            </div>
          </Card>

          {/* Danger Zone */}
          {isOwner && !organization.isPersonal && (
            <Card className="p-6 bg-red-50/50 dark:bg-red-950/20">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <h3 className="text-sm font-semibold text-red-600">Danger Zone</h3>
              </div>

              {showDeleteConfirm ? (
                <div className="space-y-3">
                  <p className="text-sm text-foreground font-medium">Delete this organization?</p>
                  <p className="text-xs text-muted-foreground">This action cannot be undone. All members and data will be permanently removed.</p>
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleDeleteOrg}
                    >
                      Delete Organization
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="destructive"
                  className="w-full"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete Organization
                </Button>
              )}
            </Card>
          )}

          {/* Technical Details */}
          <Card className="p-6 bg-card">
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide text-muted-foreground">Technical</h3>

            <div className="space-y-3 divide-y divide-border/50 text-xs">
              <DetailRow
                label="Organization ID"
                value={<code className="bg-muted/50 px-1 py-0.5 rounded text-[10px]">{organization.id}</code>}
                copyable
                onCopy={() => copyToClipboard(organization.id, 'Organization ID')}
                copied={copiedField === 'Organization ID'}
                mono
              />
              <DetailRow
                label="Owner ID"
                value={<code className="bg-muted/50 px-1 py-0.5 rounded text-[10px]">{organization.ownerId}</code>}
                mono
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default function OrganizationPage({ params }: PageProps) {
  const { id } = use(params);

  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<WidgetSkeleton variant="chart" />}>
        <OrganizationContent organizationId={id} />
      </Suspense>
    </div>
  );
}
