import { Link } from 'react-router-dom';

interface SectionHeadingProps {
  title: string;
  description?: string;
  /** Optional "see all" style link shown on the right. */
  actionLabel?: string;
  actionTo?: string;
}

/** Consistent section title used on the home page and team pages. */
export function SectionHeading({
  title,
  description,
  actionLabel,
  actionTo,
}: SectionHeadingProps) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
      <div>
        <h2 className="flex items-center gap-2.5 text-xl font-extrabold uppercase tracking-tight text-white sm:text-2xl">
          <span className="h-5 w-1 rounded-full bg-brand" aria-hidden="true" />
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-neutral-400">{description}</p>
        )}
      </div>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="shrink-0 text-sm font-bold text-brand hover:underline"
        >
          {actionLabel} →
        </Link>
      )}
    </div>
  );
}
