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

export default async function AdminConsultationsPage() {
    const consultations = await prisma.consultation.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            product: true
        }
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Konzultációs Igények</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Beérkezett igények listája</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Dátum</TableHead>
                                <TableHead>Érdeklődő</TableHead>
                                <TableHead>Elérhetőség</TableHead>
                                <TableHead>Megoldás / Csomag</TableHead>
                                <TableHead>Leírás</TableHead>
                                <TableHead>Státusz</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {consultations.length > 0 ? (
                                consultations.map((consultation) => (
                                    <TableRow key={consultation.id}>
                                        <TableCell className="whitespace-nowrap">
                                            {new Date(consultation.createdAt).toLocaleDateString('hu-HU')}
                                            <br />
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(consultation.createdAt).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{consultation.name}</span>
                                                {consultation.company && (
                                                    <span className="text-xs text-muted-foreground">{consultation.company}</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm">
                                                <a href={`mailto:${consultation.email}`} className="hover:underline">{consultation.email}</a>
                                                {consultation.phone && (
                                                    <a href={`tel:${consultation.phone}`} className="text-xs text-muted-foreground hover:underline">{consultation.phone}</a>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{consultation.product ? consultation.product.name : 'Nincs kiválasztva'}</span>
                                                {consultation.packageName && (
                                                    <Badge variant="outline" className="w-fit mt-1 text-xs">
                                                        {consultation.packageName}
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-[300px]">
                                            <p className="truncate text-sm text-muted-foreground" title={consultation.description}>
                                                {consultation.description}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                consultation.status === 'NEW' ? 'default' :
                                                    consultation.status === 'CONTACTED' ? 'secondary' :
                                                        consultation.status === 'CLOSED' ? 'outline' : 'destructive'
                                            }>
                                                {consultation.status === 'NEW' ? 'Új' :
                                                    consultation.status === 'CONTACTED' ? 'Kapcsolatfelvétel' :
                                                        consultation.status === 'CLOSED' ? 'Lezárva' : consultation.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                        Nincs megjeleníthető konzultációs igény.
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
