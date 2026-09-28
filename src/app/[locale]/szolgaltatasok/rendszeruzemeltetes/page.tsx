import { getSeoMetadata } from "@/lib/seo";
import { SysAdminContent } from "@/components/services/sysadmin-content";
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export const revalidate = 86400; // 24 hours

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Services.SysAdmin' });

    return {
        title: t('title'),
        description: t('description'),
        keywords: ["rendszerüzemeltetés", "devops", "szerver karbantartás", "linux", "cloud", "aws", "kubernetes"],
        ...getSeoMetadata(locale, "/szolgaltatasok/rendszeruzemeltetes"),
        openGraph: {
            title: `${t('title')} | BacklineIT`,
            description: t('description'),
        }
    };
}

export default async function RendszeruzemeltetesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Services.SysAdmin' });

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
        "url": "https://backlineit.hu/szolgaltatasok/rendszeruzemeltetes",
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
                    { name: t('title'), href: locale === 'en' ? '/en/services/system-administration' : '/szolgaltatasok/rendszeruzemeltetes' },
                ]}
            />
            <SysAdminContent />
        </>
    );
}
