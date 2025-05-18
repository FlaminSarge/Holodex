import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition focus-visible:outline-hidden focus-visible:ring-1 active:scale-[97%] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "  hover: focus-visible: active: ",
        "base-outline": "border  bg-transparent hover: hover: focus-visible:",
        outline: "border  bg-transparent hover: hover: focus-visible:",
        primary: "  hover: focus-visible:",
        secondary: "  hover: focus-visible:",
        ghost: "hover: hover: focus-visible: active:",
        "ghost-primary": "hover: hover: focus-visible: active:",
        "ghost-yt": "hover: hover: focus-visible:ring-red-7 active:",
        "ghost-secondary": "hover: hover: focus-visible: active:",
        link: "text-primary underline-offset-4 hover:underline focus-visible:underline focus-visible:",
        destructive:
          "bg-red-9  hover:bg-redA-10 focus-visible:ring-red-7 active:bg-redA-11",
        simple:
          "rounded-full outline-hidden ring-offset-base-2 focus:ring-2 focus: focus:ring-offset-2",
      },
      size: {
        default: "h-8 gap-2 px-3.5 py-2", // also counts as "md"
        sm: "h-6 gap-1.5 rounded-md px-1 text-xs",
        lg: "h-10 gap-3 rounded-md px-6 text-lg ",
        icon: "h-8 w-8",
        "icon-lg": "h-10 w-10 text-lg",
        unset: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export const WATCH_PAGE_DROPDOWN_BUTTON_STYLE =
  "flex w-full justify-start rounded-none px-4 py-2 transition-[padding] active:transform-none active:px-5"
