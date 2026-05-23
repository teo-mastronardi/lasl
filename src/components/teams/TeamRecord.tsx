import type { StandingRow } from '@/types/league';

interface TeamRecordProps {
  standing: StandingRow;
  /** League position, when known. */
  position?: number;
}

const STAT_FIELDS: { key: 'gp' | 'w' | 'd' | 'l' | 'gf' | 'ga' | 'gd' | 'pts'; label: string }[] =
  [
    { key: 'gp', label: 'GP' },
    { key: 'w', label: 'W' },
    { key: 'd', label: 'D' },
    { key: 'l', label: 'L' },
    { key: 'gf', label: 'GF' },
    { key: 'ga', label: 'GA' },
    { key: 'gd', label: 'GD' },
    { key: 'pts', label: 'PTS' },
  ];

/** Standings summary for a single team — position plus the full stat line. */
export function TeamRecord({ standing, position }: TeamRecordProps) {
  return (
    <div>
      {position !== undefined && (
        <p className="mb-3 text-sm text-neutral-400">
          Currently{' '}
          <span className="font-bold text-white">
            {position}
            {ordinalSuffix(position)}
          </span>{' '}
          in the league table.
        </p>
      )}
      <dl className="grid grid-cols-4 gap-2 sm:grid-cols-8">
        {STAT_FIELDS.map((field) => {
          const isPoints = field.key === 'pts';
          return (
            <div
              key={field.key}
              className={`rounded-lg border p-3 text-center ${
                isPoints ? 'border-brand bg-brand' : 'border-line bg-surface'
              }`}
            >
              <dt
                className={`text-[10px] font-bold uppercase tracking-wide ${
                  isPoints ? 'text-white/80' : 'text-neutral-500'
                }`}
              >
                {field.label}
              </dt>
              <dd className="mt-0.5 text-xl font-extrabold tabular-nums text-white">
                {standing[field.key]}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

function ordinalSuffix(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return 'th';
  switch (n % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}
