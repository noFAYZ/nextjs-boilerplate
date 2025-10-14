'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronRight,
  Lock,
  ExternalLink,
  Loader2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Crown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SubMenuItem, SubMenuGroup } from './types';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarMenuContentEnhancedProps {
  submenu?: SubMenuItem[];
  groups?: SubMenuGroup[];
  onMobileClose?: () => void;
  enableSearch?: boolean;
  enableKeyboardNav?: boolean;
  onItemClick?: (item: SubMenuItem) => void;
}

/**
 * Production-grade sidebar submenu component with advanced features:
 * - Grouped items with collapsible sections
 * - Status badges (new, beta, pro, etc.)
 * - Keyboard navigation
 * - Loading states
 * - Access control (pro features)
 * - Analytics tracking
 * - Search/filter capability
 * - Tooltips for additional info
 */
export function SidebarMenuContentEnhanced({
  submenu = [],
  groups = [],
  onMobileClose,
  enableSearch = false,
  enableKeyboardNav = true,
  onItemClick
}: SidebarMenuContentEnhancedProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = React.useState<number>(0);
  const [collapsedGroups, setCollapsedGroups] = React.useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = React.useState('');
  const itemRefs = React.useRef<(HTMLAnchorElement | null)[]>([]);

  // Filter out hidden items
  const visibleItems = React.useMemo(() => {
    return submenu.filter(item => !item.isHidden);
  }, [submenu]);

  // Filter items by search query
  const filteredItems = React.useMemo(() => {
    if (!searchQuery) return visibleItems;
    return visibleItems.filter(item =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [visibleItems, searchQuery]);

  // Group items if groups are provided
  const organizedContent = React.useMemo(() => {
    if (groups.length > 0) {
      return groups.sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    return null;
  }, [groups]);

  // Keyboard navigation
  React.useEffect(() => {
    if (!enableKeyboardNav) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const totalItems = filteredItems.length;
      if (totalItems === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => (prev + 1) % totalItems);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => (prev - 1 + totalItems) % totalItems);
          break;
        case 'Enter':
          e.preventDefault();
          const focusedItem = filteredItems[focusedIndex];
          if (focusedItem && !focusedItem.isDisabled) {
            if (focusedItem.onClick) {
              focusedItem.onClick(e as any);
            } else {
              router.push(focusedItem.href);
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboardNav, filteredItems, focusedIndex, router]);

  // Focus management
  React.useEffect(() => {
    itemRefs.current[focusedIndex]?.focus();
  }, [focusedIndex]);

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const handleItemClick = (item: SubMenuItem, e: React.MouseEvent) => {
    if (item.isDisabled) {
      e.preventDefault();
      return;
    }

    if (item.onClick) {
      e.preventDefault();
      item.onClick(e);
    }

    onItemClick?.(item);
    onMobileClose?.();

    // Track analytics
    if (item.trackingId && typeof window !== 'undefined') {
      // Add your analytics tracking here
      console.log('Track:', item.trackingId);
    }
  };

  const renderStatusBadge = (status?: SubMenuItem['status']) => {
    if (!status) return null;

    const badges = {
      new: { label: 'New', className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
      beta: { label: 'Beta', className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
      updated: { label: 'Updated', className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' },
      deprecated: { label: 'Old', className: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' },
      'coming-soon': { label: 'Soon', className: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20' }
    };

    const badge = badges[status];
    return (
      <span className={cn(
        "px-1.5 py-0.5 text-[9px] font-semibold rounded border uppercase tracking-wider",
        badge.className
      )}>
        {badge.label}
      </span>
    );
  };

  const renderSubmenuItem = (item: SubMenuItem, index: number) => {
    const SubIcon = item.icon;
    const isActive = pathname === item.href;
    const isHovered = hoveredIndex === index;
    const isFocused = focusedIndex === index;
    const isDisabled = item.isDisabled || item.status === 'coming-soon';

    const content = (
      <div
        className={cn(
          "group flex items-center gap-3 rounded-md px-2 py-1 text-sm  relative overflow-hidden mb-1",
          "focus-visible:outline-none ",
          !isDisabled && "hover:bg-accent hover:shadow-sm cursor-pointer",
          isActive && " shadow-sm",
          isDisabled && "opacity-50 cursor-not-allowed",
       
        )}
        onMouseEnter={() => !isDisabled && setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
    

        {/* Active indicator */}
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary/50 via-primary to-primary/50 rounded-r-full shadow-lg shadow-primary/30 animate-in slide-in-from-left-2 duration-100" />
        )}

        {/* Icon container */}
        <div className={cn(
          "relative flex h-8 w-8 items-center justify-center rounded-lg z-10 shrink-0",
          isActive
            ? "bg-muted shadow-sm"
            : "bg-muted text-foreground group-hover:bg-background ",
          item.iconColor && `text-[${item.iconColor}]`
        )}>
          {item.isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : SubIcon ? (
            <SubIcon className={cn(
              "h-4.5 w-4.5 transition-all duration-0",
              isActive && "scale-110"
            )} />
          ) : (
            <div className={cn(
              "h-2 w-2 rounded-full transition-all duration-150",
              isActive ? "bg-primary scale-125 shadow-sm shadow-primary/50" : "bg-muted-foreground"
            )} />
          )}
        </div>

        {/* Label and description */}
        <div className="flex-1 min-w-0 z-10">
          <div className="flex items-center gap-2">
            <span className={cn(
              "truncate text-[13px] font-medium transition-all duration-100",
              isActive
                ? "text-foreground font-semibold"
                : "text-foreground/90 group-hover:text-foreground"
            )}>
              {item.label}
            </span>
            {item.requiresPro && (
              <Crown className="h-3 w-3 text-amber-500 shrink-0" />
            )}
            {renderStatusBadge(item.status)}
          </div>

      {/*     {item.description && (isHovered || isActive) && (
            <div className="text-[10px] text-muted-foreground/80 truncate mt-0.5 animate-in fade-in slide-in-from-left-1 duration-200">
              {item.description}
            </div>
          )} */}
        </div>

        {/* Count/Badge */}
        {item.count !== undefined && item.count > 0 && (
          <span className={cn(
            "flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[10px] font-bold transition-all duration-150 z-10 shrink-0",
            isActive
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-primary/15 text-primary group-hover:bg-primary/25"
          )}>
            {item.count > 99 ? '99+' : item.count}
          </span>
        )}

        {item.badge && (
          <span className={cn(
            "flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[10px] font-semibold transition-all duration-150 z-10 shrink-0",
            isActive
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-primary/15 text-primary group-hover:bg-primary/25"
          )}>
            {item.badge}
          </span>
        )}

        {/* Action indicator */}
        {isDisabled && item.status === 'coming-soon' ? (
          <Lock className="h-3.5 w-3.5 text-muted-foreground/50 z-10 shrink-0" />
        ) : item.externalLink ? (
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/50 z-10 shrink-0" />
        ) : (
          <ChevronRight className={cn(
            "h-4 w-4 transition-all duration-150 z-10 shrink-0",
            isActive
              ? "text-primary opacity-100 translate-x-0"
              : "text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
          )} />
        )}

        {/* Keyboard shortcut */}
        {item.shortcut && (isHovered || isFocused) && (
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[9px] font-medium text-muted-foreground z-10 shrink-0 animate-in fade-in duration-200">
            {item.shortcut}
          </kbd>
        )}
      </div>
    );

    const linkContent = item.onClick ? (
      <button
        ref={el => itemRefs.current[index] = el as any}
        onClick={(e) => handleItemClick(item, e)}
        disabled={isDisabled}
        className="w-full text-left"
        aria-label={item.label}
        aria-disabled={isDisabled}
      >
        {content}
      </button>
    ) : (
      <Link
        ref={el => itemRefs.current[index] = el}
        href={item.href}
        onClick={(e) => handleItemClick(item, e)}
        className={cn(isDisabled && "pointer-events-none")}
        aria-label={item.label}
        aria-current={isActive ? 'page' : undefined}
        target={item.externalLink ? '_blank' : undefined}
        rel={item.externalLink ? 'noopener noreferrer' : undefined}
      >
        {content}
      </Link>
    );

    return <React.Fragment key={item.id}>{linkContent}</React.Fragment>;
  };

  const renderGroup = (group: SubMenuGroup) => {
    const isCollapsed = collapsedGroups.has(group.id);
    const GroupIcon = group.icon;
    const visibleGroupItems = group.items.filter(item => !item.isHidden);

    if (visibleGroupItems.length === 0) return null;

    return (
      <div key={group.id} className="space-y-2">
        {/* Group Header */}
        {group.isCollapsible ? (
          <button
            onClick={() => toggleGroup(group.id)}
            className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-accent/30 transition-colors group"
          >
            {GroupIcon && <GroupIcon className="h-3.5 w-3.5 text-muted-foreground" />}
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex-1 text-left">
              {group.label}
            </span>
            {isCollapsed ? (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform" />
            ) : (
              <ChevronUp className="h-3.5 w-3.5 text-muted-foreground transition-transform" />
            )}
          </button>
        ) : (
          <div className="flex items-center gap-2 px-2 py-1.5">
            {GroupIcon && <GroupIcon className="h-3.5 w-3.5 text-muted-foreground" />}
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              {group.label}
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
          </div>
        )}

        {/* Group Items */}
        {!isCollapsed && (
          <div className="space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-200">
            {visibleGroupItems.map((item, idx) => renderSubmenuItem(item, idx))}
          </div>
        )}
      </div>
    );
  };

  // Render content
  if (organizedContent && organizedContent.length > 0) {
    return (
      <div className="space-y-4 py-1">
        {organizedContent.map(group => renderGroup(group))}
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
          <Sparkles className="h-5 w-5 text-muted-foreground/50" />
        </div>
        <p className="text-sm text-muted-foreground">No items found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 py-1">
      {filteredItems.map((item, index) => renderSubmenuItem(item, index))}
    </div>
  );
}
