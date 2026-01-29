'use client';

import { cn } from '@/lib/utils';
import { MainHeader } from '@/components/sidebar/core/main-header';
import { SidebarV2 } from './sidebar-v2';
import { SidebarV2Provider } from './sidebar-v2-provider';

interface SidebarLayoutV2Props {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  defaultSidebarExpanded?: boolean;
}

export function SidebarLayoutV2({
  children,
  className,
  showHeader = true,
  defaultSidebarExpanded = false,
}: SidebarLayoutV2Props) {
  return (
    <SidebarV2Provider defaultExpanded={defaultSidebarExpanded}>
      <div className={cn('flex h-screen w-full', className)}>
        <aside className="hidden md:flex fixed left-0 top-0 h-screen z-40 relative">
          <SidebarV2 />
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden relative">
          {showHeader && <MainHeader mainColumnExpanded={false} onToggleMainColumn={() => {}} onMobileMenuToggle={() => {}} isMobileMenuOpen={false} />}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto p-3 ">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarV2Provider>
  );
}

export type { SidebarLayoutV2Props };
