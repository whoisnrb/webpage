import { ITAuditContent } from "@/components/services/it-audit-content";
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Metadata } from 'next';

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export const revalidate = 86400; // 24 hours

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Services.SMB_IT_Audit' });

    return {
        title: t('title') + " | BacklineIT",
        description: t('description'),
        keywords: t('keywords').split(','),
        alternates: {
            canonical: `https://backlineit.hu/${locale === 'hu' ? '' : 'en'}/szolgaltatasok/kkv-it-audit`,
            languages: {
                'hu': 'https://backlineit.hu/szolgaltatasok/kkv-it-audit',
                'en': 'https://backlineit.hu/en/services/smb-it-audit',
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
        }
    };
}

export default async function Page() {
    return <ITAuditContent />;
}
