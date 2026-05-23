interface LoadingProps {
  label?: string;
}

/** Centered spinner shown while spreadsheet data is loading. */
export function Loading({ label = 'Loading…' }: LoadingProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-20 text-neutral-400"
      role="status"
    >
      <span className="h-9 w-9 animate-spin rounded-full border-4 border-line border-t-brand" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
