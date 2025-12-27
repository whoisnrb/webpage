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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { RunCronButton } from "./run-button"

// Helper for date formatting
const formatDate = (date: Date | null) => {
    if (!date) return "-"
    return new Intl.DateTimeFormat('hu-HU', {
        dateStyle: 'short',
        timeStyle: 'medium'
    }).format(date)
}

export default async function CronJobsPage() {
    const jobs = await prisma.cronJob.findMany({
        orderBy: { name: 'asc' },
        include: {
            _count: {
                select: { logs: true }
            }
        }
    })

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Cron Job Manager</CardTitle>
                    <CardDescription>Időzített feladatok kezelése és állapotuk.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Név</TableHead>
                                <TableHead>Ütemezés</TableHead>
                                <TableHead>Endpoint</TableHead>
                                <TableHead>Állapot</TableHead>
                                <TableHead>Utolsó futás</TableHead>
                                <TableHead>Logs</TableHead>
                                <TableHead className="text-right">Műveletek</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {jobs.map((job) => (
                                <TableRow key={job.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{job.name}</span>
                                            <span className="text-xs text-muted-foreground">{job.description}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-mono">
                                            {job.schedule}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">
                                        {job.endpoint}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={job.status === 'RUNNING' ? 'default' : job.status === 'ERROR' ? 'destructive' : 'outline'}>
                                            {job.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {formatDate(job.lastRun)}
                                    </TableCell>
                                    <TableCell>
                                        {job._count.logs}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <RunCronButton jobId={job.id} />
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
