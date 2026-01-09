'use client';

import React, { useState } from 'react';
import { Settings2, X, Maximize, Maximize2, Square, Minimize } from 'lucide-react';
import { useDashboardLayoutStore, dashboardLayoutSelectors, WidgetId, WidgetSize, WIDGET_SIZE_CONFIG } from '@/lib/stores/ui-stores';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface WidgetOption {
  id: WidgetId;
  label: string;
  category: 'Financial' | 'Crypto' | 'Subscriptions' | 'Goals';
}

const WIDGET_OPTIONS: WidgetOption[] = [
  {
    id: 'net-worth',
    label: 'Net Worth',
    category: 'Financial',
  },
  {
    id: 'accounts',
    label: 'Account Categories',
    category: 'Financial',
  },
  {
    id: 'networth-performance',
    label: 'Net Worth Performance',
    category: 'Financial',
  },
  {
    id: 'monthly-spending',
    label: 'Monthly Spending Trend',
    category: 'Financial',
  },
  {
    id: 'spending-categories',
    label: 'Top Spending Categories',
    category: 'Financial',
  },
  {
    id: 'crypto-allocation',
    label: 'Crypto Allocation',
    category: 'Crypto',
  },
  {
    id: 'network-distribution',
    label: 'Network Distribution',
    category: 'Crypto',
  },
  {
    id: 'account-comparison',
    label: 'Account Comparison',
    category: 'Financial',
  },
  {
    id: 'subscriptions',
    label: 'Subscriptions Overview',
    category: 'Subscriptions',
  },
  {
    id: 'calendar-subscriptions',
    label: 'Subscription Calendar',
    category: 'Subscriptions',
  },
  {
    id: 'upcoming-bills',
    label: 'Upcoming Bills',
    category: 'Financial',
  },
  {
    id: 'recent-activity',
    label: 'Recent Activity',
    category: 'Financial',
  },
  {
    id: 'goals',
    label: 'Goals Overview',
    category: 'Goals',
  },
  {
    id: 'budgets',
    label: 'Budgets Overview',
    category: 'Financial',
  },
];

const SIZE_ICONS: Record<WidgetSize, React.ReactNode> = {
  small: <Square className="h-4 w-4" />,
  medium: <Maximize className="h-4 w-4" />,
  large: <Maximize2 className="h-4 w-4" />,
  full: <Minimize className="h-4 w-4" />,
};

interface WidgetSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WidgetSettingsModal({ isOpen, onClose }: WidgetSettingsModalProps) {
  const [expandedWidget, setExpandedWidget] = useState<WidgetId | null>(null);

  const widgets = useDashboardLayoutStore((state) => state.widgets);
  const setWidgetVisible = useDashboardLayoutStore((state) => state.setWidgetVisible);
  const setWidgetSize = useDashboardLayoutStore((state) => state.setWidgetSize);
  const resetLayout = useDashboardLayoutStore((state) => state.resetLayout);

  const categories = Array.from(new Set(WIDGET_OPTIONS.map((w) => w.category)));

  const getCategoryWidgets = (category: string) => {
    return WIDGET_OPTIONS.filter((w) => w.category === category);
  };

  const getCategoryVisibleCount = (category: string) => {
    const categoryWidgets = getCategoryWidgets(category);
    return categoryWidgets.filter((w) => widgets[w.id]?.visible !== false).length;
  };

  const toggleCategoryAll = (category: string, visible: boolean) => {
    getCategoryWidgets(category).forEach((w) => {
      setWidgetVisible(w.id, visible);
    });
  };

  const handleWidgetToggle = (id: WidgetId) => {
    const currentVisibility = widgets[id]?.visible !== false;
    setWidgetVisible(id, !currentVisibility);
    if (expandedWidget === id) {
      setExpandedWidget(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-5">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Settings2 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <DialogTitle>Dashboard Widgets</DialogTitle>
              <DialogDescription className="text-xs mt-1">
                Customize which widgets appear on your dashboard
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5">
          {categories.map((category) => {
            const categoryWidgets = getCategoryWidgets(category);
            const visibleCount = getCategoryVisibleCount(category);

            return (
              <div key={category} className="space-y-3">
                {/* Category Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{category}</h3>
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      {visibleCount}/{categoryWidgets.length}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => toggleCategoryAll(category, true)}
                      className="h-7 text-xs"
                    >
                      All
                    </Button>
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => toggleCategoryAll(category, false)}
                      className="h-7 text-xs"
                    >
                      None
                    </Button>
                  </div>
                </div>

                {/* Widgets List */}
                <div className="space-y-2">
                  {categoryWidgets.map((widget) => {
                    const isVisible = widgets[widget.id]?.visible !== false;
                    const currentSize = widgets[widget.id]?.size ?? 'medium';
                    const isExpanded = expandedWidget === widget.id;

                    return (
                      <div key={widget.id} className="space-y-2">
                        <div
                          className={cn(
                            'flex items-center justify-between p-3 rounded-lg transition-all cursor-pointer group',
                            isVisible
                              ? 'bg-primary/5 hover:bg-primary/8'
                              : 'bg-muted/40 hover:bg-muted/50'
                          )}
                          onClick={() => setExpandedWidget(isExpanded ? null : widget.id)}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{widget.label}</p>
                            {isVisible && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {WIDGET_SIZE_CONFIG[currentSize].label}
                              </p>
                            )}
                          </div>
                          <div
                            className="flex-shrink-0 flex items-center gap-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Switch
                              checked={isVisible}
                              onCheckedChange={() => handleWidgetToggle(widget.id)}
                              className="data-[state=checked]:bg-primary"
                            />
                          </div>
                        </div>

                        {/* Size Selection */}
                        {isExpanded && isVisible && (
                          <div className="ml-3 p-3 bg-muted/30 rounded-lg space-y-2">
                            <p className="text-xs font-medium text-foreground">Size</p>
                            <div className="grid grid-cols-4 gap-2">
                              {(Object.entries(WIDGET_SIZE_CONFIG) as [
                                WidgetSize,
                                (typeof WIDGET_SIZE_CONFIG)[WidgetSize]
                              ][]).map(([size, config]) => (
                                <button
                                  key={size}
                                  onClick={() => {
                                    setWidgetSize(widget.id, size);
                                    setExpandedWidget(null);
                                  }}
                                  className={cn(
                                    'flex flex-col items-center gap-1.5 p-2.5 rounded-md transition-all',
                                    currentSize === size
                                      ? 'bg-primary/20'
                                      : 'bg-background hover:bg-muted/50'
                                  )}
                                  title={config.description}
                                >
                                  <div className="text-muted-foreground group-hover:text-foreground">
                                    {SIZE_ICONS[size]}
                                  </div>
                                  <span className="text-[10px] font-medium text-foreground">
                                    {config.label}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetLayout();
              onClose();
            }}
            className="text-xs"
          >
            Reset to Default
          </Button>
          <Button size="sm" onClick={onClose} className="gap-2">
            <X className="w-4 h-4" />
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
