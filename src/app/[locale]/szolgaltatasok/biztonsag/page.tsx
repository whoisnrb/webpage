import { BiztonsagContent } from "@/components/services/biztonsag-content";
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export const revalidate = 86400; // 24 hours

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Services.Security' });

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
            "name": "Kiberbiztonsági Csomagok",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": t('plans.base.name')
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": t('plans.detailed.name')
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": t('plans.complex.name')
                    }
                }
            ]
        }
    }

    return {
        title: t('title') + " | BacklineIT",
        description: t('description'),
        keywords: ["kiberbiztonság", "biztonsági audit", "penetration testing", "sérülékenységvizsgálat", "GDPR", "ISO 27001"],
        alternates: {
            canonical: `https://backlineit.hu/${locale === 'hu' ? '' : 'en'}/szolgaltatasok/biztonsag`,
            languages: {
                'hu': 'https://backlineit.hu/szolgaltatasok/biztonsag',
                'en': 'https://backlineit.hu/en/services/security',
            },
        },
        other: {
            'script:ld+json': JSON.stringify(jsonLd),
        }
    };
}

export default function BiztonsagPage() {
    return <BiztonsagContent />;
}
