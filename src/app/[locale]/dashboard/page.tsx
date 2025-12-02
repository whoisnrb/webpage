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

    // Try to get ticket count, fallback to 0 if table doesn't exist yet
    let openTickets = 0
    try {
        openTickets = await prisma.ticket.count({
            where: {
                user: {
                    email: session.user.email
                },
                status: {
                    in: ['OPEN', 'IN_PROGRESS']
                }
            }
        })
    } catch (error) {
        console.log('Ticket table not available yet')
    }

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/10 p-8 md:p-12">
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                        Üdvözöljük újra, {session.user.name || 'Felhasználó'}!
                    </h2>
                    <p className="text-muted-foreground max-w-xl text-lg">
                        Itt áttekintheted a vásárlásaidat, kezelheted a licenceidet és segítséget kérhetsz a support csapattól.
                    </p>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/10 to-transparent opacity-50 blur-3xl" />
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="relative overflow-hidden border-primary/20 bg-card/50 backdrop-blur transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                    <div className="absolute right-0 top-0 p-4 opacity-10">
                        <ShoppingBag className="h-24 w-24" />
                    </div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Összes Vásárlás</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{purchaseCount} db</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(totalSpend)} értékben
                        </p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-blue-500/20 bg-card/50 backdrop-blur transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5">
                    <div className="absolute right-0 top-0 p-4 opacity-10">
                        <Key className="h-24 w-24 text-blue-500" />
                    </div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Aktív Licencek</CardTitle>
                        <Key className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{activeLicenses} db</div>
                        <p className="text-xs text-muted-foreground mt-1">0 hamarosan lejár</p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-orange-500/20 bg-card/50 backdrop-blur transition-all hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/5">
                    <div className="absolute right-0 top-0 p-4 opacity-10">
                        <Ticket className="h-24 w-24 text-orange-500" />
                    </div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Nyitott Jegyek</CardTitle>
                        <Ticket className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{openTickets} db</div>
                        <p className="text-xs text-muted-foreground mt-1">Válaszra vár</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Purchases */}
                <Card className="col-span-4 border-none bg-transparent shadow-none">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold">Legutóbbi Vásárlások</h3>
                        <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-primary">
                            <Link href="/dashboard/purchases">
                                Összes megtekintése <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {orders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl bg-card/50">
                                <ShoppingBag className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
                                <p className="text-muted-foreground">Még nem történt vásárlás.</p>
                                <Button variant="link" asChild className="mt-2">
                                    <Link href="/arak">Irány a bolt</Link>
                                </Button>
                            </div>
                        ) : (
                            orders.slice(0, 5).map((order) => (
                                <div key={order.id} className="group flex items-center p-4 rounded-xl border bg-card/50 hover:bg-card hover:border-primary/50 transition-all">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg group-hover:scale-110 transition-transform">
                                        WP
                                    </div>
                                    <div className="ml-4 space-y-1">
                                        <p className="font-medium leading-none">Rendelés #{order.orderRef}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(order.createdAt).toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="ml-auto font-bold text-lg">
                                        {new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(order.totalAmount)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Quick Actions */}
                <div className="col-span-3 space-y-6">
                    <h3 className="text-xl font-semibold">Gyors Műveletek</h3>
                    <div className="grid gap-4">
                        <Link href="/dashboard/tickets/new">
                            <div className="group flex items-center p-4 rounded-xl border bg-card/50 hover:bg-card hover:border-primary/50 transition-all cursor-pointer">
                                <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                    <Ticket className="h-5 w-5" />
                                </div>
                                <div className="ml-4">
                                    <p className="font-medium">Hibajegy nyitása</p>
                                    <p className="text-xs text-muted-foreground">Segítségre van szükséged?</p>
                                </div>
                                <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        </Link>

                        <div className="group flex items-center p-4 rounded-xl border bg-card/50 hover:bg-card hover:border-primary/50 transition-all cursor-pointer">
                            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <Key className="h-5 w-5" />
                            </div>
                            <div className="ml-4">
                                <p className="font-medium">Licenc aktiválása</p>
                                <p className="text-xs text-muted-foreground">Új kulcs beváltása</p>
                            </div>
                            <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>

                        <Link href="/arak">
                            <div className="group flex items-center p-4 rounded-xl border bg-card/50 hover:bg-card hover:border-primary/50 transition-all cursor-pointer">
                                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                                    <ShoppingBag className="h-5 w-5" />
                                </div>
                                <div className="ml-4">
                                    <p className="font-medium">Böngészés a boltban</p>
                                    <p className="text-xs text-muted-foreground">Új szolgáltatások vásárlása</p>
                                </div>
                                <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
