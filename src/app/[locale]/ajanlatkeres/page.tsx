import QuoteRequestPageClient from "./page-client"
import { routing } from '@/i18n/routing'
import { getSeoMetadata } from "@/lib/seo"
import type { Metadata } from "next"

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === 'en' ? 'Request a Quote' : 'Ajánlatkérés',
        description: locale === 'en' 
            ? 'Request a custom quote for your development, automation, or maintenance projects.' 
            : 'Kérj egyedi árajánlatot fejlesztési, automatizálási vagy üzemeltetési projektjeidre.',
        ...getSeoMetadata(locale, '/ajanlatkeres')
    };
}

export default function Page() {
    return <QuoteRequestPageClient />
}
