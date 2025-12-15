"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Calendar,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import type { UserSubscription } from "@/lib/types/subscription"
import { subscriptionsApi } from "@/lib/services/subscriptions-api"
import { SolarCheckCircleBoldDuotone } from "../icons/icons"
import { getLogoUrl } from "@/lib/services/logo-service"
import { SubscriptionCardSkeleton } from "./subscription-card-skeleton"
import { useSubscriptionUIStore } from "@/lib/stores/subscription-ui-store"
import { CurrencyDisplay } from "../ui/currency-display"

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
  const router = useRouter()
  const deletingSubscriptionIds = useSubscriptionUIStore((state) => state.deletingSubscriptionIds)

  // Check if this subscription is being deleted
  const isDeleting = deletingSubscriptionIds.includes(subscription.id)

  // Show skeleton if deleting
  if (isDeleting) {
    return <SubscriptionCardSkeleton />
  }

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

  const handleCardClick = () => {
    onClick?.(subscription)
    router.push(`/subscriptions/${subscription.id}`)
  }

  return (
    <>
      <Card
        onClick={handleCardClick}
        interactive
        className={cn(
          "group relative flex flex-col justify-between border border-border/50 ",
          "cursor-pointer"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-10 w-10 ring-1 ring-border">
              {subscription.websiteUrl ? (
                <AvatarImage src={getLogoUrl(subscription.websiteUrl) || ""} alt={subscription.name} />
              ) : (
                <AvatarFallback className="bg-muted text-xs font-bold uppercase">
                  {subscription.name.slice(0, 2)}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="min-w-0">
              <h3 className="font-semibold text-sm truncate flex gap-2">
                {subscription.name}
                {subscription.autoRenew && (
                  <div className="text-[10px] bg-primary/10 text-primary px-1 rounded-full border border-primary/20">
                    Auto-renew
                  </div>
                )}
                       <Badge
              className={cn(
                "flex items-center gap-1 px-1  text-[10px] font-medium rounded-full",
                statusColor[subscription.status]
              )}
            >
              {getStatusIcon()}
              {subscription.status.toLowerCase()}
            </Badge>
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                {subscription.merchantName || subscription.description || "—"}
              </p>
              
            </div>
     
          </div>

          <div className="flex flex-col items-end justify-between">
            <div className="flex items-center gap-1.5">
             
             
                <CurrencyDisplay amountUSD={subscription.amount} variant="lg" className="font-semibold" />
          
              
            </div>
<span className="text-xs text-muted-foreground">
                {subscriptionsApi.getBillingCycleDisplayName(subscription.billingCycle)}
              </span>
  
          </div>
        </div>

        {/* Content 
        <div className="mt-4 space-y-3">
       

          {subscription.nextBillingDate && (
            <div className="flex items-center justify-between text-xs border-t border-border/50 pt-2 mt-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                Next billing
              </div>
              <span className="font-medium">{formatDate(subscription.nextBillingDate)}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/50 pt-2">
            <span className="text-xs">Total Spent</span>
            <span className="font-semibold text-foreground">
              {subscriptionsApi.formatCurrency(subscription.totalSpent, subscription.currency)}
            </span>
          </div>
        </div>*/}
      </Card>
    </>
  )
}
