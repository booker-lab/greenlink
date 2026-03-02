import * as React from "react"
import { Progress as ArkProgress } from "@ark-ui/react"
import { cn } from "../../lib/utils"

const Progress = React.forwardRef<
  HTMLDivElement,
  ArkProgress.RootProps & { className?: string }
>(({ className, value, ...props }, ref) => (
  <ArkProgress.Root
    ref={ref}
    value={value}
    className={cn(
      "relative h-3 w-full overflow-hidden rounded-full bg-secondary/50 backdrop-blur-sm border border-white/10",
      className
    )}
    {...props}
  >
    <ArkProgress.Track className="h-full w-full">
      <ArkProgress.Range
        className="premium-gradient h-full w-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(16,185,129,0.3)]"
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </ArkProgress.Track>
  </ArkProgress.Root>
))
Progress.displayName = ArkProgress.Root.displayName

export { Progress }
