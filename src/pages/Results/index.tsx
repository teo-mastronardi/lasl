import { useMemo, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Loading } from '@/components/common/Loading';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { FilterSelect } from '@/components/common/FilterSelect';
import { BallIcon } from '@/components/common/icons';
import { ScoreCard } from '@/components/cards/ScoreCard';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useLeagueData } from '@/hooks/useLeagueData';
import { findTeam, groupByDate, matchesTeam } from '@/utils/league';
import { formatLongDate } from '@/utils/format';

export default function ResultsPage() {
  useDocumentTitle({
    title: 'Results',
    description:
      'Match results from the Leamington Adult Soccer League, grouped by date with the most recent games first.',
    path: '/results',
  });

  const { data, loading, error } = useLeagueData();
  const [teamFilter, setTeamFilter] = useState('all');

  const groups = useMemo(() => {
    const team =
      teamFilter === 'all' ? undefined : findTeam(data.teams, teamFilter);
    const filtered = team
      ? data.results.filter(
          (m) => matchesTeam(m.home, team) || matchesTeam(m.away, team),
        )
      : data.results;
    return groupByDate(filtered, (m) => m.date, 'desc');
  }, [data.results, data.teams, teamFilter]);

  const teamOptions = [
    { value: 'all', label: 'All teams' },
    ...[...data.teams]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((t) => ({ value: t.slug, label: t.name })),
  ];

  return (
    <>
      <PageHeader title="Results" eyebrow="Match Results" />
      <PageContainer className="py-10 sm:py-12">

        {loading && <Loading label="Loading results…" />}
        {error && !loading && <ErrorState message={error} />}

        {!loading && !error && (
          <>
            <div className="mb-6 max-w-xs">
              <FilterSelect
                label="Filter by team"
                value={teamFilter}
                onChange={setTeamFilter}
                options={teamOptions}
              />
            </div>

            {groups.length === 0 ? (
              <EmptyState
                title="No results yet"
                message="Match results will appear here once games have been played."
                icon={<BallIcon />}
              />
            ) : (
              <div className="space-y-8">
                {groups.map((group) => (
                  <section key={group.date}>
                    <h2 className="mb-3 text-lg font-extrabold uppercase tracking-tight text-white">
                      {formatLongDate(group.date)}
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      {group.items.map((result, index) => (
                        <ScoreCard
                          key={`${result.home}-${result.away}-${index}`}
                          result={result}
                          teams={data.teams}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </>
        )}
      </PageContainer>
    </>
  );
}
