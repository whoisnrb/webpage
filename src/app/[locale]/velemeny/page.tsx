import { AiFeedbackChat } from "@/components/ai-feedback-chat"
import { ReviewSection } from "@/components/sections/review-section"
import { getApprovedReviews } from "@/app/actions/feedback"
import { getTranslations } from "next-intl/server"
import { Metadata } from "next"
import { getSeoMetadata } from "@/lib/seo"
import { routing } from "@/i18n/routing"
import { Star, ShieldCheck, ArrowDown } from "lucide-react"

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Feedback" });

    return {
        title: t("title"),
        description: t("description"),
        ...getSeoMetadata(locale, '/velemeny'),
        openGraph: {
            title: t("title"),
            description: t("description"),
        },
    };
}

export default async function FeedbackPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const isEn = locale === "en"
    const t = await getTranslations({ locale, namespace: "Feedback" })
    const reviews = await getApprovedReviews()

    const total = reviews?.length || 0
    const avg = total > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1)
        : "5.0"

    return (
        <div className="min-h-screen bg-[#030712] text-white pt-24 md:pt-28 pb-16 px-4 relative overflow-hidden">
            {/* Ambient Glows matching site design */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />

            <div className="container mx-auto max-w-6xl relative z-10">
                {/* Two-column above-the-fold layout: Info & Proof left, Review Form right */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                    <div className="lg:col-span-5 space-y-5 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                            <Star className="h-3.5 w-3.5 fill-cyan-400" />
                            <span>{t("title_badge") || "Feedback"}</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
                            {t("title")}
                        </h1>

                        <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
                            {t("description")}
                        </p>

                        {/* Quick Social Proof Strip */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10">
                                <Star className="h-4 w-4 fill-cyan-400 text-cyan-400" />
                                <span className="text-sm font-black text-white">{avg} / 5.0</span>
                                <span className="text-xs text-white/50">({total} {isEn ? "reviews" : "vélemény"})</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-white/55">
                                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                <span>{isEn ? "Verified client reviews" : "Ellenőrzött ügyfélvélemények"}</span>
                            </div>
                        </div>

                        {total > 0 && (
                            <div className="pt-1">
                                <a
                                    href="#reviews-wall"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                                >
                                    <span>{isEn ? "Read client reviews below" : "Ügyfélvélemények olvasása lent"}</span>
                                    <ArrowDown className="h-3.5 w-3.5" />
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-7">
                        <AiFeedbackChat />
                    </div>
                </div>

                {/* Reviews Wall */}
                <ReviewSection reviews={reviews || []} />
            </div>
        </div>
    )
}
