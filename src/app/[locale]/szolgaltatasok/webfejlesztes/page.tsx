import { WebDevelopmentClient } from "@/components/templates/service-pages/web-development";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

import { routing } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Services.WebDev" });

    return {
        title: t("title") + " | BacklineIT",
        description: t("description"),
        keywords: ["egyedi weboldal", "webshop készítés", "Next.js fejlesztés", "React fejlesztő", "modern webdesign"],
        alternates: {
            canonical: `https://backlineit.hu/${locale === 'hu' ? '' : 'en'}/szolgaltatasok/webfejlesztes`,
            languages: {
                'hu': 'https://backlineit.hu/szolgaltatasok/webfejlesztes',
                'en': 'https://backlineit.hu/en/services/web-development',
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

import { trackEvent } from "@/lib/analytics";

export const revalidate = 86400; // 24 hours

export default async function WebfejlesztesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    // Track service view
    trackEvent("view_service", "engagement", {
        service: "webfejlesztes",
        locale
    });

    return <WebDevelopmentClient />;
}
