'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  colors?: string[];
}

const DEFAULT_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  '#64748b', '#78716c', '#dc2626', '#ea580c',
];

export function ColorPicker({ value, onChange, colors = DEFAULT_COLORS }: ColorPickerProps) {
  const [open, setOpen] = useState(false);

  const handleColorSelect = (color: string) => {
    onChange?.(color);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <div
            className="h-4 w-4 rounded border mr-2"
            style={{ backgroundColor: value || '#64748b' }}
          />
          <Palette className="h-4 w-4 mr-2" />
          Choose Color
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid grid-cols-6 gap-2">
          {colors.map((color) => (
            <button
              key={color}
              className="h-8 w-8 rounded border-2 border-white shadow-sm hover:scale-105 transition-transform"
              style={{ backgroundColor: color }}
              onClick={() => handleColorSelect(color)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}