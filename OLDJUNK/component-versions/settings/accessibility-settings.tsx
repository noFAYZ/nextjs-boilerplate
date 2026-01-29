"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accessibility } from "lucide-react";

export function AccessibilitySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Accessibility className="h-5 w-5" />
          Accessibility
        </CardTitle>
        <CardDescription>Accessibility preferences</CardDescription>
      </CardHeader>
      <CardContent><p className="text-sm text-muted-foreground">Accessibility settings</p></CardContent>
    </Card>
  );
}
