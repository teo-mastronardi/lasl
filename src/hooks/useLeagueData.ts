/* ===========================================================================
 * useLeagueData — single hook that loads every spreadsheet tab in parallel.
 *
 * All tabs are small, so loading them together keeps page code simple and
 * pre-warms the cache for subsequent navigation. Each loader resolves with an
 * empty array on failure (no seed fallback), so the hook effectively never
 * hard-fails — pages render whatever real data is available.
 * =========================================================================== */

import { useEffect, useMemo, useState } from 'react';
import {
  getGoalScorers,
  getResults,
  getRoster,
  getSchedule,
  getSponsors,
  getStandings,
  getTeams,
} from '@/services/googleSheets';
import { slugify } from '@/utils/league';
import type {
  GoalScorer,
  MatchResult,
  RosterPlayer,
  ScheduleMatch,
  Sponsor,
  StandingRow,
  Team,
} from '@/types/league';

export interface LeagueData {
  teams: Team[];
  standings: StandingRow[];
  schedule: ScheduleMatch[];
  results: MatchResult[];
  goalScorers: GoalScorer[];
  sponsors: Sponsor[];
  roster: RosterPlayer[];
}

const EMPTY: LeagueData = {
  teams: [],
  standings: [],
  schedule: [],
  results: [],
  goalScorers: [],
  sponsors: [],
  roster: [],
};

export interface UseLeagueDataResult {
  data: LeagueData;
  loading: boolean;
  error: string | null;
}

export function useLeagueData(): UseLeagueDataResult {
  const [state, setState] = useState<UseLeagueDataResult>({
    data: EMPTY,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [teams, standings, schedule, results, goalScorers, sponsors, roster] =
          await Promise.all([
            getTeams(),
            getStandings(),
            getSchedule(),
            getResults(),
            getGoalScorers(),
            getSponsors(),
            getRoster(),
          ]);

        if (cancelled) return;

        setState({
          data: {
            teams,
            standings,
            schedule,
            results,
            goalScorers,
            sponsors,
            roster,
          },
          loading: false,
          error: null,
        });
      } catch (err) {
        if (cancelled) return;
        setState({
          data: EMPTY,
          loading: false,
          error:
            err instanceof Error ? err.message : 'Failed to load league data.',
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

/**
 * Loads just the teams tab — used by the header navigation so it does not have
 * to wait for every other dataset. Shares the cache with `useLeagueData`.
 */
export function useTeamList(): { teams: Team[]; loading: boolean } {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getTeams().then((rows) => {
      if (cancelled) return;
      setTeams(rows);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Sort alphabetically for a predictable menu order.
  const sorted = useMemo(
    () => [...teams].sort((a, b) => a.name.localeCompare(b.name)),
    [teams],
  );

  return { teams: sorted, loading };
}

/** Ensures every team has a usable slug (falls back to a slugified name). */
export function teamSlug(team: Team): string {
  return team.slug || slugify(team.name);
}
