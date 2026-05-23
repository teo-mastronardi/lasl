import { useMemo, useState } from 'react';
import type { StandingRow, Team } from '@/types/league';
import type { SortDirection } from '@/hooks/useSortableData';
import { TeamLabel } from '@/components/teams/TeamLabel';
import { SortableTh } from './SortableTh';

type NumericKey = 'gp' | 'w' | 'd' | 'l' | 'gf' | 'ga' | 'gd' | 'pts';
type SortKey = NumericKey | 'team';

interface StandingsTableProps {
  rows: StandingRow[];
  teams: Team[];
}

/** Sorts rows by a column; numeric columns fall back to the standard order. */
function sortRows(
  rows: StandingRow[],
  key: SortKey,
  direction: SortDirection,
): StandingRow[] {
  const sorted = [...rows];
  if (key === 'team') {
    sorted.sort((a, b) => a.team.localeCompare(b.team));
    return direction === 'asc' ? sorted : sorted.reverse();
  }
  sorted.sort(
    (a, b) =>
      b[key] - a[key] ||
      b.pts - a.pts ||
      b.gd - a.gd ||
      b.gf - a.gf ||
      a.team.localeCompare(b.team),
  );
  return direction === 'desc' ? sorted : sorted.reverse();
}

const numTd = 'px-2.5 py-3 text-right tabular-nums text-neutral-300';

/** Responsive, sortable league standings table. Defaults to the standard order. */
export function StandingsTable({ rows, teams }: StandingsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('pts');
  const [direction, setDirection] = useState<SortDirection>('desc');

  const sorted = useMemo(
    () => sortRows(rows, sortKey, direction),
    [rows, sortKey, direction],
  );

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setDirection(key === 'team' ? 'asc' : 'desc');
    }
  }

  const headerProps = {
    activeKey: sortKey,
    direction,
    onSort: handleSort,
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-surface">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="border-b border-line bg-surface-2">
          <tr>
            <th
              scope="col"
              className="px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-neutral-400"
            >
              #
            </th>
            <SortableTh label="Team" columnKey="team" align="left" {...headerProps} />
            <SortableTh label="GP" columnKey="gp" {...headerProps} />
            <SortableTh label="W" columnKey="w" {...headerProps} />
            <SortableTh label="D" columnKey="d" {...headerProps} />
            <SortableTh label="L" columnKey="l" {...headerProps} />
            <SortableTh
              label="GF"
              columnKey="gf"
              className="hidden sm:table-cell"
              {...headerProps}
            />
            <SortableTh
              label="GA"
              columnKey="ga"
              className="hidden sm:table-cell"
              {...headerProps}
            />
            <SortableTh label="GD" columnKey="gd" {...headerProps} />
            <SortableTh label="PTS" columnKey="pts" {...headerProps} />
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, index) => (
            <tr
              key={row.team}
              className="border-b border-line last:border-0 hover:bg-white/[0.03]"
            >
              <td className="px-3 py-3 font-semibold tabular-nums text-neutral-500">
                {index + 1}
              </td>
              <td className="px-2.5 py-3">
                <TeamLabel name={row.team} teams={teams} badgeSize="sm" />
              </td>
              <td className={numTd}>{row.gp}</td>
              <td className={numTd}>{row.w}</td>
              <td className={numTd}>{row.d}</td>
              <td className={numTd}>{row.l}</td>
              <td className={`${numTd} hidden sm:table-cell`}>{row.gf}</td>
              <td className={`${numTd} hidden sm:table-cell`}>{row.ga}</td>
              <td className="px-2.5 py-3 text-right tabular-nums">
                <span
                  className={
                    row.gd > 0
                      ? 'text-emerald-400'
                      : row.gd < 0
                        ? 'text-red-400'
                        : 'text-neutral-500'
                  }
                >
                  {row.gd > 0 ? `+${row.gd}` : row.gd}
                </span>
              </td>
              <td className="px-2.5 py-3 text-right">
                <span className="font-extrabold tabular-nums text-brand">
                  {row.pts}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
