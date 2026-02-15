/**
 * Sidebar V2 Constants
 * Centralized configuration and constants for sidebar styling and behavior
 */

/**
 * Sidebar widths (fixed positioning)
 * COLLAPSED: 64px (w-16) - Icon-only sidebar
 * EXPANDED: 256px (w-64) - Full sidebar with labels
 * These match the main content area ml-16 margin for proper alignment
 */
export const SIDEBAR_WIDTHS = {
  COLLAPSED: 'w-18',
  EXPANDED: 'w-64',
  COLLAPSED_PX: 64,
  EXPANDED_PX: 256,
} as const;

export const SIDEBAR_TRANSITIONS = {
  DURATION: 'duration-350',
  EASING: 'ease-out',
} as const;

export const MENU_ITEM_STYLES = {
  HEIGHT: 'h-10',
  PADDING_X: 'px-2',
  ROUNDED: 'rounded-md',
  ICON_SIZE: 'h-7 w-7',
  TRANSITION: 'transition-colors duration-150',
} as const;

export const FOOTER_BUTTON_STYLES = {
  HEIGHT: 'h-10',
  PADDING_X: 'px-2',
  ROUNDED: 'rounded-lg',
  TRANSITION: 'transition-colors duration-150',
} as const;

export const LOGO_STYLES = {
  ICON_SIZE: 'w-8 h-8',
  ICON_COLOR: 'text-orange-500',
  TRANSITION: 'transition-all duration-250',
} as const;

export const AVATAR_STYLES = {
  SIZE: 'h-7 w-7',
} as const;

export const BADGE_STYLES = {
  SIZE: 'h-5 w-5',
  TEXT_SIZE: 'text-[10px]',
} as const;

export const POPOVER_STYLES = {
  WIDTH: 'w-56',
  ROUNDED: 'rounded-lg',
  PADDING: 'p-2',
} as const;
