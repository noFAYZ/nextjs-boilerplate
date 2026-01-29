import { useState, useMemo, useCallback } from 'react';

export function useBudgetSelection(filteredEnvelopesLength: number, groupsLength: number) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());

  const allVisibleRowsSelected = useMemo(() => {
    if (filteredEnvelopesLength === 0) return false;
    return selectedRows.size === filteredEnvelopesLength;
  }, [selectedRows.size, filteredEnvelopesLength]);

  const someVisibleRowsSelected = useMemo(() => {
    return selectedRows.size > 0;
  }, [selectedRows.size]);

  const toggleRowSelection = useCallback((rowId: string) => {
    setSelectedRows((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(rowId)) {
        newSelected.delete(rowId);
      } else {
        newSelected.add(rowId);
      }
      return newSelected;
    });
  }, []);

  const toggleGroupSelection = useCallback((groupId: string) => {
    setSelectedGroups((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(groupId)) {
        newSelected.delete(groupId);
      } else {
        newSelected.add(groupId);
      }
      return newSelected;
    });
  }, []);

  const selectAllVisibleRows = useCallback(() => {
    // This will be handled by parent - just provide the action
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedRows(new Set());
    setSelectedGroups(new Set());
  }, []);

  return {
    selectedRows,
    setSelectedRows,
    selectedGroups,
    setSelectedGroups,
    allVisibleRowsSelected,
    someVisibleRowsSelected,
    toggleRowSelection,
    toggleGroupSelection,
    selectAllVisibleRows,
    clearSelection,
  };
}
