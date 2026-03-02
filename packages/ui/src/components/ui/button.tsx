import * as React from "react"
import { ark } from "@ark-ui/react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:brightness-110 hover:shadow-md",
        premium:
          "premium-gradient text-white shadow-lg border border-white/20 backdrop-blur-sm hover:brightness-110 hover:scale-[1.02]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border-2 border-primary/20 bg-background hover:bg-primary/5 hover:border-primary",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:brightness-105",
        ghost: "hover:bg-primary/10 hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline",
        glass: "glass hover:bg-white/40",
      },
      size: {
        default: "h-11 px-6 py-2 rounded-xl",
        sm: "h-9 px-4 rounded-lg text-xs",
        lg: "h-14 px-10 rounded-2xl text-base",
        icon: "size-11 rounded-full",
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
    // Ark UI's ark.button supports asChild natively
    return (
      <ark.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        asChild={asChild}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
