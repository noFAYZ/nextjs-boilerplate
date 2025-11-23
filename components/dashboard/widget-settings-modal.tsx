'use client';

import React, { useState } from 'react';
import { Settings2, X } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
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

interface WidgetSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * WidgetSettingsModal
 *
 * Popup to enable/disable widgets on the dashboard
 * - Widget cards in 2-column grid per category
 * - Toggle switches for visibility
 * - All/None buttons for quick selection per category
 */
export function WidgetSettingsModal({ isOpen, onClose }: WidgetSettingsModalProps) {
  const [expandedWidget, setExpandedWidget] = useState<WidgetId | null>(null);

  // Use specific selector to ensure proper re-renders
  const widgets = useDashboardLayoutStore((state) => {
    // Return a new reference when widgets change to ensure re-render
    return state.widgets;
  });

  const setWidgetVisible = useDashboardLayoutStore((state) => state.setWidgetVisible);
  const setWidgetSize = useDashboardLayoutStore((state) => state.setWidgetSize);
  const resetLayout = useDashboardLayoutStore((state) => state.resetLayout);

  const categories = Array.from(new Set(WIDGET_OPTIONS.map((w) => w.category)));

  const getCategoryWidgets = (category: string) => {
    return WIDGET_OPTIONS.filter((w) => w.category === category);
  };

  const getCategoryVisibleCount = (category: string) => {
    const categoryWidgets = getCategoryWidgets(category);
    return categoryWidgets.filter(
      (w) => widgets[w.id]?.visible !== false
    ).length;
  };

  const toggleCategoryAll = (category: string, visible: boolean) => {
    getCategoryWidgets(category).forEach((w) => {
      setWidgetVisible(w.id, visible);
    });
  };

  const handleWidgetToggle = (id: WidgetId) => {
    // Get current state - default to true (visible) if not set
    const currentState = widgets[id];
    const currentVisibility = currentState?.visible !== false;

    // Toggle the visibility
    setWidgetVisible(id, !currentVisibility);

    // Close expansion when toggling visibility
    if (expandedWidget === id) {
      setExpandedWidget(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5" />
            <DialogTitle>Dashboard Widgets</DialogTitle>
          </div>
          <DialogDescription>
            Enable or disable widgets to customize your dashboard view
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="space-y-6">
          {categories.map((category) => {
            const categoryWidgets = getCategoryWidgets(category);
            const visibleCount = getCategoryVisibleCount(category);
            const allVisible = visibleCount === categoryWidgets.length;

            return (
              <div key={category} className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{category}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {visibleCount}/{categoryWidgets.length}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleCategoryAll(category, true)}
                      className="h-7 px-2 text-xs"
                    >
                      All
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleCategoryAll(category, false)}
                      className="h-7 px-2 text-xs"
                    >
                      None
                    </Button>
                  </div>
                </div>

                {/* Category Widgets as Cards */}
                <div className="space-y-2">
                  {categoryWidgets.map((widget) => {
                    const isVisible = widgets[widget.id]?.visible !== false;
                    const currentSize = widgets[widget.id]?.size ?? 'medium';
                    const isExpanded = expandedWidget === widget.id;

                    return (
                      <div key={widget.id} className="space-y-2">
                        <div
                          className={cn(
                            'relative overflow-hidden rounded-lg border transition-all cursor-pointer group',
                            isVisible
                              ? 'bg-primary/5 border-primary/30 hover:border-primary/50 hover:bg-primary/10'
                              : 'bg-muted/30 border-muted/50 hover:bg-muted/40'
                          )}
                          onClick={() => setExpandedWidget(isExpanded ? null : widget.id)}
                        >
                          {/* Card Background Effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                          {/* Card Content */}
                          <div className="relative p-4 flex items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate text-foreground">
                                {widget.label}
                              </p>
                              {isVisible && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Size: {WIDGET_SIZE_CONFIG[currentSize].label}
                                </p>
                              )}
                            </div>
                            <div className="flex-shrink-0 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <Switch
                                checked={isVisible}
                                onCheckedChange={() => {
                                  handleWidgetToggle(widget.id);
                                }}
                                className="data-[state=checked]:bg-primary"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Size Selection (Expanded) */}
                        {isExpanded && (
                          <div className="ml-4 p-3 bg-muted/30 rounded-lg border border-border/50 space-y-2">
                            <p className="text-xs font-medium text-foreground mb-2">Widget Size</p>
                            <div className="grid grid-cols-2 gap-2">
                              {(Object.entries(WIDGET_SIZE_CONFIG) as [WidgetSize, typeof WIDGET_SIZE_CONFIG[WidgetSize]][]).map(([size, config]) => (
                                <button
                                  key={size}
                                  onClick={() => {
                                    setWidgetSize(widget.id, size);
                                    setExpandedWidget(null);
                                  }}
                                  disabled={!isVisible}
                                  className={cn(
                                    'p-2.5 rounded-lg border transition-all text-left',
                                    !isVisible && 'opacity-50 cursor-not-allowed',
                                    currentSize === size
                                      ? 'bg-primary/15 border-primary/50 ring-1 ring-primary/30'
                                      : 'border-border/50 hover:border-border hover:bg-muted/50'
                                  )}
                                >
                                  <p className="text-xs font-medium text-foreground">{config.label}</p>
                                  <p className="text-[10px] text-muted-foreground">{config.description}</p>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {category !== categories[categories.length - 1] && <Separator className="mt-4" />}
              </div>
            );
          })}
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetLayout();
              onClose();
            }}
          >
            Reset to Default
          </Button>
          <Button
            size="sm"
            onClick={onClose}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
