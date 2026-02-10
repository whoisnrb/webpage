import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma as db } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/admin/overview"
import { DollarSign, Users, CreditCard, Activity } from "lucide-react"

export default async function AdminDashboardPage() {
    const session = await auth()

    // In a real app, check for admin role
    if (!session?.user) {
        redirect("/login")
    }

    // Fetch stats
    const consultationCount = await db.consultation.count()

    const newConsultations = await db.consultation.count({
        where: { status: 'NEW' }
    })

    const activeProducts = await db.product.count({
        where: { active: true }
    })

    const userCount = await db.user.count()

    // Mock data for charts
    const graphData = [
        { name: "Jan", total: 12 },
        { name: "Feb", total: 15 },
        { name: "Már", total: 18 },
        { name: "Ápr", total: 24 },
        { name: "Máj", total: 30 },
        { name: "Jún", total: 28 },
        { name: "Júl", total: 35 },
        { name: "Aug", total: 40 },
        { name: "Szep", total: 45 },
        { name: "Okt", total: 50 },
        { name: "Nov", total: 55 },
        { name: "Dec", total: 60 },
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
                            Összes Konzultáció
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{consultationCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Beérkezett igények
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Új Igények
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{newConsultations}</div>
                        <p className="text-xs text-muted-foreground">
                            Feldolgozásra vár
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Aktív Megoldások</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeProducts}</div>
                        <p className="text-xs text-muted-foreground">
                            Publikált csomagok
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Felhasználók
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Regisztrált fiókok
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Aktivitás</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Overview data={graphData} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
