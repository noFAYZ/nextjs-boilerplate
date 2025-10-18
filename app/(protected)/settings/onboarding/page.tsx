'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  RefreshCw,
  Settings,
  User,
  Target,
  PieChart,
  CheckCircle,
  ArrowRight,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useOnboardingStatus } from '@/components/auth/onboarding-guard';
import { useViewMode } from '@/lib/contexts/view-mode-context';

interface OnboardingPreferences {
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  primaryGoals: string[];
  investmentTypes: string[];
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  monthlyIncome: string;
  profileInfo: {
    firstName: string;
    lastName: string;
    occupation: string;
    bio: string;
  };
}

export default function OnboardingSettingsPage() {
  const router = useRouter();
  const { resetOnboarding } = useOnboardingStatus();
  const { viewMode } = useViewMode();
  const [preferences, setPreferences] = useState<OnboardingPreferences | null>(null);
  const [completedDate, setCompletedDate] = useState<string>('');

  useEffect(() => {
    // Load saved onboarding preferences
    const savedPrefs = localStorage.getItem('onboarding-preferences');
    const completed = localStorage.getItem('onboarding-completed');
    
    if (savedPrefs) {
      try {
        setPreferences(JSON.parse(savedPrefs));
      } catch (error) {
        console.error('Error parsing onboarding preferences:', error);
      }
    }

    if (completed) {
      // If we had a timestamp, we'd use that. For now, we'll use a placeholder
      setCompletedDate('Recently');
    }
  }, []);

  const handleRetakeOnboarding = () => {
    resetOnboarding();
    router.push('/onboarding');
  };

  const getGoalLabel = (goalId: string) => {
    const goalMap: Record<string, string> = {
      'emergency-fund': 'Emergency Fund',
      'retirement': 'Retirement Savings',
      'house': 'Buy a Home',
      'car': 'Buy a Car',
      'travel': 'Travel & Vacation',
      'education': 'Education',
      'health': 'Health & Wellness',
      'wealth': 'Build Wealth'
    };
    return goalMap[goalId] || goalId;
  };

  const getInvestmentTypeLabel = (typeId: string) => {
    const typeMap: Record<string, string> = {
      'crypto': 'Cryptocurrency',
      'stocks': 'Stocks & ETFs',
      'bonds': 'Bonds',
      'real-estate': 'Real Estate',
      'commodities': 'Commodities',
      'cash': 'Cash & Savings'
    };
    return typeMap[typeId] || typeId;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Onboarding Settings</h1>
        <p className="text-muted-foreground">
          Manage your onboarding preferences and account setup
        </p>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-green-700 dark:text-green-400">
                  Onboarding Completed
                </CardTitle>
                <CardDescription>
                  Completed {completedDate} • Currently using {viewMode} mode
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={handleRetakeOnboarding}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retake Onboarding
            </Button>
          </div>
        </CardHeader>
      </Card>

      {preferences && (
        <>
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">
                    {preferences.profileInfo.firstName} {preferences.profileInfo.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Occupation</p>
                  <p className="font-medium">
                    {preferences.profileInfo.occupation || 'Not specified'}
                  </p>
                </div>
              </div>
              
              {preferences.monthlyIncome && (
                <div>
                  <p className="text-sm text-muted-foreground">Income Range</p>
                  <Badge variant="outline" className="capitalize">
                    {preferences.monthlyIncome.replace('-', ' - ')}
                  </Badge>
                </div>
              )}

              {preferences.profileInfo.bio && (
                <div>
                  <p className="text-sm text-muted-foreground">Bio</p>
                  <p className="text-sm">{preferences.profileInfo.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Experience Level */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Experience & Interface
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium capitalize">{preferences.experienceLevel} Level</p>
                  <p className="text-sm text-muted-foreground">
                    Currently using {viewMode} mode interface
                  </p>
                </div>
                <Badge variant={viewMode === 'beginner' ? 'secondary' : 'default'}>
                  {viewMode === 'beginner' ? 'Beginner Mode' : 'Pro Mode'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Financial Goals */}
          {preferences.primaryGoals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Financial Goals
                </CardTitle>
                <CardDescription>
                  Goals you selected during onboarding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {preferences.primaryGoals.map((goalId) => (
                    <Badge key={goalId} variant="outline">
                      {getGoalLabel(goalId)}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Investment Preferences */}
          {preferences.investmentTypes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Investment Preferences
                </CardTitle>
                <CardDescription>
                  Asset types you're interested in
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {preferences.investmentTypes.map((typeId) => (
                    <Badge key={typeId} variant="secondary">
                      {getInvestmentTypeLabel(typeId)}
                    </Badge>
                  ))}
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Risk Tolerance</p>
                    <p className="text-xs text-muted-foreground">
                      Your preferred investment risk level
                    </p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {preferences.riskTolerance}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common next steps based on your preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-between"
                asChild
              >
                <div className="cursor-pointer">
                  <span>Complete your profile</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-between"
                asChild
              >
                <div className="cursor-pointer">
                  <span>Set up your first goal</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-between"
                asChild
              >
                <div className="cursor-pointer">
                  <span>Connect your first wallet</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {!preferences && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Onboarding Data Found</h3>
            <p className="text-muted-foreground mb-4">
              It looks like you haven't completed the onboarding process yet, or your data wasn't saved.
            </p>
            <Button onClick={handleRetakeOnboarding}>
              Start Onboarding
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}