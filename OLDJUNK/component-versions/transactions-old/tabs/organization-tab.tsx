'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { MultiSelect } from '@/components/ui/multi-select';
import type { UnifiedTransaction } from '@/lib/types';

interface OrganizationTabProps {
  transaction: UnifiedTransaction;
  onFieldChange: () => void;
}

export function OrganizationTab({ transaction, onFieldChange }: OrganizationTabProps) {
  const [tags, setTags] = useState<string[]>(transaction.tags || []);
  const [assignedTo, setAssignedTo] = useState(transaction.metadata?.assignedTo || '');
  const [needsReview, setNeedsReview] = useState(transaction.metadata?.markers?.needsReview || false);
  const [reimbursable, setReimbursable] = useState(transaction.metadata?.markers?.reimbursable || false);
  const [taxDeductible, setTaxDeductible] = useState(transaction.metadata?.markers?.taxDeductible || false);
  const [project, setProject] = useState(transaction.metadata?.project || '');

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
    onFieldChange();
  };

  const handleAssignedToChange = (value: string) => {
    setAssignedTo(value);
    onFieldChange();
  };

  const handleMarkerChange = (marker: string, value: boolean) => {
    if (marker === 'review') setNeedsReview(value);
    if (marker === 'reimbursable') setReimbursable(value);
    if (marker === 'tax') setTaxDeductible(value);
    onFieldChange();
  };

  const handleProjectChange = (value: string) => {
    setProject(value);
    onFieldChange();
  };

  return (
    <div className="space-y-4">
      {/* Tags */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Tags</label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div
              key={tag}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
            >
              {tag}
              <button
                onClick={() => handleTagsChange(tags.filter((t) => t !== tag))}
                className="hover:text-primary/70 transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add tag and press Enter..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                const newTag = e.currentTarget.value.trim();
                if (!tags.includes(newTag)) {
                  handleTagsChange([...tags, newTag]);
                  e.currentTarget.value = '';
                }
              }
            }}
            className="flex-1 h-8 text-xs"
          />
        </div>
      </div>

      {/* Person/Assignment */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Assigned To</label>
        <Select value={assignedTo || 'unassigned'} onValueChange={handleAssignedToChange}>
          <SelectTrigger>
            <SelectValue placeholder="Not assigned" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">Not assigned</SelectItem>
            <SelectItem value="self">👤 Self</SelectItem>
            <SelectItem value="partner">👥 Partner</SelectItem>
            <SelectItem value="shared">🤝 Shared</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Markers */}
      <div className="space-y-3 border rounded-lg p-3">
        <p className="text-sm font-semibold text-foreground">Markers</p>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-foreground">Needs Review</label>
            <Switch
              checked={needsReview}
              onCheckedChange={(value) => handleMarkerChange('review', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-foreground">Reimbursable</label>
            <Switch
              checked={reimbursable}
              onCheckedChange={(value) => handleMarkerChange('reimbursable', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-foreground">Tax-Deductible</label>
            <Switch
              checked={taxDeductible}
              onCheckedChange={(value) => handleMarkerChange('tax', value)}
            />
          </div>
        </div>
      </div>

      {/* Project/Client */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Project/Client</label>
        <Input
          value={project}
          onChange={(e) => handleProjectChange(e.target.value)}
          placeholder="Enter project name..."
          className="text-sm"
        />
      </div>
    </div>
  );
}
