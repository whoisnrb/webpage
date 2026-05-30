import { GenericServiceContent } from "@/components/services/generic-service-content";
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Metadata } from 'next';
import { Puzzle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export const revalidate = 86400; // 24 hours

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Services.CRMAutomation' });

    return {
        title: t('title') + " | BacklineIT",
        description: t('description'),
        keywords: t('keywords').split(','),
        alternates: {
            canonical: `https://backlineit.hu${locale === 'hu' ? '' : '/en'}${locale === 'hu' ? '/szolgaltatasok/crm-lead-automatizacio' : '/services/crm-lead-automation'}`,
            languages: {
                'hu': 'https://backlineit.hu/szolgaltatasok/crm-lead-automatizacio',
                'en': 'https://backlineit.hu/en/services/crm-lead-automation',
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
        }
    };
}

export default async function CRMAutomationPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    // Track service view
    trackEvent("view_service", "engagement", {
        service: "crm-lead-automatizacio",
        locale
    });

    return <GenericServiceContent serviceKey="CRMAutomation" />;
}
