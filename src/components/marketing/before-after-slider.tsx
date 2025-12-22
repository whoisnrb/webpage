"use client"

import * as React from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { MousePointer2, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function BeforeAfterSlider() {
    const t = useTranslations("BeforeAfter")
    const [sliderPos, setSliderPos] = React.useState(50)
    const [isResizing, setIsResizing] = React.useState(false)

    const containerRef = React.useRef<HTMLDivElement>(null)

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
        const percent = (x / rect.width) * 100
        setSliderPos(percent)
    }

    const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX)
    const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX)

    return (
        <section className="py-24 relative overflow-hidden bg-transparent">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6"
                    >
                        <Sparkles size={14} />
                        {t('badge')}
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/80 to-foreground/50"
                    >
                        {t('title')}
                    </motion.h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                </div>

                <div
                    ref={containerRef}
                    className="relative max-w-5xl mx-auto aspect-[16/9] rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] cursor-ew-resize group select-none bg-card/20 backdrop-blur-sm"
                    onMouseMove={onMouseMove}
                    onTouchMove={onTouchMove}
                    onMouseDown={() => setIsResizing(true)}
                    onMouseUp={() => setIsResizing(false)}
                    onMouseLeave={() => setIsResizing(false)}
                >
                    {/* After Image (Modern) - Background */}
                    <div className="absolute inset-0">
                        <img
                            src="/images/after-website.png"
                            alt="After Redesign"
                            className="w-full h-full object-cover"
                            loading="eager"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute top-6 right-6">
                            <div className="bg-primary/90 text-primary-foreground backdrop-blur-md px-4 py-2 rounded-xl font-black text-sm shadow-xl border border-white/20">
                                {t('after')}
                            </div>
                        </div>
                    </div>

                    {/* Before Image (Old) - Clipalble */}
                    <div
                        className="absolute inset-0 z-10"
                        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                    >
                        <img
                            src="/images/before-website.png"
                            alt="Before Redesign"
                            className="w-full h-full object-cover grayscale brightness-75"
                            loading="eager"
                        />
                        <div className="absolute top-6 left-6">
                            <div className="bg-black/60 text-white backdrop-blur-md px-4 py-2 rounded-xl font-black text-sm shadow-xl border border-white/10">
                                {t('before')}
                            </div>
                        </div>
                    </div>

                    {/* Slider Line / Handle */}
                    <div
                        className="absolute inset-y-0 z-20 w-[2px] bg-white/50 backdrop-blur-sm shadow-[0_0_20px_rgba(255,255,255,0.5)] cursor-ew-resize"
                        style={{ left: `${sliderPos}%` }}
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary),0.5)] border-4 border-primary/20 transition-transform group-active:scale-90 z-30">
                            <div className="flex gap-1">
                                <motion.div
                                    animate={{ x: [-2, 2, -2] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="w-1.5 h-1.5 rounded-full bg-primary"
                                />
                                <motion.div
                                    animate={{ x: [2, -2, 2] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="w-1.5 h-1.5 rounded-full bg-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Decorative Overlay for interaction hint */}
                    <AnimatePresence>
                        {sliderPos === 50 && !isResizing && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none bg-black/20"
                            >
                                <div className="flex flex-col items-center gap-4">
                                    <motion.div
                                        animate={{ x: [-20, 20, -20] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <MousePointer2 className="h-12 w-12 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                    </motion.div>
                                    <span className="text-white font-bold tracking-widest text-sm uppercase bg-black/40 px-4 py-1 rounded-full backdrop-blur-sm">Slide to Compare</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Benefits / Metrics below */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    {[
                        { label: "Betöltési idő", value: "8.4s", newValue: "1.2s", color: "text-cyan-400" },
                        { label: "Konverzió", value: "1.2%", newValue: "4.8%", color: "text-purple-400" },
                        { label: "Google SEO", value: "42/100", newValue: "98/100", color: "text-emerald-400" },
                        { label: "Visszafordulás", value: "72%", newValue: "24%", color: "text-orange-400" },
                    ].map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-card/30 backdrop-blur-xl border border-white/5 p-6 rounded-2xl text-center shadow-xl hover:bg-card/50 transition-colors group"
                        >
                            <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-3 font-black opacity-60">{m.label}</div>
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-xs line-through opacity-30 font-medium">{m.value}</span>
                                <ArrowRight size={14} className="opacity-20 group-hover:translate-x-1 transition-transform" />
                                <span className={cn("text-2xl font-black tracking-tight", m.color)}>{m.newValue}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function ArrowRight({ size, className }: { size: number, className?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}
