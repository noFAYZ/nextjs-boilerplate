"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SolarCloseCircleBoldDuotone } from "../icons/icons";

// Root Dialog Component
const Dialog = React.memo(
  DialogPrimitive.Root as React.FC<React.ComponentProps<typeof DialogPrimitive.Root>>
);

// Dialog Trigger
const DialogTrigger = React.memo(
  DialogPrimitive.Trigger as React.FC<React.ComponentProps<typeof DialogPrimitive.Trigger>>
);

// Dialog Portal
const DialogPortal = React.memo(
  DialogPrimitive.Portal as React.FC<React.ComponentProps<typeof DialogPrimitive.Portal>>
);

// Dialog Close
const DialogClose = React.memo(
  DialogPrimitive.Close as React.FC<React.ComponentProps<typeof DialogPrimitive.Close>>
);

// Dialog Overlay
const DialogOverlay = React.memo(
  React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<typeof DialogPrimitive.Overlay>
  >(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-black/50 transition-opacity duration-100 ease-out",
        "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
        className
      )}
      {...props}
    />
  ))
);
DialogOverlay.displayName = "DialogOverlay";

// Dialog Content
const DialogContent = React.memo(
  React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<typeof DialogPrimitive.Content> & {
      showCloseButton?: boolean;
    }
  >(({ className, children, showCloseButton = true, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed top-1/2 left-1/2 z-50 w-full max-w-[calc(100%-2rem)] sm:max-w-lg",
          "translate-x-[-50%] translate-y-[-50%] rounded-lg border bg-background p-6 shadow-lg",
          "transition-all duration-100 ease-out will-change-transform",
          "data-[state=open]:opacity-100 data-[state=open]:scale-100",
          "data-[state=closed]:opacity-0 data-[state=closed]:scale-95",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogClose
            className={cn(
              "absolute top-2 right-2 rounded-sm opacity-90 bg-background transition-opacity",
              "hover:opacity-100   rounded-full",
              "disabled:pointer-events-none cursor-pointer"
            )}
          >
            <SolarCloseCircleBoldDuotone className="size-6 hover:text-red-600/70 text-red-600/50" />
            <span className="sr-only">Close</span>
          </DialogClose>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  ))
);
DialogContent.displayName = "DialogContent";

// Dialog Header
const DialogHeader = React.memo(
  ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
      className={cn("flex flex-col gap-1 text-center sm:text-left mb-4", className)}
      {...props}
    />
  )
);
DialogHeader.displayName = "DialogHeader";

// Dialog Footer
const DialogFooter = React.memo(
  ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
);
DialogFooter.displayName = "DialogFooter";

// Dialog Title
const DialogTitle = React.memo(
  React.forwardRef<
    HTMLHeadingElement,
    React.ComponentProps<typeof DialogPrimitive.Title>
  >(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
      ref={ref}
      className={cn("text-lg font-semibold leading-none", className)}
      {...props}
    />
  ))
);
DialogTitle.displayName = "DialogTitle";

// Dialog Description
const DialogDescription = React.memo(
  React.forwardRef<
    HTMLParagraphElement,
    React.ComponentProps<typeof DialogPrimitive.Description>
  >(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
      ref={ref}
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  ))
);
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};