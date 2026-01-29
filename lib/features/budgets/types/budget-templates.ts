/**
 * Budget Templates Types
 * Handles budget templates like 50-30-20, YNAB, etc.
 */

export type TemplateType = '50-30-20' | 'ynab' | 'envelope' | 'custom';

export interface TemplateEnvelope {
  name: string;
  percentage?: number;
  description: string;
  envelopeType?: 'SPENDING' | 'SAVINGS_GOAL' | 'SINKING_FUND' | 'FLEXIBLE';
  icon?: string;
  color?: string;
}

export interface BudgetTemplate {
  id: string;
  name: string;
  type: TemplateType;
  description: string;
  envelopes: TemplateEnvelope[];
  icon?: string;
  tags?: string[];
  recommended?: boolean;
}

export interface GetBudgetTemplatesResponse {
  success: boolean;
  data: {
    templates: BudgetTemplate[];
    count: number;
  };
  timestamp: string;
}

export interface GetBudgetTemplateResponse {
  success: boolean;
  data: BudgetTemplate;
  timestamp: string;
}

export interface ApplyBudgetTemplateRequest {
  budgetName: string;
  monthlyIncome?: number;
  customizeName?: boolean;
  customizeAmounts?: boolean;
  customEnvelopes?: Array<{
    name: string;
    percentage?: number;
    amount?: number;
  }>;
  organizationId?: string;
}

export interface TemplateEnvelopeResult {
  id: string;
  name: string;
  allocatedAmount: number;
  icon?: string;
  color?: string;
}

export interface ApplyBudgetTemplateResponse {
  success: boolean;
  data: {
    budgetId: string;
    name: string;
    envelopes: TemplateEnvelopeResult[];
    totalAllocated: number;
    timestamp: string;
  };
}

// Common template definitions
export const BUDGET_TEMPLATES = {
  '50-30-20': {
    id: '50-30-20',
    name: '50-30-20 Rule',
    type: '50-30-20' as TemplateType,
    description: '50% Needs, 30% Wants, 20% Savings',
    envelopes: [
      {
        name: 'Needs',
        percentage: 50,
        description: 'Housing, utilities, groceries, transportation',
        envelopeType: 'SPENDING' as const,
      },
      {
        name: 'Wants',
        percentage: 30,
        description: 'Dining, entertainment, hobbies, shopping',
        envelopeType: 'SPENDING' as const,
      },
      {
        name: 'Savings',
        percentage: 20,
        description: 'Emergency fund, investments, debt repayment',
        envelopeType: 'SAVINGS_GOAL' as const,
      },
    ],
  },
  ynab: {
    id: 'ynab',
    name: 'YNAB (You Need A Budget)',
    type: 'ynab' as TemplateType,
    description: 'Give every dollar a job, embrace true expenses, roll with punches, age your money',
    envelopes: [
      {
        name: 'Essential Expenses',
        description: 'Necessary spending that must happen',
        envelopeType: 'SPENDING' as const,
      },
      {
        name: 'True Expenses',
        description: 'Large expenses spread across months',
        envelopeType: 'SINKING_FUND' as const,
      },
      {
        name: 'Quality of Life',
        description: 'Goals and dreams',
        envelopeType: 'SPENDING' as const,
      },
      {
        name: 'Emergency Fund',
        description: 'Safety net for unexpected events',
        envelopeType: 'SAVINGS_GOAL' as const,
      },
    ],
  },
  envelope: {
    id: 'envelope',
    name: 'Classic Envelope System',
    type: 'envelope' as TemplateType,
    description: 'Traditional envelope budgeting with customizable categories',
    envelopes: [
      {
        name: 'Housing',
        description: 'Rent or mortgage',
        envelopeType: 'SPENDING' as const,
      },
      {
        name: 'Groceries',
        description: 'Food and household items',
        envelopeType: 'SPENDING' as const,
      },
      {
        name: 'Utilities',
        description: 'Electric, gas, water, internet',
        envelopeType: 'SPENDING' as const,
      },
      {
        name: 'Transportation',
        description: 'Gas, car payment, maintenance',
        envelopeType: 'SPENDING' as const,
      },
      {
        name: 'Personal Care',
        description: 'Hygiene and health products',
        envelopeType: 'SPENDING' as const,
      },
      {
        name: 'Entertainment',
        description: 'Movies, hobbies, dining out',
        envelopeType: 'SPENDING' as const,
      },
      {
        name: 'Emergency Fund',
        description: 'Savings for unexpected costs',
        envelopeType: 'SAVINGS_GOAL' as const,
      },
    ],
  },
} as const;
