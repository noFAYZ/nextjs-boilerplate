# Sidebar V2 - Instagram-style Collapsible Sidebar

A modern, sleek sidebar component inspired by Instagram's web interface. Collapsed by default with smooth hover expansion and transparent background.

## Features

✅ **Collapsed by default** (64px width)
✅ **Transparent background** - blends seamlessly with your page
✅ **Hover to expand** - shows full text on hover
✅ **Smooth CSS transitions** - no third-party animation libraries
✅ **Submenu popovers** - hover over menu items to see submenu options
✅ **7 main menu items** - Dashboard, Accounts, Transactions, Budgets, Goals, Subscriptions, MapprAI
✅ **User dropdown** - Profile, Subscription, Sign Out
✅ **Settings popover** - Additional menu options
✅ **No borders** - Clean, minimal design
✅ **Theme switcher** - When expanded
✅ **Notifications** - Quick access when expanded
✅ **Mobile responsive** - Adapts gracefully to smaller screens

## Directory Structure

```
components/sidebar-v2/
├── sidebar-v2.tsx              # Main sidebar component
├── sidebar-v2-layout.tsx       # Layout wrapper component
├── sidebar-menu-button.tsx     # Individual menu button component
├── sidebar-submenu-popover.tsx # Submenu popover component
├── types.ts                    # TypeScript interfaces
└── index.ts                    # Barrel exports
```

## Usage

### Option 1: Use with the Layout Component (Recommended)

Replace your current layout with `SidebarLayoutV2`:

```typescript
// app/layout.tsx or your root layout
import { SidebarLayoutV2 } from '@/components/sidebar-v2';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SidebarLayoutV2 showHeader={true}>
          {children}
        </SidebarLayoutV2>
      </body>
    </html>
  );
}
```

### Option 2: Use the Sidebar Component Directly

```typescript
import { SidebarV2 } from '@/components/sidebar-v2';

export default function Page() {
  return (
    <div className="flex gap-4">
      <aside className="fixed left-0 top-0 h-full">
        <SidebarV2 defaultExpanded={false} />
      </aside>
      <main className="flex-1 md:ml-16">
        {/* Your content here */}
      </main>
    </div>
  );
}
```

## Menu Items

The sidebar includes 7 pre-configured menu items with submenus:

1. **Dashboard** → Overview, Analytics, Reports
2. **Accounts** → Crypto Wallets, Bank Accounts, Integrations
3. **Transactions** → All Transactions, Pending, By Category
4. **Budgets** → All Budgets, Create Budget
5. **Goals** → All Goals, Create Goal
6. **Subscriptions** → All Subscriptions, Upcoming Charges
7. **MapprAI** → Insights, Recommendations

All menu items and submenus are configured in `sidebar-v2.tsx` in the `MENU_ITEMS_V2` array.

## Customization

### Modify Menu Items

Edit the `MENU_ITEMS_V2` array in `sidebar-v2.tsx`:

```typescript
const MENU_ITEMS_V2: MenuItemV2[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: SolarHomeSmileBoldDuotone,
    href: '/dashboard',
    submenu: [
      {
        id: 'overview',
        label: 'Overview',
        href: '/dashboard',
        icon: SolarHomeSmileBoldDuotone,
        description: 'Main dashboard view',
      },
      // ... more items
    ],
  },
  // ... more menu items
];
```

### Change Default Expanded State

```typescript
<SidebarV2 defaultExpanded={true} /> {/* Start expanded instead of collapsed */}
```

### Customize Colors

All colors use Tailwind CSS classes. Modify the `cn()` classNames in the components:

```typescript
// In sidebar-v2.tsx
<WalletLogoIconOpen className="w-7 h-7 text-orange-500 flex-shrink-0" />
// Change 'orange-500' to your preferred color
```

### Customize Icons

Replace the imported icons with your preferred icon library:

```typescript
import {
  SolarHomeSmileBoldDuotone,
  // Replace with your icons
} from '@/components/icons/icons';
```

## Styling

The sidebar uses **pure CSS transitions** - no Framer Motion or animation libraries:

```typescript
// Smooth width transition when expanding/collapsing
className={cn(
  'transition-all duration-200 ease-out',
  isExpanded ? 'w-64' : 'w-16'
)}

// Smooth color transitions on hover
className={cn(
  'transition-colors duration-150',
  // ... conditions
)}
```

## State Management

The sidebar uses React `useState` for:
- **isExpanded**: Sidebar expansion state
- **hoveredMenuId**: Which menu item is currently hovered (for submenu display)
- **settingsOpen**: Settings dialog state

```typescript
const [isExpanded, setIsExpanded] = useState(defaultExpanded);
const [hoveredMenuId, setHoveredMenuId] = useState<string | null>(null);
const [settingsOpen, setSettingsOpen] = useState(false);
```

## Components Breakdown

### `SidebarV2`

Main sidebar container component. Manages state and renders all sections:
- Logo and branding
- Navigation menu
- Footer with user dropdown, settings, and expand/collapse

**Props:**
- `defaultExpanded?: boolean` - Initial expanded state (default: false)

### `SidebarMenuButton`

Individual menu button with icon and label. Handles hover states and badges.

**Props:**
- `item: MenuItemV2` - Menu item configuration
- `isActive: boolean` - Whether this item is the active/current page
- `isExpanded: boolean` - Whether the menu button text is visible
- `onMouseEnter?: (itemId: string) => void` - Hover handler
- `onMouseLeave?: () => void` - Leave handler
- `onClick?: (itemId: string) => void` - Click handler

### `SidebarSubmenuPopover`

Popover that displays submenu items when you hover over a menu button.

**Props:**
- `item: MenuItemV2` - Menu item with submenu data
- `children: React.ReactNode` - The trigger element
- `isExpanded: boolean` - Whether sidebar is expanded
- `onItemClick?: (itemId: string) => void` - Callback when submenu item is clicked

### `SidebarLayoutV2`

Full layout wrapper that includes sidebar, header, and main content area.

**Props:**
- `children: React.ReactNode` - Page content
- `className?: string` - Additional classes for root div
- `sidebarClassName?: string` - Additional classes for sidebar
- `showHeader?: boolean` - Show the main header (default: true)

## Layout Behavior

### Desktop (≥768px)
- Sidebar: Fixed, scrollable nav, expands on hover
- Content: Scrollable, margin compensates for sidebar width
- Header: Fixed at top of main area

### Mobile (<768px)
- Sidebar hidden, full-width content

## Animations (CSS-only)

All animations use CSS `transition` properties:

```css
/* Expand/collapse width */
transition-all duration-200 ease-out

/* Hover effects */
transition-colors duration-150

/* Submenu popover */
opacity and transform animations (CSS built-in)
```

## Browser Support

- Modern browsers with CSS Grid, Flexbox, and CSS Custom Properties support
- Chrome/Edge 88+
- Firefox 87+
- Safari 14+

## Accessibility

- ✅ Proper semantic HTML (`<nav>`, `<button>`, `<a>`)
- ✅ ARIA labels on tooltips
- ✅ Keyboard navigation support via Radix UI components
- ✅ Focus states on all interactive elements
- ✅ Color contrast compliant

## Performance

- **Zero third-party animation libraries** - Pure CSS transitions
- **Efficient state management** - Single component state
- **Optimized re-renders** - Only affected components re-render
- **CSS-based hover states** - No JavaScript listeners

## Migration from Original Sidebar

Keep the original `components/sidebar/` directory intact. Both sidebars can coexist:

1. Original sidebar: `components/sidebar/` → `SidebarLayout`
2. New sidebar: `components/sidebar-v2/` → `SidebarLayoutV2`

To switch:
```typescript
// From:
import { SidebarLayout } from '@/components/sidebar/core/layout';

// To:
import { SidebarLayoutV2 } from '@/components/sidebar-v2';
```

## Architecture

### Layout (`sidebar-v2-layout.tsx`)
- Fixed sidebar: `position: fixed left-0 top-0 h-screen`
- Main content: `flex-1 md:ml-16 overflow-hidden` (scrollable)
- Minimal structure: One level of nesting, no extra divs

### Sidebar (`sidebar-v2.tsx`)
- Three sections: Logo (flex-shrink-0), Nav (flex-1 scrollable), Footer (flex-shrink-0)
- Context-driven state management (useSidebarV2)
- Memoized selectors for avatar and active menu item
- Smooth CSS transitions (no animation libraries)

### Width Constants
- Collapsed: `w-16` (64px)
- Expanded: `w-64` (256px)

## Future Enhancements

Possible additions without breaking compatibility:

- [ ] Mobile drawer integration (slide-in from left on small screens)
- [ ] Keyboard shortcuts (e.g., `Cmd+B` to toggle)
- [ ] Customizable menu item order (drag-and-drop)
- [ ] Nested submenu support (multi-level navigation)
- [ ] Sidebar search/filter (quick search in menu)
- [ ] Recent items section
- [ ] Collapsible submenu groups
- [ ] Custom theme support per sidebar section

## Types

```typescript
interface MenuItemV2 {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
  submenu?: SubMenuItemV2[];
  badge?: string | number;
}

interface SubMenuItemV2 {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description?: string;
  badge?: string | number;
  status?: 'new' | 'beta' | 'updated';
}
```

## Troubleshooting

### Sidebar not appearing
- Ensure parent div has `position: relative` or `position: fixed`
- Check z-index values if overlapped by other elements
- Verify `SidebarLayoutV2` is wrapping your page content

### Submenu not showing
- Hover over the menu item text, not just the icon
- Check if `item.submenu` array is populated
- Ensure Popover component is imported correctly

### Icons not showing
- Verify icon imports from `@/components/icons/icons`
- Check icon component exists in that directory
- Ensure icon component accepts `className` prop

### Styling issues
- Check Tailwind CSS is properly configured
- Verify `cn()` utility function is imported from `@/lib/utils`
- Ensure theme colors are defined in your Tailwind config

## License

Same as MoneyMappr project
