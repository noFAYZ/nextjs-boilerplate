"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Edit,
  ExternalLink,
  MoreVertical,
  Trash2,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Pause,
  Bell,
  BellOff,
  Globe,
  CreditCard,
  Tag,
  FileText,
  RefreshCw,
  Copy,
  Check,
  ArrowUpRight,
  ArrowDownRight,
  Repeat,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSubscription, useDeleteSubscription } from "@/lib/queries/use-subscription-data";
import { subscriptionsApi } from "@/lib/services/subscriptions-api";
import { getLogoUrl } from "@/lib/services/logo-service";
import { cn } from "@/lib/utils";
import { useToast } from "@/lib/hooks/use-toast";
import { SubscriptionFormModal } from "@/components/subscriptions/subscription-form-modal";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { HugeiconsCreditCard, MageCalendar2, MdiDollar } from "@/components/icons/icons";


export default function SubscriptionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const subscriptionId = params.id as string;

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const { data: subscription, isLoading, error } = useSubscription(subscriptionId, {
    includeCharges: true,
    includeReminders: true,
  });

  const { mutate: deleteSubscription, isPending: isDeleting } = useDeleteSubscription();

  const handleDelete = () => {
    deleteSubscription(subscriptionId, {
      onSuccess: () => {
        toast({
          title: "Subscription deleted",
          description: "The subscription has been removed successfully.",
        });
        router.push("/subscriptions");
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to delete subscription. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
    toast({
      title: "Copied to clipboard",
      description: `${fieldName} has been copied.`,
    });
  };

  if (isLoading) {
    return <SubscriptionDetailSkeleton />;
  }

  if (error || !subscription) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Card className="mx-auto max-w-md p-6 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
          <h2 className="mb-2 text-lg font-semibold">Subscription Not Found</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            The subscription you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={() => router.push("/subscriptions")} size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Subscriptions
          </Button>
        </Card>
      </div>
    );
  }

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

  // Calculate stats
  const daysActive = subscription.startDate
    ? Math.floor((new Date().getTime() - new Date(subscription.startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const averageMonthlySpend = daysActive > 0
    ? (subscription.totalSpent / (daysActive / 30))
    : subscription.monthlyEquivalent;

  return (
    <div className="mx-auto max-w-5xl space-y-3 p-4 sm:p-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="xs"
          onClick={() => router.push("/subscriptions")}
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Subscriptions
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="xs"
            onClick={() => setIsEditModalOpen(true)}
            className="gap-1.5"
          >
            <Edit className="h-3.5 w-3.5" />
            Edit
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon-sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit subscription
              </DropdownMenuItem>
              {subscription.websiteUrl && (
                <DropdownMenuItem
                  onClick={() => window.open(subscription.websiteUrl, "_blank")}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Visit website
                </DropdownMenuItem>
              )}
              {subscription.cancellationUrl && (
                <DropdownMenuItem
                  onClick={() => window.open(subscription.cancellationUrl, "_blank")}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Cancel subscription
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* MODERN COMPACT HEADER WITH INTEGRATED STATS */}
      <div className="relative overflow-hidden rounded-none border border-border/70 bg-gradient-to-br from-muted via-muted/30 to-background backdrop-blur-xl drop-shadow-sm">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted/25 via-transparent to-muted/15" />
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-muted/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-muted/5 blur-3xl" />

        <div className="relative p-4 sm:p-5">
          {/* Top Section - Logo, Title, Actions */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            {/* Left - Logo & Info */}
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="relative shrink-0">
              <Avatar className="flex h-12 w-12 sm:h-14 sm:w-14 md:h-18 md:w-18 items-center align-middle justify-center bg-white shadow-md">
                  <AvatarImage
                    src={subscription.logoUrl || getLogoUrl(subscription.websiteUrl)}
                    alt={subscription.name}
                    className="h-12 w-12 object-fit "
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {subscription.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {subscription.autoRenew && (
                  <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-background p-0.5 shadow-md">
                    <RefreshCw className="h-3 w-3 text-primary" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-1.5">
                <div>
                  <Breadcrumb className="mb-1">
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <Link href="/">Home</Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <Link href="/subscriptions">Subscriptions</Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>{subscription.name}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                  <p className="text-xs text-muted-foreground truncate">
                    {subscription.merchantName || "Manual Entry"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <Badge
                    className={cn(
                      "flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 shadow-sm",
                      subscription.status === "ACTIVE" ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30" :
                      subscription.status === "TRIAL" ? "bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30" :
                      subscription.status === "CANCELLED" || subscription.status === "EXPIRED" ? "bg-gray-500/15 text-gray-600 dark:text-gray-400 border border-gray-500/30" :
                      subscription.status === "PAYMENT_FAILED" ? "bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30" :
                      "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border border-yellow-500/30"
                    )}
                  >
                    {getStatusIcon()}
                    {subscription.status.charAt(0) + subscription.status.slice(1).toLowerCase().replace('_', ' ')}
                  </Badge>

                  {subscription.category && (
                    <Badge variant="outline" className="text-[10px] bg-background/60 backdrop-blur-sm flex items-center gap-1 px-2 py-0.5">
                      <Tag className="h-2.5 w-2.5" />
                      {subscriptionsApi.getCategoryDisplayName(subscription.category)}
                    </Badge>
                  )}

                  {subscription.isInTrial && (
                    <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-600 border-blue-500/30 backdrop-blur-sm px-2 py-0.5">
                      <Sparkles className="h-2.5 w-2.5 mr-1" />
                      Trial
                    </Badge>
                  )}
                       {subscription.notifyBeforeBilling && (
                <Badge variant="outline" className="text-[10px] bg-background/60 backdrop-blur-sm px-2 py-0.5">
                  <Bell className="h-2.5 w-2.5 mr-1" />
                  Reminders ({subscription.notifyDaysBefore}d)
                </Badge>
              )}
                </div>
              </div>
            </div>

            {/* Right - Quick Actions */}
            <div className="flex gap-1.5 sm:shrink-0">
            {subscription.websiteUrl && (
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => window.open(subscription.websiteUrl, "_blank")}
                  className="backdrop-blur-sm "
                >
                  <Globe className="h-3 w-3 mr-1" />
                  Visit
                </Button>
              )}
              {subscription.cancellationUrl && (
                <Button
                  variant="delete"
                  size="xs"
                  onClick={() => window.open(subscription.cancellationUrl, "_blank")}
                  className="backdrop-blur-sm "
                  icon={<XCircle className="h-3.5 w-3.5 " />}
                >
                  
                  <span className="hidden sm:inline text-xs">Cancel</span>
                </Button>
              )}
             

            </div>
          </div>

          {/* Stats Grid - Modern Horizontal Compact */}
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {/* Current Billing */}
            <div className="group relative overflow-hidden rounded-lg border border-border/70  bg-gradient-to-r from-primary/5 via-background/95 to-background backdrop-blur-sm transition-all hover:shadow-md  items-center  hover:from-primary/8">
              <div className="flex items-center gap-2.5 p-2">
                <div className="shrink-0 rounded-md bg-primary/10 p-1.5 transition-all group-hover:bg-primary/15 group-hover:scale-105">
                  <MdiDollar className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">Cost</p>
                  <p className="text-base font-bold tracking-tight truncate">
                    {subscriptionsApi.formatCurrency(subscription.amount, subscription.currency).replace(/\.00$/, "")}   <span className="text-[9px] text-muted-foreground truncate">
                    /{subscriptionsApi.getBillingCycleDisplayName(subscription.billingCycle).toLowerCase()}
                  </span>
                  </p>
               
                </div>
              </div>
            </div>

            {/* Next Billing */}
            <div className="group relative overflow-hidden rounded-lg border border-border/70  bg-gradient-to-r from-blue-500/5 via-background/95 to-background backdrop-blur-sm transition-all hover:shadow-md  items-center  hover:from-blue-500/8">
              <div className="flex items-center gap-2.5 p-2">
                <div className="shrink-0 rounded-md bg-blue-500/10 p-1.5 transition-all group-hover:bg-blue-500/15 group-hover:scale-105">
                  <MageCalendar2 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">Next Billing</p>
                  <p className="text-base font-bold tracking-tight truncate">
                    {subscription.nextBillingDate ? (
                      formatDate(subscription.nextBillingDate).split(',')[0]
                    ) : "—"}
                  </p>
                  <div className="flex items-center gap-1.5">
                    {subscription.daysUntilNextBilling !== undefined && (
                      <p className="text-[9px] text-muted-foreground">
                        {subscription.daysUntilNextBilling === 0 ? "Today" :
                          subscription.daysUntilNextBilling === 1 ? "Tomorrow" :
                          `in ${subscription.daysUntilNextBilling}d`}
                      </p>
                    )}
                    {subscription.daysUntilNextBilling !== undefined && subscription.daysUntilNextBilling <= 7 && (
                      <Badge variant="outline" className="text-[8px] h-3.5 px-1 border-orange-500/30 bg-orange-500/10 text-orange-600">
                        Soon
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Yearly Estimate */}
            <div className="group relative overflow-hidden rounded-lg border border-border/70  bg-gradient-to-r from-primary/8 via-primary/5 to-background backdrop-blur-sm transition-all hover:shadow-md  items-center  hover:from-primary/12">
              <div className="flex items-center gap-2.5 p-2">
                <div className="shrink-0 rounded-md bg-primary/15 p-1.5 transition-all group-hover:bg-primary/20 group-hover:scale-105">
                  <Repeat className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-primary/80 mb-0.5">Yearly</p>
                  <p className="text-base flex items-baseline gap-1 font-bold tracking-tight text-primary truncate">
                    {subscriptionsApi.formatCurrency(subscription.yearlyEstimate, subscription.currency).replace(/\.00$/, "")}
                    <span className="text-[9px] text-primary/70 truncate">
                    projected annual
                  </span>
                  </p>
                 
                </div>
              </div>
            </div>

            {/* Total Spent */}
            <div className="group relative overflow-hidden rounded-lg border border-border/70  bg-gradient-to-r from-emerald-500/8 via-emerald-500/5 to-background backdrop-blur-sm transition-all hover:shadow-md items-center hover:from-emerald-500/12">
              <div className="flex items-center gap-2.5 p-2">
                <div className="shrink-0 rounded-md bg-emerald-500/15 p-1.5 transition-all group-hover:bg-emerald-500/20 group-hover:scale-105">
                  <HugeiconsCreditCard className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-emerald-700/80 dark:text-emerald-400/80 mb-0.5">Total Spent</p>
                  <p className="flex gap-1 items-baseline text-base font-bold tracking-tight text-emerald-700 dark:text-emerald-400 truncate">
                    {subscriptionsApi.formatCurrency(subscription.totalSpent, subscription.currency).replace(/\.00$/, "")}
                    <span className="flex items-center gap-1 text-[9px] text-emerald-700/70 dark:text-emerald-400/70">
                    {subscription.startDate && (
                      <span className="truncate">since {formatDate(subscription.startDate).split(',')[0].split(' ')[0]}</span>
                    )}
                    {daysActive > 0 && subscription.startDate && <span>•</span>}
                    {daysActive > 0 && <span>{daysActive}d</span>}
                  </span>
                  </p>
              
                </div>
              </div>
            </div>
          </div>

 
        </div>
      </div>

     
      {/* Tabs - Content Sections */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList variant="card" className=" justify-start overflow-x-auto" size="sm">
          <TabsTrigger value="overview" variant="card" className="gap-2" size="sm">
            <FileText className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="charges" variant="card" className="gap-2" size="sm">
            <CreditCard className="h-4 w-4" />
            Charges
            {subscription.charges && subscription.charges.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
                {subscription.charges.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="reminders" variant="card" className="gap-2" size="sm">
            <Bell className="h-4 w-4" />
            Reminders
            {subscription.reminders && subscription.reminders.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
                {subscription.reminders.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="details" variant="card" className="gap-2" size="sm">
            <Tag className="h-4 w-4" />
            Details
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Subscription Timeline */}
            <Card className="overflow-hidden rounded-xl border-border/60 bg-gradient-to-br from-background to-muted/20 p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold">Subscription Timeline</h3>
              </div>
              <div className="space-y-4">
                <InfoRow
                  icon={<ArrowUpRight className="h-4 w-4 text-emerald-600" />}
                  label="Start Date"
                  value={formatDate(subscription.startDate)}
                />
                <InfoRow
                  icon={<Clock className="h-4 w-4 text-blue-600" />}
                  label="Next Billing"
                  value={formatDate(subscription.nextBillingDate)}
                />
                {subscription.endDate && (
                  <InfoRow
                    icon={<ArrowDownRight className="h-4 w-4 text-red-600" />}
                    label="End Date"
                    value={formatDate(subscription.endDate)}
                  />
                )}
                {subscription.trialEndDate && (
                  <InfoRow
                    icon={<Sparkles className="h-4 w-4 text-blue-600" />}
                    label="Trial Ends"
                    value={formatDate(subscription.trialEndDate)}
                    highlight={subscription.isInTrial}
                  />
                )}
                <InfoRow
                  icon={<Tag className="h-4 w-4" />}
                  label="Category"
                  value={
                    subscription.category
                      ? subscriptionsApi.getCategoryDisplayName(subscription.category)
                      : "—"
                  }
                />
              </div>
            </Card>

            {/* Billing Summary */}
            <Card className="overflow-hidden rounded-xl border-primary/30 bg-gradient-to-br from-primary/5 to-background p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold">Billing Summary</h3>
              </div>
              <div className="space-y-4">
                <InfoRow
                  icon={<DollarSign className="h-4 w-4 text-primary" />}
                  label="Amount"
                  value={subscriptionsApi.formatCurrency(
                    subscription.amount,
                    subscription.currency
                  )}
                />
                <InfoRow
                  icon={<Repeat className="h-4 w-4" />}
                  label="Billing Cycle"
                  value={subscriptionsApi.getBillingCycleDisplayName(subscription.billingCycle)}
                />
                <InfoRow
                  icon={<TrendingUp className="h-4 w-4 text-blue-600" />}
                  label="Monthly Equivalent"
                  value={subscriptionsApi.formatCurrency(
                    subscription.monthlyEquivalent,
                    subscription.currency
                  )}
                />
                <InfoRow
                  icon={<Calendar className="h-4 w-4 text-primary" />}
                  label="Yearly Estimate"
                  value={subscriptionsApi.formatCurrency(
                    subscription.yearlyEstimate,
                    subscription.currency
                  )}
                />
                <InfoRow
                  icon={<CreditCard className="h-4 w-4 text-emerald-600" />}
                  label="Total Spent"
                  value={subscriptionsApi.formatCurrency(
                    subscription.totalSpent,
                    subscription.currency
                  )}
                />
              </div>
            </Card>

            {/* Notification Settings */}
            <Card className="overflow-hidden rounded-xl border-border/60 bg-gradient-to-br from-background to-muted/20 p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className={cn(
                  "rounded-lg p-2",
                  subscription.notifyBeforeBilling ? "bg-emerald-500/10" : "bg-muted"
                )}>
                  {subscription.notifyBeforeBilling ? (
                    <Bell className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <BellOff className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <h3 className="text-base font-semibold">Notifications</h3>
              </div>
              <div className="space-y-4">
                <InfoRow
                  icon={
                    subscription.notifyBeforeBilling ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )
                  }
                  label="Reminders"
                  value={subscription.notifyBeforeBilling ? "Enabled" : "Disabled"}
                />
                {subscription.notifyBeforeBilling && (
                  <InfoRow
                    icon={<Clock className="h-4 w-4 text-blue-600" />}
                    label="Reminder Days"
                    value={`${subscription.notifyDaysBefore} days before`}
                  />
                )}
                {subscription.lastNotificationDate && (
                  <InfoRow
                    icon={<Calendar className="h-4 w-4" />}
                    label="Last Notification"
                    value={formatDate(subscription.lastNotificationDate)}
                  />
                )}
              </div>
            </Card>

            {/* Additional Information */}
            <Card className="overflow-hidden rounded-xl border-border/60 bg-gradient-to-br from-background to-muted/20 p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-base font-semibold">Additional Info</h3>
              </div>
              <div className="space-y-4">
                {subscription.websiteUrl && (
                  <InfoRow
                    icon={<Globe className="h-4 w-4 text-blue-600" />}
                    label="Website"
                    value={
                      <a
                        href={subscription.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        {new URL(subscription.websiteUrl).hostname}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    }
                  />
                )}
                {subscription.cancellationUrl && (
                  <InfoRow
                    icon={<XCircle className="h-4 w-4 text-red-600" />}
                    label="Cancellation"
                    value={
                      <a
                        href={subscription.cancellationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-destructive hover:underline inline-flex items-center gap-1"
                      >
                        Cancel Link
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    }
                  />
                )}
                <InfoRow
                  icon={<Tag className="h-4 w-4" />}
                  label="Source"
                  value={subscription.sourceType}
                />
                {subscription.account && (
                  <InfoRow
                    icon={<CreditCard className="h-4 w-4" />}
                    label="Account"
                    value={subscription.account.name}
                  />
                )}
                {subscription.autoRenew && (
                  <InfoRow
                    icon={<RefreshCw className="h-4 w-4 text-emerald-600" />}
                    label="Auto-Renew"
                    value="Enabled"
                  />
                )}
              </div>
            </Card>
          </div>

          {/* Notes Section */}
          {subscription.notes && (
            <Card className="overflow-hidden rounded-xl border-border/60 bg-gradient-to-br from-background to-muted/20 p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-base font-semibold">Notes</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{subscription.notes}</p>
            </Card>
          )}

          {/* Tags Section */}
          {subscription.tags && subscription.tags.length > 0 && (
            <Card className="overflow-hidden rounded-xl border-border/60 bg-gradient-to-br from-background to-muted/20 p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded-lg bg-purple-500/10 p-2">
                  <Tag className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-base font-semibold">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {subscription.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Charges Tab */}
        <TabsContent value="charges" className="space-y-6">
          <Card className="overflow-hidden rounded-xl border-border/60 bg-gradient-to-br from-background to-muted/20 p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-500/10 p-2">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">Charge History</h3>
                  <p className="text-xs text-muted-foreground">
                    {subscription.charges?.length || 0} total charges
                  </p>
                </div>
              </div>
              {subscription.charges && subscription.charges.length > 0 && (
                <Badge variant="outline" className="bg-background/60">
                  {subscriptionsApi.formatCurrency(
                    subscription.charges.reduce((sum, c) => sum + c.amount, 0),
                    subscription.currency
                  )} total
                </Badge>
              )}
            </div>
            {subscription.charges && subscription.charges.length > 0 ? (
              <div className="space-y-3">
                {subscription.charges.map((charge) => (
                  <div
                    key={charge.id}
                    className="group relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-background/80 to-background/40 p-4 transition-all hover:shadow-md hover:border-primary/30"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "rounded-lg p-2.5",
                            charge.status === "COMPLETED"
                              ? "bg-emerald-500/15 text-emerald-600"
                              : charge.status === "FAILED"
                                ? "bg-red-500/15 text-red-600"
                                : "bg-yellow-500/15 text-yellow-600"
                          )}
                        >
                          {charge.status === "COMPLETED" ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : charge.status === "FAILED" ? (
                            <XCircle className="h-5 w-5" />
                          ) : (
                            <Clock className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="text-base font-semibold">
                            {subscriptionsApi.formatCurrency(charge.amount, charge.currency)}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(charge.chargeDate)}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={cn(
                          "font-semibold",
                          charge.status === "COMPLETED"
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                            : charge.status === "FAILED"
                              ? "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30"
                              : "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30"
                        )}
                      >
                        {charge.status.charAt(0) + charge.status.slice(1).toLowerCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <CreditCard className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No charges recorded yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Charges will appear here once billing occurs
                </p>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Reminders Tab */}
        <TabsContent value="reminders" className="space-y-6">
          <Card className="overflow-hidden rounded-xl border-border/60 bg-gradient-to-br from-background to-muted/20 p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">Reminders</h3>
                  <p className="text-xs text-muted-foreground">
                    {subscription.reminders?.length || 0} configured
                  </p>
                </div>
              </div>
              {subscription.notifyBeforeBilling && (
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              )}
            </div>
            {subscription.reminders && subscription.reminders.length > 0 ? (
              <div className="space-y-3">
                {subscription.reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="group relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-background/80 to-background/40 p-4 transition-all hover:shadow-md hover:border-primary/30"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "rounded-lg p-2.5",
                          reminder.sent ? "bg-emerald-500/15 text-emerald-600" : "bg-blue-500/15 text-blue-600"
                        )}>
                          {reminder.sent ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <Bell className="h-5 w-5" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{reminder.message}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Calendar className="h-3 w-3" />
                            {formatDate(reminder.reminderDate)}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={cn(
                          "ml-2 font-semibold shrink-0",
                          reminder.sent
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                            : "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30"
                        )}
                      >
                        {reminder.sent ? "Sent" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <BellOff className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No reminders configured</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Enable billing reminders in the edit dialog
                </p>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <Card className="overflow-hidden rounded-xl border-border/60 bg-gradient-to-br from-background to-muted/20 p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-purple-500/10 p-2">
                <Tag className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-base font-semibold">Technical Details</h3>
            </div>
            <div className="space-y-2.5">
              <DetailRow
                label="Subscription ID"
                value={subscription.id}
                copyable
                onCopy={() => copyToClipboard(subscription.id, "Subscription ID")}
                copied={copiedField === "Subscription ID"}
              />
              <DetailRow label="User ID" value={subscription.userId} />
              <DetailRow label="Status" value={subscription.status} />
              <DetailRow label="Is Active" value={subscription.isActive ? "Yes" : "No"} />
              <DetailRow label="Auto Renew" value={subscription.autoRenew ? "Yes" : "No"} />
              <DetailRow label="Source Type" value={subscription.sourceType} />
              {subscription.providerName && (
                <DetailRow label="Provider Name" value={subscription.providerName} />
              )}
              {subscription.providerTransactionId && (
                <DetailRow
                  label="Provider Transaction ID"
                  value={subscription.providerTransactionId}
                />
              )}
              {subscription.accountId && (
                <DetailRow label="Account ID" value={subscription.accountId} />
              )}
              {subscription.categoryId && (
                <DetailRow label="Category ID" value={subscription.categoryId} />
              )}
              <DetailRow label="Created At" value={formatDate(subscription.createdAt)} />
              <DetailRow label="Updated At" value={formatDate(subscription.updatedAt)} />
            </div>
          </Card>

          {subscription.detectionMetadata && (
            <Card className="p-4">
              <h3 className="mb-4 text-sm font-semibold">Detection Metadata</h3>
              <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">
                {JSON.stringify(subscription.detectionMetadata, null, 2)}
              </pre>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Modal */}
      <SubscriptionFormModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        subscription={subscription}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{subscription.name}"? This action cannot be undone
              and will remove all associated charges and reminders.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Helper Components
interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}

function InfoRow({ icon, label, value, highlight }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <span
        className={cn(
          "text-sm font-medium",
          highlight && "rounded-md bg-yellow-500/10 px-2 py-0.5 text-yellow-600"
        )}
      >
        {value}
      </span>
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  copyable?: boolean;
  onCopy?: () => void;
  copied?: boolean;
}

function DetailRow({ label, value, copyable, onCopy, copied }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 p-2 hover:bg-muted/50 transition-colors">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="max-w-xs truncate text-xs font-mono">{value}</span>
        {copyable && onCopy && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-6 w-6"
            onClick={onCopy}
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

// Loading Skeleton
function SubscriptionDetailSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-4 p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
      <Card className="overflow-hidden border-2 p-8">
        <div className="flex items-start gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-3 flex-1">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
