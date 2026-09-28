import { getSeoMetadata } from "@/lib/seo";
import { WebDevelopmentClient } from "@/components/templates/service-pages/web-development";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { ServiceJsonLd } from "@/components/seo/service-jsonld";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";

import { routing } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Services.WebDev" });

    return {
        title: t("title"),
        description: t("description"),
        keywords: ["egyedi weboldal", "webshop készítés", "Next.js fejlesztés", "React fejlesztő", "modern webdesign"],
        ...getSeoMetadata(locale, "/szolgaltatasok/webfejlesztes"),
        openGraph: {
            title: `${t("title")} | BacklineIT`,
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

    return (
        <>
            <ServiceJsonLd
                name="Egyedi webfejlesztés és webáruház készítés"
                description="Modern, gyors és konverzió-fókuszált weboldalak és webshopok fejlesztése Next.js, React és WooCommerce technológiákkal."
                serviceType="Webfejlesztés és webáruház készítés"
                url="/szolgaltatasok/webfejlesztes"
            />
            <BreadcrumbJsonLd
                items={[
                    { name: locale === 'en' ? 'Home' : 'Kezdőlap', href: locale === 'en' ? '/en' : '/' },
                    { name: locale === 'en' ? 'Services' : 'Szolgáltatások', href: locale === 'en' ? '/en/services' : '/szolgaltatasok' },
                    { name: locale === 'en' ? 'Web Development' : 'Webfejlesztés', href: locale === 'en' ? '/en/services/web-development' : '/szolgaltatasok/webfejlesztes' },
                ]}
            />
            <WebDevelopmentClient />
        </>
    );
}
