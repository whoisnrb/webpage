"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createSalesMeeting, updateSalesMeeting, deleteSalesMeeting } from "@/app/actions/sales-meetings"
import { Plus, Edit, Trash2, Loader2, Upload } from "lucide-react"

interface MeetingManagerProps {
    meeting?: any
}

export function MeetingManager({ meeting }: MeetingManagerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const isEditing = !!meeting

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formData = new FormData(e.currentTarget)
            
            let result
            if (isEditing) {
                result = await updateSalesMeeting(meeting.id, formData)
            } else {
                result = await createSalesMeeting(formData)
            }

            if (result.success) {
                setIsOpen(false)
                router.refresh()
            } else {
                alert("Hiba történt a mentés során: " + result.error)
            }
        } catch (error) {
            console.error(error)
            alert("Váratlan hiba történt.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm("Biztosan törölni szeretnéd ezt a meetinget?")) return
        
        setIsDeleting(true)
        try {
            const result = await deleteSalesMeeting(meeting.id)
            if (result.success) {
                setIsOpen(false)
                router.refresh()
            } else {
                alert("Hiba történt a törlés során")
            }
        } catch (error) {
            console.error(error)
            alert("Váratlan hiba történt.")
        } finally {
            setIsDeleting(false)
        }
    }

    // A dátum formázása az input mezőhöz (YYYY-MM-DDThh:mm)
    const defaultDate = isEditing 
        ? new Date(meeting.meetingTime).toISOString().slice(0, 16)
        : ""

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {isEditing ? (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
                        <Edit className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button className="gap-2 bg-cyan-600 hover:bg-cyan-500 text-white">
                        <Plus className="h-4 w-4" />
                        Új Meeting
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-[#0b101c] border-white/10 text-slate-200">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Meeting Szerkesztése" : "Új Értékesítési Meeting"}</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Add meg a találkozó részleteit és tölts fel segédanyagot (puskát).
                    </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="clientName">Ügyfél neve *</Label>
                            <Input id="clientName" name="clientName" defaultValue={meeting?.clientName} required className="bg-white/5 border-white/10 focus-visible:ring-cyan-500" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="meetingTime">Időpont *</Label>
                            <Input id="meetingTime" name="meetingTime" type="datetime-local" defaultValue={defaultDate} required className="bg-white/5 border-white/10 focus-visible:ring-cyan-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="clientEmail">Email</Label>
                            <Input id="clientEmail" name="clientEmail" type="email" defaultValue={meeting?.clientEmail} className="bg-white/5 border-white/10 focus-visible:ring-cyan-500" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="clientPhone">Telefonszám</Label>
                            <Input id="clientPhone" name="clientPhone" type="tel" defaultValue={meeting?.clientPhone} className="bg-white/5 border-white/10 focus-visible:ring-cyan-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="platform">Platform *</Label>
                            <Select name="platform" defaultValue={meeting?.platform || "Telefon"} required>
                                <SelectTrigger className="bg-white/5 border-white/10 focus:ring-cyan-500">
                                    <SelectValue placeholder="Válassz platformot" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0b101c] border-white/10">
                                    <SelectItem value="Telefon">Telefon</SelectItem>
                                    <SelectItem value="Zoom">Zoom</SelectItem>
                                    <SelectItem value="Google Meet">Google Meet</SelectItem>
                                    <SelectItem value="Microsoft Teams">Microsoft Teams</SelectItem>
                                    <SelectItem value="Személyes">Személyes találkozó</SelectItem>
                                    <SelectItem value="Egyéb">Egyéb</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Státusz</Label>
                            <Select name="status" defaultValue={meeting?.status || "SCHEDULED"} required>
                                <SelectTrigger className="bg-white/5 border-white/10 focus:ring-cyan-500">
                                    <SelectValue placeholder="Válassz státuszt" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0b101c] border-white/10">
                                    <SelectItem value="SCHEDULED">Tervezett</SelectItem>
                                    <SelectItem value="COMPLETED">Teljesítve</SelectItem>
                                    <SelectItem value="CANCELLED">Törölve</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="meetingLink">Meeting Link (Zoom, Meet, stb.)</Label>
                        <Input id="meetingLink" name="meetingLink" type="url" defaultValue={meeting?.meetingLink} placeholder="https://" className="bg-white/5 border-white/10 focus-visible:ring-cyan-500" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="document" className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            Segédanyag / Puska feltöltése (opcionális, PDF/Word)
                        </Label>
                        <Input id="document" name="document" type="file" accept=".pdf,.doc,.docx" className="bg-white/5 border-white/10 file:text-slate-300 file:bg-white/10 file:border-0 hover:file:bg-white/20" />
                        {meeting?.hasDocument && (
                            <p className="text-xs text-blue-400 mt-1">Jelenleg van feltöltött dokumentum. Új feltöltése felülírja a régit.</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Megjegyzések, tudnivalók</Label>
                        <Textarea id="notes" name="notes" defaultValue={meeting?.notes} rows={3} className="bg-white/5 border-white/10 focus-visible:ring-cyan-500" />
                    </div>

                    <DialogFooter className="flex justify-between sm:justify-between pt-4">
                        {isEditing ? (
                            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting || isLoading} className="bg-red-500/20 text-red-400 hover:bg-red-500/30">
                                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                                Törlés
                            </Button>
                        ) : (
                            <div />
                        )}
                        <Button type="submit" disabled={isLoading} className="bg-cyan-600 hover:bg-cyan-500 text-white">
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            {isEditing ? "Mentés" : "Létrehozás"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
