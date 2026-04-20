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
import { InquiryManager } from "./inquiry-manager"
import { CreditCard, History, Plus } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function AdminInquiriesPage() {
    const inquiries = await prisma.serviceInquiry.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "NEW": return <Badge>Új</Badge>
            case "QUOTED": return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Kiküldve</Badge>
            case "PAID": return <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">Fizetve</Badge>
            case "COMPLETED": return <Badge variant="outline">Teljesítve</Badge>
            case "CANCELLED": return <Badge variant="destructive">Törölve</Badge>
            default: return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Szolgáltatás Megkeresések</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Összes kérés</CardTitle>
                        <Plus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inquiries.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Fizetésre vár</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">
                            {inquiries.filter(i => i.status === "QUOTED").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Lezárt projektek</CardTitle>
                        <History className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">
                            {inquiries.filter(i => i.status === "PAID" || i.status === "COMPLETED").length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Megkeresések kezelése</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Dátum</TableHead>
                                <TableHead>Ügyfél</TableHead>
                                <TableHead>Szolgáltatás</TableHead>
                                <TableHead>Büdzsé</TableHead>
                                <TableHead>Státusz</TableHead>
                                <TableHead>Fizetés</TableHead>
                                <TableHead className="text-right">Művelet</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inquiries.length > 0 ? (
                                inquiries.map((inquiry) => (
                                    <TableRow key={inquiry.id}>
                                        <TableCell className="whitespace-nowrap">
                                            {new Date(inquiry.createdAt).toLocaleDateString('hu-HU')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{inquiry.name}</span>
                                                <span className="text-xs text-muted-foreground">{inquiry.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{inquiry.serviceType}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {inquiry.budget || "-"}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(inquiry.status)}
                                        </TableCell>
                                        <TableCell>
                                            {inquiry.stripePaymentLink ? (
                                                <Badge variant="secondary" title={inquiry.stripePaymentLink}>
                                                    Van link
                                                </Badge>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">Nincs link</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <InquiryManager inquiry={inquiry} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                        Még nem érkezett szolgáltatás megkeresés.
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
