import { PageContainer } from '@/components/layout/PageContainer';
import { SITE } from '@/data/site';

/**
 * Prominent red banner shown on the home page when games are cancelled or
 * postponed. Toggle via `SITE.cancellation.active` in `src/data/site.ts`.
 * Renders nothing when the toggle is off — safe to include unconditionally.
 */
export function CancellationBanner() {
  if (!SITE.cancellation.active) return null;

  return (
    <section
      role="alert"
      className="border-b border-brand-dark bg-brand text-white"
    >
      <PageContainer className="py-3 text-center sm:py-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/85">
          League notice
        </p>
        <p className="mt-1 text-base font-bold sm:text-lg">
          {SITE.cancellation.message}
        </p>
      </PageContainer>
    </section>
  );
}
