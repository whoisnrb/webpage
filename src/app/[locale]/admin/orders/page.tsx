import { prisma } from "@/lib/db"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            user: true,
            items: {
                include: {
                    product: true
                }
            }
        }
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Rendelések</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Összes rendelés</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Rendelés ID</TableHead>
                                <TableHead>Vásárló</TableHead>
                                <TableHead>Dátum</TableHead>
                                <TableHead>Státusz</TableHead>
                                <TableHead>Összeg</TableHead>
                                <TableHead>Termékek</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono text-xs">{order.orderRef}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{order.customerName || order.user?.name || 'N/A'}</span>
                                            <span className="text-xs text-muted-foreground">{order.customerEmail}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{new Date(order.createdAt).toLocaleDateString('hu-HU')}</TableCell>
                                    <TableCell>
                                        <Badge variant={order.status === 'SUCCESS' ? 'default' : order.status === 'PENDING' ? 'secondary' : 'destructive'}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(order.totalAmount)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            {order.items.map((item, index) => (
                                                <span key={index} className="text-xs bg-muted px-2 py-1 rounded w-fit">
                                                    {item.product.name} (x{item.quantity})
                                                </span>
                                            ))}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {orders.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                        Nincs megjeleníthető rendelés.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
