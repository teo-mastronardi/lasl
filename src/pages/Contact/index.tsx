import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { FacebookIcon, MailIcon, MapPinIcon } from '@/components/common/icons';
import { SITE } from '@/data/site';

export default function ContactPage() {
  useDocumentTitle({
    title: 'Contact',
    description:
      'Get in touch with the Leamington Adult Soccer League — email, location and Facebook group.',
    path: '/contact',
  });

  const { address } = SITE;
  const mapQuery = encodeURIComponent(
    `${SITE.venue}, ${address.city}, ${address.province}`,
  );

  return (
    <>
      <PageHeader title="Contact Us" eyebrow="Get in Touch" />
      <PageContainer className="py-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <a
              href={`mailto:${SITE.email}`}
              className="flex items-start gap-4 rounded-xl border border-line bg-surface p-5 transition-colors hover:border-brand"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-brand">
                <MailIcon className="h-6 w-6" />
              </span>
              <span>
                <span className="block font-bold text-white">Email</span>
                <span className="block text-sm break-all text-neutral-400">
                  {SITE.email}
                </span>
              </span>
            </a>

            <div className="flex items-start gap-4 rounded-xl border border-line bg-surface p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-brand">
                <MapPinIcon className="h-6 w-6" />
              </span>
              <span>
                <span className="block font-bold text-white">
                  Where we play
                </span>
                <span className="block text-sm text-neutral-400">
                  {SITE.venue}
                  <br />
                  {address.line1}
                  <br />
                  {address.city}, {address.province} {address.postal}
                </span>
              </span>
            </div>

            {SITE.facebookUrl && (
              <a
                href={SITE.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-4 rounded-xl border border-line bg-surface p-5 transition-colors hover:border-brand"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-brand">
                  <FacebookIcon className="h-6 w-6" />
                </span>
                <span>
                  <span className="block font-bold text-white">
                    Facebook Group
                  </span>
                  <span className="block text-sm text-neutral-400">
                    Join the conversation and get the latest updates.
                  </span>
                </span>
              </a>
            )}
          </div>

          <div className="overflow-hidden rounded-xl border border-line bg-surface">
            <iframe
              title={`Map to ${SITE.venue}`}
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              className="h-full min-h-80 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </PageContainer>
    </>
  );
}
