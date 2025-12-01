import { Sidebar } from "@/components/dashboard/sidebar"
import { UserNav } from "@/components/dashboard/user-nav"
import { Code2 } from "lucide-react"
import { Link } from "@/i18n/routing"
import { auth } from "@/auth"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden border-b p-4 flex items-center justify-between bg-background">
                <Link href="/" className="flex items-center gap-2">
                    <Code2 className="h-6 w-6 text-primary" />
                    <span className="font-bold">BacklineIT</span>
                </Link>
                <UserNav user={session?.user} />
            </div>

            {/* Sidebar (Desktop) */}
            <div className="hidden md:block w-64 shrink-0">
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen bg-muted/30">
                <header className="hidden md:flex h-16 items-center justify-between border-b bg-background px-6">
                    <h1 className="text-lg font-semibold">Dashboard</h1>
                    <UserNav user={session?.user} />
                </header>
                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
