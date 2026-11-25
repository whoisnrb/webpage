"use client"

import { Link, usePathname } from "@/i18n/routing"
import { Sparkles, ShieldCheck, Zap, TrendingUp, Search, MailCheck } from "lucide-react"
import { cn } from "@/lib/utils"

const AI_NAV_ITEMS = [
    {
        href: "/admin/marketing",
        label: "Marketing Autopilot",
        icon: Sparkles,
        iconBg: "bg-purple-500/10 border-purple-500/20 text-purple-400",
        activeAccent: "bg-purple-400",
    },
    {
        href: "/admin/security-audit",
        label: "Biztonsági Audit",
        icon: ShieldCheck,
        iconBg: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
        activeAccent: "bg-cyan-400",
    },
    {
        href: "/admin/speed-audit",
        label: "Sebesség & Konverzió",
        icon: Zap,
        iconBg: "bg-amber-500/10 border-amber-500/20 text-amber-400",
        activeAccent: "bg-amber-400",
    },
    {
        href: "/admin/growth-audit",
        label: "Növekedési Audit",
        badge: "PDF",
        icon: TrendingUp,
        iconBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
        activeAccent: "bg-emerald-400",
    },
    {
        href: "/admin/seo-tracker",
        label: "SEO Kulcsszó Tracker",
        icon: Search,
        iconBg: "bg-blue-500/10 border-blue-500/20 text-blue-400",
        activeAccent: "bg-blue-400",
    },
    {
        href: "/admin/email-deliverability",
        label: "Email Kézbesítés Teszt",
        icon: MailCheck,
        iconBg: "bg-teal-500/10 border-teal-500/20 text-teal-400",
        activeAccent: "bg-teal-400",
    },
] as const

export function AdminAiNav() {
    const rawPathname = usePathname()
    const pathname = String(rawPathname || "")

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between px-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 shrink-0 text-purple-400" />
                    <span>AI & Automatizáció</span>
                </p>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-purple-500/15 text-purple-300 font-semibold border border-purple-500/25">
                    GPT-4o
                </span>
            </div>

            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-1.5 space-y-1">
                {AI_NAV_ITEMS.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)

                    return (
                        <Link
                            key={item.href}
                            href={item.href as any}
                            className={cn(
                                "group relative flex items-center gap-2.5 w-full px-2.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 border",
                                isActive
                                    ? "bg-white/[0.08] text-white border-white/15 shadow-sm"
                                    : "bg-transparent text-slate-300 border-transparent hover:text-white hover:bg-white/[0.04] hover:border-white/[0.06]"
                            )}
                        >
                            {isActive && (
                                <span
                                    className={cn(
                                        "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-full",
                                        item.activeAccent
                                    )}
                                />
                            )}

                            <span
                                className={cn(
                                    "h-7 w-7 shrink-0 rounded-lg border flex items-center justify-center transition-transform duration-200 group-hover:scale-105",
                                    item.iconBg
                                )}
                            >
                                <Icon className="h-3.5 w-3.5" />
                            </span>

                            <span className="flex-1 truncate leading-none">{item.label}</span>

                            {"badge" in item && item.badge && (
                                <span className="shrink-0 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
