"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateInquiryPaymentLink, updateInquiryStatus, deleteInquiry } from "@/app/actions/inquiry"
import { ExternalLink, Mail, MessageSquare, CreditCard, Copy, Check, AlertTriangle, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface InquiryManagerProps {
    inquiry: any
}

export function InquiryManager({ inquiry }: InquiryManagerProps) {
    const [isPending, setIsPending] = useState(false)
    const [paymentLink, setPaymentLink] = useState(inquiry.stripePaymentLink || "")
    const [status, setStatus] = useState(inquiry.status)
    const [copied, setCopied] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)

    const handleDeleteInquiry = async () => {
        setIsPending(true)
        const result = await deleteInquiry(inquiry.id)
        setIsPending(false)
        if (result.success) {
            toast.success("Megkeresés sikeresen törölve!")
            window.location.reload()
        } else {
            toast.error("Hiba történt a törlés során.")
        }
    }

    const handleUpdatePayment = async () => {
        setIsPending(true)
        const result = await updateInquiryPaymentLink(inquiry.id, paymentLink)
        setIsPending(false)
        if (result.success) {
            toast.success("Fizetési link mentve és email kiküldve!")
            setStatus("QUOTED")
        } else {
            toast.error("Hiba történt a mentés során.")
        }
    }

    const handleStatusChange = async (newStatus: string) => {
        setIsPending(true)
        const result = await updateInquiryStatus(inquiry.id, newStatus)
        setIsPending(false)
        if (result.success) {
            setStatus(newStatus)
            toast.success("Státusz frissítve!")
        }
    }

    const copyToClipboard = () => {
        if (!inquiry.stripePaymentLink) return
        navigator.clipboard.writeText(inquiry.stripePaymentLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    Kezelés
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{inquiry.name} megkeresése</DialogTitle>
                    <DialogDescription>
                        Szolgáltatás: {inquiry.serviceType}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Contact Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-3 rounded-lg">
                        <div>
                            <p className="text-muted-foreground">Email</p>
                            <p className="font-medium underline-offset-4 hover:underline cursor-pointer" onClick={() => window.location.href=`mailto:${inquiry.email}`}>{inquiry.email}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Telefon</p>
                            <p className="font-medium">{inquiry.phone || "-"}</p>
                        </div>
                    </div>

                    {/* Status Selection */}
                    <div className="space-y-2">
                        <Label>Státusz</Label>
                        <Select onValueChange={handleStatusChange} value={status}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="NEW">Új</SelectItem>
                                <SelectItem value="QUOTED">Ajánlat kiküldve / Fizetésre vár</SelectItem>
                                <SelectItem value="PAID">Fizetve</SelectItem>
                                <SelectItem value="COMPLETED">Teljesítve</SelectItem>
                                <SelectItem value="CANCELLED">Elutasítva / Törölve</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Payment Link Management */}
                    <div className="space-y-2">
                        <Label htmlFor="paymentLink" className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" /> Stripe Fizetési Link
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                id="paymentLink"
                                value={paymentLink}
                                onChange={(e) => setPaymentLink(e.target.value)}
                                placeholder="https://buy.stripe.com/..."
                                className="flex-1"
                            />
                            {inquiry.stripePaymentLink && (
                                <Button variant="secondary" size="icon" onClick={copyToClipboard}>
                                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            )}
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                            A link mentésekor a rendszer automatikusan kiküldi azt az ügyfélnek e-mailben.
                        </p>
                    </div>

                    {/* Description Section */}
                    <div className="space-y-2">
                        <Label>Megjegyzés az ügyféltől</Label>
                        <div className="text-sm border rounded-md p-3 min-h-[80px] max-h-[150px] overflow-y-auto whitespace-pre-wrap bg-muted/10">
                            {inquiry.description}
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex justify-between items-center w-full gap-2 sm:gap-0">
                    {confirmDelete ? (
                        <div className="flex items-center gap-2 bg-red-950/20 border border-red-500/20 px-3 py-1.5 rounded-xl">
                            <span className="text-xs text-red-400 font-semibold flex items-center gap-1">
                                <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                                Biztos?
                            </span>
                            <Button size="sm" variant="destructive" className="h-7 px-2.5 text-xs rounded-lg" onClick={handleDeleteInquiry} disabled={isPending}>
                                Igen
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 px-2.5 text-xs rounded-lg border-white/10 hover:bg-white/5" onClick={() => setConfirmDelete(false)} disabled={isPending}>
                                Nem
                            </Button>
                        </div>
                    ) : (
                        <Button 
                            variant="ghost" 
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl"
                            onClick={() => setConfirmDelete(true)}
                            disabled={isPending}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Megkeresés Törlése
                        </Button>
                    )}
                    <Button onClick={handleUpdatePayment} disabled={isPending} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl h-10 px-4 font-semibold w-full sm:w-auto ml-auto">
                        Link Mentése & Email Küldése
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
