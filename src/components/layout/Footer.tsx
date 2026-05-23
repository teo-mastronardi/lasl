import { Link } from 'react-router-dom';
import { SITE } from '@/data/site';
import { ALL_NAV } from '@/components/navigation/navItems';
import { FacebookIcon, MailIcon, MapPinIcon } from '@/components/common/icons';
import { PageContainer } from './PageContainer';
import { Logo } from './Logo';

/** Site footer: branding, quick links and contact details. */
export function Footer() {
  const year = new Date().getFullYear();
  const { address } = SITE;

  return (
    <footer className="border-t border-line bg-surface text-neutral-400">
      <PageContainer className="py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Logo variant="dark" />
            <p className="mt-4 max-w-xs text-sm text-slate-400">{SITE.tagline}.</p>
            {SITE.facebookUrl && (
              <a
                href={SITE.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white"
              >
                <FacebookIcon className="h-5 w-5" />
                Facebook Group
              </a>
            )}
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {ALL_NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-slate-400 hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Contact
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MailIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-light" />
                <a href={`mailto:${SITE.email}`} className="break-all hover:text-white">
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-light" />
                <span>
                  {address.line1}
                  <br />
                  {address.city}, {address.province} {address.postal}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Copyright © {SITE.copyrightStartYear}–{year} {SITE.name}. All Rights
            Reserved.
          </p>
          <p>
            {address.city}, {address.province}, {address.country}
          </p>
        </div>
      </PageContainer>
    </footer>
  );
}
