'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import posthog from 'posthog-js';
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
  Circle,
  Wallet,
  Building2,
  Banknote
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore, selectUser } from '@/lib/stores';
import { useViewMode } from '@/lib/contexts/view-mode-context';
import { SkipOnboardingButton } from '@/components/onboarding/skip-onboarding-button';
import { LogoMappr } from '@/components/icons';
import { HugeiconsBriefcase02, SolarWalletBoldDuotone, GuidanceBank, HugeiconsMoneyExchange02, SolarCheckCircleBoldDuotone, PhPiggyBankDuotone, CircumBank, DuoIconsBank, SolarPieChart2BoldDuotone } from '@/components/icons/icons';
import Link from 'next/link';
import Image from 'next/image';

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
    title: 'Welcome to MoneyMappr',
    description: "Let's get you set up",
    icon: Sparkles
  },
  {
    id: 'profile',
    title: 'Your Profile',
    description: 'Basic information',
    icon: User
  },
  {
    id: 'experience',
    title: 'Experience Level',
    description: 'Choose your interface',
    icon: GraduationCap
  },
  {
    id: 'goals',
    title: 'Financial Goals',
    description: 'Set your objectives',
    icon: Target
  },
  {
    id: 'investments',
    title: 'Account Types',
    description: 'What you want to track',
    icon: PieChart
  }
];

const FINANCIAL_GOALS = [
  { id: 'track-spending', label: 'Track Spending', icon: PieChart },
  { id: 'build-wealth', label: 'Build Wealth', icon: TrendingUp },
  { id: 'emergency-fund', label: 'Emergency Fund', icon: Shield },
  { id: 'retirement', label: 'Save for Retirement', icon: Crown },
  { id: 'debt-free', label: 'Become Debt Free', icon: Target },
  { id: 'invest', label: 'Grow Investments', icon: TrendingUp },
  { id: 'buy-home', label: 'Buy a Home', icon: Home },
  { id: 'financial-freedom', label: 'Financial Freedom', icon: Sparkles }
];

const ACCOUNT_TYPES = [
  { id: 'bank', label: 'Bank Accounts', description: 'Connect checking & savings accounts', icon: GuidanceBank },
  { id: 'crypto-wallet', label: 'Crypto Wallets', description: 'Track blockchain wallets', icon: SolarWalletBoldDuotone },
  { id: 'exchange', label: 'Crypto Exchanges', description: 'Binance, Coinbase, etc.', icon: HugeiconsMoneyExchange02 },
  { id: 'cash', label: 'Manual Cash Tracking', description: 'Track cash manually', icon: Banknote }
];

const EXPERIENCE_LEVELS = [
  {
    id: 'beginner',
    title: 'Beginner',
    description: 'New to financial tracking',
    icon: GraduationCap,
    features: ['Simplified cards', 'Easy navigation', 'Guided setup']
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    description: 'Some financial experience',
    icon: HugeiconsBriefcase02,
    features: ['Balance mix', 'Charts & widgets', 'Quick insights']
  },
  {
    id: 'advanced',
    title: 'Pro',
    description: 'Power user & data enthusiast',
    icon: Crown,
    features: ['Data tables', 'Advanced analytics', 'Full customization']
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
    const currentStepDetails = ONBOARDING_STEPS[currentStep];
    let stepData = {};
    switch (currentStepDetails.id) {
      case 'profile':
        stepData = {
          monthly_income: preferences.monthlyIncome,
        };
        break;
      case 'experience':
        stepData = { experience_level: preferences.experienceLevel };
        break;
      case 'goals':
        stepData = { primary_goals: preferences.primaryGoals, goal_count: preferences.primaryGoals.length };
        break;
      case 'investments':
        stepData = { investment_types: preferences.investmentTypes, type_count: preferences.investmentTypes.length };
        break;
    }

    posthog.capture('onboarding_step_completed', {
      step_id: currentStepDetails.id,
      step_title: currentStepDetails.title,
      step_number: currentStep + 1,
      ...stepData
    });

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
    posthog.capture('onboarding_completed', {
      experience_level: preferences.experienceLevel,
      primary_goals: preferences.primaryGoals,
      investment_types: preferences.investmentTypes,
      monthly_income: preferences.monthlyIncome,
    });
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
          <div className="w-full max-w-2xl space-y-6 sm:space-y-8">
            <div className="space-y-4 text-center lg:text-left">
            <Link
                href="/"
                className="flex items-center gap-2 -ml-1 group"
             
              >
              <Image
                  src="/logo/mappr.svg"
                  alt="MoneyMappr logo"
                  width={56}
                  height={56}
                  className="object-contain w-12 h-12  transition-transform group-hover:scale-102"
                  priority
                /> 
                 {/*  <LogoMappr className='w-10 h-10' />*/}
                <div className="flex flex-col">
                  <span className="text-base sm:text-lg font-bold tracking-tight">
                    MoneyMappr
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-muted-foreground hidden sm:block -mt-0.5">
                    Financial Intelligence
                  </span>
                </div>
              </Link>
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">
                  Welcome to MoneyMappr
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg">
                  Let's personalize your financial management experience
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4">
              <div className="space-y-1 text-center lg:text-left">
              
                <div
          className={cn(
            "flex items-center justify-center h-10 w-10 rounded-xl",
            "bg-gradient-to-br shadow-xs ring-1 ring-inset ring-foreground/10 from-muted to-accent"
          )}
        >

          <DuoIconsBank
            className={cn(
              "h-6 w-6",
             "text-muted-foreground"
            )}
          />
        </div>
                <p className="text-xs sm:text-sm font-medium">Banking</p>
                <p className="text-xs text-muted-foreground hidden sm:block">Connect bank accounts</p>
              </div>
              <div className=" space-y-1 text-center lg:text-left">
              
                <div
                className={cn(
                  "flex items-center justify-center h-10 w-10 rounded-xl",
                  "bg-gradient-to-br shadow-xs ring-1 ring-inset ring-foreground/10 from-muted to-accent"
                )}
              >

                <SolarWalletBoldDuotone
                  className={cn(
                    "h-6 w-6",
                  "text-muted-foreground"
                  )}
                />
              </div>
                <p className="text-xs sm:text-sm font-medium">Crypto</p>
                <p className="text-xs text-muted-foreground hidden sm:block">Track wallets & DeFi</p>
              </div>
              <div className="space-y-2 text-center lg:text-left">
              <div
          className={cn(
            "flex items-center justify-center h-10 w-10 rounded-xl",
            "bg-gradient-to-br shadow-xs ring-1 ring-inset ring-foreground/10 from-muted to-accent"
          )}
        >

          <SolarPieChart2BoldDuotone
            className={cn(
              "h-6 w-6",
             "text-muted-foreground"
            )}
          />
        </div>
                <p className="text-xs sm:text-sm font-medium">Analytics</p>
                <p className="text-xs text-muted-foreground hidden sm:block">Smart insights</p>
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="w-full max-w-2xl space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground text-center lg:text-left">This helps us personalize your experience</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div className="w-full max-w-2xl space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground text-center lg:text-left">We'll customize the interface accordingly</p>
            </div>

            <div className="space-y-3">
              {EXPERIENCE_LEVELS.map((level) => {
                const Icon = level.icon;
                const isSelected = preferences.experienceLevel === level.id;

                return (
                  <Card
                    key={level.id}
                    className={cn(
                      "cursor-pointer transition-all border-border/80 rounded-2xl px-4 shadow-none dark:bg-muted/40",
                      isSelected ? "  shadow-sm" : "hover:border-border/80 active:scale-[0.98]"
                    )}
                    onClick={() => setPreferences(prev => ({ ...prev, experienceLevel: level.id as any }))}
                  >
                   
                      <div className="flex items-center gap-3 sm:gap-4">
                     
                        <div  className={cn(
                          "flex items-center justify-center h-10 w-10 rounded-xl",
                          "bg-gradient-to-br shadow-xs ring-1 ring-inset ring-foreground/10 from-muted to-accent"
                        )}
                      >

                        <Icon
                          className={cn(
                            "h-6 w-6",
                          "text-muted-foreground"
                          )}
                        />
                      </div>


                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-base sm:text-sm">{level.title}</h3>
                           
                          </div>
                          <p className="text-xs text-muted-foreground mb-2 sm:mb-2">{level.description}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {level.features.map((feature) => (
                              <Badge key={feature} variant="outline" className="text-xs font-normal">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="flex-shrink-0">
                            <div className="w-7 h-7 sm:w-6 sm:h-6 rounded-full  flex items-center justify-center shadow-sm">
                            <SolarCheckCircleBoldDuotone className="h-6 w-6  text-primary flex-shrink-0 " />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      
                
                    
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 'goals':
        return (
          <div className="w-full max-w-2xl space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground text-center lg:text-left">Select all that apply</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {FINANCIAL_GOALS.map((goal) => {
                const Icon = goal.icon;
                const isSelected = preferences.primaryGoals.includes(goal.id);

                return (
                  <Card
                    key={goal.id}
                    className={cn(
                      "cursor-pointer transition-all border-border/80 rounded-2xl p-6 text-center items-center relative",
                      isSelected ? " shadow-sm" : "hover:border-border active:scale-98"
                    )}
                    onClick={() => toggleGoal(goal.id)}
                  >
                  
                  

                      <div  className={cn(
                          "flex items-center justify-center h-10 w-10 mb-3 sm:mb-2 rounded-xl",
                          "bg-gradient-to-br shadow-xs ring-1 ring-inset ring-foreground/10 from-muted to-accent"
                        )}
                      >

                        <Icon
                          className={cn(
                            "h-6 w-6",
                          "text-muted-foreground"
                          )}
                        />
                      </div>


                      <p className="text-sm font-medium leading-tight">{goal.label}</p>
                
                        {isSelected && <SolarCheckCircleBoldDuotone className="h-6 w-6  text-primary flex-shrink-0 absolute top-2 right-2" />}
                    
                  </Card>
                );
              })}
            </div>

            {preferences.primaryGoals.length > 0 && (
              <div className="text-center lg:text-left">
                <p className="text-sm text-muted-foreground">
                  {preferences.primaryGoals.length} goal{preferences.primaryGoals.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            )}
          </div>
        );

      case 'investments':
        return (
          <div className="w-full max-w-2xl space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground text-center lg:text-left">Select the account types you want to track</p>
            </div>

            <div className=" grid sm:grid-cols-2 gap-2 ">
              {ACCOUNT_TYPES.map((type) => {
                const isSelected = preferences.investmentTypes.includes(type.id);
                const Icon = type.icon;

                return (
                  <Card
                    key={type.id}
                    className={cn(
                      "cursor-pointer transition-all border-border/80 px-2 shadow-sm dark:bg-muted/40",
                      isSelected ? " shadow-sm" : "hover:border-border/80 active:scale-[0.98]"
                    )}
                    onClick={() => toggleInvestmentType(type.id)}
                  >
                
                      <div className="flex items-center gap-3 sm:gap-4">
                      

                        <div  className={cn(
                          "flex items-center justify-center h-10 w-10 rounded-xl",
                          "bg-gradient-to-br shadow-xs ring-1 ring-inset ring-foreground/10 from-muted to-accent"
                        )}
                      >

                        <Icon
                          className={cn(
                            "h-6 w-6",
                          "text-muted-foreground"
                          )}
                        />
                      </div>


                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-sm font-medium mb-1 sm:mb-0.5">{type.label}</h3>
                          <p className="text-sm sm:text-xs text-muted-foreground">{type.description}</p>
                        </div>
                        {isSelected && (
                          <div className="flex-shrink-0">
                            <div className="w-7 h-7 sm:w-6 sm:h-6 rounded-full  flex items-center justify-center shadow-sm">
                            <SolarCheckCircleBoldDuotone className="h-6 w-6  text-primary flex-shrink-0 " />
                            </div>
                          </div>
                        )}


                      </div>
                 
                  </Card>
                );
              })}
            </div>

            {preferences.investmentTypes.length > 0 && (
              <div className="pt-2 text-center lg:text-left">
                <p className="text-sm text-muted-foreground">
                  {preferences.investmentTypes.length} account type{preferences.investmentTypes.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen ">
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto min-h-screen">
        {/* Mobile Header - Top Progress Bar */}
        <div className="lg:hidden border-b border-border p-4 bg-background sticky top-0 z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <LogoMappr className="h-6 w-6" />
              <span className="font-semibold text-sm">MoneyMappr</span>
            </div>
            <SkipOnboardingButton />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Step {currentStep + 1} of {ONBOARDING_STEPS.length}
              </span>
              <span className="font-medium">
                {Math.round(((currentStep + 1) / ONBOARDING_STEPS.length) * 100)}%
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%` }}
              />
            </div>
            <p className="text-sm font-medium pt-1">
              {ONBOARDING_STEPS[currentStep].title}
            </p>
          </div>
        </div>

        {/* Vertical Step Indicators - Left Side (Desktop) */}
        <div className="hidden lg:flex  p-8 flex-col min-h-screen sticky top-0">
          <div className="mb-8">
            <div className="text-xs text-muted-foreground mb-1">
              STEP {currentStep + 1} OF {ONBOARDING_STEPS.length}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {ONBOARDING_STEPS[currentStep].title}
            </h1>
          </div>

          <div className="flex-1 relative">
            {ONBOARDING_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div key={step.id} className="relative">
                  <div className="flex items-start gap-4 pb-8">
                    <div className="relative z-10">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors border-2",
                        isCompleted
                          ? "bg-primary border-primary text-primary-foreground"
                          : isActive
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-background border-border text-muted-foreground"
                      )}>
                        {isCompleted ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 pt-1.5">
                      <p className={cn(
                        "text-sm font-medium mb-0.5",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {step.title}
                      </p>
                      <p className={cn(
                        "text-xs",
                        isActive ? "text-muted-foreground" : "text-muted-foreground/60"
                      )}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {/* Connecting line */}
                  {index < ONBOARDING_STEPS.length - 1 && (
                    <div className={cn(
                      "absolute left-5 top-10 w-px h-8 -translate-x-px",
                      isCompleted ? "bg-primary" : "bg-border"
                    )} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Navigation Buttons - Bottom of Sidebar (Desktop) */}
          <div className="pt-4 border-t border-border space-y-2">
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !preferences.profileInfo.firstName) ||
                (currentStep === 3 && preferences.primaryGoals.length === 0) ||
                (currentStep === 4 && preferences.investmentTypes.length === 0)
              }
              className="w-full"
            >
              {currentStep === ONBOARDING_STEPS.length - 1 ? 'Complete' : 'Save and continue'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={cn("flex-1", currentStep === 0 && "invisible")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <SkipOnboardingButton className="flex-1" />
            </div>
          </div>
        </div>

        {/* Content - Right Side */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 ">
          <div className="max-w-3xl mx-auto">
          
              <div className="flex-1 flex items-center justify-center py-6 lg:py-12">
                {renderStepContent()}
              </div>
            
          </div>
        </div>

        {/* Mobile Navigation - Bottom (Fixed) */}
        <div className="lg:hidden border-t border-border p-4 bg-background sticky bottom-0 space-y-2">
          <Button
            onClick={handleNext}
            disabled={
              (currentStep === 1 && !preferences.profileInfo.firstName) ||
              (currentStep === 3 && preferences.primaryGoals.length === 0) ||
              (currentStep === 4 && preferences.investmentTypes.length === 0)
            }
            className="w-full"
            size="lg"
          >
            {currentStep === ONBOARDING_STEPS.length - 1 ? 'Complete Setup' : 'Continue'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          {currentStep > 0 && (
            <Button
              variant="ghost"
              onClick={handlePrevious}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
