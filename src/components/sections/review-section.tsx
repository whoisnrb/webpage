"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Star, Quote, User, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations, useLocale } from "next-intl"
import { cn } from "@/lib/utils"

type Review = {
    id: string
    name: string
    content: string
    rating: number
    locale?: string
    createdAt: string | Date
}

const INITIAL_VISIBLE = 9
const LOAD_STEP = 9

export function ReviewSection({ reviews }: { reviews: Review[] }) {
    const t = useTranslations("Feedback")
    const locale = useLocale()
    const isEn = locale === "en"

    const [langFilter, setLangFilter] = useState<"all" | "hu" | "en">("all")
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)

    const goodReviewsCount = reviews.filter(r => r.rating >= 4).length
    const recommendationPct = reviews.length > 0
        ? Math.round((goodReviewsCount / reviews.length) * 100)
        : 100
    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : "5.0"

    const hasLocaleTag = reviews.some(r => r.locale === "hu" || r.locale === "en")

    // Prioritize current locale reviews first when showing "all"
    const filteredReviews = useMemo(() => {
        const list = langFilter === "all"
            ? [...reviews].sort((a, b) => {
                const aMatch = a.locale === locale ? 1 : 0
                const bMatch = b.locale === locale ? 1 : 0
                return bMatch - aMatch
            })
            : reviews.filter(r => r.locale === langFilter)
        return list
    }, [reviews, langFilter, locale])

    const displayedReviews = filteredReviews.slice(0, visibleCount)
    const remaining = filteredReviews.length - displayedReviews.length

    if (reviews.length === 0) {
        return (
            <div className="w-full max-w-4xl mx-auto mt-12 text-center p-12 bg-[#06101c]/80 rounded-3xl border border-dashed border-white/15">
                <Star className="h-12 w-12 text-cyan-400/30 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">{t("reviews_title")}</h2>
                <p className="text-white/55">{t("reviews_empty_state") || "Soon, your review could be here too!"}</p>
            </div>
        )
    }

    return (
        <div id="reviews-wall" className="w-full max-w-6xl mx-auto mt-14 md:mt-20 pt-10 border-t border-white/10 scroll-mt-24">
            {/* Header with Stats */}
            <div className="flex flex-col items-center text-center mb-10 space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider border border-cyan-500/25">
                    <Star className="h-3.5 w-3.5 fill-cyan-400" />
                    <span>{t("title_badge") || "Wall of Love"}</span>
                </div>

                <div className="space-y-2">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">{t("reviews_title")}</h2>
                    <p className="text-white/55 text-sm md:text-base max-w-2xl mx-auto">{t("reviews_desc")}</p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3 md:gap-6 pt-2 w-full max-w-xl">
                    <div className="flex flex-col items-center p-4 rounded-2xl bg-[#06101c]/80 border border-white/10">
                        <div className="text-2xl md:text-3xl font-black text-cyan-400 mb-0.5">{reviews.length}</div>
                        <div className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider font-semibold">{t("stats.total_reviews") || "Total Reviews"}</div>
                    </div>

                    <div className="flex flex-col items-center p-4 rounded-2xl bg-[#06101c]/80 border border-white/10">
                        <div className="text-2xl md:text-3xl font-black text-cyan-400 mb-0.5 flex items-center gap-1">
                            {averageRating}
                            <Star className="h-4 w-4 fill-cyan-400 text-cyan-400" />
                        </div>
                        <div className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider font-semibold">{t("stats.avg_rating")}</div>
                    </div>

                    <div className="flex flex-col items-center p-4 rounded-2xl bg-[#06101c]/80 border border-white/10">
                        <div className="text-2xl md:text-3xl font-black text-emerald-400 mb-0.5">{recommendationPct}%</div>
                        <div className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider font-semibold">
                            {isEn ? "Positive" : "Elégedettség"}
                        </div>
                    </div>
                </div>

                {/* Language Filter Pills */}
                {hasLocaleTag && (
                    <div className="inline-flex p-1 rounded-full bg-white/[0.04] border border-white/10">
                        {[
                            { id: "all" as const, label: isEn ? `All (${reviews.length})` : `Összes (${reviews.length})` },
                            { id: "hu" as const, label: "Magyar" },
                            { id: "en" as const, label: "English" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => { setLangFilter(tab.id); setVisibleCount(INITIAL_VISIBLE) }}
                                className={cn(
                                    "px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer",
                                    langFilter === tab.id
                                        ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold"
                                        : "text-white/60 hover:text-white"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Reviews Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayedReviews.map((review, index) => (
                    <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: (index % 3) * 0.06, duration: 0.35 }}
                        className="h-full"
                    >
                        <div className="h-full flex flex-col justify-between rounded-2xl bg-[#06101c]/80 backdrop-blur-xl border border-white/10 hover:border-cyan-500/35 transition-all duration-300 p-6 group">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < review.rating ? "fill-cyan-400 text-cyan-400" : "text-white/15"}`}
                                            />
                                        ))}
                                    </div>
                                    <Quote className="h-5 w-5 text-cyan-400/20 group-hover:text-cyan-400/40 transition-colors" />
                                </div>

                                <p className="text-white/80 text-sm leading-relaxed mb-6 italic">
                                    "{review.content}"
                                </p>
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                                <div className="h-10 w-10 rounded-full bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center shrink-0">
                                    <User className="h-4 w-4 text-cyan-400" />
                                </div>
                                <div className="text-left min-w-0">
                                    <div className="font-bold text-sm text-white truncate">{review.name}</div>
                                    <div className="text-[11px] text-white/45">
                                        {new Date(review.createdAt).toLocaleDateString(isEn ? 'en-US' : 'hu-HU', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {remaining > 0 && (
                <div className="mt-10 text-center">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setVisibleCount(v => v + LOAD_STEP)}
                        className="rounded-full px-6 h-10 border-white/15 bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-bold"
                    >
                        <ChevronDown className="mr-2 h-4 w-4 text-cyan-400" />
                        {isEn
                            ? `Load More Reviews (+${remaining})`
                            : `További vélemények betöltése (+${remaining})`}
                    </Button>
                </div>
            )}
        </div>
    )
}
