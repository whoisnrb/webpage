"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { Link } from "@/i18n/routing"
import {
    createBlogSeries,
    updateBlogSeries,
    type BlogSeriesData,
} from "@/app/actions/blog"
import { toast } from "sonner"

interface BlogSeriesFormProps {
    initialData?: BlogSeriesData & { id: string }
}

export function BlogSeriesForm({ initialData }: BlogSeriesFormProps) {
    const router = useRouter()
    const isNew = !initialData
    const [loading, setLoading] = useState(false)

    const [title, setTitle] = useState(initialData?.title ?? "")
    const [titleEn, setTitleEn] = useState(initialData?.titleEn ?? "")
    const [slug, setSlug] = useState(initialData?.slug ?? "")
    const [description, setDescription] = useState(initialData?.description ?? "")
    const [descriptionEn, setDescriptionEn] = useState(initialData?.descriptionEn ?? "")
    const [coverImage, setCoverImage] = useState(initialData?.coverImage ?? "")

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

        const data: BlogSeriesData = {
            title,
            titleEn: titleEn || undefined,
            slug,
            description,
            descriptionEn: descriptionEn || undefined,
            coverImage: coverImage || undefined,
        }

        try {
            let result
            if (isNew) {
                result = await createBlogSeries(data)
            } else {
                result = await updateBlogSeries(initialData.id, data)
            }

            if (result.success) {
                toast.success(isNew ? "Sorozat létrehozva!" : "Sorozat frissítve!")
                router.push("/admin/blog/series")
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
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center gap-4">
                <Link href="/admin/blog/series">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {isNew ? "Új Sorozat" : "Sorozat Szerkesztése"}
                    </h1>
                    <p className="text-muted-foreground">
                        {isNew ? "Hozz létre új blog sorozatot" : initialData.title}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Alapadatok</CardTitle>
                        <CardDescription>A sorozat neve és URL-je</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Név (HU) *</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value)
                                        if (isNew) setSlug(generateSlug(e.target.value))
                                    }}
                                    placeholder="Pl. IT Biztonság Sorozat"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="titleEn">Név (EN)</Label>
                                <Input
                                    id="titleEn"
                                    value={titleEn}
                                    onChange={(e) => setTitleEn(e.target.value)}
                                    placeholder="e.g. IT Security Series"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug (URL) *</Label>
                            <Input
                                id="slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="it-biztonsag-sorozat"
                                required
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Leírás</CardTitle>
                        <CardDescription>A sorozat rövid bemutatása</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="description">Leírás (HU) *</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                placeholder="A sorozat leírása magyarul..."
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="descriptionEn">Leírás (EN)</Label>
                            <Textarea
                                id="descriptionEn"
                                value={descriptionEn}
                                onChange={(e) => setDescriptionEn(e.target.value)}
                                rows={4}
                                placeholder="Series description in English..."
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Borítókép</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="coverImage">Borítókép URL</Label>
                            <Input
                                id="coverImage"
                                value={coverImage}
                                onChange={(e) => setCoverImage(e.target.value)}
                                placeholder="https://example.com/series-cover.jpg"
                            />
                            {coverImage && (
                                <img
                                    src={coverImage}
                                    alt="Borítókép előnézet"
                                    className="w-full max-w-sm h-32 object-cover rounded-lg border mt-2"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none'
                                    }}
                                />
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-4">
                    <Button type="submit" disabled={loading} className="min-w-[200px]">
                        {loading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        {loading ? "Mentés..." : (isNew ? "Létrehozás" : "Mentés")}
                    </Button>
                    <Link href="/admin/blog/series">
                        <Button type="button" variant="outline">Mégse</Button>
                    </Link>
                </div>
            </form>
        </div>
    )
}
