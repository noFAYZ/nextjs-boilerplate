# Account Groups Components

This directory contains components for managing account groups in the MoneyMappr frontend.

## Components Overview

### 1. `AccountGroupCard.tsx`
A reusable card component that displays an individual account group with:
- Group name, description, and visual styling (icon, color)
- Statistics (number of financial accounts, crypto wallets, subgroups)
- Action menu for editing, deleting, and managing accounts
- Support for selection mode
- Hierarchical display support

### 2. `CreateGroupDialog.tsx`
A dialog component for creating new account groups with:
- Form validation using React Hook Form and Zod
- Preset color and icon selection
- Parent group selection for hierarchical organization
- Live preview of the group appearance
- Integration with the account groups API

### 3. `AccountGroupsList.tsx`
A comprehensive list component that displays all account groups with:
- Multiple view modes (grid, list)
- Search and filtering capabilities
- Sorting options (name, created, updated)
- Bulk selection and actions
- Integration with account groups API hooks
- Empty state handling

## API Integration

### Types (`lib/types/account-groups.ts`)
Complete TypeScript interfaces matching the backend API:
- `AccountGroup` - Main group interface with all properties
- `CreateAccountGroupRequest` - Request payload for creating groups
- `UpdateAccountGroupRequest` - Request payload for updating groups
- `MoveAccountRequest` - Request payload for moving accounts between groups
- `AccountGroupHierarchy` - Extended interface for hierarchical display

### API Client (`lib/api/account-groups.ts`)
Full API integration with the MoneyMappr backend:
- `getAccountGroups()` - Fetch all groups with optional details
- `getAccountGroupsHierarchy()` - Fetch hierarchical structure
- `createAccountGroup()` - Create new group
- `updateAccountGroup()` - Update existing group
- `deleteAccountGroup()` - Delete group (must be empty)
- `createDefaultGroups()` - Create default groups (Primary, Savings, Crypto)
- `moveAccount()` - Move accounts between groups
- `bulkMoveAccounts()` - Move multiple accounts at once

### React Hooks (`lib/hooks/use-account-groups.ts`)
Custom React hooks for state management:
- `useAccountGroups()` - Fetch and manage groups list
- `useAccountGroupsHierarchy()` - Fetch hierarchical structure
- `useAccountGroup()` - Manage single group
- `useAccountGroupMutations()` - Handle create/update/delete operations
- `useGroupedAccounts()` - Organize accounts by groups with statistics
- `useAccountGroupFilters()` - Manage filtering and view preferences

## Usage Examples

### Basic Account Groups List
```tsx
import { AccountGroupsList } from '@/components/accounts/AccountGroupsList';

export function MyAccountsPage() {
  const handleGroupSelect = (group) => {
    // Navigate to group detail or show contents
    console.log('Selected group:', group);
  };

  return (
    <AccountGroupsList
      onGroupSelect={handleGroupSelect}
      showCreateButton={true}
      viewMode="grid"
    />
  );
}
```

### Account Groups with Selection
```tsx
import { useState } from 'react';
import { AccountGroupsList } from '@/components/accounts/AccountGroupsList';

export function ManageGroupsPage() {
  const [selectedGroups, setSelectedGroups] = useState([]);

  const handleBulkDelete = () => {
    // Implement bulk delete logic
    console.log('Deleting groups:', selectedGroups);
  };

  return (
    <div>
      <AccountGroupsList
        allowSelection={true}
        selectedGroups={selectedGroups}
        onSelectionChange={setSelectedGroups}
      />
      {selectedGroups.length > 0 && (
        <button onClick={handleBulkDelete}>
          Delete {selectedGroups.length} groups
        </button>
      )}
    </div>
  );
}
```

### Using Account Groups API Directly
```tsx
import { useAccountGroups, useAccountGroupMutations } from '@/lib/hooks/use-account-groups';

export function GroupManager() {
  const { groups, isLoading, refetch } = useAccountGroups({ details: true });
  const { createGroup, isCreating } = useAccountGroupMutations();

  const handleCreateGroup = async () => {
    const response = await createGroup({
      name: 'Investment Portfolio',
      description: 'Long-term investments and retirement accounts',
      icon: '📈',
      color: '#10B981',
    });

    if (response.success) {
      refetch(); // Refresh the groups list
    }
  };

  return (
    <div>
      {/* Your UI here */}
    </div>
  );
}
```

## Integration with Main Accounts Page

The account groups functionality has been integrated into the main accounts page (`app/dashboard/accounts/page.tsx`) with:

1. **Tabbed Interface**: Switch between "Account Types" and "Account Groups" views
2. **Statistics Dashboard**: Real-time stats showing total groups, accounts, wallets, and value
3. **Modern UI**: Using shadcn/ui components with consistent styling
4. **Responsive Design**: Works on desktop and mobile devices

## Dedicated Groups Management Page

A standalone groups management page is available at `/dashboard/accounts/groups` with:

1. **Multiple View Modes**: Grid, List, and Hierarchy views
2. **Advanced Features**: Bulk selection, filtering, sorting
3. **Comprehensive Stats**: Detailed overview cards
4. **Full CRUD Operations**: Create, edit, delete, and organize groups

## Features Implemented

✅ **Complete API Integration**
- All endpoints from ACCOUNT_GROUPS.md implemented
- Full TypeScript support with proper types
- Error handling and loading states

✅ **Modern React Architecture**
- Custom hooks for state management
- Reusable components with proper prop interfaces
- Integration with existing design system

✅ **User Experience**
- Intuitive drag-and-drop (future enhancement)
- Bulk operations for efficiency
- Search and filtering for large datasets
- Responsive design for all devices

✅ **Data Management**
- Real-time statistics and counts
- Hierarchical organization support
- Account movement between groups
- Default groups creation

## Future Enhancements

1. **Drag & Drop**: Add drag-and-drop functionality for moving accounts
2. **Advanced Filtering**: More sophisticated filtering options
3. **Group Templates**: Pre-defined group templates for common use cases
4. **Analytics**: Usage analytics and insights for groups
5. **Import/Export**: Bulk import/export of group configurations

## File Structure
```
components/accounts/
├── AccountGroupCard.tsx       # Individual group card component
├── AccountGroupsList.tsx      # Main groups list with all features
├── CreateGroupDialog.tsx      # Group creation dialog
└── README.md                  # This documentation

lib/
├── api/account-groups.ts      # API integration functions
├── hooks/use-account-groups.ts # React hooks for state management
└── types/account-groups.ts    # TypeScript type definitions

app/dashboard/accounts/
├── page.tsx                   # Main accounts page with groups integration
└── groups/page.tsx           # Dedicated groups management page
```

This implementation provides a solid foundation for account groups management with room for future enhancements and customization.