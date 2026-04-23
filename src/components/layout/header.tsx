"use client"

import * as React from "react"
import { Link, usePathname } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { Menu, X, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { CartDrawer } from "@/components/ecommerce/cart-drawer"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { ThemeCustomizer } from "@/components/theme/theme-customizer"
import { LanguageSwitcher } from "@/components/layout/language-switcher"
import { CurrencySwitcher } from "@/components/layout/currency-switcher"
import { MegaMenu } from "@/components/layout/mega-menu"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { NeuralBackground } from "@/components/neural-background"
import { cn } from "@/lib/utils"



export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
    const t = useTranslations("Navigation")
    const tMega = useTranslations("MegaMenu")
    const pathname = usePathname()

    if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
        return null;
    }

    const navCategories = [
        {
            name: t("services"),
            href: "/szolgaltatasok",
            items: [
                { name: tMega("nav_items.scripts"), href: "/szolgaltatasok/scriptek" },
                { name: tMega("nav_items.webdev"), href: "/szolgaltatasok/webfejlesztes" },
                { name: tMega("nav_items.sysadmin"), href: "/szolgaltatasok/rendszeruzemeltetes" },
                { name: tMega("nav_items.network"), href: "/szolgaltatasok/halozat" },
                { name: tMega("nav_items.integrations"), href: "/szolgaltatasok/integraciok" },
            ]
        },
        {
            name: t("products"),
            href: "/megoldasok",
            items: [
                { name: tMega("all_products"), href: "/megoldasok" },
                { name: tMega("scripts"), href: "/megoldasok?category=scripts" },
                { name: tMega("web"), href: "/megoldasok?category=web" },
                { name: tMega("plugins"), href: "/megoldasok?category=plugins" },
            ]
        },
        {
            name: tMega("knowledge"),
            href: "/referenciak",
            items: [
                { name: t("references"), href: "/referenciak" },
                { name: t("pricing"), href: "/arak" },
                { name: t("reviews"), href: "/velemeny" },
                { name: tMega("blog"), href: "/blog" },
            ]
        }
    ]

    const singleLinks = [
        { name: tMega("contact"), href: "/kapcsolat" },
    ]

    return (
        <>
            <header className="sticky top-0 z-[100] w-full bg-background/50 backdrop-blur-3xl">
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
                    <div className="hidden md:flex items-center gap-6">
                        <MegaMenu />
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.dispatchEvent(new CustomEvent("toggle-command-menu"))}
                            className="text-muted-foreground hover:text-primary"
                        >
                            <span className="sr-only">{t("search")}</span>
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
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/login">{t("client_portal")}</Link>
                        </Button>
                        <Button size="sm" className="bg-accent hover:bg-accent/90 text-white" asChild>
                            <Link href="/demo">{t("free_consultation")}</Link>
                        </Button>
                        <ThemeCustomizer />
                        <CurrencySwitcher />
                        <LanguageSwitcher />
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <span className="sr-only">{t("open_menu")}</span>
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
                            className="md:hidden border-b bg-[#050810]/95 backdrop-blur-3xl relative overflow-hidden"
                        >
                            <div className="absolute inset-0 z-0 opacity-20">
                                <NeuralBackground />
                            </div>
                            <div className="container mx-auto px-4 py-8 space-y-6 relative z-10">
                                <nav>
                                    <Accordion type="single" collapsible className="w-full">
                                        {navCategories.map((category) => (
                                            <AccordionItem key={category.name} value={category.name} className="border-white/5">
                                                <AccordionTrigger className="text-lg font-bold text-white/90 hover:text-primary py-4 hover:no-underline">
                                                    {category.name}
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="flex flex-col gap-3 pl-4 pt-2 pb-4">
                                                        {category.items.map((item) => {
                                                            const href = typeof item.href === 'string' ? item.href : (item.href as any).pathname;
                                                            const isActive = pathname === href;
                                                            return (
                                                                <Link
                                                                    key={item.name}
                                                                    href={item.href as any}
                                                                    className={cn(
                                                                        "text-sm font-medium transition-colors border-l-2 pl-4 py-1",
                                                                        isActive
                                                                            ? "text-primary border-primary bg-primary/5"
                                                                            : "text-white/40 border-transparent hover:text-white hover:border-white/10"
                                                                    )}
                                                                    onClick={() => setMobileMenuOpen(false)}
                                                                >
                                                                    {item.name}
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                    <div className="flex flex-col gap-4 mt-6">
                                        {singleLinks.map((item) => {
                                            const isActive = pathname === item.href;
                                            return (
                                                <Link
                                                    key={item.name}
                                                    href={item.href as any}
                                                    className={cn(
                                                        "text-lg font-bold transition-all px-1 py-1",
                                                        isActive ? "text-primary" : "text-white/90 hover:text-primary"
                                                    )}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    {item.name}
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </nav>
                                <div className="flex flex-col gap-4 pt-6 border-t border-white/10">
                                    <div className="flex justify-between items-center px-2">
                                        <div className="flex items-center gap-4 sm:gap-8">
                                            <div className="flex flex-col gap-1.5 items-center">
                                                <ThemeCustomizer />
                                                <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest whitespace-nowrap">{tMega("theme")}</span>
                                            </div>
                                            <div className="flex flex-col gap-1.5 items-center">
                                                <LanguageSwitcher />
                                                <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest whitespace-nowrap">{tMega("language")}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1.5 items-center">
                                            <CurrencySwitcher />
                                            <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest whitespace-nowrap">{tMega("currency")}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3 mt-4">
                                        <Button variant="outline" asChild className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white">
                                            <Link href="/login">{t("client_portal")}</Link>
                                        </Button>
                                        <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02] transition-transform text-white border-none shadow-lg shadow-cyan-500/20 font-bold h-12" asChild>
                                            <Link href="/demo">{t("free_consultation")}</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
            {!pathname.includes('/sikeres-fizetes') && (
                <div className="container mx-auto px-4">
                    <Breadcrumbs />
                </div>
            )}
        </>
    )
}
