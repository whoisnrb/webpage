
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { Link } from "@/i18n/routing"
import {
    createBlogPost,
    updateBlogPost,
    getAdminBlogSeries,
    type BlogPostData,
} from "@/app/actions/blog"
import { toast } from "sonner"

interface BlogSeriesOption {
    id: string
    title: string
}

interface BlogPostFormProps {
    initialData?: BlogPostData & { id: string }
    seriesList?: BlogSeriesOption[]
}

export function BlogPostForm({ initialData, seriesList: initialSeriesList }: BlogPostFormProps) {
    const router = useRouter()
    const isNew = !initialData
    const [loading, setLoading] = useState(false)
    const [seriesList, setSeriesList] = useState<BlogSeriesOption[]>(initialSeriesList || [])

    // Form state
    const [title, setTitle] = useState(initialData?.title ?? "")
    const [titleEn, setTitleEn] = useState(initialData?.titleEn ?? "")
    const [slug, setSlug] = useState(initialData?.slug ?? "")
    const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "")
    const [excerptEn, setExcerptEn] = useState(initialData?.excerptEn ?? "")
    const [content, setContent] = useState(initialData?.content ?? "")
    const [contentEn, setContentEn] = useState(initialData?.contentEn ?? "")
    const [author, setAuthor] = useState(initialData?.author ?? "BacklineIT Team")
    const [tags, setTags] = useState(initialData?.tags?.join(", ") ?? "")
    const [coverImage, setCoverImage] = useState(initialData?.coverImage ?? "")
    const [seriesId, setSeriesId] = useState(initialData?.seriesId ?? "")
    const [published, setPublished] = useState(initialData?.published ?? false)
    const [featured, setFeatured] = useState(initialData?.featured ?? false)

    // Fetch series list if not provided
    useEffect(() => {
        if (!initialSeriesList) {
            getAdminBlogSeries().then((series) => {
                setSeriesList(series.map((s: any) => ({ id: s.id, title: s.title })))
            })
        }
    }, [initialSeriesList])

    // Auto-generate slug
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i')
            .replace(/ó/g, 'o').replace(/ö/g, 'o').replace(/ő/g, 'o')
            .replace(/ú/g, 'u').replace(/ü/g, 'u').replace(/ű/g, 'u')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const data: BlogPostData = {
            title,
            titleEn: titleEn || undefined,
            slug,
            excerpt,
            excerptEn: excerptEn || undefined,
            content,
            contentEn: contentEn || undefined,
            author: author || "BacklineIT Team",
            tags: tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [],
            coverImage: coverImage || undefined,
            seriesId: seriesId || null,
            published,
            featured,
        }

        try {
            let result
            if (isNew) {
                result = await createBlogPost(data)
            } else {
                result = await updateBlogPost(initialData.id, data)
            }

            if (result.success) {
                toast.success(isNew ? "Bejegyzés létrehozva!" : "Bejegyzés frissítve!")
                router.push("/admin/blog")
                router.refresh()
            } else {
                toast.error(result.error || "Hiba történt a mentés során")
            }
        } catch (error) {
            toast.error("Váratlan hiba történt")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 max-w-5xl">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/blog">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {isNew ? "Új Bejegyzés" : "Bejegyzés Szerkesztése"}
                    </h1>
                    <p className="text-muted-foreground">
                        {isNew ? "Új szakértői tartalom létrehozása" : initialData.title}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* ── Alapadatok ──────────────────────────── */}
                <Card>
                    <CardHeader>
                        <CardTitle>Alapadatok</CardTitle>
                        <CardDescription>A bejegyzés címe, slug-ja és szerzője</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Cím (HU) *</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value)
                                        if (isNew) setSlug(generateSlug(e.target.value))
                                    }}
                                    placeholder="Bejegyzés címe magyarul"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="titleEn">Cím (EN)</Label>
                                <Input
                                    id="titleEn"
                                    value={titleEn}
                                    onChange={(e) => setTitleEn(e.target.value)}
                                    placeholder="Blog post title in English"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug (URL) *</Label>
                                <Input
                                    id="slug"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    placeholder="pelda-bejegyzes-slug"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Automatikusan generálódik a címből, de módosítható.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="author">Szerző</Label>
                                <Input
                                    id="author"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    placeholder="BacklineIT Team"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ── Kivonat ────────────────────────────── */}
                <Card>
                    <CardHeader>
                        <CardTitle>Kivonat (Excerpt)</CardTitle>
                        <CardDescription>Rövid összefoglaló a listanézethez és SEO meta leíráshoz</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="excerpt">Kivonat (HU) *</Label>
                            <Textarea
                                id="excerpt"
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                rows={3}
                                placeholder="Rövid összefoglaló magyarul (2-3 mondat)..."
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="excerptEn">Kivonat (EN)</Label>
                            <Textarea
                                id="excerptEn"
                                value={excerptEn}
                                onChange={(e) => setExcerptEn(e.target.value)}
                                rows={3}
                                placeholder="Short summary in English (2-3 sentences)..."
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* ── Tartalom ───────────────────────────── */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tartalom</CardTitle>
                        <CardDescription>A cikk fő tartalma · Markdown formátumban</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="content">Tartalom (HU) *</Label>
                            <Textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={16}
                                className="font-mono text-sm"
                                placeholder={"# Címsor\n\nBekezdés szövege...\n\n## Alcím\n\n- Lista elem 1\n- Lista elem 2"}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contentEn">Tartalom (EN)</Label>
                            <Textarea
                                id="contentEn"
                                value={contentEn}
                                onChange={(e) => setContentEn(e.target.value)}
                                rows={16}
                                className="font-mono text-sm"
                                placeholder={"# Heading\n\nParagraph text...\n\n## Subheading\n\n- List item 1\n- List item 2"}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* ── Média & Címkék ─────────────────────── */}
                <Card>
                    <CardHeader>
                        <CardTitle>Média & Címkék</CardTitle>
                        <CardDescription>Borítókép és címkék a bejegyzéshez</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="coverImage">Borítókép URL</Label>
                            <Input
                                id="coverImage"
                                value={coverImage}
                                onChange={(e) => setCoverImage(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                            />
                            {coverImage && (
                                <div className="mt-2">
                                    <img
                                        src={coverImage}
                                        alt="Borítókép előnézet"
                                        className="w-full max-w-md h-48 object-cover rounded-lg border"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none'
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tags">Címkék (vesszővel elválasztva)</Label>
                            <Input
                                id="tags"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="IT biztonság, Cloud, Automatizáció"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* ── Sorozat ────────────────────────────── */}
                <Card>
                    <CardHeader>
                        <CardTitle>Sorozat</CardTitle>
                        <CardDescription>Tartozik-e a bejegyzés egy blog sorozathoz?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="seriesId">Blog Sorozat</Label>
                            <select
                                id="seriesId"
                                value={seriesId}
                                onChange={(e) => setSeriesId(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <option value="">— Nincs sorozat —</option>
                                {seriesList.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.title}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-muted-foreground">
                                Sorozatokat a <Link href="/admin/blog/series" className="underline">Sorozatok kezelés</Link> menüpontban hozhatsz létre.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* ── Publikálási beállítások ─────────────── */}
                <Card>
                    <CardHeader>
                        <CardTitle>Publikálási beállítások</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">Publikálva</Label>
                                <p className="text-sm text-muted-foreground">
                                    A bejegyzés azonnal megjelenik a publikus oldalon.
                                </p>
                            </div>
                            <Switch
                                checked={published}
                                onCheckedChange={setPublished}
                            />
                        </div>
                        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">Kiemelt bejegyzés</Label>
                                <p className="text-sm text-muted-foreground">
                                    Kiemelt helyen jelenik meg a blog listában.
                                </p>
                            </div>
                            <Switch
                                checked={featured}
                                onCheckedChange={setFeatured}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* ── Submit ──────────────────────────────── */}
                <div className="flex gap-4">
                    <Button type="submit" disabled={loading} className="min-w-[200px]">
                        {loading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        {loading ? "Mentés..." : (isNew ? "Létrehozás" : "Mentés")}
                    </Button>
                    <Link href="/admin/blog">
                        <Button type="button" variant="outline">Mégse</Button>
                    </Link>
                </div>
            </form>
        </div>
    )
}
