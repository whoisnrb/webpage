"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react"
import { Link } from "@/i18n/routing"
import { createService, updateService, getServiceById, type ServiceDTO } from "@/app/actions/service"

const ICON_OPTIONS = [
    { value: "Code2", label: "Code (Scriptek)" },
    { value: "ShoppingCart", label: "Shopping Cart (Webfejlesztés)" },
    { value: "Server", label: "Server (Rendszerüzemeltetés)" },
    { value: "Shield", label: "Shield (Biztonság)" },
    { value: "Network", label: "Network (Hálózat)" },
    { value: "Plug", label: "Plug (Integrációk)" },
]

interface ServiceFormProps {
    serviceId?: string
}

export default function ServiceForm({ serviceId }: ServiceFormProps) {
    const router = useRouter()
    const isNew = !serviceId || serviceId === "new"

    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(!isNew)

    // Form state
    const [name, setName] = useState("")
    const [nameEn, setNameEn] = useState("")
    const [slug, setSlug] = useState("")
    const [description, setDescription] = useState("")
    const [descriptionEn, setDescriptionEn] = useState("")
    const [price, setPrice] = useState(0)
    const [icon, setIcon] = useState("Code2")
    const [href, setHref] = useState("/szolgaltatasok/")
    const [features, setFeatures] = useState<string[]>([""])
    const [featuresEn, setFeaturesEn] = useState<string[]>([""])
    const [active, setActive] = useState(true)
    const [sortOrder, setSortOrder] = useState(0)

    useEffect(() => {
        if (!isNew && serviceId) {
            getServiceById(serviceId).then((service) => {
                if (service) {
                    setName(service.name)
                    setNameEn(service.nameEn || "")
                    setSlug(service.slug)
                    setDescription(service.description)
                    setDescriptionEn(service.descriptionEn || "")
                    setPrice(service.price)
                    setIcon(service.icon)
                    setHref(service.href)
                    setFeatures(service.features.length > 0 ? service.features : [""])
                    setFeaturesEn(service.featuresEn && service.featuresEn.length > 0 ? service.featuresEn : [""])
                    setActive(service.active)
                    setSortOrder(service.sortOrder)
                }
                setInitialLoading(false)
            })
        }
    }, [isNew, serviceId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const data = {
            name,
            nameEn: nameEn || null,
            slug,
            description,
            descriptionEn: descriptionEn || null,
            price,
            icon,
            href,
            features: features.filter(f => f.trim() !== ""),
            featuresEn: featuresEn.filter(f => f.trim() !== "").length > 0
                ? featuresEn.filter(f => f.trim() !== "")
                : null,
            active,
            sortOrder,
        }

        try {
            if (isNew) {
                await createService(data)
            } else {
                await updateService(serviceId!, data)
            }
            router.push("/admin/services")
            router.refresh()
        } catch (error) {
            console.error("Error saving service:", error)
            alert("Hiba történt a mentés során!")
        } finally {
            setLoading(false)
        }
    }

    const addFeature = (lang: "hu" | "en") => {
        if (lang === "hu") setFeatures([...features, ""])
        else setFeaturesEn([...featuresEn, ""])
    }

    const removeFeature = (lang: "hu" | "en", index: number) => {
        if (lang === "hu") setFeatures(features.filter((_, i) => i !== index))
        else setFeaturesEn(featuresEn.filter((_, i) => i !== index))
    }

    const updateFeature = (lang: "hu" | "en", index: number, value: string) => {
        if (lang === "hu") {
            const newFeatures = [...features]
            newFeatures[index] = value
            setFeatures(newFeatures)
        } else {
            const newFeatures = [...featuresEn]
            newFeatures[index] = value
            setFeaturesEn(newFeatures)
        }
    }

    // Auto-generate slug from name
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i')
            .replace(/ó/g, 'o').replace(/ö/g, 'o').replace(/ő/g, 'o')
            .replace(/ú/g, 'u').replace(/ü/g, 'u').replace(/ű/g, 'u')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
    }

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-muted-foreground">Betöltés...</div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center gap-4">
                <Link href="/admin/services">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">
                    {isNew ? "Új szolgáltatás" : "Szolgáltatás szerkesztése"}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Alapadatok</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Név (HU) *</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value)
                                        if (isNew) setSlug(generateSlug(e.target.value))
                                    }}
                                    placeholder="Pl. Webfejlesztés"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nameEn">Név (EN)</Label>
                                <Input
                                    id="nameEn"
                                    value={nameEn}
                                    onChange={(e) => setNameEn(e.target.value)}
                                    placeholder="Pl. Web Development"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug *</Label>
                                <Input
                                    id="slug"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    placeholder="pl-webfejlesztes"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="href">Útvonal (href) *</Label>
                                <Input
                                    id="href"
                                    value={href}
                                    onChange={(e) => setHref(e.target.value)}
                                    placeholder="/szolgaltatasok/webfejlesztes"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Ár (HUF)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                                    placeholder="0 = Egyedi árazás"
                                />
                                <p className="text-xs text-muted-foreground">0 = Egyedi árazás</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="icon">Ikon</Label>
                                <select
                                    id="icon"
                                    value={icon}
                                    onChange={(e) => setIcon(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    {ICON_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sortOrder">Sorrend</Label>
                                <Input
                                    id="sortOrder"
                                    type="number"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Switch
                                id="active"
                                checked={active}
                                onCheckedChange={setActive}
                            />
                            <Label htmlFor="active">Aktív (megjelenik a weboldalon)</Label>
                        </div>
                    </CardContent>
                </Card>

                {/* Descriptions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Leírás</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="description">Leírás (HU) *</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                placeholder="A szolgáltatás rövid leírása magyarul..."
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="descriptionEn">Leírás (EN)</Label>
                            <Textarea
                                id="descriptionEn"
                                value={descriptionEn}
                                onChange={(e) => setDescriptionEn(e.target.value)}
                                rows={3}
                                placeholder="Short description in English..."
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Features HU */}
                <Card>
                    <CardHeader>
                        <CardTitle>Funkciók (HU)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {features.map((feature, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    value={feature}
                                    onChange={(e) => updateFeature("hu", index, e.target.value)}
                                    placeholder={`Funkció ${index + 1}`}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeFeature("hu", index)}
                                    className="text-destructive shrink-0"
                                    disabled={features.length <= 1}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => addFeature("hu")}>
                            <Plus className="mr-2 h-4 w-4" /> Funkció hozzáadása
                        </Button>
                    </CardContent>
                </Card>

                {/* Features EN */}
                <Card>
                    <CardHeader>
                        <CardTitle>Funkciók (EN)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {featuresEn.map((feature, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    value={feature}
                                    onChange={(e) => updateFeature("en", index, e.target.value)}
                                    placeholder={`Feature ${index + 1}`}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeFeature("en", index)}
                                    className="text-destructive shrink-0"
                                    disabled={featuresEn.length <= 1}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => addFeature("en")}>
                            <Plus className="mr-2 h-4 w-4" /> Add feature
                        </Button>
                    </CardContent>
                </Card>

                {/* Submit */}
                <div className="flex gap-4">
                    <Button type="submit" disabled={loading} className="min-w-[200px]">
                        <Save className="mr-2 h-4 w-4" />
                        {loading ? "Mentés..." : (isNew ? "Létrehozás" : "Mentés")}
                    </Button>
                    <Link href="/admin/services">
                        <Button type="button" variant="outline">Mégse</Button>
                    </Link>
                </div>
            </form>
        </div>
    )
}
