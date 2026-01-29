# Budgets V3 Component Library

Comprehensive budgeting system combining envelope and traditional budgeting with AI-powered features.

## 📁 Directory Structure

```
budgets-v3/
├── layout/                    # Page layout components
│   ├── budgets-v3-header.tsx         # Page title and quick actions
│   └── budgets-v3-tab-navigation.tsx # Tab navigation system
├── tabs/                      # Main tab views
│   ├── overview-tab.tsx                # Dashboard overview
│   ├── income-allocation-tab.tsx       # Income allocation wizard
│   ├── envelopes-tab.tsx               # Envelope management
│   ├── traditional-budgets-tab.tsx     # Traditional budgets
│   ├── forecasting-tab.tsx             # Spending forecasts
│   └── analytics-tab.tsx               # Financial analytics
├── income-allocation/         # Income allocation features (6 components)
│   ├── income-input-form.tsx
│   ├── allocation-suggestion-card.tsx
│   ├── allocation-suggestions-list.tsx
│   ├── allocation-adjustment-modal.tsx
│   ├── allocation-confirmation-summary.tsx
│   └── allocation-feedback-form.tsx
├── forecasting/               # Forecasting features (6 components)
│   ├── forecast-chart.tsx
│   ├── confidence-bands-info.tsx
│   ├── spending-insights-card.tsx
│   ├── forecast-recommendations.tsx
│   ├── forecast-envelope-selector.tsx
│   └── forecast-period-selector.tsx
├── analytics/                 # Analytics features (5 components)
│   ├── spending-by-category-chart.tsx
│   ├── health-score-breakdown.tsx
│   ├── period-comparison-chart.tsx
│   ├── envelope-ranking.tsx
│   └── spending-velocity-indicator.tsx
└── shared/                    # Reusable components (15+ components)
    ├── budget-card.tsx
    ├── envelope-card.tsx
    ├── empty-state.tsx
    ├── budget-form.tsx
    ├── skeleton-card.tsx
    ├── skeleton-grid.tsx
    ├── skeleton-list.tsx
    ├── error-boundary.tsx
    ├── error-state.tsx
    ├── loading-state.tsx
    ├── animated-card.tsx
    ├── responsive-container.tsx
    ├── status-badge.tsx
    └── README.md (this file)
```

## 🎨 Component Usage Guide

### Layout Components

#### BudgetsV3Header
Main page header with title and quick actions.

```tsx
import { BudgetsV3Header } from '@/components/budgets-v3/layout/budgets-v3-header';

<BudgetsV3Header />
```

#### BudgetsV3TabNavigation
Tab navigation for switching between views.

```tsx
import { BudgetsV3TabNavigation } from '@/components/budgets-v3/layout/budgets-v3-tab-navigation';

<BudgetsV3TabNavigation />
```

### Tab Components

Each tab is a complete view with integrated data loading and error handling.

```tsx
import { OverviewTab } from '@/components/budgets-v3/tabs/overview-tab';

<OverviewTab />
```

### Income Allocation Components

Complete multi-step wizard for AI-powered income allocation.

```tsx
import { IncomeInputForm } from '@/components/budgets-v3/income-allocation/income-input-form';
import { AllocationSuggestionsList } from '@/components/budgets-v3/income-allocation/allocation-suggestions-list';

// Step 1: Input income and select template
<IncomeInputForm
  onSubmit={(income, template) => handleNext(income, template)}
/>

// Step 2: Display suggestions
<AllocationSuggestionsList
  suggestions={suggestions}
  incomeAmount={incomeAmount}
/>
```

### Forecasting Components

Spending forecast and analysis components.

```tsx
import { ForecastChart } from '@/components/budgets-v3/forecasting/forecast-chart';
import { ConfidenceBandsInfo } from '@/components/budgets-v3/forecasting/confidence-bands-info';
import { SpendingInsightsCard } from '@/components/budgets-v3/forecasting/spending-insights-card';

<ForecastChart
  historicalData={historical}
  projectedData={projected}
  envelopeName="Groceries"
  chartType="area"
  showConfidenceBands
/>

<ConfidenceBandsInfo
  confidence={0.85}
  upperBound={500}
  lowerBound={400}
  projectedAmount={450}
/>

<SpendingInsightsCard insights={insights} />
```

### Analytics Components

Detailed financial analytics and reporting.

```tsx
import { SpendingByCategoryChart } from '@/components/budgets-v3/analytics/spending-by-category-chart';
import { HealthScoreBreakdown } from '@/components/budgets-v3/analytics/health-score-breakdown';
import { EnvelopeRanking } from '@/components/budgets-v3/analytics/envelope-ranking';

<SpendingByCategoryChart data={data} chartType="pie" />

<HealthScoreBreakdown
  overallScore={85}
  rating="Very Good"
  components={scoreComponents}
/>

<EnvelopeRanking rankings={rankings} metric="efficiency" />
```

### Shared Components

#### Card Components

```tsx
import { BudgetCard } from '@/components/budgets-v3/shared/budget-card';
import { EnvelopeCard } from '@/components/budgets-v3/shared/envelope-card';

<BudgetCard
  id="budget-1"
  name="Monthly Groceries"
  budgetAmount={500}
  spentAmount={350}
  cycle="monthly"
  onEdit={handleEdit}
/>

<EnvelopeCard
  id="env-1"
  name="Food"
  envelopeType="expense"
  currentBalance={500}
  budgetLimit={600}
  onAllocate={handleAllocate}
/>
```

#### Form Components

```tsx
import { BudgetForm } from '@/components/budgets-v3/shared/budget-form';

<BudgetForm
  title="Create New Budget"
  formType="budget"
  onSubmit={async (data) => await createBudget(data)}
  submitLabel="Create"
/>
```

#### Loading & Error Components

```tsx
import { SkeletonCard, SkeletonGrid } from '@/components/budgets-v3/shared/skeleton-*';
import { LoadingState, InlineLoading } from '@/components/budgets-v3/shared/loading-state';
import { ErrorState, ErrorBoundary } from '@/components/budgets-v3/shared/error-state';

// Loading states
<SkeletonCard hasHeader variant="default" />
<SkeletonGrid columns={3} count={6} variant="card" />
<LoadingState message="Loading budgets..." fullHeight />
<InlineLoading message="Saving..." size="sm" />

// Error states
<ErrorState
  title="Failed to load data"
  message="Please try again"
  onRetry={handleRetry}
/>

// Error boundary
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

#### Status Components

```tsx
import { StatusBadge, StatusIndicator } from '@/components/budgets-v3/shared/status-badge';

<StatusBadge status="success" label="On Track" />
<StatusIndicator status="warning" label="At Risk" animated />
```

#### Responsive Components

```tsx
import {
  ResponsiveContainer,
  ResponsiveFlex,
} from '@/components/budgets-v3/shared/responsive-container';

<ResponsiveContainer columns={3} gap="md">
  <BudgetCard {...} />
  <BudgetCard {...} />
  <BudgetCard {...} />
</ResponsiveContainer>

<ResponsiveFlex direction="row" justify="between" align="center" gap="md">
  <h2>Title</h2>
  <Button>Action</Button>
</ResponsiveFlex>
```

## 🪝 Custom Hooks

### useAsyncOperation

Manage async operations with loading/error/success states.

```tsx
import { useAsyncOperation } from '@/lib/hooks/use-async-operation';

const { data, isLoading, error, execute } = useAsyncOperation<BudgetData>();

const handleLoadBudgets = async () => {
  await execute(async () => {
    return await fetchBudgets();
  });
};
```

### useBudgetModals

Manage modal states.

```tsx
import { useBudgetModals } from '@/lib/hooks/use-budget-modals';

const { modals, openModal, closeModal, toggleModal } = useBudgetModals();

<button onClick={() => openModal('isIncomeAllocationModalOpen')}>
  Allocate Income
</button>
```

### useBudgetFilters

Manage budget filters.

```tsx
import { useBudgetFilters } from '@/lib/hooks/use-budget-filters';

const { filters, isFiltered, handleFilterChange, handleClearFilters } = useBudgetFilters();

<Select value={filters.searchQuery} onValueChange={(v) => handleFilterChange('searchQuery', v)} />
```

## 📊 Data Hooks

All server data is managed through TanStack Query hooks.

```tsx
import {
  useDashboardMetrics,
  useFinancialHealthScore,
  useIncomeAllocationSuggestions,
  useEnvelopeForecast,
  useBudgetTemplates,
} from '@/lib/queries';

const { data: metrics } = useDashboardMetrics();
const { data: healthScore } = useFinancialHealthScore();
const { data: suggestions } = useIncomeAllocationSuggestions({ incomeAmount: 5000, templateType: '50-30-20' });
const { data: forecast } = useEnvelopeForecast(envelopeId, 30);
const { data: templates } = useBudgetTemplates();
```

## 🎯 Best Practices

### 1. Use Skeletons for Loading States
Always show skeleton placeholders while data is loading.

```tsx
if (isLoading) return <SkeletonCard hasHeader variant="chart" />;
if (error) return <ErrorState title="Failed to load" onRetry={refetch} />;
return <YourComponent data={data} />;
```

### 2. Wrap Components in Error Boundary
Protect critical sections with error boundaries.

```tsx
<ErrorBoundary>
  <IncomeAllocationTab />
</ErrorBoundary>
```

### 3. Use Responsive Containers
Ensure components work on all screen sizes.

```tsx
<ResponsiveContainer columns={3} gap="md">
  {items.map((item) => <Card key={item.id} {...item} />)}
</ResponsiveContainer>
```

### 4. Handle Empty States
Always show meaningful empty states.

```tsx
if (!budgets || budgets.length === 0) {
  return (
    <EmptyState
      title="No budgets yet"
      description="Create your first budget to get started"
      actionLabel="Create Budget"
      onAction={handleCreate}
    />
  );
}
```

### 5. Follow Accessibility Guidelines
- Use semantic HTML
- Add proper ARIA labels
- Ensure color contrast
- Test with screen readers

## 🔗 Integration with State

### UI State (Zustand)
```tsx
import { useBudgetsV3UIStore } from '@/lib/stores/budgets-v3-ui-store';

const { activeTab, setActiveTab, filters } = useBudgetsV3UIStore();
```

### Server State (TanStack Query)
```tsx
import { useDashboardMetrics } from '@/lib/queries';

const { data, isLoading, error } = useDashboardMetrics();
```

## 📚 Additional Resources

- CLAUDE.md - Project architecture guidelines
- TanStack Query Docs - Data fetching documentation
- Zustand Docs - State management documentation
- Radix UI - Accessible component primitives
- Tailwind CSS - Utility-first CSS framework

## 🐛 Troubleshooting

### Components not rendering
- Check if TanStack Query provider is set up
- Verify Zustand store is initialized
- Ensure authentication is complete

### Loading states showing indefinitely
- Check network tab for failed requests
- Verify API endpoints are correct
- Review error handling in query hooks

### State not updating
- Confirm you're using the correct hook
- Check if actions are being called correctly
- Verify store middleware is configured

---

Last Updated: December 10, 2025
