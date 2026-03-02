import * as React from "react"
import { Menu as ArkMenu, Portal } from "@ark-ui/react"
import { ChevronRight } from "lucide-react"
import { cn } from "../../lib/utils"

const DropdownMenu = ({
  open,
  onOpenChange,
  ...props
}: Omit<ArkMenu.RootProps, 'open' | 'onOpenChange'> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void
}) => {
  return (
    <ArkMenu.Root
      open={open}
      onOpenChange={(details) => onOpenChange?.(details.open)}
      {...props}
    />
  )
}
const DropdownMenuSub = ({
  open,
  onOpenChange,
  ...props
}: Omit<ArkMenu.RootProps, 'open' | 'onOpenChange'> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void
}) => {
  return (
    <ArkMenu.Root
      open={open}
      onOpenChange={(details) => onOpenChange?.(details.open)}
      {...props}
    />
  )
}
const DropdownMenuTrigger = ArkMenu.Trigger
const DropdownMenuGroup = ArkMenu.ItemGroup
const DropdownMenuPortal = Portal

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ArkMenu.Positioner>
>(({ className, children, ...props }, ref) => (
  <Portal>
    <ArkMenu.Positioner ref={ref} {...props}>
      <ArkMenu.Content
        className={cn(
          "relative z-50 min-w-[12rem] overflow-hidden rounded-2xl border border-white/20 bg-white/60 backdrop-blur-2xl p-1 text-foreground shadow-2xl transition-all duration-300 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
      >
        {children}
      </ArkMenu.Content>
    </ArkMenu.Positioner>
  </Portal>
))
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  ArkMenu.ItemProps & { className?: string; children?: React.ReactNode }
>(({ className, children, ...props }, ref) => (
  <ArkMenu.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm font-medium outline-none transition-colors hover:bg-primary/10 data-[highlighted]:bg-primary/15 data-[state=checked]:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    {children}
  </ArkMenu.Item>
))
DropdownMenuItem.displayName = "DropdownMenuItem"

const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ArkMenu.ItemGroupLabel>
>(({ className, ...props }, ref) => (
  <ArkMenu.ItemGroupLabel
    ref={ref}
    className={cn("px-3 py-2 text-sm font-bold text-muted-foreground/80", className)}
    {...props}
  />
))
DropdownMenuLabel.displayName = "DropdownMenuLabel"

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ArkMenu.Separator>
>(({ className, ...props }, ref) => (
  <ArkMenu.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-primary/10", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

const DropdownMenuSubTrigger = React.forwardRef<
  HTMLDivElement,
  ArkMenu.TriggerItemProps & { className?: string; children?: React.ReactNode }
>(({ className, children, ...props }, ref) => (
  <ArkMenu.TriggerItem
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-lg px-3 py-2 text-sm font-medium outline-none hover:bg-primary/10 data-[state=open]:bg-primary/15",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
  </ArkMenu.TriggerItem>
))
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger"

const DropdownMenuSubContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ArkMenu.Positioner>
>(({ className, children, ...props }, ref) => (
  <ArkMenu.Positioner ref={ref} {...props}>
    <ArkMenu.Content
      className={cn(
        "z-50 min-w-[10rem] overflow-hidden rounded-2xl border border-white/20 bg-white/60 backdrop-blur-2xl p-1 text-foreground shadow-2xl transition-all duration-300 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        className
      )}
    >
      {children}
    </ArkMenu.Content>
  </ArkMenu.Positioner>
))
DropdownMenuSubContent.displayName = "DropdownMenuSubContent"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
}
