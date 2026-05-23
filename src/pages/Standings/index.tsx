import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Loading } from '@/components/common/Loading';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { TrophyIcon } from '@/components/common/icons';
import { StandingsTable } from '@/components/tables/StandingsTable';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useLeagueData } from '@/hooks/useLeagueData';

export default function StandingsPage() {
  useDocumentTitle({
    title: 'Standings',
    description:
      'The Leamington Adult Soccer League table — games played, wins, draws, losses, goal difference and points for every team.',
    path: '/standings',
  });

  const { data, loading, error } = useLeagueData();

  return (
    <>
      <PageHeader title="Standings" eyebrow="League Table" />
      <PageContainer className="py-10 sm:py-12">

        {loading && <Loading label="Loading standings…" />}
        {error && !loading && <ErrorState message={error} />}

        {!loading && !error && (
          <>
            {data.standings.length > 0 ? (
              <>
                <StandingsTable rows={data.standings} teams={data.teams} />
                <p className="mt-4 text-xs text-neutral-500">
                  <span className="font-semibold">GP</span> Games Played ·{' '}
                  <span className="font-semibold">W</span> Won ·{' '}
                  <span className="font-semibold">D</span> Drawn ·{' '}
                  <span className="font-semibold">L</span> Lost ·{' '}
                  <span className="font-semibold">GF</span> Goals For ·{' '}
                  <span className="font-semibold">GA</span> Goals Against ·{' '}
                  <span className="font-semibold">GD</span> Goal Difference ·{' '}
                  <span className="font-semibold">PTS</span> Points
                </p>
              </>
            ) : (
              <EmptyState
                title="No standings yet"
                message="The league table will appear here once games have been played."
                icon={<TrophyIcon />}
              />
            )}
          </>
        )}
      </PageContainer>
    </>
  );
}
