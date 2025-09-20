"use client"

import React from 'react';
import { Button } from './button';
import { PlanLimitDialog, usePlanLimitDialog, type PlanLimitError } from './plan-limit-dialog';
import { handlePlanLimitError } from '@/lib/utils/plan-limit-handler';

// Mock data for testing
const mockPlans = [
  {
    type: 'PRO' as const,
    name: 'Pro Plan',
    description: 'For growing businesses',
    monthlyPrice: 29,
    yearlyPrice: 290,
    yearlyDiscount: 17,
    popular: true,
    features: {
      maxWallets: 10,
      maxAccounts: 50,
      maxTransactions: 10000,
      maxCategories: 100,
      maxBudgets: 20,
      maxGoals: 10,
      aiInsights: true,
      advancedReports: true,
      prioritySupport: true,
      apiAccess: true,
      exportData: true,
      customCategories: true,
      bankSync: true,
      multiCurrency: true,
      collaborativeAccounts: false,
      investmentTracking: true,
      taxReporting: false,
      mobileApp: true,
    }
  },
  {
    type: 'ULTIMATE' as const,
    name: 'Ultimate Plan',
    description: 'For power users',
    monthlyPrice: 99,
    yearlyPrice: 990,
    yearlyDiscount: 17,
    features: {
      maxWallets: -1,
      maxAccounts: -1,
      maxTransactions: -1,
      maxCategories: -1,
      maxBudgets: -1,
      maxGoals: -1,
      aiInsights: true,
      advancedReports: true,
      prioritySupport: true,
      apiAccess: true,
      exportData: true,
      customCategories: true,
      bankSync: true,
      multiCurrency: true,
      collaborativeAccounts: true,
      investmentTracking: true,
      taxReporting: true,
      mobileApp: true,
    }
  }
];

const mockError: PlanLimitError = {
  code: 'WALLET_LIMIT_EXCEEDED',
  message: 'Wallet limit exceeded. Current plan allows 3 wallets.',
  details: {
    feature: 'maxWallets',
    currentCount: 5,
    limit: 3,
    planType: 'FREE',
    upgradeRequired: true
  }
};

// Simulate the exact error structure from your API
const mockApiError = {
  success: false,
  error: {
    code: 'FORBIDDEN',
    message: 'Insufficient permissions',
    details: {
      success: false,
      error: {
        code: 'WALLET_LIMIT_EXCEEDED',
        message: 'Wallet limit exceeded. Current plan allows 3 wallets.',
        details: {
          feature: 'maxWallets',
          currentCount: 5,
          limit: 3,
          planType: 'FREE',
          upgradeRequired: true
        }
      }
    }
  }
};

export function DebugPlanLimit() {
  const planLimitDialog = usePlanLimitDialog();

  const testDirectError = () => {
    planLimitDialog.showDialog(mockError);
  };

  const testApiError = () => {
    const planLimitError = handlePlanLimitError(mockApiError, 'test', planLimitDialog.showDialog);
    console.log('Extracted plan limit error:', planLimitError);
  };

  const handleUpgrade = async (planType: string) => {
    console.log('Upgrading to:', planType);
    // Simulate upgrade process
    await new Promise(resolve => setTimeout(resolve, 2000));
    planLimitDialog.hideDialog();
  };

  return (
    <div className="p-4 space-y-4 border rounded-lg bg-muted/20">
      <h3 className="text-lg font-semibold">Plan Limit Debug Tool</h3>
      <div className="flex gap-2">
        <Button onClick={testDirectError} variant="outline">
          Test Direct Error
        </Button>
        <Button onClick={testApiError} variant="outline">
          Test API Error
        </Button>
      </div>

      {planLimitDialog.error && (
        <PlanLimitDialog
          open={planLimitDialog.isOpen}
          onClose={planLimitDialog.hideDialog}
          error={planLimitDialog.error}
          availablePlans={mockPlans}
          onUpgrade={handleUpgrade}
          isUpgrading={false}
        />
      )}
    </div>
  );
}