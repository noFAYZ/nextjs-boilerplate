"use client"

import * as React from "react"
import { Upload, X, File, Image, FileText, Archive, Video, Music, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface FileWithPreview extends File {
  preview?: string
}

interface FileUploadProps {
  maxFiles?: number
  maxSize?: number // in bytes
  accept?: string
  disabled?: boolean
  onFilesChange?: (files: FileWithPreview[]) => void
  onUpload?: (files: FileWithPreview[]) => Promise<void>
  className?: string
  variant?: "default" | "dropzone" | "button"
  showPreview?: boolean
  multiple?: boolean
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return <Image className="size-4" />
  if (type.startsWith("video/")) return <Video className="size-4" />
  if (type.startsWith("audio/")) return <Music className="size-4" />
  if (type === "application/pdf" || type.includes("text")) return <FileText className="size-4" />
  if (type.includes("zip") || type.includes("rar") || type.includes("tar")) return <Archive className="size-4" />
  return <File className="size-4" />
}

function FilePreview({ 
  file, 
  onRemove, 
  uploading = false 
}: { 
  file: FileWithPreview
  onRemove: () => void
  uploading?: boolean 
}) {
  const [uploadProgress, setUploadProgress] = React.useState(0)

  React.useEffect(() => {
    if (uploading) {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + Math.random() * 10
        })
      }, 100)
      return () => clearInterval(interval)
    }
  }, [uploading])

  return (
    <div className="relative flex items-center gap-3 p-3 border rounded-lg bg-background">
      {file.preview && file.type.startsWith("image/") ? (
        <img
          src={file.preview}
          alt={`Preview of ${file.name}`}
          className="size-10 rounded object-cover"
        />
      ) : (
        <div className="size-10 rounded bg-muted flex items-center justify-center">
          {getFileIcon(file.type)}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(file.size)}
        </p>
        {uploading && (
          <div className="mt-2">
            <Progress value={uploadProgress} className="h-1" />
            <p className="text-xs text-muted-foreground mt-1">
              {uploadProgress < 100 ? `Uploading... ${Math.round(uploadProgress)}%` : "Complete"}
            </p>
          </div>
        )}
      </div>
      
      {!uploading && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-6 p-0"
          onClick={onRemove}
        >
          <X className="size-3" />
        </Button>
      )}
    </div>
  )
}

export function FileUpload({
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept = "*/*",
  disabled = false,
  onFilesChange,
  onUpload,
  className,
  variant = "dropzone",
  showPreview = true,
  multiple = true,
}: FileUploadProps) {
  const [files, setFiles] = React.useState<FileWithPreview[]>([])
  const [isDragActive, setIsDragActive] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const [errors, setErrors] = React.useState<string[]>([])
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File ${file.name} is too large. Maximum size is ${formatFileSize(maxSize)}.`
    }
    return null
  }

  const handleFiles = React.useCallback((newFiles: File[]) => {
    const validFiles: FileWithPreview[] = []
    const newErrors: string[] = []

    for (const file of newFiles) {
      if (files.length + validFiles.length >= maxFiles) {
        newErrors.push(`Maximum ${maxFiles} files allowed.`)
        break
      }

      const error = validateFile(file)
      if (error) {
        newErrors.push(error)
        continue
      }

      const fileWithPreview = file as FileWithPreview
      if (file.type.startsWith("image/")) {
        fileWithPreview.preview = URL.createObjectURL(file)
      }

      validFiles.push(fileWithPreview)
    }

    const updatedFiles = [...files, ...validFiles]
    setFiles(updatedFiles)
    setErrors(newErrors)
    onFilesChange?.(updatedFiles)
  }, [files, maxFiles, maxSize, onFilesChange])

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    if (files[index].preview) {
      URL.revokeObjectURL(files[index].preview!)
    }
    setFiles(updatedFiles)
    onFilesChange?.(updatedFiles)
  }

  const handleDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(false)

    if (disabled) return

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [handleFiles, disabled])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleUpload = async () => {
    if (!onUpload || files.length === 0) return

    setUploading(true)
    try {
      await onUpload(files)
      setFiles([])
      setErrors([])
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Upload failed"])
    } finally {
      setUploading(false)
    }
  }

  // Clean up preview URLs on unmount
  React.useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
  }, [files])

  if (variant === "button") {
    return (
      <div className={cn("space-y-4", className)}>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          <Upload className="size-4 mr-2" />
          Choose Files
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        {showPreview && files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, index) => (
              <FilePreview
                key={`${file.name}-${index}`}
                file={file}
                onRemove={() => removeFile(index)}
                uploading={uploading}
              />
            ))}
          </div>
        )}

        {errors.length > 0 && (
          <div className="space-y-1">
            {errors.map((error, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="size-4" />
                {error}
              </div>
            ))}
          </div>
        )}

        {onUpload && files.length > 0 && !uploading && (
          <Button onClick={handleUpload} className="w-full">
            Upload {files.length} file{files.length !== 1 ? 's' : ''}
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Dropzone */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragActive 
            ? "border-primary bg-primary/5" 
            : "border-border hover:border-primary/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setIsDragActive(true)
        }}
        onDragLeave={() => setIsDragActive(false)}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <Upload className="size-8 mx-auto mb-4 text-muted-foreground" />
        <div className="space-y-2">
          <p className="text-sm font-medium">
            {isDragActive ? "Drop files here" : "Drag & drop files here"}
          </p>
          <p className="text-xs text-muted-foreground">
            or click to browse • Max {maxFiles} files • Up to {formatFileSize(maxSize)} each
          </p>
          {accept !== "*/*" && (
            <Badge variant="secondary" className="text-xs">
              Accepted: {accept}
            </Badge>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* File Previews */}
      {showPreview && files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Selected Files ({files.length})</h4>
          {files.map((file, index) => (
            <FilePreview
              key={`${file.name}-${index}`}
              file={file}
              onRemove={() => removeFile(index)}
              uploading={uploading}
            />
          ))}
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="size-4" />
              {error}
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {onUpload && files.length > 0 && !uploading && (
        <Button onClick={handleUpload} className="w-full">
          <Upload className="size-4 mr-2" />
          Upload {files.length} file{files.length !== 1 ? 's' : ''}
        </Button>
      )}
    </div>
  )
}

export type { FileWithPreview, FileUploadProps }