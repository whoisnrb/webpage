import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ShoppingCart, DollarSign, TrendingUp } from "lucide-react"
import { prisma } from "@/lib/db"
import { DashboardCharts } from "@/components/admin/dashboard-charts"
import { getTranslations } from "next-intl/server"

async function getStats() {
    const userCount = await prisma.user.count()
    const leadCount = await prisma.lead.count()
    // Placeholder for order stats until Order model is fully populated
    const consultationCount = await prisma.consultation.count()

    return {
        userCount,
        leadCount,
        consultationCount,
        revenue: 0 // Placeholder
    }
}

export default async function AdminPage() {
    const t = await getTranslations("Admin.dashboard")
    const stats = await getStats()

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
                <p className="text-muted-foreground">{t("subtitle")}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("total_users")}</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.userCount}</div>
                        <p className="text-xs text-muted-foreground">{t("growth_monthly", { value: "20.1" })}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("active_leads")}</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.leadCount}</div>
                        <p className="text-xs text-muted-foreground">{t("growth_monthly", { value: "180.1" })}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Konzultációk</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.consultationCount}</div>
                        <p className="text-xs text-muted-foreground">{t("growth_monthly", { value: "19" })}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("revenue")}</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.revenue} Ft</div>
                        <p className="text-xs text-muted-foreground">{t("growth_hourly", { value: "201" })}</p>
                    </CardContent>
                </Card>
            </div>
            <DashboardCharts />
        </div>
    )
}
