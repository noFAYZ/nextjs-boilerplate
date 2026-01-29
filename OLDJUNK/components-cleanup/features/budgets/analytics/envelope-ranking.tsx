'use client';

/**
 * Envelope Ranking Component
 * Displays envelopes ranked by efficiency/performance
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { EnvelopeRank } from '@/lib/types/budget-analytics';

interface EnvelopeRankingProps {
  rankings: EnvelopeRank[];
  metric?: 'efficiency' | 'adherence' | 'consistency';
}

const getMedalIcon = (rank: number) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return null;
};

const getPerformanceBadge = (score: number) => {
  if (score >= 85) return { label: 'Excellent', color: 'bg-green-500' };
  if (score >= 70) return { label: 'Good', color: 'bg-blue-500' };
  if (score >= 55) return { label: 'Fair', color: 'bg-yellow-500' };
  return { label: 'Needs Work', color: 'bg-orange-500' };
};

export function EnvelopeRanking({
  rankings,
  metric = 'efficiency',
}: EnvelopeRankingProps) {
  const metricLabels = {
    efficiency: 'Efficiency Score',
    adherence: 'Budget Adherence',
    consistency: 'Spending Consistency',
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Envelope Rankings - {metricLabels[metric]}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {rankings.length > 0 ? (
              rankings.map((envelope, index) => {
                const rank = index + 1;
                const badge = getPerformanceBadge(envelope.score);
                const medal = getMedalIcon(rank);

                return (
                  <div
                    key={envelope.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      rank <= 3
                        ? 'border-primary bg-primary/5'
                        : 'border-secondary bg-secondary/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Rank and Name */}
                      <div className="flex items-start gap-3 flex-1">
                        {medal ? (
                          <span className="text-2xl">{medal}</span>
                        ) : (
                          <span className="text-2xl font-bold text-muted-foreground">
                            #{rank}
                          </span>
                        )}

                        <div className="flex-1">
                          <p className="font-semibold">{envelope.name}</p>
                          <p className="text-sm text-muted-foreground">{envelope.type}</p>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-right">
                        <p className="text-3xl font-bold text-primary">
                          {envelope.score.toFixed(0)}
                        </p>
                        <Badge className={`${badge.color} text-white text-xs mt-1`}>
                          {badge.label}
                        </Badge>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="mt-3 grid grid-cols-3 gap-2 pt-3 border-t border-border/50">
                      <div>
                        <p className="text-xs text-muted-foreground">Budgeted</p>
                        <p className="text-sm font-medium">
                          ${envelope.budgeted?.toFixed(2) || '0'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Spent</p>
                        <p className="text-sm font-medium">
                          ${envelope.spent?.toFixed(2) || '0'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        {envelope.spent && envelope.budgeted && envelope.spent <= envelope.budgeted ? (
                          <p className="text-sm font-medium text-green-600 flex items-center gap-1">
                            <TrendingDown className="h-3 w-3" />
                            Under
                          </p>
                        ) : (
                          <p className="text-sm font-medium text-red-600 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Over
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-3 space-y-1">
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${Math.min(
                              envelope.budgeted
                                ? (envelope.spent! / envelope.budgeted) * 100
                                : 0,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {envelope.budgeted
                          ? (
                              ((envelope.spent! / envelope.budgeted) * 100).toFixed(0)
                            )
                          : '0'}
                        % of budget used
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No envelope rankings available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="bg-secondary/50">
        <CardContent className="pt-4">
          <p className="text-sm font-medium mb-2">Performance Levels</p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>🥇 1st Place: Top performer, excellent budget management</p>
            <p>🥈 2nd Place: Strong performance, consistent spending control</p>
            <p>🥉 3rd Place: Good performance, room for improvement</p>
            <p># Ranked: Needs attention and focus for improvement</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
