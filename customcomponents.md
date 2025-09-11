# MoneyMappr Custom Components Library

A comprehensive UI component library built with React, TypeScript, Tailwind CSS, and shadcn/ui. This library contains 80+ components organized into 13 categories, designed specifically for the MoneyMappr financial management platform.

## 🎯 Overview

This component library provides a complete set of UI components with multiple variants, states, and interactive examples. All components are built with accessibility, responsive design, and modern development practices in mind.

## 📊 Component Statistics

- **Total Components**: 80+
- **Categories**: 13
- **Component Variants**: 200+ different variants across all components
- **Interactive Demos**: Every component includes live, interactive examples

## 🎨 Design System

### Core Principles
- **Consistent Design Language**: All components follow a unified design system
- **Accessibility First**: WCAG 2.1 compliant with proper ARIA attributes
- **Responsive Design**: Mobile-first approach with responsive variants
- **Dark Mode Support**: Full dark/light theme support
- **Cursor Interactivity**: Proper cursor states for all interactive elements

### Technology Stack
- **React 18+** with TypeScript
- **Tailwind CSS 4.0** for styling
- **Radix UI** for accessibility primitives
- **Class Variance Authority (CVA)** for variant management
- **Lucide React** for icons
- **Framer Motion** for animations

## 📂 Component Categories

### 1. Basic UI (12 Components)

#### Button
**Description**: Clickable button component with multiple variants and sizes
**Variants**:
- `default` - Primary button style
- `secondary` - Secondary button style  
- `outline` - Outlined button
- `ghost` - Transparent button
- `link` - Link-styled button
- `destructive` - Destructive action button
- `success` - Success state button
- `warning` - Warning state button
- `premium` - Premium gradient button
- `enterprise` - Enterprise gradient button

**Sizes**: `xs`, `sm`, `default`, `lg`, `xl`, `icon`, `icon-sm`, `icon-lg`, `icon-xl`

**States**: Normal, Hover, Active, Disabled, Loading

**Features**:
- Icon support (left/right positioning)
- Loading state with spinner
- Cursor pointer styling
- Keyboard navigation
- Focus management

#### Input
**Description**: Text input field with various types and states
**Types**:
- `text` - Standard text input
- `email` - Email validation
- `password` - Password input with masking
- `number` - Numeric input
- `search` - Search input
- `url` - URL validation
- `tel` - Telephone input
- `date` - Date picker input

**States**: Normal, Focused, Error, Success, Disabled, Read-only

**Features**:
- Icon integration (left/right)
- Validation states
- Placeholder text
- Auto-sizing
- Keyboard shortcuts

#### Badge
**Description**: Small status indicators and labels
**Variants**:
- `default` - Primary badge
- `secondary` - Secondary badge
- `outline` - Outlined badge
- `destructive` - Error/destructive badge

**Styles**:
- Status badges (Success, Warning, Error, Info)
- Notification badges (with counts)
- Custom color variants
- Icon integration

#### Avatar
**Description**: User profile picture with fallback initials
**Sizes**: `sm`, `default`, `lg`, `xl`
**Features**:
- Image loading with fallback
- Initial generation
- Status indicators
- Group avatars (AvatarGroup)

#### Card
**Description**: Flexible content containers
**Variants**:
- `default` - Standard card
- `elevated` - Elevated shadow
- `outlined` - Strong border
- `ghost` - Minimal styling
- `filled` - Filled background
- `gradient` - Gradient background
- `success` - Success theme
- `warning` - Warning theme
- `destructive` - Error theme
- `premium` - Premium styling
- `enterprise` - Enterprise styling

**Sizes**: `xs`, `sm`, `default`, `lg`, `xl`

**Components**: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction

#### Progress
**Description**: Progress indicator showing completion percentage
**Variants**: Standard, Animated, Segmented
**Features**: Percentage display, Custom colors, Animation support

#### Skeleton
**Description**: Loading placeholder component
**Variants**: Text, Circle, Rectangle, Custom shapes
**Features**: Pulse animation, Multiple sizes, Custom dimensions

#### Alert
**Description**: Important messages and notifications
**Variants**:
- `default` - Standard alert
- `destructive` - Error alert
- `warning` - Warning alert
- `success` - Success alert

**Components**: Alert, AlertTitle, AlertDescription

#### Switch
**Description**: Toggle switch for boolean values
**Sizes**: `sm`, `default`, `lg`
**Features**: Cursor pointer, Disabled state, Custom colors

#### Separator
**Description**: Visual divider between content sections
**Orientations**: Horizontal, Vertical
**Variants**: Solid, Dashed, Dotted

#### Loading Spinner
**Description**: Animated loading indicators
**Variants**: Dots, Spinner, Pulse, Custom
**Sizes**: Multiple size options

#### Accordion
**Description**: Collapsible content sections
**Types**: Single, Multiple
**Features**: Smooth animations, Keyboard navigation, Custom triggers

### 2. Form Controls (13 Components)

#### Form
**Description**: React Hook Form integration with validation
**Components**: Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage
**Features**:
- Zod schema validation
- Error handling
- Field grouping
- Accessibility labels

#### Checkbox
**Description**: Multi-select input component
**States**: Checked, Unchecked, Indeterminate, Disabled
**Features**: Cursor pointer, Custom icons, Label integration

#### Select
**Description**: Dropdown selection component
**Components**: Select, SelectTrigger, SelectContent, SelectItem, SelectValue, SelectGroup
**Features**:
- Search functionality
- Multi-select support
- Custom options
- Cursor pointer styling

#### Textarea
**Description**: Multi-line text input
**Features**: Auto-resize, Character counting, Validation states

#### Label
**Description**: Form field labels
**Features**: Required indicators, Help text, Error states

#### Slider
**Description**: Range input component
**Types**: Single value, Range, Multi-handle
**Features**: Step controls, Custom marks, Orientation support

#### Toggle
**Description**: Toggle button component
**Variants**: `default`, `outline`
**Sizes**: `sm`, `default`, `lg`
**Features**: Cursor pointer, Icon support, Pressed states

#### File Upload
**Description**: File selection and upload component
**Features**: Drag & drop, Multiple files, Progress tracking, File type validation

#### Date Picker
**Description**: Date selection component
**Types**: Single date, Date range, Multiple dates
**Features**: Calendar popup, Keyboard navigation, Custom formatting

#### Multi Select
**Description**: Multiple option selection
**Features**: Search filtering, Tag display, Custom options, Bulk operations

#### Combobox
**Description**: Searchable select component
**Features**: Autocomplete, Custom filtering, Async loading

#### Number Input
**Description**: Numeric input with controls
**Features**: Step buttons, Min/max values, Decimal support, Formatting

#### Theme Switcher
**Description**: Dark/light mode toggle
**Variants**: Button, Dropdown, Automatic
**Features**: System preference detection, Smooth transitions

### 3. Overlays (9 Components)

#### Dialog
**Description**: Modal dialog windows
**Components**: Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
**Variants**: Small, Medium, Large, Full-screen
**Features**: Focus management, Escape key handling, Backdrop click

#### Popover
**Description**: Floating content container
**Components**: Popover, PopoverTrigger, PopoverContent, PopoverAnchor
**Features**: Positioning, Auto-hide, Click outside handling

#### Tooltip
**Description**: Contextual information on hover
**Positions**: Top, Bottom, Left, Right
**Features**: Delay controls, Rich content, Keyboard support

#### Sheet
**Description**: Slide-out panels
**Sides**: Top, Bottom, Left, Right
**Features**: Overlay, Smooth animations, Responsive behavior

#### Drawer
**Description**: Bottom sheet component
**Features**: Drag to dismiss, Snap points, Mobile optimized

#### Dropdown Menu
**Description**: Context menu component
**Components**: DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator
**Features**: Nested menus, Icons, Shortcuts, Keyboard navigation

#### Command Palette
**Description**: Searchable command interface
**Features**: Global search, Keyboard shortcuts, Categories, Recent items

#### Toast
**Description**: Temporary notification messages
**Variants**: Success, Error, Warning, Info
**Features**: Auto-dismiss, Action buttons, Positioning

#### Modal
**Description**: Modal overlay component
**Sizes**: Small, Medium, Large, Extra Large
**Features**: Animation, Focus trap, Backdrop blur

### 4. Data Display (8 Components)

#### Table
**Description**: Data table component
**Components**: Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TableCaption, TableFooter
**Features**: Sorting, Filtering, Pagination, Selection

#### Data Table
**Description**: Advanced data table with features
**Features**: Column sorting, Search, Filters, Export, Row selection

#### Data Table Advanced
**Description**: Enterprise-grade data table
**Features**: Virtual scrolling, Async loading, Complex filters, Bulk operations

#### Stats Card
**Description**: Statistical data display
**Variants**: Simple, Detailed, Chart integration
**Features**: Trend indicators, Percentage changes, Custom metrics

#### Metric Card
**Description**: Key performance indicators
**Features**: Icon support, Color coding, Trend arrows, Comparison data

#### Chart
**Description**: Data visualization component
**Types**: Line, Bar, Area, Pie, Donut
**Features**: Interactive tooltips, Zoom, Animation, Responsive

#### Advanced Chart
**Description**: Complex data visualization
**Features**: Multiple datasets, Custom legends, Export, Real-time updates

#### Comparison Table
**Description**: Side-by-side data comparison
**Features**: Highlighting differences, Column grouping, Mobile responsive

### 5. Navigation (3 Components)

#### Breadcrumb
**Description**: Navigation breadcrumb component
**Styles**: Arrow separators, Slash separators, Custom separators
**Features**: Overflow handling, Mobile responsive, Link integration

#### Pagination
**Description**: Page navigation component
**Features**: Page numbers, Previous/Next buttons, Jump to page, Results count

#### Navigation
**Description**: Primary navigation component
**Types**: Horizontal, Vertical, Mobile hamburger
**Features**: Active states, Icons, Badges, Nested menus

### 6. Feedback (6 Components)

#### Notification
**Description**: System notifications
**Types**: Toast, Banner, Inline
**Variants**: Success, Error, Warning, Info
**Features**: Auto-dismiss, Actions, Rich content

#### Scroll Area
**Description**: Custom styled scrollable container
**Features**: Custom scrollbars, Smooth scrolling, Overflow indicators

#### Loading Button
**Description**: Button with loading state
**Features**: Spinner integration, Text changes, Disabled state

#### Progress Dialog
**Description**: Modal with progress indication
**Features**: Step indicators, Cancel button, Progress bars

#### Import Progress Dialog
**Description**: File import progress tracking
**Features**: File list, Error handling, Retry options

#### Export Progress Dialog
**Description**: Data export progress tracking
**Features**: Format selection, Download links, Progress tracking

### 7. Charts & Metrics (4 Components)

#### Chart
**Description**: Basic chart components
**Types**: Line, Bar, Area, Pie charts
**Features**: Responsive, Interactive, Customizable colors

#### Advanced Chart
**Description**: Complex data visualization
**Features**: Multiple axes, Zoom, Pan, Real-time data

#### Stats Card
**Description**: Metric display cards
**Features**: Trend indicators, Comparisons, Custom icons

#### Metric Card
**Description**: KPI display component
**Features**: Progress rings, Percentage displays, Color coding

### 8. Layout & Structure (4 Components)

#### App Header
**Description**: Application header component
**Features**:
- Navigation menu
- Search functionality
- User profile dropdown
- Notifications
- Theme toggle
- Mobile responsive

#### App Sidebar
**Description**: Collapsible sidebar navigation
**Features**:
- Hierarchical menus
- Quick actions
- Portfolio stats
- Tooltip support
- Mobile overlay

#### Dashboard Layout
**Description**: Complete dashboard layout wrapper
**Features**:
- Header integration
- Sidebar management
- Content areas
- Responsive behavior

#### User Profile
**Description**: User profile management component
**Features**:
- Profile editing
- Avatar upload
- Settings management
- Account statistics

### 9. macOS Style (3 Components)

#### macOS Blocks
**Description**: macOS-styled UI components
**Components**: WindowControls, MacOSWindow, FinderWindow
**Features**: Native look, Smooth animations, Dark mode support

#### Dock
**Description**: macOS-style dock component
**Types**: FloatingDock, MiniDock
**Features**: Magnification, Smooth animations, Auto-hide

#### Wallet Header
**Description**: macOS-styled wallet interface
**Components**: WalletHeader, CompactWalletHeader
**Features**: Native styling, Responsive design

### 10. Crypto & Finance (4 Components)

#### Transaction Card
**Description**: Cryptocurrency transaction display
**Features**:
- Status indicators (pending/confirmed/failed)
- Asset information with logos
- Amount formatting
- Hash copying
- Explorer links

#### Portfolio Summary
**Description**: Portfolio overview component
**Features**:
- Balance display (hideable)
- Performance charts
- Asset allocation
- Trend indicators

#### Asset Price Card
**Description**: Cryptocurrency price display
**Features**:
- Real-time prices
- Charts integration
- Volume and market cap
- Watchlist management

#### TransactionList
**Description**: List of transactions
**Features**:
- Pagination
- Filtering
- Sorting
- Export functionality

### 11. Business & Commerce (2 Components)

#### Pricing Table
**Description**: Subscription pricing display
**Features**:
- Plan comparisons
- Billing toggle (monthly/yearly)
- Feature lists
- Call-to-action buttons

#### Testimonials
**Description**: Customer testimonials component
**Features**:
- Carousel layout
- Rating display
- Avatar integration
- Responsive grid

### 12. Authentication (1 Component)

#### Authentication
**Description**: Complete authentication system components
**Features**:
- Login forms
- Signup forms
- Password reset
- Route protection
- Session management

### 13. Account Management (1 Component)

#### Account Management
**Description**: Account and group management components
**Features**:
- Account grouping
- User management
- Permission handling
- Bulk operations

## 🎨 Component Variants Summary

### Most Variant-Rich Components

1. **Button** (10 variants, 9 sizes)
   - 10 style variants
   - 9 different sizes
   - Loading states
   - Icon positions
   - 50+ total combinations

2. **Card** (10 variants, 5 sizes)
   - 10 theme variants
   - 5 size options
   - Interactive states
   - 50+ combinations

3. **Input** (8 types, 4 states)
   - 8 input types
   - Multiple validation states
   - Icon integration
   - 30+ combinations

4. **Badge** (4 variants + custom)
   - 4 base variants
   - Status badges
   - Notification badges
   - Custom colors
   - 20+ combinations

## 🔧 Usage Examples

### Basic Button Usage
```tsx
import { Button } from '@/components/ui/button'

// Basic button
<Button>Click me</Button>

// Button with variant and size
<Button variant="outline" size="lg">Large Outline</Button>

// Button with icon
<Button>
  <Mail className="mr-2 h-4 w-4" />
  Send Email
</Button>

// Loading button
<Button loading>Saving...</Button>
```

### Form with Validation
```tsx
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="Enter your email" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Submit</Button>
  </form>
</Form>
```

### Data Display
```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Amount</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Transaction 1</TableCell>
      <TableCell>$100.00</TableCell>
      <TableCell>Completed</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## 🎯 Component Browser

Access the interactive component browser at `/demo` to:
- Explore all components with live examples
- Test different variants and states
- Copy code snippets
- View component documentation
- Test responsive behavior

## 🚀 Getting Started

1. **Installation**: Components are already integrated into the MoneyMappr frontend
2. **Import**: Use absolute imports with `@/components/ui/[component-name]`
3. **Styling**: Components inherit Tailwind CSS classes and CSS variables
4. **Customization**: Modify component variants using CVA patterns
5. **Theming**: Supports automatic dark/light mode switching

## 📱 Responsive Design

All components are built with responsive design principles:
- **Mobile First**: Optimized for mobile devices
- **Breakpoint Support**: sm, md, lg, xl, 2xl breakpoints
- **Touch Friendly**: Appropriate touch targets
- **Keyboard Navigation**: Full keyboard accessibility

## ♿ Accessibility Features

- **ARIA Attributes**: Proper labeling and roles
- **Keyboard Navigation**: Tab order and shortcuts
- **Screen Reader Support**: Semantic HTML structure
- **Focus Management**: Visible focus indicators
- **Color Contrast**: WCAG 2.1 AA compliant
- **Motion Preferences**: Respects prefers-reduced-motion

## 🔄 State Management

Components support various states:
- **Interactive States**: Hover, Active, Focus, Disabled
- **Validation States**: Error, Success, Warning
- **Loading States**: Pending, Processing, Complete
- **Data States**: Empty, Loading, Error, Success

## 🎨 Theming System

The component library supports comprehensive theming:
- **CSS Variables**: Dynamic color switching
- **Dark/Light Modes**: Automatic theme detection
- **Custom Themes**: Easy theme customization
- **Component Variants**: Pre-built theme variants

---

*This documentation covers the complete MoneyMappr component library. For interactive examples and live demos, visit the component browser at `/demo`.*