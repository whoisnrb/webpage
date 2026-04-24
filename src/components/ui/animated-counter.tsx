"use client"

import { useEffect, useRef, useState } from "react"
import { useInView, motion, useMotionValue, useTransform, animate } from "framer-motion"

interface AnimatedCounterProps {
    value: string // e.g. "5+", "50+", "100%", "24h"
    className?: string
    duration?: number
}

export function AnimatedCounter({ value, className, duration = 2 }: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })
    const [displayValue, setDisplayValue] = useState("0")

    // Parse the numeric part and suffix
    const match = value.match(/^(\d+)(.*)$/)
    const numericPart = match ? parseInt(match[1], 10) : 0
    const suffix = match ? match[2] : value

    useEffect(() => {
        if (!isInView) return

        const controls = animate(0, numericPart, {
            duration,
            ease: [0.16, 1, 0.3, 1], // custom easeOutExpo
            onUpdate(latest) {
                setDisplayValue(Math.round(latest).toString())
            },
        })

        return () => controls.stop()
    }, [isInView, numericPart, duration])

    return (
        <motion.span
            ref={ref}
            className={className}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {isInView ? `${displayValue}${suffix}` : `0${suffix}`}
        </motion.span>
    )
}
