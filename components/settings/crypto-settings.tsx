"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export function CryptoSettings(props: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Crypto Settings
        </CardTitle>
        <CardDescription>Crypto preferences</CardDescription>
      </CardHeader>
      <CardContent><p className="text-sm text-muted-foreground">Crypto settings</p></CardContent>
    </Card>
  );
}
