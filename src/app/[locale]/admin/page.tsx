import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ShoppingCart, DollarSign, TrendingUp } from "lucide-react"
import { prisma } from "@/lib/db"
import { DashboardCharts } from "@/components/admin/dashboard-charts"

async function getStats() {
    const userCount = await prisma.user.count()
    const leadCount = await prisma.lead.count()
    // Placeholder for order stats until Order model is fully populated
    const orderCount = await prisma.order.count()

    return {
        userCount,
        leadCount,
        orderCount,
        revenue: 0 // Placeholder
    }
}

export default async function AdminPage() {
    const stats = await getStats()

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Vezérlőpult</h2>
                <p className="text-muted-foreground">Áttekintés a rendszer állapotáról.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Összes Felhasználó</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.userCount}</div>
                        <p className="text-xs text-muted-foreground">+20.1% az elmúlt hónapban</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Aktív Lead-ek</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.leadCount}</div>
                        <p className="text-xs text-muted-foreground">+180.1% az elmúlt hónapban</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rendelések</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.orderCount}</div>
                        <p className="text-xs text-muted-foreground">+19% az elmúlt hónapban</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bevétel</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.revenue} Ft</div>
                        <p className="text-xs text-muted-foreground">+201 az elmúlt órában</p>
                    </CardContent>
                </Card>
            </div>
            <DashboardCharts />
        </div>
    )
}
