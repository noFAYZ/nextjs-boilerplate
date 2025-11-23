'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

export interface Step {
  id: string;
  title: string;
  description?: string;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  variant?: 'tabs' | 'indicator' | 'default';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Stepper({
  steps,
  currentStep,
  variant = 'default',
  orientation = 'horizontal',
  className,
}: StepperProps) {
  if (variant === 'tabs') {
    return <StepperTabs steps={steps} currentStep={currentStep} className={className} />;
  }

  if (variant === 'indicator') {
    return <StepperIndicator steps={steps} currentStep={currentStep} className={className} />;
  }

  return (
    <StepperDefault
      steps={steps}
      currentStep={currentStep}
      orientation={orientation}
      className={className}
    />
  );
}

function StepperTabs({ steps, currentStep, className }: Omit<StepperProps, 'variant' | 'orientation'>) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div
            key={step.id}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg border transition-all',
              isActive && 'bg-primary text-primary-foreground border-primary',
              isCompleted && 'bg-muted border-muted-foreground/20',
              !isActive && !isCompleted && 'bg-background border-border'
            )}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <span className="text-sm font-semibold">{index + 1}</span>
            )}
            <span className="text-sm font-medium">{step.title}</span>
          </div>
        );
      })}
    </div>
  );
}

function StepperIndicator({ steps, currentStep, className }: Omit<StepperProps, 'variant' | 'orientation'>) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                  isActive && 'border-primary bg-primary text-primary-foreground',
                  isCompleted && 'border-primary bg-primary text-primary-foreground',
                  !isActive && !isCompleted && 'border-muted-foreground/30 bg-card'
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              <div className="text-center">
                <p className={cn('text-sm font-medium', isActive && 'text-foreground', !isActive && 'text-muted-foreground')}>
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2',
                  isCompleted ? 'bg-primary' : 'bg-muted-foreground/30'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function StepperDefault({
  steps,
  currentStep,
  orientation,
  className,
}: Omit<StepperProps, 'variant'>) {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      className={cn(
        'flex',
        isHorizontal ? 'flex-row items-center' : 'flex-col',
        className
      )}
    >
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <React.Fragment key={step.id}>
            <div
              className={cn(
                'flex items-start gap-3',
                !isHorizontal && 'w-full'
              )}
            >
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all',
                    isActive && 'border-primary bg-primary text-primary-foreground',
                    isCompleted && 'border-primary bg-primary text-primary-foreground',
                    !isActive && !isCompleted && 'border-muted-foreground/30 bg-background'
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                {!isHorizontal && index < steps.length - 1 && (
                  <div
                    className={cn(
                      'w-0.5 h-12 my-1',
                      isCompleted ? 'bg-primary' : 'bg-muted-foreground/30'
                    )}
                  />
                )}
              </div>
              <div className={cn('flex-1', isHorizontal && 'hidden')}>
                <h4
                  className={cn(
                    'text-sm font-medium',
                    isActive && 'text-foreground',
                    !isActive && 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </h4>
                {step.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
            {isHorizontal && index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2',
                  isCompleted ? 'bg-primary' : 'bg-muted-foreground/30'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// Hook for managing stepper state
export function useStepper(totalSteps: number, initialStep: number = 0) {
  const [currentStep, setCurrentStep] = React.useState(initialStep);

  const nextStep = React.useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const prevStep = React.useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = React.useCallback(
    (step: number) => {
      setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)));
    },
    [totalSteps]
  );

  const reset = React.useCallback(() => {
    setCurrentStep(initialStep);
  }, [initialStep]);

  return {
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    reset,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
  };
}
