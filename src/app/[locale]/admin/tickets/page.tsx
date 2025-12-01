"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TicketStatusBadge } from "@/components/dashboard/TicketStatusBadge"
import { TicketPriorityBadge } from "@/components/dashboard/TicketPriorityBadge"
import { Link } from "@/i18n/routing"

interface Ticket {
    id: string
    ticketNumber: string
    subject: string
    status: string
    priority: string
    category: string
    createdAt: string
    user: {
        name: string | null
        email: string
    }
    _count: {
        replies: number
    }
}

export default function AdminTicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState("")
    const [priorityFilter, setPriorityFilter] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("")
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        fetchTickets()
    }, [statusFilter, priorityFilter, categoryFilter, searchQuery])

    const fetchTickets = async () => {
        setLoading(true)
        const params = new URLSearchParams()
        if (statusFilter) params.append('status', statusFilter)
        if (priorityFilter) params.append('priority', priorityFilter)
        if (categoryFilter) params.append('category', categoryFilter)
        if (searchQuery) params.append('search', searchQuery)

        const response = await fetch(`/api/admin/ticket/list?${params.toString()}`)
        const data = await response.json()
        if (data.success) {
            setTickets(data.tickets)
        }
        setLoading(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Szűrők</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Input
                            placeholder="Keresés..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Státusz" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=" ">Minden</SelectItem>
                                <SelectItem value="OPEN">Nyitott</SelectItem>
                                <SelectItem value="IN_PROGRESS">Folyamatban</SelectItem>
                                <SelectItem value="WAITING_FOR_CUSTOMER">Ügyfélre vár</SelectItem>
                                <SelectItem value="RESOLVED">Megoldva</SelectItem>
                                <SelectItem value="CLOSED">Lezárva</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Prioritás" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=" ">Minden</SelectItem>
                                <SelectItem value="LOW">Alacsony</SelectItem>
                                <SelectItem value="MEDIUM">Közepes</SelectItem>
                                <SelectItem value="HIGH">Magas</SelectItem>
                                <SelectItem value="URGENT">Sürgős</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Kategória" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=" ">Minden</SelectItem>
                                <SelectItem value="TECHNICAL">技nikai</SelectItem>
                                <SelectItem value="BILLING">Számlázás</SelectItem>
                                <SelectItem value="GENERAL">Általános</SelectItem>
                                <SelectItem value="BUG_REPORT">Hibajelentés</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Összes ticket</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-center py-10 text-muted-foreground">Betöltés...</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ticket#</TableHead>
                                    <TableHead>Tárgy</TableHead>
                                    <TableHead>Ügyfél</TableHead>
                                    <TableHead>Státusz</TableHead>
                                    <TableHead>Prioritás</TableHead>
                                    <TableHead>Válaszok</TableHead>
                                    <TableHead>Létrehozva</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tickets.map((ticket) => (
                                    <TableRow key={ticket.id} className="cursor-pointer hover:bg-muted/50">
                                        <TableCell className="font-mono text-xs">
                                            <Link href={`/admin/tickets/${ticket.id}`} className="hover:underline">
                                                {ticket.ticketNumber}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/admin/tickets/${ticket.id}`} className="hover:underline">
                                                {ticket.subject}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm">{ticket.user.name || 'N/A'}</span>
                                                <span className="text-xs text-muted-foreground">{ticket.user.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <TicketStatusBadge status={ticket.status} />
                                        </TableCell>
                                        <TableCell>
                                            <TicketPriorityBadge priority={ticket.priority} />
                                        </TableCell>
                                        <TableCell>{ticket._count.replies}</TableCell>
                                        <TableCell className="text-sm">
                                            {new Date(ticket.createdAt).toLocaleDateString('hu-HU')}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {tickets.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                            Nincs megjeleníthető ticket.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
