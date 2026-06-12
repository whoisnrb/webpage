"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Link } from "@/i18n/routing"
import { ArrowLeft, Upload, CheckCircle2, Sparkles, Briefcase, Code2, Server } from "lucide-react"
import { useTranslations } from "next-intl"

import { submitApplication } from "./actions"

export default function SpontanJelentkezesPage() {
    const t = useTranslations('Careers.application')
    const [submitted, setSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedAreas, setSelectedAreas] = useState<string[]>([])

    const areas = [
        { id: "frontend", label: t('form.areas.frontend'), icon: Code2 },
        { id: "backend", label: t('form.areas.backend'), icon: Server },
        { id: "devops", label: t('form.areas.devops'), icon: Server },
        { id: "design", label: t('form.areas.design'), icon: Sparkles },
        { id: "pm", label: t('form.areas.pm'), icon: Briefcase },
        { id: "other", label: t('form.areas.other'), icon: Sparkles },
    ]

    const toggleArea = (id: string) => {
        setSelectedAreas(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        )
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const formData = new FormData(e.currentTarget)
            formData.append('areas', JSON.stringify(selectedAreas))

            const result = await submitApplication(null, formData)

            if (result.success) {
                setSubmitted(true)
            } else {
                alert(result.error)
            }
        } catch (error) {
            console.error(error)
            alert('Hiba történt a küldés során.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (submitted) {
        return (
            <div className="min-h-screen flex flex-col">
                <section className="relative flex-1 py-20 md:py-32 overflow-hidden">
                    {/* Background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
                    <div className="absolute inset-0 opacity-[0.02]" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none' stroke='%2306b6d4' stroke-width='1'/%3E%3C/svg%3E")`,
                        backgroundSize: '60px 60px'
                    }} />
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[150px]" />

                    <div className="container relative z-10 mx-auto px-4 text-center">
                        <div className="max-w-2xl mx-auto">
                            <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-8">
                                <CheckCircle2 className="h-10 w-10 text-green-400" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
                                {t('success.title')}
                            </h1>
                            <p className="text-xl text-slate-400 mb-10">
                                {t('success.description')}
                            </p>
                            <Link href="/karrier">
                                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-white font-bold">
                                    {t('success.button')}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero */}
            <section className="relative py-16 md:py-24 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none' stroke='%2306b6d4' stroke-width='1'/%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                }} />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-[150px]" />

                <div className="container relative z-10 mx-auto px-4">
                    {/* Back link */}
                    <Link href="/karrier" className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors mb-8">
                        <ArrowLeft className="h-4 w-4" />
                        <span>{t('back_link')}</span>
                    </Link>

                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 mb-6">
                            <Sparkles className="h-4 w-4 text-cyan-400" />
                            <span className="text-sm font-medium text-cyan-300">{t('badge')}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
                            {t('title')}
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            {t('description')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section className="relative py-16 md:py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900" />

                <div className="container relative z-10 mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        {/* Form card */}
                        <div className="relative">
                            <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/30 via-violet-500/30 to-cyan-500/30 rounded-3xl blur-sm" />
                            <div className="relative bg-slate-900/90 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-12">
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Personal info */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-slate-300">{t('form.name')}</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                required
                                                placeholder={t('form.name_placeholder')}
                                                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 h-12"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-slate-300">{t('form.email')}</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                placeholder={t('form.email_placeholder')}
                                                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 h-12"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-slate-300">{t('form.phone')}</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                placeholder={t('form.phone_placeholder')}
                                                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 h-12"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="linkedin" className="text-slate-300">{t('form.linkedin')}</Label>
                                            <Input
                                                id="linkedin"
                                                name="linkedin"
                                                type="url"
                                                placeholder={t('form.linkedin_placeholder')}
                                                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 h-12"
                                            />
                                        </div>
                                    </div>

                                    {/* Areas of interest */}
                                    <div className="space-y-4">
                                        <Label className="text-slate-300">{t('form.areas_label')}</Label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {areas.map((area) => (
                                                <button
                                                    key={area.id}
                                                    type="button"
                                                    onClick={() => toggleArea(area.id)}
                                                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 ${selectedAreas.includes(area.id)
                                                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                                                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                                                        }`}
                                                >
                                                    <area.icon className="h-5 w-5 shrink-0" />
                                                    <span className="text-sm font-medium">{area.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* CV Upload */}
                                    <div className="space-y-2">
                                        <Label htmlFor="cv" className="text-slate-300">{t('form.cv_label')}</Label>
                                        <div className="relative">
                                            <input
                                                id="cv"
                                                name="cv"
                                                type="file"
                                                required
                                                accept=".pdf,.doc,.docx"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="flex items-center justify-center gap-4 p-8 rounded-xl border-2 border-dashed border-slate-700 hover:border-cyan-500/50 transition-colors bg-slate-800/30">
                                                <div className="h-12 w-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                                    <Upload className="h-6 w-6 text-cyan-400" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-slate-300 font-medium">{t('form.cv_drop')}</p>
                                                    <p className="text-sm text-slate-500">{t('form.cv_hint')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Motivation */}
                                    <div className="space-y-2">
                                        <Label htmlFor="motivation" className="text-slate-300">{t('form.motivation_label')}</Label>
                                        <Textarea
                                            id="motivation"
                                            name="motivation"
                                            rows={5}
                                            placeholder={t('form.motivation_placeholder')}
                                            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 resize-none"
                                        />
                                    </div>

                                    {/* Submit */}
                                    <div className="pt-4">
                                        <Button
                                            disabled={isSubmitting}
                                            type="submit"
                                            size="lg"
                                            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-white shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? 'Küldés...' : t('form.submit')}
                                        </Button>
                                        <p className="text-center text-sm text-slate-500 mt-4">
                                            {t('form.terms_prefix')}
                                            <Link href="/adatvedelem" className="text-cyan-400 hover:underline">{t('form.terms_link')}</Link>
                                            {t('form.terms_suffix')}
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Trust indicators */}
                        <div className="flex flex-wrap justify-center gap-6 mt-12 text-slate-500 text-sm">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-400" />
                                <span>{t('trust.gdpr')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-400" />
                                <span>{t('trust.confidential')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-400" />
                                <span>{t('trust.feedback')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
