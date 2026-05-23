interface ErrorStateProps {
  message: string;
}

/** Shown when league data could not be loaded at all. */
export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div
      className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center"
      role="alert"
    >
      <p className="font-semibold text-red-300">Something went wrong</p>
      <p className="mt-1 text-sm text-red-400">{message}</p>
    </div>
  );
}
