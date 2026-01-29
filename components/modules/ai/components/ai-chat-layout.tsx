'use client';

import React, { ReactNode } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AIChatLayoutProps {
  children: ReactNode;
  input: ReactNode;
}

export function AIChatLayout({ children, input }: AIChatLayoutProps) {
  return (
    <div className="flex h-full flex-col bg-background">
      {/* MESSAGES AREA - SCROLLABLE */}
      <ScrollArea className="flex-1 w-full overflow-hidden">
        <div className="px-4 md:px-6 py-6 max-w-2xl mx-auto w-full">
          {children}
        </div>
      </ScrollArea>

      {/* INPUT AREA - FIXED AT BOTTOM */}
      <div className="py-12 ">
        <div className="max-w-2xl mx-auto w-full">
          {input}
        </div>
      </div>
    </div>
  );
}
