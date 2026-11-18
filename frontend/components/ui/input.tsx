import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  startIcon?: React.ReactNode
  endAdornment?: React.ReactNode
  containerClassName?: string
}

const baseInputClasses =
  "flex h-10 w-full rounded-lg border border-input bg-surface-elevated px-3 py-2 text-base text-foreground shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary-600 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, containerClassName, type, startIcon, endAdornment, ...props }, ref) => {
    if (!startIcon && !endAdornment) {
      return (
        <input
          type={type}
          className={cn(baseInputClasses, className)}
          ref={ref}
          {...props}
        />
      )
    }

    return (
      <div className={cn("relative flex items-center w-full", containerClassName)}>
        {startIcon && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 flex items-center text-text-tertiary"
          >
            {startIcon}
          </span>
        )}
        <input
          type={type}
          className={cn(
            baseInputClasses,
            startIcon && "pl-10",
            endAdornment && "pr-10",
            className
          )}
          ref={ref}
          {...props}
        />
        {endAdornment && (
          <div className="absolute right-1.5 flex items-center">
            {endAdornment}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
