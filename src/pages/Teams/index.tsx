import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Loading } from '@/components/common/Loading';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { UsersIcon } from '@/components/common/icons';
import { TeamCard } from '@/components/cards/TeamCard';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useLeagueData } from '@/hooks/useLeagueData';
import { standingForTeam } from '@/utils/league';

export default function TeamsPage() {
  useDocumentTitle({
    title: 'Teams',
    description:
      'All teams in the Leamington Adult Soccer League. View rosters, schedules and results for each team.',
    path: '/teams',
  });

  const { data, loading, error } = useLeagueData();
  const teams = [...data.teams].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <PageHeader title="Teams" eyebrow="The Clubs" />
      <PageContainer className="py-10 sm:py-12">

        {loading && <Loading label="Loading teams…" />}
        {error && !loading && <ErrorState message={error} />}

        {!loading && !error && (
          <>
            {teams.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {teams.map((team) => (
                  <TeamCard
                    key={team.slug}
                    team={team}
                    standing={standingForTeam(data.standings, team)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No teams yet"
                message="Teams will appear here once they have been added to the league."
                icon={<UsersIcon />}
              />
            )}
          </>
        )}
      </PageContainer>
    </>
  );
}
