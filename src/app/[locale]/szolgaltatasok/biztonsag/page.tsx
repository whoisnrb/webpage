import { getSeoMetadata } from "@/lib/seo";
import { BiztonsagContent } from "@/components/services/biztonsag-content";
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { trackEvent } from "@/lib/analytics";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export const revalidate = 86400; // 24 hours

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Services.Security' });

    return {
        title: t('title'),
        description: t('description'),
        keywords: ["kiberbiztonság", "biztonsági audit", "penetration testing", "sérülékenységvizsgálat", "GDPR", "ISO 27001"],
        ...getSeoMetadata(locale, "/szolgaltatasok/biztonsag"),
        openGraph: {
            title: `${t('title')} | BacklineIT`,
            description: t('description'),
        }
    };
}

export default async function BiztonsagPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Services.Security' });

    // Track service view
    trackEvent("view_service", "engagement", {
        service: "biztonsag",
        locale
    });

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": t('title'),
        "description": t('description'),
        "provider": {
            "@type": "ProfessionalService",
            "@id": "https://backlineit.hu/#organization"
        },
        "areaServed": {
            "@type": "Country",
            "name": "Hungary"
        },
        "url": "https://backlineit.hu/szolgaltatasok/biztonsag",
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
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BreadcrumbJsonLd
                items={[
                    { name: locale === 'en' ? 'Home' : 'Kezdőlap', href: locale === 'en' ? '/en' : '/' },
                    { name: locale === 'en' ? 'Services' : 'Szolgáltatások', href: locale === 'en' ? '/en/services' : '/szolgaltatasok' },
                    { name: t('title'), href: locale === 'en' ? '/en/services/security' : '/szolgaltatasok/biztonsag' },
                ]}
            />
            <BiztonsagContent />
        </>
    );
}
