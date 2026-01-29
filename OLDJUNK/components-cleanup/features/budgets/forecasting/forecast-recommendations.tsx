'use client';

/**
 * Forecast Recommendations Component
 * Displays actionable recommendations based on forecast
 */

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  CheckCircle,
  TrendingDown,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  type: 'warning' | 'opportunity' | 'suggestion';
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ForecastRecommendationsProps {
  recommendations: Recommendation[];
  isLoading?: boolean;
}

const getPriorityBadge = (priority: string) => {
  if (priority === 'high') return <Badge className="bg-red-500">High Priority</Badge>;
  if (priority === 'medium') return <Badge className="bg-yellow-500">Medium Priority</Badge>;
  return <Badge variant="outline">Low Priority</Badge>;
};

const getTypeIcon = (type: string) => {
  if (type === 'warning') return <AlertCircle className="h-5 w-5 text-red-500" />;
  if (type === 'opportunity') return <TrendingDown className="h-5 w-5 text-green-500" />;
  return <Lightbulb className="h-5 w-5 text-blue-500" />;
};

export function ForecastRecommendations({
  recommendations,
  isLoading = false,
}: ForecastRecommendationsProps) {
  if (recommendations.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
          <p>No recommendations at this time. Your spending looks healthy!</p>
        </CardContent>
      </Card>
    );
  }

  // Sort by priority
  const sorted = [...recommendations].sort((a, b) => {
    const priorityMap = { high: 3, medium: 2, low: 1 };
    return (priorityMap[b.priority as keyof typeof priorityMap] || 0) -
           (priorityMap[a.priority as keyof typeof priorityMap] || 0);
  });

  return (
    <div className="space-y-4">
      {sorted.map((rec) => (
        <Card key={rec.id} className={
          rec.priority === 'high' ? 'border-red-200 bg-red-50' :
          rec.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
          'border-blue-200 bg-blue-50'
        }>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  {getTypeIcon(rec.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{rec.title}</h3>
                      {getPriorityBadge(rec.priority)}
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                </div>
              </div>

              {/* Footer with action */}
              {rec.action && (
                <Button
                  onClick={rec.action.onClick}
                  disabled={isLoading}
                  className="w-full gap-2"
                  variant="outline"
                  size="sm"
                >
                  {rec.action.label}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Recommendations</p>
              <p className="text-2xl font-bold">{recommendations.length}</p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span>{recommendations.filter(r => r.priority === 'high').length} High Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <span>{recommendations.filter(r => r.priority === 'medium').length} Medium Priority</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
