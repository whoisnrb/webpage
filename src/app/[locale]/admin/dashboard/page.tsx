import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma as db } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/admin/overview"
import { RecentSales } from "@/components/admin/recent-sales"
import { DollarSign, Users, CreditCard, Activity } from "lucide-react"

export default async function AdminDashboardPage() {
    const session = await auth()

    // In a real app, check for admin role
    if (!session?.user) {
        redirect("/login")
    }

    // Fetch stats
    const totalRevenue = await db.order.aggregate({
        where: { status: 'PAID' },
        _sum: { totalAmount: true }
    })

    const salesCount = await db.order.count({
        where: { status: 'PAID' }
    })

    const activeProducts = await db.product.count({
        where: { active: true }
    })

    // Mock data for charts (replace with real aggregation in production)
    const graphData = [
        { name: "Jan", total: 4500 },
        { name: "Feb", total: 3200 },
        { name: "Már", total: 5100 },
        { name: "Ápr", total: 4800 },
        { name: "Máj", total: 6000 },
        { name: "Jún", total: 5500 },
        { name: "Júl", total: 4900 },
        { name: "Aug", total: 5200 },
        { name: "Szep", total: 5800 },
        { name: "Okt", total: 6100 },
        { name: "Nov", total: 5900 },
        { name: "Dec", total: 6300 },
    ]

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Vezérlőpult</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Összes Bevétel
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{(totalRevenue._sum.totalAmount || 0).toLocaleString('hu-HU')} Ft</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% az előző hónaphoz képest
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Eladások
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{salesCount}</div>
                        <p className="text-xs text-muted-foreground">
                            +180.1% az előző hónaphoz képest
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Aktív Termékek</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{activeProducts}</div>
                        <p className="text-xs text-muted-foreground">
                            +2 új termék ebben a hónapban
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Aktív Felhasználók
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+573</div>
                        <p className="text-xs text-muted-foreground">
                            +201 az elmúlt órában
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Áttekintés</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Overview data={graphData} />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Legutóbbi Eladások</CardTitle>
                        <CardDescription>
                            Ebben a hónapban 265 eladás történt.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RecentSales />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
