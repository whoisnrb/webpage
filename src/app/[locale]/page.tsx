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

    // WebSite Structured Data
    const jsonLd = {
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
    }

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
