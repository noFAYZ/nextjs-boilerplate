"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X, Bell, CheckCircle, AlertCircle, Info, AlertTriangle, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const notificationVariants = cva(
  "relative flex w-full items-start gap-4 rounded-lg border p-4 transition-all hover:bg-muted/50",
  {
    variants: {
      variant: {
        default: "border-border",
        info: "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20",
        success: "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20",
        warning: "border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20",
        error: "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20",
      },
      size: {
        sm: "p-3 text-sm",
        default: "p-4",
        lg: "p-6 text-base",
      },
      read: {
        true: "opacity-70",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      read: false,
    },
  }
)

export interface Notification {
  id: string
  title: string
  description?: string
  variant?: "default" | "info" | "success" | "warning" | "error"
  read?: boolean
  timestamp?: Date | string
  avatar?: {
    src?: string
    alt?: string
    fallback?: string
  }
  actions?: Array<{
    label: string
    onClick: () => void
    variant?: "default" | "outline" | "ghost"
  }>
  onDismiss?: () => void
  onRead?: () => void
}

interface NotificationItemProps extends VariantProps<typeof notificationVariants> {
  notification: Notification
  showAvatar?: boolean
  showTimestamp?: boolean
  compact?: boolean
  className?: string
}

export function NotificationItem({
  notification,
  variant,
  size,
  read,
  showAvatar = true,
  showTimestamp = true,
  compact = false,
  className,
}: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.variant) {
      case "info":
        return <Info className="size-4 text-blue-500" />
      case "success":
        return <CheckCircle className="size-4 text-emerald-500" />
      case "warning":
        return <AlertTriangle className="size-4 text-amber-500" />
      case "error":
        return <AlertCircle className="size-4 text-red-500" />
      default:
        return <Bell className="size-4 text-muted-foreground" />
    }
  }

  const formatTimestamp = (timestamp: Date | string) => {
    const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div
      className={cn(
        notificationVariants({
          variant: notification.variant || variant,
          size: compact ? "sm" : size,
          read: notification.read || read,
          className,
        })
      )}
    >
      {/* Avatar or Icon */}
      <div className="flex-shrink-0">
        {showAvatar && notification.avatar ? (
          <Avatar className="size-8">
            <AvatarImage src={notification.avatar.src} alt={notification.avatar.alt} />
            <AvatarFallback>{notification.avatar.fallback}</AvatarFallback>
          </Avatar>
        ) : (
          getIcon()
        )}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="text-sm font-medium leading-none">
              {notification.title}
              {!notification.read && (
                <span className="ml-2 inline-block size-2 rounded-full bg-primary" />
              )}
            </p>
            {notification.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {notification.description}
              </p>
            )}
          </div>

          {/* Dismiss button */}
          {notification.onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
              onClick={notification.onDismiss}
            >
              <X className="size-3" />
            </Button>
          )}
        </div>

        {/* Timestamp and actions */}
        <div className="flex items-center justify-between">
          {showTimestamp && notification.timestamp && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3" />
              {formatTimestamp(notification.timestamp)}
            </div>
          )}

          {notification.actions && notification.actions.length > 0 && (
            <div className="flex items-center gap-2">
              {notification.actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || "ghost"}
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Notification List Component
interface NotificationListProps {
  notifications: Notification[]
  showAvatar?: boolean
  showTimestamp?: boolean
  compact?: boolean
  onMarkAllRead?: () => void
  onClearAll?: () => void
  className?: string
}

export function NotificationList({
  notifications,
  showAvatar = true,
  showTimestamp = true,
  compact = false,
  onMarkAllRead,
  onClearAll,
  className,
}: NotificationListProps) {
  const unreadCount = notifications.filter(n => !n.read).length

  if (notifications.length === 0) {
    return (
      <Card className={cn("p-8 text-center", className)}>
        <Bell className="size-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">No notifications yet</p>
      </Card>
    )
  }

  return (
    <div className={cn("space-y-1", className)}>
      {/* Header */}
      {(onMarkAllRead || onClearAll) && (
        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {onMarkAllRead && unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onMarkAllRead}>
                Mark all read
              </Button>
            )}
            {onClearAll && (
              <Button variant="ghost" size="sm" onClick={onClearAll}>
                Clear all
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Notifications */}
      <div className="space-y-1">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            showAvatar={showAvatar}
            showTimestamp={showTimestamp}
            compact={compact}
          />
        ))}
      </div>
    </div>
  )
}

// Notification Center Component
interface NotificationCenterProps {
  notifications: Notification[]
  maxHeight?: string
  className?: string
}

export function NotificationCenter({
  notifications,
  maxHeight = "400px",
  className,
}: NotificationCenterProps) {
  const [filter, setFilter] = React.useState<"all" | "unread">("all")
  
  const filteredNotifications = React.useMemo(() => {
    if (filter === "unread") {
      return notifications.filter(n => !n.read)
    }
    return notifications
  }, [notifications, filter])

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <Badge variant="secondary">
            {notifications.filter(n => !n.read).length} unread
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("unread")}
          >
            Unread
          </Button>
        </div>
      </div>
      
      <div
        className="overflow-y-auto scrollbar-thin"
        style={{ maxHeight }}
      >
        <NotificationList
          notifications={filteredNotifications}
          compact
        />
      </div>
    </Card>
  )
}

export { notificationVariants }