"use client"

import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Zap, Clock, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"
import { CodeWindow } from "@/components/ui/code-window"
import { useTranslations } from "next-intl"
import { Typewriter } from "@/components/ui/typewriter"
import { GlowButton } from "@/components/ui/glow-button"
import { FluidBackground } from "@/components/ui/fluid-background"
import { SplineScene } from "@/components/ui/spline-scene"

export function Hero() {
    const t = useTranslations('Hero')

    return (
        <section className="relative overflow-hidden bg-background pt-16 md:pt-20 lg:pt-32 pb-16 md:pb-24">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <FluidBackground />
            </div>

            <div className="container relative mx-auto px-4 z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

                    {/* Text Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium text-secondary mb-6 bg-secondary/10 backdrop-blur-sm border-secondary/20 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                                <span className="flex h-2 w-2 rounded-full bg-secondary mr-2 animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.8)]"></span>
                                {t('badge')}
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight drop-shadow-sm">
                                {t('title_1')} <br className="hidden lg:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-primary to-purple-500 animate-gradient-x bg-[length:200%_auto]">
                                    <Typewriter
                                        text={[t('title_2'), t('typewriter_1'), t('typewriter_2'), t('typewriter_3')]}
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
                                    <GlowButton size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white text-lg h-12 px-8 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-300 hover:scale-105 border border-primary/50">
                                        {t('cta_primary')}
                                    </GlowButton>
                                </Link>
                                <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 border-2 border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:scale-105" asChild>
                                    <Link href="/kapcsolat">
                                        {t('cta_secondary')} <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                                    <span>{t('feature_1')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                    <span>{t('feature_2')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                    <span>{t('feature_3')}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Hero Visual / Illustration */}
                    <div className="flex-1 w-full max-w-lg lg:max-w-none h-[500px] relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative w-full h-full"
                        >
                            {/* Glowing Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 rounded-3xl blur-3xl opacity-60 animate-pulse"></div>

                            {/* Main Container */}
                            <div className="relative w-full h-full flex items-center justify-center">

                                {/* Central Dashboard Card */}
                                <motion.div
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
                                    className="relative z-10 w-80 h-80 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-6"
                                    whileHover={{ scale: 1.02, rotateY: 2 }}
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]"></div>
                                            <div className="h-3 w-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.6)]"></div>
                                            <div className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
                                        </div>
                                        <div className="text-xs font-mono text-muted-foreground">automation.live</div>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                                    <Zap className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium">{t('visual.active_tasks')}</div>
                                                    <div className="text-xs text-muted-foreground">{t('visual.running')}</div>
                                                </div>
                                            </div>
                                            <div className="text-2xl font-bold text-primary">247</div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                                                <div className="text-xs text-muted-foreground mb-1">{t('visual.success_rate')}</div>
                                                <div className="text-xl font-bold text-green-500">99.8%</div>
                                            </div>
                                            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                                <div className="text-xs text-muted-foreground mb-1">{t('visual.response_time')}</div>
                                                <div className="text-xl font-bold text-blue-500">12ms</div>
                                            </div>
                                        </div>

                                        {/* Progress Bars */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span>{t('visual.cpu_usage')}</span>
                                                <span className="text-muted-foreground">45%</span>
                                            </div>
                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-gradient-to-r from-primary to-secondary"
                                                    initial={{ width: "0%" }}
                                                    animate={{ width: "45%" }}
                                                    transition={{ delay: 0.8, duration: 1.2 }}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between text-xs">
                                                <span>{t('visual.memory')}</span>
                                                <span className="text-muted-foreground">67%</span>
                                            </div>
                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-gradient-to-r from-accent to-primary"
                                                    initial={{ width: "0%" }}
                                                    animate={{ width: "67%" }}
                                                    transition={{ delay: 1, duration: 1.2 }}
                                                />
                                            </div>
                                        </div>

                                        {/* Status Indicator */}
                                        <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                                            <span className="text-xs font-medium text-green-500">{t('visual.systems_operational')}</span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Floating Card 1 - Top Left */}
                                <motion.div
                                    initial={{ x: -100, y: -50, opacity: 0 }}
                                    animate={{
                                        x: 0,
                                        y: [0, -10, 0],
                                        opacity: 1
                                    }}
                                    transition={{
                                        x: { delay: 0.6, duration: 0.8, type: "spring" },
                                        opacity: { delay: 0.6, duration: 0.8 },
                                        y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }
                                    }}
                                    className="absolute top-0 left-0 z-20 bg-card/80 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                            <CheckCircle2 className="h-5 w-5 text-purple-500" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-muted-foreground">{t('visual.deployment')}</div>
                                            <div className="text-sm font-bold text-purple-500">{t('visual.completed')}</div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Floating Card 2 - Bottom Right */}
                                <motion.div
                                    initial={{ x: 100, y: 50, opacity: 0 }}
                                    animate={{
                                        x: 0,
                                        y: [0, 10, 0],
                                        opacity: 1
                                    }}
                                    transition={{
                                        x: { delay: 0.8, duration: 0.8, type: "spring" },
                                        opacity: { delay: 0.8, duration: 0.8 },
                                        y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }
                                    }}
                                    className="absolute bottom-0 right-0 z-20 bg-card/80 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                            <ShieldCheck className="h-5 w-5 text-cyan-500" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-muted-foreground">{t('visual.security')}</div>
                                            <div className="text-sm font-bold text-cyan-500">{t('visual.protected')}</div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Floating Card 3 - Top Right */}
                                <motion.div
                                    initial={{ x: 100, y: -50, opacity: 0 }}
                                    animate={{
                                        x: [0, 10, 0],
                                        y: [0, -5, 0],
                                        opacity: 1
                                    }}
                                    transition={{
                                        x: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 },
                                        y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 },
                                        opacity: { delay: 1, duration: 0.8 }
                                    }}
                                    className="absolute top-20 right-0 z-20 bg-card/80 backdrop-blur-xl border border-white/20 rounded-xl p-3 shadow-xl"
                                >
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-yellow-500">24/7</div>
                                        <div className="text-xs text-muted-foreground">{t('visual.monitoring')}</div>
                                    </div>
                                </motion.div>

                                {/* Orbiting Dots */}
                                <motion.div
                                    className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                >
                                    <div className="absolute top-0 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_15px_rgba(6,182,212,0.8)]"></div>
                                    <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-secondary shadow-[0_0_10px_rgba(139,92,246,0.8)]"></div>
                                    <div className="absolute top-1/2 right-0 h-2 w-2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    )
}
