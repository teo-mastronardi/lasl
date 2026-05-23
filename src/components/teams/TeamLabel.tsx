import { Link } from 'react-router-dom';
import type { Team } from '@/types/league';
import { findTeam } from '@/utils/league';
import { TeamBadge, type BadgeSize } from './TeamBadge';

interface TeamLabelProps {
  /** Team name as it appears in the spreadsheet (home/away/scorer team etc.). */
  name: string;
  /** Full team list, used to resolve the name to a Team for colour + linking. */
  teams: Team[];
  badgeSize?: BadgeSize;
  /** Link to the team page when the team is recognised. Default true. */
  link?: boolean;
  /** Place the name before the badge (useful for an "away" side). */
  reverse?: boolean;
  className?: string;
}

/**
 * A team badge + name. Resolves the name against the team list so it can show
 * the right colours and link through to the team page when possible.
 */
export function TeamLabel({
  name,
  teams,
  badgeSize = 'sm',
  link = true,
  reverse = false,
  className = '',
}: TeamLabelProps) {
  const team = findTeam(teams, name);
  const display = team?.name ?? name;

  const inner = (
    <span
      className={`inline-flex min-w-0 items-center gap-2 ${
        reverse ? 'flex-row-reverse text-right' : ''
      } ${className}`}
    >
      <TeamBadge team={team} name={name} size={badgeSize} />
      <span className="min-w-0 truncate font-semibold text-neutral-100">{display}</span>
    </span>
  );

  if (link && team) {
    return (
      <Link
        to={`/team/${team.slug}`}
        className="inline-flex min-w-0 max-w-full rounded transition-colors hover:text-brand"
      >
        {inner}
      </Link>
    );
  }

  return inner;
}
