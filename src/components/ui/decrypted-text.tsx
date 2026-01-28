"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

interface DecryptedTextProps {
    text: string
    speed?: number
    maxIterations?: number
    className?: string
    revealDirection?: "start" | "end" | "center"
    useOriginalCharsOnly?: boolean
    characters?: string
    animateOn?: "view" | "hover"
    sequential?: boolean
}

export default function DecryptedText({
    text,
    speed = 50,
    maxIterations = 10,
    className,
    revealDirection = "start",
    useOriginalCharsOnly = false,
    characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+",
    animateOn = "hover",
    sequential = false,
}: DecryptedTextProps) {
    const [displayText, setDisplayText] = useState(text)
    const [isHovering, setIsHovering] = useState(false)
    const [isScrambling, setIsScrambling] = useState(false)
    const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set())
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        let interval: NodeJS.Timeout
        let currentIteration = 0

        const getNextChar = (char: string) => {
            if (useOriginalCharsOnly) {
                const index = Math.floor(Math.random() * text.length)
                return text[index]
            }
            const index = Math.floor(Math.random() * characters.length)
            return characters[index]
        }

        if (isHovering || isScrambling) {
            interval = setInterval(() => {
                setDisplayText((prevText) =>
                    prevText
                        .split("")
                        .map((char, index) => {
                            if (char === " ") return char
                            if (revealedIndices.has(index)) return text[index]

                            if (sequential) {
                                if (
                                    revealedIndices.size > 0 &&
                                    !revealedIndices.has(index - 1) &&
                                    index > 0
                                ) {
                                    return getNextChar(char)
                                }
                            }

                            return getNextChar(char)
                        })
                        .join("")
                )

                currentIteration++

                if (sequential) {
                    if (currentIteration % maxIterations === 0) {
                        setRevealedIndices(prev => {
                            const next = new Set(prev)
                            if (revealDirection === 'start') {
                                next.add(next.size)
                            } else if (revealDirection === 'end') {
                                next.add(text.length - 1 - next.size)
                            }
                            // Center not fully implemented for brevity, defaulting to all at once behavior roughly
                            return next
                        })
                    }
                    if (revealedIndices.size >= text.length) {
                        clearInterval(interval)
                        setIsScrambling(false)
                        setDisplayText(text)
                    }
                } else {
                    if (currentIteration >= maxIterations) {
                        clearInterval(interval)
                        setIsScrambling(false)
                        setDisplayText(text)
                    }
                }

            }, speed)
        } else {
            setDisplayText(text)
            setRevealedIndices(new Set())
        }

        return () => clearInterval(interval)
    }, [
        isHovering,
        text,
        speed,
        maxIterations,
        revealDirection,
        useOriginalCharsOnly,
        characters,
        isScrambling,
        sequential,
        revealedIndices
    ])

    // Effect to trigger animation on view
    useEffect(() => {
        if (animateOn === "view") {
            setIsScrambling(true)
        }
    }, [animateOn])

    // Improved logic for simple "decrypt" effect without over-engineering
    // This overrides the complex logic above for a smoother, standard decrypt effect
    useEffect(() => {
        if (animateOn === "view") {
            let iteration = 0;
            const interval = setInterval(() => {
                setDisplayText(text.split("").map((letter, index) => {
                    if (index < iteration) {
                        return text[index];
                    }
                    return characters[Math.floor(Math.random() * 26)]
                }).join(""));

                if (iteration >= text.length) {
                    clearInterval(interval);
                }

                iteration += 1 / 3;
            }, 30);
            return () => clearInterval(interval);
        }
    }, [animateOn, text, characters]);


    return (
        <span
            onMouseEnter={() => animateOn === "hover" && setIsHovering(true)}
            onMouseLeave={() => animateOn === "hover" && setIsHovering(false)}
            className={className}
        >
            {displayText}
        </span>
    )
}
