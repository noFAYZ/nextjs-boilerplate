'use client';

/**
 * Organization Admin Dashboard
 *
 * Comprehensive organization management dashboard with:
 * - Organization overview and stats
 * - Quick actions (edit, invite, settings)
 * - Member count and roles breakdown
 * - Pending invitations summary
 * - Active/inactive status
 * - Quick links to settings
 */

import React from 'react';
import {
  Settings,
  Users,
  Mail,
  Edit3,
  Trash2,
  Copy,
  Shield,
} from 'lucide-react';
import {
  useOrganization,
  useOrganizationMembers,
} from '@/lib/features/organization/queries';
import { useCurrentUser } from '@/lib/features/auth/queries';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WidgetSkeleton } from '@/components/ui/widget-skeleton';
import { cn } from '@/lib/utils';
import type { Organization, Invitation } from '@/lib/types/organization';

interface OrgAdminDashboardProps {
  organizationId: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onManageMembers?: () => void;
  pendingInvitations?: Invitation[];
}

// ============================================================================
// STATS CARD
// ============================================================================

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  description?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

function StatsCard({
  icon,
  label,
  value,
  description,
  variant = 'default',
}: StatsCardProps) {
  const variantClasses = {
    default: 'bg-muted/50 text-foreground',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-100 text-green-900 dark:bg-green-600/20 dark:text-green-300',
    warning:
      'bg-yellow-100 text-yellow-900 dark:bg-yellow-600/20 dark:text-yellow-300',
    danger: 'bg-red-100 text-red-900 dark:bg-red-600/20 dark:text-red-300',
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className={cn('p-3 rounded-lg', variantClasses[variant])}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

// ============================================================================
// ROLE BREAKDOWN
// ============================================================================

interface RoleBreakdownProps {
  members: Array<{ role: 'OWNER' | 'EDITOR' | 'VIEWER' }>;
}

function RoleBreakdown({
  members,
}: RoleBreakdownProps) {
  const roles = {
    OWNER: members.filter((m) => m.role === 'OWNER').length,
    EDITOR: members.filter((m) => m.role === 'EDITOR').length,
    VIEWER: members.filter((m) => m.role === 'VIEWER').length,
  };

  const total = members.length;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'bg-orange-500';
      case 'EDITOR':
        return 'bg-blue-500';
      case 'VIEWER':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Member Roles</h3>
      <div className="space-y-3">
        {Object.entries(roles).map(([role, count]) => (
          <div key={role}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">{role}</span>
              <span className="text-sm text-muted-foreground">
                {count} of {total}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn('h-full', getRoleColor(role))}
                style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ============================================================================
// ORG INFO SECTION
// ============================================================================

interface OrgInfoProps {
  organization: Organization;
  isOwner: boolean;
  onEdit?: () => void;
}

function OrgInfo({ organization, isOwner, onEdit }: OrgInfoProps) {
  const handleCopySlug = () => {
    navigator.clipboard.writeText(organization.slug);
  };

  return (
    <Card className="p-6">
      <div className="flex items-start gap-6">
        {/* Organization Icon/Avatar */}
        <div
          className={cn(
            'h-20 w-20 rounded-lg flex items-center justify-center text-3xl font-bold flex-shrink-0',
            'bg-gradient-to-br from-primary/20 to-primary/5'
          )}
        >
          {organization.icon ? (
            <span>{organization.icon}</span>
          ) : (
            <span>{organization.name[0]?.toUpperCase()}</span>
          )}
        </div>

        {/* Organization Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl font-bold">{organization.name}</h2>
            {organization.isPersonal && (
              <Badge variant="secondary" className="text-xs">
                Personal Workspace
              </Badge>
            )}
            {!organization.isActive && (
              <Badge variant="destructive" className="text-xs">
                Inactive
              </Badge>
            )}
          </div>

          {organization.description && (
            <p className="text-sm text-muted-foreground mt-2">
              {organization.description}
            </p>
          )}

          {/* Slug Info */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Slug:</span>
            <code className="text-xs px-2 py-1 bg-muted rounded font-mono">
              {organization.slug}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopySlug}
              className="h-auto p-1"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>

          {/* Dates */}
          <div className="mt-3 grid grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div>
              Created:{' '}
              <span className="font-medium">
                {new Date(organization.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div>
              Updated:{' '}
              <span className="font-medium">
                {new Date(organization.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isOwner && !organization.isPersonal && (
          <div className="flex flex-col gap-2">
            <Button size="sm" variant="outline" onClick={onEdit}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

// ============================================================================
// QUICK ACTIONS
// ============================================================================

interface QuickActionsProps {
  isOwner: boolean;
  onManageMembers?: () => void;
  onSettings?: () => void;
}

function QuickActions({
  isOwner,
  onManageMembers,
  onSettings,
}: QuickActionsProps) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={onManageMembers}
          className="justify-start"
        >
          <Users className="h-4 w-4 mr-2" />
          Manage Members
        </Button>

        {isOwner && (
          <>
            <Button
              variant="outline"
              onClick={onSettings}
              className="justify-start"
            >
              <Settings className="h-4 w-4 mr-2" />
              Organization Settings
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}

// ============================================================================
// DANGER ZONE
// ============================================================================

interface DangerZoneProps {
  isOwner: boolean;
  isPersonal: boolean;
  onDelete?: () => void;
}

function DangerZone({ isOwner, isPersonal, onDelete }: DangerZoneProps) {
  if (!isOwner || isPersonal) return null;

  return (
    <Card className="p-6 border-destructive/30 bg-destructive/5">
      <h3 className="font-semibold text-destructive mb-3 flex items-center gap-2">
        <Shield className="h-5 w-5" />
        Danger Zone
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Deleting an organization is permanent and cannot be undone. All associated
        data will be deleted.
      </p>
      <Button
        variant="destructive"
        onClick={onDelete}
        className="gap-2"
      >
        <Trash2 className="h-4 w-4" />
        Delete Organization
      </Button>
    </Card>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function OrganizationAdminDashboard({
  organizationId,
  onEdit,
  onDelete,
  onManageMembers,
  pendingInvitations = [],
}: OrgAdminDashboardProps) {
  const { data: organization, isLoading: isLoadingOrg } =
    useOrganization(organizationId);
  const { data: members = [], isLoading: isLoadingMembers } =
    useOrganizationMembers(organizationId);
  const { data: currentUser } = useCurrentUser();

  const isOwner = organization?.ownerId === currentUser?.id;
  const pendingCount = pendingInvitations?.filter((inv) => inv.status === 'PENDING').length ?? 0;

  if (isLoadingOrg || isLoadingMembers) {
    return (
      <div className="space-y-6">
        <WidgetSkeleton variant="metric" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <WidgetSkeleton variant="metric" />
          <WidgetSkeleton variant="metric" />
          <WidgetSkeleton variant="metric" />
          <WidgetSkeleton variant="metric" />
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <Card className="p-8 text-center">
        <p className="text-destructive">Organization not found</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Organization Info */}
      <OrgInfo organization={organization} isOwner={isOwner} onEdit={onEdit} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={<Users className="h-5 w-5" />}
          label="Total Members"
          value={members.length}
          variant="primary"
        />
        <StatsCard
          icon={<Shield className="h-5 w-5" />}
          label="Owners"
          value={members.filter((m) => m.role === 'OWNER').length}
          variant="warning"
        />
        <StatsCard
          icon={<Mail className="h-5 w-5" />}
          label="Pending Invitations"
          value={pendingCount}
          variant={pendingCount > 0 ? 'warning' : 'default'}
        />
        <StatsCard
          icon={<Settings className="h-5 w-5" />}
          label="Status"
          value={organization.isActive ? 'Active' : 'Inactive'}
          variant={organization.isActive ? 'success' : 'danger'}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <QuickActions
            isOwner={isOwner}
            onManageMembers={onManageMembers}
            onSettings={onDelete}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <RoleBreakdown members={members} />
        </div>
      </div>

      {/* Danger Zone */}
      <DangerZone
        isOwner={isOwner}
        isPersonal={organization.isPersonal}
        onDelete={onDelete}
      />
    </div>
  );
}
