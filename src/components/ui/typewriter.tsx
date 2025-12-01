"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"

interface TypewriterProps {
    text: string | string[]
    speed?: number
    waitTime?: number
    className?: string
    cursorClassName?: string
}

export function Typewriter({
    text,
    speed = 0.05,
    waitTime = 2000,
    className,
    cursorClassName,
}: TypewriterProps) {
    const [displayedText, setDisplayedText] = useState("")
    const [isWaiting, setIsWaiting] = useState(false)
    const [textIndex, setTextIndex] = useState(0)

    const texts = Array.isArray(text) ? text : [text]
    const count = useMotionValue(0)
    const rounded = useTransform(count, (latest) => Math.round(latest))

    useEffect(() => {
        const controls = animate(count, texts[textIndex].length, {
            type: "tween",
            duration: texts[textIndex].length * speed,
            ease: "linear",
            onUpdate: (latest) => {
                setDisplayedText(texts[textIndex].slice(0, Math.round(latest)))
            },
            onComplete: () => {
                setIsWaiting(true)
                setTimeout(() => {
                    setIsWaiting(false)
                    count.set(0)
                    setDisplayedText("")
                    setTextIndex((prev) => (prev + 1) % texts.length)
                }, waitTime)
            },
        })

        return controls.stop
    }, [count, speed, waitTime, texts, textIndex])

    return (
        <span className={className}>
            {displayedText}
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                className={cursorClassName}
            >
                |
            </motion.span>
        </span>
    )
}
