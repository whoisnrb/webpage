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
import { TicketStatusBadge } from "@/components/dashboard/TicketStatusBadge"
import { TicketPriorityBadge } from "@/components/dashboard/TicketPriorityBadge"
import { Link } from "@/i18n/routing"
import { Search, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Ticket {
    id: string
    ticketNumber: string
    subject: string
    status: string
    priority: string
    createdAt: string
    updatedAt: string
    user: {
        name: string
        email: string
    }
    assignedTo: {
        name: string
    } | null
    _count: {
        replies: number
    }
}

export default function AdminTicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")

    useEffect(() => {
        fetchTickets()
    }, [])

    useEffect(() => {
        let result = tickets

        if (search) {
            const lowerSearch = search.toLowerCase()
            result = result.filter(t =>
                t.ticketNumber.toLowerCase().includes(lowerSearch) ||
                t.subject.toLowerCase().includes(lowerSearch) ||
                t.user.name.toLowerCase().includes(lowerSearch) ||
                t.user.email.toLowerCase().includes(lowerSearch)
            )
        }

        if (statusFilter !== "ALL") {
            result = result.filter(t => t.status === statusFilter)
        }

        setFilteredTickets(result)
    }, [search, statusFilter, tickets])

    const fetchTickets = async () => {
        try {
            const response = await fetch('/api/admin/ticket/list')
            const data = await response.json()
            if (data.success) {
                setTickets(data.tickets)
                setFilteredTickets(data.tickets)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Ticket Kezelés</h2>
                    <p className="text-muted-foreground">Összes beérkezett hibajegy és kérés</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Keresés (ID, tárgy, ügyfél)..."
                                className="pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="w-full md:w-48">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Státusz szűrés" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Összes státusz</SelectItem>
                                    <SelectItem value="OPEN">Nyitott</SelectItem>
                                    <SelectItem value="IN_PROGRESS">Folyamatban</SelectItem>
                                    <SelectItem value="WAITING_FOR_CUSTOMER">Ügyfélre vár</SelectItem>
                                    <SelectItem value="CLOSED">Lezárt</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-center py-10 text-muted-foreground">Betöltés...</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ticket#</TableHead>
                                    <TableHead>Ügyfél</TableHead>
                                    <TableHead>Tárgy</TableHead>
                                    <TableHead>Státusz</TableHead>
                                    <TableHead>Prioritás</TableHead>
                                    <TableHead>Felelős</TableHead>
                                    <TableHead>Frissítve</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTickets.map((ticket) => (
                                    <TableRow key={ticket.id} className="cursor-pointer hover:bg-muted/50">
                                        <TableCell className="font-mono text-xs">
                                            <Link href={`/admin/tickets/${ticket.id}`} className="hover:underline">
                                                {ticket.ticketNumber}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{ticket.user.name}</span>
                                                <span className="text-xs text-muted-foreground">{ticket.user.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/admin/tickets/${ticket.id}`} className="hover:underline font-medium">
                                                {ticket.subject}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <TicketStatusBadge status={ticket.status} />
                                        </TableCell>
                                        <TableCell>
                                            <TicketPriorityBadge priority={ticket.priority} />
                                        </TableCell>
                                        <TableCell>
                                            {ticket.assignedTo ? (
                                                <span className="text-sm">{ticket.assignedTo.name}</span>
                                            ) : (
                                                <span className="text-xs text-muted-foreground italic">Nincs hozzárendelve</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {new Date(ticket.updatedAt).toLocaleDateString('hu-HU')}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredTickets.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                            Nincs a keresésnek megfelelő ticket.
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
