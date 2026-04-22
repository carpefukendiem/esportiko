import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-md font-sans text-cta font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-accent focus-visible:ring-offset-2 focus-visible:ring-offset-navy disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-blue-accent text-white hover:bg-blue-light px-6 py-3",
        secondary:
          "border border-slate-500 bg-transparent px-6 py-3 text-white hover:bg-navy-light",
        ghost: "text-blue-accent hover:underline px-2 py-2 bg-transparent",
        /** Primary CTA on light sections (max contrast vs navy). */
        navy: "border border-transparent bg-navy px-6 py-3 text-white hover:bg-navy-mid",
        /** Secondary on light sections. */
        navyOutline:
          "border border-navy/30 bg-transparent px-6 py-3 text-navy hover:bg-navy/5",
      },
      width: {
        auto: "w-auto",
        full: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      width: "auto",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, width, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, width, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
