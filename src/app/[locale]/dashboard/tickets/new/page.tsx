"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useTranslations } from "next-intl"

export default function NewTicketPage() {
    const tTickets = useTranslations('Tickets')
    const tCommon = useTranslations('Common')
    const router = useRouter()
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
                alert(`✅ ${tTickets('success_create', { number: data.ticket.ticketNumber })}`)
                router.push(`/dashboard/tickets`)
            } else {
                alert(`❌ ${tTickets('error_create', { error: data.error || tTickets('not_found') })}`)
            }
        } catch (error) {
            alert(`❌ ${tCommon('network_error')}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{tTickets('create_title')}</h2>
                <p className="text-muted-foreground">{tTickets('create_desc')}</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{tTickets('details_title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="subject">{tTickets('subject')} *</Label>
                            <Input
                                id="subject"
                                placeholder={tTickets('subject_placeholder')}
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                maxLength={200}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                {tTickets('char_count', { count: formData.subject.length })}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">{tTickets('description_label')}</Label>
                            <Textarea
                                id="description"
                                placeholder={tTickets('description_placeholder')}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={8}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                {tTickets('min_chars')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">{tTickets('category')}</Label>
                                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="TECHNICAL">{tTickets('categories.TECHNICAL')}</SelectItem>
                                        <SelectItem value="BILLING">{tTickets('categories.BILLING')}</SelectItem>
                                        <SelectItem value="GENERAL">{tTickets('categories.GENERAL')}</SelectItem>
                                        <SelectItem value="BUG_REPORT">{tTickets('categories.BUG_REPORT')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="priority">{tTickets('priority')}</Label>
                                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="LOW">{tTickets('priority_low')}</SelectItem>
                                        <SelectItem value="MEDIUM">{tTickets('priority_medium')}</SelectItem>
                                        <SelectItem value="HIGH">{tTickets('priority_high')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={loading || formData.description.length < 20}>
                                {loading ? tCommon('loading') : tTickets('submit')}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                {tCommon('cancel')}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
