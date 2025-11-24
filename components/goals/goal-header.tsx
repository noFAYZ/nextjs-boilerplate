'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { ArrowUpRight, TrendingUp, Trophy, Repeat } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { GoalContributionsChart } from './goal-contributions-chart';
import { CircularProgress } from './goal-card';
import { MageGoals, SolarCheckCircleBoldDuotone } from '@/components/icons/icons';
import type { Goal } from '@/lib/types/goals';

interface GoalHeaderProps {
  goal: Goal;
  progress: number;
  progressColor: string;
}

export function GoalHeader({ goal, progress, progressColor }: GoalHeaderProps) {
  const statusColor = goal.onTrack ? 'success' : 'destructive';
  const statusText = goal.onTrack ? 'On Track' : 'Behind';

  // Calculate stats
  const amountLeft = Math.max(0, goal.targetAmount - goal.currentAmount);

  return (
    <Card className="border-border/80 border-b-0 rounded-none hover:shadow-xs p-0 overflow-hidden">
      <div className="p-3 space-y-4">
        {/* TOP ROW: Identity & Progress Circle */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Left: Icon & Name */}
          <div className="flex items-start gap-4 min-w-0 flex-1">
            <div className="relative shrink-0">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border shadow-sm group-hover:shadow-lg bg-accent transition-shadow">
                {goal.icon || <MageGoals className="w-6 h-6" />}
              </div>
              {goal.isAchieved && (
                <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-background p-0.5 shadow-md">
                  <SolarCheckCircleBoldDuotone className="h-5 w-5 text-lime-700" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-semibold tracking-tight text-foreground truncate">
                  {goal.name}
                </h1>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 font-normal">
                  {goal.type}
                </Badge>
              </div>
              {goal.description && (
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {goal.description}
                </p>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="truncate">{goal.category || 'General'}</span>
                <span className="text-muted-foreground/40">•</span>
                <Badge variant={statusColor} className="text-[10px] rounded-full">
                  {statusText}
                </Badge>
              </div>
            </div>
          </div>

          {/* Right: Progress Circle */}
          <div className="flex-shrink-0">
            <CircularProgress
              progress={progress}
              size={70}
              strokeWidth={14}
              progressColor={progressColor}
              fillColor={progress >= 75 ? 'text-emerald-500' : 'text-foreground'}
            />
          </div>
        </div>




        {/* Stats Grid */}
        <div className="grid w-full grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4">
          {/* CURRENT */}
          <div className="flex items-center gap-3">
            <div className="shrink-0 rounded-full bg-muted border shadow p-2">
              <TrendingUp className="h-5 w-5 text-foreground/80" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Current
              </p>

              <div className="flex items-baseline gap-1">
         
                  <CurrencyDisplay amountUSD={goal.currentAmount} className='text-base font-semibold truncate tracking-tight' />
          
              </div>
            </div>
          </div>

          {/* TARGET */}
          <div className="flex items-center gap-3">
            <div className="shrink-0 rounded-full bg-muted border shadow p-2">
              <Trophy className="h-5 w-5 text-foreground/80" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Target
              </p>

              <div className="flex items-baseline gap-1">
               
                  <CurrencyDisplay amountUSD={goal.targetAmount} className="text-base font-semibold truncate tracking-tight" />
           
                <span className="text-[11px] text-muted-foreground">goal</span>
              </div>
            </div>
          </div>

          {/* REMAINING */}
          <div className="flex items-center gap-3">
            <div className="shrink-0 rounded-full bg-muted border shadow p-2">
              <ArrowUpRight className="h-5 w-5 text-foreground/80" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Remaining
              </p>

              <div className="flex items-baseline gap-1">
               
                  <CurrencyDisplay amountUSD={amountLeft} className="text-base font-semibold truncate tracking-tight" />
            
                <span className="text-[11px] text-muted-foreground">to go</span>
              </div>
            </div>
          </div>

          {/* RECURRING */}
          {goal.recurringAmount !== undefined && goal.recurringAmount > 0 && (
            <div className="flex items-center gap-3">
              <div className="shrink-0 rounded-full bg-muted border shadow p-2">
                <Repeat className="h-5 w-5 text-foreground/80" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Recurring
                </p>

                <div className="flex items-baseline gap-1">
             
                    <CurrencyDisplay amountUSD={goal.recurringAmount} className="text-base font-semibold truncate tracking-tight" />
            

                  {goal.contributionFrequency && (
                    <span className="text-[11px] text-muted-foreground">
                      /{goal.contributionFrequency.toLowerCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator className="bg-border/70" />

        {/* Chart Section */}
    
          <GoalContributionsChart
            goalId={goal.id}
            goalName={goal.name}
            targetAmount={goal.targetAmount}
            currentAmount={goal.currentAmount}
            monthlyContributions={goal.recurringAmount}
            height={220}
          />
        
      </div>
    </Card>
  );
}
