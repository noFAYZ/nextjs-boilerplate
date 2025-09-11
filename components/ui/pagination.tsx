"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
  showFirstLast?: boolean
  showPrevNext?: boolean
  maxVisiblePages?: number
  className?: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "ghost"
}

const getVisiblePages = (currentPage: number, totalPages: number, maxVisible: number) => {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const sidePages = Math.floor((maxVisible - 1) / 2)
  let startPage = Math.max(currentPage - sidePages, 1)
  let endPage = Math.min(startPage + maxVisible - 1, totalPages)

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(endPage - maxVisible + 1, 1)
  }

  const pages = []
  
  if (startPage > 1) {
    pages.push(1)
    if (startPage > 2) {
      pages.push(-1) // Ellipsis
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push(-1) // Ellipsis
    }
    pages.push(totalPages)
  }

  return pages
}

export function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 7,
  className,
  size = "default",
  variant = "default",
}: PaginationProps) {
  const visiblePages = getVisiblePages(currentPage, totalPages, maxVisiblePages)
  
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  const buttonProps = {
    size: size as "sm" | "default" | "lg",
    variant: variant as "default" | "outline" | "ghost",
  }

  return (
    <nav 
      role="navigation" 
      aria-label="Pagination Navigation"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      {/* First Page */}
      {showFirstLast && currentPage > 2 && (
        <Button
          {...buttonProps}
          variant="outline"
          onClick={() => onPageChange(1)}
          aria-label="Go to first page"
        >
          First
        </Button>
      )}

      {/* Previous Page */}
      {showPrevNext && (
        <Button
          {...buttonProps}
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="size-4" />
          <span className="sr-only">Previous</span>
        </Button>
      )}

      {/* Page Numbers */}
      {visiblePages.map((page, index) => {
        if (page === -1) {
          return (
            <div
              key={`ellipsis-${index}`}
              className="flex size-9 items-center justify-center"
              aria-hidden="true"
            >
              <MoreHorizontal className="size-4" />
            </div>
          )
        }

        const isActive = page === currentPage

        return (
          <Button
            key={page}
            {...buttonProps}
            variant={isActive ? "default" : "outline"}
            onClick={() => onPageChange(page)}
            aria-label={`Go to page ${page}`}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              isActive && "pointer-events-none",
              size === "sm" && "size-8",
              size === "default" && "size-9",
              size === "lg" && "size-10"
            )}
          >
            {page}
          </Button>
        )
      })}

      {/* Next Page */}
      {showPrevNext && (
        <Button
          {...buttonProps}
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          aria-label="Go to next page"
        >
          <ChevronRight className="size-4" />
          <span className="sr-only">Next</span>
        </Button>
      )}

      {/* Last Page */}
      {showFirstLast && currentPage < totalPages - 1 && (
        <Button
          {...buttonProps}
          variant="outline"
          onClick={() => onPageChange(totalPages)}
          aria-label="Go to last page"
        >
          Last
        </Button>
      )}
    </nav>
  )
}

// Simple pagination info component
export function PaginationInfo({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  className,
}: {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  className?: string
}) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className={cn("text-sm text-muted-foreground", className)}>
      Showing {startItem} to {endItem} of {totalItems} results
    </div>
  )
}

// Hook for managing pagination state
export function usePagination({
  initialPage = 1,
  totalItems,
  itemsPerPage,
}: {
  initialPage?: number
  totalItems: number
  itemsPerPage: number
}) {
  const [currentPage, setCurrentPage] = React.useState(initialPage)
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const goToPage = React.useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(validPage)
  }, [totalPages])

  const nextPage = React.useCallback(() => {
    goToPage(currentPage + 1)
  }, [currentPage, goToPage])

  const previousPage = React.useCallback(() => {
    goToPage(currentPage - 1)
  }, [currentPage, goToPage])

  const reset = React.useCallback(() => {
    setCurrentPage(1)
  }, [])

  return {
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    previousPage,
    reset,
    canGoNext: currentPage < totalPages,
    canGoPrevious: currentPage > 1,
  }
}

export type { PaginationProps }