import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: ReactNode;
}

/** Friendly placeholder for sections that have no data yet. */
export function EmptyState({ title, message, icon }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-surface p-10 text-center">
      {icon && (
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-neutral-500">
          {icon}
        </div>
      )}
      <p className="font-semibold text-neutral-100">{title}</p>
      {message && (
        <p className="mx-auto mt-1 max-w-md text-sm text-neutral-500">{message}</p>
      )}
    </div>
  );
}
