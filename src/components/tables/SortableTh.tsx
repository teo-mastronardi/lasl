import type { SortDirection } from '@/hooks/useSortableData';

interface SortableThProps<K extends string> {
  label: string;
  columnKey: K;
  activeKey: K;
  direction: SortDirection;
  onSort: (key: K) => void;
  align?: 'left' | 'right';
  className?: string;
}

/** A table header cell that sorts its column when clicked. */
export function SortableTh<K extends string>({
  label,
  columnKey,
  activeKey,
  direction,
  onSort,
  align = 'right',
  className = '',
}: SortableThProps<K>) {
  const active = activeKey === columnKey;
  return (
    <th
      scope="col"
      aria-sort={active ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'}
      className={`px-2.5 py-2.5 ${align === 'right' ? 'text-right' : 'text-left'} ${className}`}
    >
      <button
        type="button"
        onClick={() => onSort(columnKey)}
        className={`inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide transition-colors ${
          active ? 'text-brand' : 'text-neutral-400 hover:text-white'
        }`}
      >
        <span>{label}</span>
        <span
          aria-hidden="true"
          className={`text-[9px] leading-none ${active ? 'text-brand' : 'text-neutral-600'}`}
        >
          {active ? (direction === 'asc' ? '▲' : '▼') : '▼'}
        </span>
      </button>
    </th>
  );
}
