import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const floatingButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-soft hover:bg-primary/90 hover:shadow-focus hover:scale-105",
        add: "bg-gradient-primary text-primary-foreground shadow-soft hover:shadow-focus hover:scale-110 animate-glow",
        timer: "bg-focus text-white shadow-soft hover:bg-focus/90 hover:shadow-focus hover:scale-105",
      },
      size: {
        default: "h-12 w-12",
        lg: "h-14 w-14",
        sm: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface FloatingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof floatingButtonVariants> {
  asChild?: boolean
}

const FloatingButton = React.forwardRef<HTMLButtonElement, FloatingButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(floatingButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
FloatingButton.displayName = "FloatingButton"

export { FloatingButton, floatingButtonVariants }