"use client"

import * as React from "react"
import { useDockContext } from "@/components/providers/dock-provider"
import { ExpandableItem } from "@/components/ui/dock"

export function useNotifications() {
  const { notifications } = useDockContext()

  // Add notification with auto-remove
  const addNotification = React.useCallback((
    item: Omit<ExpandableItem, 'id' | 'timestamp'>,
    autoRemove = true,
    delay = 5000
  ) => {
    const notification: ExpandableItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: 'Just now'
    }

    notifications.addItem(notification)

    // Auto-remove notification after delay
    if (autoRemove) {
      setTimeout(() => {
        notifications.removeItem(notification.id)
      }, delay)
    }

    return notification.id
  }, [notifications])

  // Add success notification
  const addSuccess = React.useCallback((
    title: string, 
    subtitle?: string,
    onClick?: () => void
  ) => {
    return addNotification({
      title,
      subtitle,
      status: 'success',
      onClick
    })
  }, [addNotification])

  // Add error notification
  const addError = React.useCallback((
    title: string,
    subtitle?: string,
    onClick?: () => void
  ) => {
    return addNotification({
      title,
      subtitle,
      status: 'error',
      onClick
    }, false) // Don't auto-remove errors
  }, [addNotification])

  // Add warning notification
  const addWarning = React.useCallback((
    title: string,
    subtitle?: string,
    onClick?: () => void
  ) => {
    return addNotification({
      title,
      subtitle,
      status: 'warning',
      onClick
    })
  }, [addNotification])

  // Add info notification
  const addInfo = React.useCallback((
    title: string,
    subtitle?: string,
    onClick?: () => void
  ) => {
    return addNotification({
      title,
      subtitle,
      status: 'idle',
      onClick
    })
  }, [addNotification])

  return {
    ...notifications,
    addNotification,
    addSuccess,
    addError,
    addWarning,
    addInfo
  }
}