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
import { useDashboardLayoutStore } from '@/lib/stores/ui-stores';
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
 * A responsive, draggable and resizable dashboard widget grid
 * - Direct widget drag & drop (no wrapper encapsulation)
 * - Widgets are resizable with handles
 * - Layout persists to localStorage
 * - Edit mode for drag/drop and resize
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
            'flex flex-wrap gap-4 ',
            isDragging && isEditMode && 'opacity-75'
          )}
        >
          {orderedWidgets.map((widget) => {
            const widgetLayout = layoutState[widget.id as keyof typeof layoutState];
            return (
              <DashboardWidgetContainer
                key={widget.id}
                id={widget.id}
                isDraggable={isEditMode}
                width={widgetLayout?.width}
              >
                {widget.component}
              </DashboardWidgetContainer>
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
