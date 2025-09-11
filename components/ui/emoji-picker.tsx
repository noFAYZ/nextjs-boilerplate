'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Smile } from 'lucide-react';

interface EmojiPickerProps {
  value?: string;
  onChange?: (emoji: string) => void;
  emojis?: string[];
}

const DEFAULT_EMOJIS = [
  '📁', '💰', '🏦', '💳', '🔗', '⭐', '🎯', '📊',
  '💼', '🏠', '🚗', '🎓', '🛒', '🍕', '✈️', '⚡',
  '🎨', '🎵', '🎮', '📱', '💻', '📚', '🏃', '🌟',
  '❤️', '🔥', '💡', '🚀', '🌈', '🎉', '🏆', '💎',
];

export function EmojiPicker({ value, onChange, emojis = DEFAULT_EMOJIS }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);

  const handleEmojiSelect = (emoji: string) => {
    onChange?.(emoji);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <span className="text-lg mr-2">{value || '📁'}</span>
          <Smile className="h-4 w-4 mr-2" />
          Choose Emoji
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid grid-cols-8 gap-1">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              className="h-8 w-8 flex items-center justify-center rounded hover:bg-muted transition-colors text-lg"
              onClick={() => handleEmojiSelect(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}