export const BUDGET_TEMPLATES = {
  'zero-based': {
    id: 'zero-based',
    name: 'Zero-Based Budgeting',
    description: 'Allocate every dollar to a specific purpose. Give every dollar a job.',
    icon: '🎯',
    color: 'from-blue-500 to-blue-600',
    recommended: true,
    allocation: {
      essential: 50,
      personal: 30,
      savings: 20,
    },
  },
  'envelope': {
    id: 'envelope',
    name: 'Envelope System',
    description: 'Classic envelope method with separate budget categories for different spending areas.',
    icon: '✉️',
    color: 'from-amber-500 to-amber-600',
    allocation: {
      housing: 30,
      food: 15,
      transportation: 15,
      utilities: 10,
      entertainment: 10,
      savings: 20,
    },
  },
  '50-30-20': {
    id: '50-30-20',
    name: '50-30-20 Rule',
    description: '50% Needs, 30% Wants, 20% Savings. Simple and balanced approach.',
    icon: '📊',
    color: 'from-emerald-500 to-emerald-600',
    allocation: {
      needs: 50,
      wants: 30,
      savings: 20,
    },
  },
  'custom': {
    id: 'custom',
    name: 'Build Your Own',
    description: 'Create a custom budget based on your unique financial situation.',
    icon: '🛠️',
    color: 'from-purple-500 to-purple-600',
  },
} as const;

export type BudgetTemplateId = keyof typeof BUDGET_TEMPLATES;

export const BUDGET_TEMPLATE_IDS = Object.keys(BUDGET_TEMPLATES) as BudgetTemplateId[];

export const getBudgetTemplate = (id: string) => {
  return BUDGET_TEMPLATES[id as BudgetTemplateId] || null;
};
