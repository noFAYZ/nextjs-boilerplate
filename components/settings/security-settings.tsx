"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Shield } from "lucide-react";

export function SecuritySettings(props: any) {
  const { preferences, updatePreference } = props;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Settings
        </CardTitle>
        <CardDescription>Protect your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Two-Factor Authentication</Label>
            <p className="text-sm text-muted-foreground">Add extra security</p>
          </div>
          <Switch checked={preferences?.twoFactorEnabled ?? false} onCheckedChange={(checked) => updatePreference("twoFactorEnabled", checked)} />
        </div>
      </CardContent>
    </Card>
  );
}
