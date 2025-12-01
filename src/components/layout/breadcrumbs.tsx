"use client"

import { usePathname } from "@/i18n/routing"
import { Link } from "@/i18n/routing"
import { ChevronRight, Home } from "lucide-react"
import { useTranslations } from "next-intl"

export function Breadcrumbs() {
    const pathname = usePathname()
    const t = useTranslations('Navigation')

    // Don't show breadcrumbs on home page
    if (pathname === '/') return null

    const segments = pathname.split('/').filter(Boolean)

    const getBreadcrumbName = (segment: string) => {
        // Map common segments to readable names
        // In a real app, you might fetch product/blog titles here
        const map: Record<string, string> = {
            'szolgaltatasok': 'Szolgáltatások',
            'webfejlesztes': 'Webfejlesztés',
            'scriptek': 'Egyedi Scriptek',
            'rendszeruzemeltetes': 'Rendszerüzemeltetés',
            'biztonsag': 'Kiberbiztonság',
            'termekek': 'Termékek',
            'blog': 'Blog',
            'kapcsolat': 'Kapcsolat',
            'arak': 'Árak',
            'referenciak': 'Referenciák',
            'login': 'Bejelentkezés',
            'fiok': 'Fiók',
            'admin': 'Admin',
            'checkout': 'Pénztár'
        }
        return map[segment] || segment
    }

    return (
        <nav className="flex items-center text-sm text-muted-foreground py-4 animate-in fade-in slide-in-from-left-4 duration-500">
            <Link href="/" className="flex items-center hover:text-primary transition-colors">
                <Home className="h-4 w-4" />
                <span className="sr-only">Főoldal</span>
            </Link>

            {segments.map((segment, index) => {
                const href = `/${segments.slice(0, index + 1).join('/')}`
                const isLast = index === segments.length - 1
                const name = getBreadcrumbName(segment)

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
