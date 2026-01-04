"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LogOut,
  Settings,
  User,
  Crown,
  ChevronsUpDownIcon,
  LucideMenu,
  Menu,
  SquareMenu,
  MenuIcon,
  ChevronLeft,
  ChevronRight,
  Search,
  RefreshCcw,
  RefreshCwIcon,
  SidebarClose,
  SidebarOpen,
  Github,
  HelpCircle,
  Lightbulb,
  Command,
} from "lucide-react";
import {
  useQueryClient,
  useIsFetching,
  useIsMutating,
} from "@tanstack/react-query";
import { useToast } from "@/lib/hooks/useToast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  GameIconsUpgrade,
  LetsIconsSettingLineDuotone,
  StashBell,
} from "@/components/icons";
import { useAuthStore } from "@/lib/stores/auth-store";
import { authClient } from "@/lib/auth-client";
import { MenuItem } from "../types";
import Image from "next/image";
import { GlobalViewSwitcher } from "@/components/ui/global-view-switcher";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { createAvatar } from "@dicebear/core";
import { avataaarsNeutral } from "@dicebear/collection";
import { UserOrgSwitcher } from "@/components/organization/user-org-switcher";
import {
  ArcticonsCarsmile,
  GameIconsFairyWings,
  SimpleIconsWebmoney,
  SolarMenuDotsBoldDuotone,
  WalletLogoIconOpen,
} from "@/components/icons/icons";
import { SettingsDialog } from "@/components/settings/settings-dialog";
import { useCommandPalette } from "@/components/command/command-palette";
import { OrganizationSwitcher } from "@/components/organization";
import NotificationsPopover from "../widgets/notifications";
import { Card } from "@/components/ui/card";
import UpgradeBanner from "../widgets/upgrade-banner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface SidebarMainColumnProps {
  menuItems: MenuItem[];
  activeMenuItem: string | null;
  selectedMenuItem: string | null;
  onMenuItemClick: (itemId: string) => void;
  onToggleMainColumn?: () => void;
  mainColumnExpanded?: boolean;
}

export function SidebarMainColumn({
  menuItems,
  activeMenuItem,
  selectedMenuItem,
  onMenuItemClick,
  onToggleMainColumn,
  mainColumnExpanded = true,
}: SidebarMainColumnProps) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isLoading = isFetching > 0 || isMutating > 0;

  // PRODUCTION-GRADE: Use AuthStore instead of fetching profile
  const user = useAuthStore((state) => state.user);

  // Settings dialog state
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  const handleSignOut = React.useCallback(async () => {
    try {
      // Navigate to logout loading screen
      router.push("/auth/logout-loading");

      // Perform logout
      await authClient.signOut();

      // Navigate directly to login (no success screen)
      router.push("/auth/login");
    } catch (error) {
      console.error("Sign out failed:", error);
      // On error, redirect to login
      router.push("/auth/login");
    }
  }, [router]);

  const handleRefresh = React.useCallback(async () => {
    try {
      // Detect current page and refetch appropriate data
      if (pathname.includes("/subscriptions")) {
        await queryClient.refetchQueries({ queryKey: ["subscriptions"] });
      } else {
        // Generic refetch for other pages
        await queryClient.refetchQueries();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive",
      });
    }
  }, [pathname, queryClient, toast]);

  const avatar = createAvatar(avataaarsNeutral, {
    size: 128,
    seed: user.name,
    radius: 20,
  }).toDataUri();

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn(
          "flex h-full flex-col  bg-sidebar    inset-shadow-2xs    inset-shadow-white/20 text-shadow-2xs text-shadow-white/25 transition-all duration-75 space-y-2",
          mainColumnExpanded ? "w-74" : "w-16"
        )}
      >
        {/* Sidebar Header - Logo + Toggle */}
        <div
          className={cn(
            "relative flex h-14 md:h-16 items-center justify-between px-3 md:px-4",
            !mainColumnExpanded && "group" // activates hover behavior
          )}
        >
          {!mainColumnExpanded ? (
            <>
              {/* Logo — visible normally, but disabled when hovered */}
              <Link
                href="/"
                className="flex items-center gap-2  text-[40px] font-bold text-[hsl(24,100%,50%)]
                   transition-opacity duration-150 
                   group-hover:opacity-0 
                   group-hover:pointer-events-none" // <— prevents link click on hover
              >
                <WalletLogoIconOpen className="w-8 h-8" />
              </Link>

              {/* Toggle — only visible and clickable on hover  𒀭*/}
              <Button
                onClick={onToggleMainColumn}
                variant="ghost"
                size="icon"
                className="absolute left-3 opacity-0 group-hover:opacity-100 
                   transition-opacity duration-150 
                   pointer-events-none group-hover:pointer-events-auto cursor-pointer rounded-full " // <— clickable only on hover
              >
                <SidebarOpen className="h-5 w-5  " />
              </Button>
            </>
          ) : (
            <>
              {/* Expanded State — logo + label */}
              <Link href="/" className="flex items-center gap-2">
                <span className="text-[42px] font-bold text-[hsl(29.65,100%,50%)] group ">
                  <WalletLogoIconOpen className="w-8 h-8" />
                </span>

                {/* */}
                <div className="flex flex-col">
                  <span className="text-base font-bold"> MAPPR</span>
                  <span className="text-[10px] text-muted-foreground -mt-1.5 hidden sm:block">
                    Intelligence
                  </span>
                </div>
              </Link>

              {/* Toggle always visible in expanded mode */}
              <div className="flex items-center  gap-2">
                
              {/* Theme */}
              <ThemeSwitcher  />
                <NotificationsPopover />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={onToggleMainColumn}
                  className="ml-auto rounded-full"
                >
                  <SidebarClose className="h-5 w-5 " />
                </Button>
              </div>
            </>
          )}
        </div>

             {mainColumnExpanded ? (
            <div className="px-4">
              <OrganizationSwitcher />{" "}
            </div>
          ) : (
            <div className="px-2 mx-auto">
              <OrganizationSwitcher compact />{" "}
            </div>
          )}
        {/* Main Menu */}
        <div className="flex-1 py-2 md:py-3 overflow-visible space-y-4">
    
   

          <nav
            className={cn(
              "flex flex-col",
              mainColumnExpanded ? "space-y-0.5 px-3 " : "space-y-0.5 px-3 "
            )}
          >
            {/*    <ActionSearchBar onOpenCommandPalette={openCommandPalette} />*/}

            {menuItems.map((item) => {
              const Icon = item.icon;
              // Check if this item should be highlighted
              // Priority: selectedMenuItem (user click) > activeMenuItem (route-based)
              const isHighlighted =
                selectedMenuItem === item.id ||
                (!selectedMenuItem && activeMenuItem === item.id);

              const handleClick = (e: React.MouseEvent) => {
                if (item.href === "#") {
                  e.preventDefault();
                }
                onMenuItemClick(item.id);
              };

              const content = (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={"ghost"}
                      size="sm"
                      className={cn(
                        "w-full h-auto   overflow-visible",
                        mainColumnExpanded
                          ? "justify-start gap-2 md:gap-2 p-1  "
                          : "justify-center p-1    border-r border-border/50  ",
                        isHighlighted
                          ? "dark:bg-muted/60 bg-accent  hover:bg-muted/80 text-foreground/90"
                          : "text-muted-foreground hover:bg-accent/60 dark:hover:bg-muted/60 border-transparent "
                      )}
                      icon={
                        <Icon
                          className={cn(
                            " antialiased flex-shrink-0",
                            mainColumnExpanded
                              ? "h-4 xl:h-5.5 w-4 xl:w-5.5"
                              : "h-5.5  w-5.5  "
                          )}
                        />
                      }
                    >
                      {mainColumnExpanded && (
                        <span
                          className={cn(
                            "font-medium text-sm truncate",
                            isHighlighted
                              ? "text-foreground "
                              : "text-muted-foreground"
                          )}
                        >
                          {item.label}
                        </span>
                      )}

                      {/* Active indicator */}
                      {isHighlighted && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-muted-foreground rounded-r-full" />
                      )}

                      {/* Badge */}
                      {item.badge && (
                        <span className="absolute top-0.5 -right-6 flex h-4 w-fit px-1 items-center justify-center rounded-full bg-red-500 z-40 text-[9px] font-bold text-white border border-[#1a1a1a]">
                          {item.badge}
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    sideOffset={12}
                    className="bg-[#2a2a2a] text-white text-xs font-medium rounded-lg shadow-xl border border-white/10"
                  >
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );

              return item.href === "#" ? (
                <div key={item.id} onClick={handleClick}>
                  {content}
                </div>
              ) : (
                <Link key={item.id} href={item.href} onClick={handleClick}>
                  {content}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div
          className={cn(
            "pb-2 md:pb-3 space-y-6",
            mainColumnExpanded ? "px-2 md:px-2" : "px-1 md:px-1"
          )}
        >
          {/*  {mainColumnExpanded && (
          <div className="px-2">
            <div className="space-y-2 rounded-lg bg-gradient-to-br from-muted/90 via-muted/30 to-muted border border-border/80 p-2 shadow-sm">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="flex h-8 md:h-9 w-8 md:w-9 items-center justify-center rounded-lg md:rounded-xl bg-accent border border-border/80 shadow-sm flex-shrink-0">
                  <Crown className="h-4 md:h-5 w-4 md:w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-xs md:text-sm text-foreground">Upgrade to Pro</h3>
                  <p className="text-[10px] md:text-[11px] text-muted-foreground">Unlock advanced features</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-muted-foreground font-medium">14-day free trial</span>
                <Button
                  size="xs"
                  className=" h-6  md:text-[11px]  font-semibold"
                  onClick={() => router.push("/subscription")}
                >
                  Upgrade
                </Button>
              </div>
            </div>
          </div>
        )} */}

        

<div className={cn("mt-auto px-2 space-y-4", !mainColumnExpanded && "px-2")}>
  {/* Upgrade Banner */}
  <UpgradeBanner isExpanded={mainColumnExpanded} />

  {/* Footer Dock */}
  <div
    className={cn(
      "flex  bg-card  backdrop-blur-md shadow-sm transition-all border",
      mainColumnExpanded
        ? "items-center justify-between px-3 py-1 gap-3"
        : "flex-col items-center p-1 gap-2"
    )}
  >
    {/* Help */}
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setSettingsOpen(true)}
          className="rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted "
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Help</TooltipContent>
    </Tooltip>

    {/* Tips */}
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setSettingsOpen(true)}
          className="rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted "
        >
          <Lightbulb className="h-5 w-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Tips</TooltipContent>
    </Tooltip>
    {/* Settings */}
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setSettingsOpen(true)}
          className="rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted "
        >
          <Settings className="h-5 w-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Settings</TooltipContent>
    </Tooltip>
 
    {/* Divider */}
    <div
      className={cn(
        "bg-border",
        mainColumnExpanded ? "h-5 w-px mx-1" : "h-px w-full my-1"
      )}
    />
 {/* Menu Popover */}
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted "
            >
              <SolarMenuDotsBoldDuotone className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Menu</TooltipContent>
      </Tooltip>
      <PopoverContent side="right" className="w-48 p-2 rounded-xl bg-background shadow-lg">
        {/* Empty placeholder — can add menu items later */}
      </PopoverContent>
    </Popover>
  {/* User Avatar Menu */}
  <DropdownMenu>
    <Tooltip>
      <TooltipTrigger asChild>
        <DropdownMenuTrigger asChild>
          <Button
            variant={mainColumnExpanded ? "ghost" : "outline2"}
            size="icon-sm"
            className="rounded-full p-0"
          >
            <Avatar className="h-7 w-7">
              <AvatarImage src={avatar} alt={`${user?.name || "User"}'s avatar`} />
              <AvatarFallback className="text-xs md:text-sm bg-muted text-muted-foreground">
                {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
      </TooltipTrigger>
      {mainColumnExpanded && (
        <TooltipContent className="bg-[#2a2a2a] text-white text-xs font-medium rounded-lg shadow-xl border border-white/10">
          {user?.name || "Profile"}
        </TooltipContent>
      )}
    </Tooltip>
    <DropdownMenuContent
      align="start"
      side="right"
      className="w-56 bg-[#2a2a2a] border-white/10 text-white rounded-xl shadow-lg"
    >
      <div className="px-3 py-2 border-b border-white/10">
        <p className="text-sm font-medium">{user?.name}</p>
        <p className="text-xs text-white/60 truncate">{user?.email}</p>
      </div>

      <DropdownMenuItem asChild className="text-white/80 focus:text-white focus:bg-white/10">
        <Link href="/profile" className="flex items-center gap-3">
          <User className="h-4 w-4" />
          Profile
        </Link>
      </DropdownMenuItem>

      <DropdownMenuItem asChild className="text-white/80 focus:text-white focus:bg-white/10">
        <Link href="/subscription" className="flex items-center gap-3">
          <Crown className="h-4 w-4" />
          Subscription
        </Link>
      </DropdownMenuItem>

      <DropdownMenuSeparator className="bg-white/10" />

      <DropdownMenuItem
        className="flex items-center gap-3 text-red-400 focus:text-red-400 focus:bg-white/10 cursor-pointer"
        onClick={handleSignOut}
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  

   
  </div>


</div>

 
        </div>
      </div>

      {/* Settings Dialog */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </TooltipProvider>
  );
}
