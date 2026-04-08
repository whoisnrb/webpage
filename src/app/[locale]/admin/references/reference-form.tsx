"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ReferenceDTO, Metric, createReference, updateReference } from "@/app/actions/reference"
import { useRouter } from "@/i18n/routing"
import { toast } from "sonner"
import { Plus, Trash, Image as ImageIcon, FileText, Download } from "lucide-react"

interface ReferenceFormProps {
    initialData?: ReferenceDTO
}

// Client-side image optimization utility
const optimizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (event) => {
            const img = new Image()
            img.src = event.target?.result as string
            img.onload = () => {
                const canvas = document.createElement('canvas')
                let width = img.width
                let height = img.height

                // Max dimensions: 1920px (Full HD)
                const MAX_WIDTH = 1920
                const MAX_HEIGHT = 1920

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width
                        width = MAX_WIDTH
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height
                        height = MAX_HEIGHT
                    }
                }

                canvas.width = width
                canvas.height = height
                const ctx = canvas.getContext('2d')
                ctx?.drawImage(img, 0, 0, width, height)

                // Output as JPEG with 0.8 quality
                resolve(canvas.toDataURL('image/jpeg', 0.8))
            }
            img.onerror = reject
        }
        reader.onerror = reject
    })
}

export function ReferenceForm({ initialData }: ReferenceFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null)
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>(initialData?.galleryImages || [])
    const [docFile, setDocFile] = useState<string | null>(initialData?.documentationFile || null)
    const [metrics, setMetrics] = useState<Metric[]>(initialData?.metrics || [{ value: '', label: '', labelEn: '' }])
    const [tags, setTags] = useState<string[]>(initialData?.tags || [])
    const [newTag, setNewTag] = useState("")

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setLoading(true)
            try {
                const optimized = await optimizeImage(file)
                setImagePreview(optimized)
            } catch (error) {
                console.error("Image optimization failed:", error)
                toast.error("Hiba történt a kép feldolgozása során")
            } finally {
                setLoading(false)
            }
        }
    }

    const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        setLoading(true)
        try {
            const optimizedImages = await Promise.all(
                files.map(file => optimizeImage(file))
            )
            setGalleryPreviews(prev => [...prev, ...optimizedImages])
        } catch (error) {
            console.error("Gallery optimization failed:", error)
            toast.error("Hiba történt a galéria képek feldolgozása során")
        } finally {
            setLoading(false)
        }
        e.target.value = ""
    }

    const removeGalleryImage = (index: number) => {
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index))
    }

    const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 15 * 1024 * 1024) { // 15MB limit for docs
                toast.error("A dokumentáció mérete nem haladhatja meg a 15MB-ot!")
                e.target.value = ""
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                setDocFile(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const addMetric = () => {
        setMetrics([...metrics, { value: '', label: '', labelEn: '' }])
    }

    const removeMetric = (index: number) => {
        setMetrics(metrics.filter((_, i) => i !== index))
    }

    const updateMetric = (index: number, field: keyof Metric, value: string) => {
        const newMetrics = [...metrics]
        newMetrics[index] = { ...newMetrics[index], [field]: value }
        setMetrics(newMetrics)
    }

    const addTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags([...tags, newTag.trim()])
            setNewTag("")
        }
    }

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const imageValue = imagePreview || (formData.get("image") as string)

        if (!imageValue) {
            toast.error("A borítókép megadása kötelező!")
            setLoading(false)
            return
        }

        const data = {
            slug: formData.get("slug") as string,
            title: formData.get("title") as string,
            titleEn: (formData.get("titleEn") as string) || null,
            client: formData.get("client") as string,
            clientEn: (formData.get("clientEn") as string) || null,
            category: formData.get("category") as string,
            categoryEn: (formData.get("categoryEn") as string) || null,
            description: formData.get("description") as string,
            descriptionEn: (formData.get("descriptionEn") as string) || null,
            challenge: formData.get("challenge") as string,
            challengeEn: (formData.get("challengeEn") as string) || null,
            solution: formData.get("solution") as string,
            solutionEn: (formData.get("solutionEn") as string) || null,
            result: formData.get("result") as string,
            resultEn: (formData.get("resultEn") as string) || null,
            image: imageValue,
            galleryImages: galleryPreviews,
            content: (formData.get("content") as string) || null,
            contentEn: (formData.get("contentEn") as string) || null,
            type: formData.get("type") as string,
            documentationFile: docFile,
            showDocumentation: formData.get("showDocumentation") === "on",
            tags: tags,
            metrics: metrics.filter(m => m.value.trim() !== "" && m.label.trim() !== "").map(m => ({ value: m.value, label: m.label, labelEn: m.labelEn })),
            active: formData.get("active") === "on",
        }

        try {
            if (initialData) {
                await updateReference(initialData.id, data)
                toast.success("Referencia frissítve")
            } else {
                await createReference(data)
                toast.success("Referencia létrehozva")
            }
            router.push("/admin/references")
            router.refresh()
        } catch (error: any) {
            console.error("REFERENCE FORM SUBMIT ERROR:", error)
            const errorMsg = error?.message || "Ismeretlen hiba"
            toast.error(`Hiba történt a mentés során: ${errorMsg}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl pb-20">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold border-b pb-2">Alapadatok</h3>
                    
                    <div className="space-y-2">
                        <Label htmlFor="type">Referencia Típusa</Label>
                        <select id="type" name="type" defaultValue={initialData?.type || "WEBSITE"} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <option value="WEBSITE">Weboldal</option>
                            <option value="SERVICE">Szolgáltatás</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Cím (HU)</Label>
                            <Input id="title" name="title" defaultValue={initialData?.title} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="titleEn">Title (EN)</Label>
                            <Input id="titleEn" name="titleEn" defaultValue={initialData?.titleEn || ""} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug (URL)</Label>
                            <Input id="slug" name="slug" defaultValue={initialData?.slug} required placeholder="pl. webshop-automatizalas" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Kategória (HU)</Label>
                                <Input id="category" name="category" defaultValue={initialData?.category} required placeholder="pl. E-kereskedelem" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="categoryEn">Category (EN)</Label>
                                <Input id="categoryEn" name="categoryEn" defaultValue={initialData?.categoryEn || ""} placeholder="e.g. E-commerce" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="client">Ügyfél (HU)</Label>
                            <Input id="client" name="client" defaultValue={initialData?.client} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="clientEn">Client (EN)</Label>
                            <Input id="clientEn" name="clientEn" defaultValue={initialData?.clientEn || ""} />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                        <input
                            type="checkbox"
                            id="active"
                            name="active"
                            defaultChecked={initialData ? initialData.active : true}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="active">Aktív (Megjelenik az oldalon)</Label>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                        <input
                            type="checkbox"
                            id="showDocumentation"
                            name="showDocumentation"
                            defaultChecked={initialData ? initialData.showDocumentation : false}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="showDocumentation">Dokumentáció letöltés engedélyezése</Label>
                    </div>
                </div>

                {/* Images & Tags */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold border-b pb-2">Média és Tegek</h3>
                    
                    <div className="space-y-2">
                        <Label>Borítókép</Label>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center space-y-4">
                            {imagePreview ? (
                                <div className="relative aspect-video rounded-md overflow-hidden bg-muted">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <Button 
                                        type="button" 
                                        variant="destructive" 
                                        size="icon" 
                                        className="absolute top-2 right-2 h-8 w-8"
                                        onClick={() => setImagePreview(null)}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="py-8 flex flex-col items-center justify-center text-muted-foreground">
                                    <ImageIcon className="h-12 w-12 mb-2 opacity-20" />
                                    <p className="text-sm">Kattints vagy húzz ide egy képet</p>
                                </div>
                            )}
                            <Input type="file" accept="image/*" onChange={handleImageChange} className="cursor-pointer" />
                        </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                        <Label>Galéria Képek</Label>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center space-y-4">
                            {galleryPreviews.length > 0 && (
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    {galleryPreviews.map((preview, index) => (
                                        <div key={index} className="relative aspect-square rounded-md overflow-hidden bg-muted">
                                            <img src={preview} alt={`Gallery Preview ${index + 1}`} className="w-full h-full object-cover" />
                                            <Button 
                                                type="button" 
                                                variant="destructive" 
                                                size="icon" 
                                                className="absolute top-1 right-1 h-6 w-6"
                                                onClick={() => removeGalleryImage(index)}
                                            >
                                                <Trash className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="py-4 flex flex-col items-center justify-center text-muted-foreground">
                                <ImageIcon className="h-8 w-8 mb-2 opacity-20" />
                                <p className="text-sm">Tallózz be további képeket (automatikus optimalizálás)</p>
                            </div>
                            <Input type="file" accept="image/*" multiple onChange={handleGalleryChange} className="cursor-pointer" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Tegek (pl. Next.js, n8n, VPN)</Label>
                        <div className="flex gap-2">
                            <Input 
                                value={newTag} 
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                                placeholder="Új teg..."
                            />
                            <Button type="button" variant="outline" onClick={addTag}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {tags.map(tag => (
                                <span key={tag} className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/20">
                                    {tag}
                                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive">
                                        <Trash className="h-3 w-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                        <Label>Dokumentáció (PDF)</Label>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center space-y-4">
                            {docFile ? (
                                <div className="flex items-center justify-between p-3 bg-muted rounded-md border border-primary/20">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/20 p-2 rounded text-primary">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-medium">Dokumentáció feltöltve</p>
                                            <p className="text-xs text-muted-foreground uppercase">PDF fájl</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button 
                                            type="button" 
                                            variant="destructive" 
                                            size="icon" 
                                            className="h-8 w-8"
                                            onClick={() => setDocFile(null)}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-4 flex flex-col items-center justify-center text-muted-foreground">
                                    <FileText className="h-10 w-10 mb-2 opacity-20" />
                                    <p className="text-sm">Tallózz be egy PDF dokumentációt</p>
                                </div>
                            )}
                            <Input type="file" accept="application/pdf" onChange={handleDocChange} className="cursor-pointer" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Content */}
            <div className="space-y-8 mt-8">
                <h3 className="text-xl font-bold border-b pb-2">Részletes Tartalom</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <Label className="text-lg font-semibold">Magyar tartalom</Label>
                        <div className="space-y-2">
                            <Label htmlFor="description">Rövid összefoglaló</Label>
                            <Textarea id="description" name="description" defaultValue={initialData?.description} required rows={3} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="challenge">Kihívás</Label>
                            <Textarea id="challenge" name="challenge" defaultValue={initialData?.challenge} required rows={5} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="solution">Megoldás</Label>
                            <Textarea id="solution" name="solution" defaultValue={initialData?.solution} required rows={5} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="result">Eredmény</Label>
                            <Textarea id="result" name="result" defaultValue={initialData?.result} required rows={5} />
                        </div>
                        <div className="space-y-2 pt-4 border-t">
                            <Label htmlFor="content">Bővebb tartalom (Opcionális HTML/Szöveg)</Label>
                            <p className="text-xs text-muted-foreground">Tetszőleges más dolgok kiírására a kihívás/megoldás/eredmény blokkokon túl.</p>
                            <Textarea id="content" name="content" defaultValue={initialData?.content || ""} rows={10} />
                        </div>
                    </div>

                    <div className="space-y-4 text-muted-foreground">
                        <Label className="text-lg font-semibold">English content</Label>
                        <div className="space-y-2">
                            <Label htmlFor="descriptionEn">Short Summary (EN)</Label>
                            <Textarea id="descriptionEn" name="descriptionEn" defaultValue={initialData?.descriptionEn || ""} rows={3} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="challengeEn">Challenge (EN)</Label>
                            <Textarea id="challengeEn" name="challengeEn" defaultValue={initialData?.challengeEn || ""} rows={5} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="solutionEn">Solution (EN)</Label>
                            <Textarea id="solutionEn" name="solutionEn" defaultValue={initialData?.solutionEn || ""} rows={5} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="resultEn">Result (EN)</Label>
                            <Textarea id="resultEn" name="resultEn" defaultValue={initialData?.resultEn || ""} rows={5} />
                        </div>
                        <div className="space-y-2 pt-4 border-t">
                            <Label htmlFor="contentEn">Extended Content (EN)</Label>
                            <p className="text-xs text-muted-foreground">Optional, extra HTML or text to display besides standard blocks.</p>
                            <Textarea id="contentEn" name="contentEn" defaultValue={initialData?.contentEn || ""} rows={10} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics */}
            <div className="space-y-6 mt-8">
                <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-xl font-bold">Főbb Eredmények (Metrics)</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addMetric}>
                        <Plus className="mr-2 h-4 w-4" /> Új eredmény
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground">Pl. Érték: "40%", Címke: "Konverzió növekedés"</p>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {metrics.map((metric, index) => (
                        <div key={index} className="flex flex-col gap-2 p-4 border rounded-lg bg-card relative group">
                            <Input 
                                placeholder="Érték (pl. 40%)" 
                                value={metric.value} 
                                onChange={(e) => updateMetric(index, 'value', e.target.value)}
                            />
                            <Input 
                                placeholder="Címke (pl. Gyorsabb)" 
                                value={metric.label} 
                                onChange={(e) => updateMetric(index, 'label', e.target.value)}
                            />
                            <Input 
                                placeholder="Label (EN) pl. Faster" 
                                value={metric.labelEn || ''} 
                                onChange={(e) => updateMetric(index, 'labelEn', e.target.value)}
                            />
                            <Button 
                                type="button" 
                                variant="destructive" 
                                size="icon" 
                                className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeMetric(index)}
                            >
                                <Trash className="h-3 w-3" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-8 border-t">
                <Button type="button" variant="outline" onClick={() => router.back()}>Mégse</Button>
                <Button type="submit" disabled={loading} size="lg" className="min-w-[200px]">
                    {loading ? "Mentés..." : (initialData ? "Referencia frissítése" : "Referencia létrehozása")}
                </Button>
            </div>
        </form>
    )
}
