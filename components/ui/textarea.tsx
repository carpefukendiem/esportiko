import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-md border bg-navy-light px-3 py-2 font-sans text-body text-off-white placeholder:text-gray-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-accent disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-error" : "border-slate",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
