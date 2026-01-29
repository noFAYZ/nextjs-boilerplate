# Goals Components

This directory contains all React components for the Goals feature in MoneyMappr.

## Components Overview

### 1. **goal-card.tsx** (450 lines)
Display individual goal cards with comprehensive information and actions.

**Features:**
- Grid and list view modes
- Progress bars with color coding
- Priority badges
- Days remaining indicator
- Milestone previews
- Action menu (edit, delete, calculate progress, add contribution)
- On-track/off-track indicators
- Support for achieved, active, and archived goals

**Components:**
- `GoalCard` - Single goal card component
- `GoalList` - List of goal cards with loading and empty states

**Usage:**
```tsx
import { GoalCard, GoalList } from "@/components/goals"

<GoalCard
  goal={goal}
  viewMode="grid"
  onEdit={handleEdit}
  onDelete={handleDelete}
  onCalculateProgress={handleRefresh}
  onAddContribution={handleContribute}
/>
```

---

### 2. **goal-analytics.tsx** (439 lines)
Comprehensive analytics dashboard for goal tracking.

**Features:**
- Summary stat cards (total, completed, on-track, average progress)
- Financial summary (target amount, current amount, average days to completion)
- Interactive charts:
  - Goals by type (bar chart)
  - Goals by priority (pie chart)
  - Goals by category (bar chart)
  - Financial progress visualization
- Top performing goals list
- Urgent goals list
- Status summary grid

**Components:**
- `GoalAnalyticsDashboard` - Main analytics dashboard
- `StatCard` - Reusable stat card component (internal)

**Usage:**
```tsx
import { GoalAnalyticsDashboard } from "@/components/goals"

<GoalAnalyticsDashboard
  analytics={analyticsData}
  goals={goalsArray}
  loading={isLoading}
/>
```

---

### 3. **create-goal-dialog.tsx** (784 lines)
Full-featured dialog for creating new goals.

**Features:**
- Form with validation using React Hook Form + Zod
- All goal fields supported:
  - Basic info (name, description, type, category, priority)
  - Financial details (target amount, starting amount, recurring contributions)
  - Timeline (start date, target date)
  - Source configuration (manual, bank account, crypto wallet, etc.)
  - Milestones creation
  - Tags management
  - Notes
- Dynamic milestone management
- Tag input with autocomplete
- Source-specific fields (account ID, wallet ID)
- Loading states and error handling

**Components:**
- `CreateGoalDialog` - Main dialog component

**Usage:**
```tsx
import { CreateGoalDialog } from "@/components/goals"

<CreateGoalDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  onSuccess={handleSuccess}
/>
```

---

### 4. **goal-filters-sheet.tsx** (411 lines)
Advanced filtering sheet for goal management.

**Features:**
- Multi-select filters:
  - Goal types
  - Categories
  - Priorities
  - Source types
- Date range picker (target date from/to)
- Tag selection with custom tag input
- Status toggles:
  - Show achieved goals
  - Show inactive goals
  - Show archived goals
  - On-track only filter
- Active filter count badge
- Clear all filters button
- Integrated with Zustand store

**Components:**
- `GoalFiltersSheet` - Main filter sheet component

**Usage:**
```tsx
import { GoalFiltersSheet } from "@/components/goals"

<GoalFiltersSheet
  open={isOpen}
  onOpenChange={setIsOpen}
/>
```

---

### 5. **goal-milestones.tsx** (428 lines)
Milestone tracking and visualization components.

**Features:**
- Visual milestone timeline with connecting lines
- Progress indicators for each milestone
- Achievement badges and dates
- Celebration messages
- Next milestone highlighting
- Collapsible detailed view
- Overall progress tracking
- Final goal indicator

**Components:**
- `GoalMilestones` - Full milestone view with timeline
- `MilestoneList` - Compact milestone list for cards
- `MilestoneProgress` - Minimal progress indicator

**Usage:**
```tsx
import { GoalMilestones, MilestoneList, MilestoneProgress } from "@/components/goals"

// Full view
<GoalMilestones
  goal={goal}
  showDetails={true}
  compact={false}
/>

// Compact list
<MilestoneList
  milestones={goal.milestones}
  goal={goal}
  maxDisplay={3}
/>

// Progress indicator
<MilestoneProgress milestones={goal.milestones} />
```

---

## Integration

All components are integrated with:
- **Zustand Store**: `@/lib/stores/goals-store` for state management
- **API Service**: `@/lib/services/goals-api` for backend communication
- **Type Definitions**: `@/lib/types/goals` for TypeScript types
- **UI Components**: Shadcn/ui component library
- **Toast Notifications**: Sonner for user feedback

## State Management

The components use the Zustand store for:
- Goals data (list, selected, pagination)
- Filters and view preferences
- Loading states
- Analytics data

## Styling

All components follow the project's design system:
- Tailwind CSS 4 for styling
- Dark mode support
- Responsive design
- Consistent spacing and typography
- Accessible color contrasts

## Dependencies

### UI Components Used:
- Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction, CardFooter
- Badge (multiple variants)
- Button (multiple variants)
- Progress
- Dialog
- Sheet
- Form, FormField, FormItem, FormLabel, FormControl, FormMessage
- Input, Textarea
- Select, SelectTrigger, SelectValue, SelectContent, SelectItem
- DatePicker
- MultiSelect
- Switch
- Tooltip
- DropdownMenu
- Collapsible
- Separator

### External Libraries:
- `react-hook-form` - Form state management
- `zod` - Schema validation
- `@hookform/resolvers/zod` - Form validation integration
- `sonner` - Toast notifications
- `lucide-react` - Icons

## Best Practices

1. **Type Safety**: All components are fully typed with TypeScript
2. **Error Handling**: Proper try-catch blocks and user feedback
3. **Loading States**: All async operations show loading indicators
4. **Accessibility**: Proper ARIA labels and keyboard navigation
5. **Responsive**: Mobile-first design approach
6. **Performance**: Memoization and optimized re-renders
7. **Code Organization**: Clear separation of concerns

## Example Usage Flow

```tsx
"use client"

import { useState } from "react"
import {
  GoalList,
  GoalAnalyticsDashboard,
  CreateGoalDialog,
  GoalFiltersSheet
} from "@/components/goals"
import { useGoalsStore } from "@/lib/stores/goals-store"
import { goalsApi } from "@/lib/services/goals-api"

export function GoalsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const { goals, analytics, filters } = useGoalsStore()

  return (
    <div className="space-y-6">
      {/* Analytics Dashboard */}
      <GoalAnalyticsDashboard
        analytics={analytics}
        goals={goals}
      />

      {/* Goals List */}
      <GoalList
        goals={goals}
        viewMode="grid"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Dialogs */}
      <CreateGoalDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <GoalFiltersSheet
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
      />
    </div>
  )
}
```

## Notes

- All components support both light and dark modes
- Components are designed to work together but can be used independently
- Follow Next.js 15 and React 19 best practices
- Use server components where possible, client components marked with "use client"
