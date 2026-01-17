'use client';

import { AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Organization } from '@/lib/types/organization';

interface DetailRow {
  label: string;
  value: React.ReactNode;
  copyable?: boolean;
  onCopy?: () => void;
  copied?: boolean;
  mono?: boolean;
}

interface SettingsSidebarProps {
  organization: Organization;
  isOwner: boolean;
  showDeleteConfirm: boolean;
  onShowDeleteConfirm: (show: boolean) => void;
  onDelete: () => void;
  DetailRowComponent: React.ComponentType<DetailRow>;
}

export function SettingsSidebar({
  organization,
  isOwner,
  showDeleteConfirm,
  onShowDeleteConfirm,
  onDelete,
  DetailRowComponent,
}: SettingsSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Organization Settings */}
      <Card >
        <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide text-muted-foreground">Settings</h3>

        <div className=" divide-y divide-border">
          <DetailRowComponent
            label="Organization Type"
            value={organization.isPersonal ? 'Personal' : 'Team'}
          />
   
          <DetailRowComponent
            label="Created"
            value={new Date(organization.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          />
        </div>
      </Card>

      {/* Danger Zone */}
      {isOwner && !organization.isPersonal && (
        <Card className=" bg-red-50/50 dark:bg-red-950/20">
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
                  onClick={() => onShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={onDelete}
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
              onClick={() => onShowDeleteConfirm(true)}
            >
              Delete Organization
            </Button>
          )}
        </Card>
      )}

      {/* Technical Details 
      <Card >
        <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide text-muted-foreground">Technical</h3>

        <div className="  divide-y divide-border text-xs">
          <DetailRowComponent
            label="Organization ID"
            value={<code className="bg-muted/50 px-1 py-0.5 rounded text-[10px]">{organization.id}</code>}
            copyable
            mono
          />
                 <DetailRowComponent
            label="URL Slug"
            value={<code className="text-xs bg-muted/50 px-1.5 py-0.5 rounded">{organization.slug}</code>}
            copyable
          />
          <DetailRowComponent
            label="Owner ID"
            value={<code className="bg-muted/50 px-1 py-0.5 rounded text-[10px]">{organization.ownerId}</code>}
            mono
          />
        </div>
      </Card>*/}
    </div>
  );
}
