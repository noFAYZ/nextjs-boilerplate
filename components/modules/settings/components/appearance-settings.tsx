"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Palette, Moon, Sun, Monitor, Eye, Maximize, Type } from "lucide-react";
import { useTheme } from "next-themes";
import { useViewMode } from "@/lib/contexts/view-mode-context";
import type { UserPreferences } from "@/lib/types/settings";
import { Badge } from "@/components/ui/badge";

interface AppearanceSettingsProps {
  preferences: UserPreferences;
  updatePreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
}

export function AppearanceSettings({ preferences, updatePreference }: AppearanceSettingsProps) {
  const { theme, setTheme } = useTheme();
  const { viewMode, setViewMode } = useViewMode();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme
          </CardTitle>
          <CardDescription>
            Choose how MoneyMappr looks on your device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => {
                setTheme("light");
                updatePreference("theme", "light");
              }}
              className={`
                relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
                ${theme === "light" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
              `}
            >
              <Sun className="h-8 w-8" />
              <span className="text-sm font-medium">Light</span>
              {theme === "light" && (
                <Badge className="absolute -top-2 -right-2" variant="default">
                  Active
                </Badge>
              )}
            </button>

            <button
              onClick={() => {
                setTheme("dark");
                updatePreference("theme", "dark");
              }}
              className={`
                relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
                ${theme === "dark" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
              `}
            >
              <Moon className="h-8 w-8" />
              <span className="text-sm font-medium">Dark</span>
              {theme === "dark" && (
                <Badge className="absolute -top-2 -right-2" variant="default">
                  Active
                </Badge>
              )}
            </button>

            <button
              onClick={() => {
                setTheme("system");
                updatePreference("theme", "system");
              }}
              className={`
                relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
                ${theme === "system" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
              `}
            >
              <Monitor className="h-8 w-8" />
              <span className="text-sm font-medium">System</span>
              {theme === "system" && (
                <Badge className="absolute -top-2 -right-2" variant="default">
                  Active
                </Badge>
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            View Mode
          </CardTitle>
          <CardDescription>
            Switch between beginner-friendly and advanced professional views
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                setViewMode("beginner");
                updatePreference("viewMode", "beginner");
              }}
              className={`
                relative flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition-all
                ${viewMode === "beginner" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
              `}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-semibold">Beginner Mode</span>
                {viewMode === "beginner" && <Badge variant="default">Active</Badge>}
              </div>
              <p className="text-xs text-muted-foreground text-left">
                Simplified cards view with essential information only
              </p>
            </button>

            <button
              onClick={() => {
                setViewMode("pro");
                updatePreference("viewMode", "pro");
              }}
              className={`
                relative flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition-all
                ${viewMode === "pro" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
              `}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-semibold">Pro Mode</span>
                {viewMode === "pro" && <Badge variant="default">Active</Badge>}
              </div>
              <p className="text-xs text-muted-foreground text-left">
                Advanced tables with detailed analytics and charts
              </p>
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Maximize className="h-5 w-5" />
            Display Options
          </CardTitle>
          <CardDescription>
            Customize how information is displayed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compactMode">Compact Mode</Label>
              <p className="text-sm text-muted-foreground">
                Show more content with reduced spacing
              </p>
            </div>
            <Switch
              id="compactMode"
              checked={preferences.compactMode}
              onCheckedChange={(checked) => updatePreference("compactMode", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="showWidgets">Show Widgets</Label>
              <p className="text-sm text-muted-foreground">
                Display dashboard widgets and quick actions
              </p>
            </div>
            <Switch
              id="showWidgets"
              checked={preferences.showWidgets}
              onCheckedChange={(checked) => updatePreference("showWidgets", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="hideBalances">Hide Balances</Label>
              <p className="text-sm text-muted-foreground">
                Blur sensitive financial amounts for privacy
              </p>
            </div>
            <Switch
              id="hideBalances"
              checked={preferences.hideBalances}
              onCheckedChange={(checked) => updatePreference("hideBalances", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Font Size
          </CardTitle>
          <CardDescription>
            Adjust the size of text throughout the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={preferences.fontSize}
            onValueChange={(value) => updatePreference("fontSize", value as UserPreferences["fontSize"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium (Default)</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
}
