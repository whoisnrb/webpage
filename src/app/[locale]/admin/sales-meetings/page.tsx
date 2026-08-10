import { getSalesMeetings } from "@/app/actions/sales-meetings"
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
import { MeetingManager } from "./meeting-manager"
import { 
    Calendar, 
    PhoneCall, 
    CheckCircle2, 
    XCircle, 
    FileText, 
    Search,
    Download,
    Video,
    Phone,
    MapPin,
    Monitor,
    Users,
    Inbox
} from "lucide-react"

export const dynamic = 'force-dynamic'

function formatRelativeDate(dateString: Date) {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    const isTomorrow = date.getDate() === tomorrow.getDate() && date.getMonth() === tomorrow.getMonth() && date.getFullYear() === tomorrow.getFullYear();

    if (isToday) return <span className="text-cyan-400 font-medium">Ma</span>;
    if (isTomorrow) return <span className="text-blue-400 font-medium">Holnap</span>;
    return date.toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' });
}

function getPlatformIconAndColor(platform: string) {
    const p = platform.toLowerCase();
    if (p.includes('telefon')) return { icon: Phone, color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
    if (p.includes('zoom')) return { icon: Video, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
    if (p.includes('meet')) return { icon: Monitor, color: 'bg-green-500/10 text-green-400 border-green-500/20' };
    if (p.includes('teams')) return { icon: Users, color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
    if (p.includes('személyes')) return { icon: MapPin, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    return { icon: Monitor, color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };
}

export default async function AdminSalesMeetingsPage() {
    const meetings = await getSalesMeetings()

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "SCHEDULED": 
                return (
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 flex items-center gap-1.5 w-fit">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                        Tervezett
                    </Badge>
                )
            case "COMPLETED": 
                return (
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 flex items-center gap-1.5 w-fit">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        Teljesítve
                    </Badge>
                )
            case "CANCELLED": 
                return (
                    <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 flex items-center gap-1.5 w-fit">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                        Törölve
                    </Badge>
                )
            default: 
                return (
                    <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700 flex items-center gap-1.5 w-fit">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                        {status}
                    </Badge>
                )
        }
    }

    const upcomingMeetings = meetings.filter(m => m.status === "SCHEDULED" && new Date(m.meetingTime) >= new Date())
    const pastMeetings = meetings.filter(m => m.status === "COMPLETED")
    const cancelledMeetings = meetings.filter(m => m.status === "CANCELLED")

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Értékesítési Meetingek</h1>
                    <p className="text-slate-400 mt-1">Kezeld és tekintsd át a közelgő és múltbeli ügyféltalálkozókat.</p>
                </div>
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                    <div className="relative">
                        <MeetingManager />
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-[#111827]/50 border-slate-800 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-600 to-slate-400 opacity-50"></div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-300">Összes találkozó</CardTitle>
                        <div className="p-2 bg-slate-800/50 rounded-full">
                            <Calendar className="h-4 w-4 text-slate-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">{meetings.length}</div>
                        <p className="text-xs text-slate-500 mt-1">Teljes adatbázis</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#111827]/50 border-slate-800 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-50"></div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-300">Közelgő (Tervezett)</CardTitle>
                        <div className="p-2 bg-blue-500/10 rounded-full">
                            <PhoneCall className="h-4 w-4 text-cyan-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-cyan-400">
                            {upcomingMeetings.length}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Aktív foglalások</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#111827]/50 border-slate-800 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500 opacity-50"></div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-300">Teljesített</CardTitle>
                        <div className="p-2 bg-emerald-500/10 rounded-full">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-400">
                            {pastMeetings.length}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Sikeresen lezárult</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#111827]/50 border-slate-800 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-rose-500 opacity-50"></div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-300">Törölve</CardTitle>
                        <div className="p-2 bg-red-500/10 rounded-full">
                            <XCircle className="h-4 w-4 text-red-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-400">
                            {cancelledMeetings.length}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Lemondott / meghiúsult</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-[#111827]/50 border-slate-800 overflow-hidden backdrop-blur-sm shadow-xl">
                <div className="flex items-center px-4 py-3 border-b border-slate-800 bg-slate-900/30">
                    <Search className="w-4 h-4 text-slate-400 mr-3" />
                    <input 
                        type="text" 
                        placeholder="Keresés ügyfél, email vagy platform alapján..." 
                        className="bg-transparent border-none text-sm text-slate-200 focus:outline-none w-full placeholder:text-slate-600" 
                        readOnly
                    />
                </div>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-900/50">
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="w-12 text-center text-slate-500">#</TableHead>
                                <TableHead className="text-slate-400 font-medium">Időpont</TableHead>
                                <TableHead className="text-slate-400 font-medium">Ügyfél neve</TableHead>
                                <TableHead className="text-slate-400 font-medium">Elérhetőség</TableHead>
                                <TableHead className="text-slate-400 font-medium">Platform</TableHead>
                                <TableHead className="text-slate-400 font-medium">Dokumentum</TableHead>
                                <TableHead className="text-slate-400 font-medium">Státusz</TableHead>
                                <TableHead className="text-right text-slate-400 font-medium pr-6">Műveletek</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {meetings.length > 0 ? (
                                meetings.map((meeting, index) => {
                                    const { icon: PlatformIcon, color: platformColor } = getPlatformIconAndColor(meeting.platform);
                                    
                                    return (
                                        <TableRow 
                                            key={meeting.id} 
                                            className="border-slate-800/60 hover:bg-slate-800/40 transition-colors group"
                                        >
                                            <TableCell className="text-center text-slate-600 text-xs font-medium">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">
                                                <div className="font-medium text-slate-200 flex items-center gap-2">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                                    {formatRelativeDate(new Date(meeting.meetingTime))}
                                                </div>
                                                <div className="text-xs text-slate-500 mt-1 ml-5.5">
                                                    {new Date(meeting.meetingTime).toLocaleDateString('hu-HU')} • {new Date(meeting.meetingTime).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-medium text-slate-200">{meeting.clientName}</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col text-sm gap-0.5">
                                                    {meeting.clientEmail && (
                                                        <span className="text-slate-300">{meeting.clientEmail}</span>
                                                    )}
                                                    {meeting.clientPhone && (
                                                        <span className="text-slate-500 text-xs">{meeting.clientPhone}</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col items-start gap-1.5">
                                                    <Badge variant="outline" className={`flex items-center gap-1 ${platformColor}`}>
                                                        <PlatformIcon className="w-3 h-3" />
                                                        {meeting.platform}
                                                    </Badge>
                                                    {meeting.meetingLink && (
                                                        <a href={meeting.meetingLink} target="_blank" rel="noreferrer" className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 transition-colors">
                                                            Csatlakozás <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                                        </a>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {meeting.hasDocument ? (
                                                    <a 
                                                        href={`/api/sales-meetings/${meeting.id}/document`} 
                                                        target="_blank" 
                                                        rel="noreferrer" 
                                                        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 bg-slate-800/50 hover:bg-slate-700/50 px-2.5 py-1.5 rounded-md border border-slate-700/50 transition-all hover:text-cyan-400"
                                                    >
                                                        <Download className="h-3.5 w-3.5" />
                                                        Kivonat
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-slate-600 flex items-center gap-1.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                                                        Nincs csatolva
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(meeting.status)}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                                                    <MeetingManager meeting={meeting} />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={8} className="h-[400px]">
                                        <div className="flex flex-col items-center justify-center text-center h-full space-y-4">
                                            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-2">
                                                <Inbox className="h-8 w-8 text-slate-500" />
                                            </div>
                                            <div>
                                                <p className="text-slate-300 font-medium text-lg">Nincsenek rögzített meetingek</p>
                                                <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                                                    Jelenleg nincs egyetlen találkozó sem az adatbázisban. Új meeting hozzáadásához használd a fenti gombot.
                                                </p>
                                            </div>
                                        </div>
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
