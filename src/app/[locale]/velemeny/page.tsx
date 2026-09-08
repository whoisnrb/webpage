import { AiFeedbackChat } from "@/components/ai-feedback-chat"
import { ReviewSection } from "@/components/sections/review-section"

import { getApprovedReviews } from "@/app/actions/feedback"
import { getTranslations } from "next-intl/server"
import { Metadata } from "next"
import { getSeoMetadata } from "@/lib/seo"
import { routing } from "@/i18n/routing"

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Feedback" });

    return {
        title: `${t("title")} | BacklineIT`,
        description: t("description"),
        ...getSeoMetadata(locale, '/velemeny'),
        openGraph: {
            title: `${t("title")} | BacklineIT`,
            description: t("description"),
        },
    };
}

export default async function FeedbackPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: "Feedback" })
    const reviews = await getApprovedReviews()

    return (
        <div className="min-h-screen pt-24 pb-16 bg-muted/5">
            <div className="container px-4 mx-auto">


                <div className="text-center mb-12 mt-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-400">
                        {t("title")}
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        {t("description")}
                    </p>
                </div>

                <div className="flex flex-col items-center gap-16">
                    <div className="w-full max-w-md">
                        <AiFeedbackChat />
                    </div>

                    <ReviewSection reviews={reviews || []} />
                </div>
            </div>
        </div>
    )
}
