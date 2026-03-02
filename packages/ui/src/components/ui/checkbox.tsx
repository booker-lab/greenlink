import * as React from "react"
import { Checkbox as ArkCheckbox } from "@ark-ui/react"
import { Check } from "lucide-react"
import { cn } from "../../lib/utils"

const Checkbox = React.forwardRef<
  HTMLDivElement,
  ArkCheckbox.RootProps & { className?: string }
>(({ className, children, ...props }, ref) => (
  <ArkCheckbox.Root
    ref={ref}
    className={cn(
      "group relative flex cursor-pointer select-none items-center gap-2",
      className
    )}
    {...props}
  >
    <ArkCheckbox.Control
      className={cn(
        "peer h-5 w-5 shrink-0 rounded-md border-2 border-primary/20 bg-white/50 backdrop-blur-sm shadow-sm ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:shadow-lg active:scale-90",
      )}
    >
      <ArkCheckbox.Indicator>
        <Check className="h-3.5 w-3.5 stroke-[3]" />
      </ArkCheckbox.Indicator>
    </ArkCheckbox.Control>
    {children && <ArkCheckbox.Label>{children}</ArkCheckbox.Label>}
    <ArkCheckbox.HiddenInput />
  </ArkCheckbox.Root>
))
Checkbox.displayName = ArkCheckbox.Root.displayName

export { Checkbox }
