import { Metadata } from 'next';

export function getSeoMetadata(
  locale: string,
  pathnameKey: string,
  params?: Record<string, string>
): Metadata {
  const pathnames: Record<string, { hu: string; en: string }> = {
    '/': { hu: '/', en: '/' },
    '/rolunk': { hu: '/rolunk', en: '/about-us' },
    '/referenciak': { hu: '/referenciak', en: '/references' },
    '/referenciak/[slug]': { hu: '/referenciak/[slug]', en: '/references/[slug]' },
    '/arak': { hu: '/arak', en: '/pricing' },
    '/kapcsolat': { hu: '/kapcsolat', en: '/contact' },
    '/szolgaltatasok': { hu: '/szolgaltatasok', en: '/services' },
    '/megoldasok': { hu: '/megoldasok', en: '/solutions' },
    '/megoldasok/[slug]': { hu: '/megoldasok/[slug]', en: '/solutions/[slug]' },
    '/velemeny': { hu: '/velemeny', en: '/testimonials' },
    '/blog': { hu: '/blog', en: '/blog' },
    '/blog/[slug]': { hu: '/blog/[slug]', en: '/blog/[slug]' },
    '/konzultacio': { hu: '/konzultacio', en: '/consultation' },
    '/karrier': { hu: '/karrier', en: '/careers' },
    '/karrier/jelentkezes': { hu: '/karrier/jelentkezes', en: '/careers/apply' },
    '/impresszum': { hu: '/impresszum', en: '/imprint' },
    '/adatvedelem': { hu: '/adatvedelem', en: '/privacy-policy' },
    '/aszf': { hu: '/aszf', en: '/terms-and-conditions' },
    '/ajanlatkeres': { hu: '/ajanlatkeres', en: '/request-a-quote' },
    '/demo': { hu: '/demo', en: '/demo' }
  };

  const routeConfig = pathnames[pathnameKey];
  if (!routeConfig) {
    return {};
  }

  const resolvePath = (loc: string) => {
    let path = loc === 'hu' ? routeConfig.hu : routeConfig.en;
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        path = path.replace(`[${key}]`, value);
      }
    }
    return path;
  };

  const huPath = resolvePath('hu');
  const enPath = resolvePath('en');

  // Hungarian paths do not have a /hu prefix in the canonical URL on the main site (e.g. /rolunk)
  // English paths have /en prefix (e.g. /en/about-us)
  const canonical = locale === 'hu' ? huPath : `/en${enPath === '/' ? '' : enPath}`;

  return {
    alternates: {
      canonical,
      languages: {
        'hu': huPath,
        'en': `/en${enPath === '/' ? '' : enPath}`,
      }
    }
  };
}
