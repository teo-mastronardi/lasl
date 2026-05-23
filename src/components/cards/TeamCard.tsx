import { Link } from 'react-router-dom';
import type { StandingRow, Team } from '@/types/league';
import { TeamBadge } from '@/components/teams/TeamBadge';

interface TeamCardProps {
  team: Team;
  /** Standings row for the team, when available. */
  standing?: StandingRow;
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">
        {label}
      </dt>
      <dd className="text-lg font-extrabold tabular-nums text-white">{value}</dd>
    </div>
  );
}

/** Team summary card used on the Teams listing page. */
export function TeamCard({ team, standing }: TeamCardProps) {
  return (
    <Link
      to={`/team/${team.slug}`}
      className="group block overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-brand"
    >
      <div className="h-2" style={{ backgroundColor: team.primaryColor }} />
      <div className="p-5">
        <div className="flex items-center gap-3">
          <TeamBadge team={team} size="lg" />
          <div className="min-w-0">
            <h3 className="truncate text-lg font-extrabold text-white group-hover:text-brand">
              {team.name}
            </h3>
            {team.captain && (
              <p className="truncate text-xs text-neutral-500">
                Captain: {team.captain}
              </p>
            )}
          </div>
        </div>

        {standing && (
          <dl className="mt-4 grid grid-cols-4 gap-2 border-t border-line pt-4 text-center">
            <MiniStat label="GP" value={standing.gp} />
            <MiniStat label="W" value={standing.w} />
            <MiniStat label="D" value={standing.d} />
            <MiniStat label="L" value={standing.l} />
          </dl>
        )}

        <p className="mt-4 text-sm font-bold text-brand">View team →</p>
      </div>
    </Link>
  );
}
