"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon, Sparkles, ArrowUpRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { FadeIn, SlideUp } from "@/components/ui/motion-wrapper"

interface UseCase {
    title: string
    description: string
    icon: LucideIcon
    example: string
    roi: string
}

interface UseCasesProps {
    title?: string
    description?: string
    cases: UseCase[]
}

export function UseCases({
    title,
    description,
    cases
}: UseCasesProps) {
    const t = useTranslations("Common")

    const displayTitle = title || t("use_cases_title")
    const displayDescription = description || t("use_cases_description")

    return (
        <section className="py-24 md:py-32 bg-slate-950 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-500/5 blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <FadeIn>
                        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-[10px] font-black tracking-[0.4em] uppercase rounded-full bg-white/[0.03] text-primary border border-white/10 backdrop-blur-xl">
                            <Sparkles className="h-3 w-3" />
                            {t("use_cases_badge")}
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
                            {displayTitle}
                        </h2>
                        <p className="text-xl text-white/40 max-w-2xl mx-auto font-medium">
                            {displayDescription}
                        </p>
                    </FadeIn>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {cases.map((useCase, index) => {
                        const Icon = useCase.icon
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group relative"
                            >
                                {/* Glow on hover */}
                                <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 via-purple-500/20 to-transparent rounded-[32px] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

                                <Card className="relative h-full bg-white/[0.02] border-white/10 backdrop-blur-3xl rounded-[32px] overflow-hidden transition-all duration-500 group-hover:bg-white/[0.04] group-hover:border-white/20">
                                    <CardHeader className="p-8">
                                        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 border border-primary/20 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                            <Icon className="h-8 w-8" />
                                        </div>
                                        <CardTitle className="text-2xl font-black text-white mb-4 group-hover:text-primary transition-colors">
                                            {useCase.title}
                                        </CardTitle>
                                        <CardDescription className="text-lg text-white/40 font-medium leading-relaxed">
                                            {useCase.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-8 pb-8 pt-0 space-y-6">
                                        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:border-white/10 transition-colors">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-3">{t("example")}</p>
                                            <p className="text-white/60 font-medium italic leading-relaxed">{useCase.example}</p>
                                        </div>

                                        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                                <span className="text-sm font-black uppercase tracking-wider text-emerald-400">{useCase.roi}</span>
                                            </div>
                                            <ArrowUpRight className="h-5 w-5 text-white/20 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
