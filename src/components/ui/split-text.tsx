"use client"
import { motion, useAnimation, Variant } from "framer-motion"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"

interface SplitTextProps {
    text: string
    className?: string
    delay?: number
    animationFrom?: { opacity: number; y: number }
    animationTo?: { opacity: number; y: number }
}

export const SplitText = ({
    text,
    className = "",
    delay = 0,
    animationFrom = { opacity: 0, y: 30 },
    animationTo = { opacity: 1, y: 0 },
}: SplitTextProps) => {
    const controls = useAnimation()
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: true,
    })

    useEffect(() => {
        if (inView) {
            controls.start("visible")
        }
    }, [controls, inView])

    const words = text.split(" ")

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: delay * 0.04 },
        }),
    }

    const child = {
        hidden: animationFrom,
        visible: {
            ...animationTo,
            transition: {
                type: "spring" as const,
                damping: 12,
                stiffness: 100,
            },
        },
    }

    return (
        <motion.span
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={container}
            className={className}
        >
            {words.map((word, index) => (
                <motion.span
                    key={index}
                    variants={child}
                    style={{ display: "inline-block", marginRight: "0.25em" }}
                >
                    {word}
                </motion.span>
            ))}
        </motion.span>
    )
}
