/* ===========================================================================
 * useSortableData — minimal client-side table sorting.
 *
 * Small enough that TanStack Table is not warranted. Callers supply a stable
 * `getValue` accessor (define it at module scope) so memoisation works.
 * =========================================================================== */

import { useCallback, useMemo, useState } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortState<K extends string> {
  key: K;
  direction: SortDirection;
}

export interface UseSortableData<T, K extends string> {
  /** Rows sorted by the current sort state. */
  sorted: T[];
  /** The active sort key + direction. */
  sort: SortState<K>;
  /** Toggle/select sorting for a column. */
  toggleSort: (key: K) => void;
}

export function useSortableData<T, K extends string>(
  rows: T[],
  getValue: (row: T, key: K) => string | number,
  initial: SortState<K>,
): UseSortableData<T, K> {
  const [sort, setSort] = useState<SortState<K>>(initial);

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      const av = getValue(a, sort.key);
      const bv = getValue(b, sort.key);
      const cmp =
        typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sort.direction === 'asc' ? cmp : -cmp;
    });
  }, [rows, sort, getValue]);

  const toggleSort = useCallback((key: K) => {
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'desc' },
    );
  }, []);

  return { sorted, sort, toggleSort };
}
