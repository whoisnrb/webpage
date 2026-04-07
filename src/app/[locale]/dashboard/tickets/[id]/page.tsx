"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { TicketStatusBadge } from "@/components/dashboard/TicketStatusBadge"
import { TicketPriorityBadge } from "@/components/dashboard/TicketPriorityBadge"
import { ArrowLeft, Send, User, Shield, Clock, Loader2, MessageSquare } from "lucide-react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

interface TicketDetail {
    id: string
    ticketNumber: string
    subject: string
    description: string
    status: string
    priority: string
    createdAt: string
    updatedAt: string
    user: { name: string; email: string }
    replies: Array<{
        id: string
        content: string
        createdAt: string
        isStaffReply: boolean
        user: { name: string; role: string }
    }>
}

export default function TicketDetailPage() {
    const tTickets = useTranslations('Tickets')
    const tCommon  = useTranslations('Common')
    const params   = useParams()
    const ticketId = params.id as string

    const [ticket, setTicket]             = useState<TicketDetail | null>(null)
    const [loading, setLoading]           = useState(true)
    const [replyContent, setReplyContent] = useState("")
    const [sending, setSending]           = useState(false)
    const messagesEndRef                  = useRef<HTMLDivElement>(null)

    const fetchTicket = async () => {
        try {
            const res = await fetch(`/api/ticket/${ticketId}`)
            const data = await res.json()
            if (data.success) setTicket(data.ticket)
        } catch { /* ignore */ } finally { setLoading(false) }
    }

    useEffect(() => { if (ticketId) fetchTicket() }, [ticketId])
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }) }, [ticket?.replies])

    const handleReply = async () => {
        if (!replyContent.trim()) return
        setSending(true)
        try {
            const res  = await fetch("/api/ticket/reply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticketId, content: replyContent }),
            })
            const data = await res.json()
            if (data.success) { setReplyContent(""); fetchTicket() }
            else alert(data.error || tTickets('error_create', { error: "" }))
        } catch { alert(tCommon('network_error')) }
        finally { setSending(false) }
    }

    if (loading) return (
        <div className="flex items-center justify-center gap-3 py-24 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm">{tCommon('loading')}</span>
        </div>
    )
    if (!ticket) return (
        <div className="flex flex-col items-center justify-center gap-2 py-24 text-muted-foreground">
            <MessageSquare className="h-8 w-8 opacity-30" />
            <p className="text-sm">{tTickets('not_found')}</p>
        </div>
    )

    return (
        <div className="space-y-6 max-w-3xl mx-auto animate-fadeIn">

            {/* Back + Title */}
            <div className="flex items-start gap-3">
                <Link href="/dashboard/tickets">
                    <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all">
                        <ArrowLeft className="h-4 w-4" />
                    </div>
                </Link>
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-mono text-xs text-muted-foreground/60 border border-white/8 bg-white/5 rounded px-2 py-0.5">
                            #{ticket.ticketNumber}
                        </span>
                        <TicketStatusBadge status={ticket.status} />
                        <TicketPriorityBadge priority={ticket.priority} />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">{ticket.subject}</h2>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(ticket.createdAt).toLocaleString('hu-HU')}
                    </p>
                </div>
            </div>

            {/* Thread */}
            <div className="space-y-3">

                {/* Original message */}
                <MessageBubble
                    name={ticket.user.name}
                    time={ticket.createdAt}
                    content={ticket.description}
                    isStaff={false}
                    isOriginal
                />

                {/* Replies */}
                {ticket.replies.map(reply => (
                    <MessageBubble
                        key={reply.id}
                        name={reply.user.name}
                        time={reply.createdAt}
                        content={reply.content}
                        isStaff={reply.isStaffReply}
                        staffLabel={tTickets('support_label')}
                        clientLabel={tTickets('client_label')}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Reply input */}
            {ticket.status !== "CLOSED" ? (
                <div className="rounded-xl border border-white/5 bg-card/40 backdrop-blur overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{tTickets('send_reply')}</span>
                    </div>
                    <div className="p-4 space-y-3">
                        <Textarea
                            placeholder={tTickets('reply_placeholder')}
                            value={replyContent}
                            onChange={e => setReplyContent(e.target.value)}
                            rows={4}
                            className="bg-white/5 border-white/8 focus:border-primary/50 resize-none transition-colors"
                            onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleReply() }}
                        />
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground/50">Ctrl+Enter a küldéshez</p>
                            <button
                                onClick={handleReply}
                                disabled={sending || !replyContent.trim()}
                                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                {sending
                                    ? <><Loader2 className="h-4 w-4 animate-spin" />{tCommon('sending')}</>
                                    : <><Send className="h-4 w-4" />{tTickets('send_reply')}</>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="rounded-xl border border-white/5 bg-white/5 px-5 py-4 text-center text-sm text-muted-foreground">
                    {tTickets('closed_message')}
                </div>
            )}
        </div>
    )
}

function MessageBubble({ name, time, content, isStaff, isOriginal, staffLabel, clientLabel }: {
    name: string; time: string; content: string; isStaff: boolean
    isOriginal?: boolean; staffLabel?: string; clientLabel?: string
}) {
    return (
        <div className={cn(
            "rounded-xl border p-4 transition-all",
            isStaff
                ? "border-primary/15 bg-primary/5 ml-6"
                : isOriginal
                    ? "border-white/8 bg-white/[0.03]"
                    : "border-white/5 bg-white/[0.02] mr-6"
        )}>
            <div className="flex items-center gap-3 mb-3">
                <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shrink-0",
                    isStaff
                        ? "bg-gradient-to-br from-primary/30 to-purple-600/20 text-primary ring-1 ring-primary/20"
                        : "bg-white/10 text-foreground/60 ring-1 ring-white/10"
                )}>
                    {isStaff ? <Shield className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold">{name}</span>
                        {isStaff && staffLabel && (
                            <span className="text-[10px] font-medium bg-primary/10 text-primary rounded-full px-2 py-0.5 border border-primary/20">
                                {staffLabel}
                            </span>
                        )}
                        {!isStaff && clientLabel && !isOriginal && (
                            <span className="text-[10px] font-medium bg-white/5 text-muted-foreground rounded-full px-2 py-0.5 border border-white/10">
                                {clientLabel}
                            </span>
                        )}
                        {isOriginal && (
                            <span className="text-[10px] font-medium bg-white/5 text-muted-foreground rounded-full px-2 py-0.5">
                                Eredeti üzenet
                            </span>
                        )}
                    </div>
                </div>
                <span className="text-xs text-muted-foreground/50 shrink-0 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(time).toLocaleString('hu-HU')}
                </span>
            </div>
            <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed pl-11">{content}</p>
        </div>
    )
}
