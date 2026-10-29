import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Clock, FileText, Briefcase, Banknote, Activity, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/db"
import { DashboardCharts } from "@/components/admin/dashboard-charts"
import { Link } from "@/i18n/routing"

async function getStats() {
    // 1. Megkeresések (ServiceInquiry)
    const inquiriesCount = await prisma.serviceInquiry.count()
    
    // 2. Új kapcsolatfelvételek (ContactMessage status === "NEW")
    const newContactsCount = await prisma.contactMessage.count({
        where: { status: "NEW" }
    })
    
    // 3. Konzultációk (Consultation)
    const consultationCount = await prisma.consultation.count()

    // 4. Jelentkezések (JobApplication)
    const applicationCount = await prisma.jobApplication.count()

    // 5. Szolgáltatások száma (Service)
    const serviceCount = await prisma.service.count()

    // 6. Audit logs
    const auditLogCount = await prisma.auditLog.count()

    return {
        inquiriesCount,
        newContactsCount,
        consultationCount,
        applicationCount,
        serviceCount,
        auditLogCount
    }
}

async function getMonthlyStats() {
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
    sixMonthsAgo.setDate(1)
    sixMonthsAgo.setHours(0,0,0,0)

    const inquiries = await prisma.serviceInquiry.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true }
    })

    const contactMessages = await prisma.contactMessage.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true }
    })

    const monthNames = ["Jan", "Feb", "Már", "Ápr", "Máj", "Jún", "Júl", "Aug", "Sze", "Okt", "Nov", "Dec"]
    const monthlyDataMap: Record<string, { name: string, inquiries: number, contacts: number }> = {}

    for (let i = 0; i < 6; i++) {
        const d = new Date()
        d.setMonth(d.getMonth() - i)
        const monthLabel = monthNames[d.getMonth()]
        const key = `${d.getFullYear()}-${d.getMonth()}`
        monthlyDataMap[key] = { name: monthLabel, inquiries: 0, contacts: 0 }
    }

    inquiries.forEach(inq => {
        const date = new Date(inq.createdAt)
        const key = `${date.getFullYear()}-${date.getMonth()}`
        if (monthlyDataMap[key]) {
            monthlyDataMap[key].inquiries++
        }
    })

    contactMessages.forEach(msg => {
        const date = new Date(msg.createdAt)
        const key = `${date.getFullYear()}-${date.getMonth()}`
        if (monthlyDataMap[key]) {
            monthlyDataMap[key].contacts++
        }
    })

    return Object.values(monthlyDataMap).reverse()
}

async function getTicketWeeklyStats() {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    sevenDaysAgo.setHours(0,0,0,0)

    const tickets = await prisma.ticket.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        select: { createdAt: true, status: true }
    })

    const dayNames = ["Vas", "Hét", "Ked", "Sze", "Csü", "Pén", "Szo"]
    const dailyMap: Record<string, { name: string, new: number, solved: number }> = {}

    for (let i = 0; i < 7; i++) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const dayLabel = dayNames[d.getDay()]
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
        dailyMap[key] = { name: dayLabel, new: 0, solved: 0 }
    }

    tickets.forEach(ticket => {
        const date = new Date(ticket.createdAt)
        const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
        if (dailyMap[key]) {
            dailyMap[key].new++
            if (ticket.status === "CLOSED" || ticket.status === "RESOLVED") {
                dailyMap[key].solved++
            }
        }
    })

    return Object.values(dailyMap).reverse()
}

export default async function AdminPage() {
    const stats = await getStats()
    const monthlyData = await getMonthlyStats()
    const ticketWeeklyData = await getTicketWeeklyStats()

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-[#090d16]/30 border border-white/5 p-6 rounded-2xl backdrop-blur-sm">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">Vezérlőpult</h2>
                    <p className="text-slate-400 text-sm mt-1">Valós idejű statisztikák és a rendszer állapota.</p>
                </div>
                <div className="text-xs font-mono text-cyan-400 bg-cyan-950/30 border border-cyan-800/30 rounded-full px-3 py-1 animate-pulse">
                    Live Syncing
                </div>
            </div>

            {/* AI Marketing Autopilot Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-[#0d1024] to-cyan-950/30 p-6 shadow-xl backdrop-blur-sm">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                                <Sparkles className="h-3 w-3 text-purple-400 animate-pulse" />
                                Új Funkció • Azure OpenAI GPT-4o
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-tight">AI Marketing Autopilot</h3>
                        <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
                            Generálj egyetlen kattintással SEO-optimalizált szakmai blogcikkeket, azonnal másolható LinkedIn posztokat és DALL-E képi koncepciókat a BacklineIT brandjéhez igazítva.
                        </p>
                    </div>
                    <Link href={"/admin/marketing" as any} className="shrink-0">
                        <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-purple-500/25 border border-purple-400/40 rounded-xl px-5 py-2.5 flex items-center gap-2 transition-all duration-300 cursor-pointer">
                            <Sparkles className="h-4 w-4" />
                            Autopilot megnyitása
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Link href={"/admin/inquiries" as any} className="block group">
                    <Card className="border border-white/5 bg-[#090d16]/40 group-hover:bg-[#0b111e]/60 group-hover:border-cyan-500/30 transition-all duration-300 rounded-2xl shadow-lg shadow-black/20 group-hover:shadow-cyan-500/5 cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <span className="text-sm font-semibold tracking-wide text-slate-400 uppercase">Összes megkeresés</span>
                            <FileText className="h-5 w-5 text-cyan-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-white">{stats.inquiriesCount}</div>
                            <p className="text-xs text-cyan-400/80 mt-1 font-medium">Beérkezett projekt árajánlatkérések</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href={"/admin/contact-messages" as any} className="block group">
                    <Card className="border border-white/5 bg-[#090d16]/40 group-hover:bg-[#0b111e]/60 group-hover:border-emerald-500/30 transition-all duration-300 rounded-2xl shadow-lg shadow-black/20 group-hover:shadow-emerald-500/5 cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <span className="text-sm font-semibold tracking-wide text-slate-400 uppercase">Új kapcsolat üzenet</span>
                            <MessageSquare className="h-5 w-5 text-emerald-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-white">{stats.newContactsCount}</div>
                            <p className="text-xs text-emerald-400/80 mt-1 font-medium">Olvasatlan üzenetek & foglalások</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href={"/admin/consultations" as any} className="block group">
                    <Card className="border border-white/5 bg-[#090d16]/40 group-hover:bg-[#0b111e]/60 group-hover:border-yellow-500/30 transition-all duration-300 rounded-2xl shadow-lg shadow-black/20 group-hover:shadow-yellow-500/5 cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <span className="text-sm font-semibold tracking-wide text-slate-400 uppercase">Konzultációs igények</span>
                            <Clock className="h-5 w-5 text-yellow-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-white">{stats.consultationCount}</div>
                            <p className="text-xs text-yellow-400/80 mt-1 font-medium">Megoldás alapú egyeztetések</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href={"/admin/careers" as any} className="block group">
                    <Card className="border border-white/5 bg-[#090d16]/40 group-hover:bg-[#0b111e]/60 group-hover:border-blue-500/30 transition-all duration-300 rounded-2xl shadow-lg shadow-black/20 group-hover:shadow-blue-500/5 cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <span className="text-sm font-semibold tracking-wide text-slate-400 uppercase">Jelentkezések</span>
                            <Briefcase className="h-5 w-5 text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-white">{stats.applicationCount}</div>
                            <p className="text-xs text-blue-400/80 mt-1 font-medium">Állásra jelentkező szakemberek</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href={"/admin/services" as any} className="block group">
                    <Card className="border border-white/5 bg-[#090d16]/40 group-hover:bg-[#0b111e]/60 group-hover:border-purple-500/30 transition-all duration-300 rounded-2xl shadow-lg shadow-black/20 group-hover:shadow-purple-500/5 cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <span className="text-sm font-semibold tracking-wide text-slate-400 uppercase">Szolgáltatások száma</span>
                            <Banknote className="h-5 w-5 text-purple-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-white">{stats.serviceCount}</div>
                            <p className="text-xs text-purple-400/80 mt-1 font-medium">Aktív portfólió elemek</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href={"/admin/audit-logs" as any} className="block group">
                    <Card className="border border-white/5 bg-[#090d16]/40 group-hover:bg-[#0b111e]/60 group-hover:border-orange-500/30 transition-all duration-300 rounded-2xl shadow-lg shadow-black/20 group-hover:shadow-orange-500/5 cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <span className="text-sm font-semibold tracking-wide text-slate-400 uppercase">Aktivitások</span>
                            <Activity className="h-5 w-5 text-orange-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-white">{stats.auditLogCount}</div>
                            <p className="text-xs text-orange-400/80 mt-1 font-medium">Naplózott admin események</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Dynamic Charts */}
            <DashboardCharts monthlyData={monthlyData} ticketData={ticketWeeklyData} />
        </div>
    )
}
