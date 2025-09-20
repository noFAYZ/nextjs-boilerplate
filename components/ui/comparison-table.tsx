"use client"

import * as React from "react"
import { Check, X, Star, Zap, Crown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface PlanFeature {
  id: string
  name: string
  description?: string
  category?: string
}

interface Plan {
  id: string
  name: string
  description: string
  price: {
    monthly: number
    yearly?: number
  }
  popular?: boolean
  enterprise?: boolean
  features: Record<string, boolean | string | number>
  buttonText?: string
  buttonVariant?: "default" | "outline" | "secondary" | "success" | "premium" | "enterprise"
  onSelect?: () => void
}

interface ComparisonTableProps {
  plans: Plan[]
  features: PlanFeature[]
  className?: string
  showYearly?: boolean
  highlightDifferences?: boolean
  maxColumns?: number
}

const getPlanIcon = (plan: Plan) => {
  if (plan.enterprise) return <Crown className="size-4" />
  if (plan.popular) return <Star className="size-4" />
  return <Zap className="size-4" />
}

const formatPrice = (price: number, yearly = false) => {
  if (price === 0) return "Free"
  const amount = yearly ? price * 12 * 0.8 : price // 20% yearly discount
  return `$${(amount)?.toFixed(0)}${yearly ? "/year" : "/month"}`
}

const formatFeatureValue = (value: boolean | string | number) => {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="size-4 text-green-500 mx-auto" />
    ) : (
      <X className="size-4 text-muted-foreground mx-auto" />
    )
  }
  return <span className="text-center block">{value}</span>
}

const getFeatureDisplay = (feature: PlanFeature, plans: Plan[], highlightDifferences: boolean) => {
  const values = plans.map(plan => plan.features[feature.id])
  const hasVariation = values.some(v => v !== values[0])
  
  return {
    shouldHighlight: highlightDifferences && hasVariation,
    values
  }
}

export function ComparisonTable({
  plans,
  features,
  className,
  showYearly = false,
  highlightDifferences = true,
  maxColumns = 4,
}: ComparisonTableProps) {
  const [isYearly, setIsYearly] = React.useState(false)
  const displayPlans = plans.slice(0, maxColumns)

  // Group features by category
  const groupedFeatures = React.useMemo(() => {
    const groups: Record<string, PlanFeature[]> = {}
    features.forEach(feature => {
      const category = feature.category || "Features"
      if (!groups[category]) groups[category] = []
      groups[category].push(feature)
    })
    return groups
  }, [features])

  return (
    <div className={cn("space-y-6", className)}>
      {/* Pricing Toggle */}
      {showYearly && (
        <div className="flex justify-center">
          <div className="flex items-center gap-4 p-1 bg-muted rounded-lg">
            <button
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                !isYearly 
                  ? "bg-background shadow-sm text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setIsYearly(false)}
            >
              Monthly
            </button>
            <button
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2",
                isYearly 
                  ? "bg-background shadow-sm text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setIsYearly(true)}
            >
              Yearly
              <Badge variant="secondary" className="text-xs">
                Save 20%
              </Badge>
            </button>
          </div>
        </div>
      )}

      {/* Plans Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `300px repeat(${displayPlans.length}, 1fr)` }}>
        {/* Empty header cell */}
        <div />
        
        {/* Plan cards */}
        {displayPlans.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "relative overflow-visible",
              plan.popular && "ring-2 ring-primary",
              plan.enterprise && "ring-2 ring-purple-500 bg-gradient-to-b from-purple-50/50 to-background dark:from-purple-950/20"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="default" className="px-3">
                  Most Popular
                </Badge>
              </div>
            )}
            {plan.enterprise && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="secondary" className="px-3 bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                  Enterprise
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center space-y-4 pb-4">
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  {getPlanIcon(plan)}
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                </div>
                <p className="text-xs text-muted-foreground">{plan.description}</p>
              </div>
              
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {formatPrice(plan.price.monthly, isYearly)}
                </div>
                {isYearly && plan.price.yearly && (
                  <div className="text-sm text-muted-foreground">
                    <span className="line-through">${Number(plan.price.monthly * 12)?.toFixed()}/year</span>
                  </div>
                )}
              </div>
              
              <Button
                variant={plan.buttonVariant || (plan.popular ? "default" : "outline")}
                className="w-full"
                size={'xs'}
                onClick={plan.onSelect}
              >
                {plan.buttonText || "Get Started"}
              </Button>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Feature Comparison */}
      <div className="border rounded-lg overflow-hidden">
        {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
          <div key={category}>
            {/* Category Header */}
            <div className="bg-muted/50 px-6 py-3 border-b">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                {category}
              </h3>
            </div>
            
            {/* Category Features */}
            {categoryFeatures.map((feature, index) => {
              const { shouldHighlight, values } = getFeatureDisplay(feature, displayPlans, highlightDifferences)
              
              return (
                <div
                  key={feature.id}
                  className={cn(
                    "grid gap-4 px-6 py-4 border-b last:border-b-0",
                    index % 2 === 0 && "bg-muted/20",
                    shouldHighlight && "bg-yellow-50/50 dark:bg-yellow-950/10"
                  )}
                  style={{ gridTemplateColumns: `300px repeat(${displayPlans.length}, 1fr)` }}
                >
                  {/* Feature name */}
                  <div className="flex flex-col justify-center">
                    <div className="font-medium text-sm">{feature.name}</div>
                    {feature.description && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {feature.description}
                      </div>
                    )}
                  </div>
                  
                  {/* Feature values */}
                  {values.map((value, planIndex) => (
                    <div key={planIndex} className="flex items-center justify-center py-2">
                      {formatFeatureValue(value)}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="text-center text-sm text-muted-foreground">
        <p>All plans include 30-day money-back guarantee. No setup fees.</p>
        {highlightDifferences && (
          <p className="mt-1">
            <span className="inline-block w-3 h-3 bg-yellow-100 dark:bg-yellow-950/20 rounded mr-2" />
            Highlighted rows show differences between plans
          </p>
        )}
      </div>
    </div>
  )
}

// Preset data for common SaaS pricing
export const saasPricingPlans: Plan[] = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for personal use and getting started",
    price: { monthly: 0 },
    features: {
      wallets: 3,
      transactions: "1,000/month",
      users: 1,
      support: "Community",
      api: false,
      advanced_charts: false,
      custom_categories: false,
      team_sharing: false,
      priority_support: false,
      white_label: false,
      sso: false,
      advanced_security: false,
    },
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
  },
  {
    id: "pro",
    name: "Pro",
    description: "Best for individuals and small teams",
    price: { monthly: 19, yearly: 15 },
    popular: true,
    features: {
      wallets: "Unlimited",
      transactions: "Unlimited",
      users: 5,
      support: "Email",
      api: true,
      advanced_charts: true,
      custom_categories: true,
      team_sharing: true,
      priority_support: false,
      white_label: false,
      sso: false,
      advanced_security: true,
    },
    buttonText: "Start Pro Trial",
  },
  {
    id: "business",
    name: "Business",
    description: "Ideal for growing businesses and teams",
    price: { monthly: 49, yearly: 39 },
    features: {
      wallets: "Unlimited",
      transactions: "Unlimited",
      users: 25,
      support: "Priority",
      api: true,
      advanced_charts: true,
      custom_categories: true,
      team_sharing: true,
      priority_support: true,
      white_label: true,
      sso: false,
      advanced_security: true,
    },
    buttonText: "Start Business Trial",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations with advanced needs",
    price: { monthly: 99, yearly: 79 },
    enterprise: true,
    features: {
      wallets: "Unlimited",
      transactions: "Unlimited",
      users: "Unlimited",
      support: "Dedicated",
      api: true,
      advanced_charts: true,
      custom_categories: true,
      team_sharing: true,
      priority_support: true,
      white_label: true,
      sso: true,
      advanced_security: true,
    },
    buttonText: "Contact Sales",
    buttonVariant: "secondary" as const,
  },
]

export const saasPricingFeatures: PlanFeature[] = [
  // Core Features
  { id: "wallets", name: "Crypto Wallets", category: "Core Features" },
  { id: "transactions", name: "Monthly Transactions", category: "Core Features" },
  { id: "users", name: "Team Members", category: "Core Features" },
  
  // Analytics & Reporting
  { id: "advanced_charts", name: "Advanced Charts", category: "Analytics" },
  { id: "custom_categories", name: "Custom Categories", category: "Analytics" },
  { id: "api", name: "API Access", category: "Analytics" },
  
  // Collaboration
  { id: "team_sharing", name: "Team Sharing", category: "Collaboration" },
  { id: "white_label", name: "White Label", category: "Collaboration" },
  
  // Support & Security
  { id: "support", name: "Support Level", category: "Support" },
  { id: "priority_support", name: "Priority Support", category: "Support" },
  { id: "advanced_security", name: "Advanced Security", category: "Security" },
  { id: "sso", name: "Single Sign-On (SSO)", category: "Security" },
]

export type { Plan, PlanFeature, ComparisonTableProps }