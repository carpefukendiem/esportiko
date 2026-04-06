export function StepIndicator({
  current,
  total,
  labels,
}: {
  current: number;
  total: number;
  labels: string[];
}) {
  return (
    <div className="w-full">
      <div className="mb-2 flex justify-between text-label font-medium uppercase tracking-wider text-gray-soft">
        <span>
          Step {current} of {total}
        </span>
        <span className="hidden text-off-white sm:inline">
          {labels[current - 1]}
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-slate"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Form progress, step ${current} of ${total}`}
      >
        <div
          className="h-full rounded-full bg-blue-accent transition-all duration-300"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
