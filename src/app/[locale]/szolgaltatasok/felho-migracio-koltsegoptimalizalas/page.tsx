import { GenericServiceContent } from "@/components/services/generic-service-content";
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Metadata } from 'next';
import { trackEvent } from "@/lib/analytics";
import { getServiceBySlug } from "@/app/actions/service";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Services.CloudMigration' });

    return {
        title: t('title') + " | BacklineIT",
        description: t('description'),
        keywords: t('keywords').split(','),
        alternates: {
            canonical: `https://backlineit.hu${locale === 'hu' ? '' : '/en'}${locale === 'hu' ? '/szolgaltatasok/felho-migracio-koltsegoptimalizalas' : '/services/cloud-migration-cost-optimization'}`,
            languages: {
                'hu': 'https://backlineit.hu/szolgaltatasok/felho-migracio-koltsegoptimalizalas',
                'en': 'https://backlineit.hu/en/services/cloud-migration-cost-optimization',
            },
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
        }
    };
}

export default async function CloudMigrationPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    trackEvent("view_service", "engagement", {
        service: "felho-migracio-koltsegoptimalizalas",
        locale
    });

    const service = await getServiceBySlug("felho-migracio-koltsegoptimalizalas");
    const dbPackages = service?.packages ?? null;

    return <GenericServiceContent serviceKey="CloudMigration" dbPackages={dbPackages} />;
}
