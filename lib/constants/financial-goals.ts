export const FINANCIAL_GOALS = {
  'track-spending': {
    id: 'track-spending',
    name: 'Track Spending',
    description: 'Monitor and categorize your expenses to understand where your money goes.',
    icon: '📊',
    color: 'from-blue-500 to-blue-600',
  },
  'build-wealth': {
    id: 'build-wealth',
    name: 'Build Wealth',
    description: 'Accumulate assets and increase your net worth over time.',
    icon: '💰',
    color: 'from-green-500 to-green-600',
  },
  'emergency-fund': {
    id: 'emergency-fund',
    name: 'Emergency Fund',
    description: 'Save 3-6 months of expenses for financial security.',
    icon: '🆘',
    color: 'from-red-500 to-red-600',
  },
  'retirement': {
    id: 'retirement',
    name: 'Plan for Retirement',
    description: 'Save and invest for a comfortable retirement.',
    icon: '🏖️',
    color: 'from-orange-500 to-orange-600',
  },
  'debt-free': {
    id: 'debt-free',
    name: 'Become Debt Free',
    description: 'Eliminate debt and achieve financial freedom.',
    icon: '✂️',
    color: 'from-purple-500 to-purple-600',
  },
  'invest': {
    id: 'invest',
    name: 'Investment Growth',
    description: 'Grow wealth through strategic investments.',
    icon: '📈',
    color: 'from-indigo-500 to-indigo-600',
  },
  'buy-home': {
    id: 'buy-home',
    name: 'Buy a Home',
    description: 'Save for a down payment and own your own place.',
    icon: '🏠',
    color: 'from-amber-500 to-amber-600',
  },
  'financial-independence': {
    id: 'financial-independence',
    name: 'Financial Independence',
    description: 'Achieve financial freedom and live by your own terms.',
    icon: '🚀',
    color: 'from-pink-500 to-pink-600',
  },
} as const;

export type FinancialGoalId = keyof typeof FINANCIAL_GOALS;

export const GOAL_IDS = Object.keys(FINANCIAL_GOALS) as FinancialGoalId[];

export const getGoal = (id: string) => {
  return FINANCIAL_GOALS[id as FinancialGoalId] || null;
};

export const getGoals = (ids: string[]) => {
  return ids
    .map((id) => getGoal(id))
    .filter((goal) => goal !== null);
};
