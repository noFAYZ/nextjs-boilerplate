import { cn } from "@/lib/utils"

interface SkeletonProps extends React.ComponentProps<"div"> {
  animation?: "shimmer" | "pulse" | "none"
}

function Skeleton({
  className,
  animation = "shimmer",
  ...props
}: SkeletonProps) {
  const animationClass = {
    shimmer: "animate-skeleton-shimmer",
    pulse: "animate-pulse",
    none: "",
  }[animation]

  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-accent rounded-md",
        animationClass,
        className
      )}
      role="status"
      aria-busy="true"
      aria-label="Loading"
      {...props}
    />
  )
}

export { Skeleton }
export type { SkeletonProps }
