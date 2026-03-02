import * as React from "react"
import { Select as ArkSelect, Portal } from "@ark-ui/react"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "../../lib/utils"

const Select = ArkSelect.Root
const SelectValue = ArkSelect.ValueText

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof ArkSelect.Trigger>
>(({ className, children, ...props }, ref) => (
  <ArkSelect.Trigger
    ref={ref}
    className={cn(
      "flex h-12 w-full items-center justify-between rounded-xl border border-primary/10 bg-white/50 px-4 py-2 text-sm shadow-sm ring-offset-background transition-all placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 focus:bg-white focus:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 active:scale-[0.98]",
      className
    )}
    {...props}
  >
    {children}
    <ArkSelect.Indicator>
      <ChevronDown className="h-4 w-4 opacity-50 transition-transform duration-200" />
    </ArkSelect.Indicator>
  </ArkSelect.Trigger>
))
SelectTrigger.displayName = ArkSelect.Trigger.displayName

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ArkSelect.Positioner>
>(({ className, children, ...props }, ref) => (
  <Portal>
    <ArkSelect.Positioner ref={ref} {...props}>
      <ArkSelect.Content
        className={cn(
          "relative z-50 min-w-[8rem] overflow-hidden rounded-2xl border border-white/20 bg-white/60 backdrop-blur-xl p-1 text-foreground shadow-2xl animate-in fade-in-80 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
      >
        <ArkSelect.List>{children}</ArkSelect.List>
      </ArkSelect.Content>
    </ArkSelect.Positioner>
  </Portal>
))
SelectContent.displayName = ArkSelect.Content.displayName

const SelectItem = React.forwardRef<
  HTMLDivElement,
  ArkSelect.ItemProps & { className?: string; children?: React.ReactNode }
>(({ className, children, ...props }, ref) => (
  <ArkSelect.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2 pl-4 pr-10 text-sm font-medium outline-none transition-colors hover:bg-primary/10 data-[highlighted]:bg-primary/15 data-[state=checked]:text-primary data-[selected]:bg-primary/5 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <ArkSelect.ItemText>{children}</ArkSelect.ItemText>
    <ArkSelect.ItemIndicator className="absolute right-3 flex h-3.5 w-3.5 items-center justify-center">
      <Check className="h-4 w-4 text-primary" />
    </ArkSelect.ItemIndicator>
  </ArkSelect.Item>
))
SelectItem.displayName = ArkSelect.Item.displayName

const SelectLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<typeof ArkSelect.Label>
>(({ className, ...props }, ref) => (
  <ArkSelect.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-bold text-muted-foreground/80", className)}
    {...props}
  />
))
SelectLabel.displayName = ArkSelect.Label.displayName

export {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
}
