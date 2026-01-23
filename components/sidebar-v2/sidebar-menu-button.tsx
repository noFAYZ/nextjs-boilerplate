'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MenuItemV2 } from './types';
import { MENU_ITEM_STYLES } from './constants';

interface SidebarMenuButtonProps {
  item: MenuItemV2;
  isActive: boolean;
  isExpanded: boolean;
  onMouseEnter?: (itemId: string) => void;
  onMouseLeave?: () => void;
  onClick?: (itemId: string) => void;
}

/**
 * SidebarMenuButton Component
 *
 * Renders a single menu item button in the sidebar with support for:
 * - Icon display (always visible)
 * - Label display (visible when expanded)
 * - Badge display (notification count)
 * - Active state styling
 * - Responsive behavior on hover
 */
const SidebarMenuButton = React.memo(
  React.forwardRef<HTMLDivElement, SidebarMenuButtonProps>(
    (
      {
        item,
        isActive,
        isExpanded,
        onMouseEnter,
        onMouseLeave,
        onClick,
      },
      ref
    ) => {
      const Icon = item.icon;

      // Memoize click handler to prevent unnecessary function creation
      const handleClick = React.useCallback(() => {
        onClick?.(item.id);
      }, [item.id, onClick]);

      // Memoize hover handlers
      const handleMouseEnter = React.useCallback(() => {
        onMouseEnter?.(item.id);
      }, [item.id, onMouseEnter]);

      const handleMouseLeave = React.useCallback(() => {
        onMouseLeave?.();
      }, [onMouseLeave]);

      // Determine active state styling
      const activeStateClasses = React.useMemo(
        () =>
          isActive
            ? ' text-primary/80  '
            : 'text-muted-foreground',
        [isActive]
      );

      const buttonContent = (
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'relative flex items-center gap-2',
            MENU_ITEM_STYLES.HEIGHT,
            MENU_ITEM_STYLES.ROUNDED,
            MENU_ITEM_STYLES.TRANSITION,
            isExpanded ? 'w-full justify-start' : 'w-10 justify-center p-0',
            activeStateClasses
          )}
          onClick={handleClick}
          aria-current={isActive ? 'page' : undefined}
          aria-label={item.label}
        >
          <Icon className={cn('flex-shrink-0', MENU_ITEM_STYLES.ICON_SIZE)} />

          {/* Label - only visible when expanded */}
          {isExpanded && (
            <>
              <span className="text-sm font-semibold truncate">{item.label}</span>

              {/* Badge - only show when expanded */}
              {item.badge && (
                <span
                  className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white"
                  aria-label={`${item.label} notifications: ${item.badge}`}
                >
                  {item.badge}
                </span>
              )}
            </>
          )}

          {/* Badge - collapsed state */}
          {!isExpanded && item.badge && (
            <span
              className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white"
              aria-label={`${item.label} notifications: ${item.badge}`}
            >
              {item.badge}
            </span>
          )}
        </Button>
      );

      return (
        <div
          ref={ref}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          role="menuitem"
        >
          {item.href === '#' ? (
            buttonContent
          ) : (
            <Link href={item.href} prefetch={true}>
              {buttonContent}
            </Link>
          )}
        </div>
      );
    }
  )
);

SidebarMenuButton.displayName = 'SidebarMenuButton';

export { SidebarMenuButton };
export type { SidebarMenuButtonProps };
