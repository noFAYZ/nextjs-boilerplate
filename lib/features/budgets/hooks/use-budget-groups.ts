import { useState, useCallback, useMemo } from 'react';

export function useBudgetGroups(groupsLength: number) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const allGroupsExpanded = useMemo(() => {
    return groupsLength > 0 && expandedGroups.size === groupsLength;
  }, [expandedGroups.size, groupsLength]);

  const toggleGroup = useCallback((groupId: string) => {
    setExpandedGroups((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(groupId)) {
        newExpanded.delete(groupId);
      } else {
        newExpanded.add(groupId);
      }
      return newExpanded;
    });
  }, []);

  const toggleExpandAll = useCallback((groupIds: string[]) => {
    if (allGroupsExpanded) {
      setExpandedGroups(new Set());
    } else {
      setExpandedGroups(new Set(groupIds));
    }
  }, [allGroupsExpanded]);

  return {
    expandedGroups,
    setExpandedGroups,
    allGroupsExpanded,
    toggleGroup,
    toggleExpandAll,
  };
}
