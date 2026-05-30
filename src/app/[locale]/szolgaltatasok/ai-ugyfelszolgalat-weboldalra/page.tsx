import { GenericServiceContent } from "@/components/services/generic-service-content";
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Metadata } from 'next';
import { Cpu } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export const revalidate = 86400; // 24 hours

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Services.AICustomerSupport' });

    return {
        title: t('title') + " | BacklineIT",
        description: t('description'),
        keywords: t('keywords').split(','),
        alternates: {
            canonical: `https://backlineit.hu${locale === 'hu' ? '' : '/en'}${locale === 'hu' ? '/szolgaltatasok/ai-ugyfelszolgalat-weboldalra' : '/services/ai-customer-support-chatbot'}`,
            languages: {
                'hu': 'https://backlineit.hu/szolgaltatasok/ai-ugyfelszolgalat-weboldalra',
                'en': 'https://backlineit.hu/en/services/ai-customer-support-chatbot',
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
        }
    };
}

export default async function AICustomerSupportPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    // Track service view
    trackEvent("view_service", "engagement", {
        service: "ai-ugyfelszolgalat-weboldalra",
        locale
    });

    return <GenericServiceContent serviceKey="AICustomerSupport" />;
}
