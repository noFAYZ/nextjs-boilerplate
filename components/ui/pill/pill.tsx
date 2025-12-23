import * as React from "react";
import { cn, pillVariants, type PillVariants } from "./styles";
import { PillAvatar, type PillAvatarProps } from "./pill-avatar";
import { PillStatus, type PillStatusProps } from "./pill-status";

export interface PillProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<PillVariants, "variant"> {
  variant?: PillVariants["variant"];
  avatar?: Omit<PillAvatarProps, "size">;
  status?: Omit<PillStatusProps, "size">;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
  asChild?: boolean;
}

const Pill = React.forwardRef<HTMLDivElement, PillProps>(
  (
    {
      className,
      variant,
      size = "md",
      rounded = "full",
      elevation = "flat",
      avatar,
      status,
      leftIcon,
      rightIcon,
      closable,
      onClose,
      children,
      ...props
    },
    ref
  ) => {
    const Component = props.asChild ? React.Fragment : "div";

    const content = (
      <>
        {avatar && <PillAvatar size={size} {...avatar} />}
        {status && <PillStatus size={size} {...status} />}
        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        <span className="truncate">{children}</span>
        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        {closable && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            className="ml-1 -mr-1 flex-shrink-0 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
            aria-label="Close"
          >
            <svg
              className={cn(
                size === "xs" && "h-3 w-3",
                size === "sm" && "h-3.5 w-3.5",
                size === "md" && "h-4 w-4",
                size === "lg" && "h-4.5 w-4.5"
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </>
    );

    const pillClasses = cn(
      pillVariants({ variant, size, rounded, elevation }),
      "max-w-full",
      className
    );

    if (props.asChild) {
      return React.cloneElement(children as React.ReactElement, {
        className: cn((children as React.ReactElement).props.className, pillClasses),
        children: content,
        ref,
      });
    }

    return (
      <Component ref={ref} className={pillClasses} {...props}>
        {content}
      </Component>
    );
  }
);

Pill.displayName = "Pill";

export { Pill, PillAvatar, PillStatus };