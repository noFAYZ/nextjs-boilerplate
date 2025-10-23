"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  DollarSign,
  ExternalLink,
  Edit,
  Trash2,
  Clock,
  XCircle,
  AlertCircle,
  Tag,
  CreditCard,
  TrendingUp,
  RefreshCw,
  Link as LinkIcon,
  Bell,
  Info,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { UserSubscription } from "@/lib/types/subscription"
import { subscriptionsApi } from "@/lib/services/subscriptions-api"
import { SolarCheckCircleBoldDuotone } from "../icons/icons"
import { getLogoUrl } from "@/lib/services/logo-service"

interface SubscriptionDetailsModalProps {
  subscription: UserSubscription | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (s: UserSubscription) => void
  onDelete?: (s: UserSubscription) => void
}

export function SubscriptionDetailsModal({
  subscription,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: SubscriptionDetailsModalProps) {
  if (!subscription) return null

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const statusColor: Record<string, string> = {
    ACTIVE: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    TRIAL: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
    CANCELLED: "bg-gray-500/10 text-gray-500 border border-gray-500/20",
    EXPIRED: "bg-gray-500/10 text-gray-500 border border-gray-500/20",
    PAYMENT_FAILED: "bg-red-500/10 text-red-500 border border-red-500/20",
    PAUSED: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20",
  }

  const getStatusIcon = () => {
    switch (subscription.status) {
      case "ACTIVE":
        return <SolarCheckCircleBoldDuotone className="w-3 h-3" />
      case "TRIAL":
        return <Clock className="w-3 h-3" />
      case "CANCELLED":
      case "EXPIRED":
        return <XCircle className="w-3 h-3" />
      case "PAYMENT_FAILED":
        return <AlertCircle className="w-3 h-3" />
      default:
        return null
    }
  }

  // Helper to check if field has value
  const hasValue = (value: any) => {
    if (value === null || value === undefined) return false
    if (typeof value === "string" && value.trim() === "") return false
    if (Array.isArray(value) && value.length === 0) return false
    return true
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="min-w-xl  overflow-y-auto p-0"  >
        {/* Header Section with Gradient Background */}
        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background p-4">
          <DialogHeader className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Avatar className="h-12 w-12 ring-2 ring-background shadow-lg flex-shrink-0">
                  {subscription.websiteUrl ? (
                    <AvatarImage
                      src={getLogoUrl(subscription.websiteUrl) || ""}
                      alt={subscription.name}
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-sm font-bold">
                      {subscription.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="space-y-1 min-w-0 flex-1">
                  <DialogTitle className="text-xl font-bold tracking-tight truncate">
                    {subscription.name}
                  </DialogTitle>
                  {hasValue(subscription.merchantName) && (
                    <p className="text-xs text-muted-foreground font-medium truncate">
                      {subscription.merchantName}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge
                      className={cn(
                        "flex items-center gap-1 px-2 py-0.5 text-xs font-medium",
                        statusColor[subscription.status]
                      )}
                    >
                      {getStatusIcon()}
                      {subscription.status.charAt(0) + subscription.status.slice(1).toLowerCase()}
                    </Badge>
                    {subscription.autoRenew && (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 px-2 py-0.5 text-xs bg-background/80"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                        Auto-renew
                      </Badge>
                    )}
                    {subscription.category && (
                      <Badge
                        variant="outline"
                        className="px-2 py-0.5 text-xs bg-background/80"
                      >
                        {subscriptionsApi.getCategoryDisplayName(subscription.category)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onEdit(subscription)
                      onOpenChange(false)
                    }}
                    className="h-8 text-xs"
                  >
                    <Edit className="w-3 h-3 mr-1.5" />
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onDelete(subscription)
                      onOpenChange(false)
                    }}
                    className="h-8 text-xs text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3 mr-1.5" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Pricing Overview */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-primary" />
              Pricing Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Current Subscription Cost */}
              <div className="relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-primary/5 to-background p-4 hover:shadow-md transition-all">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10" />
                <div className="relative space-y-2">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <DollarSign className="w-3 h-3" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider">
                      Current Cost
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold">
                        {subscriptionsApi.formatCurrency(subscription.amount, subscription.currency).replace(/\.00$/, '')}
                      </span>
                      <span className="text-sm text-muted-foreground font-medium">
                        / {subscriptionsApi.getBillingCycleDisplayName(subscription.billingCycle).toLowerCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <TrendingUp className="w-3 h-3" />
                      <span>
                        {subscriptionsApi.formatCurrency(subscription.monthlyEquivalent, subscription.currency)} per month
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Yearly Projection */}
              <div className="relative overflow-hidden rounded-lg border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-4 hover:shadow-md transition-all">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -mr-10 -mt-10" />
                <div className="relative space-y-2">
                  <div className="flex items-center gap-1.5 text-primary">
                    <Calendar className="w-3 h-3" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider">
                      Yearly Estimate
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-2xl font-bold text-primary">
                      {subscriptionsApi.formatCurrency(subscription.yearlyEstimate, subscription.currency).replace(/\.00$/, '')}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Based on {subscriptionsApi.getBillingCycleDisplayName(subscription.billingCycle).toLowerCase()} billing
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Spent Card */}
            <div className="rounded-lg border border-border bg-gradient-to-br from-muted/50 to-muted/20 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-background border border-border">
                    <CreditCard className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Total Spent to Date</p>
                    <p className="text-lg font-bold mt-0.5">
                      {subscriptionsApi.formatCurrency(subscription.totalSpent, subscription.currency)}
                    </p>
                  </div>
                </div>
                {subscription.totalSpent > 0 && (
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground">Since</p>
                    <p className="text-xs font-medium">{formatDate(subscription.startDate)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Billing Schedule */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              Billing Schedule
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-background border border-border">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Start Date</p>
                    <p className="text-xs font-semibold mt-0.5">{formatDate(subscription.startDate)}</p>
                  </div>
                </div>
              </div>

              {hasValue(subscription.nextBillingDate) && (
                <div className="flex items-center justify-between p-3 rounded-lg border-2 border-primary/20 bg-primary/5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-primary/10 border border-primary/20">
                      <Clock className="w-3 h-3 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Next Billing Date</p>
                      <p className="text-xs font-semibold mt-0.5">{formatDate(subscription.nextBillingDate)}</p>
                    </div>
                  </div>
                  {subscription.daysUntilNextBilling !== undefined && subscription.daysUntilNextBilling !== null && (
                    <Badge variant="secondary" className="text-[10px] font-semibold px-2 py-0.5">
                      {subscription.daysUntilNextBilling === 0
                        ? "Due Today"
                        : subscription.daysUntilNextBilling === 1
                        ? "Due Tomorrow"
                        : `in ${subscription.daysUntilNextBilling} days`}
                    </Badge>
                  )}
                </div>
              )}

              {hasValue(subscription.trialEndDate) && (
                <div className="flex items-center justify-between p-3 rounded-lg border border-blue-500/20 bg-blue-500/5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-blue-500/10 border border-blue-500/20">
                      <Clock className="w-3 h-3 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Trial Ends</p>
                      <p className="text-xs font-semibold mt-0.5">{formatDate(subscription.trialEndDate)}</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px] px-2 py-0.5">Trial Period</Badge>
                </div>
              )}

              {hasValue(subscription.endDate) && (
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-background border border-border">
                      <XCircle className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">End Date</p>
                      <p className="text-xs font-semibold mt-0.5">{formatDate(subscription.endDate)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notifications */}
          {subscription.notifyBeforeBilling && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-primary" />
                  Notifications
                </h3>
                <div className="flex items-center gap-2 p-3 rounded-lg border border-border bg-muted/30">
                  <div className="p-1.5 rounded-md bg-primary/10 border border-primary/20">
                    <Bell className="w-3 h-3 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">Billing Reminders Enabled</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Notifies {subscription.notifyDaysBefore} {subscription.notifyDaysBefore === 1 ? 'day' : 'days'} before billing
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Additional Details */}
          {(hasValue(subscription.description) || hasValue(subscription.notes) || (subscription.tags && subscription.tags.length > 0)) && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-primary" />
                  Additional Details
                </h3>
                <div className="space-y-2">
                  {hasValue(subscription.description) && (
                    <div className="p-3 rounded-lg border border-border bg-muted/30">
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                        Description
                      </p>
                      <p className="text-xs">{subscription.description}</p>
                    </div>
                  )}

                  {hasValue(subscription.notes) && (
                    <div className="p-3 rounded-lg border border-border bg-muted/30">
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                        Notes
                      </p>
                      <p className="text-xs">{subscription.notes}</p>
                    </div>
                  )}

                  {subscription.tags && subscription.tags.length > 0 && (
                    <div className="p-3 rounded-lg border border-border bg-muted/30">
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
                        Tags
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {subscription.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-[10px] font-medium px-2 py-0.5">
                            <Tag className="w-2.5 h-2.5 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Quick Actions */}
          {(hasValue(subscription.websiteUrl) || hasValue(subscription.cancellationUrl)) && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-1.5">
                  <LinkIcon className="w-4 h-4 text-primary" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {hasValue(subscription.websiteUrl) && (
                    <Button
                      variant="outline"
                      className=" justify-center hover:bg-primary/5 hover:border-primary/20 transition-all"
                      onClick={() => window.open(subscription.websiteUrl, "_blank")}
                        size="sm"
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-primary/10">
                          <ExternalLink className="w-3 h-3 text-primary" />
                        </div>
                       
                          <p className="font-semibold text-xs">Visit Website</p>
                         
                     
                      </div>
                    </Button>
                  )}

                  {hasValue(!subscription.cancellationUrl) && (
                    <Button
                      variant="outline"
                      className=" justify-center  hover:bg-destructive/5 hover:border-destructive/20 transition-all"
                      onClick={() => window.open(subscription.cancellationUrl, "_blank")}
                      size="sm"
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded-md bg-destructive/10">
                          <XCircle className="w-3 h-3 text-destructive" />
                        </div>
                    
                          <p className="font-semibold text-xs text-destructive">Cancel Subscription</p>
                     
                       
                      </div>
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Metadata Footer */}
          <Separator />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
            <div className="space-y-0.5">
              <p className="text-[10px] text-muted-foreground">Created</p>
              <p className="text-[10px] font-medium">{formatDateTime(subscription.createdAt)}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] text-muted-foreground">Updated</p>
              <p className="text-[10px] font-medium">{formatDateTime(subscription.updatedAt)}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] text-muted-foreground">Source</p>
              <p className="text-[10px] font-medium capitalize">
                {subscription.sourceType.toLowerCase().replace('_', ' ')}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] text-muted-foreground">Billing</p>
              <p className="text-[10px] font-medium">
                {subscriptionsApi.getBillingCycleDisplayName(subscription.billingCycle)}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
