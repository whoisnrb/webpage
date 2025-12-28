import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { BarChart3, Users, MousePointer2 } from "lucide-react"
import { getTranslations } from "next-intl/server"

export default async function AnalyticsPage({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations('AdminAnalytics')

    const events = await prisma.analyticsEvent.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
    })

    const totalEvents = await prisma.analyticsEvent.count()
    // Group by name (simple aggregation for now)
    const topEvents = await prisma.analyticsEvent.groupBy({
        by: ['name'],
        _count: { name: true },
        orderBy: { _count: { name: 'desc' } },
        take: 5
    })

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('total_events')}</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalEvents}</div>
                        <p className="text-xs text-muted-foreground">{t('recorded_interactions')}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>{t('top_events')}</CardTitle>
                        <CardDescription>{t('top_events_desc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topEvents.map((evt) => (
                                <div key={evt.name} className="flex items-center">
                                    <MousePointer2 className="mr-2 h-4 w-4 opacity-70" />
                                    <div className="ml-2 space-y-1">
                                        <p className="text-sm font-medium leading-none">{evt.name}</p>
                                    </div>
                                    <div className="ml-auto font-medium">{evt._count.name}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>{t('recent_events')}</CardTitle>
                        <CardDescription>{t('recent_events_desc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('table.event')}</TableHead>
                                    <TableHead>{t('table.category')}</TableHead>
                                    <TableHead>{t('table.time')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {events.map((evt) => (
                                    <TableRow key={evt.id}>
                                        <TableCell className="font-medium">{evt.name}</TableCell>
                                        <TableCell>{evt.category}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {new Date(evt.createdAt).toLocaleString(locale === 'hu' ? 'hu-HU' : 'en-US')}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
