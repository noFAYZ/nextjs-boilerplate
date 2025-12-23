"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { SolarCloseCircleBoldDuotone } from "../icons/icons";

// Root
const Modal = DialogPrimitive.Root;
const ModalTrigger = DialogPrimitive.Trigger;
const ModalPortal = DialogPrimitive.Portal;
const ModalClose = DialogPrimitive.Close;

// Overlay
const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-40 bg-black/50",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
      "duration-200",
      className
    )}
    {...props}
  />
));
ModalOverlay.displayName = "ModalOverlay";

// Content — full modal dialog
const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean;
    hiddenTitle?: string;
    size?: "sm" | "md" | "lg" | "xl" | "full";
  }
>(({ className, children, showCloseButton = true, hiddenTitle = "Modal", size = "lg", ...props }, ref) => {
  // Check if children contains a DialogTitle
  const hasDialogTitle = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === DialogPrimitive.Title
  );

  const sizeClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-2xl",
    xl: "sm:max-w-3xl",
    full: "sm:max-w-6xl",
  };

  return (
    <ModalPortal>
      <ModalOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[95vw] max-h-[95vh] -translate-x-1/2 -translate-y-1/2",
          "rounded-lg bg-background shadow-xl border border-border/40",
          "focus:outline-none",

          // Animation
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-2",
          "data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-top-2",
          "duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",

          sizeClasses[size],
          className
        )}
        {...props}
      >
        {!hasDialogTitle && (
          <DialogPrimitive.Title className="sr-only">{hiddenTitle}</DialogPrimitive.Title>
        )}
        {children}

        {showCloseButton && (
          <ModalClose className="absolute right-4 top-4 z-50 cursor-pointer rounded-full bg-background p-0.5 text-red-800/60 hover:text-red-800 transition-colors">
            <SolarCloseCircleBoldDuotone className="size-7" />
            <span className="sr-only">Close</span>
          </ModalClose>
        )}
      </DialogPrimitive.Content>
    </ModalPortal>
  );
});
ModalContent.displayName = "ModalContent";

// Header
const ModalHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center justify-between px-6 py-4 border-b border-border/40", className)} {...props} />
);
ModalHeader.displayName = "ModalHeader";

// Body
const ModalBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex-1 overflow-y-auto", className)} {...props} />
);
ModalBody.displayName = "ModalBody";

// Footer
const ModalFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end gap-3 px-6 py-4 border-t border-border/40", className)}
    {...props}
  />
);
ModalFooter.displayName = "ModalFooter";

// Title
const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
ModalTitle.displayName = "ModalTitle";

// Description
const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
ModalDescription.displayName = "ModalDescription";

export {
  Modal,
  ModalTrigger,
  ModalPortal,
  ModalClose,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
  ModalDescription,
};
