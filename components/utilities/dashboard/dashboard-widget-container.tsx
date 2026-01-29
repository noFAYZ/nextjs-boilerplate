'use client';

import React, { ReactNode, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardWidgetContainerProps {
  id: string;
  children: ReactNode;
  isDraggable?: boolean;
}

/**
 * DashboardWidgetContainer
 *
 * Makes widgets directly draggable with predefined sizes
 * - No wrapper card - applies styles directly to children
 * - Drag handle on hover (edit mode)
 * - Drag & drop reordering enabled in edit mode
 * - Sizes controlled via dashboard layout store (small, medium, large, full)
 */
export function DashboardWidgetContainer({
  id,
  children,
  isDraggable = false,
}: DashboardWidgetContainerProps) {
  const {
    attributes,
    listeners,
    setNodeRef: dndSetNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id });

  const containerRef = useRef<HTMLDivElement>(null);

  // Set both container ref and dnd ref
  const setNodeRef = (node: HTMLDivElement | null) => {
    containerRef.current = node;
    dndSetNodeRef(node);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'transition-all duration-75 relative group',
        isDragging && 'opacity-50 z-50',
        isOver && 'ring-2 ring-primary'
      )}
    >
      {/* Drag Handle Overlay (edit mode) */}
      {isDraggable && (
        <div
          {...attributes}
          {...listeners}
          className="absolute cursor-grab active:cursor-grabbing opacity-0 hover:opacity-100 transition-opacity pointer-events-auto flex items-center justify-center bg-black/5 rounded-t-lg z-10 inset-0"
          title="Drag to reorder"
        >
          <div className="flex items-center gap-2 bg-black/80 px-3 py-1.5 rounded-md text-white">
            <GripVertical className="w-4 h-4" />
            <span className="text-xs font-medium">Drag to move</span>
          </div>
        </div>
      )}

      {/* Widget Content */}
      <div className={isDraggable ? 'pointer-events-none' : ''}>
        {children}
      </div>
    </div>
  );
}
