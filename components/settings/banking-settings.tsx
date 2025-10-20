"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";

export function BankingSettings(props: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Banking Settings
        </CardTitle>
        <CardDescription>Banking preferences</CardDescription>
      </CardHeader>
      <CardContent><p className="text-sm text-muted-foreground">Banking settings</p></CardContent>
    </Card>
  );
}
