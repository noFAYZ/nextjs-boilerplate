/**
 * Settings Types
 *
 * Comprehensive type definitions for user settings and preferences
 */

export interface UserPreferences {
  // Display Settings
  viewMode: 'beginner' | 'pro';
  theme: 'light' | 'dark' | 'system';
  currency: string;
  language: string;
  timezone: string;
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';

  // Dashboard Settings
  defaultDashboard: 'overview' | 'banking' | 'crypto' | 'portfolio';
  compactMode: boolean;
  showWidgets: boolean;

  // Privacy & Security
  biometricEnabled: boolean;
  twoFactorEnabled: boolean;
  sessionTimeout: number; // minutes
  hideBalances: boolean;
  maskSensitiveData: boolean;

  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  transactionAlerts: boolean;
  goalReminders: boolean;
  syncNotifications: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;

  // Data & Sync
  autoSync: boolean;
  syncInterval: number; // minutes
  cacheEnabled: boolean;
  offlineMode: boolean;

  // Banking Settings
  showPendingTransactions: boolean;
  categorizeAutomatically: boolean;
  defaultBankView: 'transactions' | 'analytics' | 'overview';

  // Crypto Settings
  showSmallBalances: boolean; // balances under $1
  smallBalanceThreshold: number;
  defaultCryptoView: 'tokens' | 'nfts' | 'defi' | 'transactions';
  trackGasFees: boolean;

  // Portfolio Settings
  portfolioRefreshRate: number; // seconds
  showPerformanceMetrics: boolean;
  defaultTimeRange: '24h' | '7d' | '30d' | '90d' | '1y' | 'all';

  // Accessibility
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  highContrast: boolean;
  screenReaderOptimized: boolean;
}

export interface NotificationSettings {
  email: {
    enabled: boolean;
    transactions: boolean;
    goals: boolean;
    sync: boolean;
    reports: boolean;
    marketing: boolean;
  };
  push: {
    enabled: boolean;
    transactions: boolean;
    goals: boolean;
    sync: boolean;
    priceAlerts: boolean;
  };
  inApp: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
  };
}

export interface PrivacySettings {
  dataSharing: boolean;
  analytics: boolean;
  crashReports: boolean;
  personalizedAds: boolean;
  thirdPartyIntegrations: boolean;
}

export interface SecuritySettings {
  twoFactorAuth: {
    enabled: boolean;
    method: 'sms' | 'email' | 'authenticator';
    backupCodes: string[];
  };
  sessionTimeout: number;
  loginAlerts: boolean;
  deviceTracking: boolean;
  trustedDevices: Array<{
    id: string;
    name: string;
    lastUsed: string;
    trusted: boolean;
  }>;
}

export interface ExportSettings {
  format: 'csv' | 'json' | 'pdf';
  includeTransactions: boolean;
  includePortfolio: boolean;
  includeGoals: boolean;
  dateRange: {
    from: string;
    to: string;
  };
}

export interface UserSettings {
  id: string;
  userId: string;
  preferences: UserPreferences;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  security: SecuritySettings;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingsRequest {
  preferences?: Partial<UserPreferences>;
  notifications?: Partial<NotificationSettings>;
  privacy?: Partial<PrivacySettings>;
  security?: Partial<SecuritySettings>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

// Default settings
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  viewMode: 'pro',
  theme: 'system',
  currency: 'USD',
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  defaultDashboard: 'overview',
  compactMode: false,
  showWidgets: true,
  biometricEnabled: false,
  twoFactorEnabled: false,
  sessionTimeout: 30,
  hideBalances: false,
  maskSensitiveData: false,
  emailNotifications: true,
  pushNotifications: true,
  transactionAlerts: true,
  goalReminders: true,
  syncNotifications: false,
  weeklyReports: true,
  monthlyReports: true,
  autoSync: true,
  syncInterval: 15,
  cacheEnabled: true,
  offlineMode: false,
  showPendingTransactions: true,
  categorizeAutomatically: true,
  defaultBankView: 'transactions',
  showSmallBalances: false,
  smallBalanceThreshold: 1,
  defaultCryptoView: 'tokens',
  trackGasFees: true,
  portfolioRefreshRate: 30,
  showPerformanceMetrics: true,
  defaultTimeRange: '30d',
  fontSize: 'medium',
  reducedMotion: false,
  highContrast: false,
  screenReaderOptimized: false,
};
