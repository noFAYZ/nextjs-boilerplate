'use client';

import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type AdvancedGridProps = {
  variant?: 'dots' | 'lines' | 'hex' | 'mixed';
  density?: number;
  color?: string;
  className?: string;
};

export function AdvancedBackgroundGrid({
  variant = 'mixed',
  density = 1,
  color = 'hsl(var(--muted-foreground))',
  className = '',
}: AdvancedGridProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const configs = {
    dots: {
      size: 1,
      spacing: 40 * density,
      svg: `<circle cx="1" cy="1" r="1" fill="${color}" opacity="0.1"/>`,
    },
    lines: {
      size: 0.5,
      spacing: 40 * density,
      svg: `<path d="M0 0h40" stroke="${color}" stroke-width="0.5" opacity="0.08"/>`,
    },
    hex: {
      size: 4,
      spacing: 60 * density,
      svg: `<polygon points="30,0 60,15 60,45 30,60 0,45 0,15" fill="none" stroke="${color}" stroke-width="0.5" opacity="0.06"/>`,
    },
    mixed: {
      size: 1,
      spacing: 50 * density,
      svg: `<circle cx="1" cy="1" r="1" fill="${color}" opacity="0.1"/><path d="M0 25h50" stroke="${color}" stroke-width="0.3" opacity="0.05"/>`,
    },
  };

  const { spacing, svg } = configs[variant];

  return (
    <motion.div
      className={cn('absolute inset-0', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      aria-hidden="true"
    >
      <div
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='${spacing}' height='${spacing}' viewBox='0 0 ${spacing} ${spacing}' xmlns='http://www.w3.org/2000/svg'%3E${svg}%3C/svg%3E")`,
          backgroundSize: `${spacing}px ${spacing}px`,
        }}
        className={isDark ? 'opacity-10' : 'opacity-5'}
      />
      
      {/* Floating particles */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, ${color} 0.5px, transparent 0.5px),
            radial-gradient(circle at 75% 75%, ${color} 0.3px, transparent 0.3px)
          `,
          backgroundSize: `${spacing * 2}px ${spacing * 2}px`,
        }}
      />
    </motion.div>
  );
}