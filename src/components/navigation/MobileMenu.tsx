import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTeamList } from '@/hooks/useLeagueData';
import { TeamBadge } from '@/components/teams/TeamBadge';
import { ChevronDownIcon, CloseIcon, MenuIcon } from '@/components/common/icons';
import { MORE_NAV, PRIMARY_NAV } from './navItems';

function itemClass({ isActive }: { isActive: boolean }): string {
  return `block rounded-lg px-3 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${
    isActive ? 'bg-brand/10 text-brand' : 'text-slate-700 hover:bg-slate-50'
  }`;
}

/** Hamburger menu shown below the `xl` breakpoint. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [teamsExpanded, setTeamsExpanded] = useState(false);
  const { teams } = useTeamList();
  const { pathname } = useLocation();

  // Close the menu after navigating.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent the page behind the menu from scrolling.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="flex h-10 w-10 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100"
      >
        {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-slate-200 bg-white">
          <nav aria-label="Mobile" className="mx-auto max-w-6xl space-y-1 px-4 py-4">
            {PRIMARY_NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={itemClass}>
                {item.label}
              </NavLink>
            ))}

            <div>
              <button
                type="button"
                onClick={() => setTeamsExpanded((v) => !v)}
                aria-expanded={teamsExpanded}
                className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-bold uppercase tracking-wide text-slate-700 hover:bg-slate-50"
              >
                Teams
                <ChevronDownIcon
                  className={`h-5 w-5 transition-transform ${
                    teamsExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {teamsExpanded && (
                <div className="mt-1 ml-3 space-y-0.5 border-l border-slate-200 pl-3">
                  {teams.map((team) => (
                    <Link
                      key={team.slug}
                      to={`/team/${team.slug}`}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand"
                    >
                      <TeamBadge team={team} size="xs" />
                      {team.name}
                    </Link>
                  ))}
                  <Link
                    to="/teams"
                    className="block rounded-lg px-3 py-2.5 text-sm font-bold text-brand hover:bg-slate-50"
                  >
                    View all teams →
                  </Link>
                </div>
              )}
            </div>

            {MORE_NAV.map((item) => (
              <NavLink key={item.to} to={item.to} className={itemClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
