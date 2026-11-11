"use client"

import { ArrowRight, ArrowUpRight, Code2, ShieldCheck, Server, Sparkles } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import type { ServiceCategoryId } from "@/components/services/service-catalog-helpers"

interface ServicesHeroProps {
    badge: string
    title: string
    titleHighlight: string
    description: string
    ctaQuote: string
    totalCount: number
    categoryCounts: Record<ServiceCategoryId, number>
}

const DOMAIN_ORDER: Array<{
    id: ServiceCategoryId
    nameKey: string
    index: string
    icon: typeof Sparkles
}> = [
    { id: "growth", nameKey: "categories.growth", index: "01", icon: Sparkles },
    { id: "security_cloud", nameKey: "categories.security_cloud", index: "02", icon: ShieldCheck },
    { id: "core", nameKey: "categories.core", index: "03", icon: Server },
    { id: "infrastructure", nameKey: "categories.infrastructure", index: "04", icon: Code2 },
]

export function ServicesHero({
    badge,
    title,
    titleHighlight,
    description,
    ctaQuote,
    totalCount,
    categoryCounts,
}: ServicesHeroProps) {
    const tMega = useTranslations("MegaMenu")
    const locale = useLocale()
    const isHu = locale === "hu"

    const jumpToCategory = (categoryId: ServiceCategoryId) => {
        if (typeof window !== "undefined") {
            const url = new URL(window.location.href)
            url.searchParams.set("category", categoryId)
            url.hash = "szolgaltatasok"
            window.history.replaceState(null, "", url.toString())
            window.dispatchEvent(new CustomEvent("backline:select-category", { detail: categoryId }))
            const target = document.getElementById("szolgaltatasok")
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" })
            }
        }
    }

    return (
        <section className="relative overflow-hidden border-b border-white/[0.06] bg-[#040812]/70 pt-14 pb-12 md:pt-20 md:pb-16">
            {/* Subtle architectural blueprint hairline grid */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_0%,#000_55%,transparent_100%)]"
            />

            <div className="container relative z-10 mx-auto px-4">
                <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-12">
                    {/* Editorial Title & Primary Actions */}
                    <div className="lg:col-span-7">
                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-[2px] w-6 bg-cyan-400" />
                            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                                {badge}
                            </span>
                        </div>

                        <h1 className="mb-5 text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.35rem] lg:leading-[1.08]">
                            {title}{" "}
                            <span className="text-cyan-400">{titleHighlight}</span>
                        </h1>

                        <p className="mb-8 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
                            {description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3.5">
                            <Link
                                href="/ajanlatkeres"
                                className="inline-flex h-11 items-center gap-2 rounded-xl bg-cyan-500 px-6 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
                            >
                                <span>{ctaQuote}</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>

                            <Link
                                href="/demo"
                                className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-5 text-sm font-medium text-white transition-colors hover:border-white/25 hover:bg-white/[0.07]"
                            >
                                <span>{isHu ? "30 perces konzultáció" : "30-min Consultation"}</span>
                            </Link>

                            <Link
                                href="/arak"
                                className="inline-flex h-11 items-center gap-1.5 px-3 text-sm font-medium text-slate-400 transition-colors hover:text-white"
                            >
                                <span>{isHu ? "Csomagok & árak" : "Pricing & Tiers"}</span>
                                <ArrowUpRight className="h-4 w-4 text-slate-500" />
                            </Link>
                        </div>
                    </div>

                    {/* Executive Domain Index Panel */}
                    <div className="lg:col-span-5">
                        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#070c18]">
                            <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#0a101f] px-5 py-3">
                                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                    {isHu ? "Szakterületek" : "Practice Areas"}
                                </span>
                                <span className="font-mono text-[11px] text-cyan-400 tabular-nums">
                                    {totalCount} {isHu ? "szolgáltatás" : "services"}
                                </span>
                            </div>

                            <div className="divide-y divide-white/[0.05]">
                                {DOMAIN_ORDER.map((domain) => {
                                    const Icon = domain.icon
                                    const count = categoryCounts[domain.id] ?? 0
                                    return (
                                        <button
                                            key={domain.id}
                                            type="button"
                                            onClick={() => jumpToCategory(domain.id)}
                                            className="group flex w-full items-center justify-between gap-3 px-5 py-3 text-left transition-colors hover:bg-white/[0.03]"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <span className="font-mono text-[11px] text-slate-500">
                                                    {domain.index}
                                                </span>
                                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-cyan-400/90 transition-colors group-hover:border-cyan-500/35 group-hover:bg-cyan-500/10">
                                                    <Icon className="h-3.5 w-3.5" />
                                                </div>
                                                <span className="truncate text-sm font-medium text-slate-200 transition-colors group-hover:text-white">
                                                    {tMega(domain.nameKey)}
                                                </span>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-2.5">
                                                <span className="rounded-md bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-slate-400 tabular-nums">
                                                    {count}
                                                </span>
                                                <ArrowRight className="h-3.5 w-3.5 text-slate-600 transition-all group-hover:translate-x-0.5 group-hover:text-cyan-400" />
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="grid grid-cols-3 divide-x divide-white/[0.06] border-t border-white/[0.06] bg-[#050912] px-2 py-2.5 text-center font-mono text-[11px] text-slate-400">
                                <span>&lt;24h SLA</span>
                                <span>Azure EU</span>
                                <span>GDPR · NIS2</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
