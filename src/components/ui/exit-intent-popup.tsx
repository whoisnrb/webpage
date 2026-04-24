"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles, ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

export function ExitIntentPopup() {
    const [isVisible, setIsVisible] = useState(false)
    const [isDismissed, setIsDismissed] = useState(false)
    const t = useTranslations("ExitIntent")

    useEffect(() => {
        // Check if user has already dismissed the popup or recently seen it
        const dismissedAt = localStorage.getItem("exit-intent-dismissed")
        if (dismissedAt) {
            const lastDismissed = new Date(dismissedAt).getTime()
            const now = new Date().getTime()
            const sevenDays = 7 * 24 * 60 * 60 * 1000
            if (now - lastDismissed < sevenDays) {
                setIsDismissed(true)
                return
            }
        }

        const handleMouseLeave = (e: MouseEvent) => {
            // Trigger if mouse leaves the top of the window
            if (e.clientY <= 0 && !isDismissed && !isVisible) {
                setIsVisible(true)
            }
        }

        document.addEventListener("mouseleave", handleMouseLeave)
        return () => document.removeEventListener("mouseleave", handleMouseLeave)
    }, [isDismissed, isVisible])

    const handleDismiss = () => {
        setIsVisible(false)
        setIsDismissed(true)
        localStorage.setItem("exit-intent-dismissed", new Date().toISOString())
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
                    >
                        {/* Decorative background */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none" />

                        <button
                            onClick={handleDismiss}
                            className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors z-10"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <div className="p-8 md:p-12 text-center relative z-10">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-[10px] font-black tracking-[0.4em] uppercase rounded-full bg-primary/10 text-primary border border-primary/20"
                            >
                                <Sparkles className="h-3 w-3" />
                                {t("subtitle")}
                            </motion.div>

                            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-6 leading-tight">
                                {t("title")}
                            </h2>

                            <p className="text-lg text-white/60 mb-10 max-w-lg mx-auto font-medium leading-relaxed">
                                {t("description")}
                            </p>

                            <div className="flex flex-col gap-4 max-w-sm mx-auto">
                                <Link href="/demo" onClick={handleDismiss}>
                                    <Button size="lg" className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-tight shadow-lg shadow-primary/20 group">
                                        {t("cta")}
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <button
                                    onClick={handleDismiss}
                                    className="text-white/30 hover:text-white/60 text-xs font-bold uppercase tracking-widest transition-colors py-2"
                                >
                                    {t("no_thanks")}
                                </button>
                            </div>

                            <div className="mt-12 flex items-center justify-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                                <div className="flex items-center gap-2">
                                    <Zap className="h-4 w-4" />
                                    <span>Valódi eredmények</span>
                                </div>
                                <div className="hidden sm:flex items-center gap-2">
                                    <Sparkles className="h-4 w-4" />
                                    <span>Szakértői csapat</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
