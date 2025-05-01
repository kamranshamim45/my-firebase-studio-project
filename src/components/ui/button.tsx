import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as RadixIcons from "@radix-ui/react-icons"; // Import Radix Icons

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_[data-radix-icon]]:pointer-events-none [&_[data-radix-icon]]:size-4 [&_[data-radix-icon]]:shrink-0", // Adjusted selector for Radix Icons
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Add Radix icons to the exports for convenience
export const Icons = RadixIcons;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    // Add data-radix-icon attribute to children if they are Radix Icons
     const childrenWithIconAttr = React.Children.map(props.children, (child) => {
      if (React.isValidElement(child) && typeof child.type !== 'string' && (child.type as any).displayName?.includes('Icon')) {
         // Check if the component looks like a Radix icon (better checks might be needed)
         // This is a heuristic check; it might not be perfectly robust
        return React.cloneElement(child, { 'data-radix-icon': 'true', className: cn(child.props.className) });
      }
      return child;
    });

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {childrenWithIconAttr}
        </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }