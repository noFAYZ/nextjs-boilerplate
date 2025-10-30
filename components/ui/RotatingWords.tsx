'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  DuoIconsBank,
  FinancesIconDuotone,
  HugeiconsAnalyticsUp,
  MageGoals,
  SolarChartSquareBoldDuotone,
  SolarInboxInBoldDuotone,
  SolarPieChart2BoldDuotone,
  SolarWalletMoneyBoldDuotone,
} from '../icons/icons';

type Item = { label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> };
const rotatingItems: Item[] = [
  { label: 'Finances', icon: FinancesIconDuotone },
  { label: 'Banks', icon: DuoIconsBank },
  { label: 'Crypto', icon: SolarWalletMoneyBoldDuotone },
  { label: 'Subscriptions', icon: SolarInboxInBoldDuotone },
  { label: 'Budgets', icon: SolarPieChart2BoldDuotone },
  { label: 'Goals', icon: MageGoals }, 
];

export function RotatingHeadline() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % rotatingItems.length);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  const { label, icon: Icon } = rotatingItems[index];

  return (
    <div
      className="flex items-center gap-2 sm:gap-3 md:gap-4 select-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="flex items-center gap-2  overflow-visible"
        >
          {/* Icon */}
          <div className="relative group">
            <div
              className={`
                relative flex items-center justify-center
                p-1.5 sm:p-2 rounded-xl sm:rounded-2xl md:rounded-[1.25rem] 
                bg-accent/90 dark:bg-amber-500/20 backdrop-blur-xl
                border border-orange-500/15
                shadow-lg
                transition-shadow duration-300
                group-hover:shadow-orange-500/20
              `}
            >
              <Icon
                className={`
                  h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10
                  text-orange-500/80
                `}
              />
            </div>
          </div>

          {/* Label */}
          <div className="relative">
            <motion.span
              className={` px-1 
              
                inline-block
                font-bold tracking-tight
                bg-gradient-to-r from-orange-400 via-orange-400 to-orange-500
                bg-clip-text text-transparent
                /* fluid headline size */
                text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl
              `}
            >
              {label}
            </motion.span>

       
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}