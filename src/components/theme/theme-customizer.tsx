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
import { useTranslations } from "next-intl"

const themes = [
    {
        value: "cyan",
        colors: {
            "--color-primary": "oklch(0.70 0.15 200)",
            "--color-ring": "oklch(0.70 0.15 200)",
        },
    },
    {
        value: "purple",
        colors: {
            "--color-primary": "oklch(0.65 0.25 290)",
            "--color-ring": "oklch(0.65 0.25 290)",
        },
    },
    {
        value: "green",
        colors: {
            "--color-primary": "oklch(0.70 0.20 140)",
            "--color-ring": "oklch(0.70 0.20 140)",
        },
    },
    {
        value: "orange",
        colors: {
            "--color-primary": "oklch(0.70 0.20 40)",
            "--color-ring": "oklch(0.70 0.20 40)",
        },
    },
    {
        value: "pink",
        colors: {
            "--color-primary": "oklch(0.70 0.25 340)",
            "--color-ring": "oklch(0.70 0.25 340)",
        },
    },
]

export function ThemeCustomizer() {
    const [mounted, setMounted] = React.useState(false)
    const t = useTranslations("ThemeCustomizer")

    const applyTheme = (theme: typeof themes[0]) => {
        const updateTheme = () => {
            const root = document.documentElement
            Object.entries(theme.colors).forEach(([key, value]) => {
                root.style.setProperty(key, value)
            })
            localStorage.setItem("theme-color", theme.value)
        }

        if (!document.startViewTransition) {
            updateTheme()
            return
        }

        document.startViewTransition(updateTheme)
    }

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

    if (!mounted) return null

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Palette className="h-4 w-4" />
                    <span className="sr-only">{t("toggle")}</span>
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
                            style={{ background: theme.colors["--color-primary"] }}
                        />
                        {t(`themes.${theme.value}`)}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
