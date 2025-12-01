import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, Key, Ticket, ArrowUpRight } from "lucide-react"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { getLocale } from "next-intl/server"

export default async function DashboardPage() {
    const session = await auth()

    if (!session?.user?.email) {
        const locale = await getLocale()
        redirect(`/${locale}/api/auth/signin`)
    }

    const orders = await prisma.order.findMany({
        where: {
            customerEmail: session.user.email,
            status: 'SUCCESS'
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const totalSpend = orders.reduce((acc, order) => acc + order.totalAmount, 0)
    const purchaseCount = orders.length

    // Mock data for licenses and tickets as they don't exist in DB yet
    const activeLicenses = await prisma.license.count({
        where: {
            user: {
                email: session.user.email
            },
            status: 'ACTIVE'
        }
    })
    const openTickets = 0

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Áttekintés</h2>
                <p className="text-muted-foreground">Üdvözöljük újra, {session.user.name || 'Felhasználó'}!</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Vásárlások</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{purchaseCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Összesen {new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(totalSpend)} értékben
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Aktív Licencek</CardTitle>
                        <Key className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeLicenses}</div>
                        <p className="text-xs text-muted-foreground">0 hamarosan lejár</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Nyitott Jegyek</CardTitle>
                        <Ticket className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{openTickets}</div>
                        <p className="text-xs text-muted-foreground">Válaszra vár</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Legutóbbi Vásárlások</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {orders.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Még nem történt vásárlás.</p>
                            ) : (
                                orders.slice(0, 5).map((order) => (
                                    <div key={order.id} className="flex items-center">
                                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                            WP
                                        </div>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">Rendelés #{order.orderRef}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(order.createdAt).toLocaleDateString('hu-HU')}
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium">
                                            {new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(order.totalAmount)}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="mt-6">
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/dashboard/purchases">
                                    Összes vásárlás <ArrowUpRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Gyors Műveletek</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button className="w-full justify-start" variant="outline">
                            <Key className="mr-2 h-4 w-4" />
                            Új licenc aktiválása
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                            <Ticket className="mr-2 h-4 w-4" />
                            Hibajegy nyitása
                        </Button>
                        <Button className="w-full justify-start" variant="outline" asChild>
                            <Link href="/arak">
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                Böngészés a boltban
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
