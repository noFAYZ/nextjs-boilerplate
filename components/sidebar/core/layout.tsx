"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";
import { MainHeader } from "./main-header";
import { useSidebar } from "@/lib/hooks/use-sidebar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

interface SidebarLayoutProps {
  children: React.ReactNode;
  className?: string;
  sidebarClassName?: string;
  defaultSidebarExpanded?: boolean;
  showHeader?: boolean;
}

export function SidebarLayout({
  children,
  className,
  sidebarClassName,
  defaultSidebarExpanded = true,
  showHeader = true,
}: SidebarLayoutProps) {
  const {
    mainColumnExpanded,
    toggleMainColumn,
    selectedMenuItem,
    activeMenuItem,
    selectMenuItem,
  } = useSidebar({ defaultExpanded: defaultSidebarExpanded });

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleMenuItemClick = React.useCallback(
    (itemId: string | null) => {
      selectMenuItem(itemId);
      setMobileMenuOpen(false);
    },
    [selectMenuItem]
  );

  return (
    <div className={cn("flex h-screen w-full bg-sidebar", className)}>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col">
        <Sidebar
          className={sidebarClassName}
          defaultExpanded={defaultSidebarExpanded}
          mainColumnExpanded={mainColumnExpanded}
          onToggleMainColumn={toggleMainColumn}
          selectedMenuItem={selectedMenuItem}
          activeMenuItem={activeMenuItem}
          onMenuItemClick={selectMenuItem}
        />
      </aside>

      {/* Mobile Sidebar via Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild />
        <SheetContent side="left" className="w-72 p-0 border-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

          <Sidebar
            className={sidebarClassName}
            defaultExpanded={true}
            mainColumnExpanded={true}
            onToggleMainColumn={() => {}}
            selectedMenuItem={selectedMenuItem}
            activeMenuItem={activeMenuItem}
            onMenuItemClick={handleMenuItemClick}
          />
        </SheetContent>
      </Sheet>

      {/* Main Area */}
      <main className="flex flex-1 flex-col overflow-y-auto ">
{/*   {showHeader && (
    <div className="w-full">
      <MainHeader
        mainColumnExpanded={mainColumnExpanded}
        onToggleMainColumn={toggleMainColumn}
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        isMobileMenuOpen={mobileMenuOpen}
        
      />
    </div>
  )} */}

<div className="flex-1 shadow-xl mt-3 bg-background rounded-tl-3xl border-border border">
{showHeader && (
    <div className="w-full">
      <MainHeader
        mainColumnExpanded={mainColumnExpanded}
        onToggleMainColumn={toggleMainColumn}
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        isMobileMenuOpen={mobileMenuOpen}
        
      />
    </div>
  )}

          <div className=" container mx-auto p-3 md:p-6">{children}</div>
        </div>
</main>


    </div>
  );
}
