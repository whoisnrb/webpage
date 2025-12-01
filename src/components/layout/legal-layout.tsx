"use client"

import { Link } from "@/i18n/routing"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Printer, ArrowLeft, FileText, Shield, Info } from "lucide-react"

interface LegalLayoutProps {
    children: React.ReactNode
    title: string
    lastUpdated?: string
}

export function LegalLayout({ children, title, lastUpdated }: LegalLayoutProps) {
    const pathname = usePathname()

    const links = [
        { href: "/aszf", label: "Általános Szerződési Feltételek", icon: FileText },
        { href: "/adatvedelem", label: "Adatvédelmi Tájékoztató", icon: Shield },
        { href: "/impresszum", label: "Impresszum", icon: Info },
    ]

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header Background */}
            <div className="h-64 bg-gradient-to-r from-primary/10 to-secondary/10 w-full absolute top-0 left-0 -z-10" />

            <div className="container mx-auto px-4 py-12 relative">
                {/* Back Link */}
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Vissza a főoldalra
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-3 space-y-6">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-card rounded-xl border shadow-sm p-4">
                                <h3 className="font-semibold mb-4 px-2">Dokumentumok</h3>
                                <nav className="space-y-1">
                                    {links.map((link) => {
                                        const Icon = link.icon
                                        const isActive = pathname.includes(link.href)

                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className={cn(
                                                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                                    isActive
                                                        ? "bg-primary/10 text-primary"
                                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                )}
                                            >
                                                <Icon className="h-4 w-4" />
                                                {link.label}
                                            </Link>
                                        )
                                    })}
                                </nav>
                            </div>

                            <div className="bg-card rounded-xl border shadow-sm p-4">
                                <h3 className="font-semibold mb-2 px-2 text-sm">Segítségre van szükséged?</h3>
                                <p className="text-xs text-muted-foreground px-2 mb-4">
                                    Ha kérdésed van a dokumentumokkal kapcsolatban, keress minket bizalommal.
                                </p>
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="/kapcsolat">Kapcsolatfelvétel</Link>
                                </Button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-9">
                        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                            {/* Document Header */}
                            <div className="border-b bg-muted/10 p-6 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight mb-2">{title}</h1>
                                    {lastUpdated && (
                                        <p className="text-sm text-muted-foreground">
                                            Utolsó frissítés: <span className="font-medium text-foreground">{lastUpdated}</span>
                                        </p>
                                    )}
                                </div>
                                <Button variant="outline" size="sm" onClick={handlePrint} className="shrink-0 gap-2">
                                    <Printer className="h-4 w-4" />
                                    Nyomtatás
                                </Button>
                            </div>

                            {/* Document Content */}
                            <div className="p-6 md:p-10 prose prose-neutral dark:prose-invert max-w-none">
                                {children}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
