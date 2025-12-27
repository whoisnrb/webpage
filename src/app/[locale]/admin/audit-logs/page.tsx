import { prisma } from "@/lib/db"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns" // Accessing installed date-fns if available, otherwise native date
import { Badge } from "@/components/ui/badge"

// Helper for simple formatting if date-fns is not desired or checked
const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('hu-HU', {
        dateStyle: 'short',
        timeStyle: 'medium'
    }).format(date)
}

export default async function AuditLogsPage() {
    const logs = await prisma.auditLog.findMany({
        take: 50,
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    })

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Audit Log</CardTitle>
                    <CardDescription>Az utolsó 50 adminisztrátori művelet listája.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Dátum</TableHead>
                                <TableHead>Felhasználó</TableHead>
                                <TableHead>Művelet</TableHead>
                                <TableHead>Entitás</TableHead>
                                <TableHead>Részletek</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="whitespace-nowrap text-muted-foreground text-xs">
                                        {formatDate(log.createdAt)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{log.user?.name || "Unknown"}</span>
                                            <span className="text-xs text-muted-foreground">{log.user?.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{log.action}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{log.entity}</span>
                                            {log.entityId && <span className="text-xs text-muted-foreground font-mono">{log.entityId}</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <code className="text-xs bg-muted p-1 rounded break-all max-w-[200px] block truncate">
                                            {log.details || "-"}
                                        </code>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {logs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        Nincs megjeleníthető adat.
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
