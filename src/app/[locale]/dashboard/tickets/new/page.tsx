"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Send, Loader2, Ticket, AlertTriangle, CreditCard, Wrench, Bug } from "lucide-react"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

export default function NewTicketPage() {
    const tTickets = useTranslations('Tickets')
    const tCommon  = useTranslations('Common')
    const router   = useRouter()
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
            const res  = await fetch('/api/ticket/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (data.success) {
                alert(`✅ ${tTickets('success_create', { number: data.ticket.ticketNumber })}`)
                router.push('/dashboard/tickets')
            } else {
                alert(`❌ ${tTickets('error_create', { error: data.error || tTickets('not_found') })}`)
            }
        } catch { alert(`❌ ${tCommon('network_error')}`) }
        finally { setLoading(false) }
    }

    const categories = [
        { value: "TECHNICAL", label: tTickets('categories.TECHNICAL'), icon: Wrench,       color: "text-blue-400"   },
        { value: "BILLING",   label: tTickets('categories.BILLING'),   icon: CreditCard,   color: "text-emerald-400" },
        { value: "GENERAL",   label: tTickets('categories.GENERAL'),   icon: Ticket,       color: "text-primary"    },
        { value: "BUG_REPORT",label: tTickets('categories.BUG_REPORT'),icon: Bug,          color: "text-orange-400" },
    ]
    const priorities = [
        { value: "LOW",    label: tTickets('priority_low'),    dot: "bg-emerald-400" },
        { value: "MEDIUM", label: tTickets('priority_medium'), dot: "bg-yellow-400"  },
        { value: "HIGH",   label: tTickets('priority_high'),   dot: "bg-red-400"     },
    ]

    const charCount  = formData.subject.length
    const descCount  = formData.description.length
    const canSubmit  = !loading && descCount >= 20 && formData.subject.trim()

    return (
        <div className="space-y-6 max-w-2xl animate-fadeIn">

            {/* Header */}
            <div className="flex items-center gap-3">
                <Link href={"/dashboard/tickets" as any}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all">
                        <ArrowLeft className="h-4 w-4" />
                    </div>
                </Link>
                <div>
                    <h2 className="text-xl font-bold tracking-tight">{tTickets('create_title')}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">{tTickets('create_desc')}</p>
                </div>
            </div>

            {/* Form card */}
            <form onSubmit={handleSubmit}>
                <div className="rounded-xl border border-white/5 bg-card/40 backdrop-blur overflow-hidden">
                    {/* Card header */}
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                            <Ticket className="h-4 w-4" />
                        </div>
                        <span className="font-semibold text-sm">{tTickets('details_title')}</span>
                    </div>

                    <div className="p-5 space-y-5">

                        {/* Subject */}
                        <div className="space-y-1.5">
                            <Label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                {tTickets('subject')} *
                            </Label>
                            <Input
                                id="subject"
                                placeholder={tTickets('subject_placeholder')}
                                value={formData.subject}
                                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                maxLength={200}
                                required
                                className="bg-white/5 border-white/8 focus:border-primary/50 transition-colors"
                            />
                            <p className={`text-[11px] ${charCount > 180 ? 'text-orange-400' : 'text-muted-foreground/50'}`}>
                                {tTickets('char_count', { count: charCount })} / 200
                            </p>
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                {tTickets('description_label')} *
                            </Label>
                            <Textarea
                                id="description"
                                placeholder={tTickets('description_placeholder')}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                rows={7}
                                required
                                className="bg-white/5 border-white/8 focus:border-primary/50 resize-none transition-colors"
                            />
                            <div className="flex items-center justify-between">
                                <p className="text-[11px] text-muted-foreground/50">{tTickets('min_chars')}</p>
                                {descCount < 20 && descCount > 0 && (
                                    <p className="text-[11px] text-orange-400 flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        Még {20 - descCount} karakter szükséges
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Category + Priority */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    {tTickets('category')}
                                </Label>
                                <Select value={formData.category} onValueChange={v => setFormData({ ...formData, category: v })}>
                                    <SelectTrigger className="bg-white/5 border-white/8">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(c => (
                                            <SelectItem key={c.value} value={c.value}>
                                                <div className="flex items-center gap-2">
                                                    <c.icon className={`h-3.5 w-3.5 ${c.color}`} />
                                                    {c.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    {tTickets('priority')}
                                </Label>
                                <Select value={formData.priority} onValueChange={v => setFormData({ ...formData, priority: v })}>
                                    <SelectTrigger className="bg-white/5 border-white/8">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {priorities.map(p => (
                                            <SelectItem key={p.value} value={p.value}>
                                                <div className="flex items-center gap-2">
                                                    <span className={`h-2 w-2 rounded-full ${p.dot}`} />
                                                    {p.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-1 border-t border-white/5">
                            <button
                                type="submit"
                                disabled={!canSubmit}
                                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                {loading
                                    ? <><Loader2 className="h-4 w-4 animate-spin" />{tCommon('loading')}</>
                                    : <><Send className="h-4 w-4" />{tTickets('submit')}</>
                                }
                            </button>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="rounded-lg border border-white/8 bg-white/5 px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all"
                            >
                                {tCommon('cancel')}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
