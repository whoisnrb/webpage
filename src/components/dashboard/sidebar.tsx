"use client"

import { Link, usePathname } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Ticket, Settings, LogOut, ShieldAlert, Code2, ChevronRight } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { useTranslations } from "next-intl"

const sidebarItems = [
    { name: "overview", href: "/dashboard", icon: LayoutDashboard, color: "text-primary", bg: "bg-primary/10", hoverBorder: "hover:border-primary/30", activeBorder: "border-primary/30", activeBg: "bg-primary/10", activeText: "text-primary" },
    { name: "title",    href: "/dashboard/tickets", icon: Ticket,          color: "text-orange-400", bg: "bg-orange-400/10", hoverBorder: "hover:border-orange-400/30", activeBorder: "border-orange-400/30", activeBg: "bg-orange-400/10", activeText: "text-orange-400" },
    { name: "settings", href: "/dashboard/settings", icon: Settings,        color: "text-slate-400",  bg: "bg-slate-400/10",  hoverBorder: "hover:border-slate-400/30", activeBorder: "border-slate-400/30",  activeBg: "bg-slate-400/10",  activeText: "text-slate-300" },
]

export function Sidebar() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const tNav   = useTranslations('Navigation')
    const tDash  = useTranslations('Dashboard')
    const tTickets = useTranslations('Tickets')

    const userName = session?.user?.name || tDash('anonymous_user')
    const userEmail = session?.user?.email || ''
    const initials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

    return (
        <div className="flex h-full flex-col bg-[#080812] border-r border-white/5">

            {/* Logo */}
            <div className="px-5 py-5 border-b border-white/5">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20 group-hover:ring-primary/40 transition-all">
                        <Code2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <span className="text-sm font-bold text-white tracking-tight">BacklineIT</span>
                        <p className="text-[10px] text-muted-foreground leading-none mt-0.5">{tDash('client_portal_header')}</p>
                    </div>
                </Link>
            </div>

            {/* Nav */}
            <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                    {tDash('navigation')}
                </p>

                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href
                    const label = item.name === 'title' ? tTickets('title') : tDash(item.name)

                    return (
                        <Link
                            key={item.href}
                            href={item.href as any}
                            className={cn(
                                "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium border transition-all duration-200",
                                isActive
                                    ? cn("border-white/8", item.activeBg, item.activeText)
                                    : cn("border-transparent text-muted-foreground hover:text-foreground hover:bg-white/5", item.hoverBorder)
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "flex h-7 w-7 items-center justify-center rounded-md transition-all",
                                    isActive ? item.bg : "bg-white/5 group-hover:bg-white/8"
                                )}>
                                    <item.icon className={cn("h-3.5 w-3.5", isActive ? item.color : "text-muted-foreground group-hover:text-foreground")} />
                                </div>
                                {label}
                            </div>
                            <ChevronRight className={cn(
                                "h-3.5 w-3.5 transition-all",
                                isActive ? "opacity-60" : "opacity-0 group-hover:opacity-40"
                            )} />
                        </Link>
                    )
                })}

                {/* Admin section */}
                {session?.user?.role === "ADMIN" && (
                    <>
                        <div className="my-3 border-t border-white/5" />
                        <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-red-400/50">
                            Admin
                        </p>
                        <Link
                            href={"/admin/tickets" as any}
                            className={cn(
                                "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium border transition-all duration-200",
                                pathname.startsWith("/admin")
                                    ? "border-red-500/20 bg-red-500/10 text-red-400"
                                    : "border-transparent text-muted-foreground hover:text-red-400 hover:bg-red-500/5 hover:border-red-500/20"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "flex h-7 w-7 items-center justify-center rounded-md transition-all",
                                    pathname.startsWith("/admin") ? "bg-red-500/10" : "bg-white/5 group-hover:bg-red-500/10"
                                )}>
                                    <ShieldAlert className="h-3.5 w-3.5 text-red-400" />
                                </div>
                                {tDash('administration')}
                            </div>
                            <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-40 transition-all" />
                        </Link>
                    </>
                )}
            </div>

            {/* User + Logout */}
            <div className="p-3 border-t border-white/5 space-y-2">
                {/* User pill */}
                <div className="flex items-center gap-3 rounded-lg bg-white/5 border border-white/5 px-3 py-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-purple-600/20 text-xs font-bold text-primary ring-1 ring-primary/20">
                        {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">{userName}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{userEmail}</p>
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="group w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground border border-transparent hover:bg-red-500/5 hover:border-red-500/15 hover:text-red-400 transition-all duration-200"
                >
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/5 group-hover:bg-red-500/10 transition-all">
                        <LogOut className="h-3.5 w-3.5 group-hover:text-red-400 transition-colors" />
                    </div>
                    {tDash('logout')}
                </button>
            </div>
        </div>
    )
}
