'use client';

import { Suspense, use, useMemo, useState, useCallback } from 'react';
import { ChevronLeft, Clock, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import {
  useOrganization,
  useOrganizationMembers,
  usePendingInvitations,
} from '@/lib/features/organization/queries';
import { useCurrentUser } from '@/lib/features/auth/queries';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WidgetSkeleton } from '@/components/ui/widget-skeleton';
import { InviteMemberDialog } from '@/components/modules/organization/components/invite-member-dialog';
import { MembersSection, InvitationsSection, SettingsSidebar } from './components';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

// ============================================================================
// HELPER COMPONENTS (Page-specific display components)
// ============================================================================

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}

function DetailRow({ label, value, icon }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between p-2 group hover:bg-muted/30 rounded-md transition-colors">
      <div className="flex items-center gap-2">
        {icon && <div className="text-muted-foreground">{icon}</div>}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <span className="text-xs font-semibold text-right">
          {value}
        </span>
      </div>
    </div>
  );
}

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
    <div className="group flex items-center justify-between py-3 px-3 border-b border-border last:border-0 hover:bg-secondary transition-colors rounded-md">
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
        <Badge variant="soft" className="text-xs">
          {String(member.role)}
        </Badge>
        {isOwner && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onRemove(String(member.id))}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

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
  const [showInviteModal, setShowInviteModal] = useState(false);

  const { data: organization, isLoading: isLoadingOrg } = useOrganization(organizationId);
  const { data: members = [] } = useOrganizationMembers(organizationId);
  const { data: invitationsData } = usePendingInvitations();
  const { data: currentUser } = useCurrentUser();

  const invitations = useMemo(() => {
    const data = Array.isArray(invitationsData) ? invitationsData : (invitationsData as Record<string, unknown>)?.data ?? [];
    return data.filter((inv: Record<string, unknown>) => inv.organizationId === organizationId);
  }, [invitationsData, organizationId]);

  const isOwner = useMemo(() => organization?.ownerId === currentUser?.id, [organization?.ownerId, currentUser?.id]);

  const { pending, accepted } = useMemo(
    () => ({
      pending: invitations.filter((inv: Record<string, unknown>) => inv.status === 'PENDING'),
      accepted: invitations.filter((inv: Record<string, unknown>) => inv.status === 'ACCEPTED'),
    }),
    [invitations]
  );

  const handleRemoveMember = useCallback((memberId: string) => {
    if (confirm('Remove this member from the organization?')) {
      console.log('Remove member:', memberId);
    }
  }, []);

  const handleSendInvite = useCallback((email: string, role: string) => {
    console.log('Invite member:', { email, role, organizationId });
  }, [organizationId]);

  const handleDeleteOrg = useCallback(() => {
    if (confirm(`Permanently delete "${organization?.name}"? This cannot be undone.`)) {
      console.log('Delete organization:', organizationId);
    }
  }, [organization?.name, organizationId]);

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
            <Badge variant='success' >
             
              Active
            </Badge>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats 
          <QuickStats
            organization={organization}
            memberCount={members.length}
            pendingCount={pending.length}
            ownerCount={ownerCount}
          />*/}

          {/* Members Section */}
          <MembersSection
            members={members}
            isOwner={isOwner}
            onRemove={handleRemoveMember}
            onInvite={() => setShowInviteModal(true)}
            MemberRowComponent={MemberRow}
          />

          {/* Invitations Section */}
          <InvitationsSection
            invitations={invitations}
            pending={pending}
            accepted={accepted}
            InvitationRowComponent={InvitationRow}
          />
        </div>

        {/* Right Column - Settings & Info */}
        <SettingsSidebar
          organization={organization}
          isOwner={isOwner}
          showDeleteConfirm={showDeleteConfirm}
          onShowDeleteConfirm={setShowDeleteConfirm}
          onDelete={handleDeleteOrg}
          DetailRowComponent={(props) => <DetailRow {...props} />}
        />
      </div>

      {/* Invite Member Modal */}
      <InviteMemberDialog isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} onInvite={handleSendInvite} />
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
