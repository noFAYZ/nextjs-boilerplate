"use client"

import * as React from "react"
import { Check, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PricingFeature {
  name: string
  included: boolean
  description?: string
}

interface PricingPlan {
  id: string
  name: string
  description: string
  price: {
    monthly: number
    yearly: number
  }
  features: PricingFeature[]
  highlighted?: boolean
  popular?: boolean
  buttonText?: string
  buttonVariant?: "default" | "outline" | "secondary"
}

interface PricingTableProps {
  plans: PricingPlan[]
  billingCycle: "monthly" | "yearly"
  currency?: string
  onSelectPlan: (planId: string) => void
  className?: string
}

export function PricingTable({
  plans,
  billingCycle,
  currency = "$",
  onSelectPlan,
  className,
}: PricingTableProps) {
  return (
    <div className={cn("grid gap-8 lg:grid-cols-3", className)}>
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={cn(
            "relative rounded-lg border p-6 shadow-sm",
            plan.highlighted && "border-primary shadow-lg ring-1 ring-primary",
            plan.popular && "scale-105"
          )}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge variant="default" className="px-3 py-1">
                Most Popular
              </Badge>
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {plan.description}
            </p>
            <div className="mt-4">
              <span className="text-4xl font-bold">
                {currency}{plan.price[billingCycle]}
              </span>
              <span className="text-sm text-muted-foreground">
                /{billingCycle === "monthly" ? "month" : "year"}
              </span>
            </div>
          </div>

          <Button
            onClick={() => onSelectPlan(plan.id)}
            variant={plan.buttonVariant || (plan.highlighted ? "default" : "outline")}
            className="mb-6 w-full"
          >
            {plan.buttonText || "Get Started"}
          </Button>

          <div className="space-y-3">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-0.5">
                  {feature.included ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <span className={cn(
                    "text-sm",
                    !feature.included && "text-muted-foreground line-through"
                  )}>
                    {feature.name}
                  </span>
                  {feature.description && (
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

interface PricingBillingToggleProps {
  billingCycle: "monthly" | "yearly"
  onToggle: (cycle: "monthly" | "yearly") => void
  yearlyDiscount?: string
  className?: string
}

export function PricingBillingToggle({
  billingCycle,
  onToggle,
  yearlyDiscount,
  className,
}: PricingBillingToggleProps) {
  return (
    <div className={cn("flex items-center justify-center gap-4", className)}>
      <button
        onClick={() => onToggle("monthly")}
        className={cn(
          "text-sm font-medium transition-colors",
          billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground"
        )}
      >
        Monthly
      </button>
      
      <div className="relative">
        <button
          onClick={() => onToggle(billingCycle === "monthly" ? "yearly" : "monthly")}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
            billingCycle === "yearly" ? "bg-primary" : "bg-muted"
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-background transition-transform",
              billingCycle === "yearly" ? "translate-x-6" : "translate-x-1"
            )}
          />
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onToggle("yearly")}
          className={cn(
            "text-sm font-medium transition-colors",
            billingCycle === "yearly" ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Yearly
        </button>
        {yearlyDiscount && (
          <Badge variant="secondary" className="text-xs">
            {yearlyDiscount}
          </Badge>
        )}
      </div>
    </div>
  )
}

export function usePricing(defaultCycle: "monthly" | "yearly" = "monthly") {
  const [billingCycle, setBillingCycle] = React.useState(defaultCycle)

  const toggleBillingCycle = React.useCallback(() => {
    setBillingCycle(current => current === "monthly" ? "yearly" : "monthly")
  }, [])

  const setBillingCycleCallback = React.useCallback((cycle: "monthly" | "yearly") => {
    setBillingCycle(cycle)
  }, [])

  return {
    billingCycle,
    setBillingCycle: setBillingCycleCallback,
    toggleBillingCycle,
  }
}