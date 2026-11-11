import { Metadata } from "next"
import { routing } from "@/i18n/routing"
import { buildServiceMetadata, renderServiceDetailPage } from "@/lib/service-page-helper"

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params
    return buildServiceMetadata(locale, "DocumentOCR", "/szolgaltatasok/ai-dokumentum-es-szamlafeldolgozo-ocr")
}

export default async function DocumentOCRPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    return renderServiceDetailPage(locale, "ai-dokumentum-es-szamlafeldolgozo-ocr", "DocumentOCR")
}
