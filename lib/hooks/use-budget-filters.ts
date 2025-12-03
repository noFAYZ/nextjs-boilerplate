import { useState, useCallback } from 'react';

export function useBudgetFilters() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'zero'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'allocated' | 'spent'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [visibleColumns, setVisibleColumns] = useState({
    leftover: true,
    assigned: true,
    activity: true,
    available: true,
    actions: true,
  });

  const toggleColumn = useCallback((column: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column as keyof typeof prev],
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilterStatus('all');
    setSortBy('name');
    setSortOrder('asc');
  }, []);

  return {
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    visibleColumns,
    setVisibleColumns,
    toggleColumn,
    resetFilters,
  };
}
