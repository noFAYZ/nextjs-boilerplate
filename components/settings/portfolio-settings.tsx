"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

export function PortfolioSettings(props: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Portfolio Settings
        </CardTitle>
        <CardDescription>Portfolio preferences</CardDescription>
      </CardHeader>
      <CardContent><p className="text-sm text-muted-foreground">Portfolio settings</p></CardContent>
    </Card>
  );
}
