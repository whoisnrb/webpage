"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function NewTicketPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        subject: "",
        description: "",
        category: "GENERAL",
        priority: "MEDIUM"
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch('/api/ticket/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (data.success) {
                toast({
                    title: "Ticket létrehozva",
                    description: `Ticket szám: ${data.ticket.ticketNumber}`
                })
                router.push(`/dashboard/tickets/${data.ticket.id}`)
            } else {
                toast({
                    title: "Hiba",
                    description: data.error || "Nem sikerült létrehozni a ticket-et",
                    variant: "destructive"
                })
            }
        } catch (error) {
            toast({
                title: "Hiba",
                description: "Hálózati hiba történt",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Új Ticket Létrehozása</h2>
                <p className="text-muted-foreground">Írja le a problémáját és munkatársaink hamarosan válaszolnak.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Ticket részletek</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Tárgy *</Label>
                            <Input
                                id="subject"
                                placeholder="Rövid összefoglaló a problémáról"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                maxLength={200}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                {formData.subject.length}/200 karakter
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Részletes leírás *</Label>
                            <Textarea
                                id="description"
                                placeholder="Részletesen írja le a problémát vagy kérdést..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={8}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Minimum 20 karakter szükséges
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Kategória</Label>
                                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="TECHNICAL">Technikai kérdés</SelectItem>
                                        <SelectItem value="BILLING">Számlázás</SelectItem>
                                        <SelectItem value="GENERAL">Általános</SelectItem>
                                        <SelectItem value="BUG_REPORT">Hibajelentés</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="priority">Prioritás</Label>
                                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="LOW">Alacsony</SelectItem>
                                        <SelectItem value="MEDIUM">Közepes</SelectItem>
                                        <SelectItem value="HIGH">Magas</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={loading || formData.description.length < 20}>
                                {loading ? "Létrehozás..." : "Ticket beküldése"}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                Mégse
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
