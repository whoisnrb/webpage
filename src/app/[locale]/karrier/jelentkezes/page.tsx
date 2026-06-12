import SpontanJelentkezesPageClient from "./page-client"
import { routing } from '@/i18n/routing'
import { getSeoMetadata } from "@/lib/seo"
import type { Metadata } from "next"

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === 'en' ? 'Apply' : 'Jelentkezés',
        description: locale === 'en' 
            ? 'Submit your application for one of our open positions.' 
            : 'Küldd el jelentkezésedet nyitott pozícióink egyikére.',
        ...getSeoMetadata(locale, '/karrier/jelentkezes')
    };
}

export default function Page() {
    return <SpontanJelentkezesPageClient />
}
