"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star, Quote, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslations } from "next-intl"

type Review = {
    id: string
    name: string
    content: string
    rating: number
    createdAt: Date
}

export function ReviewSection({ reviews }: { reviews: Review[] }) {
    const t = useTranslations("Feedback")

    const goodReviewsCount = reviews.filter(r => r.rating >= 4).length
    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 5.0

    if (reviews.length === 0) {
        return (
            <div className="w-full max-w-4xl mx-auto mt-20 text-center p-12 bg-muted/20 rounded-3xl border border-dashed border-primary/20">
                <Star className="h-12 w-12 text-primary/20 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">{t("reviews_title")}</h2>
                <p className="text-muted-foreground">{t("reviews_empty_state") || "Soon, your review could be here too!"}</p>
            </div>
        )
    }

    return (
        <div className="w-full max-w-7xl mx-auto mt-24 px-4 pb-20">
            {/* Header with Stats */}
            <div className="flex flex-col items-center text-center mb-16 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                    <Star className="h-4 w-4 fill-primary" />
                    <span>{t("title_badge") || "Wall of Love"}</span>
                </div>

                <div className="space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{t("reviews_title")}</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("reviews_desc")}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-12 pt-8">
                    <div className="flex flex-col items-center p-6 rounded-2xl bg-background border border-primary/5 shadow-sm">
                        <div className="text-4xl font-bold text-primary mb-1">{goodReviewsCount}+</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">{t("stats.happy_clients")}</div>
                    </div>

                    <div className="flex flex-col items-center p-6 rounded-2xl bg-background border border-primary/5 shadow-sm">
                        <div className="text-4xl font-bold text-primary mb-1 flex items-center gap-1">
                            {averageRating}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">{t("stats.avg_rating")}</div>
                    </div>

                    <div className="hidden md:flex flex-col items-center p-6 rounded-2xl bg-background border border-primary/5 shadow-sm">
                        <div className="text-4xl font-bold text-primary mb-1">{reviews.length}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">{t("stats.total_reviews") || "Total Reviews"}</div>
                    </div>
                </div>
            </div>

            {/* Reviews Grid */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {reviews.map((review, index) => (
                    <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index % 3 * 0.1, duration: 0.5 }}
                        className="break-inside-avoid"
                    >
                        <Card className="bg-background/60 backdrop-blur-md border-primary/10 hover:border-primary/40 transition-all duration-300 shadow-lg hover:shadow-primary/5 group">
                            <CardContent className="p-8">
                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < review.rating ? "fill-primary text-primary" : "text-muted/30"}`}
                                        />
                                    ))}
                                </div>

                                <div className="relative">
                                    <Quote className="absolute -top-4 -left-4 h-10 w-10 text-primary/5 -z-10" />
                                    <p className="text-foreground/80 text-base leading-relaxed mb-8 italic">
                                        "{review.content}"
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 pt-6 border-t border-primary/5">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10 group-hover:scale-110 transition-transform duration-300">
                                        <User className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-base text-foreground">{review.name}</div>
                                        <div className="text-xs text-muted-foreground/80 flex items-center gap-2">
                                            <span className="h-1 w-1 rounded-full bg-primary/30" />
                                            {new Date(review.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
