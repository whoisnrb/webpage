'use client'

import { useEffect } from 'react'
import { Link } from "@/i18n/routing"
import { Button } from '@/components/ui/button'
import { AlertCircle, RotateCcw, Home } from 'lucide-react'
import { FadeIn } from "@/components/ui/motion-wrapper"
import { useTranslations } from "next-intl"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    const t = useTranslations("Error")

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-destructive/10 via-background to-background opacity-50" />

            <FadeIn>
                <div className="bg-destructive/10 p-8 rounded-full mb-8 inline-block ring-1 ring-destructive/20 shadow-2xl backdrop-blur-sm">
                    <AlertCircle className="h-20 w-20 text-destructive animate-pulse" />
                </div>

                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
                    {t("title") || "Hoppá! Valami hiba történt"}
                </h1>

                <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
                    {t("description") || "Váratlan hiba lépett fel a rendszerünkben. Már dolgozunk a megoldáson."}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => reset()} size="lg" className="gap-2">
                        <RotateCcw className="h-4 w-4" />
                        {t("retry") || "Próbálja újra"}
                    </Button>
                    <Button variant="outline" size="lg" asChild className="gap-2">
                        <Link href="/">
                            <Home className="h-4 w-4" />
                            {t("back_home") || "Vissza a főoldalra"}
                        </Link>
                    </Button>
                </div>

                {error.digest && (
                    <p className="mt-8 text-xs text-muted-foreground font-mono">
                        Error ID: {error.digest}
                    </p>
                )}
            </FadeIn>
        </div>
    )
}
