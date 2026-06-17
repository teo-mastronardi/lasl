/* ===========================================================================
 * Static site configuration
 *
 * Plain, non-spreadsheet content (contact details, registration info, etc.).
 * League admins can safely edit the values below.
 * =========================================================================== */

export const SITE = {
  name: 'Leamington Adult Soccer League',
  shortName: 'LASL',
  tagline: 'Recreational 7 v 7 co-ed adult soccer in Leamington, Ontario',
  url: 'https://lasl.ca',

  /** Primary contact email. */
  email: 'leamingtonadultsoccer@gmail.com',

  /** Where games are played. */
  venue: 'Leamington Soccer Complex',
  gameDay: 'Wednesday',
  gameTime: '6:30 p.m.',

  address: {
    line1: 'Corner of Mersea Road 2 and Mersea Road 12',
    city: 'Leamington',
    province: 'Ontario',
    postal: 'N8H 5L1',
    country: 'Canada',
  },

  facebookUrl: 'https://www.facebook.com/groups/leamingtonasl',

  registration: {
    /**
     * Registration master switch. Set to false once registration has closed
     * for the season — the Registration and Home pages then show a
     * "registration period is over" message instead of the sign-up steps.
     */
    open: false,

    fee: 90,
    currency: 'CAD',
    /** Interac e-Transfer recipient. */
    etransferEmail: 'leamingtonadultsoccer@gmail.com',
    /** Link to the downloadable registration form. Leave blank to hide. */
    formUrl: '',
    /** Players must be 18 or older as of this date. */
    ageCutoff: 'December 31, 2026',
    seasonLength: 16,
  },

  /**
   * Game-cancellation notice for the home page. Flip `active` to true on
   * days when games are cancelled or postponed and update `message` to the
   * current situation. Flip back to false once the season is on track again.
   */
  cancellation: {
    active: true,
    message: "Tonight's games have been postponed.",
  },

  /** Footer copyright start year. */
  copyrightStartYear: 2019,
} as const;
