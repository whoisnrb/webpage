"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ProductDTO, createProduct, updateProduct } from "@/app/actions/product"
import { useRouter } from "@/i18n/routing"
import { toast } from "sonner"

interface ProductFormProps {
    initialData?: ProductDTO
}

export function ProductForm({ initialData }: ProductFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const featuresText = formData.get("features") as string
        const features = featuresText.split("\n").filter(line => line.trim() !== "")

        const data = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            longDescription: formData.get("longDescription") as string,
            price: parseInt(formData.get("price") as string),
            category: formData.get("category") as string,
            slug: formData.get("slug") as string,
            image: formData.get("image") as string,
            features: features,
            prices: {
                personal: parseInt(formData.get("price_personal") as string),
                commercial: parseInt(formData.get("price_commercial") as string),
                developer: parseInt(formData.get("price_developer") as string),
            }
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
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Termék neve</Label>
                        <Input id="title" name="title" defaultValue={initialData?.title} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug (URL)</Label>
                        <Input id="slug" name="slug" defaultValue={initialData?.slug} required />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category">Kategória</Label>
                    <Input id="category" name="category" defaultValue={initialData?.category} required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Rövid leírás</Label>
                    <Textarea id="description" name="description" defaultValue={initialData?.description} required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="longDescription">Hosszú leírás</Label>
                    <Textarea id="longDescription" name="longDescription" defaultValue={initialData?.longDescription || ""} className="h-32" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="image">Kép URL</Label>
                    <Input id="image" name="image" defaultValue={initialData?.image} required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="features">Funkciók (soronként egy)</Label>
                    <Textarea
                        id="features"
                        name="features"
                        defaultValue={initialData?.features.join("\n")}
                        className="h-32 font-mono text-sm"
                    />
                </div>

                <div className="border p-4 rounded-lg space-y-4">
                    <h3 className="font-semibold">Árazás (HUF)</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Alapár (Megjelenítéshez)</Label>
                            <Input type="number" id="price" name="price" defaultValue={initialData?.price} required />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price_personal">Personal</Label>
                            <Input type="number" id="price_personal" name="price_personal" defaultValue={initialData?.prices.personal} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price_commercial">Commercial</Label>
                            <Input type="number" id="price_commercial" name="price_commercial" defaultValue={initialData?.prices.commercial} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price_developer">Developer</Label>
                            <Input type="number" id="price_developer" name="price_developer" defaultValue={initialData?.prices.developer} required />
                        </div>
                    </div>
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
