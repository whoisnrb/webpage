import { getSeoMetadata } from "@/lib/seo"
import { GenericServiceContent } from "@/components/services/generic-service-content"
import { getTranslations } from "next-intl/server"
import { trackEvent } from "@/lib/analytics"
import { getServiceBySlug } from "@/app/actions/service"
import type { Metadata } from "next"

export async function buildServiceMetadata(
    locale: string,
    serviceKey: string,
    slugPath: string
): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: `Services.${serviceKey}` })
    return {
        title: t("title"),
        description: t("description"),
        keywords: t("keywords").split(",").map((s) => s.trim()),
        ...getSeoMetadata(locale, slugPath),
        openGraph: {
            title: `${t("title")} | BacklineIT`,
            description: t("description"),
        },
    }
}

export async function renderServiceDetailPage(
    locale: string,
    slug: string,
    serviceKey: string
) {
    trackEvent("view_service", "engagement", {
        service: slug,
        locale,
    })

    const service = await getServiceBySlug(slug)
    const dbPackages = service?.packages ?? null

    return <GenericServiceContent serviceKey={serviceKey} dbPackages={dbPackages} />
}
