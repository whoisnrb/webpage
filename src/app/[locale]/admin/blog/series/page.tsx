
import { getAdminBlogSeries, deleteBlogSeries } from "@/app/actions/blog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { Plus, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { SeriesActions } from "./_components/series-actions"

export default async function AdminBlogSeriesPage() {
    const series = await getAdminBlogSeries()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blog">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Blog Sorozatok</h1>
                        <p className="text-muted-foreground">
                            Sorozatok kezelése — Csoportosítsd a bejegyzéseidet tematikusan.
                        </p>
                    </div>
                </div>
                <Button asChild>
                    <Link href="/admin/blog/series/new">
                        <Plus className="mr-2 h-4 w-4" /> Új Sorozat
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Sorozatok ({series.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Név</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead className="text-center">Bejegyzések</TableHead>
                                <TableHead>Létrehozva</TableHead>
                                <TableHead className="text-right">Műveletek</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {series.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                        Nincs még sorozat. Hozz létre egyet az „Új Sorozat" gombbal!
                                    </TableCell>
                                </TableRow>
                            ) : (
                                series.map((s: any) => (
                                    <TableRow key={s.id}>
                                        <TableCell className="font-medium">
                                            <div>
                                                <p>{s.title}</p>
                                                {s.titleEn && (
                                                    <p className="text-xs text-muted-foreground">{s.titleEn}</p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            /{s.slug}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary">{s._count.posts}</Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {format(new Date(s.createdAt), 'yyyy. MM. dd.')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <SeriesActions id={s.id} postCount={s._count.posts} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
