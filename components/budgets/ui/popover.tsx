import React from 'react';

export function Popover({
  open,
  onOpenChange,
  trigger,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
}) {
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: rect.right - 100,
      });
    }
  }, [open]);

  return (
    <div className="relative" ref={triggerRef}>
      {trigger}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => onOpenChange(false)}
          />
          <div
            className="fixed z-50 bg-card border border-border/40 rounded-lg shadow-lg min-w-max"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
}
