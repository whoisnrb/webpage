"use client"

import { motion } from "framer-motion"
import { Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"

interface ServicesHeroProps {
    badge: string
    title: string
    titleHighlight: string
    description: string
    ctaQuote: string
    ctaServices: string
}

export function ServicesHero({ badge, title, titleHighlight, description, ctaQuote, ctaServices }: ServicesHeroProps) {
    return (
        <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-32 bg-transparent">
            <div className="container relative mx-auto px-4 z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-[10px] font-black tracking-[0.4em] uppercase rounded-full bg-white/[0.03] text-primary border border-white/10 backdrop-blur-xl"
                >
                    <Sparkles className="h-3 w-3" />
                    {badge}
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-8xl font-black tracking-tighter mb-8 text-white leading-[0.85]"
                >
                    {title}<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-primary to-purple-500 animate-gradient-x bg-[length:200%_auto]">
                        {titleHighlight}
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl md:text-2xl text-white/40 max-w-3xl mx-auto mb-12 font-medium leading-relaxed"
                >
                    {description}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap gap-6 justify-center"
                >
                    <Link href="/kapcsolat" className="w-full sm:w-auto">
                        <Button size="lg" className="w-full h-16 px-10 text-xl font-black uppercase tracking-tight bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-[0_20px_40px_-10px_rgba(6,182,212,0.4)] transition-all duration-500 hover:scale-105 group">
                            {ctaQuote}
                            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                        </Button>
                    </Link>
                    <Link href="#szolgaltatasok" className="w-full sm:w-auto">
                        <Button size="lg" variant="ghost" className="w-full h-16 px-10 text-xl font-black uppercase tracking-tight text-white/60 hover:text-white hover:bg-white/5 border border-white/10 rounded-2xl transition-all duration-500">
                            {ctaServices}
                        </Button>
                    </Link>
                </motion.div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-50" />
        </section>
    )
}
