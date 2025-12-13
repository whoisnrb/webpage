"use client"

import { usePathname } from "@/i18n/routing"
import { Link } from "@/i18n/routing"
import { ChevronRight, Home } from "lucide-react"
import { useTranslations } from "next-intl"

export function Breadcrumbs() {
    const pathname = usePathname()
    const t = useTranslations('Breadcrumbs')

    // Don't show breadcrumbs on home page
    if (pathname === '/') return null

    const segments = pathname.split('/').filter(Boolean)

    return (
        <nav className="flex items-center text-sm text-muted-foreground py-4 animate-in fade-in slide-in-from-left-4 duration-500">
            <Link href="/" className="flex items-center hover:text-primary transition-colors">
                <Home className="h-4 w-4" />
                <span className="sr-only">Főoldal</span>
            </Link>

            {segments.map((segment, index) => {
                const href = `/${segments.slice(0, index + 1).join('/')}`
                const isLast = index === segments.length - 1

                // Try to translate the segment, fallback to capitalizing the segment itself
                // We use a prefix to avoid collisions with other keys, though here we use a dedicated namespace
                let name = segment
                try {
                    name = t(segment as any)
                } catch (e) {
                    name = segment.charAt(0).toUpperCase() + segment.slice(1)
                }

                return (
                    <div key={href} className="flex items-center">
                        <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />
                        {isLast ? (
                            <span className="font-medium text-foreground capitalize">{name}</span>
                        ) : (
                            <Link href={href} className="hover:text-primary transition-colors capitalize">
                                {name}
                            </Link>
                        )}
                    </div>
                )
            })}
        </nav>
    )
}
