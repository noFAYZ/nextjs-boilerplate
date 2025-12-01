'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Search, Filter } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface EnvelopeFiltersProps {
  status?: string;
  onStatusChange: (status: string | undefined) => void;
  envelopeType?: string;
  onEnvelopeTypeChange: (type: string | undefined) => void;
  searchQuery?: string;
  onSearchChange: (query: string) => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PAUSED', label: 'Paused' },
  { value: 'ARCHIVED', label: 'Archived' },
  { value: 'CLOSED', label: 'Closed' },
];

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'SPENDING', label: 'Spending' },
  { value: 'SAVINGS_GOAL', label: 'Savings Goal' },
  { value: 'SINKING_FUND', label: 'Sinking Fund' },
  { value: 'FLEXIBLE', label: 'Flexible' },
];

export function EnvelopeFilters({
  status = '',
  onStatusChange,
  envelopeType = '',
  onEnvelopeTypeChange,
  searchQuery = '',
  onSearchChange,
  hasActiveFilters = false,
  onClearFilters,
}: EnvelopeFiltersProps) {
  return (
    <div className="space-y-3">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        {/* Left: Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search envelopes…"
            className="pl-10"
          />
        </div>

        {/* Right: Filters */}
        <div className="flex flex-wrap items-center gap-2">

          {/* Status */}
          <Select
            value={status}
            onValueChange={(val) => onStatusChange(val || undefined)}
          >
            <SelectTrigger variant='outline2' size='xs'>
              <Filter className="h-4 w-4 mr-1 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value || 'asd'}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Type */}
          <Select
            value={envelopeType}
            onValueChange={(val) => onEnvelopeTypeChange(val || undefined)}
          >
            <SelectTrigger variant='outline2' size='xs'>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {TYPE_OPTIONS.map((t) => (
                <SelectItem key={t.value} value={t.value || 'asd'}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear */}
          {hasActiveFilters && onClearFilters && (
            <Button
              variant="ghost"
              size="xs"
              onClick={onClearFilters}
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Active Filter Pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-1">

          {status && (
            <FilterPill
              label={`Status: ${STATUS_OPTIONS.find((x) => x.value === status)?.label}`}
              onClear={() => onStatusChange(undefined)}
            />
          )}

          {envelopeType && (
            <FilterPill
              label={`Type: ${TYPE_OPTIONS.find((x) => x.value === envelopeType)?.label}`}
              onClear={() => onEnvelopeTypeChange(undefined)}
            />
          )}

          {searchQuery && (
            <FilterPill
              label={`Search: ${searchQuery}`}
              onClear={() => onSearchChange('')}
            />
          )}
        </div>
      )}
    </div>
  );
}

function FilterPill({
  label,
  onClear,
}: {
  label: string;
  onClear: () => void;
}) {
  return (
    <div
      className={cn(
        'bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold',
        'flex items-center gap-2'
      )}
    >
      {label}
      <button onClick={onClear} className="hover:opacity-70">
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
