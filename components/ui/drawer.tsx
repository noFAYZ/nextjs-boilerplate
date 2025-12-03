"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@/lib/utils";

/**
 * Root
 */
function Drawer(props: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return (
    <DrawerPrimitive.Root
      data-slot="drawer"
      aria-modal="true"
      {...props}
    />
  );
}

/**
 * Trigger
 */
function DrawerTrigger(
  props: React.ComponentProps<typeof DrawerPrimitive.Trigger>
) {
  return (
    <DrawerPrimitive.Trigger
      data-slot="drawer-trigger"
      {...props}
    />
  );
}

/**
 * Portal
 */
function DrawerPortal(
  props: React.ComponentProps<typeof DrawerPrimitive.Portal>
) {
  return (
    <DrawerPrimitive.Portal
      data-slot="drawer-portal"
      {...props}
    />
  );
}

/**
 * Close Button
 */
function DrawerClose(
  props: React.ComponentProps<typeof DrawerPrimitive.Close>
) {
  return (
    <DrawerPrimitive.Close
      data-slot="drawer-close"
      {...props}
    />
  );
}

/**
 * Overlay (with improved animations and transitions)
 */
function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50",
        "data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out transition-transform duration-75",
        className
      )}
      {...props}
    />
  );
}

/**
 * Content
 * Includes full directional support and improved responsiveness.
 */
function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        role="dialog"
        aria-modal="true"
        className={cn(
          "group/drawer-content fixed z-50 flex flex-col bg-background sm:rounded-lg",
          "transition-transform duration-75 ease-out",
          // Top drawer
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:max-h-[85vh] data-[vaul-drawer-direction=top]:border-b",
          // Bottom drawer
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:max-h-[85vh] data-[vaul-drawer-direction=bottom]:border-t",
          // Right drawer
          "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-[85%] data-[vaul-drawer-direction=right]:sm:max-w-sm data-[vaul-drawer-direction=right]:border-l",
          // Left drawer
          "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-[85%] data-[vaul-drawer-direction=left]:sm:max-w-sm data-[vaul-drawer-direction=left]:border-r",
          className
        )}
        {...props}
      >
        {/* Handle for bottom drawers */}
        <div className="mx-auto mt-3 hidden h-1.5 w-[100px] shrink-0 rounded-full bg-muted group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

/**
 * Header
 */
function DrawerHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "p-4 flex flex-col gap-1",
        "group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center",
        "group-data-[vaul-drawer-direction=top]/drawer-content:text-center",
        "md:text-left",
        className
      )}
      {...props}
    />
  );
}

/**
 * Footer
 */
function DrawerFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto p-4 flex flex-col gap-3", className)}
      {...props}
    />
  );
}

/**
 * Title
 */
function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("font-semibold text-lg text-foreground", className)}
      {...props}
    />
  );
}

/**
 * Description
 */
function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
