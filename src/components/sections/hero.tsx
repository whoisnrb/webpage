"use client"

import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Zap, Clock, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"
import { CodeWindow } from "@/components/ui/code-window"
import { useTranslations } from "next-intl"
import { Typewriter } from "@/components/ui/typewriter"
import { GlowButton } from "@/components/ui/glow-button"

export function Hero() {
    const t = useTranslations('Hero')

    return (
        <section className="relative overflow-hidden bg-background pt-16 md:pt-20 lg:pt-32 pb-16 md:pb-24">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-20 right-0 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            </div>

            <div className="container relative mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

                    {/* Text Content */}
                    <div className="flex-1 text-center lg:text-left z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium text-secondary mb-6 bg-secondary/10 backdrop-blur-sm">
                                <span className="flex h-2 w-2 rounded-full bg-secondary mr-2 animate-pulse"></span>
                                {t('badge')}
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
                                {t('title_1')} <br className="hidden lg:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                    <Typewriter
                                        text={[t('title_2'), "Webfejlesztés", "Automatizáció", "Scriptek"]}
                                        speed={0.1}
                                        waitTime={2000}
                                        cursorClassName="text-primary ml-1"
                                    />
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                                {t('description')}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                                <Link href="/szolgaltatasok">
                                    <GlowButton size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white text-lg h-12 px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:scale-105">
                                        {t('cta_primary')}
                                    </GlowButton>
                                </Link>
                                <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 border-2 hover:bg-accent/50 transition-all duration-300 hover:scale-105" asChild>
                                    <Link href="/kapcsolat">
                                        {t('cta_secondary')} <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-yellow-500" />
                                    <span>{t('feature_1')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-green-500" />
                                    <span>{t('feature_2')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-blue-500" />
                                    <span>{t('feature_3')}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Hero Visual / Illustration */}
                    <div className="flex-1 w-full max-w-lg lg:max-w-none perspective-1000">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
                            className="relative"
                            whileHover={{ rotateY: 5, rotateX: -5, transition: { duration: 0.3 } }}
                        >
                            {/* Decorative glow behind the code window */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-xl blur-xl opacity-30 animate-pulse"></div>

                            <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl backdrop-blur-sm bg-black/40">
                                <CodeWindow />
                            </div>

                            {/* Floating Badge */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.5, duration: 0.5 }}
                                className="absolute -bottom-6 -right-6 bg-card/80 border p-4 rounded-lg shadow-xl hidden md:block backdrop-blur-md"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-green-100/20 flex items-center justify-center">
                                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-muted-foreground">{t('stat_label')}</div>
                                        <div className="text-lg font-bold text-foreground">{t('stat_value')}</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    )
}
