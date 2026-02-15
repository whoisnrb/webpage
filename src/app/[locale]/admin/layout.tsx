import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getLocale } from "next-intl/server"
import { Link } from "@/i18n/routing"
import { LayoutDashboard, Users, Settings, LogOut, Package, Ticket, Activity, Clock, ToggleLeft, BarChart3, Briefcase, Banknote, FileText } from "lucide-react"
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
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-muted/30 border-r hidden md:flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold tracking-tight">Admin Panel</h1>
                    <p className="text-xs text-muted-foreground">BacklineIT</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin">
                        <Button variant="ghost" className="w-full justify-start">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Vezérlőpult
                        </Button>
                    </Link>
                    <Link href="/admin/consultations">
                        <Button variant="ghost" className="w-full justify-start">
                            <FileText className="mr-2 h-4 w-4" />
                            Konzultációk
                        </Button>
                    </Link>
                    <Link href="/admin/crm">
                        <Button variant="ghost" className="w-full justify-start">
                            <Briefcase className="mr-2 h-4 w-4" />
                            CRM
                        </Button>
                    </Link>
                    <Link href="/admin/leads">
                        <Button variant="ghost" className="w-full justify-start">
                            <Users className="mr-2 h-4 w-4" />
                            Leads (Régi)
                        </Button>
                    </Link>
                    <Link href="/admin/tickets">
                        <Button variant="ghost" className="w-full justify-start">
                            <Ticket className="mr-2 h-4 w-4" />
                            Support Tickets
                        </Button>
                    </Link>
                    <Link href="/admin/careers">
                        <Button variant="ghost" className="w-full justify-start">
                            <Briefcase className="mr-2 h-4 w-4" />
                            Jelentkezések
                        </Button>
                    </Link>
                    <Link href="/admin/products">
                        <Button variant="ghost" className="w-full justify-start">
                            <Package className="mr-2 h-4 w-4" />
                            Megoldások
                        </Button>
                    </Link>
                    <Link href="/admin/services">
                        <Button variant="ghost" className="w-full justify-start">
                            <Banknote className="mr-2 h-4 w-4" />
                            Szolgáltatások
                        </Button>
                    </Link>
                    <Link href="/admin/blog">
                        <Button variant="ghost" className="w-full justify-start">
                            <FileText className="mr-2 h-4 w-4" />
                            Blog
                        </Button>
                    </Link>
                    <Link href="/admin/audit-logs">
                        <Button variant="ghost" className="w-full justify-start">
                            <Activity className="mr-2 h-4 w-4" />
                            Audit Log
                        </Button>
                    </Link>
                    <Link href="/admin/cron-jobs">
                        <Button variant="ghost" className="w-full justify-start">
                            <Clock className="mr-2 h-4 w-4" />
                            Cron Jobs
                        </Button>
                    </Link>
                    <Link href="/admin/features">
                        <Button variant="ghost" className="w-full justify-start">
                            <ToggleLeft className="mr-2 h-4 w-4" />
                            Feature Flags
                        </Button>
                    </Link>
                    <Link href="/admin/analytics">
                        <Button variant="ghost" className="w-full justify-start">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Analytics
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button variant="ghost" className="w-full justify-start">
                            <Settings className="mr-2 h-4 w-4" />
                            Felhasználói fiók
                        </Button>
                    </Link>
                </nav>
                <div className="p-4 border-t">
                    <form action={async () => {
                        "use server"
                        // Import signOut dynamically or use a client component for logout if needed
                        // For now, redirecting to api/auth/signout is simplest
                        // We need to handle locale in server action too, but getLocale works there
                        // However, redirect in server action might need absolute path or just work
                        // Let's try simple redirect first, but we need locale
                        // const locale = await getLocale() // Cannot use await in sync server action if not async
                        // But this is an async server action
                        // redirect(`/${locale}/api/auth/signout`)
                        // Actually api routes are not localized usually?
                        // If /api/auth/signout is a NextAuth route, it might not be under [locale]
                        // Let's assume /api is root.
                        redirect("/api/auth/signout")
                    }}>
                        <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                            <LogOut className="mr-2 h-4 w-4" />
                            Kijelentkezés
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
