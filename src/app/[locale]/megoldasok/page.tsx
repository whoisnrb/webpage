import { getLocalizedProducts } from "@/app/actions/product"
import { getTranslations } from "next-intl/server"
import { ProductBrowser } from "./product-browser"
import { FadeIn } from "@/components/ui/motion-wrapper"
import { routing } from '@/i18n/routing'

export const revalidate = 3600

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
            <section className="relative overflow-hidden py-20 border-b border-border/40">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

                <div className="container mx-auto px-4 text-center relative z-10">
                    <FadeIn>
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            {t('badge')}
                        </div>

                        {/* Title */}
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                            <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                                {t('title_1')}{" "}
                            </span>
                            <span className="bg-gradient-to-r from-primary via-cyan-400 to-primary/70 bg-clip-text text-transparent">
                                {t('title_2')}
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            {t('subtitle')}
                        </p>

                        {/* Decorative line */}
                        <div className="mt-8 flex items-center justify-center gap-3">
                            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/50" />
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/50" />
                        </div>
                    </FadeIn>
                </div>
            </section>

            <ProductBrowser initialProducts={products} />
        </>
    )
}

