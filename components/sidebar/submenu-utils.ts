import { SubMenuItem, SubMenuGroup } from './types';

/**
 * Utility functions for submenu operations
 */

/**
 * Sort submenu items by order property
 */
export function sortSubmenuItems(items: SubMenuItem[]): SubMenuItem[] {
  return [...items].sort((a, b) => (a.order || 0) - (b.order || 0));
}

/**
 * Filter submenu items based on visibility and permissions
 */
export function filterVisibleItems(
  items: SubMenuItem[],
  userPermissions: string[] = [],
  hasPro: boolean = false
): SubMenuItem[] {
  return items.filter(item => {
    // Filter out hidden items
    if (item.isHidden) return false;

    // Filter out items requiring pro if user doesn't have pro
    if (item.requiresPro && !hasPro) return false;

    // Filter out items based on required permissions
    if (item.requiredPermissions && item.requiredPermissions.length > 0) {
      return item.requiredPermissions.some(permission =>
        userPermissions.includes(permission)
      );
    }

    return true;
  });
}

/**
 * Group submenu items by their group property
 */
export function groupSubmenuItems(items: SubMenuItem[]): SubMenuGroup[] {
  const grouped = new Map<string, SubMenuItem[]>();
  const ungrouped: SubMenuItem[] = [];

  items.forEach(item => {
    if (item.group) {
      if (!grouped.has(item.group)) {
        grouped.set(item.group, []);
      }
      grouped.get(item.group)!.push(item);
    } else {
      ungrouped.push(item);
    }
  });

  const groups: SubMenuGroup[] = [];

  // Add grouped items
  grouped.forEach((groupItems, groupLabel) => {
    groups.push({
      id: groupLabel.toLowerCase().replace(/\s+/g, '-'),
      label: groupLabel,
      items: sortSubmenuItems(groupItems),
      isCollapsible: true,
      defaultExpanded: true
    });
  });

  // Add ungrouped items as a default group if they exist
  if (ungrouped.length > 0) {
    groups.push({
      id: 'main',
      label: 'Main',
      items: sortSubmenuItems(ungrouped),
      isCollapsible: false,
      defaultExpanded: true
    });
  }

  return groups;
}

/**
 * Search/filter submenu items by query
 */
export function searchSubmenuItems(
  items: SubMenuItem[],
  query: string
): SubMenuItem[] {
  if (!query.trim()) return items;

  const lowerQuery = query.toLowerCase();

  return items.filter(item => {
    return (
      item.label.toLowerCase().includes(lowerQuery) ||
      item.description?.toLowerCase().includes(lowerQuery) ||
      item.tooltip?.toLowerCase().includes(lowerQuery)
    );
  });
}

/**
 * Get submenu item by ID
 */
export function findSubmenuItem(
  items: SubMenuItem[],
  id: string
): SubMenuItem | undefined {
  return items.find(item => item.id === id);
}

/**
 * Check if a submenu item is accessible to the user
 */
export function isItemAccessible(
  item: SubMenuItem,
  userPermissions: string[] = [],
  hasPro: boolean = false
): boolean {
  // Check if disabled
  if (item.isDisabled) return false;

  // Check if coming soon
  if (item.status === 'coming-soon') return false;

  // Check pro requirement
  if (item.requiresPro && !hasPro) return false;

  // Check permissions
  if (item.requiredPermissions && item.requiredPermissions.length > 0) {
    return item.requiredPermissions.some(permission =>
      userPermissions.includes(permission)
    );
  }

  return true;
}

/**
 * Get count of accessible items
 */
export function getAccessibleItemsCount(
  items: SubMenuItem[],
  userPermissions: string[] = [],
  hasPro: boolean = false
): number {
  return items.filter(item =>
    isItemAccessible(item, userPermissions, hasPro)
  ).length;
}

/**
 * Get status badge configuration
 */
export function getStatusBadgeConfig(status: SubMenuItem['status']) {
  const badges = {
    new: {
      label: 'New',
      className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      priority: 1
    },
    beta: {
      label: 'Beta',
      className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      priority: 2
    },
    updated: {
      label: 'Updated',
      className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
      priority: 3
    },
    deprecated: {
      label: 'Old',
      className: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
      priority: 4
    },
    'coming-soon': {
      label: 'Soon',
      className: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
      priority: 5
    }
  };

  return status ? badges[status] : null;
}

/**
 * Track submenu item click for analytics
 */
export function trackSubmenuItemClick(item: SubMenuItem) {
  if (typeof window === 'undefined') return;

  // Add your analytics tracking here
  const analyticsData = {
    item_id: item.id,
    item_label: item.label,
    item_href: item.href,
    tracking_id: item.trackingId,
    timestamp: new Date().toISOString()
  };

  console.log('Analytics:', analyticsData);

  // Example: Send to analytics service
  // analytics.track('submenu_item_clicked', analyticsData);
}

/**
 * Get keyboard shortcut display format
 */
export function formatKeyboardShortcut(shortcut: string): string {
  return shortcut
    .replace('⌘', 'Cmd')
    .replace('⌥', 'Alt')
    .replace('⇧', 'Shift')
    .replace('⌃', 'Ctrl');
}

/**
 * Validate submenu item configuration
 */
export function validateSubmenuItem(item: SubMenuItem): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!item.id) errors.push('Missing id');
  if (!item.label) errors.push('Missing label');
  if (!item.href) errors.push('Missing href');

  if (item.requiresPro && item.isDisabled) {
    errors.push('Item cannot be both requiresPro and isDisabled');
  }

  if (item.status === 'coming-soon' && !item.isDisabled) {
    errors.push('Coming soon items should be disabled');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
