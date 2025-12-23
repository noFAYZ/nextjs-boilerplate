import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export const pillVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
        primary:
          "bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50",
        success:
          "bg-emerald-100 text-emerald-900 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50",
        warning:
          "bg-amber-100 text-amber-900 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50",
        error:
          "bg-red-100 text-red-900 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50",
        outline:
          "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800",
        ghost:
          "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
      },
      size: {
        xs: "px-2 py-0.5 text-xs rounded-full",
        sm: "px-2.5 py-1 text-sm rounded-full",
        md: "px-3 py-1.5 text-sm rounded-full",
        lg: "px-4 py-2 text-base rounded-full",
      },
      rounded: {
        full: "rounded-full",
        lg: "rounded-lg",
        md: "rounded-md",
        sm: "rounded-sm",
      },
      elevation: {
        flat: "shadow-none",
        low: "shadow-sm",
        medium: "shadow",
        high: "shadow-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      rounded: "full",
      elevation: "flat",
    },
  }
);

export type PillVariants = VariantProps<typeof pillVariants>;

export function cn(...inputs: any[]) {
  return twMerge(inputs.filter(Boolean).join(" "));
}