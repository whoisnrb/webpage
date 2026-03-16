"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ReferenceDTO, Metric, createReference, updateReference } from "@/app/actions/reference"
import { useRouter } from "@/i18n/routing"
import { toast } from "sonner"
import { Plus, Trash, Image as ImageIcon } from "lucide-react"

interface ReferenceFormProps {
    initialData?: ReferenceDTO
}

export function ReferenceForm({ initialData }: ReferenceFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null)
    const [metrics, setMetrics] = useState<Metric[]>(initialData?.metrics || [{ value: '', label: '' }])
    const [tags, setTags] = useState<string[]>(initialData?.tags || [])
    const [newTag, setNewTag] = useState("")

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 1024 * 1024) { // 1MB limit for references
                toast.error("A kép mérete nem haladhatja meg az 1MB-ot!")
                e.target.value = ""
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const addMetric = () => {
        setMetrics([...metrics, { value: '', label: '' }])
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
            tags: tags,
            metrics: metrics.filter(m => m.value.trim() !== "" && m.label.trim() !== ""),
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
        } catch (error) {
            console.error(error)
            toast.error("Hiba történt a mentés során")
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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug (URL)</Label>
                            <Input id="slug" name="slug" defaultValue={initialData?.slug} required placeholder="pl. webshop-automatizalas" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Kategória (HU)</Label>
                            <Input id="category" name="category" defaultValue={initialData?.category} required placeholder="pl. E-kereskedelem" />
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
