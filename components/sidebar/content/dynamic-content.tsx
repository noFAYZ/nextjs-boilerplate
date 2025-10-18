'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SidebarMenuContentEnhanced } from './menu-content';
import { SidebarQuickActions } from './quick-actions';
import { MenuItem, QuickAction } from '../types';
import { SidebarWalletsList } from '../lists/wallets-list';
import { SidebarBankAccountsList } from '../lists/bank-accounts-list';
import { SidebarIntegrationsList } from '../lists/integrations-list';
import { SidebarPortfolioOverview } from '../widgets/portfolio-overview';

interface SidebarDynamicContentProps {
  selectedMenuItem: string | null;
  selectedMenuData: MenuItem | null;
  actions: QuickAction[];
  onMobileClose: () => void;
  onActionClick: (actionId: string) => void;
}

export function SidebarDynamicContent({
  selectedMenuItem,
  selectedMenuData,
  actions,
  onMobileClose,
  onActionClick
}: SidebarDynamicContentProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Determine which content to show based on the selected menu and current path
  const getContent = () => {
    // Dashboard shows quick actions
    if (selectedMenuItem === 'dashboard') {
      return <SidebarQuickActions actions={actions} onActionClick={onActionClick} />;
    }

    // Portfolio section - show portfolio overview
    if (selectedMenuItem === 'portfolio') {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-gradient-to-b from-primary to-primary/40 rounded-full" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Portfolio
            </span>
          </div>
          <SidebarPortfolioOverview onMobileClose={onMobileClose} />
        </div>
      );
    }

    // Integrations section - always show list of connected integrations
    if (selectedMenuItem === 'integrations') {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-gradient-to-b from-primary to-primary/40 rounded-full" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Integrations
            </span>
          </div>
          <SidebarIntegrationsList onMobileClose={onMobileClose} />
        </div>
      );
    }

    // Accounts section - show dynamic lists based on submenu
    if (selectedMenuItem === 'accounts') {
      // Check if we're on a specific account type page
      if (pathname.includes('/accounts/wallet')) {
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-gradient-to-b from-primary to-primary/40 rounded-full" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Crypto Wallets
              </span>
            </div>
            <SidebarWalletsList onMobileClose={onMobileClose} />
          </div>
        );
      }

      if (pathname.includes('/accounts/bank')) {
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-gradient-to-b from-primary to-primary/40 rounded-full" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Bank Accounts
              </span>
            </div>
            <SidebarBankAccountsList onMobileClose={onMobileClose} />
          </div>
        );
      }

      // Default: show enhanced submenu navigation
      if (selectedMenuData?.submenu) {
        return (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-gradient-to-b from-primary to-primary/40 rounded-full" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {selectedMenuData.label}
              </span>
            </div>
            <SidebarMenuContentEnhanced
              submenu={selectedMenuData.submenu}
              onMobileClose={onMobileClose}
              enableKeyboardNav={true}
            />
          </div>
        );
      }
    }

    // Other menu items - show enhanced submenu if available
    if (selectedMenuData?.submenu) {
      return (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-gradient-to-b from-primary to-primary/40 rounded-full" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {selectedMenuData.label}
            </span>
          </div>
          <SidebarMenuContentEnhanced
            submenu={selectedMenuData.submenu}
            onMobileClose={onMobileClose}
            enableKeyboardNav={true}
          />
        </div>
      );
    }

    // Fallback to quick actions
    return <SidebarQuickActions actions={actions} onActionClick={onActionClick} />;
  };

  return <div className="flex-1 overflow-y-auto overflow-x-hidden">{getContent()}</div>;
}
