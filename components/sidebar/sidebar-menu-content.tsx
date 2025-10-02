'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SubMenuItem } from './types';

interface SidebarMenuContentProps {
  submenu: SubMenuItem[];
  onMobileClose: () => void;
}

export function SidebarMenuContent({ submenu, onMobileClose }: SidebarMenuContentProps) {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  return (
    <div className="space-y-0.5 py-1">
      {submenu.map((subItem, index) => {
        const SubIcon = subItem.icon;
        const isActive = pathname === subItem.href;
        const isHovered = hoveredIndex === index;

        return (
          <Link
            key={subItem.id}
            href={subItem.href}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-100 relative overflow-hidden",
              "hover:bg-accent/50 hover:shadow-sm hover:translate-x-0.5",
              isActive && "bg-accent shadow-sm"
            )}
            onClick={onMobileClose}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            title={subItem.description}
          >
            {/* Gradient overlay on hover */}
            {isHovered && !isActive && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50 transition-opacity" />
            )}

            {/* Active gradient background */}
         
            {/* Active indicator line */}
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary/50 via-primary to-primary/50 rounded-r-full shadow-sm shadow-primary/20" />
            )}

            <div className={cn(
              "relative flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-100 z-10",
              isActive
                ? " bg-muted/50 text-muted-foreground shadow-sm "
                : "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:shadow-sm"
            )}>
              {SubIcon ? (
                <SubIcon className={cn(
                  "h-5 w-5 transition-all duration-100",
                  isActive && "scale-105"
                )} />
              ) : (
                <div className={cn(
                  "h-2 w-2 rounded-full transition-all duration-100",
                  isActive ? "bg-primary scale-125" : "bg-muted-foreground"
                )} />
              )}

      
            </div>

            <div className="flex-1 min-w-0 z-10">
              <div className={cn(
                "truncate text-sm font-medium transition-all duration-100",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground group-hover:text-foreground"
              )}>
                {subItem.label}
              </div>
              {subItem.description && isHovered && (
                <div className="text-[10px] text-muted-foreground truncate animate-in fade-in slide-in-from-left-1 duration-100">
                  {subItem.description}
                </div>
              )}
            </div>

            {/* Badge */}
            {subItem.badge && (
              <span className={cn(
                "flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[10px] font-semibold transition-all duration-100 z-10",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-primary/10 text-primary group-hover:bg-primary/20"
              )}>
                {subItem.badge}
              </span>
            )}

            {/* Chevron indicator */}
            <ChevronRight className={cn(
              "h-4 w-4 transition-all duration-100 z-10",
              isActive
                ? "text-primary opacity-100 translate-x-0"
                : "text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
            )} />
          </Link>
        );
      })}
    </div>
  );
}
