'use client';

/**
 * Enhanced Organization Settings Page
 *
 * Comprehensive organization settings with:
 * - Edit organization details (name, description, icon, logo)
 * - Manage members and roles
 * - View and manage invitations
 * - Organization admin dashboard
 * - Delete organization (owner only)
 */

import React, { useState } from 'react';
import {
  Users,
  Mail,
  Settings as SettingsIcon,
  BarChart3,
} from 'lucide-react';
import {
  useOrganization,
  useOrganizationMembers,
} from '@/lib/features/organization/queries';
import { useCurrentUser } from '@/lib/features/auth/queries';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WidgetSkeleton } from '@/components/ui/widget-skeleton';
import type { Invitation } from '@/lib/types/organization';

interface EnhancedSettingsProps {
  organizationId: string;
  onEdit?: () => void;
  onDelete?: () => void;
  pendingInvitations?: Invitation[];
}

// ============================================================================
// NAVIGATION TABS
// ============================================================================

interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  requiredRole?: 'OWNER' | 'EDITOR' | 'VIEWER';
}

const TABS: TabConfig[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <BarChart3 className="h-4 w-4" />,
    description: 'Organization dashboard and stats',
  },
  {
    id: 'members',
    label: 'Members',
    icon: <Users className="h-4 w-4" />,
    description: 'Manage team members and roles',
  },
  {
    id: 'invitations',
    label: 'Invitations',
    icon: <Mail className="h-4 w-4" />,
    description: 'View and manage pending invitations',
    requiredRole: 'OWNER',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <SettingsIcon className="h-4 w-4" />,
    description: 'Organization details and preferences',
    requiredRole: 'OWNER',
  },
];

// ============================================================================
// TAB CONTENT COMPONENTS
// ============================================================================

function OverviewTabContent({ organizationId }: { organizationId: string }) {
  const { data: organization, isLoading: isLoadingOrg } =
    useOrganization(organizationId);
  const { data: members = [], isLoading: isLoadingMembers } =
    useOrganizationMembers(organizationId);

  const isLoading = isLoadingOrg || isLoadingMembers;

  if (isLoading) {
    return <WidgetSkeleton variant="metric" />;
  }

  if (!organization) {
    return (
      <Card className="p-8 text-center text-destructive">
        Organization not found
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Members</p>
          <p className="text-3xl font-bold">{members.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Owners</p>
          <p className="text-3xl font-bold">
            {members.filter((m) => m.role === 'OWNER').length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Editors</p>
          <p className="text-3xl font-bold">
            {members.filter((m) => m.role === 'EDITOR').length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Viewers</p>
          <p className="text-3xl font-bold">
            {members.filter((m) => m.role === 'VIEWER').length}
          </p>
        </Card>
      </div>

      {/* Organization Info */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Organization Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{organization.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Slug</p>
            <p className="font-medium font-mono">{organization.slug}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-medium">
              {organization.isActive ? 'Active' : 'Inactive'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Type</p>
            <p className="font-medium">
              {organization.isPersonal
                ? 'Personal Workspace'
                : 'Team Organization'}
            </p>
          </div>
          {organization.description && (
            <div className="col-span-full">
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="font-medium">{organization.description}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function EnhancedOrganizationSettings({
  organizationId,
  pendingInvitations = [],
}: EnhancedSettingsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: organization, isLoading: isLoadingOrg } =
    useOrganization(organizationId);
  const { data: currentUser } = useCurrentUser();

  const isOwner = organization?.ownerId === currentUser?.id;
  const userRole = organization
    ? isOwner
      ? ('OWNER' as const)
      : ('VIEWER' as const)
    : undefined;

  // Filter tabs based on user role
  const availableTabs = TABS.filter((tab) => {
    if (tab.requiredRole && userRole !== tab.requiredRole) {
      return false;
    }
    return true;
  });

  if (isLoadingOrg) {
    return <WidgetSkeleton variant="chart" />;
  }

  if (!organization) {
    return (
      <Card className="p-8 text-center text-destructive">
        Organization not found
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{organization.name}</h1>
        <p className="text-muted-foreground mt-1">
          Manage your organization settings, members, and preferences
        </p>
      </div>

      {/* Tabs Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto">
          {availableTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="gap-2">
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab Content */}
        <div className="mt-6">
          {availableTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              <div className="space-y-6">
                {/* Tab Header */}
                <div>
                  <h2 className="text-2xl font-semibold">{tab.label}</h2>
                  <p className="text-muted-foreground mt-1">
                    {tab.description}
                  </p>
                </div>

                {/* Tab Content */}
                {tab.id === 'overview' && (
                  <OverviewTabContent organizationId={organizationId} />
                )}

                {tab.id === 'members' && (
                  <Card className="p-6 text-center text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p>Members management component</p>
                  </Card>
                )}

                {tab.id === 'invitations' && (
                  <Card className="p-6 text-center text-muted-foreground">
                    <Mail className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p>
                      {pendingInvitations.length} pending{' '}
                      {pendingInvitations.length === 1
                        ? 'invitation'
                        : 'invitations'}
                    </p>
                  </Card>
                )}

                {tab.id === 'settings' && (
                  <Card className="p-6 text-center text-muted-foreground">
                    <SettingsIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p>Organization settings</p>
                  </Card>
                )}
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
