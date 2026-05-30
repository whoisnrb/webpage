import { prisma } from "@/lib/db"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { ArrowLeft } from "lucide-react"
import { ConsultationManager } from "./consultation-manager"

export const dynamic = 'force-dynamic'

export default async function AdminConsultationsPage() {
    // Only fetch consultations where productId is not null (linked to a Solution/Megoldás)
    const consultations = await prisma.consultation.findMany({
        where: {
            productId: {
                not: null
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            product: true
        }
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-[#090d16]/30 border border-white/5 p-6 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center gap-4">
                    <Link href={"/admin" as any}>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">Konzultációk</h1>
                        <p className="text-slate-400 text-sm mt-1">A Megoldások / csomagok iránt érdeklődők konzultációs igényei.</p>
                    </div>
                </div>
            </div>

            <Card className="border border-white/5 bg-[#090d16]/40 rounded-2xl shadow-xl overflow-hidden">
                <CardHeader className="bg-[#0b101c]/40 border-b border-white/5">
                    <CardTitle className="text-base font-bold text-white tracking-wide">Beérkezett igények listája</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-[#0b101c]/60">
                            <TableRow className="border-b border-white/5 hover:bg-transparent">
                                <TableHead className="text-slate-400 font-bold">Dátum</TableHead>
                                <TableHead className="text-slate-400 font-bold">Érdeklődő</TableHead>
                                <TableHead className="text-slate-400 font-bold">Elérhetőség</TableHead>
                                <TableHead className="text-slate-400 font-bold">Megoldás / Csomag</TableHead>
                                <TableHead className="text-slate-400 font-bold">Státusz</TableHead>
                                <TableHead className="text-slate-400 font-bold text-right">Műveletek</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {consultations.length > 0 ? (
                                consultations.map((consultation) => (
                                    <TableRow key={consultation.id} className="border-b border-white/5 hover:bg-white/[0.01]">
                                        <TableCell className="whitespace-nowrap font-mono text-xs text-slate-300">
                                            {new Date(consultation.createdAt).toLocaleDateString('hu-HU')}
                                            <br />
                                            <span className="text-[10px] text-slate-500">
                                                {new Date(consultation.createdAt).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-white">{consultation.name}</span>
                                                {consultation.company && (
                                                    <span className="text-xs text-slate-400">Cég: {consultation.company}</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-xs text-slate-300">
                                                <a href={`mailto:${consultation.email}`} className="hover:text-cyan-400 hover:underline">{consultation.email}</a>
                                                {consultation.phone && (
                                                    <a href={`tel:${consultation.phone}`} className="text-[10px] text-slate-400 hover:text-cyan-400 hover:underline mt-0.5">{consultation.phone}</a>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <span className="font-medium text-slate-200 text-sm">{consultation.product ? consultation.product.name : 'Nincs kiválasztva'}</span>
                                                {consultation.packageName && (
                                                    <Badge variant="outline" className="w-fit text-[10px] px-2 py-0.5 border-cyan-500/20 text-cyan-400 bg-cyan-950/20">
                                                        {consultation.packageName}
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={
                                                consultation.status === 'NEW' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                                                    consultation.status === 'CONTACTED' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                        'bg-slate-900/50 text-slate-400 border border-slate-700'
                                            }>
                                                {consultation.status === 'NEW' ? 'Új' :
                                                    consultation.status === 'CONTACTED' ? 'Kapcsolatfelvétel' :
                                                        consultation.status === 'CLOSED' ? 'Lezárva' : consultation.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-4">
                                            <ConsultationManager consultation={consultation} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-16 text-slate-500">
                                        Nincs megjeleníthető konzultációs igény.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
