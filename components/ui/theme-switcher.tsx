"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { useViewMode } from "@/lib/contexts/view-mode-context";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isProMode } = useViewMode();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (isProMode) {
      // In pro mode, cycle between light-pro and dark-pro
      const currentIsDark = theme === "dark-pro" || theme === "dark";
      setTheme(currentIsDark ? "light-pro" : "dark-pro");
    } else {
      // In beginner mode, cycle between light and dark
      const currentIsDark = theme === "dark" || theme === "dark-pro";
      setTheme(currentIsDark ? "light" : "dark");
    }
  };

  // Show a neutral state during SSR/initial load
  if (!mounted) {
    return (
      <Button
        disabled
        className={cn(
          "shadow-md rounded-full",
          "border border-divider",
          "group relative",
        )}
        size="sm"
        variant="ghost"
      >
        <Sun className="w-4 h-4 text-default-500" />
      </Button>
    );
  }

  const isDark = theme === "dark" || theme === "dark-pro";

  return (
    <Button
      className={cn(
        "relative shadow-none rounded-full w-10 h-10",
        "border border-foreground/10 justify-center",
  
        "group",
      )}
      size="icon"
      variant="outline"
      onClick={toggleTheme}
    >
      {/* Sun */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center z-20",
          "transition-all duration-100 ease-in-out",
          isDark ? "scale-0 opacity-0 translate-y-5" : "scale-100 opacity-100 translate-y-0"
        )}
      >
        <Sun
          className={cn(
            "w-5 h-5",
            "text-orange-500",
            "transition-transform duration-200",
            "group-hover:rotate-90"
          )}
        />
        <div
          className={cn(
            "absolute inset-0 rounded-3xl bg-orange-500",
            "animate-pulse opacity-10"
          )}
        />
      </div>

      {/* Moon & Stars */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center",
          "transition-all duration-100 ease-in-out",
          isDark ? "scale-100 opacity-100 translate-y-0" : "scale-0 opacity-0 -translate-y-5"
        )}
      >
        <Moon
          className={cn(
            "w-5 h-5",
            "text-white/60",
            "transition-transform duration-200",
            "group-hover:rotate-90"
          )}
        />
      </div>
    </Button>
  );
}