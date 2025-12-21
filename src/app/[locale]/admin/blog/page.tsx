
import { getBlogPosts } from "@/app/actions/blog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "@/i18n/routing"
import { Plus } from "lucide-react"
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
import { AdminBlogActions } from "./_components/admin-blog-actions"
import { DemoContentButton } from "./_components/demo-content-button"

export default async function AdminBlogPage() {
    const posts = await getBlogPosts()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Blog Kezelés</h1>
                    <p className="text-muted-foreground">
                        Bejegyzések, hírek és esettanulmányok kezelése a tartalommarketinghez.
                    </p>
                </div>
                <div className="flex gap-2">
                    <DemoContentButton />
                    <Button asChild>
                        <Link href="/admin/blog/new">
                            <Plus className="mr-2 h-4 w-4" /> Új Bejegyzés
                        </Link>
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Összes Bejegyzés ({posts.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Cím</TableHead>
                                <TableHead>Szerző</TableHead>
                                <TableHead>Státusz</TableHead>
                                <TableHead>Dátum</TableHead>
                                <TableHead className="text-right">Műveletek</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        Nincs még bejegyzés. Hozz létre egyet vagy generálj demo tartalmat!
                                    </TableCell>
                                </TableRow>
                            ) : (
                                posts.map((post: any) => (
                                    <TableRow key={post.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span>{post.title}</span>
                                                <span className="text-xs text-muted-foreground">/{post.slug}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{post.author}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                {post.published ? (
                                                    <Badge variant="default" className="bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 border-emerald-500/20">Publikus</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Vázlat</Badge>
                                                )}
                                                {post.featured && (
                                                    <Badge variant="outline" className="border-amber-500 text-amber-500">Kiemelt</Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(post.createdAt), 'yyyy. MM. dd.')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <AdminBlogActions id={post.id} slug={post.slug} />
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
