export function DecorationBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full border border-blue-muted/50 px-2 py-0.5 font-sans text-xs font-medium text-blue-muted">
      {label}
    </span>
  );
}
