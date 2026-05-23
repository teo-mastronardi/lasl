import { Link, useParams } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { Loading } from '@/components/common/Loading';
import { ErrorState } from '@/components/common/ErrorState';
import { SectionHeading } from '@/components/common/SectionHeading';
import { BallIcon } from '@/components/common/icons';
import { MatchCard } from '@/components/cards/MatchCard';
import { ScoreCard } from '@/components/cards/ScoreCard';
import { TeamBadge } from '@/components/teams/TeamBadge';
import { TeamRecord } from '@/components/teams/TeamRecord';
import { RosterList } from '@/components/teams/RosterList';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useLeagueData } from '@/hooks/useLeagueData';
import {
  findTeam,
  resultsForTeam,
  rosterForTeam,
  scheduleForTeam,
  scorersForTeam,
  sortStandings,
  standingForTeam,
} from '@/utils/league';
import { parseLeagueDate, startOfToday } from '@/utils/format';

export default function TeamPage() {
  const { slug = '' } = useParams();
  const { data, loading, error } = useLeagueData();
  const team = findTeam(data.teams, slug);

  useDocumentTitle({
    title: team ? team.name : 'Team',
    description: team
      ? `${team.name} — schedule, results, standings summary and roster in the Leamington Adult Soccer League.`
      : 'Team page.',
    path: `/team/${slug}`,
  });

  if (loading) {
    return (
      <PageContainer className="py-16">
        <Loading label="Loading team…" />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer className="py-16">
        <ErrorState message={error} />
      </PageContainer>
    );
  }

  if (!team) {
    return (
      <PageContainer className="flex flex-col items-center py-20 text-center">
        <h1 className="text-2xl font-extrabold text-white">Team not found</h1>
        <p className="mt-2 text-neutral-400">
          We could not find a team for “{slug}”.
        </p>
        <Link
          to="/teams"
          className="mt-6 rounded-lg bg-brand px-6 py-3 font-bold text-white transition-colors hover:bg-brand-dark"
        >
          View all teams
        </Link>
      </PageContainer>
    );
  }

  // Derive everything shown on the page for this team.
  const standing = standingForTeam(data.standings, team);
  const ordered = sortStandings(data.standings);
  const position = standing
    ? ordered.findIndex((s) => s.team === standing.team) + 1
    : undefined;

  const today = startOfToday();
  const upcoming = scheduleForTeam(data.schedule, team)
    .filter((m) => {
      const d = parseLeagueDate(m.date);
      return !d || d >= today;
    })
    .slice(0, 4);
  const recent = resultsForTeam(data.results, team).slice(0, 4);
  const topScorer = scorersForTeam(data.goalScorers, team)[0];
  const roster = rosterForTeam(data.roster, team);

  return (
    <>
      <section className="relative" style={{ backgroundColor: team.primaryColor }}>
        <div className="absolute inset-0 bg-gradient-to-br from-black/25 to-black/65" />
        <PageContainer className="relative py-10 sm:py-12">
          <Link
            to="/teams"
            className="text-sm font-semibold text-white/80 hover:text-white"
          >
            ← All teams
          </Link>
          <div className="mt-4 flex items-center gap-4 sm:gap-5">
            <div className="rounded-full p-1 ring-2 ring-white/30">
              <TeamBadge team={team} size="xl" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl">
                {team.name}
              </h1>
              {team.captain && (
                <p className="mt-1 text-white/85">Captain: {team.captain}</p>
              )}
            </div>
          </div>
        </PageContainer>
      </section>

      <PageContainer className="py-10 sm:py-12">

        <section className="mb-10">
          <SectionHeading
            title="Season Record"
            actionLabel="Full standings"
            actionTo="/standings"
          />
          {standing ? (
            <TeamRecord standing={standing} position={position} />
          ) : (
            <p className="text-neutral-400">
              No standings have been recorded for this team yet.
            </p>
          )}
        </section>

        <div className="grid gap-10 lg:grid-cols-2">
          <section>
            <SectionHeading
              title="Upcoming Matches"
              actionLabel="Full schedule"
              actionTo="/schedule"
            />
            {upcoming.length > 0 ? (
              <div className="space-y-4">
                {upcoming.map((match, index) => (
                  <MatchCard
                    key={`${match.date}-${match.home}-${match.away}-${index}`}
                    match={match}
                    teams={data.teams}
                  />
                ))}
              </div>
            ) : (
              <p className="text-neutral-400">No upcoming matches scheduled.</p>
            )}
          </section>

          <section>
            <SectionHeading
              title="Recent Results"
              actionLabel="All results"
              actionTo="/results"
            />
            {recent.length > 0 ? (
              <div className="space-y-4">
                {recent.map((result, index) => (
                  <ScoreCard
                    key={`${result.date}-${result.home}-${result.away}-${index}`}
                    result={result}
                    teams={data.teams}
                    showDate
                  />
                ))}
              </div>
            ) : (
              <p className="text-neutral-400">No results recorded yet.</p>
            )}
          </section>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          <section className="lg:col-span-1">
            <SectionHeading
              title="Top Scorer"
              actionLabel="All scorers"
              actionTo="/stats"
            />
            {topScorer ? (
              <div className="rounded-xl border border-line bg-surface p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                    <BallIcon className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="font-extrabold text-white">
                      {topScorer.player}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {topScorer.goals} goal{topScorer.goals === 1 ? '' : 's'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-neutral-400">No goals recorded yet.</p>
            )}
          </section>

          <section className="lg:col-span-2">
            <SectionHeading title="Roster" />
            <RosterList players={roster} />
          </section>
        </div>
      </PageContainer>
    </>
  );
}
