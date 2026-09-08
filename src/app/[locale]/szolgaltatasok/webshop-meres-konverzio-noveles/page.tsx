import { getSeoMetadata } from "@/lib/seo";
import { GenericServiceContent } from "@/components/services/generic-service-content";
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Metadata } from 'next';
import { trackEvent } from "@/lib/analytics";
import { getServiceBySlug } from "@/app/actions/service";

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
        ...getSeoMetadata(locale, "/szolgaltatasok/webshop-meres-konverzio-noveles"),
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

    const service = await getServiceBySlug("webshop-meres-konverzio-noveles");
    const dbPackages = service?.packages ?? null;

    return <GenericServiceContent serviceKey="EcommerceTracking" dbPackages={dbPackages} />;
}
