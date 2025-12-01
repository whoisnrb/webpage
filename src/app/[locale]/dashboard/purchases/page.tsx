import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"

export default async function PurchasesPage() {
    const session = await auth()

    if (!session?.user?.email) {
        redirect("/api/auth/signin")
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

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Vásárlások</h2>
                <p className="text-muted-foreground">Korábbi rendeléseid és számláid.</p>
            </div>

            <div className="grid gap-4">
                {orders.length === 0 ? (
                    <p className="text-muted-foreground">Még nem történt vásárlás.</p>
                ) : (
                    orders.map((order) => (
                        <Card key={order.id}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="space-y-1">
                                    <CardTitle className="text-base font-medium">
                                        {order.totalAmount === 199000 ? 'Starter csomag' :
                                            order.totalAmount === 449000 ? 'Professional csomag' :
                                                'Egyedi csomag'}
                                    </CardTitle>
                                    <CardDescription>#{order.orderRef} • {new Date(order.createdAt).toLocaleDateString('hu-HU')}</CardDescription>
                                </div>
                                <Badge variant="outline">Fizetve</Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex gap-2">
                                        <Badge variant="secondary">Licenc</Badge>
                                        <span className="text-sm font-medium self-center">
                                            {new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(order.totalAmount)}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" disabled>
                                            <FileText className="mr-2 h-4 w-4" />
                                            Számla
                                        </Button>
                                        <Button size="sm" disabled>
                                            <Download className="mr-2 h-4 w-4" />
                                            Letöltés
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
