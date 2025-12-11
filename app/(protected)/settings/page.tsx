'use client';

import { useState, useEffect } from 'react';
import posthog from 'posthog-js';
import { usePostHogPageView } from '@/lib/hooks/usePostHogPageView';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Settings, Palette, Bell, Shield, Eye, Database, Wallet, TrendingUp, Activity, Globe, Save, RotateCcw, AlertCircle, Loader2, Moon, Sun, Monitor } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useUserProfile, useUpdateUserProfile } from '@/lib/queries';
import { DEFAULT_USER_PREFERENCES } from '@/lib/types/settings';
import type { UserPreferences } from '@/lib/types/settings';
import { LetsIconsSettingLineDuotone } from '@/components/icons';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// ✅ Use centralized utilities
import {
  getLocalStorageItem,
  setLocalStorageItem,
  removeLocalStorageItem,
  saveWithTimestamp,
  getWithTimestamp,
} from '@/lib/utils';
import { CreateOrganizationModal, OrganizationSettings } from '@/components/organization';
import { CategoryManagementModal } from '@/components/banking';
import { HeroiconsWallet16Solid } from '@/components/icons/icons';

const PREFERENCES_STORAGE_KEY = 'moneymappr_user_preferences';

export default function SettingsPage() {
  usePostHogPageView('settings');
  const { data: userProfile, isLoading } = useUserProfile({ enabled: true });
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateUserProfile();
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_USER_PREFERENCES);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  // ✅ Load preferences using centralized utilities
  useEffect(() => {
    const stored = getWithTimestamp<UserPreferences>(PREFERENCES_STORAGE_KEY);
    if (stored?.data) {
      setPreferences(stored.data);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (userProfile && isInitialized) {
      const profile = userProfile as Record<string, unknown>;
      setPreferences((prev) => ({
        ...prev,
        theme: (profile.theme as UserPreferences['theme']) || prev.theme,
        currency: (profile.currency as UserPreferences['currency']) || prev.currency,
        language: (profile.language as UserPreferences['language']) || prev.language,
        timezone: (profile.timezone as UserPreferences['timezone']) || prev.timezone,
      }));
    }
  }, [userProfile, isInitialized]);

  const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  // ✅ Save/Reset handlers using centralized utilities
  const handleSave = () => {
    const saved = saveWithTimestamp(PREFERENCES_STORAGE_KEY, preferences);

    if (!saved) {
      toast.error('Failed to save settings');
      return;
    }

    updateProfile(
      {
        theme: preferences.theme,
        currency: preferences.currency,
        language: preferences.language,
        timezone: preferences.timezone
      },
      {
        onSuccess: () => {
          posthog.capture('settings_saved', {
            theme: preferences.theme,
            currency: preferences.currency,
            language: preferences.language,
            timezone: preferences.timezone,
          });
          toast.success('Settings saved');
          setHasUnsavedChanges(false);
        },
        onError: () => {
          toast.warning('Saved locally');
          setHasUnsavedChanges(false);
        },
      }
    );
  };

  const handleReset = () => {
    if (!confirm('Reset all settings?')) return;
    setPreferences(DEFAULT_USER_PREFERENCES);
    removeLocalStorageItem(PREFERENCES_STORAGE_KEY);
    toast.success('Settings reset');
    setHasUnsavedChanges(false);
  };

  if (!isInitialized || isLoading) {
    return <div className="min-h-[80vh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (

      <div className="max-w-3xl mx-auto p-4 lg:p-6 space-y-6">
        <div className="flex items-center justify-end">
 
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && <Badge variant="secondary" className="gap-1 text-xs"><AlertCircle className="h-3 w-3" />Unsaved</Badge>}
            <Button variant="outline" size="sm" onClick={handleReset} disabled={isUpdating}><RotateCcw className="h-4 w-4" /></Button>
            <Button size="sm" onClick={handleSave} disabled={!hasUnsavedChanges || isUpdating}>{isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}</Button>
          </div>
        </div>

        <Tabs defaultValue="general" className="">
          <TabsList variant="pill" size={'sm'} className='
          flex flex-wrap' >
            <TabsTrigger value="general" className="gap-2" variant="pill" size={'sm'}>
              <Settings className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2" variant="pill" size={'sm'}>
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2" variant="pill" size={'sm'}>
              <Shield className="h-4 w-4" />
              Security & Privacy
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2" variant="pill" size={'sm'}>
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="accounts" className="gap-2" variant="pill" size={'sm'}>
              <HeroiconsWallet16Solid className="h-4 w-4" />
              Accounts
            </TabsTrigger>
            <TabsTrigger value="advanced" className="gap-2" variant="pill" size={'sm'}>
              <Database className="h-4 w-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-6">
            <Card className="border shadow-none">
              <CardContent className="p-3 space-y-4">
                <div>
                  <h2 className="text-sm font-semibold mb-1">General Settings</h2>
                  <p className="text-xs text-muted-foreground">Configure your basic preferences</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex-1">
                      <Label className="text-sm font-medium">Language</Label>
                      <p className="text-xs text-muted-foreground mt-1">Select your preferred language</p>
                    </div>
                    <Select value={preferences.language} onValueChange={(v) => updatePreference('language', v)}>
                      <SelectTrigger className="w-36 h-9 text-xs" variant='outline2'><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex-1">
                      <Label className="text-sm font-medium">Currency</Label>
                      <p className="text-xs text-muted-foreground mt-1">Default currency display</p>
                    </div>
                    <Select value={preferences.currency} onValueChange={(v) => updatePreference('currency', v)}>
                      <SelectTrigger className="w-36 h-9 text-xs" variant='outline2'><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="JPY">JPY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex-1">
                      <Label className="text-sm font-medium">Date Format</Label>
                      <p className="text-xs text-muted-foreground mt-1">How dates are displayed</p>
                    </div>
                    <Select value={preferences.dateFormat} onValueChange={(v: string) => updatePreference('dateFormat', v)}>
                      <SelectTrigger className="w-36 h-9 text-xs" variant='outline2'><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex-1">
                      <Label className="text-sm font-medium">Time Format</Label>
                      <p className="text-xs text-muted-foreground mt-1">12-hour or 24-hour clock</p>
                    </div>
                    <Select value={preferences.timeFormat} onValueChange={(v) => updatePreference('timeFormat', v as UserPreferences['timeFormat'])}>
                      <SelectTrigger className="w-36 h-9 text-xs" variant='outline2'><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12 Hour</SelectItem>
                        <SelectItem value="24h">24 Hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4 mt-6">
            <Card className="border shadow-none">
              <CardContent className="p-3 space-y-6">
                <div>
                  <h2 className="text-sm font-semibold mb-1">Appearance</h2>
                  <p className="text-xs text-muted-foreground">Customize the look and feel</p>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-3 block">Theme</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['light', 'dark', 'system'] as const).map((theme) => (
                      <button
                        key={theme}
                        onClick={() => updatePreference('theme', theme as UserPreferences['theme'])}
                        className={cn(
                          "p-4 rounded-lg border-2 transition-all",
                          preferences.theme === theme
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex-1">
                      <Label className="text-sm font-medium">Compact Mode</Label>
                      <p className="text-xs text-muted-foreground mt-1">Reduce spacing</p>
                    </div>
                    <Switch checked={preferences.compactMode} onCheckedChange={(v) => updatePreference('compactMode', v)} />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex-1">
                      <Label className="text-sm font-medium">Font Size</Label>
                      <p className="text-xs text-muted-foreground mt-1">Adjust text size</p>
                    </div>
                    <Select value={preferences.fontSize} onValueChange={(v) => updatePreference('fontSize', v as UserPreferences['fontSize'])}>
                      <SelectTrigger className="w-36 h-9 text-xs" variant='outline2'><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 mt-6">
            {/* Privacy Section */}
        <Card className="border shadow-none">
          <CardContent className="p-3 space-y-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 bg-muted rounded-lg flex items-center justify-center">
                <Eye className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Privacy</h2>
                <p className="text-xs text-muted-foreground">Control your data and visibility</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-xs font-medium">Hide Balances</Label>
                  <p className="text-xs text-muted-foreground">Hide balance amounts by default</p>
                </div>
                <Switch checked={preferences.hideBalances} onCheckedChange={(v) => updatePreference('hideBalances', v)} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-xs font-medium">Mask Sensitive Data</Label>
                  <p className="text-xs text-muted-foreground">Blur account numbers and addresses</p>
                </div>
                <Switch checked={preferences.maskSensitiveData} onCheckedChange={(v) => updatePreference('maskSensitiveData', v)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="border shadow-none" >
          <CardContent className="p-3 space-y-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 bg-muted rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Security</h2>
                <p className="text-xs text-muted-foreground">Authentication and security settings</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-xs font-medium">Two-Factor Authentication</Label>
                  <p className="text-xs text-muted-foreground">Add extra layer of security</p>
                </div>
                <Switch checked={preferences.twoFactorEnabled} onCheckedChange={(v) => updatePreference('twoFactorEnabled', v)} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-xs font-medium">Session Timeout</Label>
                  <p className="text-xs text-muted-foreground">Auto-logout after inactivity (minutes)</p>
                </div>
                <Select value={preferences.sessionTimeout.toString()} onValueChange={(v) => updatePreference('sessionTimeout', parseInt(v))}>
                  <SelectTrigger className="w-32 h-8 text-xs" variant='outline2'><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 min</SelectItem>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-6" >

        {/* Notifications Section */}
        <Card className="border shadow-none" >
          <CardContent className="p-3 space-y-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 bg-muted rounded-lg flex items-center justify-center">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Notifications</h2>
                <p className="text-xs text-muted-foreground">Manage alerts and updates</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-xs font-medium">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch checked={preferences.emailNotifications} onCheckedChange={(v) => updatePreference('emailNotifications', v)} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-xs font-medium">Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">Browser push notifications</p>
                </div>
                <Switch checked={preferences.pushNotifications} onCheckedChange={(v) => updatePreference('pushNotifications', v)} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-xs font-medium">Transaction Alerts</Label>
                  <p className="text-xs text-muted-foreground">Get notified of new transactions</p>
                </div>
                <Switch checked={preferences.transactionAlerts} onCheckedChange={(v) => updatePreference('transactionAlerts', v)} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-xs font-medium">Weekly Reports</Label>
                  <p className="text-xs text-muted-foreground">Summary of your finances</p>
                </div>
                <Switch checked={preferences.weeklyReports} onCheckedChange={(v) => updatePreference('weeklyReports', v)} />
              </div>
            </div>
          </CardContent>
        </Card>
</TabsContent>

<TabsContent value="accounts" className="space-y-4 mt-6">

        {/* Banking Section */}
        <Card className="border shadow-none">
          <CardContent className="p-3 space-y-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 bg-muted rounded-lg flex items-center justify-center">
                <Wallet className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Banking</h2>
                <p className="text-xs text-muted-foreground">Bank account preferences</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-xs font-medium">Show Pending Transactions</Label>
                  <p className="text-xs text-muted-foreground">Display pending/processing transactions</p>
                </div>
                <Switch checked={preferences.showPendingTransactions} onCheckedChange={(v) => updatePreference('showPendingTransactions', v)} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-xs font-medium">Auto-categorize</Label>
                  <p className="text-xs text-muted-foreground">Automatically categorize transactions</p>
                </div>
                <Switch checked={preferences.categorizeAutomatically} onCheckedChange={(v) => updatePreference('categorizeAutomatically', v)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Categories Section */}
        <Card className="border shadow-none">
          <CardContent className="p-3 space-y-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 bg-muted rounded-lg flex items-center justify-center">
                <Wallet className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Account Categories</h2>
                <p className="text-xs text-muted-foreground">Organize accounts with custom categories</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Create hierarchical categories to organize and group your accounts by type, purpose, or any custom classification.</p>
            <Button onClick={() => setCategoryModalOpen(true)} className="w-full">
              Manage Categories
            </Button>
          </CardContent>
        </Card>

        {/* Crypto Section */}
        <Card className="border shadow-none">
          <CardContent className="p-3 space-y-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 bg-muted rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Crypto</h2>
                <p className="text-xs text-muted-foreground">Cryptocurrency preferences</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-xs font-medium">Show Small Balances</Label>
                  <p className="text-xs text-muted-foreground">Display tokens under $1</p>
                </div>
                <Switch checked={preferences.showSmallBalances} onCheckedChange={(v) => updatePreference('showSmallBalances', v)} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-xs font-medium">Track Gas Fees</Label>
                  <p className="text-xs text-muted-foreground">Include gas fees in analytics</p>
                </div>
                <Switch checked={preferences.trackGasFees} onCheckedChange={(v) => updatePreference('trackGasFees', v)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data & Sync Section */}
        <Card className="border shadow-none">
          <CardContent className="p-3 space-y-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 bg-muted rounded-lg flex items-center justify-center">
                <Database className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Data & Sync</h2>
                <p className="text-xs text-muted-foreground">Data management settings</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-xs font-medium">Auto Sync</Label>
                  <p className="text-xs text-muted-foreground">Automatically sync data in background</p>
                </div>
                <Switch checked={preferences.autoSync} onCheckedChange={(v) => updatePreference('autoSync', v)} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-xs font-medium">Cache Enabled</Label>
                  <p className="text-xs text-muted-foreground">Cache data for faster loading</p>
                </div>
                <Switch checked={preferences.cacheEnabled} onCheckedChange={(v) => updatePreference('cacheEnabled', v)} />
              </div>
            </div>
          </CardContent>
        </Card>

        </TabsContent>
        <TabsContent value="advanced" className="space-y-4 mt-6" >
        {/* Accessibility Section */}
        <Card className="border shadow-none">
          <CardContent className="p-3 space-y-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 bg-muted rounded-lg flex items-center justify-center">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Accessibility</h2>
                <p className="text-xs text-muted-foreground">Accessibility features</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-xs font-medium">Reduced Motion</Label>
                  <p className="text-xs text-muted-foreground">Minimize animations</p>
                </div>
                <Switch checked={preferences.reducedMotion} onCheckedChange={(v) => updatePreference('reducedMotion', v)} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-xs font-medium">High Contrast</Label>
                  <p className="text-xs text-muted-foreground">Increase contrast for better visibility</p>
                </div>
                <Switch checked={preferences.highContrast} onCheckedChange={(v) => updatePreference('highContrast', v)} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
  
        </Card>
        </TabsContent>




        </Tabs>

        <CategoryManagementModal
          open={categoryModalOpen}
          onOpenChange={setCategoryModalOpen}
        />
      </div>
 
  );
}
