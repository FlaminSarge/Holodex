import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

// Define variant types
type TooltipVariant =
  | "card"
  | "primary"
  | "secondary"
  | "warning"
  | "destructive"
  | "success"
  | "info"

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  sideOffset = 5,
  variant = "primary", // Add variant prop with default value
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & {
  variant?: TooltipVariant
}) {
  // Define variant classes
  const variantClasses = {
    card: "bg-card text-card-foreground",
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    warning: "bg-warning text-warning-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    success: "bg-green-600 text-white",
    info: "bg-blue-600 text-white",
  }

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance",
          variantClasses[variant], // Apply variant-specific styles
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow
          className={cn(
            variant === "card"
              ? "fill-card"
              : variant === "primary"
                ? "fill-primary"
                : variant === "secondary"
                  ? "fill-secondary"
                  : variant === "warning"
                    ? "fill-warning"
                    : variant === "destructive"
                      ? "fill-destructive"
                      : variant === "success"
                        ? "fill-green-600"
                        : "fill-blue-600"
          )}
        />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  type TooltipVariant, // Export the variant type
}
