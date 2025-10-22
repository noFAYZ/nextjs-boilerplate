"use client"

import * as React from "react"
import {
  Calendar,
  DollarSign,
  ExternalLink,
  Edit,
  MoreHorizontal,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import type { UserSubscription } from "@/lib/types/subscription"
import { subscriptionsApi } from "@/lib/services/subscriptions-api"
import { SolarCheckCircleBoldDuotone } from "../icons/icons"

interface SubscriptionCardProps {
  subscription: UserSubscription
  onEdit?: (s: UserSubscription) => void
  onDelete?: (s: UserSubscription) => void
  onClick?: (s: UserSubscription) => void
}

export function SubscriptionCard({
  subscription,
  onEdit,
  onDelete,
  onClick,
}: SubscriptionCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const statusColor: Record<string, string> = {
    ACTIVE: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    TRIAL: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
    CANCELLED: "bg-gray-500/10 text-gray-500 border border-gray-500/20",
    EXPIRED: "bg-gray-500/10 text-gray-500 border border-gray-500/20",
    PAYMENT_FAILED: "bg-red-500/10 text-red-500 border border-red-500/20",
  }

  const getStatusIcon = () => {
    switch (subscription.status) {
      case "ACTIVE":
        return <SolarCheckCircleBoldDuotone className="w-3.5 h-3.5" />
      case "TRIAL":
        return <Clock className="w-3.5 h-3.5" />
      case "CANCELLED":
      case "EXPIRED":
        return <XCircle className="w-3.5 h-3.5" />
      case "PAYMENT_FAILED":
        return <AlertCircle className="w-3.5 h-3.5" />
      default:
        return null
    }
  }

  return (
    <Card
      onClick={() => onClick?.(subscription)}
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border border-border bg-gradient-to-b from-muted/50 to-muted/30 p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-[2px]",
        "cursor-pointer"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-10 w-10 ring-1 ring-border">
            {subscription.logoUrl ? (
              <AvatarImage src={subscription.logoUrl} alt={subscription.name} />
            ) : (
              <AvatarFallback className="bg-muted text-xs font-bold uppercase">
                {subscription.name.slice(0, 2)}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="min-w-0">
            <h3 className="font-semibold text-sm truncate flex gap-2">{subscription.name}  {subscription.autoRenew && (
        <div className=" text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20 ">
          Auto-renew
        </div>
      )}</h3>
            <p className="text-xs text-muted-foreground truncate">
              {subscription.merchantName || subscription.description || "—"}
            </p>
                  {/* Footer */}
    
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 h-7 w-7 transition-opacity"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(subscription)
                }}
              >
                <Edit className="mr-2 w-4 h-4" /> Edit
              </DropdownMenuItem>
            )}
            {subscription.websiteUrl && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(subscription.websiteUrl, "_blank")
                }}
              >
                <ExternalLink className="mr-2 w-4 h-4" /> Visit Website
              </DropdownMenuItem>
            )}
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(subscription)
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 w-4 h-4" /> Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
           
            <span className="font-bold text-lg">
              {subscriptionsApi.formatCurrency(subscription.amount, subscription.currency)}
            </span>
            <span className="text-xs text-muted-foreground">
              /{subscriptionsApi.getBillingCycleDisplayName(subscription.billingCycle)}
            </span>
          </div>

          <Badge
            className={cn(
              "flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full",
              statusColor[subscription.status]
            )}
          >
            {getStatusIcon()}
            {subscription.status.toLowerCase()}
          </Badge>
        </div>

        {subscription.nextBillingDate && (
          <div className="flex items-center justify-between text-xs border-t border-border/60 pt-2 mt-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              Next billing
            </div>
            <span className="font-medium">{formatDate(subscription.nextBillingDate)}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/60 pt-2">
          <span className="text-xs">Total Spent</span>
          <span className="font-semibold text-foreground">
            {subscriptionsApi.formatCurrency(subscription.totalSpent, subscription.currency)}
          </span>
        </div>
      </div>


    </Card>
  )
}
