"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download, Trash2, Eye, Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface Attachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  description?: string;
  isPublic: boolean;
}

interface TransactionAttachmentsProps {
  transactionId: string;
  attachments?: Attachment[];
  onUpload: (file: File, description?: string) => Promise<void>;
  onDelete: (attachmentId: string) => Promise<void>;
  onTogglePublic: (attachmentId: string, isPublic: boolean) => Promise<void>;
  onDownload: (attachmentId: string) => Promise<string>;
  isLoading?: boolean;
  className?: string;
  maxSize?: number; // in bytes
  maxFiles?: number;
}

export function TransactionAttachments({
  transactionId,
  attachments = [],
  onUpload,
  onDelete,
  onTogglePublic,
  onDownload,
  isLoading = false,
  className,
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 10,
}: TransactionAttachmentsProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDescription, setUploadDescription] = useState("");
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isTogglingId, setIsTogglingId] = useState<string | null>(null);

  const canUploadMore = attachments.length < maxFiles;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Unknown";
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize) {
      alert(`File size exceeds ${formatFileSize(maxSize)} limit`);
      return;
    }

    setIsUploading(true);
    try {
      await onUpload(file, uploadDescription);
      setUploadDescription("");
    } finally {
      setIsUploading(false);
    }
    // Reset input
    e.target.value = "";
  };

  const handleDelete = async (attachmentId: string) => {
    if (!confirm("Are you sure you want to delete this attachment?")) return;
    setIsDeletingId(attachmentId);
    try {
      await onDelete(attachmentId);
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleTogglePublic = async (
    attachmentId: string,
    currentIsPublic: boolean
  ) => {
    setIsTogglingId(attachmentId);
    try {
      await onTogglePublic(attachmentId, !currentIsPublic);
    } finally {
      setIsTogglingId(null);
    }
  };

  const handleDownload = async (attachmentId: string) => {
    try {
      const url = await onDownload(attachmentId);
      const a = document.createElement("a");
      a.href = url;
      a.click();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Section */}
      {canUploadMore && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isUploading || isLoading}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Add Attachment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Attachment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <input
                  type="file"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PDF, JPG, PNG, DOCX, XLSX up to {formatFileSize(maxSize)}
                  </span>
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description (optional)</label>
                <input
                  type="text"
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Receipt, invoice, etc..."
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  disabled={isUploading}
                />
              </div>

              <Button
                onClick={() => {
                  const input = document.getElementById(
                    "file-upload"
                  ) as HTMLInputElement;
                  input?.click();
                }}
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? "Uploading..." : "Select File"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Attachments List */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : attachments.length > 0 ? (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{attachment.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(attachment.fileSize)} • {formatDate(attachment.uploadedAt)}
                </p>
                {attachment.description && (
                  <p className="text-xs text-foreground mt-1">{attachment.description}</p>
                )}
              </div>

              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDownload(attachment.id)}
                  className="h-8 w-8 p-0"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleTogglePublic(attachment.id, attachment.isPublic)}
                  disabled={isTogglingId === attachment.id}
                  className="h-8 w-8 p-0"
                  title={attachment.isPublic ? "Make private" : "Make public"}
                >
                  {attachment.isPublic ? (
                    <Unlock className="w-4 h-4" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(attachment.id)}
                  disabled={isDeletingId === attachment.id}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          No attachments yet
        </p>
      )}

      {/* Info */}
      <p className="text-xs text-muted-foreground">
        {attachments.length}/{maxFiles} attachments
      </p>
    </div>
  );
}
