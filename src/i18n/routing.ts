import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['hu', 'en'],

    // Used when no locale matches
    defaultLocale: 'hu',

    pathnames: {
        '/': '/',
        '/rolunk': {
            hu: '/rolunk',
            en: '/about-us'
        },
        '/referenciak': {
            hu: '/referenciak',
            en: '/references'
        },
        '/referenciak/[slug]': {
            hu: '/referenciak/[slug]',
            en: '/references/[slug]'
        },
        '/arak': {
            hu: '/arak',
            en: '/pricing'
        },
        '/kapcsolat': {
            hu: '/kapcsolat',
            en: '/contact'
        },
        '/szolgaltatasok': {
            hu: '/szolgaltatasok',
            en: '/services'
        },
        '/szolgaltatasok/biztonsag': {
            hu: '/szolgaltatasok/biztonsag',
            en: '/services/security'
        },
        '/szolgaltatasok/halozat': {
            hu: '/szolgaltatasok/halozat',
            en: '/services/network'
        },
        '/szolgaltatasok/integraciok': {
            hu: '/szolgaltatasok/integraciok',
            en: '/services/integrations'
        },
        '/szolgaltatasok/rendszeruzemeltetes': {
            hu: '/szolgaltatasok/rendszeruzemeltetes',
            en: '/services/system-administration'
        },
        '/szolgaltatasok/scriptek': {
            hu: '/szolgaltatasok/scriptek',
            en: '/services/scripts'
        },
        '/szolgaltatasok/webfejlesztes': {
            hu: '/szolgaltatasok/webfejlesztes',
            en: '/services/web-development'
        },
        '/megoldasok': {
            hu: '/megoldasok',
            en: '/solutions'
        },
        '/megoldasok/[slug]': {
            hu: '/megoldasok/[slug]',
            en: '/solutions/[slug]'
        },
        '/velemeny': {
            hu: '/velemeny',
            en: '/testimonials'
        },
        '/blog': {
            hu: '/blog',
            en: '/blog'
        },
        '/blog/[slug]': {
            hu: '/blog/[slug]',
            en: '/blog/[slug]'
        },
        '/konzultacio': {
            hu: '/konzultacio',
            en: '/consultation'
        },
        '/karrier': {
            hu: '/karrier',
            en: '/careers'
        },
        '/karrier/jelentkezes': {
            hu: '/karrier/jelentkezes',
            en: '/careers/apply'
        },
        '/impresszum': {
            hu: '/impresszum',
            en: '/imprint'
        },
        '/adatvedelem': {
            hu: '/adatvedelem',
            en: '/privacy-policy'
        },
        '/aszf': {
            hu: '/aszf',
            en: '/terms-and-conditions'
        },
        '/ajanlatkeres': {
            hu: '/ajanlatkeres',
            en: '/request-a-quote'
        },
        '/demo': {
            hu: '/demo',
            en: '/demo'
        },
        '/login': {
            hu: '/login',
            en: '/login'
        },
        '/register': {
            hu: '/register',
            en: '/register'
        },
        '/checkout': {
            hu: '/checkout',
            en: '/checkout'
        }
    }
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);
