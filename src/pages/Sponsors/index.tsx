import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Loading } from '@/components/common/Loading';
import { ErrorState } from '@/components/common/ErrorState';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useLeagueData } from '@/hooks/useLeagueData';
import type { Sponsor } from '@/types/league';
import { SITE } from '@/data/site';

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const inner = (
    <div className="flex h-36 items-center justify-center rounded-xl border border-line bg-surface p-6 text-center transition-colors hover:border-brand">
      {sponsor.logo ? (
        <img
          src={sponsor.logo}
          alt={sponsor.name}
          loading="lazy"
          className="max-h-20 max-w-full object-contain"
        />
      ) : (
        <span className="text-lg font-bold text-neutral-200">{sponsor.name}</span>
      )}
    </div>
  );

  return sponsor.url ? (
    <a href={sponsor.url} target="_blank" rel="noreferrer" className="block">
      {inner}
    </a>
  ) : (
    inner
  );
}

export default function SponsorsPage() {
  useDocumentTitle({
    title: 'Sponsors',
    description:
      'Local businesses that support the Leamington Adult Soccer League.',
    path: '/sponsors',
  });

  const { data, loading, error } = useLeagueData();

  return (
    <>
      <PageHeader
        title="Our Sponsors"
        eyebrow="Community Support"
        subtitle="The league is made possible by the generous support of local businesses. Thank you!"
      />
      <PageContainer className="py-10 sm:py-12">

        {loading && <Loading label="Loading sponsors…" />}
        {error && !loading && <ErrorState message={error} />}

        {!loading && !error && (
          <>
            {data.sponsors.length > 0 ? (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                {data.sponsors.map((sponsor) => (
                  <SponsorCard key={sponsor.name} sponsor={sponsor} />
                ))}
              </div>
            ) : (
              <p className="text-neutral-400">
                Sponsor announcements are coming soon. Check back shortly!
              </p>
            )}

            {/* Become a sponsor CTA */}
            <div className="mt-12 rounded-2xl bg-gradient-to-br from-brand-dark to-brand p-8 text-center sm:p-10">
              <h2 className="text-2xl font-extrabold uppercase tracking-tight text-white">
                Interested in sponsoring the league?
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-white/90">
                Sponsorship is a great way to support local recreation and get
                your business in front of the community. Get in touch to learn
                more.
              </p>
              <a
                href={`mailto:${SITE.email}?subject=LASL Sponsorship`}
                className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-bold text-brand-dark transition-colors hover:bg-neutral-100"
              >
                Become a sponsor
              </a>
            </div>
          </>
        )}
      </PageContainer>
    </>
  );
}
