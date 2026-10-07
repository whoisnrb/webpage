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
import { ArrowRight, Sparkles, Activity, Terminal, Layout, Zap, Briefcase, FileText, MessageSquare, CreditCard, Package, Star } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import { NeuralBackground } from "@/components/neural-background"
import { SERVICES_STRUCTURE, ServiceCategory, ServiceItem } from "./services-config"
import { motion, AnimatePresence } from "framer-motion"

export function MegaMenu() {
    const t = useTranslations("MegaMenu")
    const locale = useLocale()
    const pathname = usePathname()
    const [activeCategory, setActiveCategory] = React.useState<"growth" | "core" | "infrastructure">("growth")

    // Get categories with localized names and descriptions
    const categories = SERVICES_STRUCTURE.map(cat => ({
        ...cat,
        name: t(cat.nameKey),
        desc: t(cat.descKey)
    }))

    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-bold">
                        {t("services")}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <div 
                            className="relative overflow-hidden rounded-[2rem] shadow-[0_0_50px_-12px_rgba(6,182,212,0.35)]" 
                            style={{ 
                                background: "rgba(5, 12, 20, 0.97)", 
                                backdropFilter: "blur(24px)", 
                                border: "1px solid rgba(6, 182, 212, 0.15)",
                            }}
                        >
                            {/* Animated neural mesh background */}
                            <div className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none">
                                <NeuralBackground />
                            </div>

                            {/* Main Megamenu Grid */}
                            <div className="relative z-10 grid grid-cols-[280px_1fr] lg:grid-cols-[300px_1fr] xl:grid-cols-[330px_1fr] w-[95vw] md:w-[760px] lg:w-[960px] xl:w-[1080px] min-h-[460px] md:min-h-[480px] lg:min-h-[500px]">
                                
                                {/* Left Category Panel */}
                                <div className="p-6 md:p-8 border-r border-white/5 flex flex-col justify-between bg-white/[0.01]">
                                    <div className="space-y-5">
                                        <div className="text-[10px] font-black uppercase tracking-[0.35em] text-cyan-400/80 cursor-default px-2">
                                            {t("explore_services")}
                                        </div>
                                        <div className="space-y-2">
                                            {categories.map((cat) => {
                                                const Icon = cat.icon
                                                const isActive = activeCategory === cat.id
                                                return (
                                                    <button
                                                        key={cat.id}
                                                        onMouseEnter={() => setActiveCategory(cat.id)}
                                                        onClick={() => setActiveCategory(cat.id)}
                                                        className={cn(
                                                            "w-full text-left p-3.5 rounded-2xl border transition-all duration-300 flex items-start gap-4 group/cat",
                                                            isActive 
                                                                ? "bg-gradient-to-r from-cyan-500/10 via-cyan-500/[0.03] to-transparent border-cyan-500/35 shadow-[0_0_20px_-5px_rgba(6,182,212,0.15)]"
                                                                : "bg-transparent border-transparent hover:bg-white/[0.02] hover:border-white/5"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300",
                                                            isActive
                                                                ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                                                                : "bg-white/[0.02] border-white/5 text-white/40 group-hover/cat:text-white/80 group-hover/cat:border-white/10"
                                                        )}>
                                                            <Icon className="h-5 w-5" />
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            <div className={cn(
                                                                "text-sm font-black tracking-tight transition-colors leading-none",
                                                                isActive ? "text-cyan-400" : "text-white/70 group-hover/cat:text-white"
                                                            )}>
                                                                {cat.name}
                                                            </div>
                                                            <div className={cn(
                                                                "text-[11px] leading-snug font-medium transition-colors mt-1",
                                                                isActive ? "text-white/60" : "text-white/40 group-hover/cat:text-white/50"
                                                            )}>
                                                                {cat.desc}
                                                            </div>
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
                                            className="flex select-none flex-col justify-end rounded-2xl bg-gradient-to-br from-cyan-500/15 via-blue-500/5 to-transparent p-5 no-underline outline-none border border-cyan-500/25 hover:border-cyan-500/40 shadow-lg group transition-all duration-500 mt-6"
                                        >
                                            <div className="flex items-center gap-2 text-cyan-400 group-hover:scale-[1.02] transition-transform duration-300">
                                                <Sparkles className="h-5 w-5 text-cyan-400" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{t("need_help_title")}</span>
                                            </div>
                                            <p className="text-[11px] leading-relaxed text-white/50 font-medium group-hover:text-white/70 transition-colors mt-2 mb-3">
                                                {t("need_help_desc")}
                                            </p>
                                            <div className="w-full py-2.5 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-black uppercase tracking-wider text-center border border-cyan-500/25 group-hover:border-cyan-500/40 transition-all duration-300">
                                                {t("need_help_cta_long")}
                                            </div>
                                        </Link>
                                    </NavigationMenuLink>
                                </div>

                                {/* Right Service Grid Panel */}
                                <div className="p-6 md:p-8 flex flex-col justify-center bg-white/[0.002]">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeCategory}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                            className="grid grid-cols-1 md:grid-cols-2 gap-3.5"
                                        >
                                            {SERVICES_STRUCTURE.find(cat => cat.id === activeCategory)?.items.map((item) => {
                                                const Icon = item.icon
                                                const title = t(`nav_items.${item.key}`)
                                                const desc = t(`nav_items.${item.key}_desc`)
                                                return (
                                                    <NavigationMenuLink asChild key={item.key}>
                                                        <Link
                                                            href={item.href as any}
                                                            className="flex items-center justify-between relative select-none rounded-[1.25rem] p-4 bg-white/[0.01] hover:bg-cyan-500/[0.02] border border-white/5 hover:border-cyan-500/30 shadow-sm transition-all duration-300 group outline-none hover:-translate-y-0.5 hover:shadow-[0_4px_25px_-5px_rgba(6,182,212,0.12)]"
                                                        >
                                                            <div className="flex items-start gap-4 pr-3 flex-1 min-w-0">
                                                                <div className="h-10 w-10 shrink-0 rounded-xl bg-cyan-500/5 border border-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/15 group-hover:border-cyan-500/25 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all duration-300">
                                                                    <Icon className="h-5 w-5" />
                                                                </div>
                                                                <div className="space-y-1 min-w-0 flex-1">
                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                        <span className="text-sm font-black tracking-tight text-white/90 group-hover:text-white transition-colors leading-tight">
                                                                            {title}
                                                                        </span>
                                                                        {item.popular && (
                                                                            <span className="bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap shrink-0">
                                                                                {t("popular")}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <p className="line-clamp-2 text-xs leading-normal text-white/50 group-hover:text-white/75 transition-colors font-medium">
                                                                        {desc}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="shrink-0 flex items-center justify-center h-8 w-8 rounded-lg text-cyan-400/25 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 border border-transparent group-hover:border-cyan-500/20 transition-all duration-300">
                                                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                                            </div>
                                                        </Link>
                                                    </NavigationMenuLink>
                                                )
                                            })}
                                        </motion.div>
                                    </AnimatePresence>
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
                            className="relative overflow-hidden rounded-[2rem] shadow-[0_0_50px_-12px_rgba(6,182,212,0.35)]"
                            style={{
                                background: "rgba(5, 12, 20, 0.97)",
                                backdropFilter: "blur(24px)",
                                border: "1px solid rgba(6, 182, 212, 0.15)",
                            }}
                        >
                            <div className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none">
                                <NeuralBackground />
                            </div>

                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_290px] lg:grid-cols-[1fr_320px] w-[95vw] md:w-[720px] lg:w-[820px] xl:w-[880px] min-h-[380px]">
                                {/* Bal oldal: Termékek & Csomagok */}
                                <div className="p-6 md:p-7 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="text-[10px] font-black uppercase tracking-[0.35em] text-cyan-400/80 cursor-default px-2">
                                            {t("products_heading")}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href={{ pathname: "/megoldasok", query: { category: "scripts" } }}
                                                    className="p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-cyan-500/30 transition-all duration-300 group flex items-start gap-3"
                                                >
                                                    <div className="h-9 w-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-cyan-500/20 transition-all">
                                                        <Terminal className="h-4 w-4" />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                                                            <span>{t("scripts")}</span>
                                                            <span className="text-[8px] bg-cyan-500/20 text-cyan-300 font-extrabold px-1.5 py-0.2 rounded-full uppercase">Hot</span>
                                                        </div>
                                                        <p className="text-[11px] text-white/50 group-hover:text-white/80 line-clamp-2 leading-snug">
                                                            {t("scripts_desc")}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>

                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href={{ pathname: "/megoldasok", query: { category: "web" } }}
                                                    className="p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-cyan-500/30 transition-all duration-300 group flex items-start gap-3"
                                                >
                                                    <div className="h-9 w-9 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-blue-500/20 transition-all">
                                                        <Layout className="h-4 w-4" />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                                                            {t("web")}
                                                        </div>
                                                        <p className="text-[11px] text-white/50 group-hover:text-white/80 line-clamp-2 leading-snug">
                                                            {t("web_desc")}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>

                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href={{ pathname: "/megoldasok", query: { category: "plugins" } }}
                                                    className="p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-cyan-500/30 transition-all duration-300 group flex items-start gap-3"
                                                >
                                                    <div className="h-9 w-9 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-teal-500/20 transition-all">
                                                        <Zap className="h-4 w-4" />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                                                            {t("plugins")}
                                                        </div>
                                                        <p className="text-[11px] text-white/50 group-hover:text-white/80 line-clamp-2 leading-snug">
                                                            {t("plugins_desc")}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </NavigationMenuLink>

                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href="/megoldasok"
                                                    className="p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-cyan-500/30 transition-all duration-300 group flex items-start gap-3"
                                                >
                                                    <div className="h-9 w-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-cyan-500/20 transition-all">
                                                        <Package className="h-4 w-4" />
                                                    </div>
                                                    <div className="space-y-0.5">
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
                            className="relative overflow-hidden rounded-[2rem] shadow-[0_0_50px_-12px_rgba(6,182,212,0.35)]"
                            style={{
                                background: "rgba(5, 12, 20, 0.97)",
                                backdropFilter: "blur(24px)",
                                border: "1px solid rgba(6, 182, 212, 0.15)",
                            }}
                        >
                            <div className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none">
                                <NeuralBackground />
                            </div>

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
