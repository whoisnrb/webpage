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
        <section className="py-24 bg-background overflow-hidden">
            <div className="container mx-auto px-4">
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
                        className="text-4xl md:text-6xl font-black mb-6 tracking-tight"
                    >
                        {t('title')}
                    </motion.h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                </div>

                <div
                    ref={containerRef}
                    className="relative max-w-5xl mx-auto aspect-[16/9] rounded-3xl overflow-hidden border border-primary/10 shadow-2xl cursor-ew-resize group select-none"
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
                        />
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
                            className="w-full h-full object-cover grayscale"
                        />
                        <div className="absolute top-6 left-6">
                            <div className="bg-background/80 text-foreground backdrop-blur-md px-4 py-2 rounded-xl font-black text-sm shadow-xl border border-primary/10">
                                {t('before')}
                            </div>
                        </div>
                    </div>

                    {/* Slider Line / Handle */}
                    <div
                        className="absolute inset-y-0 z-20 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)] cursor-ew-resize"
                        style={{ left: `${sliderPos}%` }}
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-primary/20 transition-transform group-active:scale-90">
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

                        {/* Hint for interaction */}
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-white whitespace-nowrap">
                            Húzd a csúszkát
                        </div>
                    </div>

                    {/* Decorative Overlay for interaction hint */}
                    <AnimatePresence>
                        {sliderPos === 50 && !isResizing && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none bg-black/5"
                            >
                                <div className="flex flex-col items-center gap-4 animate-pulse">
                                    <MousePointer2 className="h-10 w-10 text-white drop-shadow-lg rotate-12" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Benefits / Metrics below */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                    {[
                        { label: "Betöltési idő", value: "8.4s", newValue: "1.2s", color: "text-green-500" },
                        { label: "Konverzió", value: "1.2%", newValue: "4.8%", color: "text-blue-500" },
                        { label: "Google SEO", value: "42/100", newValue: "98/100", color: "text-yellow-500" },
                        { label: "Visszafordulás", value: "72%", newValue: "24%", color: "text-purple-500" },
                    ].map((m, i) => (
                        <div key={i} className="bg-card/50 backdrop-blur-sm border border-primary/5 p-6 rounded-2xl text-center">
                            <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2 font-bold">{m.label}</div>
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-sm line-through opacity-40">{m.value}</span>
                                <ArrowRight size={12} className="opacity-40" />
                                <span className={cn("text-2xl font-black", m.color)}>{m.newValue}</span>
                            </div>
                        </div>
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
