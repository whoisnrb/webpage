"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { TicketStatusBadge } from "@/components/dashboard/TicketStatusBadge"
import { TicketPriorityBadge } from "@/components/dashboard/TicketPriorityBadge"
import { ArrowLeft, Send, User, Shield, Clock, Save } from "lucide-react"
import { Link } from "@/i18n/routing"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useSession } from "next-auth/react"

interface TicketDetail {
    id: string
    ticketNumber: string
    subject: string
    description: string
    status: string
    priority: string
    category: string
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

export default function AdminTicketDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { data: session } = useSession()
    const [ticket, setTicket] = useState<TicketDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [replyContent, setReplyContent] = useState("")
    const [sending, setSending] = useState(false)
    const [updating, setUpdating] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Edit states
    const [status, setStatus] = useState("")
    const [priority, setPriority] = useState("")

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
            // Reusing the user API endpoint since admins have access to it too
            // But wait, the user API checks for ownership OR admin role. So it works.
            const response = await fetch(`/api/ticket/${ticketId}`)
            if (!response.ok) throw new Error("Failed to fetch ticket")

            const data = await response.json()
            if (data.success) {
                setTicket(data.ticket)
                setStatus(data.ticket.status)
                setPriority(data.ticket.priority)
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

    const handleUpdate = async () => {
        setUpdating(true)
        try {
            const response = await fetch("/api/admin/ticket/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ticketId,
                    status,
                    priority
                })
            })

            const data = await response.json()

            if (data.success) {
                setTicket(prev => prev ? { ...prev, status, priority } : null)
                alert("Ticket frissítve!")
            } else {
                alert(data.error || "Hiba történt a frissítéskor")
            }
        } catch (error) {
            alert("Hálózati hiba")
        } finally {
            setUpdating(false)
        }
    }

    const handleAssignSelf = async () => {
        if (!session?.user?.id) return

        setUpdating(true)
        try {
            const response = await fetch("/api/admin/ticket/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ticketId,
                    assignedToId: session.user.id
                })
            })

            const data = await response.json()

            if (data.success) {
                fetchTicket()
                alert("Ticket hozzád rendelve!")
            }
        } catch (error) {
            alert("Hálózati hiba")
        } finally {
            setUpdating(false)
        }
    }

    if (loading) return <div className="p-10 text-center">Betöltés...</div>
    if (!ticket) return <div className="p-10 text-center">Ticket nem található</div>

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/tickets">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-bold tracking-tight">{ticket.subject}</h2>
                            <span className="text-muted-foreground font-mono text-sm">#{ticket.ticketNumber}</span>
                        </div>
                        <div className="flex gap-3 items-center">
                            <TicketStatusBadge status={ticket.status} />
                            <TicketPriorityBadge priority={ticket.priority} />
                            <span className="text-sm text-muted-foreground flex items-center gap-1 ml-2">
                                <Clock className="h-3 w-3" />
                                {new Date(ticket.createdAt).toLocaleDateString('hu-HU')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Original Ticket Description */}
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-semibold">{ticket.user.name}</div>
                                <div className="text-xs text-muted-foreground">{ticket.user.email}</div>
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
                        <Card key={reply.id} className={reply.isStaffReply ? "border-l-4 border-l-blue-500 ml-8 bg-blue-50/50 dark:bg-blue-950/20" : "mr-8 bg-muted/30"}>
                            <CardHeader className="pb-2 py-3">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        {reply.isStaffReply ? (
                                            <AvatarFallback className="bg-blue-500 text-white">
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
                                            {reply.isStaffReply && <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded">STAFF</span>}
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
            </div>

            {/* Sidebar Controls */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Ticket Kezelés</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Státusz</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="OPEN">Nyitott</SelectItem>
                                    <SelectItem value="IN_PROGRESS">Folyamatban</SelectItem>
                                    <SelectItem value="WAITING_FOR_CUSTOMER">Ügyfélre vár</SelectItem>
                                    <SelectItem value="CLOSED">Lezárt</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Prioritás</Label>
                            <Select value={priority} onValueChange={setPriority}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LOW">Alacsony</SelectItem>
                                    <SelectItem value="MEDIUM">Közepes</SelectItem>
                                    <SelectItem value="HIGH">Magas</SelectItem>
                                    <SelectItem value="URGENT">Sürgős</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Felelős</Label>
                            <div className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                                <span className="text-sm">
                                    {ticket.assignedTo ? ticket.assignedTo.name : "Nincs hozzárendelve"}
                                </span>
                                {!ticket.assignedTo && (
                                    <Button variant="link" size="sm" onClick={handleAssignSelf} disabled={updating}>
                                        Átvétel
                                    </Button>
                                )}
                            </div>
                        </div>

                        <Button className="w-full" onClick={handleUpdate} disabled={updating}>
                            {updating ? "Mentés..." : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Változások mentése
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Ügyfél Infó</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div>
                            <span className="text-muted-foreground block">Név:</span>
                            <span className="font-medium">{ticket.user.name}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground block">Email:</span>
                            <span className="font-medium">{ticket.user.email}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
