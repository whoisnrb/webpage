"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { updateConsultationStatus, deleteConsultation } from "@/app/actions/consultation"
import { Eye, Trash2, Mail, Phone, Calendar, AlertTriangle, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

interface ConsultationManagerProps {
    consultation: any
}

export function ConsultationManager({ consultation }: ConsultationManagerProps) {
    const [isPending, setIsPending] = useState(false)
    const [status, setStatus] = useState(consultation.status)
    const [confirmDelete, setConfirmDelete] = useState(false)

    const handleStatusChange = async (newStatus: string) => {
        setIsPending(true)
        const result = await updateConsultationStatus(consultation.id, newStatus)
        setIsPending(false)
        if (result.success) {
            setStatus(newStatus)
            toast.success("Státusz frissítve!")
        } else {
            toast.error("Nem sikerült módosítani a státuszt.")
        }
    }

    const handleDeleteConsultation = async () => {
        setIsPending(true)
        const result = await deleteConsultation(consultation.id)
        setIsPending(false)
        if (result.success) {
            toast.success("Konzultáció sikeresen törölve!")
            window.location.reload()
        } else {
            toast.error("Hiba történt a törlés során.")
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 rounded-xl text-xs hover:bg-white/5 border-white/10 text-slate-300">
                    Kezelés
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-[#0c1220] border border-white/10 text-slate-100 rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                        Konzultációs igény kezelése
                    </DialogTitle>
                    <DialogDescription className="text-slate-400 text-xs mt-1">
                        Termék/Megoldás: {consultation.product ? consultation.product.name : 'Nincs kiválasztva'} {consultation.packageName ? `(${consultation.packageName})` : ''}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Contact Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Küldő neve</p>
                            <p className="font-medium text-white mt-0.5">{consultation.name}</p>
                            {consultation.company && (
                                <p className="text-xs text-slate-400 mt-0.5">Cég: {consultation.company}</p>
                            )}
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Elérhetőség</p>
                            <a href={`mailto:${consultation.email}`} className="font-medium text-cyan-400 hover:underline mt-0.5 block truncate">
                                {consultation.email}
                            </a>
                            {consultation.phone && (
                                <a href={`tel:${consultation.phone}`} className="text-xs text-slate-300 hover:underline mt-0.5 block">
                                    {consultation.phone}
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Status Selection */}
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Státusz</Label>
                        <Select onValueChange={handleStatusChange} value={status}>
                            <SelectTrigger className="bg-white/[0.03] border-white/10 rounded-xl text-slate-200">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0f172a] border-white/10 text-slate-100 rounded-xl">
                                <SelectItem value="NEW">Új</SelectItem>
                                <SelectItem value="CONTACTED">Kapcsolatfelvétel folyamatban</SelectItem>
                                <SelectItem value="CLOSED">Lezárva</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Description Section */}
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Leírás / Projekt elképzelés</Label>
                        <div className="text-sm border border-white/5 rounded-xl p-4 min-h-[85px] max-h-[180px] overflow-y-auto whitespace-pre-wrap bg-white/[0.02] text-slate-300 leading-relaxed custom-scrollbar">
                            {consultation.description}
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex justify-between items-center w-full gap-2 sm:gap-0 border-t border-white/5 pt-4">
                    {confirmDelete ? (
                        <div className="flex items-center gap-2 bg-red-950/20 border border-red-500/20 px-3 py-1.5 rounded-xl">
                            <span className="text-xs text-red-400 font-semibold flex items-center gap-1">
                                <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                                Biztos törlöd?
                            </span>
                            <Button size="sm" variant="destructive" className="h-7 px-2.5 text-xs rounded-lg" onClick={handleDeleteConsultation} disabled={isPending}>
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
                            Törlés
                        </Button>
                    )}
                    <Button 
                        onClick={() => window.location.reload()} 
                        disabled={isPending}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl h-10 px-4 font-semibold w-full sm:w-auto ml-auto"
                    >
                        Bezárás
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
