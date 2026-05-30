"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { markContactMessageRead, deleteContactMessage } from "@/app/actions/contact"
import { Eye, Trash2, Mail, Phone, Calendar, Check, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

interface ContactMessage {
    id: string
    name: string
    email: string
    phone: string | null
    subject: string | null
    message: string
    status: string
    createdAt: Date
    updatedAt: Date
}

interface ContactListProps {
    initialMessages: ContactMessage[]
}

export function ContactList({ initialMessages }: ContactListProps) {
    const [messages, setMessages] = useState<ContactMessage[]>(initialMessages)
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [isPending, setIsPending] = useState(false)

    const handleOpenMessage = async (msg: ContactMessage) => {
        setSelectedMessage(msg)
        if (msg.status === "NEW") {
            // Optimistically update UI
            setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: "READ" } : m))
            // Server Action call
            const result = await markContactMessageRead(msg.id)
            if (!result.success) {
                toast.error("Nem sikerült olvasottnak jelölni.")
                // Revert UI on error
                setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: "NEW" } : m))
            }
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return
        setIsPending(true)
        const result = await deleteContactMessage(deleteId)
        setIsPending(false)
        if (result.success) {
            toast.success("Üzenet sikeresen törölve!")
            setMessages(prev => prev.filter(m => m.id !== deleteId))
            setDeleteId(null)
            if (selectedMessage?.id === deleteId) {
                setSelectedMessage(null)
            }
        } else {
            toast.error("Hiba történt a törlés során: " + result.error)
        }
    }

    return (
        <div className="space-y-6">
            <div className="border border-white/5 rounded-2xl bg-[#090d16]/40 overflow-hidden shadow-xl">
                <Table>
                    <TableHeader className="bg-[#0b101c]/60">
                        <TableRow className="border-b border-white/5 hover:bg-transparent">
                            <TableHead className="text-slate-400 font-bold">Dátum</TableHead>
                            <TableHead className="text-slate-400 font-bold">Küldő</TableHead>
                            <TableHead className="text-slate-400 font-bold">Tárgy / Téma</TableHead>
                            <TableHead className="text-slate-400 font-bold">Státusz</TableHead>
                            <TableHead className="text-slate-400 font-bold text-right">Műveletek</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {messages.map((msg) => (
                            <TableRow 
                                key={msg.id} 
                                className={`border-b border-white/5 transition-colors hover:bg-white/[0.02] ${
                                    msg.status === "NEW" ? "bg-cyan-500/5 font-semibold text-white" : "text-slate-300"
                                }`}
                            >
                                <TableCell className="whitespace-nowrap font-mono text-xs">
                                    {new Date(msg.createdAt).toLocaleDateString('hu-HU')} {new Date(msg.createdAt).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{msg.name}</span>
                                        <span className="text-xs text-slate-400">{msg.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="max-w-[250px] truncate">
                                    {msg.subject || "Nincs megadva"}
                                </TableCell>
                                <TableCell>
                                    {msg.status === "NEW" ? (
                                        <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_8px_rgba(6,182,212,0.1)]">Új</Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-slate-400 border-slate-700 bg-slate-900/40">Olvasott</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => handleOpenMessage(msg)}
                                            className="h-8 w-8 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => setDeleteId(msg.id)}
                                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {messages.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-16 text-slate-500">
                                    Nincs megjeleníthető kapcsolatfelvételi üzenet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Read Message Dialog */}
            <Dialog open={selectedMessage !== null} onOpenChange={(open) => !open && setSelectedMessage(null)}>
                {selectedMessage && (
                    <DialogContent className="sm:max-w-[550px] bg-[#0c1220] border border-white/10 text-slate-100 rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
                                <Mail className="h-5 w-5 text-cyan-400" />
                                Kapcsolat üzenet részletei
                            </DialogTitle>
                            <DialogDescription className="text-slate-400 text-xs">
                                Küldve: {new Date(selectedMessage.createdAt).toLocaleString('hu-HU')}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 my-2 text-sm">
                            <div className="grid grid-cols-2 gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Küldő neve</p>
                                    <p className="font-medium text-white mt-0.5">{selectedMessage.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Email cím</p>
                                    <a href={`mailto:${selectedMessage.email}`} className="font-medium text-cyan-400 hover:underline mt-0.5 block truncate">
                                        {selectedMessage.email}
                                    </a>
                                </div>
                                {selectedMessage.phone && (
                                    <div className="col-span-2 border-t border-white/5 pt-2">
                                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Telefonszám</p>
                                        <a href={`tel:${selectedMessage.phone}`} className="font-medium text-slate-300 hover:underline mt-0.5 block">
                                            {selectedMessage.phone}
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Téma / Tárgy</p>
                                <p className="font-semibold text-white bg-white/[0.02] border border-white/5 px-4 py-2.5 rounded-xl">
                                    {selectedMessage.subject || "Nincs megadva"}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Üzenet tartalma</p>
                                <div className="bg-white/[0.03] border border-white/5 p-4 rounded-xl min-h-[120px] max-h-[250px] overflow-y-auto whitespace-pre-wrap text-slate-200 leading-relaxed custom-scrollbar">
                                    {selectedMessage.message}
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0 mt-4 border-t border-white/5 pt-4">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setSelectedMessage(null)}
                                className="border-white/10 hover:bg-white/5 rounded-xl"
                            >
                                Bezárás
                            </Button>
                            <Button 
                                type="button" 
                                variant="destructive" 
                                onClick={() => {
                                    setDeleteId(selectedMessage.id)
                                }}
                                className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 rounded-xl"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Üzenet törlése
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                )}
            </Dialog>

            {/* Confirm Delete Dialog */}
            <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent className="sm:max-w-[420px] bg-[#0c1220] border border-white/10 text-slate-100 rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold flex items-center gap-2 text-red-400">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Biztosan törlöd?
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 text-sm mt-2">
                            Ez a művelet visszavonhatatlan. Az üzenet véglegesen törlődik az adatbázisból.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="gap-2 sm:gap-0 mt-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setDeleteId(null)}
                            disabled={isPending}
                            className="border-white/10 hover:bg-white/5 rounded-xl"
                        >
                            Mégse
                        </Button>
                        <Button 
                            type="button" 
                            variant="destructive" 
                            onClick={handleDelete}
                            disabled={isPending}
                            className="bg-red-600 hover:bg-red-500 text-white rounded-xl"
                        >
                            {isPending ? "Törlés..." : "Igen, törlöm"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
