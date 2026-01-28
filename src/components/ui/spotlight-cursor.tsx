"use client"
import React, { useEffect, useRef, useState } from "react"
import { motion, useSpring, useMotionValue, MotionValue } from "framer-motion"
import { cn } from "@/lib/utils"

export const SpotlightCursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null)
    const [isHoveringLink, setIsHoveringLink] = useState(false)

    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const springConfig = { damping: 25, stiffness: 700 }
    const cursorX = useSpring(mouseX, springConfig)
    const cursorY = useSpring(mouseY, springConfig)

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX - 16)
            mouseY.set(e.clientY - 16)
        }

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (
                target.tagName === "A" ||
                target.tagName === "BUTTON" ||
                target.closest("a") ||
                target.closest("button") ||
                target.classList.contains("cursor-pointer")
            ) {
                setIsHoveringLink(true)
            } else {
                setIsHoveringLink(false)
            }
        }

        window.addEventListener("mousemove", moveCursor)
        window.addEventListener("mouseover", handleMouseOver)

        return () => {
            window.removeEventListener("mousemove", moveCursor)
            window.removeEventListener("mouseover", handleMouseOver)
        }
    }, [mouseX, mouseY])

    return (
        <>
            {/* Main Glow Spot */}
            <motion.div
                ref={cursorRef}
                className={cn(
                    "pointer-events-none fixed inset-0 z-[9999] h-8 w-8 rounded-full transition-opacity duration-300",
                    "bg-gradient-to-tr from-cyan-500 to-blue-600 mix-blend-screen blur-[20px] opacity-60"
                )}
                style={{
                    translateX: cursorX,
                    translateY: cursorY,
                    scale: isHoveringLink ? 2.5 : 1,
                }}
            />
            {/* Secondary Sharp Dot */}
            <motion.div
                className={cn(
                    "pointer-events-none fixed inset-0 z-[9999] h-2 w-2 rounded-full bg-white mix-blend-difference transition-opacity duration-300",
                    "opacity-100"
                )}
                style={{
                    translateX: useSpring(mouseX, { ...springConfig, stiffness: 1000 }), // Slightly faster/sharper
                    translateY: useSpring(mouseY, { ...springConfig, stiffness: 1000 }),
                    marginLeft: 11, // Centering offset relative to 32px
                    marginTop: 11
                }}
            />
        </>
    )
}
