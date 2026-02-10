import { getLocalizedProducts } from "@/app/actions/product"
import { ConsultationFormClient } from "./consultation-form-client"
import { getTranslations } from "next-intl/server"
import { FadeIn } from "@/components/ui/motion-wrapper"

interface PageProps {
    params: Promise<{ locale: string }>
}

export default async function ConsultationPage({ params }: PageProps) {
    const { locale } = await params
    const products = await getLocalizedProducts(locale)
    const t = await getTranslations("QuoteRequest")

    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <FadeIn>
                <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
                <p className="text-muted-foreground mb-8 text-lg">
                    {t('subtitle')}
                </p>

                <div className="bg-background shadow-sm border rounded-xl p-6 md:p-8">
                    <ConsultationFormClient products={products} />
                </div>
            </FadeIn>
        </div>
    )
}
