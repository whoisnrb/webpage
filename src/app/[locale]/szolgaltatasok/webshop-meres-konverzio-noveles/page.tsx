import { GenericServiceContent } from "@/components/services/generic-service-content";
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Metadata } from 'next';
import { Activity } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export const revalidate = 86400; // 24 hours

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Services.EcommerceTracking' });

    return {
        title: t('title') + " | BacklineIT",
        description: t('description'),
        keywords: t('keywords').split(','),
        alternates: {
            canonical: `https://backlineit.hu${locale === 'hu' ? '' : '/en'}${locale === 'hu' ? '/szolgaltatasok/webshop-meres-konverzio-noveles' : '/services/ecommerce-tracking-conversion-optimization'}`,
            languages: {
                'hu': 'https://backlineit.hu/szolgaltatasok/webshop-meres-konverzio-noveles',
                'en': 'https://backlineit.hu/en/services/ecommerce-tracking-conversion-optimization',
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
        }
    };
}

export default async function EcommerceTrackingPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    // Track service view
    trackEvent("view_service", "engagement", {
        service: "webshop-meres-konverzio-noveles",
        locale
    });

    return <GenericServiceContent serviceKey="EcommerceTracking" icon={Activity} />;
}
