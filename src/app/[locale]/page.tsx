"use client"

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { Link } from "@/i18n/routing"
import { SplitHero } from "@/components/sections/split-hero"
import { ServicesPreview } from "@/components/sections/services-preview"


import { TrustedBy } from "@/components/sections/trusted-by"
import { WhyUs } from "@/components/sections/why-us"
import { Process } from "@/components/sections/process"
import { FadeIn, SlideUp, ScaleIn } from "@/components/ui/motion-wrapper"
import { SpotlightCard } from "@/components/ui/spotlight-card"

export default function Home() {
    const t = useTranslations('HomePage');
    const tST = useTranslations('ServiceTemplate');

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">


                {/* Hero Section */}
                <SplitHero />

                {/* Services Grid */}
                <ServicesPreview />


                {/* Trusted Technologies & Partners */}
                <TrustedBy />

                {/* Why Choose Us */}
                <WhyUs />

                {/* Process */}
                <Process />

                {/* CTA Section */}
                <section className="relative py-24 md:py-32 bg-transparent">
                    <div className="container mx-auto px-4 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative max-w-6xl mx-auto overflow-hidden rounded-[3rem] border border-white/10 bg-white/[0.02] backdrop-blur-3xl p-12 md:p-20 text-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] group"
                        >
                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all duration-1000 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                            <div className="relative z-10">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-[10px] font-black tracking-[0.4em] uppercase rounded-full bg-white/[0.03] text-primary border border-white/10"
                                >
                                    <Sparkles className="h-3 w-3 animate-pulse" />
                                    {tST('free_consultation_available')}
                                </motion.div>

                                <h2 className="text-4xl md:text-7xl font-black mb-8 text-white tracking-tighter leading-none">
                                    {t('cta_footer_title')}
                                </h2>
                                <p className="text-xl md:text-2xl text-white/40 mb-12 max-w-3xl mx-auto font-medium leading-relaxed group-hover:text-white/60 transition-colors duration-700">
                                    {t('cta_footer_desc')}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                    <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-xl font-black uppercase tracking-tight bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-[0_20px_40px_-10px_rgba(6,182,212,0.4)] transition-all duration-500 hover:scale-105 active:scale-95 group/btn" asChild>
                                        <Link href="/demo">
                                            {t('cta_consultation')}
                                            <ArrowRight className="ml-3 h-6 w-6 group-hover/btn:translate-x-2 transition-transform" />
                                        </Link>
                                    </Button>

                                    <Button variant="ghost" size="lg" className="w-full sm:w-auto h-16 px-10 text-xl font-black uppercase tracking-tight text-white/60 hover:text-white hover:bg-white/5 border border-white/10 rounded-2xl transition-all duration-500" asChild>
                                        <Link href="/arak">
                                            {t('cta_prices')}
                                        </Link>
                                    </Button>
                                </div>

                                {/* Trust indicators */}
                                <div className="mt-16 flex flex-wrap justify-center gap-10 grayscale opacity-40">
                                    <div className="flex items-center gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{tST('no_hidden_costs')}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{tST('satisfaction_guarantee')}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{tST('fast_response')}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>
        </div>
    )
}

