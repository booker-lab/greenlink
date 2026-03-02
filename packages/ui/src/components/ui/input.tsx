import * as React from "react"
import { ark } from "@ark-ui/react"
import { cn } from "../../lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <ark.input
                type={type}
                className={cn(
                    "flex h-12 w-full rounded-xl border border-primary/10 bg-white/50 px-4 py-2 text-base shadow-sm ring-offset-background transition-all placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/50 focus-visible:bg-white focus-visible:shadow-lg focus-visible:shadow-primary/5 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }
