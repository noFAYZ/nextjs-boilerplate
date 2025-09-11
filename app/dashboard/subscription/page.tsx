'use client';

import { useEffect, useState } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useSubscription } from '@/lib/hooks/use-subscription';
import { useToast } from '@/lib/hooks/use-toast';
import { 
  Crown, 
  Check, 
  X, 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  Users,
  Star,
  RefreshCw
} from 'lucide-react';
import type { SubscriptionPlan, UpgradeSubscriptionData, CancelSubscriptionData } from '@/lib/types';
import { FailLoader, LogoLoader } from '@/components/icons';

export default function SubscriptionPage() {
  const {
    plans,
    currentSubscription,
    subscriptionHistory,
    paymentHistory,
    usageStats,
    isLoading,
    isInitialized,
    error,
    lastFetched,
    refetch,
    upgradeSubscription,
    cancelSubscription,
  } = useSubscription();

  const { toast } = useToast();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refetch(true); // Force refresh
      toast({
        title: 'Data refreshed',
        description: 'Subscription data has been updated.',
      });
    } catch {
      toast({
        title: 'Refresh failed',
        description: 'Failed to refresh subscription data.',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleUpgrade = async (planType: SubscriptionPlan['type']) => {
    try {
      setIsUpgrading(true);
      const data: UpgradeSubscriptionData = {
        planType,
        billingPeriod: selectedBillingPeriod,
      };

      const response = await upgradeSubscription(data);
      
      if (response.success) {
        toast({
          title: 'Subscription upgraded',
          description: `Successfully upgraded to ${planType} plan.`,
        });
      } else {
        toast({
          title: 'Upgrade failed',
          description: response.error.message,
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Upgrade failed',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleCancel = async (immediately = false) => {
    try {
      setIsCanceling(true);
      const data: CancelSubscriptionData = { immediately };

      const response = await cancelSubscription(data);
      
      if (response.success) {
        toast({
          title: 'Subscription cancelled',
          description: immediately 
            ? 'Your subscription has been cancelled immediately.'
            : 'Your subscription will be cancelled at the end of the billing period.',
        });
      } else {
        toast({
          title: 'Cancellation failed',
          description: response.error.message,
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Cancellation failed',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsCanceling(false);
    }
  };

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((current / limit) * 100, 100);
  };

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case 'PRO':
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 'ULTIMATE':
        return <Star className="w-5 h-5 text-purple-500" />;
      default:
        return <Users className="w-5 h-5 text-blue-500" />;
    }
  };

  if (isLoading && !isInitialized) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-sm py-10 flex justify-center ">
        <div className='flex justify-center items-center content-center space-y-2 flex-col '>
           <LogoLoader className='w-16 h-16'/>
           <CardTitle >Loading...</CardTitle>
           <CardDescription>Loading Subscriptions...</CardDescription>
           </div>
         </Card>
        </div>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-sm py-10 flex justify-center ">
            
            <div className='flex justify-center items-center content-center space-y-2 flex-col '>
              <span className='w-16 h-16 mb-4'><FailLoader /> </span>
              <CardTitle className='text-red-300'>Error</CardTitle>
          
              <CardDescription>{error}</CardDescription>
            </div>
          </Card>
        </div>
      </AuthGuard>
    );
  }

  useEffect(() => {
   console.log('Subscription data initialized or updated:', {
    currentSubscription,
    subscriptionHistory,
    paymentHistory,
    usageStats,
    lastFetched,
   });
  }
  , [isInitialized, isLoading, refetch]);


  return (
    <AuthGuard>
      <div className=" bg-background p-8 relative">
        {/* Loading Overlay for Refresh */}
        {isLoading && isInitialized && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <Card className="p-6">
              <div className="flex items-center space-x-3">
                <LogoLoader className="w-6 h-6" />
                <span className="text-sm font-medium">Refreshing data...</span>
              </div>
            </Card>
          </div>
        )}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1" />
              <div className="">
                <h1 className="text-4xl font-bold">Subscription Management</h1>
                <p className="text-muted-foreground text-lg">
                  Manage your MoneyMappr subscription and billing preferences
                </p>
              </div>
              <div className="flex-1 flex justify-end">
                <div className="flex flex-col items-end space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing || isLoading}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  {lastFetched && isInitialized && (
                    <p className="text-xs text-muted-foreground">
                      Last updated: {new Date(lastFetched).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Current Subscription */}
          {currentSubscription && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getPlanIcon(currentSubscription.currentPlan)}
                  Current Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Plan</p>
                    <p className="text-2xl font-bold">{currentSubscription.currentPlan}</p>
                    <Badge variant={currentSubscription.status === 'ACTIVE' ? 'default' : 'destructive'}>
                      {currentSubscription.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Billing</p>
                    <p className="font-medium">{currentSubscription.billingPeriod}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(currentSubscription.amount, currentSubscription.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Next Billing</p>
                    <p className="font-medium">
                      {currentSubscription.nextBillingDate 
                        ? formatDate(currentSubscription.nextBillingDate)
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Auto-Renewal</p>
                    <p className="font-medium">
                      {currentSubscription.cancelAtPeriodEnd ? 'Disabled' : 'Enabled'}
                    </p>
                    {currentSubscription.cancelAtPeriodEnd && (
                      <p className="text-sm text-destructive">
                        Ends {formatDate(currentSubscription.endDate)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => handleCancel(false)}
                    disabled={isCanceling || currentSubscription.cancelAtPeriodEnd}
                  >
                    {isCanceling ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                    {currentSubscription.cancelAtPeriodEnd ? 'Already Cancelled' : 'Cancel Subscription'}
                  </Button>
                  {currentSubscription.cancelAtPeriodEnd && (
                    <Button
                      onClick={() => handleCancel(true)}
                      disabled={isCanceling}
                    >
                      {isCanceling ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                      Reactivate Subscription
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Usage Stats */}
          {usageStats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Usage Statistics
                </CardTitle>
                <CardDescription>
                  Your current usage against plan limits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(usageStats).map(([key, usage]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="capitalize font-medium">{key}</span>
                        <span className="text-sm text-muted-foreground">
                          {usage.current}/{usage.limit === -1 ? '∞' : usage.limit}
                        </span>
                      </div>
                      <Progress 
                        value={getUsagePercentage(usage.current, usage.limit)}
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        {usage.limit === -1 
                          ? 'Unlimited'
                          : `${usage.remaining} remaining`
                        }
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Billing Toggle */}
          <div className="flex justify-center">
            <div className="bg-muted p-1 rounded-lg">
              <Button
                variant={selectedBillingPeriod === 'MONTHLY' ? 'default' : 'ghost'}
                onClick={() => setSelectedBillingPeriod('MONTHLY')}
                size="sm"
              >
                Monthly
              </Button>
              <Button
                variant={selectedBillingPeriod === 'YEARLY' ? 'default' : 'ghost'}
                onClick={() => setSelectedBillingPeriod('YEARLY')}
                size="sm"
              >
                Yearly (Save up to 20%)
              </Button>
            </div>
          </div>

          {/* Available Plans */}
          <div className="grid gap-8 lg:grid-cols-3">
            {plans.map((plan) => {
              const isCurrentPlan = currentSubscription?.planType === plan.type;
              const price = selectedBillingPeriod === 'YEARLY' ? plan.yearlyPrice : plan.monthlyPrice;
              const yearlyDiscount = plan.yearlyDiscount;

              return (
                <Card 
                  key={plan.type} 
                  className={`relative ${plan.popular ? 'border-primary ring-2 ring-primary ring-opacity-20' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4">
                      {getPlanIcon(plan.type)}
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold">
                        {formatCurrency(price)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        per {selectedBillingPeriod.toLowerCase().slice(0, -2)}
                      </div>
                      {selectedBillingPeriod === 'YEARLY' && yearlyDiscount > 0 && (
                        <div className="text-sm text-green-600 font-medium">
                          Save {yearlyDiscount}% annually
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      {Object.entries(plan.features).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          {value ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <X className="w-4 h-4 text-red-500" />
                          )}
                          <span className="text-sm capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            {typeof value === 'number' && value !== -1 && `: ${value}`}
                            {value === -1 && ': Unlimited'}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button
                      className="w-full"
                      variant={isCurrentPlan ? 'outline' : 'default'}
                      disabled={isCurrentPlan || isUpgrading}
                      onClick={() => handleUpgrade(plan.type)}
                    >
                      {isUpgrading ? (
                        <LoadingSpinner size="sm" className="mr-2" />
                      ) : null}
                      {isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
                    </Button>

                    {plan.trialDays && plan.trialDays > 0 && !isCurrentPlan && (
                      <p className="text-xs text-center text-muted-foreground">
                        {plan.trialDays} days free trial
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Subscription History */}
          {subscriptionHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Subscription History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subscriptionHistory.map((sub) => (
                    <div 
                      key={sub.id} 
                      className="flex items-center justify-between p-4 bg-muted rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{sub.planType}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(sub.startDate)} - {sub.endDate ? formatDate(sub.endDate) : 'Present'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatCurrency(sub.amount, sub.currency)}/{sub.billingPeriod.toLowerCase()}
                        </p>
                        <Badge variant={sub.status === 'ACTIVE' ? 'default' : 'secondary'}>
                          {sub.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment History */}
          {paymentHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentHistory.map((payment) => (
                    <div 
                      key={payment.id} 
                      className="flex items-center justify-between p-4 bg-muted rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {formatCurrency(payment.amount, payment.currency)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(payment.paymentDate)}
                        </p>
                      </div>
                      <Badge 
                        variant={payment.status === 'succeeded' ? 'default' : 'destructive'}
                      >
                        {payment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}