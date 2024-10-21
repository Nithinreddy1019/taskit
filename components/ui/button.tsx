import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "text-white bg-gradient-to-r from-cyan-700 to-blue-500 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2",
        destructive:
          "text-white bg-gradient-to-r from-red-600 to-amber-600 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-amber-300 dark:focus:ring-amber-800  rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        muted: "bg-neutral-200 text-neutral-600 hover:bg-neutral-200/80",
        tertiary: "bg-blue-100 text-blue-600 border-transparent focus:ring-2 focus:outline-none focus:ring-blue-200 hover:bg-blue-200/80",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3",
        xs: "h-7 rounded-md px-2 text-xs",
        lg: "h-12 rounded-md px-8",
        icon: "h-8 w-8",
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
