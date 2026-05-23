import { Link } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { Loading } from '@/components/common/Loading';
import { SectionHeading } from '@/components/common/SectionHeading';
import { CalendarIcon, ClockIcon, MapPinIcon } from '@/components/common/icons';
import { MatchCard } from '@/components/cards/MatchCard';
import { ScoreCard } from '@/components/cards/ScoreCard';
import { TeamLabel } from '@/components/teams/TeamLabel';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useLeagueData } from '@/hooks/useLeagueData';
import { groupByDate, sortStandings } from '@/utils/league';
import { formatLongDate, parseLeagueDate, startOfToday } from '@/utils/format';
import { SITE } from '@/data/site';

/* Dark navy hero. Drop a photo at public/hero.jpg to use a stadium image. */
const heroStyle = {
  backgroundColor: '#0f1a38',
  backgroundImage: "url('/hero.jpg')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
};
const heroOverlay =
  'radial-gradient(ellipse at 50% 0%, rgba(27,42,82,0.55), rgba(11,11,12,0.92))';

export default function HomePage() {
  useDocumentTitle({
    description: `${SITE.name} — ${SITE.tagline}. Schedule, results, standings, stats and team information.`,
    path: '/',
  });

  const { data, loading } = useLeagueData();

  const scheduleGroups = groupByDate(data.schedule, (m) => m.date, 'asc');
  const today = startOfToday();
  const nextDay =
    scheduleGroups.find((g) => {
      const d = parseLeagueDate(g.date);
      return !d || d >= today;
    }) ?? scheduleGroups[scheduleGroups.length - 1];

  const latestResults = groupByDate(data.results, (m) => m.date, 'desc')[0];
  const topTeams = sortStandings(data.standings).slice(0, 5);

  return (
    <>
      {/* Hero */}
      <section className="relative border-b border-line" style={heroStyle}>
        <div className="absolute inset-0" style={{ background: heroOverlay }} />
        <PageContainer className="relative py-24 text-center sm:py-36">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-light">
            2026 Season
          </p>
          <h1 className="mt-3 text-4xl font-extrabold uppercase tracking-tight text-white drop-shadow-lg sm:text-6xl">
            Leamington Adult Soccer League
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-neutral-300 sm:text-lg">
            {SITE.tagline}.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-neutral-300">
            <span className="inline-flex items-center gap-1.5">
              <CalendarIcon className="h-4 w-4 text-brand-light" />
              {SITE.gameDay} evenings
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="h-4 w-4 text-brand-light" />
              {SITE.gameTime} kickoff
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPinIcon className="h-4 w-4 text-brand-light" />
              {SITE.venue}
            </span>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {SITE.registration.open ? (
              <>
                <Link
                  to="/registration"
                  className="rounded-lg bg-brand px-6 py-3 font-bold text-white transition-colors hover:bg-brand-dark"
                >
                  Register Now
                </Link>
                <Link
                  to="/schedule"
                  className="rounded-lg border border-white/30 px-6 py-3 font-bold text-white transition-colors hover:bg-white/10"
                >
                  View Schedule
                </Link>
              </>
            ) : (
              <Link
                to="/schedule"
                className="rounded-lg bg-brand px-6 py-3 font-bold text-white transition-colors hover:bg-brand-dark"
              >
                View Schedule
              </Link>
            )}
          </div>
        </PageContainer>
      </section>

      <PageContainer className="py-12">

        {loading ? (
          <Loading label="Loading league info…" />
        ) : (
          <div className="space-y-14">
            {nextDay && (
              <section>
                <SectionHeading
                  title="Next Match Day"
                  description={formatLongDate(nextDay.date)}
                  actionLabel="Full schedule"
                  actionTo="/schedule"
                />
                <div className="grid gap-4 md:grid-cols-2">
                  {nextDay.items.map((match, index) => (
                    <MatchCard
                      key={`${match.home}-${match.away}-${index}`}
                      match={match}
                      teams={data.teams}
                      hideDate
                    />
                  ))}
                </div>
              </section>
            )}

            <div className="grid gap-10 lg:grid-cols-2">
              {topTeams.length > 0 && (
                <section>
                  <SectionHeading
                    title="League Table"
                    actionLabel="Full table"
                    actionTo="/standings"
                  />
                  <div className="overflow-hidden rounded-xl border border-line bg-surface">
                    {topTeams.map((row, index) => (
                      <div
                        key={row.team}
                        className="flex items-center gap-3 border-b border-line px-4 py-3 last:border-0"
                      >
                        <span className="w-5 text-center font-bold text-neutral-500">
                          {index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <TeamLabel
                            name={row.team}
                            teams={data.teams}
                            badgeSize="sm"
                          />
                        </div>
                        <span className="hidden text-sm text-neutral-500 sm:inline">
                          {row.gp} GP
                        </span>
                        <span className="font-extrabold tabular-nums text-brand">
                          {row.pts}
                          <span className="ml-1 text-xs font-semibold text-neutral-600">
                            PTS
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {latestResults && (
                <section>
                  <SectionHeading
                    title="Latest Results"
                    description={formatLongDate(latestResults.date)}
                    actionLabel="All results"
                    actionTo="/results"
                  />
                  <div className="space-y-4">
                    {latestResults.items.slice(0, 4).map((result, index) => (
                      <ScoreCard
                        key={`${result.home}-${result.away}-${index}`}
                        result={result}
                        teams={data.teams}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        )}
      </PageContainer>

      {/* Registration call to action */}
      <PageContainer className="pb-14">
        {SITE.registration.open ? (
          <div className="rounded-2xl bg-gradient-to-br from-brand-dark to-brand p-8 text-center sm:p-10">
            <h2 className="text-2xl font-extrabold uppercase tracking-tight text-white sm:text-3xl">
              Registration is open
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-white/90">
              Join the league for the 2026 season — ${SITE.registration.fee}{' '}
              {SITE.registration.currency} per player. Send an Interac
              e-Transfer to {SITE.registration.etransferEmail} to sign up.
            </p>
            <Link
              to="/registration"
              className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-bold text-brand-dark transition-colors hover:bg-neutral-100"
            >
              How to register
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-line bg-surface p-8 text-center sm:p-10">
            <h2 className="text-2xl font-extrabold uppercase tracking-tight text-white sm:text-3xl">
              Registration is closed for 2026
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-neutral-400">
              The registration period has ended. Follow the schedule, results
              and standings for the season ahead.
            </p>
            <Link
              to="/schedule"
              className="mt-6 inline-block rounded-lg bg-brand px-6 py-3 font-bold text-white transition-colors hover:bg-brand-dark"
            >
              View the schedule
            </Link>
          </div>
        )}
      </PageContainer>
    </>
  );
}
