/* ===========================================================================
 * useDocumentTitle — lightweight per-page SEO.
 *
 * Sets the document <title>, meta description, canonical URL and Open Graph
 * tags. Avoids pulling in a helmet library for what is a handful of lines.
 * =========================================================================== */

import { useEffect } from 'react';
import { SITE } from '@/data/site';

/** Creates or updates a <meta> tag, matched by attribute name/value. */
function upsertMeta(attr: 'name' | 'property', key: string, content: string): void {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

/** Creates or updates the canonical <link> tag. */
function upsertCanonical(href: string): void {
  let tag = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', 'canonical');
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
}

interface DocumentMeta {
  /** Page title (the site name is appended automatically). */
  title?: string;
  /** Meta description for search engines and link previews. */
  description?: string;
  /** Path for the canonical URL, e.g. "/schedule". Defaults to the title-less home. */
  path?: string;
}

export function useDocumentTitle({ title, description, path }: DocumentMeta): void {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE.name}` : SITE.name;
    document.title = fullTitle;
    upsertMeta('property', 'og:title', fullTitle);

    if (description) {
      upsertMeta('name', 'description', description);
      upsertMeta('property', 'og:description', description);
    }

    const url = `${SITE.url}${path ?? ''}`;
    upsertCanonical(url);
    upsertMeta('property', 'og:url', url);
  }, [title, description, path]);
}
