import { Suspense } from "react"
import { getLocalizedProducts } from "@/app/actions/product"
import { getTranslations } from "next-intl/server"
import { ProductBrowser } from "./product-browser"
import { FadeIn } from "@/components/ui/motion-wrapper"
import { routing } from '@/i18n/routing'

export const revalidate = 3600

import { getSeoMetadata } from "@/lib/seo"
import type { Metadata } from "next"
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params;
    const title = locale === 'en' ? 'IT Solutions & Digital Products' : 'IT Megoldások & Digitális Termékek';
    const description = locale === 'en' 
        ? 'Discover our ready-made tools, scripts, and custom IT solutions for businesses.' 
        : 'Fedezd fel kész eszközeinket, scriptjeinket és egyedi IT megoldásainkat vállalkozások részére.';

    return {
        title,
        description,
        ...getSeoMetadata(locale, '/megoldasok'),
        openGraph: {
            title: `${title} | BacklineIT`,
            description,
            url: locale === 'en' ? 'https://backlineit.com/solutions' : 'https://backlineit.hu/megoldasok',
            siteName: 'BacklineIT',
            locale: locale === 'hu' ? 'hu_HU' : 'en_US',
            type: 'website',
        }
    };
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

interface PageProps {
    params: Promise<{ locale: string }>
}

export default async function ProductsPage({ params }: PageProps) {
    const { locale } = await params
    const products = await getLocalizedProducts(locale)
    const t = await getTranslations("Products")

    return (
        <>
            <BreadcrumbJsonLd
                items={[
                    { name: locale === 'en' ? 'Home' : 'Kezdőlap', href: locale === 'en' ? '/en' : '/' },
                    { name: locale === 'en' ? 'Solutions' : 'Megoldások', href: locale === 'en' ? '/en/solutions' : '/megoldasok' },
                ]}
            />
            <section className="relative overflow-hidden bg-[#030712] pt-24 md:pt-28 pb-8 border-b border-white/5">
                {/* Background gradient */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
                <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

                <div className="container mx-auto px-4 text-center relative z-10">
                    <FadeIn>
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-500/25 bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                            </span>
                            {t('badge')}
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-3">
                            <span className="text-white">
                                {t('title_1')}{" "}
                            </span>
                            <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                                {t('title_2')}
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-sm md:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
                            {t('subtitle')}
                        </p>
                    </FadeIn>
                </div>
            </section>

            <Suspense fallback={<div className="min-h-[400px]" />}>
                <ProductBrowser initialProducts={products} />
            </Suspense>
        </>
    )
}

