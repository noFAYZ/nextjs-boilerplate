/**
 * Subscription Management Module
 *
 * A complete, production-ready subscription management system for React applications.
 *
 * @module subscription-module
 * @version 1.0.0
 */

// ============================================================================
// COMPONENTS
// ============================================================================

export { SubscriptionCard } from './components/subscription-card'
export { SubscriptionDetailsModal } from './components/subscription-details-modal'
export { SubscriptionList } from './components/subscription-list'
export { SubscriptionFormModal } from './components/subscription-form-modal'
export { SubscriptionFiltersSheet } from './components/subscription-filters-sheet'
export { SubscriptionAnalytics } from './components/subscription-analytics'

// ============================================================================
// HOOKS - Data Fetching & Mutations
// ============================================================================

export {
  // Query Hooks
  useSubscriptions,
  useSubscription,
  useSubscriptionAnalytics,

  // Mutation Hooks
  useCreateSubscription,
  useUpdateSubscription,
  useDeleteSubscription,
  useDetectSubscriptions,
} from './hooks/use-subscription-data'

// ============================================================================
// QUERY FACTORIES
// ============================================================================

export { subscriptionQueries } from './queries/subscription-queries'

// ============================================================================
// STORES - UI State Management
// ============================================================================

export { useSubscriptionUIStore } from './stores/subscription-ui-store'

// ============================================================================
// SERVICES - API & Utilities
// ============================================================================

export { subscriptionsApi } from './services/subscriptions-api'
export { logoService, getLogoUrl, enrichWithLogo } from './services/logo-service'

// ============================================================================
// TYPES
// ============================================================================

export type {
  // Main Types
  UserSubscription,
  SubscriptionListResponse,
  SubscriptionAnalytics,
  SubscriptionCharge,
  AutoDetectResponse,

  // Request Types
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  AddChargeRequest,
  SubscriptionFilters,

  // Enums
  SubscriptionStatus,
  SubscriptionCategory,
  BillingCycle,
  SubscriptionSourceType,
} from './types/subscription'

// ============================================================================
// VERSION & METADATA
// ============================================================================

export const VERSION = '1.0.0'
export const MODULE_NAME = 'subscription-module'
export const AUTHOR = 'MoneyMappr Team'
