'use client';

import React from 'react';
import {
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, ArrowLeft, Zap } from 'lucide-react';

interface StatementUploadProps {
  onSkip: () => void;
  onBack: () => void;
}

export function StatementUpload({ onSkip, onBack }: StatementUploadProps) {
  return (
    <>
      <DialogHeader className="pb-4">
        <div className="flex gap-3 items-start">
          <Button variant="ghost" size="sm" onClick={onBack} className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <DialogTitle className="text-sm">Import Bank Statement (Optional)</DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Upload a statement to help us verify your account details
            </p>
          </div>
        </div>
      </DialogHeader>

      <div className="space-y-6">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center space-y-3 hover:bg-muted/30 transition-colors cursor-pointer group">
          <div className="h-12 w-12 rounded-full flex items-center justify-center bg-muted group-hover:bg-muted/80 transition-colors">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="font-medium text-sm text-foreground">Drag and drop your statement</p>
            <p className="text-xs text-muted-foreground">or click to browse</p>
          </div>
          <p className="text-xs text-muted-foreground">PDF, CSV, or Excel files supported</p>
          <input type="file" className="hidden" accept=".pdf,.csv,.xlsx,.xls" />
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Why upload a statement?
          </h4>
          <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
            <li>✓ Verify account balance and details</li>
            <li>✓ Auto-import recent transactions</li>
            <li>✓ Improve account accuracy</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onSkip}
            className="flex-1"
          >
            Skip for Now
          </Button>
          <Button
            type="button"
            disabled
            className="flex-1"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Statement
          </Button>
        </div>
      </div>
    </>
  );
}
