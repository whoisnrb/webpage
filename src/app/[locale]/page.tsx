import { HomeContent } from "@/components/home/home-content";
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

// Cache the page for 24 hours to reduce CPU usage
export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata' });

    // Multi-schema: WebSite and ProfessionalService
    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "BacklineIT",
            "url": "https://backlineit.hu",
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": "https://backlineit.hu/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
            }
        },
        {
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "BacklineIT",
            "image": "https://backlineit.hu/opengraph-image.png",
            "@id": "https://backlineit.hu/#organization",
            "url": "https://backlineit.hu",
            "telephone": "+36305428272",
            "priceRange": "$$",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Vörösmarty utca 11.",
                "addressLocality": "Csömör",
                "postalCode": "2141",
                "addressCountry": "HU"
            },
            "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday"
                ],
                "opens": "09:00",
                "closes": "17:00"
            }
        }
    ]

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: `https://backlineit.hu/${locale === 'hu' ? '' : 'en'}`,
            languages: {
                'hu': 'https://backlineit.hu/',
                'en': 'https://backlineit.hu/en',
            },
        },
        other: {
            'script:ld+json': JSON.stringify(jsonLd),
        }
    };
}

export default function Home() {
    return <HomeContent />;
}
