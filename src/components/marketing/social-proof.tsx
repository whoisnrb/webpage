"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, CheckCircle2 } from "lucide-react"
import { getRecentPurchases, type RecentPurchase } from "@/app/actions/social-proof"
import { useTranslations } from "next-intl"

export function SocialProof() {
    const t = useTranslations('SocialProof')
    const [purchases, setPurchases] = React.useState<RecentPurchase[]>([])
    const [visible, setVisible] = React.useState(false)
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [isLoaded, setIsLoaded] = React.useState(false)

    React.useEffect(() => {
        const fetchPurchases = async () => {
            const data = await getRecentPurchases()
            setPurchases(data)
            setIsLoaded(true)
        }
        fetchPurchases()
    }, [])

    React.useEffect(() => {
        if (!isLoaded || purchases.length === 0) return

        // Initial delay
        const initialTimeout = setTimeout(() => {
            setVisible(true)
        }, 5000)

        return () => clearTimeout(initialTimeout)
    }, [isLoaded, purchases.length])

    React.useEffect(() => {
        if (!isLoaded || purchases.length === 0) return

        let hideTimeout: NodeJS.Timeout
        let showTimeout: NodeJS.Timeout

        if (visible) {
            // Hide after 6 seconds
            hideTimeout = setTimeout(() => {
                setVisible(false)
            }, 6000)
        } else {
            // Show next after random delay (15-30s)
            const delay = Math.floor(Math.random() * 15000) + 15000
            showTimeout = setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % purchases.length)
                setVisible(true)
            }, delay)
        }

        return () => {
            clearTimeout(hideTimeout)
            clearTimeout(showTimeout)
        }
    }, [visible, isLoaded, purchases.length])

    if (!isLoaded || purchases.length === 0) return null

    const purchase = purchases[currentIndex]

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, x: -20 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, y: 20, x: -20 }}
                    className="fixed bottom-4 left-4 z-50 max-w-sm"
                >
                    <div className="glass rounded-lg p-4 shadow-lg border border-primary/20 flex items-center gap-4 bg-background/80 backdrop-blur-md">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <ShoppingBag className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                {purchase.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {t('purchased')} <span className="text-primary font-medium">{purchase.product}</span>
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                                <span className="text-[10px] text-muted-foreground">{purchase.time}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
