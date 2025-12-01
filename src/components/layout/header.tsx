"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { Menu, X, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { CartDrawer } from "@/components/ecommerce/cart-drawer"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { ThemeCustomizer } from "@/components/theme/theme-customizer"
import { LanguageSwitcher } from "@/components/layout/language-switcher"

const navigation = [
    { name: "Szolgáltatások", href: "/szolgaltatasok" },
    { name: "Scriptek", href: "/szolgaltatasok/scriptek" },
    { name: "Webfejlesztés", href: "/szolgaltatasok/webfejlesztes" },
    { name: "Termékek", href: "/termekek" },
    { name: "Referenciák", href: "/referenciak" },
    { name: "Árak", href: "/arak" },
    { name: "Vélemény", href: "/velemeny" },
]

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <Code2 className="h-6 w-6 text-primary" />
                            <span className="text-lg font-bold tracking-tight text-primary">
                                <span className="font-bold text-xl tracking-tight">
                                    Backline<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">IT</span>
                                </span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.dispatchEvent(new CustomEvent("toggle-command-menu"))}
                            className="text-muted-foreground hover:text-primary"
                        >
                            <span className="sr-only">Keresés</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                        </Button>
                        <CartDrawer />
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/login">Ügyfélportál</Link>
                        </Button>
                        <Button size="sm" className="bg-accent hover:bg-accent/90 text-white" asChild>
                            <Link href="/kapcsolat">Ingyenes konzultáció</Link>
                        </Button>
                        <ThemeCustomizer />
                        <LanguageSwitcher />
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <span className="sr-only">Menü megnyitása</span>
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="h-6 w-6" aria-hidden="true" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-b bg-background"
                        >
                            <div className="container mx-auto px-4 py-4 space-y-4">
                                <nav className="flex flex-col gap-4">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="text-sm font-medium text-foreground hover:text-primary"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </nav>
                                <div className="flex flex-col gap-2 pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <ThemeCustomizer />
                                        <LanguageSwitcher />
                                    </div>
                                    <Button variant="ghost" asChild className="justify-start">
                                        <Link href="/login">Ügyfélportál</Link>
                                    </Button>
                                    <Button className="w-full bg-accent hover:bg-accent/90 text-white" asChild>
                                        <Link href="/kapcsolat">Ingyenes konzultáció</Link>
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
            <div className="container mx-auto px-4">
                <Breadcrumbs />
            </div>
        </>
    )
}
