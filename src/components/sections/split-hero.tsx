"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"

export function SplitHero() {
    const t = useTranslations("SplitHero")
    const [hoverSide, setHoverSide] = React.useState<'left' | 'right' | null>(null)

    return (
        <section className="relative w-full h-[600px] md:h-[80vh] min-h-[500px] overflow-hidden bg-background border-b border-primary/10">
            <div className="flex flex-col md:flex-row h-full w-full">

                {/* Left Side: Services */}
                <div
                    className={cn(
                        "relative flex-1 flex flex-col items-center justify-center p-8 md:p-12 transition-all duration-700 ease-in-out overflow-hidden group",
                        hoverSide === 'left' ? 'md:flex-[1.5]' : hoverSide === 'right' ? 'md:flex-[0.5]' : 'md:flex-1'
                    )}
                    onMouseEnter={() => setHoverSide('left')}
                    onMouseLeave={() => setHoverSide(null)}
                >
                    {/* Background Visual for Left */}
                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500" />
                    <div className="absolute -right-24 top-0 bottom-0 w-48 bg-gradient-to-r from-transparent to-background/50 z-10 hidden md:block" />

                    <motion.div
                        className="relative z-20 text-center flex flex-col items-center max-w-md"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                            <Code className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight group-hover:text-primary transition-colors">
                            {t('left_title')}
                        </h2>
                        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                            {t('left_desc')}
                        </p>
                        <Button asChild size="lg" className="h-12 px-8 text-lg rounded-full group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
                            <Link href="/szolgaltatasok">
                                {t('left_cta')} <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>

                {/* Divider Icon (Mobile hidden, Desktop Center) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 hidden md:flex items-center justify-center pointer-events-none">
                    <div className="bg-background border border-primary/20 rounded-full p-4 shadow-2xl">
                        <span className="text-sm font-bold text-muted-foreground">{t('middle_text')}</span>
                    </div>
                </div>

                {/* Right Side: Products */}
                <div
                    className={cn(
                        "relative flex-1 flex flex-col items-center justify-center p-8 md:p-12 transition-all duration-700 ease-in-out overflow-hidden group",
                        hoverSide === 'right' ? 'md:flex-[1.5]' : hoverSide === 'left' ? 'md:flex-[0.5]' : 'md:flex-1'
                    )}
                    onMouseEnter={() => setHoverSide('right')}
                    onMouseLeave={() => setHoverSide(null)}
                >
                    {/* Background Visual for Right */}
                    <div className="absolute inset-0 bg-accent/5 group-hover:bg-accent/10 transition-colors duration-500" />
                    <div className="absolute -left-24 top-0 bottom-0 w-48 bg-gradient-to-l from-transparent to-background/50 z-10 hidden md:block" />

                    <motion.div
                        className="relative z-20 text-center flex flex-col items-center max-w-md"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="h-16 w-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-6 shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform duration-500">
                            <ShoppingCart className="h-8 w-8 text-accent" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight group-hover:text-accent transition-colors">
                            {t('right_title')}
                        </h2>
                        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                            {t('right_desc')}
                        </p>
                        <Button asChild size="lg" variant="secondary" className="h-12 px-8 text-lg rounded-full group-hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all">
                            <Link href="/termekek">
                                {t('right_cta')} <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
