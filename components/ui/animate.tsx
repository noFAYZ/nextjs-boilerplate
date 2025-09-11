"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const animateVariants = cva("", {
  variants: {
    type: {
      "slide-up": "animate-slide-up",
      "slide-down": "animate-slide-down", 
      "slide-left": "animate-slide-left",
      "slide-right": "animate-slide-right",
      "scale-in": "animate-scale-in",
      "scale-out": "animate-scale-out",
      "fade-in": "animate-fade-in",
      "fade-out": "animate-fade-out",
      "bounce-in": "animate-bounce-in",
      "rubber-band": "animate-rubber-band",
      "wobble": "animate-wobble",
      "heartbeat": "animate-heartbeat",
      "float": "animate-float",
      "glow": "animate-glow",
      "shimmer": "animate-shimmer",
      "pulse": "animate-pulse",
      "spin": "animate-spin",
      "bounce": "animate-bounce",
      "pulse-slow": "pulse-slow",
      "spin-slow": "spin-slow",
      "reveal-up": "animate-reveal-up",
    },
    delay: {
      0: "",
      75: "animation-delay-75",
      100: "animation-delay-100",
      150: "animation-delay-150",
      200: "animation-delay-200",
      300: "animation-delay-300",
      500: "animation-delay-500",
      700: "animation-delay-700",
      1000: "animation-delay-1000",
      1500: "animation-delay-1500",
    },
    duration: {
      75: "animation-duration-75",
      100: "animation-duration-100",
      150: "animation-duration-150",
      200: "animation-duration-200",
      300: "animation-duration-300",
      500: "animation-duration-500",
      700: "animation-duration-700",
      1000: "animation-duration-1000",
    },
    repeat: {
      1: "",
      infinite: "animate-infinite",
    },
  },
  defaultVariants: {
    type: "fade-in",
    delay: 0,
    repeat: 1,
  },
})

interface AnimateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof animateVariants> {
  children: React.ReactNode
  trigger?: boolean
  onComplete?: () => void
  disabled?: boolean
}

export function Animate({
  children,
  type,
  delay,
  duration,
  repeat,
  trigger = true,
  onComplete,
  disabled = false,
  className,
  ...props
}: AnimateProps) {
  const [shouldAnimate, setShouldAnimate] = React.useState(false)

  React.useEffect(() => {
    if (trigger && !disabled) {
      setShouldAnimate(true)
    }
  }, [trigger, disabled])

  const handleAnimationEnd = () => {
    onComplete?.()
    if (repeat === 1) {
      setShouldAnimate(false)
    }
  }

  return (
    <div
      className={cn(
        shouldAnimate && animateVariants({ type, delay, duration, repeat }),
        className
      )}
      onAnimationEnd={handleAnimationEnd}
      {...props}
    >
      {children}
    </div>
  )
}

// Stagger Container for animating lists
interface StaggerProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function Stagger({ children, delay = 100, className }: StaggerProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div
      className={cn(isVisible && "stagger-container", className)}
      style={{
        "--stagger-delay": `${delay}ms`,
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

// Intersection Observer based animation trigger
interface InViewAnimateProps extends AnimateProps {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function InViewAnimate({
  children,
  threshold = 0.1,
  rootMargin = "0px",
  triggerOnce = true,
  ...animateProps
}: InViewAnimateProps) {
  const [isInView, setIsInView] = React.useState(false)
  const [hasTriggered, setHasTriggered] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasTriggered)) {
          setIsInView(true)
          if (triggerOnce) {
            setHasTriggered(true)
          }
        } else if (!triggerOnce) {
          setIsInView(false)
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin, triggerOnce, hasTriggered])

  return (
    <div ref={ref}>
      <Animate {...animateProps} trigger={isInView}>
        {children}
      </Animate>
    </div>
  )
}

// Hover effects
interface HoverProps {
  children: React.ReactNode
  effect?: "lift" | "scale" | "glow"
  className?: string
}

export function Hover({ children, effect = "lift", className }: HoverProps) {
  const effectClass = {
    lift: "hover-lift",
    scale: "hover-scale", 
    glow: "hover-glow",
  }[effect]

  return (
    <div className={cn(effectClass, className)}>
      {children}
    </div>
  )
}

// Click effects
interface ClickProps {
  children: React.ReactNode
  effect?: "shrink" | "rubber-band" | "wobble"
  className?: string
  onClick?: () => void
}

export function Click({ children, effect = "shrink", className, onClick }: ClickProps) {
  const [isClicked, setIsClicked] = React.useState(false)

  const handleClick = () => {
    setIsClicked(true)
    onClick?.()
    setTimeout(() => setIsClicked(false), 1000)
  }

  const getEffectClass = () => {
    if (!isClicked) return ""
    switch (effect) {
      case "shrink": return "click-shrink"
      case "rubber-band": return "animate-rubber-band"
      case "wobble": return "animate-wobble"
      default: return ""
    }
  }

  return (
    <div
      className={cn(getEffectClass(), className)}
      onClick={handleClick}
    >
      {children}
    </div>
  )
}

// Transition wrapper for smooth state changes
interface TransitionProps {
  children: React.ReactNode
  type?: "all" | "color" | "transform"
  className?: string
}

export function Transition({ children, type = "all", className }: TransitionProps) {
  const transitionClass = {
    all: "state-transition",
    color: "color-transition",
    transform: "transform-transition",
  }[type]

  return (
    <div className={cn(transitionClass, className)}>
      {children}
    </div>
  )
}

// Entrance animations for different content types
interface EntranceProps {
  children: React.ReactNode
  type?: "hero" | "card" | "list-item" | "modal" | "notification"
  className?: string
}

export function Entrance({ children, type = "card", className }: EntranceProps) {
  const entranceClass = {
    hero: "entrance-hero",
    card: "entrance-card",
    "list-item": "entrance-list-item",
    modal: "entrance-modal",
    notification: "entrance-notification",
  }[type]

  return (
    <div className={cn(entranceClass, className)}>
      {children}
    </div>
  )
}

// Custom hook for animation controls
export function useAnimation() {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [isPaused, setIsPaused] = React.useState(false)

  const play = React.useCallback(() => {
    setIsPlaying(true)
    setIsPaused(false)
  }, [])

  const pause = React.useCallback(() => {
    setIsPaused(true)
  }, [])

  const stop = React.useCallback(() => {
    setIsPlaying(false)
    setIsPaused(false)
  }, [])

  const reset = React.useCallback(() => {
    setIsPlaying(false)
    setIsPaused(false)
    // Trigger reflow to restart animation
    setTimeout(() => setIsPlaying(true), 10)
  }, [])

  return {
    isPlaying,
    isPaused,
    play,
    pause,
    stop,
    reset,
  }
}

// Sequence animation manager
interface SequenceProps {
  children: React.ReactNode[]
  delay?: number
  className?: string
  onComplete?: () => void
}

export function Sequence({ children, delay = 200, className, onComplete }: SequenceProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    if (currentIndex < children.length - 1) {
      const timer = setTimeout(() => {
        setCurrentIndex(currentIndex + 1)
      }, delay)
      return () => clearTimeout(timer)
    } else if (currentIndex === children.length - 1) {
      onComplete?.()
    }
  }, [currentIndex, children.length, delay, onComplete])

  return (
    <div className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={cn(
            "transition-opacity duration-300",
            index <= currentIndex ? "opacity-100" : "opacity-0"
          )}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

export { animateVariants }