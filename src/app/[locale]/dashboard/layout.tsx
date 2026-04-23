import { Sidebar } from "@/components/dashboard/sidebar"
import { UserNav } from "@/components/dashboard/user-nav"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { Link } from "@/i18n/routing"
import { Code2 } from "lucide-react"
import { auth } from "@/auth"

import { getTranslations } from "next-intl/server"

export default async function DashboardLayout({
    children,
    params
}: {
    children: React.ReactNode
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params;
    const tDash = await getTranslations({ locale, namespace: 'Dashboard' })
    const session = await auth()

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#070711]">

            {/* Mobile Header */}
            <div className="md:hidden border-b border-white/5 px-4 py-3 flex items-center justify-between bg-[#080812] sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <MobileNav />
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/20">
                            <Code2 className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="font-bold text-sm">BacklineIT</span>
                    </Link>
                </div>
                <UserNav user={session?.user} />
            </div>

            {/* Sidebar — Desktop */}
            <div className="hidden md:flex md:w-60 md:shrink-0 md:flex-col md:fixed md:inset-y-0 md:left-0 z-30">
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
                {/* Top bar */}
                <header className="hidden md:flex h-14 items-center justify-between border-b border-white/5 bg-[#080812]/80 backdrop-blur px-6 sticky top-0 z-20">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{tDash('client_portal_header')}</span>
                    </div>
                    <UserNav user={session?.user} />
                </header>

                <main className="flex-1 p-5 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
