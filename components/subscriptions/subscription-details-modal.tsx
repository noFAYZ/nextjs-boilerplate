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
import { motion } from "framer-motion"
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

  const formatDate = (dateString?: string | null) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "—"

  const formatDateTime = (dateString?: string | null) =>
    dateString
      ? new Date(dateString).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—"

  const statusStyles: Record<string, string> = {
    ACTIVE: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
    TRIAL: "bg-blue-500/10 text-blue-600 border border-blue-500/20",
    CANCELLED: "bg-gray-500/10 text-gray-500 border border-gray-500/20",
    EXPIRED: "bg-gray-500/10 text-gray-500 border border-gray-500/20",
    PAYMENT_FAILED: "bg-red-500/10 text-red-500 border border-red-500/20",
    PAUSED: "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20",
  }

  const StatusIcon = () => {
    switch (subscription.status) {
      case "ACTIVE":
        return <SolarCheckCircleBoldDuotone className="size-3" />
      case "TRIAL":
        return <Clock className="size-3" />
      case "CANCELLED":
      case "EXPIRED":
        return <XCircle className="size-3" />
      case "PAYMENT_FAILED":
        return <AlertCircle className="size-3" />
      default:
        return null
    }
  }

  const hasValue = (v: any) =>
    v !== null && v !== undefined && !(typeof v === "string" && v.trim() === "")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-2xl overflow-y-auto p-0 backdrop-blur-md border-border/50",
          ""
        )}
      >
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-br from-primary/15 via-primary/10 to-background p-5 rounded-t-xl"
        >
          <DialogHeader className="space-y-3">
            <div className="flex items-start justify-between">
              {/* Info */}
              <div className="flex items-center gap-4 min-w-0">
                <Avatar className="h-14 w-14 ring-2 ring-background shadow-md">
                  <AvatarImage
                    src={subscription.logoUrl || getLogoUrl(subscription.websiteUrl)}
                    alt={subscription.name}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {subscription.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <DialogTitle className="text-xl font-semibold truncate">
                    {subscription.name}
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground truncate">
                    {subscription.merchantName || "Manual Entry"}
                  </p>

                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <Badge
                      className={cn(
                        "flex items-center gap-1 text-xs font-medium px-2 py-0.5",
                        statusStyles[subscription.status]
                      )}
                    >
                      <StatusIcon />
                      {subscription.status.charAt(0) +
                        subscription.status.slice(1).toLowerCase()}
                    </Badge>

                    {subscription.autoRenew && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-background/80 flex items-center gap-1"
                      >
                        <RefreshCw className="size-3" /> Auto-renew
                      </Badge>
                    )}

                    {subscription.category && (
                      <Badge variant="outline" className="text-xs bg-background/80">
                        {subscriptionsApi.getCategoryDisplayName(
                          subscription.category
                        )}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onEdit(subscription)
                      onOpenChange(false)
                    }}
                  >
                    <Edit className="size-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      onDelete(subscription)
                      onOpenChange(false)
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>
        </motion.div>

        {/* BODY */}
        <div className="p-5 space-y-5">
          {/* Pricing Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-xl border border-border bg-gradient-to-br from-primary/5 to-background p-4 shadow-sm"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="size-4" />
                <span className="text-xs uppercase font-semibold tracking-wide">
                  Current Cost
                </span>
              </div>
              <div className="mt-1">
                <span className="text-2xl font-bold">
                  {subscriptionsApi
                    .formatCurrency(subscription.amount, subscription.currency)
                    .replace(/\.00$/, "")}
                </span>
                <span className="ml-1 text-sm text-muted-foreground">
                  / {subscriptionsApi
                    .getBillingCycleDisplayName(subscription.billingCycle)
                    .toLowerCase()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="size-3" />
                {subscriptionsApi.formatCurrency(
                  subscription.monthlyEquivalent,
                  subscription.currency
                )}{" "}
                per month
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-background p-4 shadow-sm"
            >
              <div className="flex items-center gap-2 text-primary">
                <Calendar className="size-4" />
                <span className="text-xs uppercase font-semibold tracking-wide">
                  Yearly Estimate
                </span>
              </div>
              <p className="text-2xl font-bold mt-1 text-primary">
                {subscriptionsApi
                  .formatCurrency(subscription.yearlyEstimate, subscription.currency)
                  .replace(/\.00$/, "")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Based on{" "}
                {subscriptionsApi
                  .getBillingCycleDisplayName(subscription.billingCycle)
                  .toLowerCase()}{" "}
                billing
              </p>
            </motion.div>
          </div>

          {/* Total Spent */}
          <div className="rounded-xl border border-border/60 bg-muted/40 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-background border">
                <CreditCard className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Spent</p>
                <p className="text-lg font-semibold">
                  {subscriptionsApi.formatCurrency(
                    subscription.totalSpent,
                    subscription.currency
                  )}
                </p>
              </div>
            </div>
            {subscription.startDate && (
              <div className="text-right text-xs text-muted-foreground">
                Since {formatDate(subscription.startDate)}
              </div>
            )}
          </div>

          <Separator />

          {/* Billing Schedule */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="size-4 text-primary" /> Billing Schedule
            </h3>

            <div className="grid gap-3">
              <BillingItem label="Start Date" value={formatDate(subscription.startDate)} />
              {subscription.nextBillingDate && (
                <BillingItem
                  label="Next Billing"
                  highlight
                  value={formatDate(subscription.nextBillingDate)}
                  badge={
                    subscription.daysUntilNextBilling === 0
                      ? "Due Today"
                      : subscription.daysUntilNextBilling === 1
                      ? "Due Tomorrow"
                      : `in ${subscription.daysUntilNextBilling} days`
                  }
                />
              )}
              {subscription.endDate && (
                <BillingItem label="End Date" value={formatDate(subscription.endDate)} />
              )}
            </div>
          </div>

          {/* Notifications */}
          {subscription.notifyBeforeBilling && (
            <>
              <Separator />
              <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/30">
                <Bell className="size-4 text-primary" />
                <div>
                  <p className="text-xs font-semibold">Billing Reminder</p>
                  <p className="text-xs text-muted-foreground">
                    Notifies {subscription.notifyDaysBefore} days before billing
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Website */}
          {hasValue(subscription.websiteUrl) && (
            <>
              <Separator />
              <div className="grid sm:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(subscription.websiteUrl!, "_blank")}
                >
                  <ExternalLink className="size-4 mr-1" /> Visit Website
                </Button>
                {hasValue(subscription.cancellationUrl) && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive border-destructive/30"
                    onClick={() =>
                      window.open(subscription.cancellationUrl!, "_blank")
                    }
                  >
                    <XCircle className="size-4 mr-1" /> Cancel Subscription
                  </Button>
                )}
              </div>
            </>
          )}

          {/* Footer */}
          <Separator />
          <div className="grid grid-cols-2 md:grid-cols-4 text-[11px] text-muted-foreground">
            <p>Created: {formatDateTime(subscription.createdAt)}</p>
            <p>Updated: {formatDateTime(subscription.updatedAt)}</p>
            <p>Source: {subscription.sourceType.toLowerCase()}</p>
            <p>Billing: {subscriptionsApi.getBillingCycleDisplayName(subscription.billingCycle)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function BillingItem({
  label,
  value,
  badge,
  highlight = false,
}: {
  label: string
  value: string
  badge?: string
  highlight?: boolean
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg border text-xs",
        highlight ? "border-primary/30 bg-primary/5" : "border-border/60 bg-muted/30"
      )}
    >
      <div>
        <p className="text-muted-foreground">{label}</p>
        <p className="font-medium mt-0.5">{value}</p>
      </div>
      {badge && (
        <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
          {badge}
        </Badge>
      )}
    </div>
  )
}
