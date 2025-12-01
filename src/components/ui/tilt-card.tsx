"use client"

import React, { useRef, useState } from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion"

interface TiltCardProps {
    children: React.ReactNode
    className?: string
}

export function TiltCard({ children, className }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null)

    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 })
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 })

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect()
        x.set(clientX - left - width / 2)
        y.set(clientY - top - height / 2)
    }

    function onMouseLeave() {
        x.set(0)
        y.set(0)
    }

    const rotateX = useSpring(useMotionValue(0), { stiffness: 500, damping: 100 })
    const rotateY = useSpring(useMotionValue(0), { stiffness: 500, damping: 100 })

    // Update rotation based on mouse position
    // Note: This is a simplified version. For full 3D tilt, we'd transform x/y to degrees.
    // Here we use a simpler approach for performance and subtlety.

    return (
        <motion.div
            ref={ref}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{
                rotateX: useSpring(useMotionValue(0), { stiffness: 500, damping: 100 }), // Placeholder for now
                rotateY: useSpring(useMotionValue(0), { stiffness: 500, damping: 100 }), // Placeholder for now
            }}
            className={className}
        >
            <div className="group relative h-full w-full overflow-hidden rounded-xl border bg-gradient-to-br from-white/10 to-white/5 p-px transition-all hover:shadow-xl">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl" />
                <div className="relative h-full w-full rounded-xl bg-card/50 backdrop-blur-sm p-6">
                    {children}
                </div>
            </div>
        </motion.div>
    )
}

// Improved version with actual tilt logic
export function TiltCard3D({ children, className }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const xSpring = useSpring(x);
    const ySpring = useSpring(y);

    const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return [0, 0];

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = (e.clientX - rect.left) * 32.5;
        const mouseY = (e.clientY - rect.top) * 32.5;

        const rX = (mouseY / height - 32.5 / 2) * -1;
        const rY = (mouseX / width - 32.5 / 2);

        x.set(rX);
        y.set(rY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transformStyle: "preserve-3d",
                transform,
            }}
            className={className}
        >
            <div
                style={{
                    transform: "translateZ(75px)",
                    transformStyle: "preserve-3d",
                }}
                className="group relative h-full w-full rounded-xl border border-white/10 bg-gray-900/40 px-8 py-8 shadow-2xl backdrop-blur-sm"
            >
                <div
                    style={{
                        transform: "translateZ(50px)",
                    }}
                    className="absolute inset-4 grid place-content-center rounded-xl shadow-lg"
                >
                    {/* Glow effect */}
                    <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 to-secondary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {children}
                </div>
            </div>
        </motion.div>
    );
};
