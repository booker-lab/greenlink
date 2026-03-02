import * as React from "react"
import { Dialog as ArkDialog, Portal } from "@ark-ui/react"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

const Dialog = ({
  open,
  onOpenChange,
  ...props
}: Omit<ArkDialog.RootProps, 'open' | 'onOpenChange'> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void
}) => {
  return (
    <ArkDialog.Root
      open={open}
      onOpenChange={(details) => onOpenChange?.(details.open)}
      {...props}
    />
  )
}
const DialogTrigger = ArkDialog.Trigger

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ArkDialog.Content>
>(({ className, children, ...props }, ref) => (
  <Portal>
    <ArkDialog.Backdrop
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    />
    <ArkDialog.Positioner className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <ArkDialog.Content
        ref={ref}
        className={cn(
          "relative z-50 grid w-full max-w-lg gap-6 rounded-3xl border border-white/20 bg-white/60 backdrop-blur-2xl p-8 shadow-2xl transition-all duration-300 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-bottom-4 sm:rounded-[2.5rem]",
          className
        )}
        {...props}
      >
        {children}
        <ArkDialog.CloseTrigger className="absolute right-6 top-6 rounded-full p-2 text-foreground/50 transition-all hover:bg-black/5 hover:text-foreground active:scale-90">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </ArkDialog.CloseTrigger>
      </ArkDialog.Content>
    </ArkDialog.Positioner>
  </Portal>
))
DialogContent.displayName = "DialogContent"

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof ArkDialog.Title>
>(({ className, ...props }, ref) => (
  <ArkDialog.Title
    ref={ref}
    className={cn(
      "text-2xl font-bold leading-none tracking-tight text-foreground/90",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof ArkDialog.Description>
>(({ className, ...props }, ref) => (
  <ArkDialog.Description
    ref={ref}
    className={cn("text-base text-muted-foreground font-medium", className)}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

const DialogClose = ArkDialog.CloseTrigger

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
}
