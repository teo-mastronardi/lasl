import { PageContainer } from './PageContainer';

interface PageHeaderProps {
  title: string;
  /** Optional short description shown below the title. */
  subtitle?: string;
  /** Optional small label shown above the title. */
  eyebrow?: string;
}

/** Dark page banner with a centered, uppercase title — used on interior pages. */
export function PageHeader({ title, subtitle, eyebrow }: PageHeaderProps) {
  return (
    <section className="border-b border-line bg-surface/40">
      <PageContainer className="py-12 text-center sm:py-14">
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-brand" />
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-sm text-neutral-400 sm:text-base">
            {subtitle}
          </p>
        )}
      </PageContainer>
    </section>
  );
}
