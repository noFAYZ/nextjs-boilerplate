"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionTagsManagerProps {
  transactionId: string;
  initialTags?: string[];
  onSave: (tags: string[]) => Promise<void>;
  suggestedTags?: string[];
  isLoading?: boolean;
  className?: string;
  maxTags?: number;
}

export function TransactionTagsManager({
  transactionId,
  initialTags = [],
  onSave,
  suggestedTags = [],
  isLoading = false,
  className,
  maxTags = 10,
}: TransactionTagsManagerProps) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddTag = (tag: string) => {
    const normalizedTag = tag.toLowerCase().trim();
    if (normalizedTag && !tags.includes(normalizedTag) && tags.length < maxTags) {
      setTags([...tags, normalizedTag]);
      setInputValue("");
      setShowSuggestions(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim()) {
        handleAddTag(inputValue.trim());
      }
    }
  };

  const handleSave = async () => {
    if (tags !== initialTags) {
      setIsSaving(true);
      try {
        await onSave(tags);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const filteredSuggestions = suggestedTags.filter(
    (tag) => !tags.includes(tag) && tag.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className={cn("space-y-2", className)}>
      {/* Tags Display */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-muted/30 rounded-lg">
          {tags.map((tag) => (
            <div
              key={tag}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground"
            >
              <span>{tag}</span>
              <button
                onClick={() => handleRemoveTag(tag)}
                disabled={isSaving}
                className="inline-flex items-center justify-center w-4 h-4 hover:bg-primary-foreground/20 rounded transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Section */}
      {tags.length < maxTags && (
        <div className="relative">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={handleInputKeyDown}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Add a tag (press Enter)..."
              className="text-sm"
              disabled={isSaving}
            />
            <Button
              size="sm"
              onClick={() => handleAddTag(inputValue.trim())}
              disabled={!inputValue.trim() || isSaving}
              variant="outline"
              className="px-2"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-md z-50 max-h-48 overflow-y-auto">
              {filteredSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleAddTag(suggestion)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Save Button */}
      {tags !== initialTags && (
        <Button
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
          className="w-full"
        >
          {isSaving ? "Saving..." : "Save Tags"}
        </Button>
      )}

      {/* Help Text */}
      <p className="text-xs text-muted-foreground">
        {tags.length}/{maxTags} tags • Press Enter or click + to add
      </p>
    </div>
  );
}
