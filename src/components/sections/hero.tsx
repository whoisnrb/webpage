"use client"

import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Zap, Clock, ShieldCheck, Sparkles, MousePointer2 } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { CodeWindow } from "@/components/ui/code-window"
import { useTranslations } from "next-intl"
import { Typewriter } from "@/components/ui/typewriter"
import { GlowButton } from "@/components/ui/glow-button"
import { FluidBackground } from "@/components/ui/fluid-background"
import { SplineScene } from "@/components/ui/spline-scene"
import { useRef } from "react"

export function Hero() {
    const t = useTranslations('Hero')
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollY } = useScroll()

    // Parallax effects
    const y1 = useTransform(scrollY, [0, 500], [0, 200])
    const y2 = useTransform(scrollY, [0, 500], [0, -150])
    const rotate = useTransform(scrollY, [0, 500], [0, 15])
    const opacity = useTransform(scrollY, [0, 300], [1, 0])

    return (
        <section ref={containerRef} className="relative min-h-[90vh] flex items-center overflow-hidden pt-24 pb-20 md:pt-32 md:pb-32">
            {/* Ultra-luxury background elements */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[150px] opacity-10 animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px] opacity-10" />
            </div>

            <div className="container relative mx-auto px-4 z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Text Content */}
                    <div className="flex-1 text-center lg:text-left relative">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.3em] mb-8 bg-white/[0.03] backdrop-blur-2xl shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                {t('badge')}
                            </div>

                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-8 leading-[0.9] perspective-1000">
                                {t('title_1')} <br />
                                <span className="relative inline-block mt-2">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-primary to-purple-500 animate-gradient-x bg-[length:200%_auto] drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                                        <Typewriter
                                            text={[t('title_2'), t('typewriter_1'), t('typewriter_2'), t('typewriter_3')]}
                                            speed={0.1}
                                            waitTime={2500}
                                            cursorClassName="text-primary ml-1"
                                        />
                                    </span>
                                    {/* Abstract decorative underline */}
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ delay: 1, duration: 1.5 }}
                                        className="absolute -bottom-2 left-0 h-1.5 bg-gradient-to-r from-primary/50 to-transparent rounded-full"
                                    />
                                </span>
                            </h1>

                            <p className="text-xl md:text-2xl text-white/40 mb-12 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
                                {t('description')}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 mb-12">
                                <Link href="/szolgaltatasok">
                                    <GlowButton size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-tighter text-xl h-16 px-10 shadow-[0_20px_40px_-10px_rgba(6,182,212,0.5)] transition-all duration-500 hover:scale-105 border border-white/20">
                                        {t('cta_primary')}
                                    </GlowButton>
                                </Link>
                                <Button variant="ghost" size="lg" className="w-full sm:w-auto h-16 px-8 text-white/60 hover:text-white transition-all duration-500 hover:bg-white/5 border border-white/5 font-bold text-lg rounded-2xl group" asChild>
                                    <Link href="/kapcsolat">
                                        {t('cta_secondary')}
                                        <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-500 group-hover:translate-x-2 text-primary" />
                                    </Link>
                                </Button>
                            </div>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-10 gap-y-4">
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="flex items-center gap-2.5 group">
                                    <div className="h-8 w-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                                        <Zap className="h-4 w-4 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                                    </div>
                                    <span className="text-sm font-black text-white/30 group-hover:text-white/50 transition-colors uppercase tracking-widest">{t('feature_1')}</span>
                                </motion.div>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="flex items-center gap-2.5 group">
                                    <div className="h-8 w-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                                        <ShieldCheck className="h-4 w-4 text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                    </div>
                                    <span className="text-sm font-black text-white/30 group-hover:text-white/50 transition-colors uppercase tracking-widest">{t('feature_2')}</span>
                                </motion.div>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="flex items-center gap-2.5 group">
                                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                        <Clock className="h-4 w-4 text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                    </div>
                                    <span className="text-sm font-black text-white/30 group-hover:text-white/50 transition-colors uppercase tracking-widest">{t('feature_3')}</span>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Hero Visual / Illustration - The "Multi-Million Dollar" Widget */}
                    <div className="flex-1 w-full max-w-xl lg:max-w-none h-[600px] relative perspective-1000">
                        <motion.div
                            style={{ y: y1 }}
                            className="relative w-full h-full"
                        >
                            {/* Ambient Glow */}
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[120%] w-[120%] bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-60 pointer-events-none" />

                            {/* Main Floating Container */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                className="relative w-full h-full flex items-center justify-center"
                            >
                                {/* The Central Engine Widget */}
                                <div className="relative group/widget">
                                    <div className="absolute inset-0 bg-primary/20 blur-[100px] group-hover:bg-primary/40 transition-all duration-1000 rounded-full" />

                                    <div className="relative z-10 w-[400px] md:w-[500px] bg-white/[0.01] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-700 hover:border-primary/40 hover:scale-[1.02]">
                                        {/* Internal Grid Pattern */}
                                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:30px_30px]" />

                                        {/* Widget Header */}
                                        <div className="flex items-center justify-between mb-10 relative z-10">
                                            <div className="flex items-center gap-3">
                                                <div className="flex gap-2">
                                                    <div className="h-3 w-3 rounded-full bg-red-500/50" />
                                                    <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                                                    <div className="h-3 w-3 rounded-full bg-green-500/50" />
                                                </div>
                                                <div className="h-px w-20 bg-white/10" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[10px] font-black font-mono text-emerald-400 uppercase tracking-widest">Core.Active</span>
                                            </div>
                                        </div>

                                        {/* Metric Slots */}
                                        <div className="grid grid-cols-2 gap-6 relative z-10 mb-10">
                                            <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center">
                                                        <Zap className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div className="text-[10px] font-black text-white/30 uppercase">Uptime</div>
                                                </div>
                                                <div className="text-3xl font-black text-white tracking-tighter">99.98%</div>
                                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: "99.98%" }} transition={{ duration: 2, delay: 0.5 }} className="h-full bg-primary" />
                                                </div>
                                            </div>
                                            <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="h-10 w-10 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                                                        <Sparkles className="h-5 w-5 text-purple-500" />
                                                    </div>
                                                    <div className="text-[10px] font-black text-white/30 uppercase">Efficiency</div>
                                                </div>
                                                <div className="text-3xl font-black text-white tracking-tighter">14.2x</div>
                                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ duration: 2, delay: 0.7 }} className="h-full bg-purple-500" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Status Bar */}
                                        <div className="relative z-10 p-5 bg-gradient-to-r from-emerald-500/10 to-primary/10 rounded-2xl border border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="flex -space-x-3">
                                                    {[1, 2, 3].map(i => (
                                                        <div key={i} className="h-8 w-8 rounded-full border-2 border-[#020617] bg-white/10 flex items-center justify-center overflow-hidden">
                                                            <div className="h-full w-full bg-primary/20 animate-pulse" />
                                                        </div>
                                                    ))}
                                                </div>
                                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{t('visual.systems_operational')}</span>
                                            </div>
                                            <div className="font-mono text-[10px] text-primary font-bold">AZ-01:STABLE</div>
                                        </div>
                                    </div>

                                    {/* Floating Decorative Orbs / Elements */}
                                    <motion.div
                                        style={{ y: y2, rotate }}
                                        className="absolute -top-12 -right-12 z-20 bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-2xl flex items-center gap-4 group-hover:border-primary/50 transition-colors duration-700"
                                    >
                                        <div className="h-12 w-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                                            <ShieldCheck className="h-6 w-6 text-cyan-400" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-none mb-1">Security</div>
                                            <div className="text-lg font-black text-cyan-400 tracking-tighter leading-none">PROTECTED</div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ x: 100, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 1, duration: 1 }}
                                        className="absolute -bottom-10 -left-16 z-20 bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="space-y-1">
                                                <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div animate={{ x: ['100%', '-100%'] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="h-full w-1/2 bg-primary/50" />
                                                </div>
                                                <div className="h-1.5 w-16 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="h-full w-1/3 bg-purple-500/50" />
                                                </div>
                                            </div>
                                            <div className="text-2xl font-black text-white tracking-widest">A.I.</div>
                                        </div>
                                    </motion.div>

                                    {/* Cursor interaction hint */}
                                    <motion.div
                                        animate={{ y: [0, 5, 0], opacity: [0.3, 0.6, 0.3] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
                                    >
                                        <MousePointer2 className="h-4 w-4 text-white/20" />
                                        <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Interactive Core</span>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    )
}
