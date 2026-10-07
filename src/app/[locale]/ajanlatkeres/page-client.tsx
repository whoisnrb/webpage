"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
    CheckCircle2,
    Send,
    Sparkles,
    Rocket,
    Code,
    Globe,
    Zap,
    Shield,
    Bot,
    Cloud,
    ArrowRight,
    ArrowLeft,
    Clock,
    DollarSign,
    Check,
    Calendar,
    Phone,
    Mail,
    Building2,
    User,
    FileText,
    HelpCircle
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations, useLocale } from "next-intl"
import { submitInquiry } from "@/app/actions/inquiry"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"

export default function QuoteRequestPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#030712] py-20 px-4 flex items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
            </div>
        }>
            <QuoteRequestContent />
        </Suspense>
    )
}

function QuoteRequestContent() {
    const t = useTranslations("QuoteRequest")
    const locale = useLocale()
    const searchParams = useSearchParams()
    const subject = searchParams.get('subject')

    const [step, setStep] = useState(1)
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [agreedToTerms, setAgreedToTerms] = useState(true)

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        phone: "",
        projectType: "web",
        budget: "tier3",
        deadline: "month",
        description: "",
        serviceInterest: "",
        language: "",
        sourcePage: ""
    })

    const PROJECT_TYPES = [
        {
            id: "web",
            title: locale === 'hu' ? "Weboldal & Webshop" : "Website & Webshop",
            desc: locale === 'hu' ? "Modern Next.js portál, WooCommerce vagy prémium bemutatkozó oldal" : "Modern Next.js portal, WooCommerce or premium corporate site",
            icon: Globe,
            badge: locale === 'hu' ? "Népszerű" : "Popular",
            color: "cyan"
        },
        {
            id: "automation",
            title: locale === 'hu' ? "n8n & CRM Automatizáció" : "n8n & CRM Automation",
            desc: locale === 'hu' ? "Számlázz.hu, MiniCRM, webhookok, adatkinyerés és manuális munka kiváltása" : "Billing, CRM sync, webhooks and eliminating manual workflows",
            icon: Zap,
            badge: "Hot",
            color: "amber"
        },
        {
            id: "managed",
            title: locale === 'hu' ? "Havidíjas IT Rendszergazda" : "Managed IT & Support",
            desc: locale === 'hu' ? "Proaktív üzemeltetés, KKV helpdesk, 24/7 monitoring és IT audit" : "Proactive maintenance, SMB helpdesk, 24/7 monitoring and audit",
            icon: Shield,
            color: "emerald"
        },
        {
            id: "ai",
            title: locale === 'hu' ? "AI Asszisztens & Botok" : "AI Assistants & Bots",
            desc: locale === 'hu' ? "Egyedi belső tudásbázis, Gemini/GPT integrációk és ügyfélszolgálati botok" : "Custom knowledge base, Gemini/GPT integration and support bots",
            icon: Bot,
            badge: "AI 2.0",
            color: "violet"
        },
        {
            id: "cloud",
            title: locale === 'hu' ? "M365 & Felhő Migráció" : "M365 & Cloud Migration",
            desc: locale === 'hu' ? "Microsoft 365, Google Workspace, Azure infrastruktúra és adatmentés" : "Microsoft 365, Google Workspace, Azure infrastructure and backup",
            icon: Cloud,
            color: "blue"
        },
        {
            id: "other",
            title: locale === 'hu' ? "Egyedi Szoftver & Más" : "Custom Software & Other",
            desc: locale === 'hu' ? "Specifikus API, script, egyedi adatbázis vagy speciális üzleti igény" : "Specific API, script, custom database or unique business need",
            icon: Code,
            color: "slate"
        }
    ]

    const BUDGET_TIERS = [
        { id: "tier1", label: locale === 'hu' ? "300.000 Ft alatt" : "Under 300k HUF", sub: locale === 'hu' ? "Gyors feladatok, scriptek" : "Quick fixes & scripts" },
        { id: "tier2", label: locale === 'hu' ? "300.000 - 750.000 Ft" : "300k - 750k HUF", sub: locale === 'hu' ? "Landing page, kisebb automatizáció" : "Landing page, small automation" },
        { id: "tier3", label: locale === 'hu' ? "750.000 - 1.500.000 Ft" : "750k - 1.5M HUF", sub: locale === 'hu' ? "Komplett weboldal vagy összetett n8n" : "Full website or complex n8n" },
        { id: "tier4", label: locale === 'hu' ? "1.500.000 - 3.000.000 Ft" : "1.5M - 3M HUF", sub: locale === 'hu' ? "Webáruház, portál vagy CRM rendszer" : "Webshop, portal or CRM stack" },
        { id: "tier5", label: locale === 'hu' ? "3.000.000 Ft felett" : "Over 3M HUF", sub: locale === 'hu' ? "Vállalati infrastruktúra, egyedi SaaS" : "Enterprise infra, custom SaaS" },
        { id: "flexible", label: locale === 'hu' ? "Még nem meghatározott" : "Not yet decided", sub: locale === 'hu' ? "Konzultáció során átbeszéljük" : "Let's discuss on a call" }
    ]

    const DEADLINES = [
        { id: "urgent", label: locale === 'hu' ? "Azonnal / 2 héten belül" : "Urgent / within 2 weeks" },
        { id: "month", label: locale === 'hu' ? "1 hónapon belül" : "Within 1 month" },
        { id: "quarter", label: locale === 'hu' ? "1 - 3 hónap" : "1 - 3 months" },
        { id: "flexible", label: locale === 'hu' ? "Rugalmas határidő" : "Flexible timeline" }
    ]

    useEffect(() => {
        const serviceParam = searchParams.get('serviceInterest') || searchParams.get('service')
        const langParam = searchParams.get('language') || searchParams.get('lang') || locale
        const sourceParam = searchParams.get('sourcePage') || searchParams.get('source') || ''

        if (serviceParam) {
            setFormData(prev => ({
                ...prev,
                serviceInterest: serviceParam,
                language: langParam,
                sourcePage: sourceParam,
                description: locale === 'hu'
                    ? `Érdeklődöm a következő szolgáltatás iránt: ${serviceParam}\n`
                    : `I am interested in the following service: ${serviceParam}\n`
            }))
        } else if (subject) {
            setFormData(prev => ({
                ...prev,
                projectType: "web",
                serviceInterest: subject,
                language: langParam,
                sourcePage: sourceParam,
                description: locale === 'hu'
                    ? `Érdeklődöm a következő elképzelés megvalósítása iránt: ${subject}\n`
                    : `I am interested in realizing the following concept: ${subject}\n`
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                language: langParam,
                sourcePage: sourceParam
            }))
        }
    }, [subject, searchParams, locale])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const selectProjectType = (id: string) => {
        setFormData(prev => ({ ...prev, projectType: id }))
    }

    const selectBudget = (id: string) => {
        setFormData(prev => ({ ...prev, budget: id }))
    }

    const selectDeadline = (id: string) => {
        setFormData(prev => ({ ...prev, deadline: id }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!agreedToTerms) {
            alert(locale === 'hu' ? "Kérjük, fogadd el az adatvédelmi tájékoztatót!" : "Please accept the privacy policy!")
            return
        }

        setLoading(true)

        const selectedTypeObj = PROJECT_TYPES.find(p => p.id === formData.projectType)
        const selectedBudgetObj = BUDGET_TIERS.find(b => b.id === formData.budget)
        const selectedDeadlineObj = DEADLINES.find(d => d.id === formData.deadline)

        const metaInfo = `

--- Projekt Paraméterek ---
Típus: ${selectedTypeObj?.title || formData.projectType}
Költségkeret: ${selectedBudgetObj?.label || formData.budget}
Határidő: ${selectedDeadlineObj?.label || formData.deadline}
Szolgáltatás hivatkozás: ${formData.serviceInterest || "Nincs"}
Nyelv: ${formData.language || locale}
Forrás oldal: ${formData.sourcePage || "Közvetlen"}`

        try {
            const result = await submitInquiry({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                company: formData.company,
                serviceType: selectedTypeObj?.title || formData.projectType || "egyéb",
                budget: selectedBudgetObj?.label || formData.budget,
                description: formData.description + metaInfo
            })

            if (result.success) {
                try {
                    if (typeof window !== "undefined" && (window as any).ttq) {
                        (window as any).ttq.track('CompleteRegistration')
                        (window as any).ttq.track('ClickButton')
                        (window as any).ttq.track('SubmitForm')
                        (window as any).ttq.track('Contact')
                    }
                } catch (ttqError) {
                    console.warn("Tracking error:", ttqError)
                }
                setSubmitted(true)
            } else {
                alert(result.error || (locale === 'hu' ? "Hiba történt a beküldés során." : "Failed to submit."))
            }
        } catch (error) {
            console.error("Submission error:", error)
            alert(locale === 'hu' ? "Váratlan hiba történt." : "An unexpected error occurred.")
        } finally {
            setLoading(false)
        }
    }

    const nextStep = () => {
        window.scrollTo({ top: 150, behavior: "smooth" })
        setStep(prev => prev + 1)
    }

    const prevStep = () => {
        window.scrollTo({ top: 150, behavior: "smooth" })
        setStep(prev => prev - 1)
    }

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-[#030712] relative overflow-hidden">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="max-w-xl w-full relative z-10"
                >
                    <div className="rounded-3xl border border-emerald-500/30 bg-[#06121e]/90 backdrop-blur-2xl p-8 md:p-12 text-center shadow-[0_0_80px_-15px_rgba(16,185,129,0.35)] relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-500" />

                        <div className="h-20 w-20 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>

                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
                            <Sparkles className="h-3.5 w-3.5" />
                            {locale === 'hu' ? "Sikeresen Beérkezett" : "Successfully Received"}
                        </div>

                        <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
                            {t("success_title")}
                        </h2>
                        <p className="text-white/70 leading-relaxed mb-8 text-sm md:text-base">
                            {t("success_desc")}
                        </p>

                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 mb-8 text-left space-y-2 text-xs md:text-sm text-white/60">
                            <div className="flex justify-between">
                                <span className="text-white/40">{locale === 'hu' ? "Név:" : "Name:"}</span>
                                <span className="font-semibold text-white">{formData.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/40">{locale === 'hu' ? "Email:" : "Email:"}</span>
                                <span className="font-semibold text-white">{formData.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/40">{locale === 'hu' ? "Válaszidő:" : "Response:"}</span>
                                <span className="font-semibold text-emerald-400">{locale === 'hu' ? "Garantáltan 24 órán belül" : "Within 24 hours"}</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button
                                className="h-12 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)]"
                                asChild
                            >
                                <Link href="/demo">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {locale === 'hu' ? "Online Konzultáció foglalása" : "Book Online Call"}
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                className="h-12 px-6 rounded-xl border-white/10 hover:bg-white/5 text-white/80 hover:text-white"
                                asChild
                            >
                                <Link href="/">
                                    {t("back_home")}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )
    }

    const currentType = PROJECT_TYPES.find(p => p.id === formData.projectType)
    const currentBudget = BUDGET_TIERS.find(b => b.id === formData.budget)
    const currentDeadline = DEADLINES.find(d => d.id === formData.deadline)

    return (
        <div className="min-h-screen bg-[#030712] text-white pt-28 pb-20 px-4 relative overflow-hidden">
            {/* Ambient Background Lights */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />

            <div className="container mx-auto max-w-5xl relative z-10">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-black tracking-widest uppercase mb-4"
                    >
                        <Sparkles className="h-3.5 w-3.5" />
                        {locale === 'hu' ? "Egyedi Projekt & IT Ajánlat" : "Custom Project & IT Proposal"}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-6xl font-black mb-4 tracking-tight"
                    >
                        {t("title")}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-base md:text-xl text-white/50 max-w-2xl mx-auto"
                    >
                        {t("subtitle")}
                    </motion.p>
                </div>

                {/* Step Indicator */}
                <div className="max-w-2xl mx-auto mb-12">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
                        <div
                            className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 -translate-y-1/2 z-0 transition-all duration-500"
                            style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
                        />

                        {[
                            { num: 1, label: t("sidebar.step_1"), icon: Sparkles },
                            { num: 2, label: t("sidebar.step_2"), icon: FileText },
                            { num: 3, label: t("sidebar.step_3"), icon: Send }
                        ].map((s) => {
                            const isDone = step > s.num
                            const isCurrent = step === s.num
                            return (
                                <button
                                    key={s.num}
                                    type="button"
                                    onClick={() => {
                                        if (isDone) setStep(s.num)
                                    }}
                                    disabled={!isDone && !isCurrent}
                                    className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer disabled:cursor-default"
                                >
                                    <div className={cn(
                                        "h-12 w-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-300 border",
                                        isDone
                                            ? "bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                                            : isCurrent
                                                ? "bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.45)] scale-110"
                                                : "bg-[#071322] border-white/10 text-white/40"
                                    )}>
                                        {isDone ? <Check className="h-5 w-5 stroke-[3]" /> : s.num}
                                    </div>
                                    <span className={cn(
                                        "text-xs font-bold transition-colors whitespace-nowrap",
                                        isCurrent ? "text-cyan-400" : isDone ? "text-emerald-400" : "text-white/40"
                                    )}>
                                        {s.label}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Form Panel */}
                    <div className="lg:col-span-8">
                        <div className="rounded-3xl border border-white/10 bg-[#06101c]/80 backdrop-blur-2xl p-6 md:p-10 shadow-[0_0_50px_-15px_rgba(6,182,212,0.15)] relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-transparent" />

                            <div className="mb-8">
                                <h2 className="text-xl md:text-2xl font-black text-white mb-2">
                                    {step === 1 && t("steps.1_title")}
                                    {step === 2 && t("steps.2_title")}
                                    {step === 3 && t("steps.3_title")}
                                </h2>
                                <p className="text-white/50 text-sm">
                                    {step === 1 && t("steps.1_desc")}
                                    {step === 2 && t("steps.2_desc")}
                                    {step === 3 && t("steps.3_desc")}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <AnimatePresence mode="wait">
                                    {/* STEP 1: Project Type selection */}
                                    {step === 1 && (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-6"
                                        >
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                {PROJECT_TYPES.map((pt) => {
                                                    const Icon = pt.icon
                                                    const isSelected = formData.projectType === pt.id
                                                    return (
                                                        <div
                                                            key={pt.id}
                                                            onClick={() => selectProjectType(pt.id)}
                                                            className={cn(
                                                                "p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between group/card relative",
                                                                isSelected
                                                                    ? "bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-transparent border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50"
                                                                    : "bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]"
                                                            )}
                                                        >
                                                            {pt.badge && (
                                                                <span className={cn(
                                                                    "absolute top-3 right-3 text-[9px] font-black uppercase px-2 py-0.5 rounded-full",
                                                                    isSelected ? "bg-cyan-400 text-slate-950" : "bg-white/10 text-white/60"
                                                                )}>
                                                                    {pt.badge}
                                                                </span>
                                                            )}
                                                            <div>
                                                                <div className={cn(
                                                                    "h-10 w-10 rounded-xl flex items-center justify-center mb-3 transition-colors",
                                                                    isSelected
                                                                        ? "bg-cyan-500 text-slate-950"
                                                                        : "bg-white/5 text-white/60 group-hover/card:text-cyan-400 group-hover/card:bg-white/10"
                                                                )}>
                                                                    <Icon className="h-5 w-5" />
                                                                </div>
                                                                <h3 className={cn(
                                                                    "text-sm font-black transition-colors mb-1",
                                                                    isSelected ? "text-cyan-300" : "text-white"
                                                                )}>
                                                                    {pt.title}
                                                                </h3>
                                                                <p className="text-xs text-white/50 leading-relaxed">
                                                                    {pt.desc}
                                                                </p>
                                                            </div>

                                                            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                                                                <span className={cn(
                                                                    "text-[11px] font-bold",
                                                                    isSelected ? "text-cyan-400" : "text-white/30"
                                                                )}>
                                                                    {isSelected ? (locale === 'hu' ? "Kiválasztva" : "Selected") : (locale === 'hu' ? "Kiválasztás" : "Select")}
                                                                </span>
                                                                <div className={cn(
                                                                    "h-5 w-5 rounded-full flex items-center justify-center border transition-all",
                                                                    isSelected ? "bg-cyan-400 border-cyan-400 text-slate-950" : "border-white/20 text-transparent"
                                                                )}>
                                                                    <Check className="h-3 w-3 stroke-[3]" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            <div className="pt-4 flex justify-end">
                                                <Button
                                                    type="button"
                                                    onClick={nextStep}
                                                    className="h-12 px-8 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black tracking-wide shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all"
                                                >
                                                    {t("form.next")} <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* STEP 2: Project Details, Budget, and Deadline */}
                                    {step === 2 && (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-6"
                                        >
                                            {/* Budget selector */}
                                            <div className="space-y-3">
                                                <Label className="text-sm font-bold text-white flex items-center gap-2">
                                                    <DollarSign className="h-4 w-4 text-cyan-400" />
                                                    {locale === 'hu' ? "Tervezett költségkeret" : "Estimated Budget"}
                                                </Label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                                                    {BUDGET_TIERS.map((b) => {
                                                        const isSelected = formData.budget === b.id
                                                        return (
                                                            <button
                                                                key={b.id}
                                                                type="button"
                                                                onClick={() => selectBudget(b.id)}
                                                                className={cn(
                                                                    "p-3 rounded-xl border text-left transition-all",
                                                                    isSelected
                                                                        ? "bg-cyan-500/15 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] text-white"
                                                                        : "bg-white/[0.02] border-white/5 hover:border-white/20 text-white/70"
                                                                )}
                                                            >
                                                                <div className={cn("text-xs font-black", isSelected ? "text-cyan-300" : "text-white")}>
                                                                    {b.label}
                                                                </div>
                                                                <div className="text-[10px] text-white/40 mt-0.5">
                                                                    {b.sub}
                                                                </div>
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            {/* Deadline selector */}
                                            <div className="space-y-3 pt-2">
                                                <Label className="text-sm font-bold text-white flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-cyan-400" />
                                                    {locale === 'hu' ? "Tervezett megvalósítási időkeret" : "Desired Timeline"}
                                                </Label>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                    {DEADLINES.map((d) => {
                                                        const isSelected = formData.deadline === d.id
                                                        return (
                                                            <button
                                                                key={d.id}
                                                                type="button"
                                                                onClick={() => selectDeadline(d.id)}
                                                                className={cn(
                                                                    "p-2.5 rounded-xl border text-center text-xs font-bold transition-all",
                                                                    isSelected
                                                                        ? "bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                                                                        : "bg-white/[0.02] border-white/5 hover:border-white/15 text-white/60"
                                                                )}
                                                            >
                                                                {d.label}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            {/* Description Textarea */}
                                            <div className="space-y-2 pt-2">
                                                <Label htmlFor="description" className="text-sm font-bold text-white flex items-center justify-between">
                                                    <span className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-cyan-400" />
                                                        {t("form.description_label")}
                                                    </span>
                                                    <span className="text-[11px] font-normal text-white/40">
                                                        {locale === 'hu' ? "Minél részletesebb, annál pontosabb ajánlatot adunk" : "More details = more accurate quote"}
                                                    </span>
                                                </Label>
                                                <Textarea
                                                    id="description"
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleInputChange}
                                                    placeholder={t("form.description_placeholder")}
                                                    className="min-h-[140px] bg-white/[0.03] border-white/10 focus:border-cyan-400 rounded-xl text-white placeholder:text-white/30 text-sm leading-relaxed"
                                                    required
                                                />
                                            </div>

                                            <div className="pt-4 flex justify-between items-center">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={prevStep}
                                                    className="h-12 px-6 rounded-xl border-white/10 hover:bg-white/5 text-white/70"
                                                >
                                                    <ArrowLeft className="mr-2 h-4 w-4" /> {t("form.back")}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    onClick={nextStep}
                                                    disabled={!formData.description.trim()}
                                                    className="h-12 px-8 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black tracking-wide shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all disabled:opacity-40"
                                                >
                                                    {t("form.next")} <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* STEP 3: Contact Details & Submit */}
                                    {step === 3 && (
                                        <motion.div
                                            key="step3"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-6"
                                        >
                                            {/* Summary Recap pill */}
                                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                                <div>
                                                    <span className="text-white/40 block mb-0.5">{locale === 'hu' ? "Kiválasztott fókusz:" : "Selected Focus:"}</span>
                                                    <span className="font-bold text-cyan-400">{currentType?.title}</span>
                                                </div>
                                                <div>
                                                    <span className="text-white/40 block mb-0.5">{locale === 'hu' ? "Költségkeret:" : "Budget:"}</span>
                                                    <span className="font-bold text-white">{currentBudget?.label}</span>
                                                </div>
                                                <div>
                                                    <span className="text-white/40 block mb-0.5">{locale === 'hu' ? "Tervezett idő:" : "Timeline:"}</span>
                                                    <span className="font-bold text-white">{currentDeadline?.label}</span>
                                                </div>
                                            </div>

                                            {/* Inputs */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name" className="text-sm font-bold text-white flex items-center gap-2">
                                                        <User className="h-4 w-4 text-cyan-400" />
                                                        {t("form.name")}
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        placeholder={t("form.name_placeholder")}
                                                        className="h-12 bg-white/[0.03] border-white/10 focus:border-cyan-400 rounded-xl text-white placeholder:text-white/30"
                                                        required
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="email" className="text-sm font-bold text-white flex items-center gap-2">
                                                        <Mail className="h-4 w-4 text-cyan-400" />
                                                        {t("form.email")}
                                                    </Label>
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        placeholder={t("form.email_placeholder")}
                                                        className="h-12 bg-white/[0.03] border-white/10 focus:border-cyan-400 rounded-xl text-white placeholder:text-white/30"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone" className="text-sm font-bold text-white flex items-center gap-2">
                                                        <Phone className="h-4 w-4 text-cyan-400" />
                                                        {t("form.phone")}
                                                    </Label>
                                                    <Input
                                                        id="phone"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleInputChange}
                                                        placeholder={t("form.phone_placeholder")}
                                                        className="h-12 bg-white/[0.03] border-white/10 focus:border-cyan-400 rounded-xl text-white placeholder:text-white/30"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="company" className="text-sm font-bold text-white flex items-center gap-2">
                                                        <Building2 className="h-4 w-4 text-cyan-400" />
                                                        {t("form.company")}
                                                    </Label>
                                                    <Input
                                                        id="company"
                                                        name="company"
                                                        value={formData.company}
                                                        onChange={handleInputChange}
                                                        placeholder={t("form.company_placeholder")}
                                                        className="h-12 bg-white/[0.03] border-white/10 focus:border-cyan-400 rounded-xl text-white placeholder:text-white/30"
                                                    />
                                                </div>
                                            </div>

                                            {/* Terms Agreement Checkbox */}
                                            <div className="pt-2">
                                                <label className="flex items-start gap-3 cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        checked={agreedToTerms}
                                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                                        className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-0"
                                                    />
                                                    <span className="text-xs text-white/60 group-hover:text-white/80 leading-relaxed">
                                                        {locale === 'hu' ? (
                                                            <>
                                                                Elfogadom az <Link href="/aszf" className="text-cyan-400 hover:underline">ÁSZF</Link>-et és az <Link href="/adatvedelem" className="text-cyan-400 hover:underline">Adatkezelési Tájékoztatót</Link>. Adataidat bizalmasan kezeljük, soha nem adjuk ki harmadik félnek.
                                                            </>
                                                        ) : (
                                                            <>
                                                                I accept the <Link href="/aszf" className="text-cyan-400 hover:underline">Terms of Service</Link> and <Link href="/adatvedelem" className="text-cyan-400 hover:underline">Privacy Policy</Link>. Your data is confidential and never shared.
                                                            </>
                                                        )}
                                                    </span>
                                                </label>
                                            </div>

                                            <div className="pt-4 flex justify-between items-center">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={prevStep}
                                                    className="h-12 px-6 rounded-xl border-white/10 hover:bg-white/5 text-white/70"
                                                >
                                                    <ArrowLeft className="mr-2 h-4 w-4" /> {t("form.back")}
                                                </Button>

                                                <Button
                                                    type="submit"
                                                    disabled={loading || !formData.name || !formData.email || !agreedToTerms}
                                                    className="h-12 px-8 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black tracking-wide shadow-[0_0_30px_rgba(6,182,212,0.45)] transition-all disabled:opacity-40"
                                                >
                                                    {loading ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                                                            <span>{t("form.sending")}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <span>{t("form.submit")}</span>
                                                            <Send className="h-4 w-4" />
                                                        </div>
                                                    )}
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>
                        </div>
                    </div>

                    {/* Right Info / Trust Sidebar */}
                    <div className="lg:col-span-4 space-y-4">
                        {/* Why Us Card */}
                        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-2xl p-6 md:p-8 space-y-6">
                            <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-wider">
                                <Sparkles className="h-4 w-4" />
                                <span>{t("sidebar.title")}</span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3.5">
                                    <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                                        <Rocket className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">{t("sidebar.feature_1_title")}</h4>
                                        <p className="text-xs text-white/50 leading-relaxed mt-0.5">{t("sidebar.feature_1_desc")}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5">
                                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                                        <Code className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">{t("sidebar.feature_2_title")}</h4>
                                        <p className="text-xs text-white/50 leading-relaxed mt-0.5">{t("sidebar.feature_2_desc")}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5">
                                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                                        <Shield className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">{t("sidebar.feature_3_title")}</h4>
                                        <p className="text-xs text-white/50 leading-relaxed mt-0.5">{t("sidebar.feature_3_desc")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Direct Fast Contact Card */}
                        <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent p-6 space-y-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                                {locale === 'hu' ? "Gyorsabb egyeztetést szeretnél?" : "Need a faster chat?"}
                            </span>
                            <h4 className="text-sm font-extrabold text-white">
                                {locale === 'hu' ? "Foglalj közvetlen 30 perces videóhívást!" : "Book a direct 30-min discovery call!"}
                            </h4>
                            <p className="text-xs text-white/60 leading-relaxed">
                                {locale === 'hu'
                                    ? "Ha nem szeretnél gépelni, foglalj azonnal szabad idősávot a naptárunkban."
                                    : "If you prefer talking, pick a convenient time directly in our calendar."}
                            </p>
                            <Button
                                className="w-full mt-2 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10"
                                asChild
                            >
                                <Link href="/demo">
                                    <Calendar className="mr-2 h-3.5 w-3.5 text-cyan-400" />
                                    {locale === 'hu' ? "Naptár megnyitása" : "Open Calendar"}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
