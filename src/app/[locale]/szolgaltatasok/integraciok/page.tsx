import { IntegraciokContent } from "@/components/services/integraciok-content";
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Services.Integrations' });

    return {
        title: t('title') + " | BacklineIT",
        description: t('description'),
        keywords: ["API integráció", "rendszerösszekötés", "automatizáció", "adatbázis szinkronizáció", "webhook"],
        alternates: {
            canonical: `https://backlineit.hu/${locale === 'hu' ? '' : 'en'}/szolgaltatasok/integraciok`,
            languages: {
                'hu': 'https://backlineit.hu/szolgaltatasok/integraciok',
                'en': 'https://backlineit.hu/en/services/integrations',
            },
        },
    };
}

export default function IntegraciokPage() {
    return <IntegraciokContent />;
}
