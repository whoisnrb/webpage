"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DarkModeToggle() {
    const [mounted, setMounted] = React.useState(false)
    const [isDark, setIsDark] = React.useState(true)

    React.useEffect(() => {
        setMounted(true)
        const saved = localStorage.getItem("color-mode")
        if (saved === "light") {
            setIsDark(false)
            document.documentElement.classList.remove("dark")
        }
    }, [])

    const toggle = () => {
        const next = !isDark

        const applyChange = () => {
            if (next) {
                document.documentElement.classList.add("dark")
                localStorage.setItem("color-mode", "dark")
            } else {
                document.documentElement.classList.remove("dark")
                localStorage.setItem("color-mode", "light")
            }
            setIsDark(next)
        }

        // Use View Transition API if available for smooth transition
        if (document.startViewTransition) {
            document.startViewTransition(applyChange)
        } else {
            applyChange()
        }
    }

    if (!mounted) return null

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 relative overflow-hidden"
            onClick={toggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            <Sun
                className={`h-4 w-4 absolute transition-all duration-500 ${
                    isDark
                        ? "rotate-90 scale-0 opacity-0"
                        : "rotate-0 scale-100 opacity-100"
                }`}
            />
            <Moon
                className={`h-4 w-4 absolute transition-all duration-500 ${
                    isDark
                        ? "rotate-0 scale-100 opacity-100"
                        : "-rotate-90 scale-0 opacity-0"
                }`}
            />
        </Button>
    )
}
