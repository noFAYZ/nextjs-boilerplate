'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TrendingUp, ArrowRight } from 'lucide-react';

interface SidebarPortfolioOverviewProps {
  onMobileClose?: () => void;
}

export function SidebarPortfolioOverview({ onMobileClose }: SidebarPortfolioOverviewProps) {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-muted/50 border border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Value</p>
            <p className="text-lg font-bold">$0.00</p>
          </div>
        </div>

        <Link href="/dashboard/portfolio" onClick={onMobileClose}>
          <Button variant="outline" size="sm" className="w-full gap-2">
            View Portfolio
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
