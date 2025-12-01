import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma as db } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Package, Calendar, CreditCard } from "lucide-react"
import { Link } from "@/i18n/routing"
import { FadeIn, SlideUp } from "@/components/ui/motion-wrapper"

export default async function DashboardPage() {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    const orders = await db.order.findMany({
        where: {
            userId: session.user.id
        },
        include: {
            items: {
                include: {
                    product: true
                }
            },
            licenses: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return (
        <div className="min-h-screen py-20">
            <div className="container mx-auto px-4">
                <FadeIn>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Fiókom</h1>
                            <p className="text-muted-foreground">
                                Üdvözöljük, {session.user.name || session.user.email}!
                            </p>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="/api/auth/signout">Kijelentkezés</Link>
                        </Button>
                    </div>
                </FadeIn>

                <div className="grid gap-8">
                    <section>
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <Package className="h-5 w-5 text-primary" />
                            Korábbi Rendelések
                        </h2>

                        {orders.length === 0 ? (
                            <Card>
                                <CardContent className="py-10 text-center text-muted-foreground">
                                    Még nem vásároltál semmit. Nézz körül a <Link href="/termekek" className="text-primary hover:underline">termékeink</Link> között!
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-6">
                                {orders.map((order, index) => (
                                    <SlideUp key={order.id} delay={index * 0.1}>
                                        <Card className="overflow-hidden border-primary/10">
                                            <CardHeader className="bg-muted/30 flex flex-row items-center justify-between py-4">
                                                <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <span>{new Date(order.createdAt).toLocaleDateString('hu-HU')}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-medium">{order.totalAmount.toLocaleString('hu-HU')} Ft</span>
                                                    </div>
                                                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${order.status === 'PAID' ? 'bg-green-500/10 text-green-500' :
                                                        order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                                                            'bg-red-500/10 text-red-500'
                                                        }`}>
                                                        {order.status === 'PAID' ? 'Fizetve' :
                                                            order.status === 'PENDING' ? 'Függőben' : 'Megszakítva'}
                                                    </div>
                                                </div>
                                                <div className="text-xs text-muted-foreground font-mono">
                                                    #{order.id.slice(-8)}
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                <div className="space-y-6">
                                                    {order.items.map((item) => (
                                                        <div key={item.id} className="flex justify-between items-center">
                                                            <div>
                                                                <div className="font-medium">{item.product.name}</div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {item.quantity} db x {item.price.toLocaleString('hu-HU')} Ft
                                                                </div>
                                                            </div>
                                                            {/* License Key Display if available for this product */}
                                                            {order.status === 'PAID' && order.licenses.some(l => l.productId === item.productId) && (
                                                                <div className="text-right">
                                                                    <div className="text-xs text-muted-foreground mb-1">Licenckulcs:</div>
                                                                    <code className="bg-muted px-2 py-1 rounded text-xs font-mono select-all">
                                                                        {order.licenses.find(l => l.productId === item.productId)?.key}
                                                                    </code>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>

                                                {order.status === 'PAID' && (
                                                    <div className="mt-6 pt-6 border-t flex gap-4">
                                                        <Button variant="outline" size="sm" className="gap-2">
                                                            <Download className="h-4 w-4" />
                                                            Számla letöltése
                                                        </Button>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </SlideUp>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    )
}
