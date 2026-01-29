import * as React from 'react';

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
  submenu?: SubMenuItem[];
  badge?: string | number;
  quickActions?: QuickAction[];
}

/**
 * Enhanced submenu item with production-grade features
 */
export interface SubMenuItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge?: string | number;
  description?: string;

  // Status indicators
  status?: 'new' | 'beta' | 'updated' | 'deprecated' | 'coming-soon';
  isDisabled?: boolean;
  isHidden?: boolean;

  // Access control
  requiresPro?: boolean;
  requiredPermissions?: string[];

  // Grouping and organization
  group?: string;
  order?: number;

  // Additional metadata
  tooltip?: string;
  externalLink?: boolean;
  onClick?: (e: React.MouseEvent) => void;

  // Analytics and tracking
  trackingId?: string;

  // Visual enhancements
  iconColor?: string;
  accentColor?: string;

  // Dynamic content
  count?: number;
  isLoading?: boolean;

  // Keyboard shortcuts
  shortcut?: string;
}

/**
 * Submenu group for organized sections
 */
export interface SubMenuGroup {
  id: string;
  label: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  items: SubMenuItem[];
  isCollapsible?: boolean;
  defaultExpanded?: boolean;
  order?: number;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  action: () => void;
  shortcut?: string;
  badge?: string | number;
}