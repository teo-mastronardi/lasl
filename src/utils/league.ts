/* ===========================================================================
 * League selectors — pure helpers for deriving views from the raw data.
 *
 * Kept as plain functions (no React) so they are trivial to read and reuse.
 * =========================================================================== */

import type {
  GoalScorer,
  MatchResult,
  RosterPlayer,
  ScheduleMatch,
  StandingRow,
  Team,
} from '@/types/league';
import { compareDates } from '@/utils/format';

/** Converts a team name into a URL-safe slug, e.g. "FC Carolina Blue" -> "fc-carolina-blue". */
export function slugify(value: string): string {
  return (value ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Case-insensitive comparison of a free-text value against a team's name or slug. */
export function matchesTeam(value: string, team: Team): boolean {
  const v = (value ?? '').trim().toLowerCase();
  if (!v) return false;
  return v === team.name.toLowerCase() || v === team.slug.toLowerCase();
}

/** Finds a team by slug first, then by name. */
export function findTeam(teams: Team[], slugOrName: string): Team | undefined {
  const v = (slugOrName ?? '').trim().toLowerCase();
  return (
    teams.find((t) => t.slug.toLowerCase() === v) ??
    teams.find((t) => t.name.toLowerCase() === v)
  );
}

/**
 * Sorts standings the standard way: points, then goal difference, then goals
 * for, then team name. Returns a new array (does not mutate the input).
 */
export function sortStandings(rows: StandingRow[]): StandingRow[] {
  return [...rows].sort(
    (a, b) =>
      b.pts - a.pts ||
      b.gd - a.gd ||
      b.gf - a.gf ||
      a.team.localeCompare(b.team),
  );
}

/** The standings row that belongs to a given team (matched by name or slug). */
export function standingForTeam(
  standings: StandingRow[],
  team: Team,
): StandingRow | undefined {
  return standings.find(
    (s) => matchesTeam(s.team, team) || matchesTeam(s.logoSlug, team),
  );
}

/** All scheduled matches involving a team, sorted by date ascending. */
export function scheduleForTeam(
  schedule: ScheduleMatch[],
  team: Team,
): ScheduleMatch[] {
  return schedule
    .filter((m) => matchesTeam(m.home, team) || matchesTeam(m.away, team))
    .sort((a, b) => compareDates(a.date, b.date));
}

/** All results involving a team, most recent first. */
export function resultsForTeam(
  results: MatchResult[],
  team: Team,
): MatchResult[] {
  return results
    .filter((m) => matchesTeam(m.home, team) || matchesTeam(m.away, team))
    .sort((a, b) => compareDates(b.date, a.date));
}

/** Goal scorers belonging to a team, highest scorer first. */
export function scorersForTeam(
  scorers: GoalScorer[],
  team: Team,
): GoalScorer[] {
  return scorers
    .filter((s) => matchesTeam(s.team, team))
    .sort((a, b) => b.goals - a.goals);
}

/** Roster for a team, captain(s) first, then keepers, then everyone else. */
export function rosterForTeam(
  roster: RosterPlayer[],
  team: Team,
): RosterPlayer[] {
  return roster
    .filter((p) => matchesTeam(p.team, team))
    .sort((a, b) => {
      const rank = (p: RosterPlayer) => (p.isCaptain ? 0 : p.isKeeper ? 1 : 2);
      return rank(a) - rank(b) || a.player.localeCompare(b.player);
    });
}

/**
 * Returns black or white — whichever has better contrast against the given
 * background colour. Used for text drawn on top of a team's colour.
 */
export function readableTextColor(hexColor: string): '#0f172a' | '#ffffff' {
  const hex = (hexColor || '').replace('#', '').trim();
  if (hex.length !== 3 && hex.length !== 6) return '#ffffff';
  const full =
    hex.length === 3
      ? hex
          .split('')
          .map((c) => c + c)
          .join('')
      : hex;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  // Perceived luminance (sRGB weighting).
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#0f172a' : '#ffffff';
}

/** Two-letter initials for a team badge, e.g. "FC Carolina Blue" -> "CB". */
export function teamInitials(name: string): string {
  const words = (name ?? '')
    .replace(/\bFC\b/gi, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export interface DateGroup<T> {
  date: string;
  items: T[];
}

/** Groups items by their date string and orders the groups chronologically. */
export function groupByDate<T>(
  items: T[],
  getDate: (item: T) => string,
  order: 'asc' | 'desc' = 'asc',
): DateGroup<T>[] {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const date = getDate(item);
    const bucket = map.get(date);
    if (bucket) bucket.push(item);
    else map.set(date, [item]);
  }
  const groups = [...map.entries()].map(([date, groupItems]) => ({
    date,
    items: groupItems,
  }));
  groups.sort(
    (a, b) => compareDates(a.date, b.date) * (order === 'asc' ? 1 : -1),
  );
  return groups;
}
