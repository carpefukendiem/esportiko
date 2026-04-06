import { cn } from "@/lib/utils/cn";

export function ProcessStep({
  step,
  title,
  description,
  className,
}: {
  step: number;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-4", className)}>
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-accent font-sans text-sm font-semibold text-white">
        {step}
      </div>
      <div>
        <h4 className="mb-1 font-display text-lg font-semibold text-white">
          {title}
        </h4>
        <p className="text-body-sm text-gray-soft">{description}</p>
      </div>
    </div>
  );
}
