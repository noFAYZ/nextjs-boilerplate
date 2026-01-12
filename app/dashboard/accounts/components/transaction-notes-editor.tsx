"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Check, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionNotesEditorProps {
  transactionId: string;
  initialNotes?: string;
  onSave: (notes: string) => Promise<void>;
  isLoading?: boolean;
  className?: string;
  maxLength?: number;
}

export function TransactionNotesEditor({
  transactionId,
  initialNotes = "",
  onSave,
  isLoading = false,
  className,
  maxLength = 2000,
}: TransactionNotesEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(initialNotes);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(notes);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setNotes(initialNotes);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div
        className={cn(
          "flex items-start justify-between gap-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors",
          className
        )}
      >
        <div className="flex-1 min-w-0">
          {notes ? (
            <p className="text-sm text-foreground break-words">{notes}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">No notes added</p>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsEditing(true)}
          disabled={isLoading}
          className="h-6 w-6 p-0 flex-shrink-0"
        >
          <Edit2 className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value.slice(0, maxLength))}
        placeholder="Add notes for this transaction..."
        className="min-h-24 text-sm resize-none"
        disabled={isSaving}
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {notes.length} / {maxLength}
        </span>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
          >
            <X className="w-3 h-3 mr-1" />
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving || notes === initialNotes}
            className="bg-primary"
          >
            <Check className="w-3 h-3 mr-1" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
