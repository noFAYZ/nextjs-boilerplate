'use client';

/**
 * Animated Card Component
 * Card with entrance and interaction animations
 */

import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnimatedCardProps {
  children: ReactNode;
  title?: string;
  description?: string;
  delay?: number;
  hover?: boolean;
}

export function AnimatedCard({
  children,
  title,
  description,
  delay = 0,
  hover = true,
}: AnimatedCardProps) {
  const style = {
    animation: `fadeInUp 0.5s ease-out ${delay * 0.1}s both`,
  };

  return (
    <Card
      className={hover ? 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1' : ''}
      style={style}
    >
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </CardHeader>
      )}
      {children ? <CardContent>{children}</CardContent> : null}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Card>
  );
}
