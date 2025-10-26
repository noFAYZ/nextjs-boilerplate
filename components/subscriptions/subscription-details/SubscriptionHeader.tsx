import React, { useMemo } from "react";
import Image from "next/image";

// shadcn / design system components - adapt imports to your project
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { cn, formatCurrency } from "@/lib/utils";

// icons (replace with your icon set)
import { Globe, XCircle, Bell, Sparkles, Tag, RefreshCw, Repeat, AlertCircle, CheckCircle2, Clock, Pause } from "lucide-react";
import { Dropdown } from "react-day-picker";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HugeiconsCreditCard, MageCalendar2, MdiDollar } from "@/components/icons/icons";
import { subscriptionsApi } from "@/lib/services/subscriptions-api";


// Types
export type BillingCycle = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | string;

export type Subscription = {
  id: string | number;
  name: string;
  merchantName?: string;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  cancellationUrl?: string | null;
  amount: number;
  currency: string;
  billingCycle: BillingCycle;
  nextBillingDate?: string | Date | null;
  daysUntilNextBilling?: number;
  yearlyEstimate?: number;
  totalSpent?: number;
  startDate?: string | Date | null;
  status?: string;
  autoRenew?: boolean;
  category?: string;
  isInTrial?: boolean;
  notifyBeforeBilling?: boolean;
  notifyDaysBefore?: number;
};

// Helpers you must provide from your codebase (or adapt these to local utilities)
type Helpers = {
  getBillingCycleDisplayName: (cycle: BillingCycle) => string;
  getCategoryDisplayName: (cat?: string) => string;
  getLogoFallbackText?: (name: string) => string;
  formatDate?: (d?: string | Date | null) => string;
  getStatusIcon?: (status?: string) => React.ReactNode;
};

// Props
type Props = {
  subscription: Subscription;

  className?: string;
  loading?: boolean;
};

export default function SubscriptionHeader({ subscription,  className = "", loading = false }: Props) {
  const daysActive = useMemo(() => {
    if (!subscription.startDate) return 0;
    try {
      const s = new Date(subscription.startDate);
      const diff = Math.floor((Date.now() - s.getTime()) / (1000 * 60 * 60 * 24));
      return Math.max(0, diff);
    } catch (e) {
      return 0;
    }
  }, [subscription.startDate]);

  const statusLabel = useMemo(() => {
    const s = subscription.status || "UNKNOWN";
    return s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, " ");
  }, [subscription.status]);

  // Accessible strings
  const visitLabel = `Open ${subscription.name} website`; 
  const cancelLabel = `Cancel ${subscription.name} subscription`;
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
   
  };


  const statusInfo = subscriptionsApi.getStatusDisplayInfo(subscription.status);
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusIcon = () => {
    switch (subscription.status) {
      case "ACTIVE":
        return <CheckCircle2 className="h-4 w-4" />;
      case "TRIAL":
        return <Clock className="h-4 w-4" />;
      case "CANCELLED":
      case "EXPIRED":
        return <XCircle className="h-4 w-4" />;
      case "PAYMENT_FAILED":
        return <AlertCircle className="h-4 w-4" />;
      case "PAUSED":
        return <Pause className="h-4 w-4" />;
      default:
        return null;
    }
  };


  return (
    <header
      role="region"
      aria-labelledby={`subscription-${subscription.id}-title`}
      className={cn("relative overflow-hidden rounded-lg border bg-gradient-to-br from-muted/5 to-background backdrop-blur-md shadow-sm", className)}
    >
      {/* Decorative background layers kept but optimized for accessibility (aria-hidden) */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/25 via-transparent to-muted/10" aria-hidden />

      <div className="relative p-3 sm:p-5">
        {/* Top area: identity + actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              {/* Use Next Image when you want automatic optimization. Fallback to initials when logo missing. */}
              {subscription.logoUrl && !loading ? (
                <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-lg overflow-hidden bg-white shadow">
                  <Image
                    src={subscription.logoUrl}
                    alt={subscription.name}
                    width={64}
                    height={64}
                    className="object-cover h-full w-full"
                    // priority can be added for above-the-fold images
                  />
                </div>
              ) : (
                <Avatar className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16">
                  <AvatarImage src={subscription.logoUrl || undefined} alt={subscription.name} />
                  <AvatarFallback>{ subscription.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              )}

              {subscription.autoRenew && (
                <span className="absolute -bottom-0.5 -right-0.5 rounded-full bg-background p-1 text-xs shadow" aria-hidden>
                  <RefreshCw className="h-3 w-3 text-primary" />
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 id={`subscription-${subscription.id}-title`} className="text-sm sm:text-lg font-semibold truncate">
                  {subscription.name}
                </h2>
                <div className="hidden sm:flex items-center gap-1">
                  {/* compact status badge */}
                  <Badge
                    className={cn("text-[10px] font-semibold px-2 py-1",
                      subscription.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20" :
                      subscription.status === "TRIAL" ? "bg-blue-500/10 text-blue-700 border border-blue-500/20" :
                      subscription.status === "CANCELLED" || subscription.status === "EXPIRED" ? "bg-gray-500/10 text-gray-700 border border-gray-500/20" :
                      subscription.status === "PAYMENT_FAILED" ? "bg-red-500/10 text-red-700 border border-red-500/20" :
                      "bg-yellow-500/10 text-yellow-700 border border-yellow-500/20"
                    )}
                    aria-label={`Status: ${statusLabel}`}
                  >
                    {getStatusIcon ? getStatusIcon() : null}
                    <span className="ml-1 truncate">{statusLabel}</span>
                  </Badge>
                </div>
              </div>

              <p className="text-xs text-muted-foreground truncate">{subscription.merchantName ?? "Manual Entry"}</p>

              <div className="mt-2 flex flex-wrap gap-2 items-center">
                {subscription.category && (
                  <Badge variant="outline" className="text-[11px] px-2 py-0.5">
                    <Tag className="h-3 w-3 mr-1" />
                    {subscriptionsApi.getCategoryDisplayName(subscription.category)}
                  </Badge>
                )}

                {subscription.isInTrial && (
                  <Badge variant="outline" className="text-[11px]">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Trial
                  </Badge>
                )}

                {subscription.notifyBeforeBilling && (
                  <Tooltip content={`Remind ${subscriptionsApi.getBillingCycleDisplayName(subscription.billingCycle)} (${subscription.notifyDaysBefore} days before)`}>
                    <Badge variant="outline" className="text-[11px]">
                      <Bell className="h-3 w-3 mr-1" />
                      Remind {subscription.notifyDaysBefore}d
                    </Badge>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>

          {/* Right actions - collapse into menu on very small screens */}
          <div className="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-0">
            {subscription.websiteUrl && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => window.open(subscription.websiteUrl, "_blank")}
                aria-label={visitLabel}
                title={visitLabel}
              >
                <Globe className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Visit</span>
              </Button>
            )}

            {subscription.cancellationUrl && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => window.open(subscription.cancellationUrl, "_blank")}
                aria-label={cancelLabel}
                title={cancelLabel}
              >
                <XCircle className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Cancel</span>
              </Button>
            )}

            {/* Overflow menu for secondary actions (share, manage, receipts, analytics)

            <DropdownMenu>
  <DropdownMenuTrigger asChild> <Button size="sm" variant="outline" aria-label="More actions">
                  •••
                </Button></DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel onSelect={() => navigator.clipboard?.writeText(subscription.websiteUrl ?? "")}>Copy URL</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Manage</DropdownMenuItem>
    <DropdownMenuItem>Receipts</DropdownMenuItem>
    <DropdownMenuItem>Export</DropdownMenuItem>

  </DropdownMenuContent>
</DropdownMenu> */}
          </div>
        </div>

        {/* Stats grid */}
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">

          {/* Cost */}
          <section aria-labelledby={`cost-${subscription.id}`} className="group relative rounded-md border p-2 bg-gradient-to-r from-primary/5 to-background">
            <div className="flex items-center gap-3">
              <div className="shrink-0 rounded-md p-2 bg-primary/10 group-hover:scale-105">
                <MdiDollar className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 id={`cost-${subscription.id}`} className="text-[9px] font-semibold uppercase text-muted-foreground">Cost</h3>
                <p className="text-base font-bold truncate">
                  {formatCurrency(subscription.amount, subscription.currency).replace(/\.00$/, "")}
                  <span className="text-xs text-muted-foreground"> /{subscriptionsApi.getBillingCycleDisplayName(subscription.billingCycle).toLowerCase()}</span>
                </p>
              </div>
            </div>
          </section>

          {/* Next billing */}
          <section aria-labelledby={`next-billing-${subscription.id}`} className="group relative rounded-md border p-2 bg-gradient-to-r from-blue-50 to-background">
            <div className="flex items-center gap-3">
              <div className="shrink-0 rounded-md p-2 bg-blue-50 group-hover:scale-105">
                <MageCalendar2 className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <h3 id={`next-billing-${subscription.id}`} className="text-[9px] font-semibold uppercase text-muted-foreground">Next Billing</h3>
                <p className="text-base font-bold truncate">
                  {subscription.nextBillingDate ? (formatDate ? formatDate(subscription.nextBillingDate) : new Date(subscription.nextBillingDate).toLocaleDateString()) : "—"}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {subscription.daysUntilNextBilling !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      {subscription.daysUntilNextBilling === 0 ? "Today" : subscription.daysUntilNextBilling === 1 ? "Tomorrow" : `in ${subscription.daysUntilNextBilling}d`}
                    </span>
                  )}
                  {subscription.daysUntilNextBilling !== undefined && subscription.daysUntilNextBilling <= 7 && (
                    <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-orange-300">Soon</Badge>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Yearly estimate */}
          <section aria-labelledby={`yearly-${subscription.id}`} className="group relative rounded-md border p-2 bg-gradient-to-r from-primary/8 to-background">
            <div className="flex items-center gap-3">
              <div className="shrink-0 rounded-md p-2 bg-primary/15 group-hover:scale-105">
                <Repeat className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 id={`yearly-${subscription.id}`} className="text-[9px] font-semibold uppercase text-primary/80">Yearly</h3>
                <p className="text-base font-bold text-primary truncate">
                  {formatCurrency(subscription.yearlyEstimate ?? (subscription.amount * 12), subscription.currency).replace(/\.00$/, "")}
                  <span className="text-xs text-primary/70"> projected annual</span>
                </p>
              </div>
            </div>
          </section>

          {/* Total spent */}
          <section aria-labelledby={`total-${subscription.id}`} className="group relative rounded-md border p-2 bg-gradient-to-r from-emerald-50 to-background">
            <div className="flex items-center gap-3">
              <div className="shrink-0 rounded-md p-2 bg-emerald-50 group-hover:scale-105">
                <HugeiconsCreditCard className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 id={`total-${subscription.id}`} className="text-[9px] font-semibold uppercase text-emerald-700/80">Total Spent</h3>
                <p className="text-base font-bold truncate">
                  {formatCurrency(subscription.totalSpent ?? 0, subscription.currency).replace(/\.00$/, "")}
                  <span className="text-xs text-emerald-700/70 ml-2">
                    {subscription.startDate && <span className="truncate">since {formatDate ? formatDate(subscription.startDate).split(',')[0] : new Date(subscription.startDate).toLocaleDateString()}</span>}
                    {daysActive > 0 && <span> • {daysActive}d</span>}
                  </span>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </header>
  );
}

/*
  Notes / Integration:
  - Replace helper functions with your internal utilities (formatCurrency, formatDate, etc).
  - Provide aria labels for interactive controls and ensure keyboard access for menus.
  - Use Next/Image for logos (remember to configure domains in next.config.js).
  - This component focuses on accessibility, responsive layout, low visual noise for enterprise dashboards.
  - Consider adding skeletons and error boundaries around network-dependent values.
  - For Storybook/testing: export a set of fixtures (active, trial, failed payment) and snapshot + axe tests.
*/
