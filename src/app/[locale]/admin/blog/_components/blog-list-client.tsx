"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/i18n/routing"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Plus, FileText, Eye, BookOpen, Star } from "lucide-react"
import { format } from "date-fns"
import { AdminBlogActions } from "./admin-blog-actions"
import { PublishToggle, FeaturedToggle } from "./quick-toggles"
import { BlogFilters } from "./blog-filters"

interface BlogPost {
    id: string
    title: string
    titleEn: string | null
    slug: string
    excerpt: string
    author: string
    tags: string[]
    published: boolean
    featured: boolean
    coverImage: string | null
    seriesId: string | null
    series: { id: string; title: string } | null
    createdAt: Date
    updatedAt: Date
}

interface BlogListClientProps {
    posts: BlogPost[]
}

export function BlogListClient({ posts }: BlogListClientProps) {
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all")
    const [featuredFilter, setFeaturedFilter] = useState<boolean | null>(null)

    // Stats
    const totalPosts = posts.length
    const publishedPosts = posts.filter(p => p.published).length
    const draftPosts = posts.filter(p => !p.published).length
    const featuredPosts = posts.filter(p => p.featured).length

    // Filtered posts
    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            // Search filter
            if (search && !post.title.toLowerCase().includes(search.toLowerCase()) &&
                !(post.titleEn && post.titleEn.toLowerCase().includes(search.toLowerCase()))) {
                return false
            }
            // Status filter
            if (statusFilter === "published" && !post.published) return false
            if (statusFilter === "draft" && post.published) return false
            // Featured filter
            if (featuredFilter && !post.featured) return false
            return true
        })
    }, [posts, search, statusFilter, featuredFilter])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Blog Kezelés</h1>
                    <p className="text-muted-foreground">
                        Bejegyzések, sorozatok és tartalommarketing kezelése.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/admin/blog/series">
                            <BookOpen className="mr-2 h-4 w-4" /> Sorozatok
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/admin/blog/new">
                            <Plus className="mr-2 h-4 w-4" /> Új Bejegyzés
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Összes</p>
                                <p className="text-3xl font-bold">{totalPosts}</p>
                            </div>
                            <FileText className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Publikus</p>
                                <p className="text-3xl font-bold text-emerald-500">{publishedPosts}</p>
                            </div>
                            <Eye className="h-8 w-8 text-emerald-500/50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Vázlat</p>
                                <p className="text-3xl font-bold text-orange-500">{draftPosts}</p>
                            </div>
                            <FileText className="h-8 w-8 text-orange-500/50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Kiemelt</p>
                                <p className="text-3xl font-bold text-amber-500">{featuredPosts}</p>
                            </div>
                            <Star className="h-8 w-8 text-amber-500/50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <BlogFilters
                onSearchChange={setSearch}
                onStatusChange={setStatusFilter}
                onFeaturedChange={setFeaturedFilter}
                activeStatus={statusFilter}
                activeFeatured={featuredFilter}
                searchValue={search}
            />

            {/* Posts Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Bejegyzések ({filteredPosts.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">Cím</TableHead>
                                <TableHead>Szerző</TableHead>
                                <TableHead>Sorozat</TableHead>
                                <TableHead>Címkék</TableHead>
                                <TableHead className="text-center">Státusz</TableHead>
                                <TableHead>Dátum</TableHead>
                                <TableHead className="text-right">Műveletek</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPosts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                        {posts.length === 0
                                            ? "Nincs még bejegyzés. Hozz létre egyet az Új Bejegyzés gombbal!"
                                            : "Nincs találat a szűrési feltételeknek megfelelően."
                                        }
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPosts.map((post) => (
                                    <TableRow key={post.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-start gap-3">
                                                {post.coverImage && (
                                                    <img
                                                        src={post.coverImage}
                                                        alt=""
                                                        className="w-12 h-8 object-cover rounded border shrink-0"
                                                    />
                                                )}
                                                <div className="min-w-0">
                                                    <p className="font-medium truncate">{post.title}</p>
                                                    {post.titleEn && (
                                                        <p className="text-xs text-muted-foreground truncate">{post.titleEn}</p>
                                                    )}
                                                    <p className="text-xs text-muted-foreground">/{post.slug}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">{post.author}</TableCell>
                                        <TableCell>
                                            {post.series ? (
                                                <Badge variant="outline" className="text-xs">
                                                    {post.series.title}
                                                </Badge>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1 max-w-[150px]">
                                                {post.tags.slice(0, 3).map((tag) => (
                                                    <Badge key={tag} variant="secondary" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                                {post.tags.length > 3 && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        +{post.tags.length - 3}
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-0">
                                                <PublishToggle id={post.id} published={post.published} />
                                                <FeaturedToggle id={post.id} featured={post.featured} />
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
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
