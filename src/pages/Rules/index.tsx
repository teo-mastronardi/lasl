import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { SITE } from '@/data/site';

interface RuleGroup {
  title: string;
  rules: string[];
}

/** League rules — content mirrors the original LASL rules page. */
const RULE_GROUPS: RuleGroup[] = [
  {
    title: 'Game Format',
    rules: [
      '7 v 7 format played on half-size fields.',
      `A ${SITE.registration.seasonLength}-game regular season.`,
      `Games are played ${SITE.gameDay} evenings at the ${SITE.venue}, kicking off at ${SITE.gameTime}`,
    ],
  },
  {
    title: 'Core Rules',
    rules: [
      'No sliding.',
      'No offsides.',
      'Zero tolerance for verbal or physical harassment of players, opponents or officials.',
    ],
  },
  {
    title: 'Cards & Discipline',
    rules: [
      'Yellow card: the player is sent to the sin bin for 3 minutes and is removed from play for that time.',
      'Red card: awarded for two yellow cards in one match — the player returns the following week.',
      'A red card may also be issued as a direct ejection from the game.',
      'A direct red card may carry a suspension, with the length depending on the severity of the offence.',
    ],
  },
  {
    title: 'Restarts & Set Pieces',
    rules: [
      'Substitutions may be made on the fly or during a stoppage in play.',
      'All free kicks are indirect, except for penalty kicks.',
      'Opponents must stay 6 yards away on free kicks and corner kicks.',
      'Penalty kicks are taken 10 yards from the goal line.',
    ],
  },
  {
    title: 'Player Eligibility',
    rules: [
      'Players may not take part in a game until they are registered and their fees are paid.',
      `Players must be 18 years of age or older as of ${SITE.registration.ageCutoff}.`,
    ],
  },
];

export default function RulesPage() {
  useDocumentTitle({
    title: 'Rules',
    description:
      'Official rules of the Leamington Adult Soccer League — game format, discipline, set pieces and player eligibility.',
    path: '/rules',
  });

  return (
    <>
      <PageHeader
        title="Rules"
        eyebrow="League Information"
        subtitle="Please read the league rules before the season begins. They keep our games fair, safe and fun for everyone."
      />
      <PageContainer className="py-10 sm:py-12">
        <div className="grid gap-6 md:grid-cols-2">
          {RULE_GROUPS.map((group, index) => (
            <section
              key={group.title}
              className="rounded-xl border border-line bg-surface p-6"
            >
              <h2 className="flex items-center gap-3 text-lg font-bold text-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-extrabold text-white">
                  {index + 1}
                </span>
                {group.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {group.rules.map((rule) => (
                  <li
                    key={rule}
                    className="flex gap-2.5 text-sm text-neutral-300"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                      aria-hidden="true"
                    />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="mt-8 text-sm text-neutral-400">
          Questions about the rules? Email us at{' '}
          <a
            href={`mailto:${SITE.email}`}
            className="font-semibold text-brand hover:underline"
          >
            {SITE.email}
          </a>
          .
        </p>
      </PageContainer>
    </>
  );
}
