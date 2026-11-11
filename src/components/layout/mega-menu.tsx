"use client"

import * as React from "react"
import { Link, usePathname } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ArrowRight, Sparkles, Activity, Terminal, Layout, Zap, Briefcase, FileText, MessageSquare, CreditCard, Package, Star, Puzzle, BookOpen, Search, X } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import { SERVICES_STRUCTURE, ServiceCategory, ServiceItem } from "./services-config"
import { motion, AnimatePresence } from "framer-motion"

const MEGAMENU_SURFACE_STYLE: React.CSSProperties = {
    background: "#050a15",
    border: "1px solid rgba(6, 182, 212, 0.22)",
}

export function MegaMenu() {
    const t = useTranslations("MegaMenu")
    const locale = useLocale()
    const pathname = usePathname()
    const [activeCategory, setActiveCategory] = React.useState<"growth" | "security_cloud" | "core" | "infrastructure">("growth")
    const [searchQuery, setSearchQuery] = React.useState("")

    // Get categories with localized names and descriptions
    const categories = SERVICES_STRUCTURE.map(cat => ({
        ...cat,
        name: t(cat.nameKey),
        desc: t(cat.descKey)
    }))

    const allServiceItems = React.useMemo(
        () =>
            SERVICES_STRUCTURE.flatMap((cat) =>
                cat.items.map((item) => ({
                    ...item,
                    categoryId: cat.id,
                }))
            ),
        []
    )

    const trimmedQuery = searchQuery.trim().toLowerCase()
    const visibleItems = React.useMemo(() => {
        if (!trimmedQuery) {
            return SERVICES_STRUCTURE.find((cat) => cat.id === activeCategory)?.items || []
        }
        return allServiceItems
            .filter((item) => {
                const title = t(`nav_items.${item.key}`).toLowerCase()
                const desc = t(`nav_items.${item.key}_desc`).toLowerCase()
                const slug = item.href.toLowerCase()
                return (
                    title.includes(trimmedQuery) ||
                    desc.includes(trimmedQuery) ||
                    slug.includes(trimmedQuery) ||
                    item.key.toLowerCase().includes(trimmedQuery)
                )
            })
            .slice(0, 12)
    }, [trimmedQuery, activeCategory, allServiceItems, t])

    const activeCategoryObj = categories.find((c) => c.id === activeCategory)

    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-bold">
                        {t("services")}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <div 
                            className="relative overflow-hidden rounded-3xl shadow-[0_28px_80px_-15px_rgba(0,0,0,0.95),0_0_50px_-12px_rgba(6,182,212,0.25)]" 
                            style={MEGAMENU_SURFACE_STYLE}
                        >
                            {/* Subtle top cyan highlight hairline & radial glow */}
                            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none" />
                            <div className="absolute -top-24 right-1/4 w-96 h-48 bg-cyan-500/[0.06] blur-3xl rounded-full pointer-events-none" />

                            {/* Main Megamenu Grid — fits cleanly in viewport with ZERO scrollbars */}
                            <div className="relative z-10 grid grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr] w-[96vw] md:w-[780px] lg:w-[1000px] xl:w-[1160px]">
                                
                                {/* Left Category Sidebar */}
                                <div className="p-4 lg:p-5 border-r border-white/[0.06] flex flex-col justify-between bg-[#070d1c]">
                                    <div className="space-y-3">
                                        <div className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-400/80 cursor-default px-2.5 pt-1">
                                            {t("explore_services")}
                                        </div>
                                        <div className="space-y-1">
                                            {categories.map((cat) => {
                                                const Icon = cat.icon
                                                const isActive = !trimmedQuery && activeCategory === cat.id
                                                return (
                                                    <button
                                                        key={cat.id}
                                                        type="button"
                                                        onMouseEnter={() => {
                                                            setSearchQuery("")
                                                            setActiveCategory(cat.id)
                                                        }}
                                                        onClick={() => {
                                                            setSearchQuery("")
                                                            setActiveCategory(cat.id)
                                                        }}
                                                        className={cn(
                                                            "w-full text-left px-3 py-2.5 rounded-xl border transition-all duration-200 flex items-center gap-3 group/cat relative",
                                                            isActive 
                                                                ? "bg-cyan-500/[0.09] border-cyan-500/35 shadow-[0_0_20px_-6px_rgba(6,182,212,0.25)]"
                                                                : "bg-transparent border-transparent hover:bg-white/[0.03]"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-200",
                                                            isActive
                                                                ? "bg-cyan-500/20 border-cyan-400/40 text-cyan-300"
                                                                : "bg-white/[0.03] border-white/5 text-white/45 group-hover/cat:text-white/80"
                                                        )}>
                                                            <Icon className="h-4 w-4" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center justify-between gap-1.5">
                                                                <span className={cn(
                                                                    "text-[13px] font-bold tracking-tight transition-colors truncate",
                                                                    isActive ? "text-cyan-300" : "text-white/80 group-hover/cat:text-white"
                                                                )}>
                                                                    {cat.name}
                                                                </span>
                                                                <span className={cn(
                                                                    "text-[10px] font-mono px-1.5 py-0.5 rounded-md shrink-0",
                                                                    isActive ? "bg-cyan-500/20 text-cyan-300" : "bg-white/5 text-white/40"
                                                                )}>
                                                                    {cat.items.length}
                                                                </span>
                                                            </div>
                                                            <p className={cn(
                                                                "text-[11px] leading-tight line-clamp-1 mt-0.5",
                                                                isActive ? "text-white/60" : "text-white/40"
                                                            )}>
                                                                {cat.desc}
                                                            </p>
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Bottom Left CTA Card */}
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href="/demo"
                                            className="flex select-none flex-col justify-end rounded-xl bg-gradient-to-br from-cyan-500/15 via-blue-500/5 to-transparent p-3.5 no-underline outline-none border border-cyan-500/25 hover:border-cyan-400/50 transition-all duration-300 group mt-4"
                                        >
                                            <div className="flex items-center gap-1.5 text-cyan-400">
                                                <Sparkles className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                                                <span className="text-[10px] font-black uppercase tracking-wider truncate">{t("need_help_title")}</span>
                                            </div>
                                            <p className="text-[11px] leading-snug text-white/55 group-hover:text-white/75 transition-colors mt-1 mb-2.5 line-clamp-2">
                                                {t("need_help_desc")}
                                            </p>
                                            <div className="w-full py-1.5 px-3 rounded-lg bg-cyan-500/15 group-hover:bg-cyan-500/25 text-cyan-300 text-[11px] font-bold uppercase tracking-wider text-center border border-cyan-500/30 transition-all">
                                                {t("need_help_cta_long")}
                                            </div>
                                        </Link>
                                    </NavigationMenuLink>
                                </div>

                                {/* Right 3-Column Borderless Bento Grid + Quick Search */}
                                <div className="p-5 lg:p-6 flex flex-col justify-between bg-[#050a15]">
                                    <div>
                                        {/* Top Bar: Category Title + Quick Search + All Services CTA */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 mb-3.5 border-b border-white/[0.06]">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="text-sm font-extrabold text-white tracking-tight truncate">
                                                    {trimmedQuery
                                                        ? (locale === "hu" ? `Keresési találatok (${visibleItems.length})` : `Search Results (${visibleItems.length})`)
                                                        : activeCategoryObj?.name}
                                                </span>
                                                {!trimmedQuery && (
                                                    <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                                                        {visibleItems.length} {locale === "hu" ? "megoldás" : "services"}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2.5">
                                                {/* Inline Quick Search Input */}
                                                <div className="relative">
                                                    <Search className="h-3.5 w-3.5 text-white/35 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                    <input
                                                        type="text"
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        onKeyDown={(e) => {
                                                            if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
                                                                e.stopPropagation()
                                                            }
                                                        }}
                                                        placeholder={locale === "hu" ? "Gyorskeresés (pl. NIS2, AI)..." : "Quick find (e.g. NIS2, AI)..."}
                                                        className="h-8 w-44 xl:w-56 pl-8 pr-7 rounded-lg bg-white/[0.04] border border-white/10 focus:border-cyan-400/50 focus:bg-white/[0.06] text-xs text-white placeholder:text-white/35 outline-none transition-all"
                                                    />
                                                    {searchQuery && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setSearchQuery("")
                                                            }}
                                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                                                            aria-label="Clear search"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    )}
                                                </div>

                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        href="/szolgaltatasok"
                                                        className="h-8 px-3 rounded-lg bg-white/[0.04] hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-500/35 text-[11px] font-bold text-cyan-300 hover:text-white flex items-center gap-1.5 transition-all shrink-0"
                                                    >
                                                        <span>{locale === "hu" ? "Összes (32)" : "View All (32)"}</span>
                                                        <ArrowRight className="h-3 w-3" />
                                                    </Link>
                                                </NavigationMenuLink>
                                            </div>
                                        </div>

                                        {/* 3-Column Clean Borderless Service Grid */}
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={trimmedQuery ? `search-${trimmedQuery}` : activeCategory}
                                                initial={{ opacity: 0, y: 4 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -4 }}
                                                transition={{ duration: 0.15, ease: "easeOut" }}
                                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1.5"
                                            >
                                                {visibleItems.length === 0 ? (
                                                    <div className="col-span-full py-12 text-center space-y-2">
                                                        <p className="text-sm font-semibold text-white/70">
                                                            {locale === "hu"
                                                                ? `Nincs találat a(z) "${searchQuery}" keresésre.`
                                                                : `No services matched "${searchQuery}".`}
                                                        </p>
                                                        <p className="text-xs text-white/40">
                                                            {locale === "hu"
                                                                ? "Próbálj más kulcsszót, vagy kérj egyedi ajánlatot az alábbi gombbal!"
                                                                : "Try another keyword or request a custom solution below."}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    visibleItems.map((item) => {
                                                        const Icon = item.icon
                                                        const title = t(`nav_items.${item.key}`)
                                                        const desc = t(`nav_items.${item.key}_desc`)
                                                        return (
                                                            <NavigationMenuLink asChild key={item.key}>
                                                                <Link
                                                                    href={item.href as any}
                                                                    className="flex items-start gap-2.5 p-2.5 rounded-xl border border-transparent hover:border-cyan-500/25 hover:bg-white/[0.04] transition-all duration-200 group outline-none"
                                                                >
                                                                    <div className="h-8 w-8 mt-0.5 shrink-0 rounded-lg bg-cyan-500/[0.08] border border-cyan-500/15 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/40 group-hover:scale-105 transition-all">
                                                                        <Icon className="h-4 w-4" />
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <div className="flex items-center gap-1.5">
                                                                            <span className="text-[12.5px] font-bold tracking-tight text-white/90 group-hover:text-cyan-300 transition-colors truncate">
                                                                                {title}
                                                                            </span>
                                                                            {item.isNew ? (
                                                                                <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[8px] font-black uppercase tracking-wider px-1.5 py-[1px] rounded-full shrink-0">
                                                                                    {locale === "hu" ? "Új" : "New"}
                                                                                </span>
                                                                            ) : item.popular ? (
                                                                                <span className="bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[8px] font-black uppercase tracking-wider px-1.5 py-[1px] rounded-full shrink-0">
                                                                                    Top
                                                                                </span>
                                                                            ) : null}
                                                                            <ArrowRight className="h-3 w-3 text-cyan-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0 ml-auto" />
                                                                        </div>
                                                                        <p className="line-clamp-1 text-[11px] leading-snug text-white/45 group-hover:text-white/70 transition-colors mt-0.5">
                                                                            {desc}
                                                                        </p>
                                                                    </div>
                                                                </Link>
                                                            </NavigationMenuLink>
                                                        )
                                                    })
                                                )}
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>

                                    {/* Clean Bottom Footer Bar */}
                                    <div className="pt-3 mt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-xs">
                                        <span className="text-white/45 text-[11.5px]">
                                            {locale === "hu"
                                                ? "Egyedi vállalati architektúrát vagy csomagajánlatot keresel?"
                                                : "Need a tailored enterprise setup or custom package?"}
                                        </span>
                                        <div className="flex items-center gap-4">
                                            <NavigationMenuLink asChild>
                                                <Link href="/arak" className="text-white/60 hover:text-white font-semibold text-[11.5px] transition-colors">
                                                    {t("prices")}
                                                </Link>
                                            </NavigationMenuLink>
                                            <NavigationMenuLink asChild>
                                                <Link href="/ajanlatkeres" className="text-cyan-400 hover:text-cyan-300 font-bold text-[11.5px] flex items-center gap-1 group">
                                                    <span>{locale === "hu" ? "Egyedi ajánlatkérés" : "Custom Quote"}</span>
                                                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                                                </Link>
                                            </NavigationMenuLink>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                {/* MEGOLDÁSOK MEGAMENÜ */}
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-bold">
                        {t("products")}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <div
                            className="relative overflow-hidden rounded-3xl shadow-[0_28px_80px_-15px_rgba(0,0,0,0.95),0_0_50px_-12px_rgba(6,182,212,0.25)]"
                            style={MEGAMENU_SURFACE_STYLE}
                        >
                            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none" />

                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_290px] lg:grid-cols-[1fr_320px] w-[95vw] md:w-[720px] lg:w-[820px] xl:w-[880px] min-h-[380px]">
                                {/* Bal oldal: Termékek & Csomagok */}
                                <div className="p-6 md:p-7 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="text-[10px] font-black uppercase tracking-[0.35em] text-cyan-400/80 cursor-default px-2">
                                            {t("products_heading")}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                            {/* 1. WordPress Plugin */}
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href={{ pathname: "/megoldasok", query: { category: "wordpress" } }}
                                                    className="p-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-cyan-500/30 transition-all duration-300 group flex items-start gap-3"
                                                >
                                                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-blue-500/20 transition-all mt-0.5">
                                                        <Puzzle className="h-4 w-4" />
                                                    </div>
                                                    <div className="space-y-0.5 min-w-0">
                                                        <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                                                            {t("wordpress")}
                                                        </div>
                                                        <p className="text-[11px] text-white/50 group-hover:text-white/80 line-clamp-2 leading-snug">
                                                            {t("wordpress_desc")}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>

                                            {/* 2. Automatizáció */}
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href={{ pathname: "/megoldasok", query: { category: "automation" } }}
                                                    className="p-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-cyan-500/30 transition-all duration-300 group flex items-start gap-3"
                                                >
                                                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-emerald-500/20 transition-all mt-0.5">
                                                        <Zap className="h-4 w-4" />
                                                    </div>
                                                    <div className="space-y-0.5 min-w-0">
                                                        <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                                                            <span>{t("automation")}</span>
                                                            <span className="text-[8px] bg-cyan-500/20 text-cyan-300 font-extrabold px-1.5 py-0.2 rounded-full uppercase">Hot</span>
                                                        </div>
                                                        <p className="text-[11px] text-white/50 group-hover:text-white/80 line-clamp-2 leading-snug">
                                                            {t("automation_desc")}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>

                                            {/* 3. Script */}
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href={{ pathname: "/megoldasok", query: { category: "script" } }}
                                                    className="p-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-cyan-500/30 transition-all duration-300 group flex items-start gap-3"
                                                >
                                                    <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-cyan-500/20 transition-all mt-0.5">
                                                        <Terminal className="h-4 w-4" />
                                                    </div>
                                                    <div className="space-y-0.5 min-w-0">
                                                        <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                                                            {t("scripts")}
                                                        </div>
                                                        <p className="text-[11px] text-white/50 group-hover:text-white/80 line-clamp-2 leading-snug">
                                                            {t("scripts_desc")}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>

                                            {/* 4. Template */}
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href={{ pathname: "/megoldasok", query: { category: "template" } }}
                                                    className="p-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-cyan-500/30 transition-all duration-300 group flex items-start gap-3"
                                                >
                                                    <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-indigo-500/20 transition-all mt-0.5">
                                                        <Layout className="h-4 w-4" />
                                                    </div>
                                                    <div className="space-y-0.5 min-w-0">
                                                        <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                                                            {t("templates")}
                                                        </div>
                                                        <p className="text-[11px] text-white/50 group-hover:text-white/80 line-clamp-2 leading-snug">
                                                            {t("templates_desc")}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>

                                            {/* 5. E-book */}
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href={{ pathname: "/megoldasok", query: { category: "ebook" } }}
                                                    className="p-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-cyan-500/30 transition-all duration-300 group flex items-start gap-3"
                                                >
                                                    <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-amber-500/20 transition-all mt-0.5">
                                                        <BookOpen className="h-4 w-4" />
                                                    </div>
                                                    <div className="space-y-0.5 min-w-0">
                                                        <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                                                            {t("ebooks")}
                                                        </div>
                                                        <p className="text-[11px] text-white/50 group-hover:text-white/80 line-clamp-2 leading-snug">
                                                            {t("ebooks_desc")}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>

                                            {/* 6. Összes megoldás */}
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href="/megoldasok"
                                                    className="p-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-cyan-500/30 transition-all duration-300 group flex items-start gap-3"
                                                >
                                                    <div className="h-8 w-8 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-teal-500/20 transition-all mt-0.5">
                                                        <Package className="h-4 w-4" />
                                                    </div>
                                                    <div className="space-y-0.5 min-w-0">
                                                        <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                                                            {t("all_products")}
                                                        </div>
                                                        <p className="text-[11px] text-white/50 group-hover:text-white/80 line-clamp-2 leading-snug">
                                                            {t("all_products_desc")}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>
                                        </div>
                                    </div>

                                    {/* Alsó link */}
                                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                                        <span className="text-white/40">{t("products_custom_prompt")}</span>
                                        <Link href="/demo" className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 group">
                                            <span>{t("products_custom_cta")}</span>
                                            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Jobb oldal: Kiemelt Termék Spotlight Kártya */}
                                <div className="p-6 border-t md:border-t-0 md:border-l border-white/5 bg-gradient-to-b from-cyan-500/[0.08] via-blue-500/[0.03] to-transparent flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 text-[10px] font-black uppercase tracking-wider">
                                            <Sparkles className="h-3 w-3 text-cyan-400" />
                                            {t("spotlight_solution_badge")}
                                        </div>
                                        <h4 className="text-sm font-extrabold text-white leading-snug">
                                            {t("spotlight_solution_title")}
                                        </h4>
                                        <p className="text-[12px] text-white/60 leading-relaxed">
                                            {t("spotlight_solution_desc")}
                                        </p>
                                        <div className="p-2.5 rounded-lg bg-[#040812]/70 border border-white/5 text-[11px] text-slate-300 flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                            <span>{t("spotlight_solution_stat")}</span>
                                        </div>
                                    </div>

                                    <Link
                                        href="/megoldasok"
                                        className="mt-4 w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm group"
                                    >
                                        <span>{t("spotlight_solution_cta")}</span>
                                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                {/* TUDÁSTÁR MEGAMENÜ */}
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-bold">
                        {t("knowledge")}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <div
                            className="relative overflow-hidden rounded-3xl shadow-[0_28px_80px_-15px_rgba(0,0,0,0.95),0_0_50px_-12px_rgba(6,182,212,0.25)]"
                            style={MEGAMENU_SURFACE_STYLE}
                        >
                            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none" />

                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_290px] lg:grid-cols-[1fr_320px] w-[95vw] md:w-[720px] lg:w-[820px] xl:w-[880px] min-h-[380px]">
                                {/* Bal oldal: Tudásbázis & Anyagok */}
                                <div className="p-6 md:p-7 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="text-[10px] font-black uppercase tracking-[0.35em] text-cyan-400/80 cursor-default px-2">
                                            {t("knowledge_heading")}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href="/referenciak"
                                                    className="p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-cyan-500/30 transition-all duration-300 group flex items-start gap-3"
                                                >
                                                    <div className="h-9 w-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-cyan-500/20 transition-all">
                                                        <Briefcase className="h-4 w-4" />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                                                            <span>{t("references")}</span>
                                                            <span className="text-[8px] bg-emerald-500/20 text-emerald-300 font-extrabold px-1.5 py-0.2 rounded-full uppercase">{t("knowledge_badge_cases")}</span>
                                                        </div>
                                                        <p className="text-[11px] text-white/50 group-hover:text-white/80 line-clamp-2 leading-snug">
                                                            {t("references_desc")}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>

                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href="/blog"
                                                    className="p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-cyan-500/30 transition-all duration-300 group flex items-start gap-3"
                                                >
                                                    <div className="h-9 w-9 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-blue-500/20 transition-all">
                                                        <FileText className="h-4 w-4" />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                                                            {t("blog")}
                                                        </div>
                                                        <p className="text-[11px] text-white/50 group-hover:text-white/80 line-clamp-2 leading-snug">
                                                            {t("blog_desc")}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>

                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href="/velemeny"
                                                    className="p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-cyan-500/30 transition-all duration-300 group flex items-start gap-3"
                                                >
                                                    <div className="h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-amber-500/20 transition-all">
                                                        <MessageSquare className="h-4 w-4" />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                                                            <span>{t("reviews")}</span>
                                                            <span className="text-[8px] bg-amber-500/20 text-amber-300 font-extrabold px-1.5 py-0.2 rounded-full uppercase">5.0 ★</span>
                                                        </div>
                                                        <p className="text-[11px] text-white/50 group-hover:text-white/80 line-clamp-2 leading-snug">
                                                            {t("reviews_desc")}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>

                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href="/arak"
                                                    className="p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-cyan-500/30 transition-all duration-300 group flex items-start gap-3"
                                                >
                                                    <div className="h-9 w-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-cyan-500/20 transition-all">
                                                        <CreditCard className="h-4 w-4" />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                                                            {t("prices")}
                                                        </div>
                                                        <p className="text-[11px] text-white/50 group-hover:text-white/80 line-clamp-2 leading-snug">
                                                            {t("prices_desc")}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>
                                        </div>
                                    </div>

                                    {/* Alsó sáv */}
                                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                                        <span className="text-white/40">{t("knowledge_custom_prompt")}</span>
                                        <Link href="/kapcsolat" className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 group">
                                            <span>{t("knowledge_custom_cta")}</span>
                                            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Jobb oldal: Kiemelt Esettanulmány Spotlight Kártya */}
                                <div className="p-6 border-t md:border-t-0 md:border-l border-white/5 bg-gradient-to-b from-blue-500/[0.08] via-cyan-500/[0.03] to-transparent flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-400/15 border border-blue-400/30 text-blue-300 text-[10px] font-black uppercase tracking-wider">
                                            <Sparkles className="h-3 w-3 text-cyan-400" />
                                            {t("spotlight_story_badge")}
                                        </div>
                                        <h4 className="text-sm font-extrabold text-white leading-snug">
                                            {t("spotlight_story_title")}
                                        </h4>
                                        <p className="text-[12px] text-white/60 leading-relaxed">
                                            {t("spotlight_story_desc")}
                                        </p>
                                        <div className="p-2.5 rounded-lg bg-[#040812]/70 border border-white/5 text-[11px] text-slate-300 flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                                            <span>{t("spotlight_story_stat")}</span>
                                        </div>
                                    </div>

                                    <Link
                                        href="/referenciak"
                                        className="mt-4 w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm group"
                                    >
                                        <span>{t("spotlight_story_cta")}</span>
                                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/kapcsolat" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-bold")}>
                            {t("contact")}
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

const ListItem = React.forwardRef<
    HTMLAnchorElement,
    React.ComponentPropsWithoutRef<typeof Link> & { title: string; icon?: React.ComponentType<{ className?: string }> }
>(({ className, title, icon: Icon, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-all hover:bg-white/5 group border border-transparent hover:border-white/5",
                        className
                    )}
                    {...props}
                >
                    <div className="flex items-center gap-2 mb-1">
                        {Icon && <Icon className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />}
                        <div className="text-sm font-black leading-none text-white/95 group-hover:text-primary transition-colors">{title}</div>
                    </div>
                    <p className="line-clamp-2 text-[13px] leading-snug text-white/60 group-hover:text-white transition-colors font-medium">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
