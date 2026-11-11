import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['hu', 'en'],

    // Used when no locale matches
    defaultLocale: 'hu',

    localePrefix: 'as-needed',

    // Prevent automatic browser-language redirects from hijacking Hungarian pages
    localeDetection: false,

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
        '/szolgaltatasok/folyamatos-kibervedelmi-monitoring-nis2': {
            hu: '/szolgaltatasok/folyamatos-kibervedelmi-monitoring-nis2',
            en: '/services/continuous-security-monitoring-nis2'
        },
        '/szolgaltatasok/adathalaszat-szimulacio-biztonsagi-oktatas': {
            hu: '/szolgaltatasok/adathalaszat-szimulacio-biztonsagi-oktatas',
            en: '/services/phishing-simulation-security-training'
        },
        '/szolgaltatasok/menedzselt-enterprise-waf-vedelem': {
            hu: '/szolgaltatasok/menedzselt-enterprise-waf-vedelem',
            en: '/services/managed-enterprise-waf-shield'
        },
        '/szolgaltatasok/privat-vallalati-ai-tudasbazis-rag': {
            hu: '/szolgaltatasok/privat-vallalati-ai-tudasbazis-rag',
            en: '/services/private-enterprise-ai-knowledge-base'
        },
        '/szolgaltatasok/ai-dokumentum-es-szamlafeldolgozo-ocr': {
            hu: '/szolgaltatasok/ai-dokumentum-es-szamlafeldolgozo-ocr',
            en: '/services/ai-document-invoice-processing'
        },
        '/szolgaltatasok/ai-hivas-es-targyalaselemzo-asszisztens': {
            hu: '/szolgaltatasok/ai-hivas-es-targyalaselemzo-asszisztens',
            en: '/services/ai-call-meeting-intelligence'
        },
        '/szolgaltatasok/automatizalt-palyazat-es-kozbeszerzes-figyelo': {
            hu: '/szolgaltatasok/automatizalt-palyazat-es-kozbeszerzes-figyelo',
            en: '/services/automated-tender-procurement-monitor'
        },
        '/szolgaltatasok/zsarolovirus-vedett-katasztrofa-helyreallitas-draas': {
            hu: '/szolgaltatasok/zsarolovirus-vedett-katasztrofa-helyreallitas-draas',
            en: '/services/ransomware-proof-disaster-recovery-draas'
        },
        '/szolgaltatasok/szintetikus-webshop-es-fizetes-monitoring': {
            hu: '/szolgaltatasok/szintetikus-webshop-es-fizetes-monitoring',
            en: '/services/synthetic-webshop-checkout-monitoring'
        },
        '/szolgaltatasok/kampany-elotti-terhelesteszteles-load-testing': {
            hu: '/szolgaltatasok/kampany-elotti-terhelesteszteles-load-testing',
            en: '/services/campaign-load-testing-performance-audit'
        },
        '/szolgaltatasok/felhos-virtualis-munkaallomasok-vdi': {
            hu: '/szolgaltatasok/felhos-virtualis-munkaallomasok-vdi',
            en: '/services/cloud-virtual-workstations-vdi'
        },
        '/szolgaltatasok/white-label-titkositott-ugyfelportal': {
            hu: '/szolgaltatasok/white-label-titkositott-ugyfelportal',
            en: '/services/white-label-encrypted-client-portal'
        },
        '/szolgaltatasok/gdpr-kompatibilis-cookie-mentes-webanalitika': {
            hu: '/szolgaltatasok/gdpr-kompatibilis-cookie-mentes-webanalitika',
            en: '/services/gdpr-compliant-cookieless-analytics'
        },
        '/szolgaltatasok/magyar-adoszam-ceginformacio-validalo-api': {
            hu: '/szolgaltatasok/magyar-adoszam-ceginformacio-validalo-api',
            en: '/services/company-tax-id-validation-api'
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
        },
        '/dashboard': {
            hu: '/dashboard',
            en: '/dashboard'
        },
        '/dashboard/settings': {
            hu: '/dashboard/settings',
            en: '/dashboard/settings'
        },
        '/dashboard/projects': {
            hu: '/dashboard/projects',
            en: '/dashboard/projects'
        },
        '/dashboard/tickets': {
            hu: '/dashboard/tickets',
            en: '/dashboard/tickets'
        },
        '/dashboard/tickets/new': {
            hu: '/dashboard/tickets/new',
            en: '/dashboard/tickets/new'
        },
        '/dashboard/tickets/[id]': {
            hu: '/dashboard/tickets/[id]',
            en: '/dashboard/tickets/[id]'
        },
        '/admin': {
            hu: '/admin',
            en: '/admin'
        }
    }
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);
