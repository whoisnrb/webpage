"use client"

import { motion } from "framer-motion"

export function FadeInStagger({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
    return (
        <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ delayChildren: delay, staggerChildren: 0.1 }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export function FadeInStaggerItem({ children, className }: { children: React.ReactNode, className?: string }) {
    const variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }
    return (
        <motion.div variants={variants} className={className}>
            {children}
        </motion.div>
    )
}

export function FadeIn({ children, delay = 0, className, direction = "up" }: {
    children: React.ReactNode,
    delay?: number,
    className?: string,
    direction?: "up" | "down" | "left" | "right" | "none"
}) {
    const initialY = direction === "up" ? 20 : direction === "down" ? -20 : 0
    const initialX = direction === "left" ? 20 : direction === "right" ? -20 : 0

    return (
        <motion.div
            initial={{ opacity: 0, y: initialY, x: initialX }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export function SlideUp({ children, delay = 0, className }: { children: React.ReactNode, delay?: number, className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export function ScaleIn({ children, delay = 0, className }: { children: React.ReactNode, delay?: number, className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
