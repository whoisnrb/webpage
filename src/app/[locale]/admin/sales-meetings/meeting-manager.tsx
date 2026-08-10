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
import { 
    Plus, 
    Edit, 
    Trash2, 
    Loader2, 
    Upload,
    User,
    Clock,
    Mail,
    Phone,
    Monitor,
    Activity,
    Link as LinkIcon,
    Bell,
    FileText,
    CheckCircle,
    FileCheck
} from "lucide-react"

interface MeetingManagerProps {
    meeting?: any
}

const SectionDivider = ({ title }: { title: string }) => (
    <div className="flex items-center gap-4 py-4">
        <div className="h-px bg-white/5 flex-1" />
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{title}</span>
        <div className="h-px bg-white/5 flex-1" />
    </div>
)

export function MeetingManager({ meeting }: MeetingManagerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [fileSelected, setFileSelected] = useState<boolean>(false)
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
                    <Button className="gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-900/20 transition-all">
                        <Plus className="h-4 w-4" />
                        Új Meeting
                    </Button>
                )}
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-[600px] bg-[#0b101c] border-white/10 text-slate-200 p-0 overflow-hidden shadow-2xl">
                <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 to-blue-600" />
                
                <div className="p-6 pt-5 max-h-[85vh] overflow-y-auto custom-scrollbar">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-xl font-semibold tracking-tight">
                            {isEditing ? "Meeting Szerkesztése" : "Új Értékesítési Meeting"}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 mt-1.5">
                            {isEditing 
                                ? "Módosítsd a találkozó adatait vagy tölts fel új segédanyagot." 
                                : "Add meg a találkozó részleteit és tölts fel segédanyagot a kollégáknak."}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleSubmit} className="space-y-2">
                        
                        <SectionDivider title="Ügyfél adatai" />
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="clientName" className="flex items-center gap-2 text-slate-300">
                                    <User className="h-4 w-4 text-cyan-500" /> Ügyfél neve *
                                </Label>
                                <Input id="clientName" name="clientName" defaultValue={meeting?.clientName} required className="bg-[#131b2c] border-white/10 focus-visible:ring-cyan-500 transition-all placeholder:text-slate-600" placeholder="Pl. Kovács János / Cégnév Kft." />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="clientEmail" className="flex items-center gap-2 text-slate-300">
                                        <Mail className="h-4 w-4 text-cyan-500" /> Email
                                    </Label>
                                    <Input id="clientEmail" name="clientEmail" type="email" defaultValue={meeting?.clientEmail} className="bg-[#131b2c] border-white/10 focus-visible:ring-cyan-500 transition-all placeholder:text-slate-600" placeholder="ugyfel@email.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="clientPhone" className="flex items-center gap-2 text-slate-300">
                                        <Phone className="h-4 w-4 text-cyan-500" /> Telefonszám
                                    </Label>
                                    <Input id="clientPhone" name="clientPhone" type="tel" defaultValue={meeting?.clientPhone} className="bg-[#131b2c] border-white/10 focus-visible:ring-cyan-500 transition-all placeholder:text-slate-600" placeholder="+36 30 123 4567" />
                                </div>
                            </div>
                        </div>

                        <SectionDivider title="Meeting beállítások" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="meetingTime" className="flex items-center gap-2 text-slate-300">
                                    <Clock className="h-4 w-4 text-cyan-500" /> Időpont *
                                </Label>
                                <Input id="meetingTime" name="meetingTime" type="datetime-local" defaultValue={defaultDate} required className="bg-[#131b2c] border-white/10 focus-visible:ring-cyan-500 transition-all [color-scheme:dark]" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="platform" className="flex items-center gap-2 text-slate-300">
                                    <Monitor className="h-4 w-4 text-cyan-500" /> Platform *
                                </Label>
                                <Select name="platform" defaultValue={meeting?.platform || "Telefon"} required>
                                    <SelectTrigger className="bg-[#131b2c] border-white/10 focus:ring-cyan-500 transition-all">
                                        <SelectValue placeholder="Válassz platformot" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#131b2c] border-white/10 text-slate-200">
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
                                <Label htmlFor="status" className="flex items-center gap-2 text-slate-300">
                                    <Activity className="h-4 w-4 text-cyan-500" /> Státusz
                                </Label>
                                <Select name="status" defaultValue={meeting?.status || "SCHEDULED"} required>
                                    <SelectTrigger className="bg-[#131b2c] border-white/10 focus:ring-cyan-500 transition-all">
                                        <SelectValue placeholder="Válassz státuszt" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#131b2c] border-white/10 text-slate-200">
                                        <SelectItem value="SCHEDULED">Tervezett</SelectItem>
                                        <SelectItem value="COMPLETED">Teljesítve</SelectItem>
                                        <SelectItem value="CANCELLED">Törölve</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="meetingLink" className="flex items-center gap-2 text-slate-300">
                                    <LinkIcon className="h-4 w-4 text-cyan-500" /> Meeting Link
                                </Label>
                                <Input id="meetingLink" name="meetingLink" type="url" defaultValue={meeting?.meetingLink} placeholder="https://" className="bg-[#131b2c] border-white/10 focus-visible:ring-cyan-500 transition-all placeholder:text-slate-600" />
                            </div>
                        </div>

                        {!isEditing && (
                            <>
                                <SectionDivider title="Értesítés" />
                                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/20 space-y-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="notifyRecipient" className="flex items-center gap-2 text-cyan-400 font-medium">
                                            <Bell className="h-4 w-4" /> Értesítendő kolléga *
                                        </Label>
                                        <Select name="notifyRecipient" defaultValue="roha.levente@backlineit.hu" required>
                                            <SelectTrigger className="bg-[#0b101c]/80 border-white/10 focus:ring-cyan-500 transition-all">
                                                <SelectValue placeholder="Válassz személyt" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#0b101c] border-white/10 text-slate-200">
                                                <SelectItem value="roha.levente@backlineit.hu">Roha Levente</SelectItem>
                                                <SelectItem value="toka.gabor@backlineit.hu">Toka Gábor</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-slate-400">A kiválasztott kolléga e-mail értesítést kap az új meetingről.</p>
                                    </div>
                                </div>
                            </>
                        )}

                        <SectionDivider title="Egyéb" />
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-slate-300">
                                    <Upload className="h-4 w-4 text-cyan-500" /> Segédanyag / Puska (opcionális)
                                </Label>
                                <div className="relative group rounded-xl border-2 border-dashed border-white/10 hover:border-cyan-500/50 bg-[#131b2c]/50 hover:bg-[#131b2c] p-6 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden">
                                    <Input 
                                        id="document" 
                                        name="document" 
                                        type="file" 
                                        accept=".pdf,.doc,.docx" 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                        onChange={(e) => setFileSelected(!!e.target.files?.length)} 
                                    />
                                    {fileSelected ? (
                                        <div className="flex flex-col items-center gap-2 text-cyan-400">
                                            <FileCheck className="h-8 w-8" />
                                            <span className="text-sm font-medium">Fájl kiválasztva a feltöltéshez</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-cyan-400 transition-colors">
                                            <Upload className="h-8 w-8 mb-1" />
                                            <span className="text-sm font-medium">Kattints vagy húzd ide a fájlt</span>
                                            <span className="text-xs text-slate-500">Támogatott formátumok: PDF, DOC, DOCX</span>
                                        </div>
                                    )}
                                </div>
                                {meeting?.hasDocument && !fileSelected && (
                                    <p className="text-xs text-blue-400 mt-2 flex items-center gap-1.5">
                                        <CheckCircle className="h-3.5 w-3.5" /> Jelenleg van feltöltött dokumentum. Új feltöltése felülírja a régit.
                                    </p>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="notes" className="flex items-center gap-2 text-slate-300">
                                    <FileText className="h-4 w-4 text-cyan-500" /> Megjegyzések
                                </Label>
                                <Textarea 
                                    id="notes" 
                                    name="notes" 
                                    defaultValue={meeting?.notes} 
                                    rows={3} 
                                    placeholder="További tudnivalók, előkészületek, egyedi igények..." 
                                    className="bg-[#131b2c] border-white/10 focus-visible:ring-cyan-500 resize-none transition-all placeholder:text-slate-600" 
                                />
                            </div>
                        </div>

                        <DialogFooter className="flex flex-row justify-between items-center sm:justify-between pt-8 pb-2">
                            {isEditing ? (
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    onClick={handleDelete} 
                                    disabled={isDeleting || isLoading} 
                                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors px-3"
                                >
                                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                                    Törlés
                                </Button>
                            ) : (
                                <div />
                            )}
                            <Button 
                                type="submit" 
                                disabled={isLoading} 
                                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-900/20 transition-all min-w-[140px]"
                            >
                                {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                {isEditing ? "Mentés" : "Létrehozás"}
                            </Button>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
