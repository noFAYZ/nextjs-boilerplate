import { useState, useCallback } from 'react';

export function useBudgetPopovers() {
  // Table header controls
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const [sortPopoverOpen, setSortPopoverOpen] = useState(false);
  const [columnPopoverOpen, setColumnPopoverOpen] = useState(false);

  // Group editing
  const [editGroupPopover, setEditGroupPopover] = useState<string | null>(null);
  const [editGroupId, setEditGroupId] = useState<string | null>(null);
  const [editGroupName, setEditGroupName] = useState('');
  const [groupPopoverTrigger, setGroupPopoverTrigger] = useState<HTMLElement | null>(null);

  // Add group
  const [addGroupPopoverOpen, setAddGroupPopoverOpen] = useState(false);
  const [addGroupTrigger, setAddGroupTrigger] = useState<HTMLElement | null>(null);

  // Assign amount
  const [assignPopoverOpen, setAssignPopoverOpen] = useState(false);
  const [assignPopoverTrigger, setAssignPopoverTrigger] = useState<HTMLElement | null>(null);

  // Template
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);

  const closeAllPopovers = useCallback(() => {
    setFilterPopoverOpen(false);
    setSortPopoverOpen(false);
    setColumnPopoverOpen(false);
    setEditGroupPopover(null);
    setAddGroupPopoverOpen(false);
    setAssignPopoverOpen(false);
  }, []);

  return {
    // Table header
    filterPopoverOpen,
    setFilterPopoverOpen,
    sortPopoverOpen,
    setSortPopoverOpen,
    columnPopoverOpen,
    setColumnPopoverOpen,
    // Edit group
    editGroupPopover,
    setEditGroupPopover,
    editGroupId,
    setEditGroupId,
    editGroupName,
    setEditGroupName,
    groupPopoverTrigger,
    setGroupPopoverTrigger,
    // Add group
    addGroupPopoverOpen,
    setAddGroupPopoverOpen,
    addGroupTrigger,
    setAddGroupTrigger,
    // Assign
    assignPopoverOpen,
    setAssignPopoverOpen,
    assignPopoverTrigger,
    setAssignPopoverTrigger,
    // Template
    selectedTemplate,
    setSelectedTemplate,
    isApplyingTemplate,
    setIsApplyingTemplate,
    // Utilities
    closeAllPopovers,
  };
}
