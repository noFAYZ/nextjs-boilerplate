"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Minus,
  Square,
  ChevronLeft,
  ChevronRight,
  Search,
  Grid3x3,
  List,
  Filter,
  MoreHorizontal,
  Folder,
  File,
  Image,
  Music,
  Video,
  Archive,
  Code,
  FileText,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// Window Controls
interface WindowControlsProps {
  onClose?: () => void
  onMinimize?: () => void
  onMaximize?: () => void
  showLabels?: boolean
  variant?: "default" | "minimal"
  className?: string
}

export function WindowControls({
  onClose,
  onMinimize,
  onMaximize,
  showLabels = false,
  variant = "default",
  className,
}: WindowControlsProps) {
  const [hovered, setHovered] = React.useState<string | null>(null)

  const controls = [
    { id: "close", color: "bg-red-500", hoverColor: "hover:bg-red-600", label: "Close", onClick: onClose, icon: X },
    { id: "minimize", color: "bg-yellow-500", hoverColor: "hover:bg-yellow-600", label: "Minimize", onClick: onMinimize, icon: Minus },
    { id: "maximize", color: "bg-green-500", hoverColor: "hover:bg-green-600", label: "Maximize", onClick: onMaximize, icon: Square },
  ]

  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {controls.map((control) => (
          <Button
            key={control.id}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 rounded-full"
            onClick={control.onClick}
          >
            <control.icon className="h-3 w-3" />
          </Button>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {controls.map((control) => (
        <button
          key={control.id}
          className={cn(
            "w-3 h-3 rounded-full transition-all duration-150 flex items-center justify-center",
            control.color,
            control.hoverColor,
            "group"
          )}
          onClick={control.onClick}
          onMouseEnter={() => setHovered(control.id)}
          onMouseLeave={() => setHovered(null)}
        >
          {(hovered === control.id || showLabels) && (
            <control.icon className="w-2 h-2 text-black/60" />
          )}
        </button>
      ))}
    </div>
  )
}

// macOS Window
interface MacOSWindowProps {
  title?: string
  children: React.ReactNode
  onClose?: () => void
  onMinimize?: () => void
  onMaximize?: () => void
  className?: string
  headerClassName?: string
  showControls?: boolean
  blur?: boolean
}

export function MacOSWindow({
  title,
  children,
  onClose,
  onMinimize,
  onMaximize,
  className,
  headerClassName,
  showControls = true,
  blur = true,
}: MacOSWindowProps) {
  return (
    <div
      className={cn(
        "bg-background border rounded-lg shadow-2xl overflow-hidden",
        blur && "backdrop-blur-xl bg-background/95",
        className
      )}
    >
      {/* Window Header */}
      <div
        className={cn(
          "flex items-center justify-between h-12 px-4 border-b bg-muted/30",
          blur && "backdrop-blur-xl",
          headerClassName
        )}
      >
        <div className="flex-1">
          {showControls && (
            <WindowControls
              onClose={onClose}
              onMinimize={onMinimize}
              onMaximize={onMaximize}
            />
          )}
        </div>
        
        {title && (
          <div className="flex-1 text-center">
            <h2 className="text-sm font-medium truncate">{title}</h2>
          </div>
        )}
        
        <div className="flex-1" />
      </div>

      {/* Window Content */}
      <div className="relative">{children}</div>
    </div>
  )
}

// Finder-style Sidebar
interface SidebarItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number | string
  active?: boolean
  onClick?: () => void
}

interface FinderSidebarProps {
  items: SidebarItem[]
  title?: string
  className?: string
}

export function FinderSidebar({ items, title, className }: FinderSidebarProps) {
  return (
    <div className={cn("w-48 bg-muted/20 border-r", className)}>
      {title && (
        <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b">
          {title}
        </div>
      )}
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {items.map((item) => (
            <button
              key={item.id}
              className={cn(
                "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors text-left",
                item.active
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={item.onClick}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <Badge
                  variant={item.active ? "secondary" : "outline"}
                  className="text-xs h-5"
                >
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

// Finder Toolbar
interface FinderToolbarProps {
  onBack?: () => void
  onForward?: () => void
  onViewChange?: (view: "grid" | "list") => void
  currentView?: "grid" | "list"
  searchValue?: string
  onSearchChange?: (value: string) => void
  className?: string
  canGoBack?: boolean
  canGoForward?: boolean
}

export function FinderToolbar({
  onBack,
  onForward,
  onViewChange,
  currentView = "grid",
  searchValue = "",
  onSearchChange,
  className,
  canGoBack = false,
  canGoForward = false,
}: FinderToolbarProps) {
  return (
    <div className={cn("flex items-center gap-2 p-2 border-b bg-muted/20", className)}>
      {/* Navigation */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={onBack}
          disabled={!canGoBack}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={onForward}
          disabled={!canGoForward}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="h-4 w-px bg-border mx-1" />

      {/* View Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant={currentView === "grid" ? "default" : "ghost"}
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => onViewChange?.("grid")}
        >
          <Grid3x3 className="h-3 w-3" />
        </Button>
        <Button
          variant={currentView === "list" ? "default" : "ghost"}
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => onViewChange?.("list")}
        >
          <List className="h-3 w-3" />
        </Button>
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div className="relative w-48">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
        <Input
          placeholder="Search"
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="h-7 pl-7 text-sm"
        />
      </div>

      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
        <Filter className="h-3 w-3" />
      </Button>

      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
        <MoreHorizontal className="h-3 w-3" />
      </Button>
    </div>
  )
}

// File/Folder Item
interface FileItemProps {
  name: string
  type: "folder" | "file" | "image" | "music" | "video" | "archive" | "code" | "document"
  size?: string
  modified?: Date
  selected?: boolean
  view?: "grid" | "list"
  onClick?: () => void
  onDoubleClick?: () => void
  className?: string
}

const getFileIcon = (type: FileItemProps["type"]) => {
  switch (type) {
    case "folder":
      return Folder
    case "image":
      return Image
    case "music":
      return Music
    case "video":
      return Video
    case "archive":
      return Archive
    case "code":
      return Code
    case "document":
      return FileText
    default:
      return File
  }
}

export function FileItem({
  name,
  type,
  size,
  modified,
  selected = false,
  view = "grid",
  onClick,
  onDoubleClick,
  className,
}: FileItemProps) {
  const Icon = getFileIcon(type)
  const [clicks, setClicks] = React.useState(0)

  const handleClick = () => {
    setClicks(prev => prev + 1)
    onClick?.()

    setTimeout(() => {
      if (clicks === 1) {
        onDoubleClick?.()
      }
      setClicks(0)
    }, 300)
  }

  if (view === "list") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 px-2 py-1 rounded hover:bg-accent/50 cursor-pointer text-sm",
          selected && "bg-primary/20",
          className
        )}
        onClick={handleClick}
      >
        <Icon className={cn("h-4 w-4", type === "folder" ? "text-blue-500" : "text-muted-foreground")} />
        <span className="flex-1 truncate">{name}</span>
        <span className="text-xs text-muted-foreground w-16 text-right">{size}</span>
        <span className="text-xs text-muted-foreground w-24 text-right">
          {modified?.toLocaleDateString()}
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 p-2 rounded hover:bg-accent/50 cursor-pointer",
        selected && "bg-primary/20",
        className
      )}
      onClick={handleClick}
    >
      <Icon className={cn("h-8 w-8", type === "folder" ? "text-blue-500" : "text-muted-foreground")} />
      <span className="text-xs text-center truncate w-full" title={name}>
        {name}
      </span>
    </div>
  )
}

// Complete Finder Window
interface FinderWindowProps {
  className?: string
  onClose?: () => void
}

export function FinderWindow({ className, onClose }: FinderWindowProps) {
  const [currentView, setCurrentView] = React.useState<"grid" | "list">("grid")
  const [searchValue, setSearchValue] = React.useState("")
  const [selectedItems, setSelectedItems] = React.useState<string[]>([])

  const sidebarItems: SidebarItem[] = [
    { id: "favorites", label: "Favorites", icon: Folder, badge: 5, active: true },
    { id: "recents", label: "Recents", icon: File, badge: 12 },
    { id: "desktop", label: "Desktop", icon: Folder },
    { id: "documents", label: "Documents", icon: Folder, badge: 245 },
    { id: "downloads", label: "Downloads", icon: Folder, badge: 8 },
  ]

  const files = [
    { name: "Project Files", type: "folder" as const, size: "—", modified: new Date() },
    { name: "Screenshots", type: "folder" as const, size: "—", modified: new Date() },
    { name: "presentation.pdf", type: "document" as const, size: "2.4 MB", modified: new Date() },
    { name: "photo.jpg", type: "image" as const, size: "1.8 MB", modified: new Date() },
    { name: "music.mp3", type: "music" as const, size: "4.2 MB", modified: new Date() },
    { name: "video.mp4", type: "video" as const, size: "25.6 MB", modified: new Date() },
    { name: "archive.zip", type: "archive" as const, size: "12.1 MB", modified: new Date() },
    { name: "script.js", type: "code" as const, size: "8.5 KB", modified: new Date() },
  ]

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchValue.toLowerCase())
  )

  return (
    <MacOSWindow
      title="Finder"
      onClose={onClose}
      className={cn("w-[800px] h-[600px]", className)}
    >
      <div className="flex h-full">
        <FinderSidebar items={sidebarItems} title="Favorites" />
        
        <div className="flex-1 flex flex-col">
          <FinderToolbar
            currentView={currentView}
            onViewChange={setCurrentView}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            canGoBack={true}
            canGoForward={false}
          />
          
          <ScrollArea className="flex-1 p-4">
            {currentView === "grid" ? (
              <div className="grid grid-cols-6 gap-4">
                {filteredFiles.map((file) => (
                  <FileItem
                    key={file.name}
                    {...file}
                    view={currentView}
                    selected={selectedItems.includes(file.name)}
                    onClick={() => {
                      setSelectedItems(prev =>
                        prev.includes(file.name)
                          ? prev.filter(name => name !== file.name)
                          : [...prev, file.name]
                      )
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-muted-foreground border-b">
                  <span className="flex-1">Name</span>
                  <span className="w-16 text-right">Size</span>
                  <span className="w-24 text-right">Modified</span>
                </div>
                {filteredFiles.map((file) => (
                  <FileItem
                    key={file.name}
                    {...file}
                    view={currentView}
                    selected={selectedItems.includes(file.name)}
                    onClick={() => {
                      setSelectedItems(prev =>
                        prev.includes(file.name)
                          ? prev.filter(name => name !== file.name)
                          : [...prev, file.name]
                      )
                    }}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </MacOSWindow>
  )
}