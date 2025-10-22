"use client"

import * as React from "react"
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter
} from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import {
  Crown,
  Star,
  TrendingUp,
  Users,
  CheckCircle,
  X,
  ExternalLink,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { UserPlan, SubscriptionPlan } from "@/lib/types"

export interface PlanLimitError {
  code: string
  message: string
  details: {
    feature: string
    currentCount: number
    limit: number
    planType: UserPlan
    upgradeRequired: boolean
  }
}

interface PlanLimitDialogProps {
  open: boolean
  onClose: () => void
  error: PlanLimitError
  availablePlans?: SubscriptionPlan[]
  onUpgrade?: (planType: UserPlan) => void
  isUpgrading?: boolean
}

const PLAN_ICONS = {
  FREE: Users,
  PRO: Crown,
  ULTIMATE: Star
} as const

const PLAN_COLORS = {
  FREE: "text-blue-500",
  PRO: "text-yellow-500",
  ULTIMATE: "text-purple-500"
} as const

const FEATURE_LABELS = {
  maxWallets: "Wallets",
  maxAccounts: "Accounts",
  maxTransactions: "Transactions",
  maxCategories: "Categories",
  maxBudgets: "Budgets",
  maxGoals: "Goals"
} as const

export function PlanLimitDialog({
  open,
  onClose,
  error,
  availablePlans = [],
  onUpgrade,
  isUpgrading = false
}: PlanLimitDialogProps) {
  const { details } = error
  const featureLabel = FEATURE_LABELS[details.feature as keyof typeof FEATURE_LABELS] || details.feature
  const currentPlanIcon = PLAN_ICONS[details.planType]
  const currentPlanColor = PLAN_COLORS[details.planType]

  // Get upgrade options (plans above current plan)
  const upgradeOptions = React.useMemo(() => {
    const planHierarchy = { FREE: 0, PRO: 1, ULTIMATE: 2 }
    const currentLevel = planHierarchy[details.planType]

    return availablePlans
      .filter(plan => planHierarchy[plan.type] > currentLevel)
      .sort((a, b) => planHierarchy[a.type] - planHierarchy[b.type])
  }, [availablePlans, details.planType])

  const progressPercentage = Math.min((details.currentCount / details.limit) * 100, 100)

  const handleUpgrade = (planType: UserPlan) => {
    if (onUpgrade) {
      onUpgrade(planType)
    }
  }

  const getPlanFeatureValue = (plan: SubscriptionPlan, feature: string) => {
    const features = plan.features as Record<string, unknown>
    const value = features[feature]
    if (typeof value === 'number' && value === -1) {
      return "Unlimited"
    }
    if (typeof value === 'number' || typeof value === 'string') {
      return value.toString()
    }
    return "N/A"
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      closeOnOverlayClick={false}
      closeOnEscape={!isUpgrading}
    >
      <ModalHeader>
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg bg-red-100 dark:bg-red-900/20"
          )}>
            <X className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <ModalTitle className="text-xl">
              {featureLabel} Limit Reached
            </ModalTitle>
            <ModalDescription>
              You've reached your {details.planType.toLowerCase()} plan limit
            </ModalDescription>
          </div>
        </div>
      </ModalHeader>

      <ModalBody className="space-y-6">
        {/* Current Usage Card */}
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={cn("p-1.5 rounded-md bg-muted", currentPlanColor)}>
                  {React.createElement(currentPlanIcon, { className: "w-4 h-4" })}
                </div>
                <span className="font-medium text-sm">{details.planType} Plan</span>
              </div>
              <Badge variant="destructive" className="text-xs">
                Limit Exceeded
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current {featureLabel}</span>
                <span className="font-medium">
                  {details.currentCount} / {details.limit}
                </span>
              </div>
              <Progress
                value={progressPercentage}
                className="h-2 bg-red-100 dark:bg-red-900/20"
              />
              <p className="text-xs text-red-600 dark:text-red-400">
                You're trying to add {featureLabel.toLowerCase()} #{details.currentCount + 1},
                but your plan only allows {details.limit}.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Options */}
        {upgradeOptions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <h3 className="font-semibold text-sm">Upgrade to Continue</h3>
            </div>

            <div className="grid gap-3">
              {upgradeOptions.map((plan) => {
                const PlanIcon = PLAN_ICONS[plan.type]
                const planColor = PLAN_COLORS[plan.type]
                const featureValue = getPlanFeatureValue(plan, details.feature)

                return (
                  <Card
                    key={plan.type}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-md border-2",
                      "hover:border-primary/20 hover:bg-accent/5",
                      plan.popular && "border-primary/30 ring-1 ring-primary/20"
                    )}
                    onClick={() => handleUpgrade(plan.type)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn("p-2 rounded-lg bg-muted", planColor)}>
                            <PlanIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{plan.name}</h4>
                              {plan.popular && (
                                <Badge variant="secondary" className="text-xs">
                                  Most Popular
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {featureValue} {featureLabel.toLowerCase()}
                              {featureValue !== "Unlimited" && featureValue !== "N/A" &&
                                ` (${parseInt(featureValue) - details.currentCount} more)`
                              }
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-bold">
                            ${plan.monthlyPrice}
                            <span className="text-sm font-normal text-muted-foreground">/mo</span>
                          </div>
                          {plan.yearlyDiscount > 0 && (
                            <div className="text-xs text-green-600">
                              Save {plan.yearlyDiscount}% yearly
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>Instant access to all features</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Benefits Section */}
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Why upgrade?</span>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Add unlimited or more {featureLabel.toLowerCase()}</li>
            <li>• Access to advanced features and insights</li>
            <li>• Priority customer support</li>
            <li>• Export your data and create custom reports</li>
          </ul>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isUpgrading}
        >
          Cancel
        </Button>

        {upgradeOptions.length > 0 && (
          <Button
            onClick={() => handleUpgrade(upgradeOptions[0].type)}
            disabled={isUpgrading}
            className="gap-2"
          >
            {isUpgrading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Upgrading...
              </>
            ) : (
              <>
                <Crown className="w-4 h-4" />
                Upgrade to {upgradeOptions[0].name}
              </>
            )}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  )
}

// Hook to manage plan limit dialog state
export function usePlanLimitDialog() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [error, setError] = React.useState<PlanLimitError | null>(null)

  const showDialog = React.useCallback((limitError: PlanLimitError) => {
    setError(limitError)
    setIsOpen(true)
  }, [])

  const hideDialog = React.useCallback(() => {
    setIsOpen(false)
    setError(null)
  }, [])

  return {
    isOpen,
    error,
    showDialog,
    hideDialog
  }
}