"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ProductDTO, createProduct, updateProduct, Variant } from "@/app/actions/product"
import { useRouter } from "@/i18n/routing"
import { toast } from "sonner"
import { Plus, Trash } from "lucide-react"

interface ProductFormProps {
    initialData?: ProductDTO
}

export function ProductForm({ initialData }: ProductFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null)

    // Initialize variants: separate migration check handled in DTO mapping ensures we always have Variant[] in initialData.prices if it exists.
    // If it's a new product, we provide a default empty variant.
    const [variants, setVariants] = useState<Variant[]>(
        initialData?.prices && initialData.prices.length > 0
            ? initialData.prices
            : [{ name: '', nameEn: '', price: 0, description: '', descriptionEn: '' }]
    )

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 800 * 1024) { // 800KB limit
                toast.error("A kép mérete nem haladhatja meg a 800KB-ot!")
                e.target.value = "" // Reset input
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const addVariant = () => {
        setVariants([...variants, { name: '', nameEn: '', price: 0, description: '', descriptionEn: '' }])
    }

    const removeVariant = (index: number) => {
        if (variants.length === 1) {
            toast.error("Legalább egy verziónak lennie kell!")
            return
        }
        setVariants(variants.filter((_, i) => i !== index))
    }

    const updateVariant = (index: number, field: keyof Variant, value: string | number) => {
        const newVariants = [...variants]
        newVariants[index] = { ...newVariants[index], [field]: value }
        setVariants(newVariants)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const featuresText = formData.get("features") as string
        const features = featuresText.split("\n").filter(line => line.trim() !== "")
        const featuresEnText = formData.get("featuresEn") as string
        const featuresEn = featuresEnText ? featuresEnText.split("\n").filter(line => line.trim() !== "") : null

        const imageValue = imagePreview || (formData.get("image") as string)

        // Validate variants
        const validVariants = variants.filter(v => v.name.trim() !== "")
        if (validVariants.length === 0) {
            toast.error("Legalább egy érvényes verzió (névvel) szükséges!")
            setLoading(false)
            return
        }

        const data = {
            title: formData.get("title") as string,
            titleEn: (formData.get("titleEn") as string) || null,
            description: formData.get("description") as string,
            descriptionEn: (formData.get("descriptionEn") as string) || null,
            longDescription: formData.get("longDescription") as string,
            longDescriptionEn: (formData.get("longDescriptionEn") as string) || null,
            price: parseInt(formData.get("price") as string),
            category: formData.get("category") as string,
            slug: formData.get("slug") as string,
            image: imageValue,
            features: features,
            featuresEn: featuresEn && featuresEn.length > 0 ? featuresEn : null,
            prices: validVariants as any
        }

        try {
            if (initialData) {
                await updateProduct(initialData.id, data)
                toast.success("Termék frissítve")
            } else {
                await createProduct(data)
                toast.success("Termék létrehozva")
            }
            router.push("/admin/products")
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error("Hiba történt a mentés során")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Termék neve (HU)</Label>
                        <Input id="title" name="title" defaultValue={initialData?.title} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="titleEn">Product Name (EN)</Label>
                        <Input id="titleEn" name="titleEn" defaultValue={initialData?.titleEn || ""} placeholder="English product name" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug (URL)</Label>
                        <Input id="slug" name="slug" defaultValue={initialData?.slug} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Kategória</Label>
                        <Input id="category" name="category" defaultValue={initialData?.category} required />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="description">Rövid leírás (HU)</Label>
                        <Textarea id="description" name="description" defaultValue={initialData?.description} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="descriptionEn">Short Description (EN)</Label>
                        <Textarea id="descriptionEn" name="descriptionEn" defaultValue={initialData?.descriptionEn || ""} placeholder="English short description" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="longDescription">Hosszú leírás (HU)</Label>
                        <Textarea id="longDescription" name="longDescription" defaultValue={initialData?.longDescription || ""} className="h-32" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="longDescriptionEn">Long Description (EN)</Label>
                        <Textarea id="longDescriptionEn" name="longDescriptionEn" defaultValue={initialData?.longDescriptionEn || ""} className="h-32" placeholder="English long description" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="image">Kép</Label>
                    <div className="flex flex-col gap-4">
                        {imagePreview && (
                            <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden border">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        )}
                        <div className="flex items-center gap-4">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="cursor-pointer"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Javasolt méret: max 800KB. A kép közvetlenül az adatbázisban lesz tárolva.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="features">Funkciók - HU (soronként egy)</Label>
                        <Textarea
                            id="features"
                            name="features"
                            defaultValue={initialData?.features.join("\n")}
                            className="h-32 font-mono text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="featuresEn">Features - EN (one per line)</Label>
                        <Textarea
                            id="featuresEn"
                            name="featuresEn"
                            defaultValue={initialData?.featuresEn?.join("\n") || ""}
                            className="h-32 font-mono text-sm"
                            placeholder="English features, one per line"
                        />
                    </div>
                </div>

                <div className="border p-6 rounded-lg space-y-6 bg-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Csomagok / Verziók</h3>
                            <p className="text-sm text-muted-foreground">Állítsd be a termék elérhető verzióit (pl. Alap, Pro, Agency)</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Alapár megjelenítéshez (HUF)</Label>
                            <Input
                                type="number"
                                id="price"
                                name="price"
                                defaultValue={initialData?.price}
                                required
                                className="w-32"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {variants.map((variant, index) => (
                            <div key={index} className="p-4 border rounded-md bg-muted/20 relative group space-y-3">
                                <div className="grid md:grid-cols-12 gap-4 items-start">
                                    <div className="md:col-span-3 space-y-2">
                                        <Label>Verzió neve (HU)</Label>
                                        <Input
                                            value={variant.name}
                                            onChange={(e) => updateVariant(index, 'name', e.target.value)}
                                            placeholder="pl. Pro License"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-3 space-y-2">
                                        <Label>Ár (HUF)</Label>
                                        <Input
                                            type="number"
                                            value={variant.price}
                                            onChange={(e) => updateVariant(index, 'price', parseInt(e.target.value) || 0)}
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-5 space-y-2">
                                        <Label>Leírás (HU)</Label>
                                        <Input
                                            value={variant.description}
                                            onChange={(e) => updateVariant(index, 'description', e.target.value)}
                                            placeholder="pl. 5 weboldal, support..."
                                        />
                                    </div>
                                    <div className="md:col-span-1 pt-8 flex justify-end">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => removeVariant(index)}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-12 gap-4 items-start">
                                    <div className="md:col-span-3 space-y-2">
                                        <Label className="text-muted-foreground">Version Name (EN)</Label>
                                        <Input
                                            value={variant.nameEn || ''}
                                            onChange={(e) => updateVariant(index, 'nameEn', e.target.value)}
                                            placeholder="e.g. Pro License"
                                        />
                                    </div>
                                    <div className="md:col-span-3" />
                                    <div className="md:col-span-5 space-y-2">
                                        <Label className="text-muted-foreground">Description (EN)</Label>
                                        <Input
                                            value={variant.descriptionEn || ''}
                                            onChange={(e) => updateVariant(index, 'descriptionEn', e.target.value)}
                                            placeholder="e.g. 5 websites, support..."
                                        />
                                    </div>
                                    <div className="md:col-span-1" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button type="button" variant="outline" onClick={addVariant} className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> Új verzió hozzáadása
                    </Button>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Mégse</Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Mentés..." : (initialData ? "Frissítés" : "Létrehozás")}
                </Button>
            </div>
        </form>
    )
}
