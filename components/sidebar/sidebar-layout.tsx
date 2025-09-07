'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './sidebar-refactored';

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
   
        <div className="h-full w-full  overflow-y-auto">
          {children}
        </div>
     
    </div>
  );
}