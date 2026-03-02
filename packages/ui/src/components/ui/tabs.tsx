import * as React from "react"
import { Tabs as ArkTabs } from "@ark-ui/react"
import { cn } from "../../lib/utils"

const Tabs = ArkTabs.Root

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ArkTabs.List>
>(({ className, ...props }, ref) => (
  <ArkTabs.List
    ref={ref}
    className={cn(
      "inline-flex h-12 items-center justify-center rounded-2xl bg-secondary/50 p-1 text-muted-foreground backdrop-blur-sm border border-white/10 shadow-inner",
      className
    )}
    {...props}
  />
))
TabsList.displayName = ArkTabs.List.displayName

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof ArkTabs.Trigger>
>(({ className, ...props }, ref) => (
  <ArkTabs.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[selected]:bg-white data-[selected]:text-primary data-[selected]:shadow-lg data-[selected]:scale-105 active:scale-95",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = ArkTabs.Trigger.displayName

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ArkTabs.Content>
>(({ className, ...props }, ref) => (
  <ArkTabs.Content
    ref={ref}
    className={cn(
      "mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 animate-in fade-in-50 slide-in-from-bottom-2 duration-300",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = ArkTabs.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
