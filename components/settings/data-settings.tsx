"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";

export function DataSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Settings
        </CardTitle>
        <CardDescription>Data and sync preferences</CardDescription>
      </CardHeader>
      <CardContent><p className="text-sm text-muted-foreground">Data settings</p></CardContent>
    </Card>
  );
}
