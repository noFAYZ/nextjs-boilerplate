'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SubMenuItem, QuickAction } from './types';

interface SidebarCollapsedContentProps {
  submenu?: SubMenuItem[];
  actions: QuickAction[];
  onMobileClose: () => void;
  onActionClick: (actionId: string) => void;
}

export function SidebarCollapsedContent({ 
  submenu, 
  actions, 
  onMobileClose, 
  onActionClick 
}: SidebarCollapsedContentProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col items-center gap-4 px-2 py-2">
      {submenu ? (
        <>
          {/* Section indicator */}
          <div className="w-8 h-0.5 bg-gradient-to-r from-primary/60 to-primary/20 rounded-full shadow-sm" />
          
          {submenu.slice(0, 4).map((subItem, index) => {
            const SubIcon = subItem.icon || FileText;
            const isActive = pathname === subItem.href;
            
            return (
              <Link key={subItem.id} href={subItem.href}>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-10 w-10  hover:scale-102 relative group rounded-lg",
                    isActive
                      ? " shadow-sm border border-border/50"
                      : "hover:bg-muted"
                  )}
                  title={subItem.label}
                  onClick={onMobileClose}
                >
                  <SubIcon className={cn(
                    "h-6 w-6 transition-colors duration-100",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                </Button>
              </Link>
            );
          })}
          
          {/* Show more indicator if there are more items */}
          {submenu.length > 4 && (
            <div className="flex flex-col items-center gap-1 mt-2">
              <div className="flex gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground/60 font-medium">
                +{submenu.length - 4} more
              </span>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Section indicator */}
          <div className="w-8 h-0.5 bg-gradient-to-r from-primary/60 to-primary/20 rounded-full shadow-sm" />
          
          {actions.slice(0, 4).map((action, index) => {
            const ActionIcon = action.icon;
            
            return (
              <Button
                key={action.id}
                variant="ghost"
                size="icon"
                className="h-12 w-12 relative group transition-all duration-300 hover:scale-110 active:scale-95 rounded-xl hover:bg-gradient-to-br hover:from-muted/80 hover:to-muted/60 hover:shadow-md"
                title={action.label}
                onClick={() => onActionClick(action.id)}
              >
                <ActionIcon className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
                
                {action.badge && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-destructive to-destructive/80 text-[10px] font-bold text-destructive-foreground border-2 border-background shadow-md animate-pulse">
                    {action.badge}
                  </span>
                )}
                
                {/* Enhanced tooltip */}
                <div className="absolute left-full ml-3 px-3 py-2 bg-popover/95 text-popover-foreground text-sm rounded-xl shadow-xl border border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 backdrop-blur-sm">
                  <div className="font-medium">{action.label}</div>
                  {action.shortcut && (
                    <div className="text-xs text-muted-foreground mt-1 font-mono">{action.shortcut}</div>
                  )}
                </div>
              </Button>
            );
          })}
          
          {/* Show more indicator */}
          {actions.length > 4 && (
            <div className="flex flex-col items-center gap-1 mt-2">
              <div className="flex gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground/60 font-medium">
                +{actions.length - 4} more
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}