"use client"

import { useTranslations } from "next-intl"
import { AlertTriangle } from "lucide-react"

export function MaintenanceBanner() {
    const t = useTranslations('Maintenance')

    return (
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 text-yellow-500 px-4 py-2 text-center text-sm font-medium backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span>{t('banner_text')}</span>
            </div>
        </div>
    )
}
