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
  CheckCircle,
  User,
  Target,
  Wallet,
  PieChart,
  Shield,
  Sparkles,
  Crown,
  Zap,
  TrendingUp,
  DollarSign,
  Building,
  GraduationCap,
  Briefcase,
  Home,
  Car,
  Plane,
  Heart,
  BookOpen,
  Dot,
  BadgeCheck,
  ListCheck,
  LucideCheckCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useViewMode } from '@/lib/contexts/view-mode-context';
import { SkipOnboardingButton } from '@/components/onboarding/skip-onboarding-button';
import { GameIconsUpgrade, LogoMappr } from '@/components/icons';
import { FamiconsCheckmarkDoneCircleOutline, LetsIconsDoneDuotone, SolarWalletBoldDuotone } from '@/components/icons/icons';
import DecryptedText from '@/components/ui/shadcn-io/decrypted-text';

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
    description: "Let's get you started on your financial journey",
    icon: Sparkles
  },
  {
    id: 'profile',
    title: 'Tell us about yourself',
    description: 'Help us personalize your experience',
    icon: User
  },
  {
    id: 'experience',
    title: 'Your experience level',
    description: 'This helps us customize the interface for you',
    icon: GraduationCap
  },
  {
    id: 'goals',
    title: 'Financial goals',
    description: 'What are you hoping to achieve?',
    icon: Target
  },
  {
    id: 'investments',
    title: 'Investment preferences',
    description: 'What types of assets interest you?',
    icon: PieChart
  },
  {
    id: 'setup',
    title: 'Account setup',
    description: 'Final details to get you started',
    icon: Shield
  }
];

const FINANCIAL_GOALS = [
  { id: 'emergency-fund', label: 'Emergency Fund', icon: Shield },
  { id: 'retirement', label: 'Retirement Savings', icon: Crown },
  { id: 'house', label: 'Buy a Home', icon: Home },
  { id: 'car', label: 'Buy a Car', icon: Car },
  { id: 'travel', label: 'Travel & Vacation', icon: Plane },
  { id: 'education', label: 'Education', icon: BookOpen },
  { id: 'health', label: 'Health & Wellness', icon: Heart },
  { id: 'wealth', label: 'Build Wealth', icon: TrendingUp }
];

const INVESTMENT_TYPES = [
  { id: 'crypto', label: 'Cryptocurrency', description: 'Bitcoin, Ethereum, DeFi' },
  { id: 'stocks', label: 'Stocks & ETFs', description: 'Traditional equities' },
  { id: 'bonds', label: 'Bonds', description: 'Government & corporate bonds' },
  { id: 'real-estate', label: 'Real Estate', description: 'REITs and property' },
  { id: 'commodities', label: 'Commodities', description: 'Gold, silver, oil' },
  { id: 'cash', label: 'Cash & Savings', description: 'High-yield accounts' }
];

const EXPERIENCE_LEVELS = [
  {
    id: 'beginner',
    title: 'Beginner',
    description: 'New to investing and personal finance',
    icon: GraduationCap,
    features: ['Simple card-based interface', 'Educational content', 'Basic portfolio tracking']
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    description: 'Some experience with investments',
    icon: Briefcase,
    features: ['Advanced charts', 'Portfolio analysis', 'Goal tracking']
  },
  {
    id: 'advanced',
    title: 'Advanced',
    description: 'Experienced trader and investor',
    icon: Crown,
    features: ['Professional data tables', 'Advanced analytics', 'Custom indicators']
  }
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
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

  // Auto-populate user info if available
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
    // Set view mode based on experience level
    const viewMode = preferences.experienceLevel === 'beginner' ? 'beginner' : 'pro';
    setViewMode(viewMode);

    // Here you would save preferences to backend
    console.log('Saving onboarding preferences:', preferences);
    
    // Mark onboarding as completed
    localStorage.setItem('onboarding-completed', 'true');
    localStorage.setItem('onboarding-just-completed', 'true');
    localStorage.setItem('onboarding-preferences', JSON.stringify(preferences));
    
    // Redirect to dashboard
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
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-3">
                <LogoMappr className="h-16 w-16 " />
              </div>
           
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-bold  ">
                Welcome to
                
                <DecryptedText 
      text="MoneyMappr"
      speed={60}
      maxIterations={15}
      sequential={false}
      className="text-4xl font-bold text-foreground "
      parentClassName='inline-block ml-2'
      encryptedClassName="text-4xl font-bold text-muted-foreground"
      animateOn="hover"
    /> 
              </h1>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Your all-in-one platform for managing traditional finances and cryptocurrency portfolios
              </p>
            </div>

            <Card className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                  <SolarWalletBoldDuotone className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold">Multi-Asset Tracking</h3>
                <p className="text-xs text-muted-foreground">Connect crypto wallets, bank accounts, and investment portfolios</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold">Smart Analytics</h3>
                <p className="text-xs text-muted-foreground">AI-powered insights and personalized recommendations</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                  <GameIconsUpgrade className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold">Bank-Grade Security</h3>
                <p className="text-xs text-muted-foreground">Your data is encrypted and protected with enterprise security</p>
              </div>
            </Card>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6 max-w-md mx-auto">
            <div className="text-center space-y-2">
              <User className="h-12 w-12 mx-auto text-primary" />
              <h2 className="text-2xl font-bold">Tell us about yourself</h2>
              <p className="text-muted-foreground">This helps us personalize your MoneyMappr experience</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
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
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
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

              <div>
                <Label htmlFor="occupation">Occupation</Label>
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

              <div>
                <Label htmlFor="monthlyIncome">Monthly Income (Optional)</Label>
                <Select
                  value={preferences.monthlyIncome}
                  onValueChange={(value) => setPreferences(prev => ({ ...prev, monthlyIncome: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select income range" />
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

              <div>
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  value={preferences.profileInfo.bio}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    profileInfo: { ...prev.profileInfo, bio: e.target.value }
                  }))}
                  placeholder="Tell us a bit about yourself and your financial interests..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <GraduationCap className="h-12 w-12 mx-auto text-primary" />
              <h2 className="text-2xl font-bold">What's your experience level?</h2>
              <p className="text-muted-foreground">We'll customize the interface based on your comfort level</p>
            </div>

            <div className="space-y-4 max-w-md mx-auto">
              {EXPERIENCE_LEVELS.map((level) => {
                const Icon = level.icon;
                const isSelected = preferences.experienceLevel === level.id;
                
                return (
                  <Card
                    key={level.id}
                    className={cn(
                      "p-5 cursor-pointer transition-all hover:shadow-md shadow-primary/50",
                      isSelected ? " shadow-lg bg-primary/5" : "border-border hover:bg-primary/10 "
                    )}
                    onClick={() => setPreferences(prev => ({ ...prev, experienceLevel: level.id as any }))}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center",
                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm">{level.title}</h3>
                          {isSelected && <CheckCircle className="h-5 w-5 text-primary" />}
                        </div>
                        <p className="text-muted-foreground text-xs mb-3">{level.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {level.features.map((feature) => (
                            <Badge key={feature} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 'goals':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Target className="h-12 w-12 mx-auto text-primary" />
              <h2 className="text-2xl font-bold">What are your financial goals?</h2>
              <p className="text-muted-foreground">Select all that apply - we'll help you track progress</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {FINANCIAL_GOALS.map((goal) => {
                const Icon = goal.icon;
                const isSelected = preferences.primaryGoals.includes(goal.id);
                
                return (
                  <Card
                    key={goal.id}
                    className={cn(
                        "p-3 flex relative flex-row gap-3 text-pretty cursor-pointer transition-all hover:shadow-md shadow-primary/50",
                      isSelected ? " shadow-lg bg-primary/5" : " hover:bg-primary/10 "
                    )}
                    onClick={() => toggleGoal(goal.id)}
                  >
                  
                      <div className={cn(
                        "w-12 h-12  rounded-lg flex items-center justify-center",
                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                          <Icon className="h-6 w-6" />
             
                      </div>
                      <h3 className="font-medium text-sm items-center text-start">{goal.label}</h3>
                      {isSelected && <LucideCheckCheck className="absolute -top-2 -right-2 h-6 w-6 text-primary mx-auto" />}
                  
                  </Card>
                );
              })}
            </div>

            {preferences.primaryGoals.length > 0 && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Selected {preferences.primaryGoals.length} goal{preferences.primaryGoals.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        );

      case 'investments':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <PieChart className="h-12 w-12 mx-auto text-primary" />
              <h2 className="text-2xl font-bold">Investment preferences</h2>
              <p className="text-muted-foreground">What types of assets interest you?</p>
            </div>

            <div className="space-y-4">
              {INVESTMENT_TYPES.map((type) => {
                const isSelected = preferences.investmentTypes.includes(type.id);
                
                return (
                  <Card
                    key={type.id}
                    className={cn(
                       "p-3 flex relative flex-row gap-3 text-pretty cursor-pointer transition-all hover:shadow-md shadow-primary/50",
                      isSelected ? " shadow-lg bg-primary/5" : " hover:bg-primary/10 "
                    )}
                    onClick={() => toggleInvestmentType(type.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-sm">{type.label}</h3>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </div>
                      {isSelected && <LucideCheckCheck className="absolute -top-2 -right-2 h-6 w-6 text-primary mx-auto" />}
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="space-y-4">
              <div>
                <Label>Risk Tolerance</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[
                    { id: 'conservative', label: 'Conservative', desc: 'Lower risk, steady returns' },
                    { id: 'moderate', label: 'Moderate', desc: 'Balanced risk and growth' },
                    { id: 'aggressive', label: 'Aggressive', desc: 'Higher risk, potential high returns' }
                  ].map((risk) => (
                    <Card
                      key={risk.id}
                      className={cn(
                         "p-3  relative gap-0 text-pretty cursor-pointer transition-all hover:shadow-md shadow-primary/50",
                         preferences.riskTolerance === risk.id ? " shadow-lg bg-primary/5" : " hover:bg-primary/10 "
                       
                      )}
                      onClick={() => setPreferences(prev => ({ ...prev, riskTolerance: risk.id as any }))}
                    >
                      <div className="text-sm font-medium">{risk.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">{risk.desc}</div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'setup':
        return (
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="mx-auto  rounded-full flex items-center justify-center mb-2">
                <LetsIconsDoneDuotone className="h-24 w-24 text-lime-500" />
              </div>
       
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-green-600">You're all set!</h2>
              <p className="text-muted-foreground max-w-md mx-auto text-sm">
                Based on your preferences, we've configured MoneyMappr to give you the best experience
              </p>
            </div>

            <Card className="max-w-md mx-auto bg-accent">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-lg">Your Setup Summary</h3>
                
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Experience Level:</span>
                    <Badge variant="outline" className="capitalize">
                      {preferences.experienceLevel}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Interface Mode:</span>
                    <Badge variant={preferences.experienceLevel === 'beginner' ? 'secondary' : 'default'}>
                      {preferences.experienceLevel === 'beginner' ? 'Beginner' : 'Pro'}
                    </Badge>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Primary Goals:</span>
                    <span className="text-sm">{preferences.primaryGoals.length} selected</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Investment Types:</span>
                    <span className="text-sm">{preferences.investmentTypes.length} selected</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk Tolerance:</span>
                    <Badge variant="outline" className="capitalize">
                      {preferences.riskTolerance}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You can always change these settings later in your profile
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {ONBOARDING_STEPS.length}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium">
                {Math.round(progress)}% Complete
              </div>
              <SkipOnboardingButton />
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="min-h-[600px] flex flex-col justify-center">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {ONBOARDING_STEPS.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index <= currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            className="flex items-center gap-2"
            disabled={
              (currentStep === 1 && !preferences.profileInfo.firstName) ||
              (currentStep === 3 && preferences.primaryGoals.length === 0) ||
              (currentStep === 4 && preferences.investmentTypes.length === 0)
            }
          >
            {currentStep === ONBOARDING_STEPS.length - 1 ? (
              <>
                Complete Setup
                <CheckCircle className="h-4 w-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}