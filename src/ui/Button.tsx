import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";
import { ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva(
  "lexiwind-border-0 lexiwind-flex lexiwind-rounded-lg lexiwind-p-2 disabled:lexiwind-cursor-not-allowed lexiwind-cursor-pointer",
  {
    variants: {
      variant: {
        default: "lexiwind-bg-stone-200",
        active:
          "lexiwind-bg-blue-500 lexiwind-text-white lexiwind-shadow-md lexiwind-hover:lexiwind-bg-blue-600",
      },
      size: {
        default: "h-10 px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
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
