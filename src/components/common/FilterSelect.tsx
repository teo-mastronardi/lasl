import { ChevronDownIcon } from './icons';

export interface SelectOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  /** Hide the visible label and use it only for screen readers. */
  hideLabel?: boolean;
}

/** Labelled dropdown used for team / date filters. */
export function FilterSelect({
  label,
  value,
  onChange,
  options,
  hideLabel,
}: FilterSelectProps) {
  return (
    <label className="block">
      <span
        className={
          hideLabel
            ? 'sr-only'
            : 'mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500'
        }
      >
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-line bg-surface-2 py-2 pl-3 pr-9 text-sm font-medium text-neutral-100 focus:border-brand focus:ring-2 focus:ring-brand/30 focus:outline-none"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
      </div>
    </label>
  );
}
