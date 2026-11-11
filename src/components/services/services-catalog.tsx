"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { PriceDisplay } from "@/components/price-display"
import { cn } from "@/lib/utils"
import type { CatalogServiceItem, ServiceCategoryId } from "./service-catalog-helpers"
import {
    Activity,
    ArrowRight,
    BarChart3,
    Bot,
    Building2,
    Check,
    Cloud,
    Code2,
    Cpu,
    Database,
    FileText,
    FolderLock,
    Gauge,
    Globe,
    Headphones,
    Layout,
    MailCheck,
    Mic,
    Monitor,
    Network,
    Plug,
    Puzzle,
    Radar,
    RefreshCw,
    RotateCcw,
    Search,
    Server,
    Shield,
    ShieldCheck,
    ShoppingCart,
    Sparkles,
    Terminal,
    X,
    Zap,
    type LucideIcon,
} from "lucide-react"

const ICON_MAP: Record<string, LucideIcon> = {
    Code2,
    ShoppingCart,
    Server,
    Shield,
    ShieldCheck,
    Globe,
    Search,
    RefreshCw,
    Cpu,
    Cloud,
    Database,
    Activity,
    Network,
    Plug,
    Headphones,
    Layout,
    Puzzle,
    Radar,
    MailCheck,
    Bot,
    FileText,
    Mic,
    Gauge,
    Monitor,
    FolderLock,
    BarChart3,
    Building2,
    Zap,
    Terminal,
    Sparkles,
}

const DOMAIN_SECTIONS: Array<{
    id: ServiceCategoryId
    index: string
    nameKey: string
    descKey: string
    icon: LucideIcon
}> = [
    {
        id: "growth",
        index: "01",
        nameKey: "categories.growth",
        descKey: "categories.growth_desc",
        icon: Sparkles,
    },
    {
        id: "security_cloud",
        index: "02",
        nameKey: "categories.security_cloud",
        descKey: "categories.security_cloud_desc",
        icon: ShieldCheck,
    },
    {
        id: "core",
        index: "03",
        nameKey: "categories.core",
        descKey: "categories.core_desc",
        icon: Server,
    },
    {
        id: "infrastructure",
        index: "04",
        nameKey: "categories.infrastructure",
        descKey: "categories.infrastructure_desc",
        icon: Code2,
    },
]

const VALID_CATEGORIES = new Set<ServiceCategoryId>([
    "growth",
    "security_cloud",
    "core",
    "infrastructure",
])

function parseCategoryParam(param: string | null): "all" | ServiceCategoryId {
    if (!param) return "all"
    const clean = param.trim().toLowerCase() as ServiceCategoryId
    return VALID_CATEGORIES.has(clean) ? clean : "all"
}

interface ServicesCatalogProps {
    services: CatalogServiceItem[]
}

export function ServicesCatalog({ services }: ServicesCatalogProps) {
    const locale = useLocale()
    const isHu = locale === "hu"
    const tMega = useTranslations("MegaMenu")
    const searchParams = useSearchParams()

    const [activeCategory, setActiveCategory] = React.useState<"all" | ServiceCategoryId>(() =>
        parseCategoryParam(searchParams.get("category"))
    )
    const [searchQuery, setSearchQuery] = React.useState(() => searchParams.get("q") || "")
    const [onlyNew, setOnlyNew] = React.useState(() => searchParams.get("filter") === "new")
    const [onlyMonthly, setOnlyMonthly] = React.useState(() => searchParams.get("filter") === "monthly")

    React.useEffect(() => {
        const param = searchParams.get("category")
        if (param) {
            setActiveCategory(parseCategoryParam(param))
        }
    }, [searchParams])

    React.useEffect(() => {
        const handleSelectCategory = (event: Event) => {
            const custom = event as CustomEvent<ServiceCategoryId>
            if (custom.detail && VALID_CATEGORIES.has(custom.detail)) {
                setActiveCategory(custom.detail)
                setSearchQuery("")
                setOnlyNew(false)
                setOnlyMonthly(false)
            }
        }
        window.addEventListener("backline:select-category", handleSelectCategory)
        return () => window.removeEventListener("backline:select-category", handleSelectCategory)
    }, [])

    const syncUrl = React.useCallback(
        (category: "all" | ServiceCategoryId, nextNew: boolean, nextMonthly: boolean) => {
            if (typeof window === "undefined") return
            const url = new URL(window.location.href)
            if (category === "all") {
                url.searchParams.delete("category")
            } else {
                url.searchParams.set("category", category)
            }
            if (nextNew) {
                url.searchParams.set("filter", "new")
            } else if (nextMonthly) {
                url.searchParams.set("filter", "monthly")
            } else {
                url.searchParams.delete("filter")
            }
            window.history.replaceState(null, "", url.toString())
        },
        []
    )

    const selectCategory = (category: "all" | ServiceCategoryId) => {
        setActiveCategory(category)
        syncUrl(category, onlyNew, onlyMonthly)
    }

    const toggleOnlyNew = () => {
        const next = !onlyNew
        setOnlyNew(next)
        if (next) setOnlyMonthly(false)
        syncUrl(activeCategory, next, false)
    }

    const toggleOnlyMonthly = () => {
        const next = !onlyMonthly
        setOnlyMonthly(next)
        if (next) setOnlyNew(false)
        syncUrl(activeCategory, false, next)
    }

    const resetFilters = () => {
        setActiveCategory("all")
        setSearchQuery("")
        setOnlyNew(false)
        setOnlyMonthly(false)
        syncUrl("all", false, false)
    }

    const countsByCategory = React.useMemo(() => {
        const counts: Record<ServiceCategoryId, number> = {
            growth: 0,
            security_cloud: 0,
            core: 0,
            infrastructure: 0,
        }
        for (const svc of services) {
            counts[svc.categoryId] = (counts[svc.categoryId] ?? 0) + 1
        }
        return counts
    }, [services])

    const newCount = React.useMemo(() => services.filter((s) => s.isNew).length, [services])
    const monthlyCount = React.useMemo(
        () => services.filter((s) => s.pricingKind === "monthly").length,
        [services]
    )

    const trimmedQuery = searchQuery.trim().toLowerCase()
    const isFilteredView = activeCategory !== "all" || Boolean(trimmedQuery) || onlyNew || onlyMonthly

    const filteredServices = React.useMemo(() => {
        return services.filter((item) => {
            if (activeCategory !== "all" && item.categoryId !== activeCategory) return false
            if (onlyNew && !item.isNew) return false
            if (onlyMonthly && item.pricingKind !== "monthly") return false
            if (trimmedQuery) {
                const haystack = `${item.title} ${item.description} ${item.slug} ${item.features.join(" ")}`.toLowerCase()
                if (!haystack.includes(trimmedQuery)) return false
            }
            return true
        })
    }, [services, activeCategory, onlyNew, onlyMonthly, trimmedQuery])

    return (
        <div id="szolgaltatasok" className="scroll-mt-16">
            {/* Sticky Filter & Search Control Bar */}
            <div className="sticky top-16 z-30 border-b border-white/[0.06] bg-[#040812]/92 backdrop-blur-xl">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                        {/* Category Tabs */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 xl:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            <button
                                type="button"
                                onClick={() => selectCategory("all")}
                                className={cn(
                                    "inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                                    activeCategory === "all"
                                        ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-300 font-semibold"
                                        : "border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-white"
                                )}
                            >
                                <span>{isHu ? "Összes" : "All"}</span>
                                <span className="font-mono text-[10px] opacity-75 tabular-nums">
                                    {services.length}
                                </span>
                            </button>

                            {DOMAIN_SECTIONS.map((sec) => {
                                const isActive = activeCategory === sec.id
                                const count = countsByCategory[sec.id] ?? 0
                                if (count === 0) return null
                                return (
                                    <button
                                        key={sec.id}
                                        type="button"
                                        onClick={() => selectCategory(sec.id)}
                                        className={cn(
                                            "inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
                                            isActive
                                                ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-300 font-semibold"
                                                : "border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-white"
                                        )}
                                    >
                                        <span>{tMega(sec.nameKey)}</span>
                                        <span className="font-mono text-[10px] opacity-75 tabular-nums">
                                            {count}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Search + Quick Filters */}
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="relative flex-1 sm:flex-none">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={
                                        isHu
                                            ? "Keresés (pl. NIS2, AI, Azure)..."
                                            : "Search (e.g. NIS2, AI, Azure)..."
                                    }
                                    className="h-9 w-full sm:w-56 lg:w-64 rounded-lg border border-white/10 bg-[#080e1d] pl-8 pr-8 text-xs text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none transition-colors"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery("")}
                                        aria-label={isHu ? "Keresés törlése" : "Clear search"}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>

                            {newCount > 0 && (
                                <button
                                    type="button"
                                    onClick={toggleOnlyNew}
                                    className={cn(
                                        "inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors whitespace-nowrap",
                                        onlyNew
                                            ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                                            : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-white"
                                    )}
                                >
                                    <span>{isHu ? "Új Azure" : "New Azure"}</span>
                                    <span className="font-mono text-[10px] opacity-80 tabular-nums">
                                        {newCount}
                                    </span>
                                </button>
                            )}

                            {monthlyCount > 0 && (
                                <button
                                    type="button"
                                    onClick={toggleOnlyMonthly}
                                    className={cn(
                                        "inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors whitespace-nowrap",
                                        onlyMonthly
                                            ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-300"
                                            : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-white"
                                    )}
                                >
                                    <span>{isHu ? "Havidíjas SLA" : "Monthly SLA"}</span>
                                    <span className="font-mono text-[10px] opacity-80 tabular-nums">
                                        {monthlyCount}
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Catalog Body */}
            <section className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                    {!isFilteredView ? (
                        <div className="space-y-16">
                            {DOMAIN_SECTIONS.map((sec) => {
                                const domainServices = services.filter((s) => s.categoryId === sec.id)
                                if (domainServices.length === 0) return null
                                const DomainIcon = sec.icon

                                return (
                                    <div key={sec.id} className="space-y-6">
                                        {/* Domain Section Header */}
                                        <div className="flex flex-col gap-3 border-b border-white/[0.06] pb-5 sm:flex-row sm:items-end sm:justify-between">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="rounded bg-white/[0.05] px-2 py-0.5 font-mono text-[11px] font-semibold text-cyan-400">
                                                        {sec.index}
                                                    </span>
                                                    <DomainIcon className="h-4 w-4 text-cyan-400/80" />
                                                    <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                                                        {tMega(sec.nameKey)}
                                                    </h2>
                                                </div>
                                                <p className="max-w-2xl text-sm text-slate-400">
                                                    {tMega(sec.descKey)}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => selectCategory(sec.id)}
                                                className="inline-flex shrink-0 items-center gap-1.5 self-start text-xs font-medium text-slate-400 transition-colors hover:text-cyan-400 sm:self-auto"
                                            >
                                                <span>
                                                    {isHu
                                                        ? `Csak ez (${domainServices.length})`
                                                        : `Filter (${domainServices.length})`}
                                                </span>
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </button>
                                        </div>

                                        {/* 3-Column Bento Grid */}
                                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                                            {domainServices.map((item) => (
                                                <ServiceCatalogCard
                                                    key={item.id}
                                                    item={item}
                                                    isHu={isHu}
                                                    categoryLabel={tMega(sec.nameKey)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Filtered Results Summary */}
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
                                <div className="flex items-center gap-2.5 text-sm">
                                    <span className="font-semibold text-white">
                                        {activeCategory === "all"
                                            ? isHu
                                                ? "Szűrt szolgáltatások"
                                                : "Filtered Services"
                                            : tMega(`categories.${activeCategory}`)}
                                    </span>
                                    <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-xs text-cyan-400 tabular-nums">
                                        {filteredServices.length} {isHu ? "találat" : "results"}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-white/20 hover:text-white"
                                >
                                    <RotateCcw className="h-3 w-3" />
                                    <span>{isHu ? "Összes kategória" : "Show all"}</span>
                                </button>
                            </div>

                            {filteredServices.length === 0 ? (
                                <div className="rounded-2xl border border-white/[0.08] bg-[#070c18] px-6 py-14 text-center">
                                    <p className="mb-2 text-base font-semibold text-white">
                                        {isHu
                                            ? "Nincs a szűrési feltételeknek megfelelő szolgáltatás."
                                            : "No services match your current filters."}
                                    </p>
                                    <p className="mx-auto mb-6 max-w-md text-sm text-slate-400">
                                        {isHu
                                            ? "Próbálj más kulcsszót, töröld a szűrőket, vagy írd le egyedi igényedet közvetlen ajánlatkérésben."
                                            : "Try adjusting your keywords, clearing filters, or describe your requirements in a custom quote."}
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-3">
                                        <button
                                            type="button"
                                            onClick={resetFilters}
                                            className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 text-xs font-semibold text-white hover:bg-white/[0.08]"
                                        >
                                            <RotateCcw className="h-3.5 w-3.5" />
                                            <span>{isHu ? "Szűrők törlése" : "Reset filters"}</span>
                                        </button>
                                        <Link
                                            href="/ajanlatkeres"
                                            className="inline-flex h-10 items-center gap-2 rounded-xl bg-cyan-500 px-5 text-xs font-semibold text-slate-950 hover:bg-cyan-400"
                                        >
                                            <span>
                                                {isHu ? "Egyedi ajánlatkérés" : "Request Custom Quote"}
                                            </span>
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                                    {filteredServices.map((item) => (
                                        <ServiceCatalogCard
                                            key={item.id}
                                            item={item}
                                            isHu={isHu}
                                            categoryLabel={tMega(`categories.${item.categoryId}`)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

function ServiceCatalogCard({
    item,
    isHu,
    categoryLabel,
}: {
    item: CatalogServiceItem
    isHu: boolean
    categoryLabel: string
}) {
    const Icon = ICON_MAP[item.iconName] || Code2

    const cadenceLabel =
        item.pricingKind === "monthly"
            ? isHu
                ? "havidíjas"
                : "per month"
            : item.pricingKind === "setup_monthly"
              ? isHu
                  ? "bevezetés + havidíj"
                  : "setup + monthly"
              : item.pricingKind === "one_time"
                ? isHu
                    ? "egyszeri projekt"
                    : "one-time project"
                : isHu
                  ? "felmérés alapján"
                  : "scoped quote"

    return (
        <Link
            href={item.href as React.ComponentProps<typeof Link>["href"]}
            className="group block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
            <SpotlightCard
                spotlightColor="rgba(6, 182, 212, 0.08)"
                className="h-full rounded-2xl border border-white/[0.08] bg-[#070c18] shadow-none transition-colors duration-200 group-hover:border-cyan-500/40 group-hover:bg-[#091020] hover:shadow-none"
            >
                <div className="flex h-full flex-col p-6">
                    {/* Top Row: Icon + Status Pill (left) | Pricing (right) */}
                    <div className="mb-4 flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-cyan-400 transition-colors group-hover:border-cyan-500/35 group-hover:bg-cyan-500/15">
                                <Icon className="h-5 w-5" />
                            </div>
                            {item.isNew ? (
                                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                                    {isHu ? "Új" : "New"}
                                </span>
                            ) : item.popular ? (
                                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
                                    {isHu ? "Kiemelt" : "Popular"}
                                </span>
                            ) : null}
                        </div>

                        <div className="text-right leading-tight">
                            {item.pricing > 0 ? (
                                <>
                                    <div className="flex items-baseline justify-end gap-1">
                                        {!isHu && (
                                            <span className="text-[11px] text-slate-400">from</span>
                                        )}
                                        <PriceDisplay
                                            amount={item.pricing}
                                            className="text-[15px] font-bold text-white tabular-nums"
                                        />
                                        {isHu && (
                                            <span className="text-[11px] font-medium text-slate-400">
                                                -tól
                                            </span>
                                        )}
                                    </div>
                                    <span className="mt-0.5 block font-mono text-[10px] text-slate-500">
                                        {cadenceLabel}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="block text-xs font-semibold text-slate-200">
                                        {isHu ? "Egyedi ajánlat" : "Custom quote"}
                                    </span>
                                    <span className="mt-0.5 block font-mono text-[10px] text-slate-500">
                                        {cadenceLabel}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="mb-2 text-lg font-bold tracking-tight text-white transition-colors group-hover:text-cyan-300 leading-snug">
                        {item.title}
                    </h3>
                    <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-slate-400">
                        {item.description}
                    </p>

                    {/* Top 3 Deliverables */}
                    {item.features.length > 0 ? (
                        <ul className="mb-5 flex-1 space-y-2 border-t border-white/[0.06] pt-4">
                            {item.features.slice(0, 3).map((feature, idx) => (
                                <li
                                    key={idx}
                                    className="flex items-start gap-2.5 text-[13px] leading-snug text-slate-300"
                                >
                                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400/80" />
                                    <span className="line-clamp-1">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="mb-5 flex-1" />
                    )}

                    {/* Footer Action Bar */}
                    <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-3.5 text-xs">
                        <span className="truncate pr-2 font-mono text-[11px] text-slate-500">
                            {item.packageCount > 0
                                ? isHu
                                    ? `${item.packageCount} csomag szint`
                                    : `${item.packageCount} package tiers`
                                : categoryLabel}
                        </span>
                        <span className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-cyan-400 transition-colors group-hover:text-cyan-300">
                            <span>{isHu ? "Részletek" : "Details"}</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </span>
                    </div>
                </div>
            </SpotlightCard>
        </Link>
    )
}
