import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary-500 text-white shadow hover:bg-primary-600 active:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400",
        destructive:
          "bg-error text-white shadow-sm hover:bg-error-dark active:bg-error-dark dark:bg-error dark:hover:bg-error-light",
        outline:
          "border-2 border-primary-500 text-primary-600 bg-transparent shadow-sm hover:bg-primary-50 active:bg-primary-100 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-950 dark:active:bg-primary-900",
        secondary:
          "bg-secondary-500 text-white shadow-sm hover:bg-secondary-600 active:bg-secondary-700 dark:bg-secondary-500 dark:hover:bg-secondary-400",
        ghost: 
          "text-primary-600 hover:bg-primary-50 hover:text-primary-700 active:bg-primary-100 dark:text-primary-400 dark:hover:bg-primary-950 dark:hover:text-primary-300",
        link: 
          "text-primary-600 underline-offset-4 hover:underline hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300",
        success:
          "bg-success text-white shadow-sm hover:bg-success-dark active:bg-success-dark dark:bg-success dark:hover:bg-success-light",
        warning:
          "bg-warning text-white shadow-sm hover:bg-warning-dark active:bg-warning-dark dark:bg-warning dark:hover:bg-warning-light",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        xl: "h-14 rounded-lg px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }