"use client"

import { useState, useEffect } from "react"
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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link } from "@/i18n/routing"
import { ArrowLeft, ShieldAlert, Search, RefreshCw, ChevronDown, ChevronUp, Eye } from "lucide-react"

interface AuditLog {
    id: string
    action: string
    entity: string
    entityId: string | null
    details: string | null
    userId: string
    ipAddress: string | null
    userAgent: string | null
    createdAt: string
    user: {
        name: string | null
        email: string | null
    } | null
}

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalLogs, setTotalLogs] = useState(0)
    
    // Filters
    const [search, setSearch] = useState("")
    const [actionFilter, setActionFilter] = useState("ALL")
    const [entityFilter, setEntityFilter] = useState("ALL")
    
    // Filter options from API
    const [actionOptions, setActionOptions] = useState<string[]>([])
    const [entityOptions, setEntityOptions] = useState<string[]>([])
    
    // UI states
    const [expandedLogId, setExpandedLogId] = useState<string | null>(null)
    const [isRefreshing, setIsRefreshing] = useState(false)

    useEffect(() => {
        fetchLogs()
    }, [page, actionFilter, entityFilter])

    const fetchLogs = async (isManualRefresh = false) => {
        if (isManualRefresh) setIsRefreshing(true)
        setLoading(true)
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: "20",
                search,
                actionType: actionFilter,
                entityType: entityFilter
            })
            
            const response = await fetch(`/api/admin/audit-logs?${queryParams}`)
            const data = await response.json()
            
            if (data.success) {
                setLogs(data.logs)
                setTotalPages(data.pagination.totalPages)
                setTotalLogs(data.pagination.total)
                
                // Set filter options if not set already
                if (actionOptions.length === 0) setActionOptions(data.filters.actions)
                if (entityOptions.length === 0) setEntityOptions(data.filters.entities)
            }
        } catch (error) {
            console.error("Error fetching audit logs:", error)
        } finally {
            setLoading(false)
            setIsRefreshing(false)
        }
    }

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(1)
        fetchLogs()
    }

    const handleReset = () => {
        setSearch("")
        setActionFilter("ALL")
        setEntityFilter("ALL")
        setPage(1)
    }

    const toggleExpandRow = (logId: string) => {
        if (expandedLogId === logId) {
            setExpandedLogId(null)
        } else {
            setExpandedLogId(logId)
        }
    }

    const getActionBadgeColor = (action: string) => {
        if (action.includes("DELETE")) return "bg-red-500/10 text-red-400 border-red-500/20"
        if (action.includes("CREATE")) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        if (action.includes("UPDATE")) return "bg-blue-500/10 text-blue-400 border-blue-500/20"
        return "bg-slate-500/10 text-slate-400 border-slate-700"
    }

    const formatDetails = (detailsStr: string | null) => {
        if (!detailsStr) return "-"
        try {
            const parsed = JSON.parse(detailsStr)
            return JSON.stringify(parsed, null, 2)
        } catch (e) {
            return detailsStr
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#090d16]/30 border border-white/5 p-6 rounded-2xl backdrop-blur-sm gap-4">
                <div className="flex items-center gap-4">
                    <Link href={"/admin" as any}>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">Rendszernapló (Audit Log)</h1>
                        <p className="text-slate-400 text-sm mt-1">Az adminisztrátorok által végzett biztonsági és üzleti műveletek naplója.</p>
                    </div>
                </div>
                <Button 
                    variant="outline" 
                    onClick={() => fetchLogs(true)} 
                    disabled={isRefreshing}
                    className="border-white/5 bg-[#090d16]/40 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl flex items-center gap-2"
                >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    Frissítés
                </Button>
            </div>

            {/* Filters Bar */}
            <Card className="border border-white/5 bg-[#090d16]/40 rounded-2xl shadow-xl overflow-hidden p-6">
                <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row gap-4 items-end">
                    <div className="w-full lg:flex-1 space-y-2">
                        <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                            <Search className="h-3 w-3" /> Keresés
                        </label>
                        <div className="relative">
                            <Input
                                placeholder="Keresés felhasználóra, entitásra, részletekre..."
                                className="bg-[#0b101c]/60 border-white/5 text-white placeholder-slate-500 rounded-xl"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="w-full sm:w-48 space-y-2">
                        <label className="text-xs font-semibold text-slate-400">Művelet típus</label>
                        <Select value={actionFilter} onValueChange={setActionFilter}>
                            <SelectTrigger className="bg-[#0b101c]/60 border-white/5 text-slate-300 rounded-xl">
                                <SelectValue placeholder="Összes művelet" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0e1626] border-white/5 text-slate-300">
                                <SelectItem value="ALL">Összes művelet</SelectItem>
                                {actionOptions.map(action => (
                                    <SelectItem key={action} value={action}>{action}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="w-full sm:w-48 space-y-2">
                        <label className="text-xs font-semibold text-slate-400">Entitás</label>
                        <Select value={entityFilter} onValueChange={setEntityFilter}>
                            <SelectTrigger className="bg-[#0b101c]/60 border-white/5 text-slate-300 rounded-xl">
                                <SelectValue placeholder="Összes entitás" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0e1626] border-white/5 text-slate-300">
                                <SelectItem value="ALL">Összes entitás</SelectItem>
                                {entityOptions.map(entity => (
                                    <SelectItem key={entity} value={entity}>{entity}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button 
                            type="submit" 
                            className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-medium px-6"
                        >
                            Keresés
                        </Button>
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={handleReset}
                            className="w-full sm:w-auto text-slate-400 hover:text-white hover:bg-white/5 rounded-xl px-4"
                        >
                            Alaphelyzet
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Main Log Table */}
            <Card className="border border-white/5 bg-[#090d16]/40 rounded-2xl shadow-xl overflow-hidden">
                <CardHeader className="bg-[#0b101c]/40 border-b border-white/5 flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                        <CardTitle className="text-base font-bold text-white tracking-wide">Eseménynapló</CardTitle>
                        <CardDescription className="text-slate-400 text-xs">
                            Találatok száma: <span className="text-cyan-400 font-bold">{totalLogs}</span> bejegyzés
                        </CardDescription>
                    </div>
                    <ShieldAlert className="h-5 w-5 text-cyan-500 animate-pulse" />
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-[#0b101c]/60">
                                <TableRow className="border-b border-white/5 hover:bg-transparent">
                                    <TableHead className="text-slate-400 font-bold w-12"></TableHead>
                                    <TableHead className="text-slate-400 font-bold w-48">Dátum</TableHead>
                                    <TableHead className="text-slate-400 font-bold w-48">Felhasználó</TableHead>
                                    <TableHead className="text-slate-400 font-bold w-36">Művelet</TableHead>
                                    <TableHead className="text-slate-400 font-bold w-48">Entitás (Azonosító)</TableHead>
                                    <TableHead className="text-slate-400 font-bold">Részletek</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableCell colSpan={6} className="text-center py-20 text-slate-500">
                                            <div className="flex justify-center items-center gap-2">
                                                <RefreshCw className="h-4 w-4 animate-spin text-cyan-500" />
                                                Bejegyzések betöltése...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : logs.map((log) => {
                                    const isExpanded = expandedLogId === log.id;
                                    return (
                                        <>
                                            <TableRow 
                                                key={log.id} 
                                                onClick={() => toggleExpandRow(log.id)}
                                                className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors"
                                            >
                                                <TableCell className="text-center">
                                                    {isExpanded ? (
                                                        <ChevronUp className="h-4 w-4 text-cyan-500" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4 text-slate-500" />
                                                    )}
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap font-mono text-xs text-slate-400">
                                                    {new Date(log.createdAt).toLocaleString('hu-HU', {
                                                        dateStyle: 'short',
                                                        timeStyle: 'medium'
                                                    })}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-white text-sm">{log.user?.name || "Ismeretlen Admin"}</span>
                                                        <span className="text-[10px] text-slate-400 font-mono">{log.user?.email || "-"}</span>
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
                                                <TableCell className="max-w-[200px]">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="text-xs text-slate-400 truncate block flex-1">
                                                            {log.details || "-"}
                                                        </span>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="h-7 w-7 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg flex-shrink-0"
                                                        >
                                                            <Eye className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            {isExpanded && (
                                                <TableRow key={`${log.id}-expanded`} className="bg-[#0b101c]/30 hover:bg-[#0b101c]/30 border-b border-white/5">
                                                    <TableCell colSpan={6} className="p-6">
                                                        <div className="space-y-4">
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                                                <div className="bg-[#030712]/50 p-3 rounded-lg border border-white/5">
                                                                    <span className="text-slate-500 block mb-1">IP cím</span>
                                                                    <span className="font-mono text-slate-300 font-semibold">{log.ipAddress || "Nem rögzített"}</span>
                                                                </div>
                                                                <div className="bg-[#030712]/50 p-3 rounded-lg border border-white/5 md:col-span-2">
                                                                    <span className="text-slate-500 block mb-1">User Agent</span>
                                                                    <span className="text-slate-300 font-mono block break-all leading-normal">{log.userAgent || "Nem rögzített"}</span>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-1.5">
                                                                <span className="text-xs text-slate-500 block">Végrehajtott változások részletei (JSON)</span>
                                                                <pre className="text-xs bg-[#030712] p-4 rounded-xl border border-white/5 overflow-auto text-cyan-400 font-mono max-h-[350px] leading-relaxed scrollbar-thin">
                                                                    <code>{formatDetails(log.details)}</code>
                                                                </pre>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </>
                                    )
                                })}
                                {!loading && logs.length === 0 && (
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableCell colSpan={6} className="text-center py-16 text-slate-500">
                                            Nincs a szűrési feltételeknek megfelelő naplóbejegyzés.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Controls */}
                    {!loading && totalPages > 1 && (
                        <div className="flex items-center justify-between p-4 bg-[#0b101c]/40 border-t border-white/5 text-xs text-slate-400">
                            <div>
                                Oldal: <span className="text-white font-bold">{page}</span> / <span className="font-semibold">{totalPages}</span> (Összesen {totalLogs} napló)
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="border-white/5 bg-[#090d16]/40 text-slate-300 hover:text-white rounded-lg px-3"
                                >
                                    Előző
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="border-white/5 bg-[#090d16]/40 text-slate-300 hover:text-white rounded-lg px-3"
                                >
                                    Következő
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
