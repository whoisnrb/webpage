"use client"
import React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Link } from "@/i18n/routing"
import {
    Home,
    Settings,
    Terminal,
    LayoutGrid,
    Mail,
    Users,
    Monitor,
    Box
} from "lucide-react"
import { cn } from "@/lib/utils"

export const Dock = () => {
    const mouseX = useMotionValue(Infinity)

    const items = [
        { icon: Home, label: "Főoldal", href: "/" },
        { icon: Terminal, label: "Szolgáltatások", href: "/szolgaltatasok" },
        { icon: Box, label: "Megoldások", href: "/megoldasok" },
        { icon: LayoutGrid, label: "Referenciák", href: "/referenciak" },
        { icon: Users, label: "Csapat", href: "/rolunk" },
        { icon: Mail, label: "Kapcsolat", href: "/kapcsolat" },
    ]

    return (
        <motion.div
            onMouseMove={(e) => mouseX.set(e.clientX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className="fixed bottom-8 left-1/2 z-[100] flex h-16 -translate-x-1/2 items-end gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 pb-3 backdrop-blur-md hidden md:flex"
        >
            {items.map((item, i) => (
                <DockItem mouseX={mouseX} key={i} {...item} />
            ))}
        </motion.div>
    )
}

function DockItem({ mouseX, icon: Icon, label, href }: { mouseX: any, icon: any, label: string, href: string }) {
    const ref = React.useRef<HTMLDivElement>(null)

    const distance = useTransform(mouseX, (val: number) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
        return val - bounds.x - bounds.width / 2
    })

    const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40])
    const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 })

    const opacitySync = useTransform(distance, [-150, 0, 150], [0.5, 1, 0.5])
    const opacity = useSpring(opacitySync, { mass: 0.1, stiffness: 150, damping: 12 })

    return (
        <Link href={href} className="block">
            <motion.div
                ref={ref}
                style={{ width }}
                className="aspect-square flex flex-col items-center justify-center rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 relative group"
            >
                <motion.div style={{ opacity }}>
                    <Icon className="h-5 w-5 text-white" />
                </motion.div>

                {/* Tooltip */}
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black/90 border border-white/10 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {label}
                </span>
            </motion.div>
        </Link>
    )
}
