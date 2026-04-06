import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-md border bg-navy-light px-3 py-2 font-sans text-body text-off-white placeholder:text-gray-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-accent disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-error" : "border-slate",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
