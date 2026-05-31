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
        id: string
        name: string
    } | null
    _count: {
        replies: number
    }
}

export default function AdminTicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
    const [admins, setAdmins] = useState<Array<{ id: string; name: string }>>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")

    useEffect(() => {
        fetchTickets()
        fetchAdmins()
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

    const fetchAdmins = async () => {
        try {
            const response = await fetch('/api/admin/users')
            const data = await response.json()
            if (data.success) {
                setAdmins(data.users)
            }
        } catch (error) {
            console.error("Admins fetch error:", error)
        }
    }

    const handleStatusChange = async (ticketId: string, newStatus: string) => {
        try {
            const response = await fetch('/api/admin/ticket/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticketId, status: newStatus })
            })
            const data = await response.json()
            if (data.success) {
                setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t))
            } else {
                alert(data.error || "Hiba történt a státusz frissítésekor")
            }
        } catch (error) {
            alert("Hálózati hiba")
        }
    }

    const handleAssigneeChange = async (ticketId: string, newAssigneeId: string) => {
        try {
            const response = await fetch('/api/admin/ticket/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticketId, assignedToId: newAssigneeId })
            })
            const data = await response.json()
            if (data.success) {
                const assignedAdmin = admins.find(a => a.id === newAssigneeId)
                setTickets(prev => prev.map(t => t.id === ticketId ? { 
                    ...t, 
                    assignedTo: assignedAdmin ? { id: assignedAdmin.id, name: assignedAdmin.name } : null 
                } : t))
            } else {
                alert(data.error || "Hiba történt a felelős frissítésekor")
            }
        } catch (error) {
            alert("Hálózati hiba")
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
                                            <Link href={`/admin/tickets/${ticket.id}` as any} className="hover:underline">
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
                                            <Link href={`/admin/tickets/${ticket.id}` as any} className="hover:underline font-medium">
                                                {ticket.subject}
                                            </Link>
                                        </TableCell>
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <Select 
                                                value={ticket.status} 
                                                onValueChange={(val) => handleStatusChange(ticket.id, val)}
                                            >
                                                <SelectTrigger className="w-[145px] h-8 text-xs font-semibold py-0">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="OPEN">Nyitott</SelectItem>
                                                    <SelectItem value="IN_PROGRESS">Folyamatban</SelectItem>
                                                    <SelectItem value="WAITING_FOR_CUSTOMER">Ügyfélre vár</SelectItem>
                                                    <SelectItem value="RESOLVED">Megoldva</SelectItem>
                                                    <SelectItem value="CLOSED">Lezárva</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <TicketPriorityBadge priority={ticket.priority} />
                                        </TableCell>
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <Select 
                                                value={ticket.assignedTo?.id || "unassigned"} 
                                                onValueChange={(val) => handleAssigneeChange(ticket.id, val)}
                                            >
                                                <SelectTrigger className="w-[165px] h-8 text-xs py-0">
                                                    <SelectValue placeholder="Nincs hozzárendelve" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="unassigned">Nincs hozzárendelve</SelectItem>
                                                    {admins.map((admin) => (
                                                        <SelectItem key={admin.id} value={admin.id}>
                                                            {admin.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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
