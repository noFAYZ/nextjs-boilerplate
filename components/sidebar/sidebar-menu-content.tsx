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
    <div className="space-y-2">
      {submenu.map((subItem, index) => {
        const SubIcon = subItem.icon;
        const isActive = pathname === subItem.href;
        
        return (
          <Link
            key={subItem.id}
            href={subItem.href}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-2 py-2 text-sm transition-all duration-200 relative",
              "hover:bg-muted/50 hover:shadow-sm",
              "border border-transparent hover:border-border/50",
              isActive && "bg-muted text-primary font-medium shadow-sm border-border/50"
            )}
            onClick={onMobileClose}
            title={subItem.description}
          >
            <div className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200",
              isActive 
                ? "bg-primary/15 text-primary border border-primary/30" 
                : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary border border-transparent group-hover:border-primary/20"
            )}>
              {SubIcon ? (
                <SubIcon className="h-5 w-5" />
              ) : (
                <div className="h-2 w-2 rounded-full bg-current" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className={cn(
                "truncate text-xs font-medium transition-colors duration-200",
                isActive ? "text-primary" : "text-foreground"
              )}>
                {subItem.label}
              </div>
            </div>
            
            {subItem.badge && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                {subItem.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}