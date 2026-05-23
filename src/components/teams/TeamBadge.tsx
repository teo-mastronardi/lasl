import type { Team } from '@/types/league';
import { readableTextColor, teamInitials } from '@/utils/league';

export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/* Each entry is a complete class string so Tailwind's scanner picks it up. */
const SIZE_CLASS: Record<BadgeSize, string> = {
  xs: 'h-5 w-5 text-[9px]',
  sm: 'h-7 w-7 text-[11px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-14 w-14 text-base',
  xl: 'h-24 w-24 text-3xl',
};

interface TeamBadgeProps {
  /** When provided, the badge uses the team's colour and (optional) logo. */
  team?: Team;
  /** Fallback display name when no Team object is available. */
  name?: string;
  size?: BadgeSize;
  className?: string;
}

/**
 * Circular team badge. Renders the team's logo image when one is set in the
 * spreadsheet, otherwise a coloured circle with the team's initials.
 */
export function TeamBadge({ team, name, size = 'md', className = '' }: TeamBadgeProps) {
  const label = team?.name ?? name ?? 'Team';
  const sizeClass = SIZE_CLASS[size];

  if (team?.logo) {
    return (
      <img
        src={team.logo}
        alt=""
        loading="lazy"
        className={`${sizeClass} shrink-0 rounded-full bg-white object-cover ring-1 ring-white/15 ${className}`}
      />
    );
  }

  const background = team?.primaryColor || '#15803d';
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-extrabold ring-1 ring-white/15 ${sizeClass} ${className}`}
      style={{ backgroundColor: background, color: readableTextColor(background) }}
      aria-hidden="true"
    >
      {teamInitials(label)}
    </span>
  );
}
