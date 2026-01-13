'use client';

/**
 * Attachment Upload Modal Component
 *
 * Dialog for uploading files/attachments to a transaction
 * Features:
 * - Drag and drop file upload
 * - File selection via input
 * - File validation (size, count)
 * - File list with remove functionality
 */

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Paperclip, RefreshCw, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AttachmentModalProps } from '@/lib/types';

export function AttachmentModal({ isOpen, transaction, onClose }: AttachmentModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  if (!transaction) return null;

  // ============================================
  // Drag and Drop Handlers
  // ============================================

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  // ============================================
  // File Management
  // ============================================

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => {
      // Max 10MB per file
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    // Max 10 files total
    if (files.length + validFiles.length > 10) {
      alert('Maximum 10 files per transaction');
      return;
    }

    setFiles([...files, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // ============================================
  // Upload Handler
  // ============================================

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      // TODO: Integrate with uploadTransactionAttachment API
      for (const file of files) {
        console.log('Uploading file:', file.name, 'for transaction:', transaction.id);
        // await transactionsApi.uploadTransactionAttachment(transaction.id, file);
      }
      alert('Files uploaded successfully!');
      setFiles([]);
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload files');
    } finally {
      setIsUploading(false);
    }
  };

  // ============================================
  // Render
  // ============================================

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        {/* Header */}
        <DialogHeader>
          <DialogTitle>Add Attachments</DialogTitle>
          <DialogDescription>
            Upload receipts, documents, or other files for transaction: <br />
            <span className="font-medium text-foreground">{transaction.description}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="space-y-4 py-4">
          {/* Drag and Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
            className={cn(
              'relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 bg-muted/20 hover:bg-muted/30'
            )}
          >
            <input
              id="file-input"
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
            />
            <Download className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">Drag and drop files here</p>
            <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
            <p className="text-xs text-muted-foreground mt-2">Max 10MB per file, 10 files total</p>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Selected Files ({files.length})</p>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Paperclip className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm truncate font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={files.length === 0 || isUploading}>
            {isUploading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Upload {files.length > 0 ? `(${files.length})` : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
