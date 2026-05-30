"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { Pencil, Trash2, CheckCircle2, XCircle, AlertTriangle, Play } from "lucide-react"
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
import { deleteService, type ServiceDTO } from "@/app/actions/service"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

interface ServiceListProps {
    initialServices: ServiceDTO[]
}

export function ServiceList({ initialServices }: ServiceListProps) {
    const [services, setServices] = useState<ServiceDTO[]>(initialServices)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [isPending, setIsPending] = useState(false)

    const handleDelete = async () => {
        if (!deleteId) return
        setIsPending(true)
        try {
            await deleteService(deleteId)
            toast.success("Szolgáltatás sikeresen törölve!")
            setServices(prev => prev.filter(s => s.id !== deleteId))
            setDeleteId(null)
        } catch (error) {
            toast.error("Hiba történt a törlés során.")
            console.error(error)
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="border border-white/5 rounded-2xl bg-[#090d16]/40 overflow-hidden shadow-xl">
                <Table>
                    <TableHeader className="bg-[#0b101c]/60">
                        <TableRow className="border-b border-white/5 hover:bg-transparent">
                            <TableHead className="text-slate-400 font-bold w-20">Sorrend</TableHead>
                            <TableHead className="text-slate-400 font-bold">Név</TableHead>
                            <TableHead className="text-slate-400 font-bold">Slug</TableHead>
                            <TableHead className="text-slate-400 font-bold">Ár</TableHead>
                            <TableHead className="text-slate-400 font-bold">Státusz</TableHead>
                            <TableHead className="text-slate-400 font-bold text-right">Műveletek</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services.map((service) => (
                            <TableRow key={service.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                                <TableCell className="font-mono text-cyan-400 font-bold">{service.sortOrder}</TableCell>
                                <TableCell className="font-medium text-white">{service.name}</TableCell>
                                <TableCell className="text-slate-400 text-xs font-mono">{service.slug}</TableCell>
                                <TableCell className="font-medium">
                                    {service.price > 0
                                        ? new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(service.price)
                                        : <Badge variant="outline" className="text-amber-400 border-amber-500/20 bg-amber-500/5">Egyedi árazás</Badge>
                                    }
                                </TableCell>
                                <TableCell>
                                    {service.active ? (
                                        <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                                            Aktív
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                                            <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                                            Inaktív
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/admin/services/${service.id}` as any}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => setDeleteId(service.id)}
                                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {services.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-16 text-slate-500">
                                    Nincs megjeleníthető szolgáltatás.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Confirm Delete Dialog */}
            <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent className="sm:max-w-[420px] bg-[#0c1220] border border-white/10 text-slate-100 rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold flex items-center gap-2 text-red-400">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Biztosan törlöd a szolgáltatást?
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 text-sm mt-2">
                            Ez a művelet eltávolítja a szolgáltatást a nyilvános listából és a rendszerből. A művelet nem vonható vissza.
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
