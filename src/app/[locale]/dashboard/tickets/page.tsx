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
import { Button } from "@/components/ui/button"
import { TicketStatusBadge } from "@/components/dashboard/TicketStatusBadge"
import { TicketPriorityBadge } from "@/components/dashboard/TicketPriorityBadge"
import { Link } from "@/i18n/routing"
import { Plus } from "lucide-react"

interface Ticket {
    id: string
    ticketNumber: string
    subject: string
    status: string
    priority: string
    createdAt: string
    _count: {
        replies: number
    }
    replies: Array<{
        content: string
        createdAt: string
        isStaffReply: boolean
    }>
}

import { useTranslations } from "next-intl"

export default function UserTicketsPage() {
    const tTickets = useTranslations('Tickets')
    const tCommon = useTranslations('Common')
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(true)

    const fetchTickets = async () => {
        const response = await fetch('/api/ticket/list')
        const data = await response.json()
        if (data.success) {
            setTickets(data.tickets)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchTickets()
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{tTickets('my_tickets')}</h2>
                    <p className="text-muted-foreground">{tTickets('manage_tickets')}</p>
                </div>
                <Link href="/dashboard/tickets/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        {tTickets('new_ticket')}
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{tTickets('table_title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-center py-10 text-muted-foreground">{tCommon('loading')}</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ticket#</TableHead>
                                    <TableHead>{tTickets('subject')}</TableHead>
                                    <TableHead>{tTickets('status')}</TableHead>
                                    <TableHead>{tTickets('priority')}</TableHead>
                                    <TableHead>{tTickets('replies')}</TableHead>
                                    <TableHead>{tTickets('created_at')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tickets.map((ticket) => (
                                    <TableRow key={ticket.id} className="cursor-pointer hover:bg-muted/50">
                                        <TableCell className="font-mono text-xs">
                                            <Link href={`/dashboard/tickets/${ticket.id}`} className="hover:underline">
                                                {ticket.ticketNumber}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/dashboard/tickets/${ticket.id}`} className="hover:underline">
                                                {ticket.subject}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <TicketStatusBadge status={ticket.status} />
                                        </TableCell>
                                        <TableCell>
                                            <TicketPriorityBadge priority={ticket.priority} />
                                        </TableCell>
                                        <TableCell>{ticket._count.replies}</TableCell>
                                        <TableCell className="text-sm">
                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {tickets.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                            {tTickets('no_tickets')}
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
