"use client";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  useAuthStore,
  selectUser,
  useDashboardLayoutStore,
} from "@/lib/stores";
import { NetWorthWidget } from "@/components/dashboard-widgets/networth-widget2";

const dashboard = () => {
  const user = useAuthStore(selectUser);

  const firstName =
    user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "User";
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 18
      ? "Good afternoon"
      : "Good evening";

  return (
    <div className="space-y-4">
      <div className="w-full flex items-center ">
  <h1 className="font-bold text-2xl">Welcome, {firstName}! </h1>
      </div>
    
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-3">
          <NetWorthWidget />
        </div>
      </div>
    </div>
  );
};

export default dashboard;
