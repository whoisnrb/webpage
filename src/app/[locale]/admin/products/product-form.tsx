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
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null)

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const featuresText = formData.get("features") as string
        const features = featuresText.split("\n").filter(line => line.trim() !== "")

        // Use the preview (Base64) as the image source if available, otherwise fallback to the input value (though input is hidden/read-only now)
        // Actually, we should ensure the hidden input has the value.
        // Let's just use the imagePreview state for the submission if it's a data URL, 
        // or rely on the form field if we keep it synced.
        // Better approach: We will have a hidden input for the actual string value that gets submitted.

        const imageValue = imagePreview || (formData.get("image") as string)

        const data = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            longDescription: formData.get("longDescription") as string,
            price: parseInt(formData.get("price") as string),
            category: formData.get("category") as string,
            slug: formData.get("slug") as string,
            image: imageValue,
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
                            {/* Hidden input to store the actual value for FormData if needed, 
                                but we are constructing 'data' object manually in handleSubmit so we don't strictly need it 
                                if we use state. However, keeping the original input as hidden might be useful 
                                if we want to support manual URL entry as fallback? 
                                Let's keep it simple: File upload OR manual URL (if they really want).
                                Actually, let's just make the original input hidden and controlled by state 
                                to ensure it works with the form submission logic if we were relying solely on FormData.
                                But since we construct 'data' manually, we can just use 'imagePreview'.
                            */}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Javasolt méret: max 800KB. A kép közvetlenül az adatbázisban lesz tárolva.
                        </p>
                    </div>
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
