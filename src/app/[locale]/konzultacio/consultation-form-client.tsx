'use client'

import { useState, useEffect, useRef, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { useCart } from "@/components/ecommerce/cart-provider"
import { LocalizedProductDTO } from "@/app/actions/product"
import { submitConsultation } from "@/app/actions/consultation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { CheckCircle2, Loader2, User, Mail, Building2, Phone, Layers, FileText, Send, Shield, Clock, Calendar } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import { Link } from "@/i18n/routing"
import { useCurrency } from "@/components/currency-provider"
import { formatPrice } from "@/lib/currency"
import { trackFunnelStep, trackFormAbandonment } from "@/lib/funnel-client"
import { cn } from "@/lib/utils"

interface ConsultationFormProps {
    products: LocalizedProductDTO[]
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function ConsultationFormClient({ products }: ConsultationFormProps) {
    const { items } = useCart()
    const searchParams = useSearchParams()
    const t = useTranslations('QuoteRequest')
    const locale = useLocale()
    const isEn = locale === 'en'
    const { currency, rates } = useCurrency()

    const cartItem = items[0]
    const productParam = searchParams.get("product") || searchParams.get("solution") || ""

    const matchedParamProduct = useMemo(() => {
        if (!productParam) return undefined
        const lower = productParam.toLowerCase()
        return products.find(p => p.id === productParam || p.slug?.toLowerCase() === lower || p.title.toLowerCase().includes(lower))
    }, [productParam, products])

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [emailTouched, setEmailTouched] = useState(false)
    const [agreedToTerms, setAgreedToTerms] = useState(true)
    const hasInteractedRef = useRef(false)
    const lastFieldRef = useRef("name")
    const submittedRef = useRef(false)

    useEffect(() => {
        trackFunnelStep({ funnel: "consultation", step: "step_1_view", stepNumber: 1 })
        const onUnload = () => {
            if (hasInteractedRef.current && !submittedRef.current) {
                trackFormAbandonment({
                    funnel: "consultation",
                    stepNumber: 1,
                    lastField: lastFieldRef.current,
                })
            }
        }
        window.addEventListener("pagehide", onUnload)
        return () => {
            window.removeEventListener("pagehide", onUnload)
            onUnload()
        }
    }, [])

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        phone: "",
        description: "",
        productId: matchedParamProduct?.id || cartItem?.id || "",
        packageName: cartItem?.license || ""
    })

    const isEmailValid = useMemo(() => EMAIL_REGEX.test(formData.email.trim()), [formData.email])

    useEffect(() => {
        if (formData.name || formData.email || formData.company || formData.phone || formData.description) {
            hasInteractedRef.current = true
            if (formData.description) lastFieldRef.current = "description"
            else if (formData.phone) lastFieldRef.current = "phone"
            else if (formData.company) lastFieldRef.current = "company"
            else if (formData.email) lastFieldRef.current = "email"
            else if (formData.name) lastFieldRef.current = "name"
            trackFunnelStep({ funnel: "consultation", step: "step_1_interact", stepNumber: 1, lastField: lastFieldRef.current })
        }
    }, [formData])

    useEffect(() => {
        if (matchedParamProduct && !formData.productId) {
            setFormData(prev => ({ ...prev, productId: matchedParamProduct.id }))
        } else if (cartItem && !formData.productId) {
            setFormData(prev => ({
                ...prev,
                productId: cartItem.id,
                packageName: cartItem.license
            }))
        }
    }, [cartItem, matchedParamProduct, formData.productId])

    const QUICK_CHIPS = isEn ? [
        "Pricing & rollout timeline",
        "Live product demo",
        "Integration with existing CRM / ERP",
        "Custom modifications needed"
    ] : [
        "Árazás és bevezetési ütemterv",
        "Élő rendszerbemutató (demó)",
        "Integráció meglévő CRM / számlázóval",
        "Egyedi testreszabás szükséges"
    ]

    const toggleChip = (chip: string) => {
        hasInteractedRef.current = true
        lastFieldRef.current = "description"
        setFormData(prev => {
            if (prev.description.includes(chip)) return prev
            const cur = prev.description.trim()
            return { ...prev, description: cur ? `${cur}\n• ${chip}` : `• ${chip}` }
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setEmailTouched(true)

        if (!formData.name.trim() || !isEmailValid) {
            toast.error(isEn ? "Please enter your name and a valid email address." : "Kérjük, adj meg nevet és valós e-mail címet.")
            return
        }
        if (!agreedToTerms) {
            toast.error(isEn ? "Please accept the Terms and Privacy Policy." : "Kérjük, fogadd el az ÁSZF-et és az Adatkezelési Tájékoztatót.")
            return
        }

        setLoading(true)

        try {
            const result = await submitConsultation({
                ...formData,
                name: formData.name.trim(),
                email: formData.email.trim(),
                locale: isEn ? 'en' : 'hu'
            })

            if (result.success) {
                submittedRef.current = true
                trackFunnelStep({ funnel: "consultation", step: "submitted", stepNumber: 2 })
                setSuccess(true)
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
            <div className="text-center py-10 space-y-6">
                <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.25)]">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl md:text-3xl font-black text-white">{t('success_title')}</h2>
                    <p className="text-white/60 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                        {t('success_desc')}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <Button
                        asChild
                        className="rounded-xl h-11 px-6 bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-bold"
                    >
                        <Link href="/demo">
                            <Calendar className="mr-2 h-4 w-4" />
                            {isEn ? "Book a Calendar Slot Too" : "Időpont foglalása a naptárban"}
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        className="rounded-xl h-11 px-6 border-white/15 bg-white/5 hover:bg-white/10 text-white"
                    >
                        <Link href="/">
                            {t('back_home')}
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Solution & Package Selection */}
            <div className="p-4 md:p-5 bg-white/[0.02] rounded-2xl border border-white/10 space-y-3.5">
                <Label className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="h-4 w-4 text-cyan-400" />
                    {t('form.solution_section')}
                </Label>
                <div className={cn("grid gap-4", availablePackages.length > 0 ? "md:grid-cols-2" : "grid-cols-1")}>
                    <div className="space-y-1.5">
                        <Label className="text-xs text-white/60">{t('form.solution_label')}</Label>
                        <Select
                            value={formData.productId}
                            onValueChange={val => setFormData({ ...formData, productId: val, packageName: "" })}
                        >
                            <SelectTrigger className="h-11 bg-white/[0.03] border-white/10 focus:border-cyan-400 rounded-xl text-white">
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

                    {availablePackages.length > 0 && (
                        <div className="space-y-1.5">
                            <Label className="text-xs text-white/60">{t('form.package_label')}</Label>
                            <Select
                                value={formData.packageName}
                                onValueChange={val => setFormData({ ...formData, packageName: val })}
                            >
                                <SelectTrigger className="h-11 bg-white/[0.03] border-white/10 focus:border-cyan-400 rounded-xl text-white">
                                    <SelectValue placeholder={t('form.package_placeholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {availablePackages.map((pkg, idx) => {
                                        const pkgPrice = (pkg.price / (rates['HUF'] || 1)) * (rates[currency] || 1)
                                        return (
                                            <SelectItem key={idx} value={pkg.name}>
                                                {pkg.name} ({formatPrice(pkgPrice, currency)})
                                            </SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            </div>

            {/* Contact Info */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-bold text-white flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-cyan-400" />
                        {t('form.name')}
                    </Label>
                    <Input
                        id="name"
                        required
                        placeholder={t('form.name_placeholder')}
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="h-11 bg-white/[0.03] border-white/10 focus:border-cyan-400 rounded-xl text-white placeholder:text-white/30"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-cyan-400" />
                        {t('form.email')}
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        required
                        placeholder={t('form.email_placeholder')}
                        value={formData.email}
                        onBlur={() => setEmailTouched(true)}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className={cn(
                            "h-11 bg-white/[0.03] rounded-xl text-white placeholder:text-white/30",
                            emailTouched && formData.email && !isEmailValid
                                ? "border-red-500/60 focus:border-red-400"
                                : "border-white/10 focus:border-cyan-400"
                        )}
                    />
                    {emailTouched && formData.email && !isEmailValid && (
                        <p className="text-[11px] text-red-400">
                            {isEn ? "Please enter a valid email address." : "Kérjük, érvényes e-mail címet adj meg."}
                        </p>
                    )}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="company" className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-cyan-400" />
                        {t('form.company')}
                    </Label>
                    <Input
                        id="company"
                        placeholder={t('form.company_placeholder')}
                        value={formData.company}
                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                        className="h-11 bg-white/[0.03] border-white/10 focus:border-cyan-400 rounded-xl text-white placeholder:text-white/30"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-cyan-400" />
                        {t('form.phone')}
                    </Label>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder={t('form.phone_placeholder')}
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="h-11 bg-white/[0.03] border-white/10 focus:border-cyan-400 rounded-xl text-white placeholder:text-white/30"
                    />
                </div>
            </div>

            {/* Optional Description + Quick Chips */}
            <div className="space-y-2.5">
                <Label htmlFor="description" className="text-xs font-bold text-white flex items-center justify-between gap-2 flex-wrap">
                    <span className="flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-cyan-400" />
                        {isEn ? "Notes & Requirements (optional)" : "Igények / Megjegyzés (opcionális)"}
                    </span>
                    <span className="text-[11px] font-normal text-white/40">
                        {isEn ? "Or pick quick topics below" : "Vagy kattints a gyors témákra alul"}
                    </span>
                </Label>
                <div className="flex flex-wrap gap-1.5">
                    {QUICK_CHIPS.map(chip => {
                        const active = formData.description.includes(chip)
                        return (
                            <button
                                key={chip}
                                type="button"
                                onClick={() => toggleChip(chip)}
                                className={cn(
                                    "px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer",
                                    active
                                        ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                                        : "bg-white/[0.03] border-white/10 text-white/60 hover:border-white/25 hover:text-white"
                                )}
                            >
                                {active ? "✓ " : "+ "}
                                {chip}
                            </button>
                        )
                    })}
                </div>
                <Textarea
                    id="description"
                    className="min-h-[110px] bg-white/[0.03] border-white/10 focus:border-cyan-400 rounded-xl text-white placeholder:text-white/30 text-sm leading-relaxed"
                    placeholder={t('form.description_placeholder')}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            {/* Terms Agreement */}
            <div>
                <label className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-0"
                    />
                    <span className="text-xs text-white/60 group-hover:text-white/80 leading-relaxed">
                        {isEn ? (
                            <>
                                I accept the <Link href="/aszf" className="text-cyan-400 hover:underline">Terms of Service</Link> and <Link href="/adatvedelem" className="text-cyan-400 hover:underline">Privacy Policy</Link>. Your details remain strictly confidential.
                            </>
                        ) : (
                            <>
                                Elfogadom az <Link href="/aszf" className="text-cyan-400 hover:underline">ÁSZF</Link>-et és az <Link href="/adatvedelem" className="text-cyan-400 hover:underline">Adatkezelési Tájékoztatót</Link>. Adataidat bizalmasan kezeljük.
                            </>
                        )}
                    </span>
                </label>
            </div>

            {/* Submit & Trust Micro-Bar */}
            <div className="space-y-3 pt-1">
                <Button
                    type="submit"
                    size="lg"
                    disabled={loading || !formData.name.trim() || !isEmailValid || !agreedToTerms}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black tracking-wide shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all disabled:opacity-40"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('form.sending')}
                        </>
                    ) : (
                        <>
                            <span>{t('form.submit')}</span>
                            <Send className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>

                <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-center sm:justify-between gap-3 text-[11px] text-white/50">
                    <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-cyan-400" />
                        {isEn ? "Response within 24h" : "Válaszidő max. 24 óra"}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Shield className="h-3.5 w-3.5 text-emerald-400" />
                        {isEn ? "100% no-obligation" : "100% kötelezettségmentes"}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
                        {isEn ? "VAT-exempt / EU reverse charge" : "0% ÁFA (AAM) / Nettó EU számla"}
                    </span>
                </div>
            </div>
        </form>
    )
}
