import { useMemo, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Loading } from '@/components/common/Loading';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { SearchInput } from '@/components/common/SearchInput';
import { BallIcon } from '@/components/common/icons';
import { SortableTh } from '@/components/tables/SortableTh';
import { TeamLabel } from '@/components/teams/TeamLabel';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useLeagueData } from '@/hooks/useLeagueData';
import { useSortableData } from '@/hooks/useSortableData';
import type { GoalScorer } from '@/types/league';

type ScorerSortKey = 'player' | 'team' | 'goals';

/** Stable accessor for useSortableData (defined at module scope on purpose). */
function scorerValue(scorer: GoalScorer, key: ScorerSortKey): string | number {
  if (key === 'goals') return scorer.goals;
  if (key === 'team') return scorer.team;
  return scorer.player;
}

const scorerKey = (s: GoalScorer) => `${s.player}__${s.team}`;

function rankColor(rank: number): string {
  if (rank === 1) return 'text-amber-400';
  if (rank === 2) return 'text-neutral-300';
  if (rank === 3) return 'text-amber-600';
  return 'text-neutral-500';
}

export default function StatsPage() {
  useDocumentTitle({
    title: 'Stats',
    description:
      'Leading goal scorers in the Leamington Adult Soccer League — search and sort the leaderboard.',
    path: '/stats',
  });

  const { data, loading, error } = useLeagueData();
  const [query, setQuery] = useState('');

  // Rank every scorer by goals (players on the same total share a rank).
  const rankByKey = useMemo(() => {
    const byGoals = [...data.goalScorers].sort((a, b) => b.goals - a.goals);
    const map = new Map<string, number>();
    let rank = 0;
    let previousGoals = Number.NaN;
    byGoals.forEach((scorer, index) => {
      if (scorer.goals !== previousGoals) {
        rank = index + 1;
        previousGoals = scorer.goals;
      }
      map.set(scorerKey(scorer), rank);
    });
    return map;
  }, [data.goalScorers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data.goalScorers;
    return data.goalScorers.filter(
      (s) =>
        s.player.toLowerCase().includes(q) || s.team.toLowerCase().includes(q),
    );
  }, [data.goalScorers, query]);

  const { sorted, sort, toggleSort } = useSortableData<
    GoalScorer,
    ScorerSortKey
  >(filtered, scorerValue, { key: 'goals', direction: 'desc' });

  return (
    <>
      <PageHeader title="Leading Scorers" eyebrow="Stats" />
      <PageContainer className="py-10 sm:py-12">

        {loading && <Loading label="Loading stats…" />}
        {error && !loading && <ErrorState message={error} />}

        {!loading && !error && (
          <>
            {data.goalScorers.length === 0 ? (
              <EmptyState
                title="No stats yet"
                message="The goal scorers leaderboard will appear here once games have been played."
                icon={<BallIcon />}
              />
            ) : (
              <>
                <div className="mb-6 max-w-xs">
                  <SearchInput
                    value={query}
                    onChange={setQuery}
                    placeholder="Search players or teams…"
                    label="Search the leaderboard"
                  />
                </div>

                {sorted.length === 0 ? (
                  <p className="text-neutral-400">
                    No players match “{query}”.
                  </p>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-line bg-surface">
                    <table className="w-full min-w-[420px] text-sm">
                      <thead className="border-b border-line bg-surface-2">
                        <tr>
                          <th
                            scope="col"
                            className="px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-neutral-400"
                          >
                            #
                          </th>
                          <SortableTh
                            label="Player"
                            columnKey="player"
                            align="left"
                            activeKey={sort.key}
                            direction={sort.direction}
                            onSort={toggleSort}
                          />
                          <SortableTh
                            label="Team"
                            columnKey="team"
                            align="left"
                            activeKey={sort.key}
                            direction={sort.direction}
                            onSort={toggleSort}
                          />
                          <SortableTh
                            label="Goals"
                            columnKey="goals"
                            activeKey={sort.key}
                            direction={sort.direction}
                            onSort={toggleSort}
                          />
                        </tr>
                      </thead>
                      <tbody>
                        {sorted.map((scorer) => {
                          const rank = rankByKey.get(scorerKey(scorer)) ?? 0;
                          return (
                            <tr
                              key={scorerKey(scorer)}
                              className="border-b border-line last:border-0 hover:bg-white/[0.03]"
                            >
                              <td
                                className={`px-3 py-3 text-base font-extrabold tabular-nums ${rankColor(rank)}`}
                              >
                                {rank}
                              </td>
                              <td className="px-2.5 py-3 font-semibold text-neutral-100">
                                {scorer.player}
                              </td>
                              <td className="px-2.5 py-3">
                                <TeamLabel
                                  name={scorer.team}
                                  teams={data.teams}
                                  badgeSize="sm"
                                />
                              </td>
                              <td className="px-2.5 py-3 text-right">
                                <span className="font-extrabold tabular-nums text-brand">
                                  {scorer.goals}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </PageContainer>
    </>
  );
}
