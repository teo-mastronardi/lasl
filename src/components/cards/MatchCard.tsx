import type { ScheduleMatch, Team } from '@/types/league';
import { TeamLabel } from '@/components/teams/TeamLabel';
import { CalendarIcon, ClockIcon, MapPinIcon } from '@/components/common/icons';
import { formatShortDate } from '@/utils/format';

interface MatchCardProps {
  match: ScheduleMatch;
  teams: Team[];
  /** Hide the date (when the card already sits under a date heading). */
  hideDate?: boolean;
}

/** An upcoming fixture: two teams, kick-off time and field. */
export function MatchCard({ match, teams, hideDate = false }: MatchCardProps) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <div className="flex items-center justify-between gap-2 text-xs font-semibold text-neutral-400">
        <span className="inline-flex items-center gap-1.5">
          {hideDate ? (
            <ClockIcon className="h-4 w-4" />
          ) : (
            <CalendarIcon className="h-4 w-4" />
          )}
          {hideDate ? match.time || 'TBD' : formatShortDate(match.date)}
        </span>
        {!hideDate && match.time && (
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon className="h-4 w-4" />
            {match.time}
          </span>
        )}
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="min-w-0">
          <TeamLabel name={match.home} teams={teams} badgeSize="sm" />
        </div>
        <span className="text-xs font-bold text-neutral-500">vs</span>
        <div className="flex min-w-0 justify-end">
          <TeamLabel name={match.away} teams={teams} badgeSize="sm" reverse />
        </div>
      </div>

      {match.field && (
        <p className="mt-3 flex items-center justify-center gap-1.5 border-t border-line pt-2.5 text-xs text-neutral-500">
          <MapPinIcon className="h-3.5 w-3.5" />
          {match.field}
        </p>
      )}
    </div>
  );
}
