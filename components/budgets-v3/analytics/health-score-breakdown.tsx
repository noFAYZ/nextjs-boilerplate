'use client';

/**
 * Health Score Breakdown Component
 * Shows detailed breakdown of financial health score components
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface HealthScoreComponent {
  name: string;
  score: number;
  maxScore: number;
  weight: number;
  description: string;
}

interface HealthScoreBreakdownProps {
  overallScore: number;
  rating: string;
  components: HealthScoreComponent[];
}


const getScoreGrade = (score: number, maxScore: number = 100): string => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
};

export function HealthScoreBreakdown({
  overallScore,
  rating,
  components = [],
}: HealthScoreBreakdownProps) {
  const totalWeight = components.length > 0 ? components.reduce((sum, c) => sum + c.weight, 0) : 0;

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Health Score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Large Score Display */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground mb-2">Overall Score</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-primary">{overallScore}</span>
                <span className="text-2xl text-muted-foreground">/100</span>
              </div>
              <p className="text-lg font-semibold mt-2">{rating}</p>
            </div>

            {/* Grade Circle */}
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary">
              <span className="text-4xl font-bold text-primary">
                {getScoreGrade(overallScore)}
              </span>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="space-y-2">
            <Progress value={overallScore} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {overallScore >= 80
                ? 'Excellent financial health! Keep up the good habits.'
                : overallScore >= 60
                  ? 'Good financial health. Room for improvement in some areas.'
                  : 'Your financial health needs attention. Focus on the components below.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Component Breakdown */}
      {components.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold">Score Components</h3>

          <div className="space-y-4">
            {components.map((component, index) => {
            const percentage = (component.score / component.maxScore) * 100;
            const weightedPercentage = (component.weight / totalWeight) * 100;

            return (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="flex items-center gap-2 cursor-help">
                            <span className="font-medium">{component.name}</span>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{component.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <div className="text-right">
                        <p className="font-semibold">
                          {component.score}/{component.maxScore}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {percentage.toFixed(0)}% • {weightedPercentage.toFixed(0)}% weight
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <Progress value={percentage} className="h-2" />
                      <Badge variant="outline" className="text-xs">
                        {getScoreGrade(component.score, component.maxScore)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
            })}
          </div>
        </div>
      )}

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm font-medium mb-2">How to Improve Your Score</p>
          <ul className="text-xs text-blue-900 space-y-1 list-disc list-inside">
            <li>Stay within budget limits consistently</li>
            <li>Reduce month-to-month spending variance</li>
            <li>Increase your savings rate</li>
            <li>Avoid unnecessary risks in spending</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
