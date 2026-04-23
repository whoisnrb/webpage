"use client"

import { usePathname as useNextPathname } from "next/navigation"
import { Link } from "@/i18n/routing"
import { ChevronRight, Home } from "lucide-react"
import { useTranslations } from "next-intl"

export function Breadcrumbs() {
    const rawPathname = useNextPathname() || ""
    const t = useTranslations('Breadcrumbs')

    // Parse path and remove locale if present
    const rawSegments = rawPathname.split('/').filter(Boolean)
    const segments = rawSegments.length > 0 && ['hu', 'en'].includes(rawSegments[0]) 
        ? rawSegments.slice(1) 
        : rawSegments

    // Don't show breadcrumbs on home page
    if (segments.length === 0) return null

    return (
        <nav className="flex flex-wrap items-center text-sm text-muted-foreground py-4 animate-in fade-in slide-in-from-left-4 duration-500 overflow-hidden">
            <Link href="/" className="flex items-center hover:text-primary transition-colors">
                <Home className="h-4 w-4" />
                <span className="sr-only">{t('home')}</span>
            </Link>

            {segments.map((segment, index) => {
                const href = `/${segments.slice(0, index + 1).join('/')}`
                const isLast = index === segments.length - 1

                // Try to translate the segment, fallback to capitalizing the segment itself
                const decodedSegment = decodeURIComponent(segment)
                let name = decodedSegment
                if (t.has(decodedSegment as any)) {
                    name = t(decodedSegment as any)
                } else {
                    name = decodedSegment.charAt(0).toUpperCase() + decodedSegment.slice(1).replace(/-/g, ' ')
                }

                return (
                    <div key={href} className="flex items-center">
                        <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />
                        {isLast ? (
                            <span className="font-medium text-foreground capitalize">{name}</span>
                        ) : (
                            <Link href={href as any} className="hover:text-primary transition-colors capitalize">
                                {name}
                            </Link>
                        )}
                    </div>
                )
            })}
        </nav>
    )
}
