'use client';

import React, { ReactNode, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDashboardLayoutStore, WIDGET_SIZE_CONFIG } from '@/lib/stores/ui-stores';
import { DashboardWidgetContainer } from './dashboard-widget-container';
import { cn } from '@/lib/utils';

export interface DashboardWidget {
  id: string;
  component: ReactNode;
}

interface DashboardWidgetGridProps {
  widgets: DashboardWidget[];
}

/**
 * DashboardWidgetGrid
 *
 * A responsive, draggable dashboard widget grid with predefined sizes
 * - CSS Grid layout with responsive column spans (1-4 columns)
 * - Drag & drop reordering in edit mode
 * - Widgets have predefined sizes: small (1 col), medium (2 col), large (3 col), full (4 col)
 * - Layout persists to localStorage
 * - Responsive on mobile, tablet, and desktop
 */
export function DashboardWidgetGrid({ widgets }: DashboardWidgetGridProps) {
  const { widgets: layoutState, isEditMode, setWidgetOrder } = useDashboardLayoutStore();
  const [isDragging, setIsDragging] = useState(false);

  // Setup drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 10,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Get ordered and visible widgets
  const visibleWidgets = widgets.filter((w) => layoutState[w.id as keyof typeof layoutState]?.visible !== false);
  const orderedWidgets = [...visibleWidgets].sort((a, b) => {
    const orderA = layoutState[a.id as keyof typeof layoutState]?.order ?? 0;
    const orderB = layoutState[b.id as keyof typeof layoutState]?.order ?? 0;
    return orderA - orderB;
  });

  const widgetIds = orderedWidgets.map((w) => w.id);

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = widgetIds.indexOf(active.id as string);
      const newIndex = widgetIds.indexOf(over.id as string);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(orderedWidgets, oldIndex, newIndex);
        setWidgetOrder(
          newOrder.map((widget, index) => ({
            id: widget.id as any,
            visible: layoutState[widget.id as keyof typeof layoutState]?.visible ?? true,
            order: index,
            width: layoutState[widget.id as keyof typeof layoutState]?.width,
          }))
        );
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      disabled={!isEditMode}
    >
      <SortableContext items={widgetIds} strategy={verticalListSortingStrategy} disabled={!isEditMode}>
        <div
          className={cn(
            'grid auto-rows-max gap-4',
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
            isDragging && isEditMode && 'opacity-75'
          )}
        >
          {orderedWidgets.map((widget) => {
            const widgetLayout = layoutState[widget.id as keyof typeof layoutState];
            const size = widgetLayout?.size ?? 'medium';
            const colSpan = WIDGET_SIZE_CONFIG[size].cols;

            return (
              <div
                key={widget.id}
                className={cn(
                  'col-span-1',
                  // Responsive column spans
                  colSpan === 2 && 'sm:col-span-2 lg:col-span-2',
                  colSpan === 3 && 'sm:col-span-2 lg:col-span-3',
                  colSpan === 4 && 'sm:col-span-2 lg:col-span-4'
                )}
              >
                <DashboardWidgetContainer
                  id={widget.id}
                  isDraggable={isEditMode}
                >
                  {widget.component}
                </DashboardWidgetContainer>
              </div>
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
