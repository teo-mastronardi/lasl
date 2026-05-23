import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTeamList } from '@/hooks/useLeagueData';
import { TeamBadge } from '@/components/teams/TeamBadge';
import { NavDropdown } from './NavDropdown';
import { MORE_NAV, PRIMARY_NAV } from './navItems';

function linkClass({ isActive }: { isActive: boolean }): string {
  return `relative px-3 py-2 text-[13px] font-bold uppercase tracking-wide transition-colors ${
    isActive
      ? 'text-slate-900 after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:bg-brand'
      : 'text-slate-600 hover:text-slate-900'
  }`;
}

/** Desktop header navigation (shown at the `xl` breakpoint and up). */
export function NavBar() {
  const { teams } = useTeamList();
  const { pathname } = useLocation();

  const teamsActive = pathname === '/teams' || pathname.startsWith('/team/');
  const moreActive = MORE_NAV.some((item) => item.to === pathname);

  return (
    <nav aria-label="Primary" className="hidden items-center gap-0.5 xl:flex">
      {PRIMARY_NAV.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
          {item.label}
        </NavLink>
      ))}

      <NavDropdown label="Teams" active={teamsActive}>
        <div className="grid gap-0.5">
          {teams.map((team) => (
            <Link
              key={team.slug}
              to={`/team/${team.slug}`}
              role="menuitem"
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand"
            >
              <TeamBadge team={team} size="xs" />
              {team.name}
            </Link>
          ))}
          <Link
            to="/teams"
            role="menuitem"
            className="mt-1 rounded-lg border-t border-slate-100 px-2.5 pt-2.5 pb-1.5 text-sm font-bold text-brand hover:bg-slate-50"
          >
            View all teams →
          </Link>
        </div>
      </NavDropdown>

      <NavDropdown label="More" active={moreActive}>
        <div className="grid gap-0.5">
          {MORE_NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              role="menuitem"
              className="rounded-lg px-2.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </NavDropdown>
    </nav>
  );
}
