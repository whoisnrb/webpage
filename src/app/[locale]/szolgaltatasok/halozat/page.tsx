import { getSeoMetadata } from "@/lib/seo";
import { HalozatContent } from "@/components/services/halozat-content";
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export const revalidate = 86400; // 24 hours

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Services.Network' });

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
        "areaServed": "HU"
    }

    return {
        title: t('title') + " | BacklineIT",
        description: t('description'),
        keywords: ["hálózat építés", "VPN", "tűzfal", "wifi rendszer", "SOHO", "vállalati hálózat"],
        ...getSeoMetadata(locale, "/szolgaltatasok/halozat"),
        other: {
            'script:ld+json': JSON.stringify(jsonLd),
        }
    };
}

export default function HalozatPage() {
    return <HalozatContent />;
}
