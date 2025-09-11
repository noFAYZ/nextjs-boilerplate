'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Settings,
  Shield,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
  Download,
  Upload,
  Archive,
  Users,
  Lock,
  Unlock,
} from 'lucide-react';
import { useToast } from '@/lib/hooks/use-toast';
import type { AccountGroup } from '@/lib/types/account-groups';

interface GroupSettingsProps {
  group: AccountGroup;
  onUpdate?: (group: AccountGroup) => void;
  onDelete?: () => void;
}

export function GroupSettings({ group, onUpdate, onDelete }: GroupSettingsProps) {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    hideEmptyAccounts: false,
    autoArchiveInactive: false,
    enableNotifications: true,
    shareWithFamily: false,
    requireApproval: false,
    lockBalances: false,
  });

  const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Show toast for immediate feedback
    toast({
      title: 'Setting updated',
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} has been ${value ? 'enabled' : 'disabled'}.`,
    });
  };

  const handleExportData = () => {
    toast({
      title: 'Export started',
      description: 'Your group data is being prepared for download.',
    });
    // TODO: Implement actual export functionality
  };

  const handleImportData = () => {
    toast({
      title: 'Import coming soon',
      description: 'Data import functionality will be available soon.',
    });
    // TODO: Implement actual import functionality
  };

  const handleArchiveGroup = () => {
    toast({
      title: 'Group archived',
      description: `"${group.name}" has been archived and will be hidden from lists.`,
    });
    // TODO: Implement actual archive functionality
  };

  const handleDeleteGroup = () => {
    if (group.isDefault) {
      toast({
        title: 'Cannot delete',
        description: 'Default groups cannot be deleted.',
        variant: 'destructive',
      });
      return;
    }
    
    onDelete?.();
  };

  return (
    <div className="space-y-6">
      {/* Display Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Display Settings
          </CardTitle>
          <CardDescription>
            Configure how this group appears and behaves
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Hide Empty Accounts</Label>
              <p className="text-sm text-muted-foreground">
                Hide accounts with zero or near-zero balances
              </p>
            </div>
            <Switch
              checked={settings.hideEmptyAccounts}
              onCheckedChange={(value) => handleSettingChange('hideEmptyAccounts', value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-Archive Inactive</Label>
              <p className="text-sm text-muted-foreground">
                Automatically archive accounts with no activity for 90+ days
              </p>
            </div>
            <Switch
              checked={settings.autoArchiveInactive}
              onCheckedChange={(value) => handleSettingChange('autoArchiveInactive', value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Lock Balance Display</Label>
              <p className="text-sm text-muted-foreground">
                Require authentication to view account balances
              </p>
            </div>
            <Switch
              checked={settings.lockBalances}
              onCheckedChange={(value) => handleSettingChange('lockBalances', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Manage alerts and notifications for this group
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts about balance changes and account activity
              </p>
            </div>
            <Switch
              checked={settings.enableNotifications}
              onCheckedChange={(value) => handleSettingChange('enableNotifications', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Sharing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Sharing
          </CardTitle>
          <CardDescription>
            Control who can access this group's information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Share with Family</Label>
              <p className="text-sm text-muted-foreground">
                Allow family members to view this group's summary
              </p>
            </div>
            <Switch
              checked={settings.shareWithFamily}
              onCheckedChange={(value) => handleSettingChange('shareWithFamily', value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require Approval</Label>
              <p className="text-sm text-muted-foreground">
                Require approval for transactions above $1,000
              </p>
            </div>
            <Switch
              checked={settings.requireApproval}
              onCheckedChange={(value) => handleSettingChange('requireApproval', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            Export, import, and manage your group data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" onClick={handleImportData}>
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      {!group.isDefault && (
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions that affect this group
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">
                    <Archive className="h-4 w-4 mr-2" />
                    Archive Group
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Archive this group?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will hide the group from your lists but preserve all data. 
                      You can restore it later from your archived groups.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleArchiveGroup}>
                      Archive Group
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Group
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this group?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the 
                      group "{group.name}" and remove all accounts from it. The accounts 
                      themselves will not be deleted, just ungrouped.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteGroup}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete Group
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Default Group Notice */}
      {group.isDefault && (
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Lock className="h-5 w-5" />
              <span className="font-medium">Default Group Protection</span>
            </div>
            <p className="text-sm text-blue-600/80 dark:text-blue-400/80 mt-2">
              This is a default system group and cannot be deleted or archived. 
              Some settings may be restricted to maintain system integrity.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}