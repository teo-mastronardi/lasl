import { SearchIcon } from './icons';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

/** Text input with a search icon, used for filtering tables. */
export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  label = 'Search',
}: SearchInputProps) {
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-line bg-surface-2 py-2 pl-10 pr-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-brand focus:ring-2 focus:ring-brand/30 focus:outline-none"
      />
    </label>
  );
}
