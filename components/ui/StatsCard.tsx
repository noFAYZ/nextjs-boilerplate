import { cn } from "@/lib/utils"
import { Card } from "./card"

interface CompactStatCardProps {
    title: string
    value: string | number | React.ElementType
    icon: React.ElementType
    description?: string
    variant?: "default" | "success" | "warning" | "destructive" | "primary"
    className?: string
  }

 export default function CompactStatCard({
    title,
    value,
    icon: Icon,
    description,
    variant = "default",
    className
  }: CompactStatCardProps) {
    const variantStyles = {
      success: "border-emerald-200/50 dark:border-emerald-800/30",
      warning: "border-amber-200/50 dark:border-amber-800/30",
      destructive: "border-red-200/50 dark:border-red-800/30",
      primary: "border-primary/20",
      default: "border-border/50"
    }
  
    const iconVariantStyles = {
      success: "bg-lime-600/50 dark:bg-lime-600/20 text-lime-800 dark:text-lime-500",
      warning: "bg-amber-600/50 dark:bg-amber-600/20 text-amber-800",
      destructive: "bg-red-500/50 dark:bg-red-600/20 text-red-800",
      primary: "bg-primary/60 dark:bg-primary/20 text-orange-800",
      default: "bg-foreground dark:bg-muted text-white/80"
    }
  
    return (

        <Card className={cn("p-2 bg-muted/60 hover-shadow")}>
          <div className="flex items-center  gap-3">
          <div className={cn("size-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm", iconVariantStyles[variant])}>
              <Icon className="size-6 " />
            </div>
            <div className="w-full">
              
              <p className="text-[10px] uppercase font-semibold text-muted-foreground ">{title}</p>
            {value}  
             
            </div>
            
          </div>
        </Card>
    
    )
  }