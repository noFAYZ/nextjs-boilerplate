"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Eye } from "lucide-react";
import type { PrivacySettings as PrivacySettingsType } from "@/lib/types/settings";

interface PrivacySettingsProps {
  privacy: PrivacySettingsType;
  updatePrivacy: (key: keyof PrivacySettingsType, value: any) => void;
}

export function PrivacySettings({ privacy, updatePrivacy }: PrivacySettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Privacy Settings
        </CardTitle>
        <CardDescription>Control how your data is used</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Data Sharing</Label>
            <p className="text-sm text-muted-foreground">Share anonymous usage data</p>
          </div>
          <Switch checked={privacy?.dataSharing ?? true} onCheckedChange={(checked) => updatePrivacy("dataSharing", checked)} />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Analytics</Label>
            <p className="text-sm text-muted-foreground">Help us understand app usage</p>
          </div>
          <Switch checked={privacy?.analytics ?? true} onCheckedChange={(checked) => updatePrivacy("analytics", checked)} />
        </div>
      </CardContent>
    </Card>
  );
}
