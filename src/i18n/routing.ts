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
        '/szolgaltatasok/wordpress-woocommerce-karbantartas': {
            hu: '/szolgaltatasok/wordpress-woocommerce-karbantartas',
            en: '/services/wordpress-woocommerce-maintenance'
        },
        '/szolgaltatasok/kkv-it-audit': {
            hu: '/szolgaltatasok/kkv-it-audit',
            en: '/services/smb-it-audit'
        },
        '/szolgaltatasok/webshop-automatizacio': {
            hu: '/szolgaltatasok/webshop-automatizacio',
            en: '/services/webshop-automation'
        },
        '/szolgaltatasok/ai-asszisztensek': {
            hu: '/szolgaltatasok/ai-asszisztensek',
            en: '/services/ai-assistants'
        },
        '/szolgaltatasok/microsoft-365-google-workspace': {
            hu: '/szolgaltatasok/microsoft-365-google-workspace',
            en: '/services/microsoft-365-google-workspace'
        },
        '/szolgaltatasok/backup-adatmentes': {
            hu: '/szolgaltatasok/backup-adatmentes',
            en: '/services/backup-data-recovery'
        },
        '/szolgaltatasok/havidijas-rendszergazda': {
            hu: '/szolgaltatasok/havidijas-rendszergazda',
            en: '/services/managed-it-services'
        },
        '/szolgaltatasok/felho-migracio-koltsegoptimalizalas': {
            hu: '/szolgaltatasok/felho-migracio-koltsegoptimalizalas',
            en: '/services/cloud-migration-cost-optimization'
        },
        '/szolgaltatasok/ai-ugyfelszolgalat-weboldalra': {
            hu: '/szolgaltatasok/ai-ugyfelszolgalat-weboldalra',
            en: '/services/ai-customer-support-chatbot'
        },
        '/szolgaltatasok/crm-lead-automatizacio': {
            hu: '/szolgaltatasok/crm-lead-automatizacio',
            en: '/services/crm-lead-automation'
        },
        '/szolgaltatasok/webshop-meres-konverzio-noveles': {
            hu: '/szolgaltatasok/webshop-meres-konverzio-noveles',
            en: '/services/ecommerce-tracking-conversion-optimization'
        },
        '/szolgaltatasok/uzleti-dashboardok-riportok': {
            hu: '/szolgaltatasok/uzleti-dashboardok-riportok',
            en: '/services/business-dashboards-automated-reports'
        },
        '/szolgaltatasok/remote-it-helpdesk-ticketing': {
            hu: '/szolgaltatasok/remote-it-helpdesk-ticketing',
            en: '/services/remote-it-helpdesk-ticketing'
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
