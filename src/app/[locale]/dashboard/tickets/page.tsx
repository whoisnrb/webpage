"use client"

import { useState, useEffect } from "react"
import { TicketStatusBadge } from "@/components/dashboard/TicketStatusBadge"
import { TicketPriorityBadge } from "@/components/dashboard/TicketPriorityBadge"
import { Link } from "@/i18n/routing"
import { Plus, Ticket, ArrowUpRight, Clock, MessageSquare, Loader2, InboxIcon } from "lucide-react"
import { useTranslations } from "next-intl"

interface TicketItem {
    id: string
    ticketNumber: string
    subject: string
    status: string
    priority: string
    createdAt: string
    _count: { replies: number }
    replies: Array<{ content: string; createdAt: string; isStaffReply: boolean }>
}

export default function UserTicketsPage() {
    const tTickets = useTranslations('Tickets')
    const tCommon  = useTranslations('Common')
    const [tickets, setTickets] = useState<TicketItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/ticket/list')
            .then(r => r.json())
            .then(data => { if (data.success) setTickets(data.tickets) })
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="space-y-6 animate-fadeIn">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{tTickets('my_tickets')}</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">{tTickets('manage_tickets')}</p>
                </div>
                <Link href="/dashboard/tickets/new">
                    <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 hover:bg-primary/90 transition-all hover:-translate-y-0.5">
                        <Plus className="h-4 w-4" />
                        {tTickets('new_ticket')}
                    </button>
                </Link>
            </div>

            {/* Table card */}
            <div className="rounded-xl border border-white/5 bg-card/40 backdrop-blur overflow-hidden">
                {/* Card header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                        <Ticket className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-sm">{tTickets('table_title')}</span>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <p className="text-sm">{tCommon('loading')}</p>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-4 py-20">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-muted-foreground/50">
                            <InboxIcon className="h-7 w-7" />
                        </div>
                        <div className="text-center">
                            <p className="font-medium text-sm">{tTickets('no_tickets')}</p>
                            <p className="text-xs text-muted-foreground mt-1">{tTickets('create_first_ticket')}</p>
                        </div>
                        <Link href="/dashboard/tickets/new">
                            <button className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium hover:border-white/20 hover:bg-white/8 transition-all">
                                <Plus className="h-3.5 w-3.5" />
                                {tTickets('new_ticket')}
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {/* Column headers */}
                        <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                            <span>Ticket#</span>
                            <span>{tTickets('subject')}</span>
                            <span>{tTickets('status')}</span>
                            <span>{tTickets('priority')}</span>
                            <span className="hidden sm:block">{tTickets('replies')}</span>
                            <span className="hidden md:block">{tTickets('created_at')}</span>
                        </div>

                        {tickets.map((ticket) => (
                            <Link key={ticket.id} href={`/dashboard/tickets/${ticket.id}`} className="block">
                                <div className="group grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-3.5 hover:bg-white/[0.03] transition-colors">
                                    <span className="font-mono text-xs text-muted-foreground">{ticket.ticketNumber}</span>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{ticket.subject}</p>
                                    </div>
                                    <TicketStatusBadge status={ticket.status} />
                                    <TicketPriorityBadge priority={ticket.priority} />
                                    <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                                        <MessageSquare className="h-3 w-3" />
                                        <span>{ticket._count.replies}</span>
                                    </div>
                                    <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        <span>{new Date(ticket.createdAt).toLocaleDateString('hu-HU')}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
