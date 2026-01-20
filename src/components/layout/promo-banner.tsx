"use client"

import { useState } from "react"
import { X } from "lucide-react"

import { useTranslations } from "next-intl"

export function PromoBanner() {
    const t = useTranslations('PromoBanner')
    const [isVisible, setIsVisible] = useState(true)

    if (!isVisible) return null

    return (
        <div className="bg-primary px-4 py-3 text-white no-print">
            <div className="container mx-auto flex items-center justify-between text-sm font-medium">
                <p className="text-center flex-1">
                    {t('text')}
                </p>
                <button
                    onClick={() => setIsVisible(false)}
                    className="text-white/80 hover:text-white transition-colors"
                    aria-label={t('close')}
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}
