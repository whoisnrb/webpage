import { ManagedITContent } from "@/components/services/managed-it-content";
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Metadata } from 'next';

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export const revalidate = 86400; // 24 hours

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Services.ManagedIT' });

    return {
        title: t('title') + " | BacklineIT",
        description: t('description'),
        keywords: t('keywords').split(','),
        alternates: {
            canonical: `https://backlineit.hu${locale === 'hu' ? '' : '/en'}${locale === 'hu' ? '/szolgaltatasok/havidijas-rendszergazda' : '/services/managed-it-services'}`,
            languages: {
                'hu': 'https://backlineit.hu/szolgaltatasok/havidijas-rendszergazda',
                'en': 'https://backlineit.hu/en/services/managed-it-services',
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
        }
    };
}

export default async function Page() {
    return <ManagedITContent />;
}
