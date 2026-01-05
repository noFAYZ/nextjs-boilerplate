'use client';

import { AccountsDataView } from './accounts-data-view';

/**
 * Manage Tab Component
 * Displays the new modern accounts data view with table/card toggle,
 * enhanced filtering, sorting, and bulk operations
 */
export function ManageTab() {
  return (
    <div className="space-y-4 flex flex-col h-full max-w-7xl mx-auto">
      <AccountsDataView />
    </div>
  );
}
