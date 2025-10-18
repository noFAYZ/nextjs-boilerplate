'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Lock } from 'lucide-react';
import { SubMenuItem } from '../types';

interface SidebarMenuContentEnhancedProps {
  submenu: SubMenuItem[];
  onMobileClose?: () => void;
  enableKeyboardNav?: boolean;
}

export function SidebarMenuContentEnhanced({
  submenu,
  onMobileClose,
}: SidebarMenuContentEnhancedProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {submenu.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link key={item.id} href={item.href} onClick={onMobileClose}>
            <Button
              variant={'ghost'}
              className={cn(
                'w-full justify-start gap-3 h-auto py-2 px-2 rounded-lg transition-all',
                isActive && 'bg-muted/60 text-primary  '
              )}
            >
              <div className={cn(
                'p-1.5 rounded-md',
                isActive ? 'bg-primary/20' : 'dark:bg-muted bg-accent',
                item.iconColor && `text-[${item.iconColor}]`
              )}>
                {Icon ? (
                  <Icon className="h-5 w-5" style={item.iconColor ? { color: item.iconColor } : undefined} />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-current" />
                )}
              </div>

              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'font-medium text-sm truncate',
                    isActive ? 'text-primary' : 'text-foreground'
                  )}>
                    {item.label}
                  </span>
                  {item.requiresPro && (
                    <Lock className="h-3 w-3 text-muted-foreground shrink-0" />
                  )}
                </div>
              
              </div>

              {item.status && (
                <Badge variant={item.status === 'new' ? 'default' : 'secondary'} className="text-[10px] px-1.5">
                  {item.status}
                </Badge>
              )}

              {item.badge && (
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              )}

              {isActive && (
                <ChevronRight className="h-4 w-4 text-primary shrink-0" />
              )}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
