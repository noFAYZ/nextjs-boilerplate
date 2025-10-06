'use client';

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AlertCircle, LucideIcon } from 'lucide-react';

export interface DataItem {
  id: string;
  name?: string;
  displayName?: string;
  type?: string;
  amount?: number;
  number?: string;
  description?: string;
  [key: string]: any;
}

export interface DataSelectionAccordionProps {
  value: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'cyan' | 'amber';
  totalCount: number;
  previewItems: DataItem[];
  isEnabled: boolean;
  selectedIds: string[];
  onToggleEnabled: (checked: boolean) => void;
  onToggleItem: (itemId: string) => void;
  onToggleAll: (allIds: string[]) => void;
  renderItemContent: (item: DataItem) => React.ReactNode;
}

const colorConfig = {
  blue: {
    gradient: 'from-blue-500 to-blue-600',
    bg: 'from-blue-50/50 dark:from-blue-950/20',
    badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    selected: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  },
  green: {
    gradient: 'from-green-500 to-green-600',
    bg: 'from-green-50/50 dark:from-green-950/20',
    badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    selected: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  },
  purple: {
    gradient: 'from-purple-500 to-purple-600',
    bg: 'from-purple-50/50 dark:from-purple-950/20',
    badge: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    selected: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  },
  orange: {
    gradient: 'from-orange-500 to-orange-600',
    bg: 'from-orange-50/50 dark:from-orange-950/20',
    badge: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    selected: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  },
  cyan: {
    gradient: 'from-cyan-500 to-cyan-600',
    bg: 'from-cyan-50/50 dark:from-cyan-950/20',
    badge: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
    selected: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
  },
  amber: {
    gradient: 'from-amber-500 to-amber-600',
    bg: 'from-amber-50/50 dark:from-amber-950/20',
    badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    selected: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  },
};

export function DataSelectionAccordion({
  value,
  title,
  description,
  icon: Icon,
  color,
  totalCount,
  previewItems,
  isEnabled,
  selectedIds,
  onToggleEnabled,
  onToggleItem,
  onToggleAll,
  renderItemContent,
}: DataSelectionAccordionProps) {
  const colors = colorConfig[color];
  const allPreviewIds = previewItems.map((item) => item.id);
  const isAllSelected = selectedIds.length === allPreviewIds.length && allPreviewIds.length > 0;

  return (
    <AccordionItem
      value={value}
      className={`border-2 rounded-xl mb-4 overflow-hidden bg-gradient-to-br ${colors.bg} to-transparent transition-all duration-200`}
    >
      <div className="flex items-center gap-4 px-5 py-4 bg-background/80 backdrop-blur-sm border-b">
        <Checkbox
          id={`sync-${value}`}
          checked={isEnabled}
          onCheckedChange={onToggleEnabled}
          className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          onClick={(e) => e.stopPropagation()}
        />
        <AccordionTrigger className="flex-1 hover:no-underline py-0 [&[data-state=open]>div>svg]:rotate-180">
          <div className="flex items-center gap-4 flex-1 w-full">
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg flex-shrink-0 ring-2 ring-background`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg tracking-tight">{title}</h3>
                <span className={`text-xs px-2.5 py-1 rounded-full ${colors.badge} font-semibold shadow-sm`}>
                  {totalCount}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
            {selectedIds.length > 0 && (
              <div className={`text-xs font-bold ${colors.selected} px-3 py-1.5 rounded-lg shadow-sm ring-1 ring-inset ring-current/10`}>
                {selectedIds.length} selected
              </div>
            )}
          </div>
        </AccordionTrigger>
      </div>

      <AccordionContent className="px-5 pb-5 pt-3">
        {isEnabled && previewItems.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 px-1">
              <p className="text-sm font-semibold text-muted-foreground">Select items to sync</p>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 text-xs font-medium shadow-sm"
                onClick={() => onToggleAll(allPreviewIds)}
              >
                {isAllSelected ? 'Deselect All' : 'Select All'}
              </Button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-2 -mr-2">
              {previewItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-4 rounded-xl bg-card hover:bg-accent/60 transition-all duration-200 border-2 border-border/50 hover:border-border shadow-sm hover:shadow group"
                >
                  <Checkbox
                    id={`${value}-${item.id}`}
                    checked={selectedIds.includes(item.id)}
                    onCheckedChange={() => onToggleItem(item.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor={`${value}-${item.id}`} className="flex-1 text-sm cursor-pointer">
                    {renderItemContent(item)}
                  </Label>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t-2 flex items-center justify-between px-1">
              <p className="text-xs text-muted-foreground font-medium">
                <span className="font-bold text-foreground text-sm">{selectedIds.length}</span> of {totalCount} items selected
              </p>
              {selectedIds.length === 0 && isEnabled && (
                <p className="text-xs text-amber-600 dark:text-amber-500 flex items-center gap-1.5 font-semibold">
                  <AlertCircle className="h-4 w-4" />
                  Select at least one
                </p>
              )}
            </div>
          </div>
        ) : isEnabled && previewItems.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">No items available</p>
          </div>
        ) : null}
      </AccordionContent>
    </AccordionItem>
  );
}
