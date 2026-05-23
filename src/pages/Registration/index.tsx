import { Link } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { BallIcon } from '@/components/common/icons';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { SITE } from '@/data/site';

const { registration: reg } = SITE;

const STEPS = [
  {
    title: 'Check your eligibility',
    body: `You must be 18 years of age or older as of ${reg.ageCutoff} to play in the league.`,
  },
  {
    title: 'Send your registration fee',
    body: `Send an Interac e-Transfer of $${reg.fee} ${reg.currency} to ${reg.etransferEmail} to reserve your spot.`,
  },
  {
    title: 'Complete the registration form',
    body: reg.formUrl
      ? 'Download, fill out and return the registration form so we have your details and waiver on file.'
      : 'The league will follow up by email to collect your details and confirm your registration.',
  },
  {
    title: "You're in!",
    body: 'Once your fee is received you will be placed on a team. Watch the Schedule page for your fixtures.',
  },
];

export default function RegistrationPage() {
  useDocumentTitle({
    title: 'Registration',
    description: reg.open
      ? `Register for the Leamington Adult Soccer League. $${reg.fee} per player for a ${reg.seasonLength}-game season.`
      : 'Registration for the Leamington Adult Soccer League is currently closed.',
    path: '/registration',
  });

  /* Registration closed — see SITE.registration.open in src/data/site.ts */
  if (!reg.open) {
    return (
      <>
        <PageHeader title="Registration" eyebrow="Join the League" />
        <PageContainer className="py-10 sm:py-12">
          <div className="mx-auto max-w-xl rounded-2xl border border-line bg-surface p-8 text-center sm:p-10">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand/15 text-brand">
              <BallIcon className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-extrabold uppercase tracking-tight text-white">
              Registration is closed
            </h2>
            <p className="mt-3 text-neutral-400">
              The registration period for the 2026 season has ended. Thank you
              to everyone who signed up. See you on the pitch!
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              Have a question? Email us at{' '}
              <a
                href={`mailto:${SITE.email}`}
                className="font-semibold text-brand hover:underline"
              >
                {SITE.email}
              </a>
              .
            </p>
            <Link
              to="/schedule"
              className="mt-6 inline-block rounded-lg bg-brand px-6 py-3 font-bold text-white transition-colors hover:bg-brand-dark"
            >
              View the schedule
            </Link>
          </div>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Registration"
        eyebrow="Join the League"
        subtitle={`Spots are filled on a first-come, first-served basis. Register early to guarantee your place for the ${reg.seasonLength}-game season.`}
      />
      <PageContainer className="py-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Steps */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-extrabold uppercase tracking-tight text-white sm:text-2xl">
              How to register
            </h2>
            <ol className="mt-5 space-y-4">
              {STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="flex gap-4 rounded-xl border border-line bg-surface p-5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-extrabold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-white">{step.title}</h3>
                    <p className="mt-1 text-sm text-neutral-400">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Fee card */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-line bg-surface p-6 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-brand">
                Registration Fee
              </p>
              <p className="mt-2 text-5xl font-extrabold text-white">
                ${reg.fee}
              </p>
              <p className="text-sm text-neutral-500">
                {reg.currency} per player · {reg.seasonLength}-game season
              </p>

              <div className="mt-5 rounded-lg bg-surface-2 p-4 text-left">
                <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">
                  Send your e-Transfer to
                </p>
                <p className="mt-1 font-semibold break-all text-neutral-100">
                  {reg.etransferEmail}
                </p>
              </div>

              {reg.formUrl && (
                <a
                  href={reg.formUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 block rounded-lg bg-brand px-4 py-2.5 font-bold text-white transition-colors hover:bg-brand-dark"
                >
                  Download registration form
                </a>
              )}

              <a
                href={`mailto:${SITE.email}?subject=LASL Registration`}
                className="mt-3 block rounded-lg border border-line px-4 py-2.5 font-bold text-neutral-200 transition-colors hover:bg-white/5"
              >
                Email the league
              </a>
            </div>
          </aside>
        </div>
      </PageContainer>
    </>
  );
}
