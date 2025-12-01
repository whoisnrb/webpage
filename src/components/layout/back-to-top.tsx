"use client"

import * as React from "react"
import { ArrowUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

export function BackToTop() {
    const [show, setShow] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShow(true)
            } else {
                setShow(false)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-8 right-8 z-50"
                >
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={scrollToTop}
                        className="h-12 w-12 rounded-full border-primary/50 bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)] transition-all duration-300"
                        aria-label="Vissza a tetejére"
                    >
                        <ArrowUp className="h-6 w-6" />
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
