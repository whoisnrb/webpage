import { Metadata } from "next"
import { routing } from "@/i18n/routing"
import { buildServiceMetadata, renderServiceDetailPage } from "@/lib/service-page-helper"

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params
    return buildServiceMetadata(locale, "SecurityMonitoringNIS2", "/szolgaltatasok/folyamatos-kibervedelmi-monitoring-nis2")
}

export default async function SecurityMonitoringNIS2Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    return renderServiceDetailPage(locale, "folyamatos-kibervedelmi-monitoring-nis2", "SecurityMonitoringNIS2")
}
