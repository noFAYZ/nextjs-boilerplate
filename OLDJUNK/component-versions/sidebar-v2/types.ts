import * as React from 'react';

/**
 * Submenu item displayed when hovering over a menu item
 * Extends menu items with additional metadata
 */
export interface SubMenuItemV2 {
  /** Unique identifier for the submenu item */
  id: string;

  /** Display label shown to the user */
  label: string;

  /** Navigation path for the submenu item */
  href: string;

  /** Optional icon component displayed next to the label */
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;

  /** Brief description of the submenu item */
  description?: string;

  /** Badge text/number (e.g., notification count) */
  badge?: string | number;

  /** Status indicator: new, beta, updated */
  status?: 'new' | 'beta' | 'updated';
}

/**
 * Main menu item for the sidebar
 * Represents a top-level navigation section
 */
export interface MenuItemV2 {
  /** Unique identifier for the menu item */
  id: string;

  /** Display label shown in the sidebar */
  label: string;

  /** Icon component rendered as the menu item icon */
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;

  /** Navigation path when menu item is clicked */
  href: string;

  /** Optional submenu items that appear when hovering */
  submenu?: SubMenuItemV2[];

  /** Optional badge showing count (e.g., unread messages) */
  badge?: string | number;
}
