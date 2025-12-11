'use client';

/**
 * Budgets V3 Tab Navigation
 * Displays tabs for different budgeting views
 */

import { useBudgetsV3UIStore, type BudgetsV3Tab } from '@/lib/stores/budgets-v3-ui-store';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  LineChart,
  DollarSign,
  Calculator,
} from 'lucide-react';

interface TabDefinition {
  id: BudgetsV3Tab;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const TABS: TabDefinition[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <LayoutDashboard className="h-4 w-4" />,
    description: 'Dashboard summary and key metrics',
  },
  {
    id: 'income-allocation',
    label: 'Income Allocation',
    icon: <DollarSign className="h-4 w-4" />,
    description: 'AI-powered income distribution',
  },
  {
    id: 'envelopes',
    label: 'Envelopes',
    icon: <Calculator className="h-4 w-4" />,
    description: 'Envelope-based budgeting system',
  },
  {
    id: 'traditional',
    label: 'Traditional',
    icon: <TrendingUp className="h-4 w-4" />,
    description: 'Traditional budget management',
  },
  {
    id: 'forecasting',
    label: 'Forecasting',
    icon: <LineChart className="h-4 w-4" />,
    description: 'Spending predictions and insights',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart3 className="h-4 w-4" />,
    description: 'Detailed financial analysis',
  },
];

export function BudgetsV3TabNavigation() {
  const { activeTab, setActiveTab } = useBudgetsV3UIStore();

  return (
    <div className="border-b border-border">
      <div className="flex space-x-1 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative cursor-pointer',
              activeTab === tab.id
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
            title={tab.description}
          >
            {tab.icon}
            <span>{tab.label}</span>

            {/* Active indicator */}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
