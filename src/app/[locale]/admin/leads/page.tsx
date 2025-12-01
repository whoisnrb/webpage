import { prisma } from "@/lib/db"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

async function getLeads() {
    return await prisma.lead.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })
}

export default async function LeadsPage() {
    const leads = await getLeads()

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Leads</h2>
                <p className="text-muted-foreground">A feliratkozók listája.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Összes Feliratkozó ({leads.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Dátum</TableHead>
                                <TableHead>Név</TableHead>
                                <TableHead>E-mail</TableHead>
                                <TableHead>Forrás</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leads.map((lead) => (
                                <TableRow key={lead.id}>
                                    <TableCell className="font-medium">
                                        {new Date(lead.createdAt).toLocaleDateString('hu-HU')}
                                    </TableCell>
                                    <TableCell>{lead.name || '-'}</TableCell>
                                    <TableCell>{lead.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{lead.source}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
