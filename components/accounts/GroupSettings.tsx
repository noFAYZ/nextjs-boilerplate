'use client';

import { useState, useEffect } from 'react';
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
  Loader2,
} from 'lucide-react';
import { useToast } from '@/lib/hooks/use-toast';
import type { AccountGroup } from '@/lib/types/account-groups';
import {
  getGroupSettings,
  updateGroupSettings,
  exportGroupSettings,
  importGroupSettings,
  archiveGroup,
} from '@/lib/api/account-groups-settings';
import { deleteAccountGroup } from '@/lib/api/account-groups';

// Extended settings interface for group preferences
export interface GroupSettings {
  hideEmptyAccounts: boolean;
  autoArchiveInactive: boolean;
  enableNotifications: boolean;
  shareWithFamily: boolean;
  requireApproval: boolean;
  lockBalances: boolean;
  dustThreshold?: number;
  inactivityDays?: number;
  approvalThreshold?: number;
}

interface GroupSettingsProps {
  group: AccountGroup;
  onUpdate?: (group: AccountGroup) => void;
  onDelete?: () => void;
}

export function GroupSettings({ group, onUpdate, onDelete }: GroupSettingsProps) {
  const { toast } = useToast();
  const [settings, setSettings] = useState<GroupSettings>({
    hideEmptyAccounts: false,
    autoArchiveInactive: false,
    enableNotifications: true,
    shareWithFamily: false,
    requireApproval: false,
    lockBalances: false,
    dustThreshold: 10,
    inactivityDays: 90,
    approvalThreshold: 1000,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize settings from API or localStorage fallback
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);

        // Try to load from API first
        const response = await getGroupSettings(group.id);

        if (response.success && response.data) {
          setSettings(prev => ({ ...prev, ...response.data }));
          // Cache in localStorage for offline access
          localStorage.setItem(`group-settings-${group.id}`, JSON.stringify(response.data));
        } else {
          // Fallback to localStorage if API fails
          const savedSettings = localStorage.getItem(`group-settings-${group.id}`);
          if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            setSettings(prev => ({ ...prev, ...parsed }));
          }
        }
      } catch (error) {
        console.error('Error loading group settings:', error);
        // Fallback to localStorage on error
        try {
          const savedSettings = localStorage.getItem(`group-settings-${group.id}`);
          if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            setSettings(prev => ({ ...prev, ...parsed }));
          }
        } catch (fallbackError) {
          console.error('Error loading fallback settings:', fallbackError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [group.id]);

  const handleSettingChange = async (key: keyof GroupSettings, value: boolean | number) => {
    const oldSettings = { ...settings };

    try {
      setIsLoading(true);
      const newSettings = { ...settings, [key]: value };

      // Optimistically update UI
      setSettings(newSettings);

      // Save to localStorage immediately for better UX
      localStorage.setItem(`group-settings-${group.id}`, JSON.stringify(newSettings));

      // Make API call to save settings
      const response = await updateGroupSettings(group.id, { [key]: value });

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to update settings');
      }

      // Update with server response to ensure consistency
      if (response.data) {
        setSettings(response.data);
        localStorage.setItem(`group-settings-${group.id}`, JSON.stringify(response.data));
      }

      // Format the key name for display
      const displayName = key.replace(/([A-Z])/g, ' $1').toLowerCase();
      const action = typeof value === 'boolean' ? (value ? 'enabled' : 'disabled') : 'updated';

      toast({
        title: 'Setting updated',
        description: `${displayName} has been ${action}.`,
      });
    } catch (error) {
      // Revert the setting on error
      setSettings(oldSettings);
      localStorage.setItem(`group-settings-${group.id}`, JSON.stringify(oldSettings));

      toast({
        title: 'Update failed',
        description: 'Failed to update setting. Please try again.',
        variant: 'destructive',
      });
      console.error('Error updating setting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setIsLoading(true);

      // Get export data from API
      const response = await exportGroupSettings(group.id);

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to export settings');
      }

      const exportData = {
        group: {
          id: group.id,
          name: group.name,
          description: group.description,
          icon: group.icon,
          color: group.color,
          createdAt: group.createdAt,
        },
        ...response.data,
        accountCount: (group._count?.financialAccounts || 0) + (group._count?.cryptoWallets || 0),
        exportedAt: new Date().toISOString(),
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `group-${group.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Export successful',
        description: 'Group data has been downloaded to your device.',
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export group data. Please try again.',
        variant: 'destructive',
      });
      console.error('Export error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        setIsLoading(true);
        const text = await file.text();
        const importData = JSON.parse(text);

        // Validate import data structure
        if (importData.settings && typeof importData.settings === 'object') {
          // Make API call to import settings
          const response = await importGroupSettings(group.id, {
            settings: importData.settings,
            metadata: importData.metadata,
          });

          if (!response.success) {
            throw new Error(response.error?.message || 'Failed to import settings');
          }

          // Update local state with server response
          if (response.data) {
            setSettings(response.data);
            localStorage.setItem(`group-settings-${group.id}`, JSON.stringify(response.data));
          }

          toast({
            title: 'Import successful',
            description: 'Group settings have been imported and applied.',
          });
        } else {
          throw new Error('Invalid file format');
        }
      } catch (error) {
        toast({
          title: 'Import failed',
          description: 'Failed to import data. Please check the file format.',
          variant: 'destructive',
        });
        console.error('Import error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    input.click();
  };

  const handleArchiveGroup = async () => {
    try {
      setIsArchiving(true);

      // Make API call to archive the group
      const response = await archiveGroup(group.id);

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to archive group');
      }

      toast({
        title: 'Group archived',
        description: `"${group.name}" has been archived and will be hidden from lists.`,
      });

      // Notify parent component
      onUpdate?.({ ...group, isArchived: true });
    } catch (error) {
      toast({
        title: 'Archive failed',
        description: 'Failed to archive the group. Please try again.',
        variant: 'destructive',
      });
      console.error('Archive error:', error);
    } finally {
      setIsArchiving(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (group.isDefault) {
      toast({
        title: 'Cannot delete',
        description: 'Default groups cannot be deleted.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsDeleting(true);

      // Make API call to delete the group
      const response = await deleteAccountGroup(group.id);

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete group');
      }

      // Clean up localStorage
      localStorage.removeItem(`group-settings-${group.id}`);

      toast({
        title: 'Group deleted',
        description: `"${group.name}" has been permanently deleted.`,
      });

      // Notify parent component
      onDelete?.();
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: 'Failed to delete the group. Please try again.',
        variant: 'destructive',
      });
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
            <Button variant="outline" onClick={handleExportData} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Export Data
            </Button>
            <Button variant="outline" onClick={handleImportData} disabled={isLoading}>
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
                  <Button variant="outline" disabled={isArchiving || isDeleting || isLoading}>
                    {isArchiving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Archive className="h-4 w-4 mr-2" />
                    )}
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
                    <AlertDialogCancel disabled={isArchiving}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleArchiveGroup} disabled={isArchiving}>
                      {isArchiving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Archiving...
                        </>
                      ) : (
                        'Archive Group'
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isDeleting || isArchiving || isLoading}>
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
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
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteGroup}
                      disabled={isDeleting}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        'Delete Group'
                      )}
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