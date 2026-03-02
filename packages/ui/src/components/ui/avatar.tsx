import * as React from "react"
import { Avatar as ArkAvatar } from "@ark-ui/react"
import { cn } from "../../lib/utils"

const Avatar = React.forwardRef<
  HTMLDivElement,
  ArkAvatar.RootProps & { className?: string; children?: React.ReactNode }
>(({ className, children, ...props }, ref) => (
  <ArkAvatar.Root
    ref={ref}
    className={cn(
      "relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-white/20 shadow-xl transition-transform duration-300 hover:scale-105 hover:z-10",
      className
    )}
    {...props}
  >
    {children}
  </ArkAvatar.Root>
))
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  ArkAvatar.ImageProps & { className?: string }
>(({ className, ...props }, ref) => (
  <ArkAvatar.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover grayscale-[20%] transition-all duration-500 hover:grayscale-0", className)}
    {...props}
  />
))
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef<
  HTMLSpanElement,
  ArkAvatar.FallbackProps & { className?: string; children?: React.ReactNode }
>(({ className, children, ...props }, ref) => (
  <ArkAvatar.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-secondary/80 font-bold uppercase text-secondary-foreground backdrop-blur-md",
      className
    )}
    {...props}
  >
    {children}
  </ArkAvatar.Fallback>
))
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }

