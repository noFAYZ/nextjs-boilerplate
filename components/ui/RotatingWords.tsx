'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import {
  DuoIconsBank,
  FinancesIconDuotone,
  MageGoals,
  SolarInboxInBoldDuotone,
  SolarPieChart2BoldDuotone,
  SolarWalletMoneyBoldDuotone,
} from '../icons/icons';
import { cn } from '@/lib/utils';

type Item = { label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> };

const rotatingItems: Item[] = [
  { label: 'Finances', icon: FinancesIconDuotone },
  { label: 'Banks', icon: DuoIconsBank },
  { label: 'Crypto', icon: SolarWalletMoneyBoldDuotone },
  { label: 'Subscriptions', icon: SolarInboxInBoldDuotone },
  { label: 'Budgets', icon: SolarPieChart2BoldDuotone },
  { label: 'Goals', icon: MageGoals },
];

interface RotatingHeadlineProps {
  /** Time in ms before rotating to next item (default: 4000) */
  interval?: number;
  /** Whether rotation should pause on window blur (default: true) */
  pauseOnBlur?: boolean;
  /** Optional custom className for container */
  className?: string;
}

export function RotatingHeadline({
  interval = 4000,
  pauseOnBlur = true,
  className,
}: RotatingHeadlineProps) {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle rotation interval robustly
  useEffect(() => {
    const startRotation = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setIndex((i) => (i + 1) % rotatingItems.length);
      }, interval);
    };

    const stopRotation = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };

    startRotation();

    if (pauseOnBlur) {
      window.addEventListener('blur', stopRotation);
      window.addEventListener('focus', startRotation);
    }

    return () => {
      stopRotation();
      if (pauseOnBlur) {
        window.removeEventListener('blur', stopRotation);
        window.removeEventListener('focus', startRotation);
      }
    };
  }, [interval, pauseOnBlur]);

  const { label, icon: Icon } = rotatingItems[index];

  return (
    <div
      className={cn(
        'flex items-center gap-2  select-none  min-h-[2.5rem] sm:min-h-[3rem]',
        className
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          className="flex items-center gap-2 min-h-[2.5rem] sm:min-h-[3rem]"
        >
          {/* Icon container 
          <motion.div
            layout
            className={cn(
              'relative flex items-center justify-center',
              'p-1.5 sm:p-2 rounded-xl md:rounded-3xl border shadow-lg backdrop-blur-xl',
              'bg-accent/90 dark:bg-amber-500/20 border-orange-500/15',
              'transition-shadow duration-200 group-hover:shadow-orange-500/20'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <Icon
              className={cn(
                'text-orange-500/80',
                'h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 xl:h-12 xl:w-12'
              )}
            />
          </motion.div>*/}

          {/* Label */}
          <motion.span
            layout
            className={cn(
              'px-1 font-bold tracking-tight bg-gradient-to-r from-orange-400 via-orange-400 to-orange-500',
              'bg-clip-text text-transparent',
              'overflow-visible font-[900]'
            )}
            transition={{ duration: 0.3 }}
          >
            {label}
          </motion.span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
