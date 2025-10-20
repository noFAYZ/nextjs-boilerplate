"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail, Smartphone } from "lucide-react";
import type { NotificationSettings as NotificationSettingsType } from "@/lib/types/settings";

interface NotificationSettingsProps {
  notifications: NotificationSettingsType;
  updateNotification: (key: any, value: any) => void;
}

export function NotificationSettings({ notifications, updateNotification }: NotificationSettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Choose how you want to be notified</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch
              id="emailNotifications"
              checked={notifications?.email?.enabled || false}
              onCheckedChange={(checked) => updateNotification("email", { ...notifications.email, enabled: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="pushNotifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive push notifications</p>
            </div>
            <Switch
              id="pushNotifications"
              checked={notifications?.push?.enabled || false}
              onCheckedChange={(checked) => updateNotification("push", { ...notifications.push, enabled: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
