'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './sidebar';

interface SidebarLayoutProps {
  children: React.ReactNode;
  className?: string;
  sidebarClassName?: string;
  defaultSidebarExpanded?: boolean;
}

export function SidebarLayout({ 
  children, 
  className,
  sidebarClassName,
  defaultSidebarExpanded = true 
}: SidebarLayoutProps) {
  return (
    <div className={cn("flex h-screen bg-background", className)}>
      <Sidebar 
        className={sidebarClassName}
        defaultExpanded={defaultSidebarExpanded}
      />
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}