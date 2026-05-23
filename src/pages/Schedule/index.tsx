import { useMemo, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Loading } from '@/components/common/Loading';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { FilterSelect } from '@/components/common/FilterSelect';
import { CalendarIcon } from '@/components/common/icons';
import { MatchCard } from '@/components/cards/MatchCard';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useLeagueData } from '@/hooks/useLeagueData';
import { findTeam, groupByDate, matchesTeam } from '@/utils/league';
import type { DateGroup } from '@/utils/league';
import type { ScheduleMatch } from '@/types/league';
import {
  compareDates,
  formatLongDate,
  parseLeagueDate,
  startOfToday,
} from '@/utils/format';

export default function SchedulePage() {
  useDocumentTitle({
    title: 'Schedule',
    description:
      'The Leamington Adult Soccer League game schedule — match days, kick-off times and fields.',
    path: '/schedule',
  });

  const { data, loading, error } = useLeagueData();
  const [teamFilter, setTeamFilter] = useState('all');

  // Number every match day from the full (unfiltered) schedule.
  const matchDays = useMemo(() => {
    const dates = [...new Set(data.schedule.map((m) => m.date))].sort(
      compareDates,
    );
    return new Map(dates.map((date, index) => [date, index + 1]));
  }, [data.schedule]);

  // Split match days into upcoming (today + future) and already-played.
  const { upcoming, past } = useMemo(() => {
    const team =
      teamFilter === 'all' ? undefined : findTeam(data.teams, teamFilter);
    const filtered = team
      ? data.schedule.filter(
          (m) => matchesTeam(m.home, team) || matchesTeam(m.away, team),
        )
      : data.schedule;
    const all = groupByDate(filtered, (m) => m.date, 'asc');
    const today = startOfToday();
    const up: DateGroup<ScheduleMatch>[] = [];
    const back: DateGroup<ScheduleMatch>[] = [];
    for (const group of all) {
      const d = parseLeagueDate(group.date);
      // Treat unparseable / today-and-after dates as upcoming.
      if (!d || d >= today) up.push(group);
      else back.push(group);
    }
    back.reverse(); // most recently played first
    return { upcoming: up, past: back };
  }, [data.schedule, data.teams, teamFilter]);

  const teamOptions = [
    { value: 'all', label: 'All teams' },
    ...[...data.teams]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((t) => ({ value: t.slug, label: t.name })),
  ];

  const renderGroup = (group: DateGroup<ScheduleMatch>) => (
    <section key={group.date}>
      <h2 className="mb-3 flex flex-wrap items-baseline gap-x-2 text-lg font-extrabold uppercase tracking-tight text-white">
        Match Day {matchDays.get(group.date)}
        <span className="text-sm font-medium normal-case text-neutral-400">
          {formatLongDate(group.date)}
        </span>
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {group.items.map((match, index) => (
          <MatchCard
            key={`${match.home}-${match.away}-${index}`}
            match={match}
            teams={data.teams}
            hideDate
          />
        ))}
      </div>
    </section>
  );

  return (
    <>
      <PageHeader title="Schedule" eyebrow="2026 Season" />
      <PageContainer className="py-10 sm:py-12">
        {loading && <Loading label="Loading schedule…" />}
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

            {upcoming.length === 0 && past.length === 0 ? (
              <EmptyState
                title="No matches scheduled"
                message="The schedule will appear here once it has been published."
                icon={<CalendarIcon />}
              />
            ) : (
              <div className="space-y-8">
                {upcoming.map(renderGroup)}

                {past.length > 0 && (
                  <div className="space-y-8 border-t border-line pt-8">
                    <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                      Played match days
                    </p>
                    {past.map(renderGroup)}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </PageContainer>
    </>
  );
}
