'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  User,
  Target,
  PieChart,
  Shield,
  Sparkles,
  Crown,
  TrendingUp,
  GraduationCap,
  Briefcase,
  Home,
  Car,
  Plane,
  Heart,
  BookOpen,
  Check,
  Circle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore, selectUser } from '@/lib/stores';
import { useViewMode } from '@/lib/contexts/view-mode-context';
import { SkipOnboardingButton } from '@/components/onboarding/skip-onboarding-button';
import { LogoMappr } from '@/components/icons';
import { HugeiconsBriefcase02 } from '@/components/icons/icons';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface UserPreferences {
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

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    description: "Let's get started",
    icon: Sparkles
  },
  {
    id: 'profile',
    title: 'Profile',
    description: 'Tell us about yourself',
    icon: User
  },
  {
    id: 'experience',
    title: 'Experience',
    description: 'Your skill level',
    icon: GraduationCap
  },
  {
    id: 'goals',
    title: 'Goals',
    description: 'What you want to achieve',
    icon: Target
  },
  {
    id: 'investments',
    title: 'Preferences',
    description: 'Investment types',
    icon: PieChart
  }
];

const FINANCIAL_GOALS = [
  { id: 'emergency-fund', label: 'Emergency Fund', icon: Shield },
  { id: 'retirement', label: 'Retirement', icon: Crown },
  { id: 'house', label: 'Buy a Home', icon: Home },
  { id: 'car', label: 'Buy a Car', icon: Car },
  { id: 'travel', label: 'Travel', icon: Plane },
  { id: 'education', label: 'Education', icon: BookOpen },
  { id: 'health', label: 'Health', icon: Heart },
  { id: 'wealth', label: 'Build Wealth', icon: TrendingUp }
];

const INVESTMENT_TYPES = [
  { id: 'crypto', label: 'Cryptocurrency', description: 'Digital assets & DeFi' },
  { id: 'stocks', label: 'Stocks & ETFs', description: 'Traditional equities' },
  { id: 'bonds', label: 'Bonds', description: 'Fixed income securities' },
  { id: 'real-estate', label: 'Real Estate', description: 'Property & REITs' },
  { id: 'commodities', label: 'Commodities', description: 'Precious metals & resources' },
  { id: 'cash', label: 'Cash & Savings', description: 'High-yield accounts' }
];

const EXPERIENCE_LEVELS = [
  {
    id: 'beginner',
    title: 'Beginner',
    description: 'New to investing',
    icon: GraduationCap,
    features: ['Simplified interface', 'Guided tutorials', 'Basic tracking']
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    description: 'Some experience',
    icon: HugeiconsBriefcase02,
    features: ['Advanced charts', 'Portfolio analysis', 'Goal tracking']
  },
  {
    id: 'advanced',
    title: 'Advanced',
    description: 'Experienced investor',
    icon: Crown,
    features: ['Pro data tables', 'Advanced analytics', 'Custom indicators']
  }
];

export default function OnboardingPage() {
  const router = useRouter();
  const user = useAuthStore(selectUser);
  const { setViewMode } = useViewMode();
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<UserPreferences>({
    experienceLevel: 'beginner',
    primaryGoals: [],
    investmentTypes: [],
    riskTolerance: 'moderate',
    monthlyIncome: '',
    profileInfo: {
      firstName: '',
      lastName: '',
      occupation: '',
      bio: ''
    }
  });

  useEffect(() => {
    if (user) {
      setPreferences(prev => ({
        ...prev,
        profileInfo: {
          ...prev.profileInfo,
          firstName: user.name?.split(' ')[0] || '',
          lastName: user.name?.split(' ').slice(1).join(' ') || ''
        }
      }));
    }
  }, [user]);

  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    const viewMode = preferences.experienceLevel === 'beginner' ? 'beginner' : 'pro';
    setViewMode(viewMode);
    localStorage.setItem('onboarding-completed', 'true');
    localStorage.setItem('onboarding-just-completed', 'true');
    localStorage.setItem('onboarding-preferences', JSON.stringify(preferences));
    router.push('/dashboard');
  };

  const toggleGoal = (goalId: string) => {
    setPreferences(prev => ({
      ...prev,
      primaryGoals: prev.primaryGoals.includes(goalId)
        ? prev.primaryGoals.filter(id => id !== goalId)
        : [...prev.primaryGoals, goalId]
    }));
  };

  const toggleInvestmentType = (typeId: string) => {
    setPreferences(prev => ({
      ...prev,
      investmentTypes: prev.investmentTypes.includes(typeId)
        ? prev.investmentTypes.filter(id => id !== typeId)
        : [...prev.investmentTypes, typeId]
    }));
  };

  const renderStepContent = () => {
    const step = ONBOARDING_STEPS[currentStep];

    switch (step.id) {
      case 'welcome':
        return (
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
                <LogoMappr className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight mb-2">
                  Welcome to MoneyMappr
                </h1>
                <p className="text-muted-foreground">
                  Let's personalize your financial management experience
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto bg-muted rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Secure</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto bg-muted rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Insightful</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto bg-muted rounded-xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Simple</p>
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">Tell us about yourself</h2>
              <p className="text-sm text-muted-foreground">This helps us personalize your experience</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-sm">First Name</Label>
                  <Input
                    id="firstName"
                    value={preferences.profileInfo.firstName}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      profileInfo: { ...prev.profileInfo, firstName: e.target.value }
                    }))}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-sm">Last Name</Label>
                  <Input
                    id="lastName"
                    value={preferences.profileInfo.lastName}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      profileInfo: { ...prev.profileInfo, lastName: e.target.value }
                    }))}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="occupation" className="text-sm">Occupation</Label>
                <Input
                  id="occupation"
                  value={preferences.profileInfo.occupation}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    profileInfo: { ...prev.profileInfo, occupation: e.target.value }
                  }))}
                  placeholder="Software Engineer"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="monthlyIncome" className="text-sm">Monthly Income <span className="text-muted-foreground">(Optional)</span></Label>
                <Select
                  value={preferences.monthlyIncome}
                  onValueChange={(value) => setPreferences(prev => ({ ...prev, monthlyIncome: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-30k">Under $30k</SelectItem>
                    <SelectItem value="30k-50k">$30k - $50k</SelectItem>
                    <SelectItem value="50k-75k">$50k - $75k</SelectItem>
                    <SelectItem value="75k-100k">$75k - $100k</SelectItem>
                    <SelectItem value="100k-150k">$100k - $150k</SelectItem>
                    <SelectItem value="150k-plus">$150k+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bio" className="text-sm">Bio <span className="text-muted-foreground">(Optional)</span></Label>
                <Textarea
                  id="bio"
                  value={preferences.profileInfo.bio}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    profileInfo: { ...prev.profileInfo, bio: e.target.value }
                  }))}
                  placeholder="Tell us about your financial interests..."
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">What's your experience level?</h2>
              <p className="text-sm text-muted-foreground">We'll customize the interface accordingly</p>
            </div>

            <div className="space-y-3">
              {EXPERIENCE_LEVELS.map((level) => {
                const Icon = level.icon;
                const isSelected = preferences.experienceLevel === level.id;

                return (
                  <Card
                    key={level.id}
                    className={cn(
                      "cursor-pointer transition-all border-border shadow-none dark:bg-muted/40",
                      isSelected ? "border-primary/10 shadow-xs" : "hover:border-border/80"
                    )}
                    onClick={() => setPreferences(prev => ({ ...prev, experienceLevel: level.id as any }))}
                  >
                    <CardContent className="px-4">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                          isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{level.title}</h3>
                            {isSelected && <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{level.description}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {level.features.map((feature) => (
                              <Badge key={feature} variant="outline" className="text-xs font-normal">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 'goals':
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">What are your financial goals?</h2>
              <p className="text-sm text-muted-foreground">Select all that apply</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {FINANCIAL_GOALS.map((goal) => {
                const Icon = goal.icon;
                const isSelected = preferences.primaryGoals.includes(goal.id);

                return (
                  <Card
                    key={goal.id}
                    className={cn(
                      "cursor-pointer transition-all relative",
                      isSelected ? "border-primary" : "hover:border-border/80"
                    )}
                    onClick={() => toggleGoal(goal.id)}
                  >
                    <CardContent className="p-3 text-center">
                      <div className={cn(
                        "w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center",
                        isSelected ? "bg-primary/10" : "bg-muted"
                      )}>
                        <Icon className={cn("h-5 w-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                      </div>
                      <p className="text-sm font-medium">{goal.label}</p>
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {preferences.primaryGoals.length > 0 && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {preferences.primaryGoals.length} goal{preferences.primaryGoals.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            )}
          </div>
        );

      case 'investments':
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">Investment preferences</h2>
              <p className="text-sm text-muted-foreground">What assets interest you?</p>
            </div>

            <div className="space-y-2">
              {INVESTMENT_TYPES.map((type) => {
                const isSelected = preferences.investmentTypes.includes(type.id);

                return (
                  <Card
                    key={type.id}
                    className={cn(
                      "cursor-pointer transition-all",
                      isSelected ? "border-primary" : "hover:border-border/80"
                    )}
                    onClick={() => toggleInvestmentType(type.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          isSelected ? "bg-primary/10" : "bg-muted"
                        )}>
                          <Circle className={cn("h-4 w-4", isSelected ? "text-primary fill-primary" : "text-muted-foreground")} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium">{type.label}</h3>
                          <p className="text-xs text-muted-foreground">{type.description}</p>
                        </div>
                        {isSelected && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="space-y-3 pt-2">
              <Label className="text-sm font-medium">Risk Tolerance</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'conservative', label: 'Conservative', desc: 'Lower risk' },
                  { id: 'moderate', label: 'Moderate', desc: 'Balanced' },
                  { id: 'aggressive', label: 'Aggressive', desc: 'Higher risk' }
                ].map((risk) => (
                  <Card
                    key={risk.id}
                    className={cn(
                      "cursor-pointer transition-all",
                      preferences.riskTolerance === risk.id ? "border-primary" : "hover:border-border/80"
                    )}
                    onClick={() => setPreferences(prev => ({ ...prev, riskTolerance: risk.id as any }))}
                  >
                    <CardContent className="p-3 text-center">
                      <p className="text-sm font-medium mb-0.5">{risk.label}</p>
                      <p className="text-xs text-muted-foreground">{risk.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">


      {/* Step Indicators */}
      <div className="">
        <div className=" max-w-5xl mx-auto px-12 py-4">
          <div className="flex items-center justify-between overflow-x-auto">
            {ONBOARDING_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors",
                      isCompleted
                        ? "bg-primary text-primary-foreground"
                        : isActive
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <div className="hidden sm:block">
                      <p className={cn(
                        "text-sm font-medium",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                  {index < ONBOARDING_STEPS.length - 1 && (
                    <div className="w-8 sm:w-12 h-px bg-border mx-2 sm:mx-3" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className=" max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col min-h-[70vh] items-center justify-center">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-8 max-w-2xl mx-auto">
          <div className='flex gap-2'>
                     <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            size={'sm'}
            className={cn(currentStep === 0 && "invisible")}
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
          <SkipOnboardingButton />
          </div>
 

          <Button
            onClick={handleNext}
            disabled={
              (currentStep === 1 && !preferences.profileInfo.firstName) ||
              (currentStep === 3 && preferences.primaryGoals.length === 0) ||
              (currentStep === 4 && preferences.investmentTypes.length === 0)
            }
            size={'sm'}
          >
            {currentStep === ONBOARDING_STEPS.length - 1 ? 'Complete' : 'Next'}
            <ArrowRight className="h-4 w-4 " />
          </Button>
        </div>
      </div>
    </div>
  );
}
