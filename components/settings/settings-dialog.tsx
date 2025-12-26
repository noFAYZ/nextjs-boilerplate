'use client';

import React, { useState, useEffect, memo } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Bell,
  Lock,
  Palette,
  Building2,
  Zap,
  Check,
  CreditCard,
  Download,
  Smartphone,
  Shield,
  Globe,
  Eye,
  Mail,
  Clock,
  Sun,
  Moon,
  Monitor,
  Workflow,
  Cpu,
  TrendingUp,
  Trash2,
  RefreshCw,
  AlertCircle,
  Loader,
  Loader2,
  Repeat2,
  Layout,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/hooks/useToast';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useAccountsUIStore } from '@/lib/stores/accounts-ui-store';
import type { UserPreferences } from '@/lib/types/settings';
import { DEFAULT_USER_PREFERENCES } from '@/lib/types/settings';
import type { PlanType } from '@/lib/types';
import { Card } from '../ui/card';
import { useProviderConnections, useDisconnectConnection, useSyncConnection, useReconnectConnection, useDeleteConnection } from '@/lib/queries/banking-queries';
import {
  useCurrentBillingSubscription,
  usePaymentHistory,
  useUpgradeBillingSubscription,
  useDowngradeBillingSubscription,
  useCancelBillingSubscription,
  useReactivateBillingSubscription,
} from '@/lib/queries/use-billing-subscription-data';
import { Badge } from '../ui/badge';
import { SolarCheckCircleBoldDuotone } from '../icons/icons';
import { batchTimestampzToReadable, timestampzPresets, timestampzToReadable } from '@/lib/utils/time';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { getLogoUrl } from '@/lib/services/logo-service';
import { getBankingProviderMetadata } from '@/lib/utils/banking-utils';
import { Pill } from '../ui/pill';

const PREFERENCES_STORAGE_KEY = 'moneymappr_user_preferences';

type SettingsTab = 'profile' | 'general' | 'appearance' | 'notifications' | 'privacy' | 'banking' | 'crypto' | 'data' | 'billing' | 'integrations' | 'advanced';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SettingsMenuItem {
  id: SettingsTab;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const SETTINGS_MENU: SettingsMenuItem[] = [
  { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" />, description: 'Account details' },
  { id: 'general', label: 'General', icon: <Clock className="h-4 w-4" />, description: 'Basic preferences' },
  { id: 'appearance', label: 'Appearance', icon: <Palette className="h-4 w-4" />, description: 'Theme & display' },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" />, description: 'Alerts & updates' },
  { id: 'privacy', label: 'Privacy', icon: <Lock className="h-4 w-4" />, description: 'Security options' },
  { id: 'banking', label: 'Banking', icon: <Building2 className="h-4 w-4" />, description: 'Bank settings' },
  { id: 'crypto', label: 'Crypto', icon: <TrendingUp className="h-4 w-4" />, description: 'Crypto preferences' },
  { id: 'data', label: 'Data & Sync', icon: <Workflow className="h-4 w-4" />, description: 'Data management' },
  { id: 'billing', label: 'Billing', icon: <CreditCard className="h-4 w-4" />, description: 'Subscription' },
  { id: 'integrations', label: 'Integrations', icon: <Zap className="h-4 w-4" />, description: 'Connected apps' },
  { id: 'advanced', label: 'Advanced', icon: <Cpu className="h-4 w-4" />, description: 'Accessibility' },
];

const ToggleSwitch = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className={cn(
      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
      value ? 'bg-primary' : 'bg-muted-foreground/30'
    )}
  >
    <span
      className={cn(
        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
        value ? 'translate-x-5.5' : 'translate-x-1'
      )}
    />
  </button>
);

const SettingItem = ({
  icon,
  label,
  description,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  children?: React.ReactNode;
}) => (
  <Card className="flex flex-row items-center gap-4  rounded-lg border border-border/80">
    <div className="flex-shrink-0 text-muted-foreground mt-0.5">{icon}</div>
    <div className="flex-1">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </div>
    {children}
  </Card>
);

const SettingsDialogComponent = ({ open, onOpenChange }: SettingsDialogProps) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_USER_PREFERENCES);
  const defaultOverview = useAccountsUIStore((state) => state.viewPreferences.defaultOverview);
  const setDefaultOverview = useAccountsUIStore((state) => state.setDefaultOverview);
  const [hasChanges, setHasChanges] = useState(false);

  // Provider connections hooks
  const { data: connections = [], isLoading: isLoadingConnections, error: connectionsError } = useProviderConnections({ enabled: open });
  const { mutate: disconnectMutation, isPending: isDisconnecting } = useDisconnectConnection();
  const { mutate: syncMutation, isPending: isSyncing } = useSyncConnection();
  const { mutate: reconnectMutation, isPending: isReconnecting } = useReconnectConnection();
  const { mutate: deleteMutation, isPending: isDeleting } = useDeleteConnection();
  const [expandedConnections, setExpandedConnections] = useState<Set<string>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<{ connectionId: string; connectionName: string } | null>(null);

  // Billing hooks
  const { data: currentSubscription, isLoading: isLoadingSubscription, error: subscriptionError } = useCurrentBillingSubscription({ enabled: open });
  const { data: paymentHistory = [], isLoading: isLoadingPayments, error: paymentsError } = usePaymentHistory({ enabled: open });
  const { mutate: upgradeMutation, isPending: isUpgrading } = useUpgradeBillingSubscription();
  const { mutate: downgradeMutation, isPending: isDowngrading } = useDowngradeBillingSubscription();
  const { mutate: cancelMutation, isPending: isCancelling } = useCancelBillingSubscription();
  const { mutate: reactivateMutation, isPending: isReactivating } = useReactivateBillingSubscription();

  // Billing UI state
  const [billingDialog, setBillingDialog] = useState<{
    type: 'upgrade' | 'downgrade' | 'cancel' | 'reactivate' | null;
    targetPlan?: PlanType;
  }>({ type: null });

  // Billing handlers
  const handleUpgrade = (targetPlan: PlanType) => {
    upgradeMutation(
      { planType: targetPlan, billingPeriod: 'MONTHLY' },
      {
        onSuccess: () => {
          toast({
            title: 'Upgrade Successful',
            description: `You've been upgraded to ${targetPlan} plan!`,
          });
          setBillingDialog({ type: null });
        },
        onError: (error) => {
          toast({
            title: 'Upgrade Failed',
            description: error instanceof Error ? error.message : 'Failed to upgrade',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleDowngrade = (targetPlan: PlanType) => {
    downgradeMutation(
      { planType: targetPlan },
      {
        onSuccess: () => {
          toast({
            title: 'Downgrade Scheduled',
            description: `You'll be downgraded to ${targetPlan} plan at the end of your billing period.`,
          });
          setBillingDialog({ type: null });
        },
        onError: (error) => {
          toast({
            title: 'Downgrade Failed',
            description: error instanceof Error ? error.message : 'Failed to downgrade',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleCancel = (immediately: boolean = false) => {
    cancelMutation(
      { immediately },
      {
        onSuccess: () => {
          toast({
            title: 'Subscription Cancelled',
            description: immediately
              ? 'Your subscription has been cancelled immediately.'
              : 'Your subscription will be cancelled at the end of the current billing period.',
          });
          setBillingDialog({ type: null });
        },
        onError: (error) => {
          toast({
            title: 'Cancellation Failed',
            description: error instanceof Error ? error.message : 'Failed to cancel',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleReactivate = () => {
    reactivateMutation(undefined, {
      onSuccess: () => {
        toast({
          title: 'Subscription Reactivated',
          description: 'Your subscription has been reactivated successfully.',
        });
        setBillingDialog({ type: null });
      },
      onError: (error) => {
        toast({
          title: 'Reactivation Failed',
          description: error instanceof Error ? error.message : 'Failed to reactivate',
          variant: 'destructive',
        });
      },
    });
  };

  // Handle disconnect with user feedback
  const handleDisconnect = (connectionId: string, provider: string) => {
    if (confirm(`Disconnect ${provider}? All associated accounts will be removed.`)) {
      disconnectMutation({ connectionId, revokeToken: true });
    }
  };

  // Handle sync with user feedback
  const handleSync = (connectionId: string, provider: string) => {
    syncMutation({ connectionId });
  };

  // Handle reconnect
  const handleReconnect = (connectionId: string) => {
    reconnectMutation(connectionId, {
      onSuccess: () => {
        toast({
          title: 'Connection Restored',
          description: 'The connection has been successfully reconnected.',
        });
      },
      onError: (error) => {
        toast({
          title: 'Reconnection Failed',
          description: error instanceof Error ? error.message : 'Failed to reconnect',
          variant: 'destructive',
        });
      },
    });
  };

  // Handle delete
  const handleDelete = (connectionId: string) => {
    deleteMutation(connectionId, {
      onSuccess: () => {
        toast({
          title: 'Connection Deleted',
          description: 'The connection and all associated data has been permanently deleted.',
        });
        setDeleteConfirm(null);
      },
      onError: (error) => {
        toast({
          title: 'Deletion Failed',
          description: error instanceof Error ? error.message : 'Failed to delete connection',
          variant: 'destructive',
        });
        setDeleteConfirm(null);
      },
    });
  };

  // Load preferences on mount
  useEffect(() => {
    const stored = getWithTimestamp<UserPreferences>(PREFERENCES_STORAGE_KEY);
    if (stored?.data) {
      setPreferences(stored.data);
    }
  }, []);

  const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    try {
      saveWithTimestamp(PREFERENCES_STORAGE_KEY, preferences);
      setHasChanges(false);
      toast({
        title: 'Success',
        description: 'Settings saved successfully',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    }
  };

  // Import functions from lib/utils
  const getWithTimestamp = (key: string) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      const parsed = JSON.parse(item);
      return { data: parsed.data, timestamp: parsed.timestamp };
    } catch {
      return null;
    }
  };

  const saveWithTimestamp = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify({ data, timestamp: new Date().toISOString() }));
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="xl" className="flex flex-col overflow-hidden p-0 gap-0 h-[60vh]" hiddenTitle="Settings">
        <ModalBody className="flex   ">
          {/* Sidebar Menu */}
          <div className="w-60 border-r border-border/50  bg-sidebar ">
            <nav className="p-3 space-y-1">
              {SETTINGS_MENU.map((item) => (
                <Button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  variant={activeTab === item.id ? 'outlinemuted' : 'outlinemuted2'}
                  className='w-full text-start justify-start'
                  icon={item.icon}
                >
                
             {item.label}
                </Button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex flex-col w-full overflow-y-auto  justify-between">
            <div className="p-6 space-y-6 max-w-3xl">

              {/* Profile */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">Profile</h3>
                    <p className="text-sm text-muted-foreground mb-4">Manage your account information</p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                      <input type="text" value={user?.name || ''} disabled className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-muted text-muted-foreground cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                      <input type="email" value={user?.email || ''} disabled className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-muted text-muted-foreground cursor-not-allowed" />
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">Cancel</Button>
                    <Button onClick={() => onOpenChange(false)} size="sm">Done</Button>
                  </div>
                </div>
              )}

              {/* General */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">General</h3>
                    <p className="text-sm text-muted-foreground mb-4">Basic preferences</p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Language</label>
                      <select value={preferences.language} onChange={(e) => updatePreference('language', e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50">
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Currency</label>
                      <select value={preferences.currency} onChange={(e) => updatePreference('currency', e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50">
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="JPY">JPY</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Date Format</label>
                      <select value={preferences.dateFormat} onChange={(e) => updatePreference('dateFormat', e.target.value as any)} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50">
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Time Format</label>
                      <select value={preferences.timeFormat} onChange={(e) => updatePreference('timeFormat', e.target.value as any)} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50">
                        <option value="12h">12 Hour</option>
                        <option value="24h">24 Hour</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">Appearance</h3>
                    <p className="text-sm text-muted-foreground mb-4">Customize the look and feel</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">Theme</label>
                      <div className="grid grid-cols-3 gap-3">
                        {(['light', 'dark', 'system'] as const).map((theme) => (
                          <button key={theme} onClick={() => updatePreference('theme', theme)} className={cn("p-4 rounded-lg border-2 transition-all", preferences.theme === theme ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}>
                            <div className="flex flex-col items-center gap-2">
                              {theme === 'light' && <Sun className="h-5 w-5" />}
                              {theme === 'dark' && <Moon className="h-5 w-5" />}
                              {theme === 'system' && <Monitor className="h-5 w-5" />}
                              <span className="text-xs font-medium capitalize">{theme}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <SettingItem icon={<Eye className="h-5 w-5" />} label="Compact Mode" description="Reduce spacing">
                      <ToggleSwitch value={preferences.compactMode} onChange={() => updatePreference('compactMode', !preferences.compactMode)} />
                    </SettingItem>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Font Size</label>
                      <select value={preferences.fontSize} onChange={(e) => updatePreference('fontSize', e.target.value as any)} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50">
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                    <SettingItem icon={<Eye className="h-5 w-5" />} label="High Contrast" description="Increase visibility">
                      <ToggleSwitch value={preferences.highContrast} onChange={() => updatePreference('highContrast', !preferences.highContrast)} />
                    </SettingItem>
                    <SettingItem icon={<Clock className="h-5 w-5" />} label="Reduced Motion" description="Minimize animations">
                      <ToggleSwitch value={preferences.reducedMotion} onChange={() => updatePreference('reducedMotion', !preferences.reducedMotion)} />
                    </SettingItem>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">Accounts Overview Layout</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setDefaultOverview('overview')}
                          className={cn("p-4 rounded-lg border-2 transition-all text-left", defaultOverview === 'overview' ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}
                        >
                          <div className="flex flex-col gap-2">
                            <span className="text-sm font-medium text-foreground">Overview</span>
                            <p className="text-xs text-muted-foreground">Accordion view grouped by category</p>
                            {defaultOverview === 'overview' && (
                              <Badge className="w-fit text-[10px]" variant="default">Active</Badge>
                            )}
                          </div>
                        </button>

                        <button
                          onClick={() => setDefaultOverview('overview-2')}
                          className={cn("p-4 rounded-lg border-2 transition-all text-left", defaultOverview === 'overview-2' ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}
                        >
                          <div className="flex flex-col gap-2">
                            <span className="text-sm font-medium text-foreground">Overview 2</span>
                            <p className="text-xs text-muted-foreground">Sidebar with category filter</p>
                            {defaultOverview === 'overview-2' && (
                              <Badge className="w-fit text-[10px]" variant="default">Active</Badge>
                            )}
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">Notifications</h3>
                    <p className="text-sm text-muted-foreground mb-4">Manage your alerts</p>
                  </div>
                  <div className="space-y-3">
                    <SettingItem icon={<Mail className="h-5 w-5" />} label="Email Notifications" description="Receive updates via email">
                      <ToggleSwitch value={preferences.emailNotifications} onChange={() => updatePreference('emailNotifications', !preferences.emailNotifications)} />
                    </SettingItem>
                    <SettingItem icon={<Smartphone className="h-5 w-5" />} label="Push Notifications" description="Browser alerts">
                      <ToggleSwitch value={preferences.pushNotifications} onChange={() => updatePreference('pushNotifications', !preferences.pushNotifications)} />
                    </SettingItem>
                    <SettingItem icon={<Bell className="h-5 w-5" />} label="Transaction Alerts" description="New transactions">
                      <ToggleSwitch value={preferences.transactionAlerts} onChange={() => updatePreference('transactionAlerts', !preferences.transactionAlerts)} />
                    </SettingItem>
                    <SettingItem icon={<Bell className="h-5 w-5" />} label="Weekly Reports" description="Summary every week">
                      <ToggleSwitch value={preferences.weeklyReports} onChange={() => updatePreference('weeklyReports', !preferences.weeklyReports)} />
                    </SettingItem>
                    <SettingItem icon={<Bell className="h-5 w-5" />} label="Monthly Reports" description="Summary every month">
                      <ToggleSwitch value={preferences.monthlyReports} onChange={() => updatePreference('monthlyReports', !preferences.monthlyReports)} />
                    </SettingItem>
                    <SettingItem icon={<Bell className="h-5 w-5" />} label="Sync Notifications" description="When data syncs">
                      <ToggleSwitch value={preferences.syncNotifications} onChange={() => updatePreference('syncNotifications', !preferences.syncNotifications)} />
                    </SettingItem>
                  </div>
                </div>
              )}

              {/* Privacy & Security */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">Privacy & Security</h3>
                    <p className="text-sm text-muted-foreground mb-4">Control your data and security</p>
                  </div>
                  <div className="space-y-3">
                    <SettingItem icon={<Eye className="h-5 w-5" />} label="Hide Balances" description="Hide amounts by default">
                      <ToggleSwitch value={preferences.hideBalances} onChange={() => updatePreference('hideBalances', !preferences.hideBalances)} />
                    </SettingItem>
                    <SettingItem icon={<Shield className="h-5 w-5" />} label="Mask Sensitive Data" description="Blur account numbers">
                      <ToggleSwitch value={preferences.maskSensitiveData} onChange={() => updatePreference('maskSensitiveData', !preferences.maskSensitiveData)} />
                    </SettingItem>
                    <SettingItem icon={<Shield className="h-5 w-5" />} label="Two-Factor Auth" description="Extra security">
                      <ToggleSwitch value={preferences.twoFactorEnabled} onChange={() => updatePreference('twoFactorEnabled', !preferences.twoFactorEnabled)} />
                    </SettingItem>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Session Timeout (minutes)</label>
                      <select value={preferences.sessionTimeout} onChange={(e) => updatePreference('sessionTimeout', parseInt(e.target.value))} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50">
                        <option value="15">15</option>
                        <option value="30">30</option>
                        <option value="60">60</option>
                        <option value="120">120</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Banking */}
              {activeTab === 'banking' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">Banking</h3>
                    <p className="text-sm text-muted-foreground mb-4">Bank account preferences</p>
                  </div>
                  <div className="space-y-3">
                    <SettingItem icon={<Eye className="h-5 w-5" />} label="Show Pending Transactions" description="Display pending items">
                      <ToggleSwitch value={preferences.showPendingTransactions} onChange={() => updatePreference('showPendingTransactions', !preferences.showPendingTransactions)} />
                    </SettingItem>
                    <SettingItem icon={<Workflow className="h-5 w-5" />} label="Auto-categorize" description="Auto-categorize transactions">
                      <ToggleSwitch value={preferences.categorizeAutomatically} onChange={() => updatePreference('categorizeAutomatically', !preferences.categorizeAutomatically)} />
                    </SettingItem>
                  </div>
                </div>
              )}

              {/* Crypto */}
              {activeTab === 'crypto' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">Cryptocurrency</h3>
                    <p className="text-sm text-muted-foreground mb-4">Crypto preferences</p>
                  </div>
                  <div className="space-y-3">
                    <SettingItem icon={<Eye className="h-5 w-5" />} label="Show Small Balances" description="Display tokens under $1">
                      <ToggleSwitch value={preferences.showSmallBalances} onChange={() => updatePreference('showSmallBalances', !preferences.showSmallBalances)} />
                    </SettingItem>
                    <SettingItem icon={<TrendingUp className="h-5 w-5" />} label="Track Gas Fees" description="Include gas fees">
                      <ToggleSwitch value={preferences.trackGasFees} onChange={() => updatePreference('trackGasFees', !preferences.trackGasFees)} />
                    </SettingItem>
                  </div>
                </div>
              )}

              {/* Data & Sync */}
              {activeTab === 'data' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">Data & Sync</h3>
                    <p className="text-sm text-muted-foreground mb-4">Data management settings</p>
                  </div>
                  <div className="space-y-3">
                    <SettingItem icon={<Workflow className="h-5 w-5" />} label="Auto Sync" description="Background sync">
                      <ToggleSwitch value={preferences.autoSync} onChange={() => updatePreference('autoSync', !preferences.autoSync)} />
                    </SettingItem>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Sync Interval (minutes)</label>
                      <select value={preferences.syncInterval} onChange={(e) => updatePreference('syncInterval', parseInt(e.target.value))} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50">
                        <option value="5">5</option>
                        <option value="15">15</option>
                        <option value="30">30</option>
                        <option value="60">60</option>
                      </select>
                    </div>
                    <SettingItem icon={<Cpu className="h-5 w-5" />} label="Cache Enabled" description="Faster loading">
                      <ToggleSwitch value={preferences.cacheEnabled} onChange={() => updatePreference('cacheEnabled', !preferences.cacheEnabled)} />
                    </SettingItem>
                  </div>
                </div>
              )}

              {/* Billing */}
              {activeTab === 'billing' && (
                <div className="space-y-5">
                  {/* Header */}
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">Billing & Subscription</h3>
                    <p className="text-xs text-muted-foreground">Manage your plan and view payment history</p>
                  </div>

                  {/* Current Plan Card */}
                  {isLoadingSubscription ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader className="h-4 w-4 text-muted-foreground animate-spin" />
                      <span className="text-xs text-muted-foreground ml-2">Loading subscription...</span>
                    </div>
                  ) : subscriptionError ? (
                    <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/5 flex items-start gap-3">
                      <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-destructive">Failed to load subscription</p>
                        <p className="text-[10px] text-destructive/70 mt-0.5">Please try again later</p>
                      </div>
                    </div>
                  ) : currentSubscription ? (
                    <div className="relative overflow-hidden rounded-lg border border-border/50 bg-gradient-to-br from-primary/5 via-background to-background">
                      {/* Decorative background */}
                      <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />

                      <div className="relative p-5">
                        <div className="space-y-4">
                          {/* Plan Header */}
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-bold text-foreground">
                                  {currentSubscription.subscription?.planType || currentSubscription.currentPlan || 'FREE'}
                                </h3>
                                {currentSubscription.subscription ? (
                                  <Badge className={cn(
                                    'text-[10px] font-semibold px-2 py-0.5',
                                    currentSubscription.subscription.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-0' :
                                    currentSubscription.subscription.status === 'CANCELLED' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border-0' :
                                    currentSubscription.subscription.status === 'TRIAL' ? 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-0' :
                                    'bg-gray-500/20 text-gray-700 dark:text-gray-400 border-0'
                                  )}>
                                    {currentSubscription.subscription.status}
                                  </Badge>
                                ) : (
                                  <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-400 border-0 text-[10px] font-semibold px-2 py-0.5">
                                    ACTIVE
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {currentSubscription.subscription?.billingPeriod === 'MONTHLY' ? 'Monthly plan' : currentSubscription.subscription?.billingPeriod === 'YEARLY' ? 'Yearly plan' : 'Free forever'}
                              </p>
                            </div>
                          </div>

                          {/* Plan Details Grid */}
                          <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Amount</p>
                              <p className="text-base font-bold text-foreground">
                                {currentSubscription.subscription ? `$${(currentSubscription.subscription.amount / 100).toFixed(2)}` : 'Free'}
                              </p>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Renewal</p>
                              <p className="text-base font-bold text-foreground">
                                {currentSubscription.subscription
                                  ? new Date(currentSubscription.subscription.currentPeriodEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                  : '—'}
                              </p>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Cycle</p>
                              <p className="text-base font-bold text-foreground">
                                {currentSubscription.subscription?.billingPeriod === 'MONTHLY' ? 'Monthly' : currentSubscription.subscription?.billingPeriod === 'YEARLY' ? 'Yearly' : '—'}
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-1">
                            {(!currentSubscription.subscription || currentSubscription.subscription.planType !== 'ULTIMATE') && (
                              <Button
                                size="sm"
                                className="flex-1 text-xs font-semibold"
                                disabled={isUpgrading}
                                onClick={() => {
                                  const currentPlan = currentSubscription.subscription?.planType || 'FREE';
                                  const nextPlan: PlanType = currentPlan === 'FREE' ? 'PRO' : 'ULTIMATE';
                                  handleUpgrade(nextPlan);
                                }}
                              >
                                {isUpgrading && <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />}
                                {!currentSubscription.subscription || currentSubscription.subscription.planType === 'FREE' ? '✨ Start Pro' : '⚡ Upgrade'}
                              </Button>
                            )}
                            {currentSubscription.subscription?.status === 'ACTIVE' && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 text-xs font-semibold"
                                disabled={isCancelling}
                                onClick={() => setBillingDialog({ type: 'cancel' })}
                              >
                                {isCancelling && <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />}
                                Cancel
                              </Button>
                            )}
                            {currentSubscription.subscription?.status === 'CANCELLED' && (
                              <Button
                                size="sm"
                                className="flex-1 text-xs font-semibold"
                                disabled={isReactivating}
                                onClick={handleReactivate}
                              >
                                {isReactivating && <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />}
                                Reactivate
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                      <p className="text-xs text-muted-foreground">Unable to load subscription information</p>
                    </div>
                  )}

                  {/* Invoice History Section */}
                  <div>
                    <div className="mb-3">
                      <h4 className="text-sm font-bold text-foreground mb-0.5">Invoice History</h4>
                      <p className="text-xs text-muted-foreground">Your recent payments and invoices</p>
                    </div>

                    {isLoadingPayments ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader className="h-4 w-4 text-muted-foreground animate-spin" />
                        <span className="text-xs text-muted-foreground ml-2">Loading invoices...</span>
                      </div>
                    ) : paymentsError ? (
                      <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/5 flex items-start gap-3">
                        <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-destructive">Failed to load invoices</p>
                          <p className="text-[10px] text-destructive/70 mt-0.5">Please try again later</p>
                        </div>
                      </div>
                    ) : paymentHistory && paymentHistory.length > 0 ? (
                      <div className="space-y-1.5">
                        {/* Header Row */}
                        <div className="hidden sm:grid sm:grid-cols-12 gap-3 px-3 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                          <div className="col-span-1">Status</div>
                          <div className="col-span-3">Invoice</div>
                          <div className="col-span-3">Date</div>
                          <div className="col-span-3">Amount</div>
                          <div className="col-span-1">Action</div>
                        </div>

                        {/* Invoice Rows */}
                        {paymentHistory.map((payment: any, index: number) => (
                          <div
                            key={payment.id || index}
                            className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors group"
                          >
                            {/* Status Badge */}
                            <div className="col-span-1 flex items-center">
                              <div className={cn(
                                'h-3 w-3 rounded-full border-2 flex-shrink-0',
                                payment.status === 'PAID' ? 'bg-emerald-500 border-emerald-600' :
                                payment.status === 'FAILED' ? 'bg-red-500 border-red-600' :
                                payment.status === 'PENDING' ? 'bg-amber-500 border-amber-600' :
                                'bg-blue-500 border-blue-600'
                              )} />
                            </div>

                            {/* Invoice Number */}
                            <div className="col-span-1 sm:col-span-3">
                              <p className="text-[10px] font-semibold text-muted-foreground sm:hidden mb-0.5">Invoice</p>
                              <p className="text-xs font-medium text-foreground truncate">
                                #{payment.invoiceNumber || payment.id?.slice(-6)}
                              </p>
                            </div>

                            {/* Date */}
                            <div className="col-span-1 sm:col-span-3">
                              <p className="text-[10px] font-semibold text-muted-foreground sm:hidden mb-0.5">Date</p>
                              <p className="text-xs text-foreground">
                                {new Date(payment.date || payment.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>

                            {/* Amount & Status */}
                            <div className="col-span-1 sm:col-span-3">
                              <p className="text-[10px] font-semibold text-muted-foreground sm:hidden mb-0.5">Amount</p>
                              <div className="flex items-center justify-between sm:flex-col sm:items-start gap-2">
                                <p className="text-xs font-bold text-foreground">
                                  ${(payment.amount / 100).toFixed(2)}
                                </p>
                                <Badge className={cn(
                                  'text-[9px] font-semibold px-1.5 py-0.5',
                                  payment.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-0' :
                                  payment.status === 'FAILED' ? 'bg-red-500/20 text-red-700 dark:text-red-400 border-0' :
                                  payment.status === 'PENDING' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border-0' :
                                  'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-0'
                                )}>
                                  {payment.status}
                                </Badge>
                              </div>
                            </div>

                            {/* Download Button */}
                            <div className="col-span-1 flex items-center justify-end">
                              <Button
                                size="xs"
                                variant="ghost"
                                className="opacity-60 hover:opacity-100 transition-opacity"
                                title="Download invoice"
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-5 rounded-lg border border-border/50 bg-muted/30 text-center">
                        <CreditCard className="h-6 w-6 text-muted-foreground mx-auto mb-2 opacity-50" />
                        <p className="text-xs font-medium text-muted-foreground">No invoices yet</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Your invoices will appear here once you upgrade</p>
                      </div>
                    )}
                  </div>

                  {/* Cancel Subscription Dialog */}
                  {billingDialog.type === 'cancel' && (
                    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                      <div className="bg-background rounded-lg p-6 max-w-sm mx-4 border border-border">
                        <h3 className="text-lg font-semibold text-foreground mb-2">Cancel Subscription?</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                          Are you sure you want to cancel your subscription? You'll lose access to premium features.
                        </p>
                        <div className="space-y-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                            disabled={isCancelling}
                            onClick={() => handleCancel(true)}
                          >
                            {isCancelling ? <Loader2 className="h-3 w-3 mr-2 animate-spin" /> : null}
                            Cancel Immediately
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            disabled={isCancelling}
                            onClick={() => handleCancel(false)}
                          >
                            {isCancelling ? <Loader2 className="h-3 w-3 mr-2 animate-spin" /> : null}
                            Cancel at Period End
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full"
                            disabled={isCancelling}
                            onClick={() => setBillingDialog({ type: null })}
                          >
                            Keep Subscription
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Integrations */}
              {activeTab === 'integrations' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">Banking Connections</h3>
                    <p className="text-sm text-muted-foreground mb-4">Manage your provider connections and linked accounts</p>
                  </div>

                  {connectionsError && (
                    <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-destructive">Failed to load connections</p>
                        <p className="text-xs text-destructive/80 mt-1">Please try again later</p>
                      </div>
                    </div>
                  )}

                  {isLoadingConnections ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
                      <span className="text-sm text-muted-foreground ml-2">Loading connections...</span>
                    </div>
                  ) : connections && connections.length > 0 ? (
                    <div className="space-y-3">
                      {connections.map((conn: any) => (
                        <Card key={conn.id} className="  
                    ">
                          <div className=" space-y-2">
                            {/* Header - Logo, Name, Status Badges, and Right Buttons */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <Avatar className="h-10 w-10 rounded-full flex-shrink-0">
                                  <AvatarImage
                                    src={
                                      conn.institutionLogo
                                        ? conn.institutionLogo
                                        : conn.institutionUrl
                                          ? getLogoUrl(conn.institutionUrl) || undefined
                                          : undefined
                                    }
                                    alt={conn.institutionName || conn.provider}
                                    className="rounded-full"
                                  />
                                  <AvatarFallback className="bg-primary/10 rounded-lg">
                                    <span className="text-sm font-medium text-primary">
                                      {conn.provider?.charAt(0).toUpperCase() || 'P'}
                                    </span>
                                  </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-sm font-semibold text-foreground truncate">
                                      {conn.institutionName || conn.provider}
                                    </p>
                                    {/* Status Badge beside name */}
                                    <Badge
                                      className={cn(
                                        'flex items-center gap-1 px-1 py-0.5 text-[11px] rounded-full font-medium shrink-0',
                                        conn.status === 'ACTIVE'
                                          ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-0'
                                          : conn.status === 'DISCONNECTED'
                                            ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border-0'
                                            : 'bg-red-500/20 text-red-700 dark:text-red-400 border-0'
                                      )}
                                    >
                                      {conn.status === 'ACTIVE' && <SolarCheckCircleBoldDuotone className="h-3 w-3" />}
                                      {conn.status === 'DISCONNECTED' && <AlertCircle className="h-3 w-3" />}
                                      {conn.status === 'FAILED' && <AlertCircle className="h-3 w-3" />}
                                      {String(conn.status)?.toLocaleLowerCase().charAt(0).toUpperCase() +
                                        String(conn.status)?.toLocaleLowerCase().slice(1)}
                                    </Badge>
                                  </div>
                                  <Badge variant='subtle' size='sm' className=" "
                                  left={<Avatar className='bg-muted rounded-full border text-[10px] h-4 w-4'>
                                    <AvatarImage src={getBankingProviderMetadata(conn.provider)?.logo} alt={conn.provider} className='rounded-full' />
                                    <AvatarFallback>CN</AvatarFallback>
                                  </Avatar>}
                                  >
                                  
                                    {getBankingProviderMetadata(conn.provider)?.name}</Badge>
                                  
                                </div>
                              </div>

                              {/* Right Side: Reconnect, Sync, and Delete */}
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                {/* Reconnect Button (if disconnected) */}
                                {conn.status === 'DISCONNECTED' && (
                                  <Button
                                    size="xs"
                                    variant="outline"
                                    onClick={() => handleReconnect(conn.id)}
                                    disabled={isReconnecting && (reconnectMutation as any).variables === conn.id}
                                    className="h-7 w-7 p-0 flex items-center justify-center flex-shrink-0"
                                    title="Reconnect"
                                  >
                                    {isReconnecting && (reconnectMutation as any).variables === conn.id ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      <RefreshCw className="h-3 w-3" />
                                    )}
                                  </Button>
                                )}

                                {/* Sync Button */}
                                <Button
                                  size="xs"
                                  variant="secondary"
                                  onClick={() => handleSync(conn.id, conn.provider)}
                                  disabled={isSyncing && (syncMutation as any).variables?.connectionId === conn.id}
                                  className="h-7 px-2 flex items-center gap-1 text-[11px] flex-shrink-0"
                                  title="Sync now"
                                >
                                  {isSyncing && (syncMutation as any).variables?.connectionId === conn.id ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <RefreshCw className="h-3 w-3" />
                                  )}
                                  <span className="hidden sm:inline">Sync</span>
                                </Button>

                                {/* Delete Button */}
                                <Button
                                  size="xs"
                                  variant="ghost"
                                  onClick={() => setDeleteConfirm({ connectionId: conn.id, connectionName: conn.institutionName || conn.provider })}
                                  disabled={isDeleting && (deleteMutation as any).variables === conn.id}
                                  className="h-7 w-7 p-0 flex items-center justify-center flex-shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                  title="Delete"
                                >
                                  {isDeleting && (deleteMutation as any).variables === conn.id ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-3 w-3" />
                                  )}
                                </Button>
                              </div>
                            </div>

                            {/* Sync Info Badges Row */}
                            <div className="flex items-center gap-1.5">
                              {/* Last Sync Badge */}
                              <Badge variant="outline" className="flex items-center gap-1 text-[10px] px-1.5 py-0.5">
                                <Clock className="h-3 w-3" />
                                <span className="hidden sm:inline">{conn.updatedAt ? timestampzPresets.relative(conn.updatedAt) : 'Never'}</span>
                              </Badge>

                              {/* Frequency Badge */}
                              {conn.syncFrequency && (
                                <Badge variant="outline" className="flex items-center gap-1 text-[10px] px-1.5 py-0.5">
                                  <Repeat2 className="h-3 w-3" />
                                  <span className="hidden sm:inline">{conn.syncFrequency}</span>
                                </Badge>
                              )}
                       

                            {/* Error Info Row */}
                            {conn.errorCount > 0 && (
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  {conn.errorCount} error{conn.errorCount > 1 ? 's' : ''}
                                </span>
                              </div>
                            )}

                            {/* Sync Status Badge */}
                            {conn.lastSyncStatus && (
                              <Badge
                                variant="outline"
                                className={cn(
                                  'text-[11px] w-fit',
                                  conn.lastSyncStatus === 'SUCCESS'
                                    ? 'bg-emerald-500/10 border-emerald-200 dark:border-emerald-800'
                                    : conn.lastSyncStatus === 'FAILED'
                                      ? 'bg-red-500/10 border-red-200 dark:border-red-800'
                                      : 'bg-blue-500/10 border-blue-200 dark:border-blue-800'
                                )}
                              >
                                Last Sync: {conn.lastSyncStatus}
                              </Badge>
                            )}     </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Zap className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-sm text-muted-foreground mb-2">No connections found</p>
                      <p className="text-xs text-muted-foreground">Connect your banking accounts to get started</p>
                    </div>
                  )}
                </div>
              )}

              {/* Advanced */}
              {activeTab === 'advanced' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">Advanced</h3>
                    <p className="text-sm text-muted-foreground mb-4">Advanced options</p>
                  </div>
                  <div className="space-y-3">
                    <SettingItem icon={<Globe className="h-5 w-5" />} label="Screen Reader Optimized" description="Accessibility support">
                      <ToggleSwitch value={preferences.screenReaderOptimized} onChange={() => updatePreference('screenReaderOptimized', !preferences.screenReaderOptimized)} />
                    </SettingItem>
                  </div>
                </div>
              )}


            </div>
             <ModalFooter className='bg-transparent justify-end'>

        <div className="flex  gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)} size="sm">Cancel</Button>
                <Button onClick={handleSave} disabled={!hasChanges} size="sm">Save Settings</Button>
              </div>
          </ModalFooter>
          </div>

        </ModalBody>    
      </ModalContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Connection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete the connection to <strong>{deleteConfirm?.connectionName}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">This action will:</p>
              <ul className="list-disc list-inside ml-1 text-xs space-y-1 text-muted-foreground">
                <li>Remove all financial accounts linked to this connection</li>
                <li>Delete all transactions for those accounts</li>
                <li>Clear all sync history and logs</li>
              </ul>
            </div>
            <p className="text-xs text-destructive font-medium">This action cannot be undone.</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-900 hover:bg-red-800"
              onClick={() => {
                if (deleteConfirm) {
                  handleDelete(deleteConfirm.connectionId);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </Modal>
  );
};

export const SettingsDialog = memo(SettingsDialogComponent);
