"use client"

import { useEffect, useRef, useState } from "react"
import { useInView, motion, animate } from "framer-motion"

interface AnimatedCounterProps {
    value: string // e.g. "5+", "50+", "100%", "24h", "5.0"
    className?: string
    duration?: number
}

export function AnimatedCounter({ value, className, duration = 2 }: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })
    const [isMounted, setIsMounted] = useState(false)
    const [displayValue, setDisplayValue] = useState("0")

    // Parse the numeric part and suffix (also handle decimal numbers like 5.0)
    const match = value.match(/^([\d.]+)(.*)$/)
    const numericPart = match ? parseFloat(match[1]) : 0
    const suffix = match ? match[2] : value
    const isDecimal = value.includes('.')

    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 0)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (!isMounted || !isInView) return

        const controls = animate(0, numericPart, {
            duration,
            ease: [0.16, 1, 0.3, 1], // custom easeOutExpo
            onUpdate(latest) {
                if (isDecimal) {
                    setDisplayValue(latest.toFixed(1))
                } else {
                    setDisplayValue(Math.round(latest).toString())
                }
            },
        })

        return () => controls.stop()
    }, [isInView, numericPart, duration, isMounted, isDecimal])

    return (
        <motion.span
            ref={ref}
            className={className}
            initial={isMounted ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
            animate={isMounted && isInView ? { opacity: 1, scale: 1 } : isMounted ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {!isMounted 
                ? value 
                : (isInView ? `${displayValue}${suffix}` : `0${suffix}`)}
        </motion.span>
    )
}
