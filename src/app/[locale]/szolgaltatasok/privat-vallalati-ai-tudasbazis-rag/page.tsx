import { Metadata } from "next"
import { routing } from "@/i18n/routing"
import { buildServiceMetadata, renderServiceDetailPage } from "@/lib/service-page-helper"

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }))
}

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params
    return buildServiceMetadata(locale, "EnterpriseRAG", "/szolgaltatasok/privat-vallalati-ai-tudasbazis-rag")
}

export default async function EnterpriseRAGPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    return renderServiceDetailPage(locale, "privat-vallalati-ai-tudasbazis-rag", "EnterpriseRAG")
}
