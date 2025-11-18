'use client';

import React, { ReactNode, useRef, useEffect, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { useDashboardLayoutStore } from '@/lib/stores/ui-stores';
import { cn } from '@/lib/utils';

interface DashboardWidgetContainerProps {
  id: string;
  children: ReactNode;
  isDraggable?: boolean;
  width?: number;
}

/**
 * DashboardWidgetContainer
 *
 * Makes widgets directly draggable and width-resizable
 * - No wrapper card - applies styles directly to children
 * - Drag handle on hover (edit mode)
 * - Width resize on right edge (edit mode)
 */
export function DashboardWidgetContainer({
  id,
  children,
  isDraggable = false,
  width,
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

  const { setWidgetSize } = useDashboardLayoutStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [currentWidth, setCurrentWidth] = useState(width);
  const widthRef = useRef(width);

  // Set both container ref and dnd ref
  const setNodeRef = (node: HTMLDivElement | null) => {
    containerRef.current = node;
    dndSetNodeRef(node);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
  };

  // Update ref when width changes
  useEffect(() => {
    widthRef.current = currentWidth;
  }, [currentWidth]);

  // Handle width resize
  useEffect(() => {
    if (!isDraggable || !resizeRef.current) return;

    const resizeElement = resizeRef.current;

    const startResize = (e: MouseEvent) => {
      if (!containerRef.current) return;
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);

      const startX = e.clientX;
      const startWidth = containerRef.current.offsetWidth;

      // Set cursor on body during resize
      document.body.style.cursor = 'nwse-resize';
      document.body.style.userSelect = 'none';

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const newWidth = Math.max(300, startWidth + (moveEvent.clientX - startX));
        setCurrentWidth(newWidth);
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        // Restore cursor
        document.body.style.cursor = 'auto';
        document.body.style.userSelect = 'auto';

        // Use ref to get the final width value
        if (widthRef.current) {
          setWidgetSize(id, widthRef.current);
        }
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    resizeElement.addEventListener('mousedown', startResize);
    return () => {
      resizeElement.removeEventListener('mousedown', startResize);
    };
  }, [isDraggable, id, setWidgetSize]);

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        width: currentWidth ? `${currentWidth}px` : 'auto',
      }}
      className={cn(
        'transition-all duration-75 relative group',
        isDragging && 'opacity-50 z-50',
        isOver && 'ring-2 ring-primary',
        isResizing && 'cursor-col-resize'
      )}
    >
      {/* Drag Handle Overlay (edit mode) - excludes bottom-right corner for resize */}
      {isDraggable && (
        <div
          {...attributes}
          {...listeners}
          className="absolute cursor-grab active:cursor-grabbing opacity-0 hover:opacity-100 transition-opacity pointer-events-auto flex items-center justify-center bg-black/5 rounded-t-lg z-10"
          style={{
            left: 0,
            top: 0,
            right: 20, // Exclude 20px from right for resize handle
            bottom: 20, // Exclude 20px from bottom for resize handle
          }}
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

      {/* Bottom-Right Corner Resize Handle (edit mode) */}
      {isDraggable && (
        <div
          ref={resizeRef}
          className={cn(
            'absolute cursor-nwse-resize z-50 select-none',
            'hover:opacity-100 active:opacity-100'
          )}
          title="Drag corner to resize"
          style={{
            bottom: 0,
            right: 0,
            width: 30,
            height: 30,
            touchAction: 'none',
            pointerEvents: 'auto',
            background: isResizing
              ? 'hsl(var(--primary) / 0.8)'
              : 'linear-gradient(135deg, transparent 60%, hsl(var(--primary) / 0.6) 60%)',
            opacity: isResizing ? 1 : 0.6,
            transition: 'all 150ms ease',
          }}
        />
      )}
    </div>
  );
}
