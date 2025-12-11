'use client';

/**
 * Allocation Feedback Form Component
 * Collects user feedback after allocation for ML model training
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';

interface AllocationFeedbackFormProps {
  incomeAmount: number;
  templateType: string;
  onSubmit: (rating: number, comment: string) => void;
  onSkip: () => void;
  isLoading?: boolean;
}

export function AllocationFeedbackForm({
  incomeAmount,
  templateType,
  onSubmit,
  onSkip,
  isLoading = false,
}: AllocationFeedbackFormProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleSubmit = () => {
    if (rating !== null) {
      onSubmit(rating, comment);
    }
  };

  const displayRating = hoverRating !== null ? hoverRating : rating;

  const getRatingLabel = (r: number | null): string => {
    if (r === null) return 'Rate the suggestions';
    if (r === 1) return 'Poor';
    if (r === 2) return 'Fair';
    if (r === 3) return 'Good';
    if (r === 4) return 'Very Good';
    if (r === 5) return 'Excellent';
    return '';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Help Us Improve</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Summary */}
          <div className="p-4 bg-secondary rounded-lg space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Income Allocated:</span>
              <span className="font-medium">${incomeAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Template Used:</span>
              <span className="font-medium">{templateType}</span>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-3">
            <Label>How helpful were these suggestions?</Label>

            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="transition-transform hover:scale-110"
                  title={`${value} star${value !== 1 ? 's' : ''}`}
                >
                  <Star
                    className={`h-8 w-8 ${
                      value <= (displayRating || 0)
                        ? 'fill-primary text-primary'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>

            {displayRating !== null && (
              <p className="text-center text-sm text-muted-foreground">
                {getRatingLabel(displayRating)}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="feedback-comment">Comments (optional)</Label>
            <Textarea
              id="feedback-comment"
              placeholder="Tell us what could be improved about our suggestions..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Your feedback helps us improve our AI suggestions
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onSkip}
              disabled={isLoading}
              className="flex-1"
            >
              Skip for Now
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === null || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info message */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          Your feedback is completely anonymous and helps us train better allocation algorithms.
        </p>
      </div>
    </div>
  );
}
