"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Cookie, X } from "lucide-react"

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem("cookie-consent")
        if (!consent) {
            // Show banner after a short delay
            const timer = setTimeout(() => setIsVisible(true), 1000)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem("cookie-consent", "accepted")
        setIsVisible(false)
    }

    const handleDecline = () => {
        localStorage.setItem("cookie-consent", "declined")
        setIsVisible(false)
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-[400px]"
                >
                    <Card className="p-4 shadow-xl border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Cookie className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 space-y-2">
                                <h3 className="font-semibold leading-none tracking-tight">Sütiket használunk 🍪</h3>
                                <p className="text-sm text-muted-foreground">
                                    A legjobb felhasználói élmény érdekében sütiket használunk.
                                    Elfogadod a használatukat?
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 -mt-1 -mr-1"
                                onClick={handleDecline}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex gap-2 mt-4 justify-end">
                            <Button variant="outline" size="sm" onClick={handleDecline}>
                                Csak a szükségesek
                            </Button>
                            <Button size="sm" onClick={handleAccept}>
                                Mindet elfogadom
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
