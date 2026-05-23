/* ===========================================================================
 * Google Sheets data layer
 *
 * Reads each tab of the league spreadsheet as CSV, parses it into typed rows,
 * and caches the result. If a tab is unreachable or the sheet has a broken
 * cell we return an EMPTY array — never a bundled-seed fallback. Pages handle
 * empty data with their own "no data yet" state.
 *
 * How it works
 *  - The sheet must be shared as "Anyone with the link" -> "Viewer".
 *  - Each tab is fetched via gviz CSV (`tqx=out:csv`) which addresses tabs by
 *    name. We pass `headers=1` so gviz never auto-merges multiple rows into
 *    the header (this matters when a tab has frozen rows or formula cells).
 *  - Results are cached in sessionStorage for a few minutes so navigating
 *    between pages is instant; a page refresh re-fetches.
 * =========================================================================== */

import Papa from 'papaparse';
import type {
  GoalScorer,
  MatchResult,
  RosterPlayer,
  ScheduleMatch,
  SheetTab,
  Sponsor,
  StandingRow,
  Team,
} from '@/types/league';
import { slugify } from '@/utils/league';

/**
 * The Google Sheet that powers the site.
 *
 * The ID is read from VITE_SHEET_ID when set, and otherwise falls back to the
 * committed default below. A Sheet ID is NOT a secret — for a publicly-shared
 * sheet it is visible in the client bundle and network tab either way — so
 * committing a default keeps Vercel deployment zero-config, while the env var
 * still lets you point at a different sheet without touching code.
 */
const DEFAULT_SHEET_ID = '1hVTbUMSJMBdapdEPnuHAc6IWqMTm2K_TjwLBT5oY-Mw';
const SHEET_ID = import.meta.env.VITE_SHEET_ID?.trim() || DEFAULT_SHEET_ID;

const CACHE_NAMESPACE = 'lasl:sheet:';
/** Scoped to the sheet ID so swapping sheets naturally invalidates the cache. */
const CACHE_PREFIX = `${CACHE_NAMESPACE}${SHEET_ID}:`;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/** gviz CSV endpoint — addresses a tab by name on a link-shared sheet. */
function csvUrl(tab: SheetTab): string {
  // `headers=1` keeps gviz from auto-merging extra rows into the header.
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(tab)}`;
}

/* ----------------------------- raw-row helpers ---------------------------- */

type RawRow = Record<string, string>;

/** Returns the first non-empty value among the candidate column names. */
function get(row: RawRow, keys: string[]): string {
  for (const key of keys) {
    const value = row[key];
    if (value != null && value.trim() !== '') return value.trim();
  }
  return '';
}

/** Parses a numeric cell, tolerating stray characters; blank/invalid -> 0. */
function toNumber(value: string): number {
  if (!value) return 0;
  const n = Number(value.replace(/[^0-9.\-]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

/** Parses a boolean-ish cell: true / yes / y / 1 / x / ✓. */
function toBool(value: string): boolean {
  const v = value.trim().toLowerCase();
  return v === 'true' || v === 'yes' || v === 'y' || v === '1' || v === 'x' || v === '✓';
}

/* ------------------------------- tab parsers ------------------------------ */
/* Header names are normalised to a single lowercase token before parsing,
 * so keys below are the lowercased first word of the header cell.           */

function parseStanding(r: RawRow): StandingRow | null {
  const team = get(r, ['team', 'name']);
  if (!team) return null;
  const gf = toNumber(get(r, ['gf']));
  const ga = toNumber(get(r, ['ga']));
  const gdRaw = get(r, ['gd']);
  return {
    team,
    gp: toNumber(get(r, ['gp', 'p'])),
    w: toNumber(get(r, ['w'])),
    d: toNumber(get(r, ['d', 't'])),
    l: toNumber(get(r, ['l'])),
    gf,
    ga,
    gd: gdRaw === '' ? gf - ga : toNumber(gdRaw),
    pts: toNumber(get(r, ['pts', 'points'])),
    logoSlug: get(r, ['logoslug', 'logo_slug', 'slug']),
  };
}

function parseSchedule(r: RawRow): ScheduleMatch | null {
  const home = get(r, ['home', 'hometeam', 'home_team']);
  const away = get(r, ['away', 'awayteam', 'away_team']);
  if (!home && !away) return null;
  return {
    date: get(r, ['date']),
    time: get(r, ['time']),
    home,
    away,
    field: get(r, ['field', 'location', 'venue']),
  };
}

function parseResult(r: RawRow): MatchResult | null {
  const home = get(r, ['home', 'hometeam', 'home_team']);
  const away = get(r, ['away', 'awayteam', 'away_team']);
  if (!home && !away) return null;
  // Skip rows where the scores haven't been entered yet (both blank).
  const hsRaw = get(r, ['homescore', 'home_score', 'hs']);
  const asRaw = get(r, ['awayscore', 'away_score', 'as']);
  if (!hsRaw && !asRaw) return null;
  return {
    date: get(r, ['date']),
    home,
    away,
    homeScore: toNumber(hsRaw),
    awayScore: toNumber(asRaw),
  };
}

function parseGoalScorer(r: RawRow): GoalScorer | null {
  const player = get(r, ['player', 'name']);
  if (!player) return null;
  // Exclude 0-goal rows so the leaderboard only shows actual scorers.
  const goals = toNumber(get(r, ['goals', 'g']));
  if (goals <= 0) return null;
  return {
    player,
    team: get(r, ['team']),
    goals,
  };
}

function parseTeam(r: RawRow): Team | null {
  const name = get(r, ['name', 'team']);
  const slug = get(r, ['slug']) || slugify(name);
  if (!name && !slug) return null;
  return {
    slug,
    name: name || slug,
    logo: get(r, ['logo', 'logourl', 'logo_url']),
    primaryColor: get(r, ['primarycolor', 'primary_color', 'color']) || '#15803d',
    secondaryColor: get(r, ['secondarycolor', 'secondary_color']) || '#0f172a',
    captain: get(r, ['captain']),
  };
}

function parseRosterPlayer(r: RawRow): RosterPlayer | null {
  const player = get(r, ['player', 'name']);
  if (!player) return null;
  return {
    team: get(r, ['team', 'slug']),
    player,
    isCaptain: toBool(get(r, ['iscaptain', 'is_captain', 'captain', 'c'])),
    isKeeper: toBool(get(r, ['iskeeper', 'is_keeper', 'keeper', 'goalkeeper', 'gk'])),
  };
}

/* ------------------------------- CSV + cache ------------------------------ */

/** Google returns an HTML login/error page when a sheet is not public. */
function looksLikeHtml(text: string): boolean {
  const head = text.slice(0, 200).trimStart().toLowerCase();
  return head.startsWith('<!doctype') || head.startsWith('<html');
}

async function fetchTabCsv(tab: SheetTab): Promise<string> {
  const res = await fetch(csvUrl(tab));
  if (!res.ok) {
    throw new Error(`Google Sheets returned HTTP ${res.status} for "${tab}".`);
  }
  const text = await res.text();
  if (looksLikeHtml(text)) {
    throw new Error(
      `The "${tab}" tab is not readable. Share the sheet as "Anyone with the link can view".`,
    );
  }
  return text;
}

function parseCsv<T>(csv: string, parseRow: (row: RawRow) => T | null): T[] {
  const result = Papa.parse<RawRow>(csv, {
    header: true,
    skipEmptyLines: 'greedy',
    // Normalise headers to a single lowercase token. This makes us tolerant of
    // sheets where a formula has spilled into the header row (e.g. a header
    // cell that reads "player #REF! #REF!" still resolves to "player").
    transformHeader: (h) => h.trim().toLowerCase().split(/\s+/)[0] ?? '',
  });
  const rows: T[] = [];
  for (const raw of result.data) {
    const parsed = parseRow(raw);
    if (parsed) rows.push(parsed);
  }
  return rows;
}

function readCache<T>(tab: SheetTab): T[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + tab);
    if (!raw) return null;
    const { ts, rows } = JSON.parse(raw) as { ts: number; rows: T[] };
    if (Date.now() - ts > CACHE_TTL_MS) return null;
    return rows;
  } catch {
    return null;
  }
}

function writeCache<T>(tab: SheetTab, rows: T[]): void {
  try {
    sessionStorage.setItem(
      CACHE_PREFIX + tab,
      JSON.stringify({ ts: Date.now(), rows }),
    );
  } catch {
    /* sessionStorage unavailable or full — caching is best-effort only. */
  }
}

/** Clears all cached sheet data — including stale entries from other sheets. */
export function clearSheetCache(): void {
  tabCache.clear();
  try {
    Object.keys(sessionStorage)
      .filter((k) => k.startsWith(CACHE_NAMESPACE))
      .forEach((k) => sessionStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}

/* ------------------------------ tab loading ------------------------------- */

/**
 * Per-session promise cache. The first request for a tab starts the work;
 * every later request (this navigation or another) reuses the same result, so
 * the sheet is fetched at most once per page load. A full page reload clears
 * this map but the sessionStorage cache above still serves recent sheet data.
 */
const tabCache = new Map<SheetTab, Promise<unknown[]>>();

/**
 * Loads one tab. Tries: sessionStorage cache -> live sheet -> empty array.
 * Never rejects — on any failure it logs and resolves with `[]`.
 */
function loadTab<T>(
  tab: SheetTab,
  parseRow: (row: RawRow) => T | null,
): Promise<T[]> {
  const cached = tabCache.get(tab);
  if (cached) return cached as Promise<T[]>;

  const work = (async (): Promise<T[]> => {
    const stored = readCache<T>(tab);
    if (stored) return stored;

    try {
      const csv = await fetchTabCsv(tab);
      const rows = parseCsv(csv, parseRow);
      writeCache(tab, rows);
      return rows;
    } catch (err) {
      console.error(`[googleSheets] Failed to load "${tab}":`, err);
      return [];
    }
  })();

  tabCache.set(tab, work as Promise<unknown[]>);
  return work;
}

/* ----------------------------- public loaders ----------------------------- */

export const getTeams = (): Promise<Team[]> => loadTab('teams', parseTeam);

export const getStandings = (): Promise<StandingRow[]> =>
  loadTab('standings', parseStanding);

export const getSchedule = (): Promise<ScheduleMatch[]> =>
  loadTab('schedule', parseSchedule);

export const getResults = (): Promise<MatchResult[]> =>
  loadTab('results', parseResult);

export const getGoalScorers = (): Promise<GoalScorer[]> =>
  loadTab('goal_scorers', parseGoalScorer);

export const getRoster = (): Promise<RosterPlayer[]> =>
  loadTab('roster', parseRosterPlayer);

/**
 * Short-circuited: the current live sheet has no `sponsors` tab and that
 * page is disabled. We resolve to an empty array rather than firing a
 * fetch that would just 404 (or return the workbook's Overview tab).
 */
export const getSponsors = (): Promise<Sponsor[]> => Promise.resolve([]);
