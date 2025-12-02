"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { TicketStatusBadge } from "@/components/dashboard/TicketStatusBadge"
import { TicketPriorityBadge } from "@/components/dashboard/TicketPriorityBadge"
import { ArrowLeft, Send, User, Shield, Clock } from "lucide-react"
import { Link } from "@/i18n/routing"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

interface TicketDetail {
    id: string
    ticketNumber: string
    subject: string
    description: string
    status: string
    priority: string
    createdAt: string
    updatedAt: string
    user: {
        name: string
        email: string
    }
    replies: Array<{
        id: string
        content: string
        createdAt: string
        isStaffReply: boolean
        user: {
            name: string
            role: string
        }
    }>
}

export default function TicketDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [ticket, setTicket] = useState<TicketDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [replyContent, setReplyContent] = useState("")
    const [sending, setSending] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const ticketId = params.id as string

    useEffect(() => {
        if (ticketId) {
            fetchTicket()
        }
    }, [ticketId])

    useEffect(() => {
        scrollToBottom()
    }, [ticket?.replies])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const fetchTicket = async () => {
        try {
            // We can reuse the list API with a filter or create a specific detail API
            // For now, let's assume we need a specific endpoint or we filter client side if the list returns everything (not ideal for scale)
            // But wait, we don't have a detail endpoint yet.
            // Let's create a quick server action or just use a new API route for details.
            // Actually, for now, let's try to fetch from a new endpoint we will create: /api/ticket/[id]
            // OR, simpler: just use a server component?
            // Since this is a client component (for the form), we fetch data.

            // Let's assume we will create /api/ticket/[id]/route.ts or similar.
            // But wait, the plan didn't explicitly say we'd create a detail API for users, just "UI".
            // I should probably create the API route for fetching a single ticket too.

            const response = await fetch(`/api/ticket/${ticketId}`)
            if (!response.ok) throw new Error("Failed to fetch ticket")

            const data = await response.json()
            if (data.success) {
                setTicket(data.ticket)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleReply = async () => {
        if (!replyContent.trim()) return

        setSending(true)
        try {
            const response = await fetch("/api/ticket/reply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ticketId,
                    content: replyContent
                })
            })

            const data = await response.json()

            if (data.success) {
                setReplyContent("")
                fetchTicket() // Refresh to show new reply
            } else {
                alert(data.error || "Hiba történt a válasz küldésekor")
            }
        } catch (error) {
            alert("Hálózati hiba")
        } finally {
            setSending(false)
        }
    }

    if (loading) return <div className="p-10 text-center">Betöltés...</div>
    if (!ticket) return <div className="p-10 text-center">Ticket nem található</div>

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/tickets">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-bold tracking-tight">{ticket.subject}</h2>
                        <span className="text-muted-foreground font-mono text-sm">#{ticket.ticketNumber}</span>
                    </div>
                    <div className="flex gap-3">
                        <TicketStatusBadge status={ticket.status} />
                        <TicketPriorityBadge priority={ticket.priority} />
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(ticket.createdAt).toLocaleDateString('hu-HU')}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {/* Original Ticket Description */}
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-semibold">{ticket.user.name}</div>
                                <div className="text-xs text-muted-foreground">Ügyfél</div>
                            </div>
                            <div className="ml-auto text-xs text-muted-foreground">
                                {new Date(ticket.createdAt).toLocaleString('hu-HU')}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-wrap">{ticket.description}</p>
                    </CardContent>
                </Card>

                <Separator className="my-2" />

                {/* Replies */}
                <div className="space-y-4">
                    {ticket.replies.map((reply) => (
                        <Card key={reply.id} className={reply.isStaffReply ? "border-l-4 border-l-primary ml-8" : "mr-8 bg-muted/30"}>
                            <CardHeader className="pb-2 py-3">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        {reply.isStaffReply ? (
                                            <AvatarFallback className="bg-primary text-primary-foreground">
                                                <Shield className="h-4 w-4" />
                                            </AvatarFallback>
                                        ) : (
                                            <AvatarFallback>
                                                <User className="h-4 w-4" />
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <div>
                                        <div className="font-semibold text-sm flex items-center gap-2">
                                            {reply.user.name}
                                            {reply.isStaffReply && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">SUPPORT</span>}
                                        </div>
                                    </div>
                                    <div className="ml-auto text-xs text-muted-foreground">
                                        {new Date(reply.createdAt).toLocaleString('hu-HU')}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="py-3 text-sm">
                                <p className="whitespace-pre-wrap">{reply.content}</p>
                            </CardContent>
                        </Card>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Reply Input */}
                {ticket.status !== "CLOSED" ? (
                    <Card className="mt-4">
                        <CardContent className="p-4">
                            <div className="space-y-4">
                                <Textarea
                                    placeholder="Írja ide a válaszát..."
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    rows={4}
                                />
                                <div className="flex justify-end">
                                    <Button onClick={handleReply} disabled={sending || !replyContent.trim()}>
                                        {sending ? "Küldés..." : (
                                            <>
                                                <Send className="mr-2 h-4 w-4" />
                                                Válasz küldése
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="text-center p-4 bg-muted rounded-lg text-muted-foreground">
                        Ez a ticket le lett zárva. Ha további kérdése van, kérjük nyisson újat.
                    </div>
                )}
            </div>
        </div>
    )
}
