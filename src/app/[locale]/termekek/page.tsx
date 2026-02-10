import { getLocalizedProducts } from "@/app/actions/product"
import { getTranslations } from "next-intl/server"
import { ProductBrowser } from "./product-browser"
import { FadeIn } from "@/components/ui/motion-wrapper"

interface PageProps {
    params: Promise<{ locale: string }>
}

export default async function ProductsPage({ params }: PageProps) {
    const { locale } = await params
    const products = await getLocalizedProducts(locale)
    const t = await getTranslations("Products")

    return (
        <>
            <section className="bg-muted/30 py-16 border-b">
                <div className="container mx-auto px-4 text-center">
                    <FadeIn>
                        <h1 className="text-4xl font-bold tracking-tight mb-4">{t('title')}</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            {t('subtitle')}
                        </p>
                    </FadeIn>
                </div>
            </section>

            <ProductBrowser initialProducts={products} />
        </>
    )
}
