"use client"

import * as React from "react"
import { Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const themes = [
    {
        name: "Cyan (Default)",
        value: "cyan",
        colors: {
            "--primary": "oklch(0.70 0.15 200)",
            "--ring": "oklch(0.70 0.15 200)",
        },
    },
    {
        name: "Purple (Neon)",
        value: "purple",
        colors: {
            "--primary": "oklch(0.65 0.25 290)",
            "--ring": "oklch(0.65 0.25 290)",
        },
    },
    {
        name: "Green (Matrix)",
        value: "green",
        colors: {
            "--primary": "oklch(0.70 0.20 140)",
            "--ring": "oklch(0.70 0.20 140)",
        },
    },
    {
        name: "Orange (Cyberpunk)",
        value: "orange",
        colors: {
            "--primary": "oklch(0.70 0.20 40)",
            "--ring": "oklch(0.70 0.20 40)",
        },
    },
    {
        name: "Pink (Synthwave)",
        value: "pink",
        colors: {
            "--primary": "oklch(0.70 0.25 340)",
            "--ring": "oklch(0.70 0.25 340)",
        },
    },
]

export function ThemeCustomizer() {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
        const savedTheme = localStorage.getItem("theme-color")
        if (savedTheme) {
            const theme = themes.find((t) => t.value === savedTheme)
            if (theme) {
                applyTheme(theme)
            }
        }
    }, [])

    const applyTheme = (theme: typeof themes[0]) => {
        const updateTheme = () => {
            const root = document.documentElement
            Object.entries(theme.colors).forEach(([key, value]) => {
                root.style.setProperty(key, value)
            })
            localStorage.setItem("theme-color", theme.value)
        }

        // @ts-ignore - View Transition API is new
        if (!document.startViewTransition) {
            updateTheme()
            return
        }

        // @ts-ignore
        document.startViewTransition(updateTheme)
    }

    if (!mounted) return null

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Palette className="h-4 w-4" />
                    <span className="sr-only">Téma váltása</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {themes.map((theme) => (
                    <DropdownMenuItem
                        key={theme.value}
                        onClick={() => applyTheme(theme)}
                        className="flex items-center gap-2"
                    >
                        <div
                            className="h-4 w-4 rounded-full border"
                            style={{ background: theme.colors["--primary"] }}
                        />
                        {theme.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
