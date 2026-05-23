/* ===========================================================================
 * League domain types
 *
 * Each interface mirrors one tab in the Google Sheet that powers the site.
 * Column names in the sheet (header row) must match the keys documented below.
 * =========================================================================== */

/** `standings` tab — columns: team, gp, w, d, l, gf, ga, gd, pts, logoSlug */
export interface StandingRow {
  team: string;
  gp: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
  /** Joins to `Team.slug` so the standings table can show a team badge/link. */
  logoSlug: string;
}

/** `schedule` tab — columns: date, time, home, away, field */
export interface ScheduleMatch {
  /** Raw date string from the sheet (e.g. "2026-05-20" or "5/20/2026"). */
  date: string;
  time: string;
  home: string;
  away: string;
  field: string;
}

/** `results` tab — columns: date, home, away, homeScore, awayScore */
export interface MatchResult {
  date: string;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
}

/** `goal_scorers` tab — columns: player, team, goals */
export interface GoalScorer {
  player: string;
  team: string;
  goals: number;
}

/** `teams` tab — columns: slug, name, logo, primaryColor, secondaryColor, captain */
export interface Team {
  slug: string;
  name: string;
  /** Optional logo URL. When empty, the UI renders a generated colour badge. */
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  captain: string;
}

/** `sponsors` tab — columns: name, logo, url */
export interface Sponsor {
  name: string;
  logo: string;
  url: string;
}

/** `roster` tab — columns: team, player, isCaptain, isKeeper */
export interface RosterPlayer {
  /** Matches a team by `slug` or `name` (case-insensitive). */
  team: string;
  player: string;
  isCaptain: boolean;
  isKeeper: boolean;
}

/** The set of tabs the app knows how to read. */
export type SheetTab =
  | 'standings'
  | 'schedule'
  | 'results'
  | 'goal_scorers'
  | 'teams'
  | 'sponsors'
  | 'roster';
