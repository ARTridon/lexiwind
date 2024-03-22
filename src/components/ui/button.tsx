import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "lexiwind-inline-flex lexiwind-items-center lexiwind-justify-center lexiwind-whitespace-nowrap lexiwind-rounded-md lexiwind-text-sm lexiwind-font-medium lexiwind-ring-offset-background lexiwind-transition-colors focus-visible:lexiwind-outline-none focus-visible:lexiwind-ring-2 focus-visible:lexiwind-ring-ring focus-visible:lexiwind-ring-offset-2 disabled:lexiwind-pointer-events-none disabled:lexiwind-opacity-50",
  {
    variants: {
      variant: {
        default:
          "lexiwind-bg-primary lexiwind-text-primary-foreground hover:lexiwind-bg-primary/90",
        destructive:
          "lexiwind-bg-destructive lexiwind-text-destructive-foreground hover:lexiwind-bg-destructive/90",
        outline:
          "lexiwind-border lexiwind-border-input lexiwind-bg-background hover:lexiwind-bg-accent hover:lexiwind-text-accent-foreground",
        secondary:
          "lexiwind-bg-secondary lexiwind-text-secondary-foreground hover:lexiwind-bg-secondary/80",
        ghost: "lexiwind-hover:bg-accent hover:lexiwind-text-accent-foreground",
        link: "lexiwind-text-primary lexiwind-underline-offset-4 hover:lexiwind-underline",
      },
      size: {
        default: "lexiwind-h-10 lexiwind-px-4 lexiwind-py-2",
        sm: "lexiwind-h-9 lexiwind-rounded-md lexiwind-px-3",
        lg: "lexiwind-h-11 lexiwind-rounded-md lexiwind-px-8",
        icon: "lexiwind-h-10 lexiwind-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
