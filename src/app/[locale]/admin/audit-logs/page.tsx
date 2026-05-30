import { prisma } from "@/lib/db"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { ArrowLeft, ShieldAlert } from "lucide-react"

export const dynamic = 'force-dynamic'

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

    const getActionBadgeColor = (action: string) => {
        if (action.includes("DELETE")) return "bg-red-500/10 text-red-400 border-red-500/20"
        if (action.includes("CREATE")) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        if (action.includes("UPDATE")) return "bg-blue-500/10 text-blue-400 border-blue-500/20"
        return "bg-slate-500/10 text-slate-400 border-slate-700"
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-[#090d16]/30 border border-white/5 p-6 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center gap-4">
                    <Link href={"/admin" as any}>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">Rendszernapló (Audit Log)</h1>
                        <p className="text-slate-400 text-sm mt-1">Az adminisztrátorok által végzett utolsó 50 biztonsági és üzleti művelet naplója.</p>
                    </div>
                </div>
            </div>

            <Card className="border border-white/5 bg-[#090d16]/40 rounded-2xl shadow-xl overflow-hidden">
                <CardHeader className="bg-[#0b101c]/40 border-b border-white/5 flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                        <CardTitle className="text-base font-bold text-white tracking-wide">Biztonsági események</CardTitle>
                        <CardDescription className="text-slate-400 text-xs">Minden változtatás visszavezethető a felelős adminisztrátorig.</CardDescription>
                    </div>
                    <ShieldAlert className="h-5 w-5 text-cyan-500 animate-pulse" />
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-[#0b101c]/60">
                            <TableRow className="border-b border-white/5 hover:bg-transparent">
                                <TableHead className="text-slate-400 font-bold w-48">Dátum</TableHead>
                                <TableHead className="text-slate-400 font-bold w-48">Felhasználó</TableHead>
                                <TableHead className="text-slate-400 font-bold w-48">Művelet</TableHead>
                                <TableHead className="text-slate-400 font-bold">Entitás (Azonosító)</TableHead>
                                <TableHead className="text-slate-400 font-bold">Részletek</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log.id} className="border-b border-white/5 hover:bg-white/[0.01]">
                                    <TableCell className="whitespace-nowrap font-mono text-xs text-slate-400">
                                        {formatDate(log.createdAt)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-white text-sm">{log.user?.name || "Ismeretlen Admin"}</span>
                                            <span className="text-[10px] text-slate-400">{log.user?.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`border px-2 py-0.5 font-mono text-[10px] ${getActionBadgeColor(log.action)}`}>
                                            {log.action}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-medium text-slate-200 text-sm">{log.entity}</span>
                                            {log.entityId && <span className="text-[10px] text-slate-500 font-mono">{log.entityId}</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[300px]">
                                        <code className="text-xs text-slate-300 bg-white/[0.02] border border-white/5 px-2 py-1 rounded block truncate leading-normal" title={log.details || ""}>
                                            {log.details || "-"}
                                        </code>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {logs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-16 text-slate-500">
                                        Nincs megjeleníthető naplóbejegyzés.
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
