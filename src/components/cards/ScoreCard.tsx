import type { MatchResult, Team } from '@/types/league';
import { TeamLabel } from '@/components/teams/TeamLabel';
import { CalendarIcon } from '@/components/common/icons';
import { formatShortDate } from '@/utils/format';

interface ScoreCardProps {
  result: MatchResult;
  teams: Team[];
  /** Show the match date (used when cards are not grouped by date). */
  showDate?: boolean;
}

/** A completed match: both teams and the final score. */
export function ScoreCard({ result, teams, showDate = false }: ScoreCardProps) {
  const homeWin = result.homeScore > result.awayScore;
  const awayWin = result.awayScore > result.homeScore;

  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      {showDate && (
        <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400">
          <CalendarIcon className="h-4 w-4" />
          {formatShortDate(result.date)}
        </p>
      )}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="min-w-0">
          <TeamLabel name={result.home} teams={teams} badgeSize="sm" />
        </div>
        <div className="flex items-center gap-2 tabular-nums">
          <span
            className={`text-2xl font-extrabold ${
              homeWin ? 'text-brand' : 'text-neutral-200'
            }`}
          >
            {result.homeScore}
          </span>
          <span className="text-sm font-bold text-neutral-600">–</span>
          <span
            className={`text-2xl font-extrabold ${
              awayWin ? 'text-brand' : 'text-neutral-200'
            }`}
          >
            {result.awayScore}
          </span>
        </div>
        <div className="flex min-w-0 justify-end">
          <TeamLabel name={result.away} teams={teams} badgeSize="sm" reverse />
        </div>
      </div>
    </div>
  );
}
