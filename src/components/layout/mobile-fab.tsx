"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Phone, Calendar } from "lucide-react"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

export function MobileFab() {
    const t = useTranslations("Navigation")
    const [scrolled, setScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 300)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <AnimatePresence>
            {scrolled && (
                <motion.div
                    initial={{ scale: 0, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0, y: 20 }}
                    className="fixed bottom-6 right-6 z-[90] md:hidden"
                >
                    <Button
                        size="icon"
                        className="h-14 w-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)] border border-white/20 hover:scale-110 active:scale-95 transition-all text-white"
                        asChild
                    >
                        <Link href="/demo">
                            <Calendar className="h-6 w-6" />
                            <span className="sr-only">{t("free_consultation")}</span>
                        </Link>
                    </Button>
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute inset-0 rounded-full bg-cyan-400 -z-10"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    )
}
