/**
 * Sidebar V2 - Instagram-style Collapsible Sidebar
 *
 * Main exports:
 * - SidebarV2: Main sidebar component
 * - SidebarLayoutV2: Layout wrapper with sidebar + content area
 * - SidebarMenuButton: Individual menu button (internal)
 * - MenuItemV2, SubMenuItemV2: TypeScript interfaces
 * - Styling constants
 */

export { SidebarV2 } from './sidebar-v2';
export type { SidebarV2Props } from './sidebar-v2';

export { SidebarLayoutV2 } from './sidebar-v2-layout';
export type { SidebarLayoutV2Props } from './sidebar-v2-layout';

export { SidebarMenuButton } from './sidebar-menu-button';
export type { SidebarMenuButtonProps } from './sidebar-menu-button';

export type { MenuItemV2, SubMenuItemV2 } from './types';

export {
  SIDEBAR_WIDTHS,
  SIDEBAR_TRANSITIONS,
  MENU_ITEM_STYLES,
  FOOTER_BUTTON_STYLES,
  LOGO_STYLES,
  AVATAR_STYLES,
  BADGE_STYLES,
  POPOVER_STYLES,
} from './constants';
