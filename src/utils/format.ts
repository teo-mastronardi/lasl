/* ===========================================================================
 * Formatting helpers — dates and small display utilities.
 *
 * The spreadsheet may store dates as ISO ("2026-05-20") or North-American
 * style ("5/20/2026"). `parseLeagueDate` accepts both and never throws.
 * =========================================================================== */

/** Builds a local-time Date (avoids the UTC off-by-one timezone shift). */
function localDate(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day);
}

/** Parses a spreadsheet date string. Returns null when it cannot be read. */
export function parseLeagueDate(value: string): Date | null {
  const s = (value ?? '').trim();
  if (!s) return null;

  // ISO: yyyy-mm-dd (optionally with a time portion)
  const iso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) return localDate(+iso[1], +iso[2], +iso[3]);

  // North-American: m/d/yyyy or m-d-yy
  const na = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (na) {
    const year = +na[3] < 100 ? 2000 + +na[3] : +na[3];
    return localDate(year, +na[1], +na[2]);
  }

  const fallback = new Date(s);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

/** "Wednesday, May 20, 2026" — used for date group headings. */
export function formatLongDate(value: string): string {
  const d = parseLeagueDate(value);
  if (!d) return value;
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** "May 20, 2026" */
export function formatMediumDate(value: string): string {
  const d = parseLeagueDate(value);
  if (!d) return value;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** "Wed, May 20" — compact form for cards and lists. */
export function formatShortDate(value: string): string {
  const d = parseLeagueDate(value);
  if (!d) return value;
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/** Sort comparator for date strings (ascending). Unparseable dates sort last. */
export function compareDates(a: string, b: string): number {
  const da = parseLeagueDate(a);
  const db = parseLeagueDate(b);
  if (!da && !db) return 0;
  if (!da) return 1;
  if (!db) return -1;
  return da.getTime() - db.getTime();
}

/** Midnight today, in local time — handy for upcoming/past comparisons. */
export function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
