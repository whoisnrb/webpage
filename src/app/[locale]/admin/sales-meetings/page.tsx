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
import { Calendar, PhoneCall, CheckCircle2, XCircle, FileText } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function AdminSalesMeetingsPage() {
    const meetings = await getSalesMeetings()

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "SCHEDULED": return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Tervezett</Badge>
            case "COMPLETED": return <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">Teljesítve</Badge>
            case "CANCELLED": return <Badge variant="destructive">Törölve</Badge>
            default: return <Badge variant="outline">{status}</Badge>
        }
    }

    const upcomingMeetings = meetings.filter(m => m.status === "SCHEDULED" && new Date(m.meetingTime) >= new Date())
    const pastMeetings = meetings.filter(m => m.status === "COMPLETED")

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Értékesítési Meetingek</h1>
                <MeetingManager />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Összes találkozó</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{meetings.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Közelgő (Tervezett)</CardTitle>
                        <PhoneCall className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-500">
                            {upcomingMeetings.length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Teljesített</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">
                            {pastMeetings.length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Meetingek kezelése</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Időpont</TableHead>
                                <TableHead>Ügyfél neve</TableHead>
                                <TableHead>Elérhetőség</TableHead>
                                <TableHead>Platform</TableHead>
                                <TableHead>Dokumentum</TableHead>
                                <TableHead>Státusz</TableHead>
                                <TableHead className="text-right">Műveletek</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {meetings.length > 0 ? (
                                meetings.map((meeting) => (
                                    <TableRow key={meeting.id}>
                                        <TableCell className="whitespace-nowrap">
                                            <div className="font-medium">
                                                {new Date(meeting.meetingTime).toLocaleDateString('hu-HU')}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {new Date(meeting.meetingTime).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium">{meeting.clientName}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm">
                                                {meeting.clientEmail && <span>{meeting.clientEmail}</span>}
                                                {meeting.clientPhone && <span className="text-muted-foreground">{meeting.clientPhone}</span>}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <Badge variant="outline" className="w-fit">{meeting.platform}</Badge>
                                                {meeting.meetingLink && (
                                                    <a href={meeting.meetingLink} target="_blank" rel="noreferrer" className="text-xs text-cyan-500 hover:underline">
                                                        Link megnyitása
                                                    </a>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {meeting.hasDocument ? (
                                                <a href={`/api/sales-meetings/${meeting.id}/document`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                                                    <FileText className="h-4 w-4" />
                                                    Letöltés
                                                </a>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">Nincs</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(meeting.status)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <MeetingManager meeting={meeting} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                        Nincsenek rögzített meetingek.
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
