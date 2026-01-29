/**
 * Budget Queries Module
 *
 * Consolidated budget, envelope, and income allocation queries
 */

// Main budget data hooks
export * from './use-budget-data';

// Budget feature-specific hooks
export * from './use-budget-alerts-data';
export * from './use-budget-analytics-data';
export * from './use-budget-forecasting-data';
export * from './use-budget-reports-data';
export * from './use-budget-templates-data';

// Envelope and income allocation
export * from './use-envelope-data';
export * from './use-income-allocation-data';

// Query factories
export * from './budget-queries';
