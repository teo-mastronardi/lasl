/* ===========================================================================
 * Navigation configuration
 *
 * The desktop header mirrors the original LASL site: a few primary links, a
 * "Teams" dropdown, and a "More" dropdown for secondary pages.
 * =========================================================================== */

export interface NavLeaf {
  label: string;
  to: string;
}

/** Always-visible primary links. */
export const PRIMARY_NAV: NavLeaf[] = [
  { label: 'Home', to: '/' },
  { label: 'Schedule', to: '/schedule' },
  { label: 'Results', to: '/results' },
  { label: 'League Table', to: '/standings' },
  { label: 'Stats', to: '/stats' },
];

/** Secondary links, grouped under the "More" dropdown on desktop. */
export const MORE_NAV: NavLeaf[] = [
  { label: 'Rules', to: '/rules' },
  { label: 'Registration', to: '/registration' },
  // { label: 'Sponsors', to: '/sponsors' },
  { label: 'Contact', to: '/contact' },
];

/** Flat list of every primary route — used by the mobile menu and footer. */
export const ALL_NAV: NavLeaf[] = [
  ...PRIMARY_NAV,
  { label: 'Teams', to: '/teams' },
  ...MORE_NAV,
];
