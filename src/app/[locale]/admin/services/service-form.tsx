"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, Trash2, Save, Package, Star, ChevronDown, ChevronUp } from "lucide-react"
import { Link } from "@/i18n/routing"
import { createService, updateService, getServiceById, type ServiceDTO, type ServicePackage } from "@/app/actions/service"
import { toast } from "sonner"

const ICON_OPTIONS = [
    { value: "Code2", label: "Code (Scriptek)" },
    { value: "ShoppingCart", label: "Shopping Cart (Webfejlesztés)" },
    { value: "Server", label: "Server (Rendszerüzemeltetés)" },
    { value: "Shield", label: "Shield (Biztonság)" },
    { value: "Network", label: "Network (Hálózat)" },
    { value: "Plug", label: "Plug (Integrációk)" },
    { value: "Cloud", label: "Cloud (Felhő)" },
    { value: "Cpu", label: "CPU (AI)" },
    { value: "Puzzle", label: "Puzzle (CRM)" },
    { value: "Activity", label: "Activity (Analitika)" },
    { value: "Layout", label: "Layout (Dashboard)" },
    { value: "Headphones", label: "Headphones (Helpdesk)" },
    { value: "Globe", label: "Globe (WordPress)" },
    { value: "Database", label: "Database (Backup)" },
    { value: "RefreshCw", label: "RefreshCw (Webshop Auto)" },
    { value: "Search", label: "Search (IT Audit)" },
]

const DEFAULT_PACKAGE: ServicePackage = {
    name: "",
    nameEn: "",
    desc: "",
    descEn: "",
    price: 0,
    sub: "egyszeri díj (ÁFA-mentes)",
    subEn: "one-time fee (VAT-free)",
    badge: "",
    badgeEn: "",
    popular: false,
    features: [""],
    featuresEn: [""],
    duration_label: "",
    duration_labelEn: "",
}

const PACKAGE_LABELS = [
    { key: "base", label: "Alap csomag (Base)", color: "border-white/10" },
    { key: "detailed", label: "Üzleti csomag (Detailed) — Legnépszerűbb", color: "border-primary/40" },
    { key: "complex", label: "Komplex csomag (Complex)", color: "border-purple-500/30" },
]

interface ServiceFormProps {
    serviceId?: string
}

export default function ServiceForm({ serviceId }: ServiceFormProps) {
    const router = useRouter()
    const isNew = !serviceId || serviceId === "new"

    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(!isNew)
    const [packagesExpanded, setPackagesExpanded] = useState([true, true, true])

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
    const [packages, setPackages] = useState<ServicePackage[]>([
        { ...DEFAULT_PACKAGE, name: "Alap", nameEn: "Basic" },
        { ...DEFAULT_PACKAGE, name: "Üzleti", nameEn: "Business", popular: true, badge: "Legnépszerűbb", badgeEn: "Most popular" },
        { ...DEFAULT_PACKAGE, name: "Komplex", nameEn: "Complex" },
    ])

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
                    if (service.packages && service.packages.length === 3) {
                        setPackages(service.packages.map(p => ({
                            ...p,
                            features: p.features.length > 0 ? p.features : [""],
                            featuresEn: p.featuresEn.length > 0 ? p.featuresEn : [""],
                        })))
                    }
                }
                setInitialLoading(false)
            })
        }
    }, [isNew, serviceId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const cleanedPackages = packages.map(pkg => ({
            ...pkg,
            features: pkg.features.filter(f => f.trim() !== ""),
            featuresEn: pkg.featuresEn.filter(f => f.trim() !== ""),
        }))

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
            packages: cleanedPackages,
            active,
            sortOrder,
        }

        try {
            if (isNew) {
                await createService(data)
                toast.success("Szolgáltatás sikeresen létrehozva!")
            } else {
                await updateService(serviceId!, data)
                toast.success("Szolgáltatás sikeresen módosítva!")
            }
            router.push("/admin/services")
            router.refresh()
        } catch (error) {
            console.error("Error saving service:", error)
            toast.error("Hiba történt a mentés során!")
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

    // Package helpers
    const updatePackage = (pkgIndex: number, field: keyof ServicePackage, value: any) => {
        setPackages(prev => prev.map((pkg, i) => i === pkgIndex ? { ...pkg, [field]: value } : pkg))
    }

    const addPackageFeature = (pkgIndex: number, lang: "hu" | "en") => {
        setPackages(prev => prev.map((pkg, i) => {
            if (i !== pkgIndex) return pkg
            if (lang === "hu") return { ...pkg, features: [...pkg.features, ""] }
            return { ...pkg, featuresEn: [...pkg.featuresEn, ""] }
        }))
    }

    const removePackageFeature = (pkgIndex: number, lang: "hu" | "en", featureIndex: number) => {
        setPackages(prev => prev.map((pkg, i) => {
            if (i !== pkgIndex) return pkg
            if (lang === "hu") return { ...pkg, features: pkg.features.filter((_, j) => j !== featureIndex) }
            return { ...pkg, featuresEn: pkg.featuresEn.filter((_, j) => j !== featureIndex) }
        }))
    }

    const updatePackageFeature = (pkgIndex: number, lang: "hu" | "en", featureIndex: number, value: string) => {
        setPackages(prev => prev.map((pkg, i) => {
            if (i !== pkgIndex) return pkg
            if (lang === "hu") {
                const newF = [...pkg.features]; newF[featureIndex] = value
                return { ...pkg, features: newF }
            }
            const newF = [...pkg.featuresEn]; newF[featureIndex] = value
            return { ...pkg, featuresEn: newF }
        }))
    }

    const togglePackageExpanded = (idx: number) => {
        setPackagesExpanded(prev => prev.map((v, i) => i === idx ? !v : v))
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
                <Link href={"/admin/services" as any}>
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
                                <Label htmlFor="price">Alap ár (HUF)</Label>
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

                {/* Packages / Pricing Tiers */}
                <Card className="border-primary/20">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Package className="h-5 w-5 text-primary" />
                            <CardTitle>Csomagok és Árak</CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            3 árazási csomag szerkesztése (Alap / Üzleti / Komplex). Ezek jelennek meg a szolgáltatás oldalán.
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {packages.map((pkg, pkgIndex) => {
                            const labelInfo = PACKAGE_LABELS[pkgIndex]
                            const isExpanded = packagesExpanded[pkgIndex]
                            return (
                                <div key={pkgIndex} className={`border rounded-xl overflow-hidden ${labelInfo.color}`}>
                                    {/* Package Header */}
                                    <button
                                        type="button"
                                        onClick={() => togglePackageExpanded(pkgIndex)}
                                        className="w-full flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.04] transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            {pkgIndex === 1 && <Star className="h-4 w-4 text-primary fill-primary" />}
                                            <span className="font-bold text-sm">
                                                {labelInfo.label}
                                            </span>
                                            {pkg.name && (
                                                <span className="text-xs text-muted-foreground">
                                                    — {pkg.name} {pkg.price > 0 ? `• ${pkg.price.toLocaleString('hu-HU')} Ft` : ''}
                                                </span>
                                            )}
                                        </div>
                                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                    </button>

                                    {isExpanded && (
                                        <div className="p-4 space-y-5 border-t border-white/5">
                                            {/* Names */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">Csomag neve (HU)</Label>
                                                    <Input
                                                        value={pkg.name}
                                                        onChange={(e) => updatePackage(pkgIndex, "name", e.target.value)}
                                                        placeholder="Pl. Alap"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">Csomag neve (EN)</Label>
                                                    <Input
                                                        value={pkg.nameEn}
                                                        onChange={(e) => updatePackage(pkgIndex, "nameEn", e.target.value)}
                                                        placeholder="Pl. Basic"
                                                    />
                                                </div>
                                            </div>

                                            {/* Descriptions */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">Csomag leírása (HU)</Label>
                                                    <Textarea
                                                        value={pkg.desc}
                                                        onChange={(e) => updatePackage(pkgIndex, "desc", e.target.value)}
                                                        rows={2}
                                                        placeholder="Rövid leírás magyarul..."
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">Csomag leírása (EN)</Label>
                                                    <Textarea
                                                        value={pkg.descEn}
                                                        onChange={(e) => updatePackage(pkgIndex, "descEn", e.target.value)}
                                                        rows={2}
                                                        placeholder="Short description in English..."
                                                    />
                                                </div>
                                            </div>

                                            {/* Price & Sub */}
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">Ár (HUF, ÁFA nélkül)</Label>
                                                    <Input
                                                        type="number"
                                                        value={pkg.price}
                                                        onChange={(e) => updatePackage(pkgIndex, "price", parseInt(e.target.value) || 0)}
                                                        placeholder="0 = Egyedi"
                                                    />
                                                    <p className="text-[10px] text-muted-foreground">0 = Egyedi árazás</p>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">Ár alcím (HU)</Label>
                                                    <Input
                                                        value={pkg.sub}
                                                        onChange={(e) => updatePackage(pkgIndex, "sub", e.target.value)}
                                                        placeholder="egyszeri díj (ÁFA-mentes)"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">Ár alcím (EN)</Label>
                                                    <Input
                                                        value={pkg.subEn}
                                                        onChange={(e) => updatePackage(pkgIndex, "subEn", e.target.value)}
                                                        placeholder="one-time fee (VAT-free)"
                                                    />
                                                </div>
                                            </div>

                                            {/* Badge & Popular */}
                                            <div className="grid grid-cols-3 gap-4 items-end">
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">Badge felirat (HU)</Label>
                                                    <Input
                                                        value={pkg.badge || ""}
                                                        onChange={(e) => updatePackage(pkgIndex, "badge", e.target.value)}
                                                        placeholder="Legnépszerűbb"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">Badge felirat (EN)</Label>
                                                    <Input
                                                        value={pkg.badgeEn || ""}
                                                        onChange={(e) => updatePackage(pkgIndex, "badgeEn", e.target.value)}
                                                        placeholder="Most popular"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2 pb-0.5">
                                                    <Switch
                                                        id={`popular-${pkgIndex}`}
                                                        checked={!!pkg.popular}
                                                        onCheckedChange={(v) => updatePackage(pkgIndex, "popular", v)}
                                                    />
                                                    <Label htmlFor={`popular-${pkgIndex}`} className="text-xs">Kiemelt csomag</Label>
                                                </div>
                                            </div>

                                            {/* Target label */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">Ajánlott célcsoport (HU)</Label>
                                                    <Input
                                                        value={pkg.duration_label}
                                                        onChange={(e) => updatePackage(pkgIndex, "duration_label", e.target.value)}
                                                        placeholder="Ajánlott: kisvállalkozásoknak..."
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">Ajánlott célcsoport (EN)</Label>
                                                    <Input
                                                        value={pkg.duration_labelEn}
                                                        onChange={(e) => updatePackage(pkgIndex, "duration_labelEn", e.target.value)}
                                                        placeholder="Recommended for: small businesses..."
                                                    />
                                                </div>
                                            </div>

                                            {/* Package Features HU */}
                                            <div className="space-y-2">
                                                <Label className="text-xs font-semibold">Csomag funkciók (HU)</Label>
                                                <div className="space-y-2">
                                                    {pkg.features.map((feature, fIdx) => (
                                                        <div key={fIdx} className="flex gap-2">
                                                            <Input
                                                                value={feature}
                                                                onChange={(e) => updatePackageFeature(pkgIndex, "hu", fIdx, e.target.value)}
                                                                placeholder={`Funkció ${fIdx + 1}`}
                                                                className="text-sm"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => removePackageFeature(pkgIndex, "hu", fIdx)}
                                                                className="text-destructive shrink-0"
                                                                disabled={pkg.features.length <= 1}
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => addPackageFeature(pkgIndex, "hu")}
                                                        className="text-xs"
                                                    >
                                                        <Plus className="mr-1.5 h-3 w-3" /> Funkció hozzáadása (HU)
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Package Features EN */}
                                            <div className="space-y-2">
                                                <Label className="text-xs font-semibold">Csomag funkciók (EN)</Label>
                                                <div className="space-y-2">
                                                    {pkg.featuresEn.map((feature, fIdx) => (
                                                        <div key={fIdx} className="flex gap-2">
                                                            <Input
                                                                value={feature}
                                                                onChange={(e) => updatePackageFeature(pkgIndex, "en", fIdx, e.target.value)}
                                                                placeholder={`Feature ${fIdx + 1}`}
                                                                className="text-sm"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => removePackageFeature(pkgIndex, "en", fIdx)}
                                                                className="text-destructive shrink-0"
                                                                disabled={pkg.featuresEn.length <= 1}
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => addPackageFeature(pkgIndex, "en")}
                                                        className="text-xs"
                                                    >
                                                        <Plus className="mr-1.5 h-3 w-3" /> Add feature (EN)
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>

                {/* Features HU */}
                <Card>
                    <CardHeader>
                        <CardTitle>Általános funkciók (HU)</CardTitle>
                        <p className="text-sm text-muted-foreground">Rövid jellemzők a listás megjelenítéshez</p>
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
                        <CardTitle>Általános funkciók (EN)</CardTitle>
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
                    <Link href={"/admin/services" as any}>
                        <Button type="button" variant="outline">Mégse</Button>
                    </Link>
                </div>
            </form>
        </div>
    )
}
