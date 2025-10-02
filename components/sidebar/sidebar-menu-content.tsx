'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SubMenuItem } from './types';

interface SidebarMenuContentProps {
  submenu: SubMenuItem[];
  onMobileClose: () => void;
}

export function SidebarMenuContent({ submenu, onMobileClose }: SidebarMenuContentProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-1">
      {submenu.map((subItem, index) => {
        const SubIcon = subItem.icon;
        const isActive = pathname === subItem.href;

        return (
          <Link
            key={subItem.id}
            href={subItem.href}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors relative",
              "hover:bg-muted/50",
              isActive && "bg-muted/80 text-foreground font-medium"
            )}
            onClick={onMobileClose}
            title={subItem.description}
          >
            {/* Active indicator */}
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r-full" />
            )}

            <div className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground group-hover:text-foreground"
            )}>
              {SubIcon ? (
                <SubIcon className="h-4 w-4" />
              ) : (
                <div className="h-1.5 w-1.5 rounded-full bg-current" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className={cn(
                "truncate text-xs font-medium transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
              )}>
                {subItem.label}
              </div>
            </div>

            {subItem.badge && (
              <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary/10 px-1.5 text-[10px] font-semibold text-primary">
                {subItem.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}