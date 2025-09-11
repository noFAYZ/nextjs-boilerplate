"use client"

import * as React from "react"
import { Star, Quote, Twitter, Linkedin, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Testimonial {
  id: string
  content: string
  author: {
    name: string
    title: string
    company: string
    avatar?: string
    initials?: string
  }
  rating?: number
  source?: "twitter" | "linkedin" | "review" | "interview"
  verified?: boolean
  featured?: boolean
  tags?: string[]
  date?: string
}

interface TestimonialsProps {
  testimonials: Testimonial[]
  layout?: "grid" | "carousel" | "masonry" | "featured"
  columns?: 1 | 2 | 3 | 4
  showRating?: boolean
  showSource?: boolean
  showTags?: boolean
  autoplay?: boolean
  autoplayDelay?: number
  className?: string
  cardVariant?: "default" | "elevated" | "minimal"
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={cn(
          "size-4",
          i < rating 
            ? "fill-yellow-400 text-yellow-400" 
            : "text-muted-foreground/30"
        )}
      />
    ))}
  </div>
)

const SourceIcon = ({ source }: { source: string }) => {
  switch (source) {
    case "twitter":
      return <Twitter className="size-4" />
    case "linkedin":
      return <Linkedin className="size-4" />
    default:
      return <Quote className="size-4" />
  }
}

const TestimonialCard = ({ 
  testimonial, 
  variant = "default",
  showRating = true,
  showSource = true,
  showTags = false,
  className 
}: { 
  testimonial: Testimonial
  variant?: "default" | "elevated" | "minimal"
  showRating?: boolean
  showSource?: boolean
  showTags?: boolean
  className?: string
}) => {
  const cardClass = cn(
    "h-full transition-all duration-300",
    variant === "elevated" && "hover:shadow-lg hover:-translate-y-1",
    variant === "minimal" && "border-0 shadow-none bg-transparent",
    testimonial.featured && "ring-2 ring-primary/20 bg-gradient-to-br from-primary/5 to-transparent",
    className
  )

  return (
    <Card className={cardClass}>
      <CardContent className={cn(
        "p-6 h-full flex flex-col",
        variant === "minimal" && "p-4"
      )}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarImage src={testimonial.author.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {testimonial.author.initials || 
                 testimonial.author.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">{testimonial.author.name}</p>
                {testimonial.verified && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                    ✓ Verified
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {testimonial.author.title} at {testimonial.author.company}
              </p>
            </div>
          </div>
          
          {showSource && testimonial.source && (
            <div className="text-muted-foreground">
              <SourceIcon source={testimonial.source} />
            </div>
          )}
        </div>
        
        {/* Rating */}
        {showRating && testimonial.rating && (
          <div className="mb-3">
            <StarRating rating={testimonial.rating} />
          </div>
        )}
        
        {/* Content */}
        <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground mb-4">
          &ldquo;{testimonial.content}&rdquo;
        </blockquote>
        
        {/* Footer */}
        <div className="flex items-center justify-between">
          {showTags && testimonial.tags && testimonial.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {testimonial.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {testimonial.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{testimonial.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
          
          {testimonial.date && (
            <span className="text-xs text-muted-foreground ml-auto">
              {testimonial.date}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const GridLayout = ({ 
  testimonials, 
  columns, 
  ...props 
}: { testimonials: Testimonial[], columns: number } & Partial<TestimonialsProps>) => (
  <div className={cn(
    "grid gap-6",
    columns === 1 && "grid-cols-1",
    columns === 2 && "grid-cols-1 lg:grid-cols-2",
    columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  )}>
    {testimonials.map((testimonial) => (
      <TestimonialCard key={testimonial.id} testimonial={testimonial} {...props} />
    ))}
  </div>
)

const CarouselLayout = ({ 
  testimonials, 
  autoplay = false, 
  autoplayDelay = 5000,
  ...props 
}: { testimonials: Testimonial[] } & Partial<TestimonialsProps>) => {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(autoplay)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const previous = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  React.useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(next, autoplayDelay)
    return () => clearInterval(interval)
  }, [isPlaying, autoplayDelay, testimonials.length])

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
              <TestimonialCard testimonial={testimonial} {...props} />
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={previous}
          disabled={testimonials.length <= 1}
        >
          <ChevronLeft className="size-4" />
        </Button>
        
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={cn(
                "size-2 rounded-full transition-colors",
                index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
              )}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={next}
          disabled={testimonials.length <= 1}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}

const FeaturedLayout = ({ 
  testimonials, 
  ...props 
}: { testimonials: Testimonial[] } & Partial<TestimonialsProps>) => {
  const featured = testimonials.find(t => t.featured) || testimonials[0]
  const others = testimonials.filter(t => t !== featured).slice(0, 4)

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <TestimonialCard 
          testimonial={featured} 
          variant="elevated"
          className="h-full"
          {...props} 
        />
      </div>
      
      <div className="space-y-4">
        {others.map((testimonial) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            variant="minimal"
            showRating={false}
            showTags={false}
            {...props}
          />
        ))}
      </div>
    </div>
  )
}

export function Testimonials({
  testimonials,
  layout = "grid",
  columns = 3,
  showRating = true,
  showSource = true,
  showTags = false,
  autoplay = false,
  autoplayDelay = 5000,
  className,
  cardVariant = "default",
}: TestimonialsProps) {
  const commonProps = {
    variant: cardVariant,
    showRating,
    showSource,
    showTags,
  }

  return (
    <div className={cn("w-full", className)}>
      {layout === "grid" && (
        <GridLayout 
          testimonials={testimonials} 
          columns={columns} 
          {...commonProps} 
        />
      )}
      
      {layout === "carousel" && (
        <CarouselLayout
          testimonials={testimonials}
          autoplay={autoplay}
          autoplayDelay={autoplayDelay}
          {...commonProps}
        />
      )}
      
      {layout === "featured" && (
        <FeaturedLayout
          testimonials={testimonials}
          {...commonProps}
        />
      )}
    </div>
  )
}

// Sample testimonials data
export const sampleTestimonials: Testimonial[] = [
  {
    id: "1",
    content: "MoneyMappr has completely transformed how I manage my crypto portfolio. The interface is intuitive and the analytics are incredibly detailed. I can finally see exactly where my investments stand across all my wallets.",
    author: {
      name: "Sarah Johnson",
      title: "Portfolio Manager",
      company: "Crypto Ventures",
      initials: "SJ"
    },
    rating: 5,
    source: "review",
    verified: true,
    featured: true,
    tags: ["crypto", "portfolio", "analytics"],
    date: "2 weeks ago"
  },
  {
    id: "2", 
    content: "The real-time sync feature is a game-changer. I no longer have to manually track transactions across multiple exchanges. Everything syncs automatically and the insights help me make better investment decisions.",
    author: {
      name: "Michael Chen",
      title: "DeFi Trader",
      company: "Independent",
      initials: "MC"
    },
    rating: 5,
    source: "twitter",
    verified: true,
    tags: ["defi", "trading", "automation"],
    date: "1 week ago"
  },
  {
    id: "3",
    content: "As a financial advisor, I need tools that help me serve my clients better. MoneyMappr's comprehensive reporting and secure sharing features have made client meetings so much more productive.",
    author: {
      name: "Emily Rodriguez",
      title: "Financial Advisor", 
      company: "WealthTech Solutions",
      initials: "ER"
    },
    rating: 5,
    source: "linkedin",
    verified: true,
    tags: ["advisor", "reporting", "professional"],
    date: "3 days ago"
  },
  {
    id: "4",
    content: "The security features give me peace of mind. With multi-factor authentication and read-only API connections, I can track my investments without compromising my wallet security.",
    author: {
      name: "David Park",
      title: "Security Engineer",
      company: "BlockSec",
      initials: "DP"
    },
    rating: 5,
    source: "review",
    verified: true,
    tags: ["security", "privacy", "enterprise"],
    date: "1 month ago"
  },
  {
    id: "5",
    content: "Perfect for team collaboration. Our investment team can now share insights and track performance together. The permission system ensures everyone sees what they need to see.",
    author: {
      name: "Lisa Thompson",
      title: "Investment Director",
      company: "Digital Assets Fund",
      initials: "LT"
    },
    rating: 4,
    source: "interview",
    verified: true,
    tags: ["team", "collaboration", "fund"],
    date: "2 months ago"
  },
  {
    id: "6",
    content: "The mobile app is fantastic. I can check my portfolio performance on the go and get instant notifications about significant price movements. Exactly what I needed as an active trader.",
    author: {
      name: "James Wilson",
      title: "Day Trader",
      company: "Solo Trading",
      initials: "JW"
    },
    rating: 5,
    source: "review",
    verified: true,
    tags: ["mobile", "trading", "notifications"],
    date: "5 days ago"
  }
]

export type { Testimonial, TestimonialsProps }