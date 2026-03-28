'use client'

import { useState, useEffect } from "react"
import { useCart } from "@/components/ecommerce/cart-provider"
import { LocalizedProductDTO } from "@/app/actions/product"
import { submitConsultation } from "@/app/actions/consultation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { CheckCircle2, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/routing"

interface ConsultationFormProps {
    products: LocalizedProductDTO[]
}

export function ConsultationFormClient({ products }: ConsultationFormProps) {
    const { items, clearCart } = useCart()
    const t = useTranslations('QuoteRequest') // Használjuk a meglévő QuoteRequest szekciót, vagy bővítjük
    const router = useRouter()

    // Initial selection from cart
    const cartItem = items[0]

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        phone: "",
        description: "",
        productId: cartItem?.id || "",
        packageName: cartItem?.license || "" // CartItem 'license' field holds the variant name
    })

    // Update productId if cart changes (though unlikely once mounted)
    useEffect(() => {
        if (cartItem && !formData.productId) {
            setFormData(prev => ({
                ...prev,
                productId: cartItem.id,
                packageName: cartItem.license
            }))
        }
    }, [cartItem])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const result = await submitConsultation(formData)

            if (result.success) {
                setSuccess(true)
                clearCart()
                toast.success(t('success_toast'))
            } else {
                toast.error(t('error_prefix') + result.error)
            }
        } catch (error) {
            toast.error(t('error_unexpected'))
        } finally {
            setLoading(false)
        }
    }

    const selectedProduct = products.find(p => p.id === formData.productId)
    const availablePackages = selectedProduct?.prices || []

    if (success) {
        return (
            <div className="text-center py-12 space-y-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold">{t('success_title')}</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                    {t('success_desc')}
                </p>
                <Button onClick={() => router.push('/')} variant="outline">
                    {t('back_home')}
                </Button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">{t('form.name')}</Label>
                    <Input
                        id="name"
                        required
                        placeholder={t('form.name_placeholder')}
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">{t('form.email')}</Label>
                    <Input
                        id="email"
                        type="email"
                        required
                        placeholder={t('form.email_placeholder')}
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="company">{t('form.company')}</Label>
                    <Input
                        id="company"
                        placeholder={t('form.company_placeholder')}
                        value={formData.company}
                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">{t('form.phone')}</Label>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder={t('form.phone_placeholder')}
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>
            </div>

            <div className="p-6 bg-muted/30 rounded-lg border space-y-4">
                <h3 className="font-medium text-lg">{t('form.solution_section')}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>{t('form.solution_label')}</Label>
                        <Select
                            value={formData.productId}
                            onValueChange={val => setFormData({ ...formData, productId: val, packageName: "" })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t('form.solution_placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                {products.map(product => (
                                    <SelectItem key={product.id} value={product.id}>
                                        {product.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>{t('form.package_label')}</Label>
                        <Select
                            value={formData.packageName}
                            onValueChange={val => setFormData({ ...formData, packageName: val })}
                            disabled={!formData.productId || availablePackages.length === 0}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={availablePackages.length === 0 ? t('form.no_packages') : t('form.package_placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                {availablePackages.map((pkg, idx) => (
                                    <SelectItem key={idx} value={pkg.name}>
                                        {pkg.name} ({new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(pkg.price)})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">{t('form.description_label')}</Label>
                <p className="text-sm text-muted-foreground mb-2">
                    {t('form.description_hint')}
                </p>
                <Textarea
                    id="description"
                    required
                    className="min-h-[150px]"
                    placeholder={t('form.description_placeholder')}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    minLength={10}
                />
            </div>

            <div className="pt-4">
                <Button type="submit" size="lg" className="w-full md:w-auto" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('form.sending')}
                        </>
                    ) : (
                        t('form.submit')
                    )}
                </Button>
                <p className="text-xs text-muted-foreground mt-4 text-center md:text-left">
                    {t('form.terms')}
                </p>
            </div>
        </form>
    )
}
