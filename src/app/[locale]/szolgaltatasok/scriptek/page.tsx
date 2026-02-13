import { ScriptsClient } from "@/components/templates/service-pages/scripts";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

import { routing } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Services.Scripts" });

    return {
        title: t("title") + " | BacklineIT",
        description: t("description"),
        keywords: ["python script", "automatizáció", "adatbányászat", "web scraping", "egyedi fejlesztés"],
        alternates: {
            canonical: `https://backlineit.hu/${locale === 'hu' ? '' : 'en'}/szolgaltatasok/scriptek`,
            languages: {
                'hu': 'https://backlineit.hu/szolgaltatasok/scriptek',
                'en': 'https://backlineit.hu/en/services/scripts',
            },
        },
        openGraph: {
            title: t("title"),
            description: t("description"),
        }
    };
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default function ScriptekPage() {
    return <ScriptsClient />;
}
