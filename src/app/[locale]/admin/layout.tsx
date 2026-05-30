import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getLocale } from "next-intl/server"
import { Link } from "@/i18n/routing"
import { LayoutDashboard, Users, Settings, LogOut, Package, Ticket, Activity, Clock, ToggleLeft, BarChart3, Briefcase, Banknote, FileText, MessageSquare, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session?.user || session.user.role !== "ADMIN") {
        const locale = await getLocale()
        redirect(`/${locale}/`)
    }

    return (
        <div className="flex min-h-screen bg-[#030712] text-slate-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-[#090d16] border-r border-white/5 hidden md:flex flex-col shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.4)]">
                {/* Header */}
                <div className="p-6 border-b border-white/5 bg-[#0b101c]/40 backdrop-blur-md flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_#06b6d4]" />
                        <h1 className="text-lg font-bold tracking-wider uppercase bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                            Admin Panel
                        </h1>
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-cyan-400/70 font-semibold">
                        BacklineIT Core v2.0
                    </p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar">
                    {/* Fő vezérlőpult */}
                    <div className="space-y-1.5">
                        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Kezelőfelület</p>
                        <Link href={"/admin" as any}>
                            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl transition-all duration-300">
                                <LayoutDashboard className="h-4 w-4 text-cyan-400" />
                                <span className="text-sm font-medium">Vezérlőpult</span>
                            </Button>
                        </Link>
                    </div>

                    {/* Kapcsolatok és igények */}
                    <div className="space-y-1.5">
                        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Ügyfélkapcsolatok</p>
                        
                        <Link href={"/admin/contact-messages" as any}>
                            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-cyan-500/10 hover:border-cyan-500/20 border border-transparent rounded-xl transition-all duration-300">
                                <MessageSquare className="h-4 w-4 text-cyan-400" />
                                <span className="text-sm font-medium">Kapcsolat üzenetek</span>
                            </Button>
                        </Link>

                        <Link href={"/admin/inquiries" as any}>
                            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl transition-all duration-300">
                                <FileText className="h-4 w-4 text-cyan-400" />
                                <span className="text-sm font-medium">Megkeresések</span>
                            </Button>
                        </Link>

                        <Link href={"/admin/consultations" as any}>
                            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl transition-all duration-300">
                                <Clock className="h-4 w-4 text-cyan-400" />
                                <span className="text-sm font-medium">Konzultációk</span>
                            </Button>
                        </Link>

                        <Link href={"/admin/crm" as any}>
                            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl transition-all duration-300">
                                <Users className="h-4 w-4 text-cyan-400" />
                                <span className="text-sm font-medium">CRM</span>
                            </Button>
                        </Link>
                    </div>

                    {/* Operatív */}
                    <div className="space-y-1.5">
                        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Operáció</p>
                        
                        <Link href={"/admin/projects" as any}>
                            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl transition-all duration-300">
                                <Folder className="h-4 w-4 text-blue-400" />
                                <span className="text-sm font-medium">Ügyfél Projektek</span>
                            </Button>
                        </Link>

                        <Link href={"/admin/careers" as any}>
                            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl transition-all duration-300">
                                <Briefcase className="h-4 w-4 text-cyan-400" />
                                <span className="text-sm font-medium">Jelentkezések</span>
                            </Button>
                        </Link>

                        <Link href={"/admin/tickets" as any}>
                            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl transition-all duration-300">
                                <Ticket className="h-4 w-4 text-cyan-400" />
                                <span className="text-sm font-medium">Support Tickets</span>
                            </Button>
                        </Link>
                    </div>

                    {/* Tartalomkezelés */}
                    <div className="space-y-1.5">
                        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Tartalom</p>
                        
                        <Link href={"/admin/services" as any}>
                            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl transition-all duration-300">
                                <Banknote className="h-4 w-4 text-cyan-400" />
                                <span className="text-sm font-medium">Szolgáltatások</span>
                            </Button>
                        </Link>

                        <Link href={"/admin/products" as any}>
                            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl transition-all duration-300">
                                <Package className="h-4 w-4 text-cyan-400" />
                                <span className="text-sm font-medium">Megoldások</span>
                            </Button>
                        </Link>

                        <Link href={"/admin/references" as any}>
                            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl transition-all duration-300">
                                <FileText className="h-4 w-4 text-cyan-400" />
                                <span className="text-sm font-medium">Referenciák</span>
                            </Button>
                        </Link>

                        <Link href={"/admin/blog" as any}>
                            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl transition-all duration-300">
                                <FileText className="h-4 w-4 text-cyan-400" />
                                <span className="text-sm font-medium">Blog</span>
                            </Button>
                        </Link>
                    </div>

                    {/* Rendszer */}
                    <div className="space-y-1.5">
                        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Rendszer</p>
                        
                        <Link href={"/admin/audit-logs" as any}>
                            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl transition-all duration-300">
                                <Activity className="h-4 w-4 text-cyan-400" />
                                <span className="text-sm font-medium">Audit Log</span>
                            </Button>
                        </Link>

                        <Link href={"/admin/cron-jobs" as any}>
                            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl transition-all duration-300">
                                <Clock className="h-4 w-4 text-cyan-400" />
                                <span className="text-sm font-medium">Cron Jobs</span>
                            </Button>
                        </Link>

                        <Link href={"/admin/features" as any}>
                            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl transition-all duration-300">
                                <ToggleLeft className="h-4 w-4 text-cyan-400" />
                                <span className="text-sm font-medium">Feature Flags</span>
                            </Button>
                        </Link>

                        <Link href={"/admin/analytics" as any}>
                            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl transition-all duration-300">
                                <BarChart3 className="h-4 w-4 text-cyan-400" />
                                <span className="text-sm font-medium">Analytics</span>
                            </Button>
                        </Link>

                        <Link href={"/dashboard" as any}>
                            <Button variant="ghost" className="w-full justify-start gap-3 text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl transition-all duration-300">
                                <Settings className="h-4 w-4 text-cyan-400" />
                                <span className="text-sm font-medium">Felhasználói fiók</span>
                            </Button>
                        </Link>
                    </div>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-white/5 bg-[#0b101c]/30">
                    <form action={async () => {
                        "use server"
                        redirect("/api/auth/signout")
                    }}>
                        <Button variant="outline" className="w-full justify-start gap-3 border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/40 rounded-xl transition-all duration-300">
                            <LogOut className="h-4 w-4" />
                            Kijelentkezés
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-[#060814] via-[#090d1a] to-[#04060f]">
                <div className="max-w-7xl mx-auto space-y-6">
                    {children}
                </div>
            </main>
        </div>
    )
}
