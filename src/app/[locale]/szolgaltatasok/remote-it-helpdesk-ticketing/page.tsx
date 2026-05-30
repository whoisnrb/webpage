import { GenericServiceContent } from "@/components/services/generic-service-content";
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Metadata } from 'next';
import { Headphones } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export const revalidate = 86400; // 24 hours

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Services.RemoteHelpdesk' });

    return {
        title: t('title') + " | BacklineIT",
        description: t('description'),
        keywords: t('keywords').split(','),
        alternates: {
            canonical: `https://backlineit.hu${locale === 'hu' ? '' : '/en'}${locale === 'hu' ? '/szolgaltatasok/remote-it-helpdesk-ticketing' : '/services/remote-it-helpdesk-ticketing'}`,
            languages: {
                'hu': 'https://backlineit.hu/szolgaltatasok/remote-it-helpdesk-ticketing',
                'en': 'https://backlineit.hu/en/services/remote-it-helpdesk-ticketing',
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
        }
    };
}

export default async function RemoteHelpdeskPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    // Track service view
    trackEvent("view_service", "engagement", {
        service: "remote-it-helpdesk-ticketing",
        locale
    });

    return <GenericServiceContent serviceKey="RemoteHelpdesk" />;
}
