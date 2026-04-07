import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Ticket, ArrowUpRight, FileText, Briefcase, Clock, Zap, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react"
import { Link } from "@/i18n/routing"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { getLocale, getTranslations } from "next-intl/server"

export default async function DashboardPage() {
    const session = await auth()
    const locale = await getLocale()
    const t = await getTranslations('Dashboard')

    if (!session?.user?.email) {
        redirect(`/${locale}/api/auth/signin`)
    }

    let openTickets = 0
    try {
        openTickets = await prisma.ticket.count({
            where: {
                user: { email: session.user.email },
                status: { in: ['OPEN', 'IN_PROGRESS'] }
            }
        })
    } catch {
        // Ticket table not available yet
    }

    const userName = session.user.name || 'Felhasználó'
    const initials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

    return (
        <div className="space-y-8 animate-fadeIn">

            {/* ── Hero ─────────────────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-[#0d0d1a] via-[#0f1628] to-[#0d0d1a] p-8 md:p-10">
                {/* Animated blobs */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-primary/20 blur-[80px] animate-pulse" />
                    <div className="absolute top-8 right-24 h-40 w-40 rounded-full bg-purple-500/15 blur-[60px] animate-pulse [animation-delay:1s]" />
                    <div className="absolute -bottom-8 right-8 h-48 w-48 rounded-full bg-cyan-500/10 blur-[70px] animate-pulse [animation-delay:2s]" />
                    {/* Subtle grid */}
                    <div className="absolute inset-0 opacity-[0.04]"
                        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                            Ügyfélfiókom aktív
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/60">
                                {t('welcome', { name: userName })}
                            </span>
                        </h2>
                        <p className="text-muted-foreground max-w-lg text-[15px] leading-relaxed">
                            {t('welcome_subtitle')}
                        </p>
                    </div>

                    {/* Avatar circle */}
                    <div className="shrink-0 hidden md:flex h-20 w-20 items-center justify-center rounded-full border border-primary/30 bg-gradient-to-br from-primary/20 to-purple-600/20 text-2xl font-bold text-primary shadow-lg shadow-primary/10">
                        {initials}
                    </div>
                </div>
            </div>

            {/* ── Stats ─────────────────────────────────────────────── */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Open Tickets */}
                <div className="group relative overflow-hidden rounded-xl border border-orange-500/10 bg-card/50 backdrop-blur p-5 transition-all duration-300 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/5 hover:-translate-y-0.5">
                    <div className="absolute top-0 right-0 h-24 w-24 -mr-6 -mt-6 rounded-full bg-orange-500/5 transition-all duration-500 group-hover:bg-orange-500/10" />
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                            <Ticket className="h-5 w-5" />
                        </div>
                        <span className="text-xs text-muted-foreground border border-white/5 rounded-full px-2 py-0.5 bg-white/5">Élő</span>
                    </div>
                    <div className="text-3xl font-bold mb-1">{openTickets}</div>
                    <div className="text-sm text-muted-foreground">{t('open_tickets')}</div>
                    <div className="mt-3 text-xs text-orange-400/70 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {t('waiting_for_reply')}
                    </div>
                </div>

                {/* Response time */}
                <div className="group relative overflow-hidden rounded-xl border border-emerald-500/10 bg-card/50 backdrop-blur p-5 transition-all duration-300 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5">
                    <div className="absolute top-0 right-0 h-24 w-24 -mr-6 -mt-6 rounded-full bg-emerald-500/5 transition-all duration-500 group-hover:bg-emerald-500/10" />
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                            <Clock className="h-5 w-5" />
                        </div>
                        <span className="text-xs text-muted-foreground border border-white/5 rounded-full px-2 py-0.5 bg-white/5">SLA</span>
                    </div>
                    <div className="text-3xl font-bold mb-1">&lt; 24h</div>
                    <div className="text-sm text-muted-foreground">Válaszidő garancia</div>
                    <div className="mt-3 text-xs text-emerald-400/70 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Munkanapokon garantált
                    </div>
                </div>

                {/* Active services */}
                <div className="group relative overflow-hidden rounded-xl border border-blue-500/10 bg-card/50 backdrop-blur p-5 transition-all duration-300 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5 sm:col-span-2 lg:col-span-1">
                    <div className="absolute top-0 right-0 h-24 w-24 -mr-6 -mt-6 rounded-full bg-blue-500/5 transition-all duration-500 group-hover:bg-blue-500/10" />
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                        <span className="text-xs text-muted-foreground border border-white/5 rounded-full px-2 py-0.5 bg-white/5">Portfólió</span>
                    </div>
                    <div className="text-3xl font-bold mb-1">20+</div>
                    <div className="text-sm text-muted-foreground">Elérhető megoldás</div>
                    <div className="mt-3 text-xs text-blue-400/70 flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        Folyamatosan bővülő
                    </div>
                </div>
            </div>

            {/* ── Quick Actions ──────────────────────────────────────── */}
            <div>
                <div className="flex items-center gap-3 mb-5">
                    <h3 className="text-lg font-semibold">{t('quick_actions')}</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-border/50 to-transparent" />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {/* New ticket */}
                    <Link href="/dashboard/tickets/new">
                        <div className="group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-white/5 bg-card/40 p-5 backdrop-blur transition-all duration-300 hover:border-orange-500/30 hover:bg-card/70 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/5 cursor-pointer h-full">
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex items-center justify-between">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 text-orange-500 ring-1 ring-orange-500/20 transition-all group-hover:ring-orange-500/40">
                                    <Ticket className="h-5 w-5" />
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 transition-all group-hover:text-orange-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm mb-0.5">{t('open_ticket')}</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">{t('need_help')}</p>
                            </div>
                        </div>
                    </Link>

                    {/* Browse solutions */}
                    <Link href="/megoldasok">
                        <div className="group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-white/5 bg-card/40 p-5 backdrop-blur transition-all duration-300 hover:border-blue-500/30 hover:bg-card/70 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/5 cursor-pointer h-full">
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex items-center justify-between">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 text-blue-500 ring-1 ring-blue-500/20 transition-all group-hover:ring-blue-500/40">
                                    <Briefcase className="h-5 w-5" />
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 transition-all group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm mb-0.5">Megoldások böngészése</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">Fedezze fel szolgáltatásainkat</p>
                            </div>
                        </div>
                    </Link>

                    {/* Request consultation */}
                    <Link href="/konzultacio">
                        <div className="group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-white/5 bg-card/40 p-5 backdrop-blur transition-all duration-300 hover:border-emerald-500/30 hover:bg-card/70 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/5 cursor-pointer h-full">
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex items-center justify-between">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 text-emerald-500 ring-1 ring-emerald-500/20 transition-all group-hover:ring-emerald-500/40">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 transition-all group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm mb-0.5">Konzultáció kérése</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">Egyedi ajánlatkérés</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* ── Info Banner ────────────────────────────────────────── */}
            <div className="rounded-xl border border-primary/10 bg-primary/5 p-5 flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Zap className="h-5 w-5" />
                </div>
                <div>
                    <p className="font-medium text-sm">Szüksége van segítségre?</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Csapatunk munkanapokon 9–18 óra között elérhető. Nyisson jegyet, vagy kérjen ingyenes konzultációt!
                    </p>
                </div>
                <Link href="/dashboard/tickets/new" className="ml-auto shrink-0">
                    <div className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
                        Jegyet nyit <ArrowUpRight className="h-3 w-3" />
                    </div>
                </Link>
            </div>
        </div>
    )
}
