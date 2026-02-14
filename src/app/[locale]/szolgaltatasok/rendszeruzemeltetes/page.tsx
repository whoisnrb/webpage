import { SysAdminContent } from "@/components/services/sysadmin-content";
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Services.SysAdmin' });

    // Service Structured Data
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": t('title'),
        "description": t('description'),
        "provider": {
            "@type": "Organization",
            "name": "BacklineIT",
            "url": "https://backlineit.hu"
        },
        "areaServed": "HU",
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Rendszerüzemeltetési Csomagok",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": t('plans.starter.name')
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": t('plans.pro.name')
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": t('plans.enterprise.name')
                    }
                }
            ]
        }
    }

    return {
        title: t('title') + " | BacklineIT",
        description: t('description'),
        keywords: ["rendszerüzemeltetés", "devops", "szerver karbantartás", "linux", "cloud", "aws", "kubernetes"],
        alternates: {
            canonical: `https://backlineit.hu/${locale === 'hu' ? '' : 'en'}/szolgaltatasok/rendszeruzemeltetes`,
            languages: {
                'hu': 'https://backlineit.hu/szolgaltatasok/rendszeruzemeltetes',
                'en': 'https://backlineit.hu/en/services/sysadmin', // Assuming mapped route
            },
        },
        other: {
            'script:ld+json': JSON.stringify(jsonLd),
        }
    };
}

export default function RendszeruzemeltetesPage() {
    return <SysAdminContent />;
}
