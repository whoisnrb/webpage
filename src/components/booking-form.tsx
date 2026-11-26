"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { hu, enUS } from "date-fns/locale"
import {
    Calendar as CalendarIcon,
    Loader2,
    CheckCircle2,
    User,
    Mail,
    MessageSquare,
    Clock,
    ArrowRight,
    ArrowLeft,
    Sparkles,
    Shield,
    Code2,
    Zap,
    Send,
    Video,
    MailCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useRecaptcha } from "@/components/recaptcha-provider"
import { useTranslations, useLocale } from "next-intl"
import { trackFunnelStep, trackFormAbandonment } from "@/lib/funnel-client"

const TOPICS = [
    { value: "consultation", icon: MessageSquare, gradient: "from-cyan-500/20 to-blue-500/20", border: "border-cyan-500/40", iconColor: "text-cyan-400" },
    { value: "development", icon: Code2, gradient: "from-violet-500/20 to-purple-500/20", border: "border-violet-500/40", iconColor: "text-violet-400" },
    { value: "automation", icon: Zap, gradient: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/40", iconColor: "text-amber-400" },
    { value: "audit", icon: Shield, gradient: "from-emerald-500/20 to-green-500/20", border: "border-emerald-500/40", iconColor: "text-emerald-400" },
]

const TIME_SLOTS = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"]

// Friction-ordered steps for meeting booking: Topic -> Schedule -> Details & Submit
const MEETING_STEPS = ["topic", "schedule", "details"] as const
type MeetingStep = typeof MEETING_STEPS[number]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export type BookingFormProps = {
    defaultMode?: "meeting" | "message"
}

export function BookingForm({ defaultMode = "meeting" }: BookingFormProps) {
    const t = useTranslations('Booking')
    const { executeRecaptcha } = useRecaptcha()
    const locale = useLocale()
    const isEn = locale === 'en'
    const dateLocale = isEn ? enUS : hu

    const [mode, setMode] = useState<"meeting" | "message">(defaultMode)
    const [currentStep, setCurrentStep] = useState<MeetingStep>("topic")
    const [date, setDate] = useState<Date>()
    const [errorMessage, setErrorMessage] = useState("")
    const [emailTouched, setEmailTouched] = useState(false)
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [submittedMode, setSubmittedMode] = useState<"meeting" | "message">(defaultMode)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        topic: "",
        time: "",
        message: "",
    })

    const hasInteractedRef = useRef(false)
    const lastFieldRef = useRef("topic")
    const stepIdxRef = useRef(1)
    const submittedRef = useRef(false)

    const todayStart = useMemo(() => {
        const d = new Date()
        d.setHours(0, 0, 0, 0)
        return d
    }, [])

    const tomorrowStart = useMemo(() => {
        const d = new Date(todayStart)
        d.setDate(d.getDate() + 1)
        return d
    }, [todayStart])

    const isEmailValid = useMemo(() => EMAIL_REGEX.test(formData.email.trim()), [formData.email])

    useEffect(() => {
        stepIdxRef.current = mode === "message" ? 1 : MEETING_STEPS.indexOf(currentStep) + 1
    }, [currentStep, mode])

    useEffect(() => {
        if (formData.name || formData.email || formData.topic || formData.time || formData.message) {
            hasInteractedRef.current = true
            trackFunnelStep({ funnel: "booking", step: "step_1_interact", stepNumber: stepIdxRef.current || 1, lastField: lastFieldRef.current })
        }
        if (formData.message) lastFieldRef.current = "message"
        else if (formData.email) lastFieldRef.current = "email"
        else if (formData.name) lastFieldRef.current = "name"
        else if (formData.time) lastFieldRef.current = "time"
        else if (formData.topic) lastFieldRef.current = "topic"
    }, [formData])

    useEffect(() => {
        trackFunnelStep({ funnel: "booking", step: "step_1_topic", stepNumber: 1 })
        const onUnload = () => {
            if (hasInteractedRef.current && !submittedRef.current) {
                trackFormAbandonment({
                    funnel: "booking",
                    stepNumber: stepIdxRef.current || 1,
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

    const currentStepIndex = MEETING_STEPS.indexOf(currentStep)

    const canProceedMeeting = useMemo(() => {
        switch (currentStep) {
            case "topic":
                return formData.topic !== ""
            case "schedule":
                return !!date && formData.time !== ""
            case "details":
                return formData.name.trim().length >= 2 && isEmailValid
            default:
                return false
        }
    }, [currentStep, formData, date, isEmailValid])

    const canSubmitMessage = useMemo(() => {
        return formData.name.trim().length >= 2 && isEmailValid && formData.message.trim().length >= 5
    }, [formData.name, formData.message, isEmailValid])

    const goNext = () => {
        const idx = MEETING_STEPS.indexOf(currentStep)
        if (idx < MEETING_STEPS.length - 1) {
            const nextStep = MEETING_STEPS[idx + 1]
            hasInteractedRef.current = true
            trackFunnelStep({ funnel: "booking", step: `step_${idx + 2}_${nextStep}`, stepNumber: idx + 2 })
            setCurrentStep(nextStep)
            setErrorMessage("")
        }
    }

    const goBack = () => {
        const idx = MEETING_STEPS.indexOf(currentStep)
        if (idx > 0) {
            setCurrentStep(MEETING_STEPS[idx - 1])
            setErrorMessage("")
        }
    }

    const handleSubmit = async () => {
        setErrorMessage("")
        setEmailTouched(true)

        if (!formData.name.trim() || !isEmailValid) {
            setErrorMessage(isEn ? "Please enter your name and a valid email address." : "Kérjük, adj meg egy nevet és valós e-mail címet.")
            return
        }

        if (mode === "meeting" && (!date || !formData.topic || !formData.time)) {
            setErrorMessage(t('error_fill_all'))
            return
        }

        if (mode === "message" && formData.message.trim().length < 5) {
            setErrorMessage(isEn ? "Please write a short message (at least 5 characters)." : "Kérjük, írj egy rövid üzenetet (legalább 5 karakter).")
            return
        }

        setStatus("loading")

        try {
            const token = await executeRecaptcha("booking_form")
            const topicLabel = formData.topic ? t(`topics.${formData.topic}`) : (isEn ? "General Inquiry" : "Általános kérdés")

            const response = await fetch("/api/booking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    topic: topicLabel,
                    time: mode === "meeting" ? formData.time : "",
                    date: mode === "meeting" && date ? date.toISOString() : "",
                    message: formData.message.trim(),
                    mode,
                    locale: isEn ? "en" : "hu",
                    recaptchaToken: token
                })
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(data.error || "Failed to send")
            }

            submittedRef.current = true
            setSubmittedMode(mode)
            trackFunnelStep({ funnel: "booking", step: "submitted", stepNumber: 5 })
            setStatus("success")
            setFormData({ name: "", email: "", topic: "", time: "", message: "" })
            setDate(undefined)
            setEmailTouched(false)
        } catch (error) {
            setStatus("error")
            setErrorMessage(error instanceof Error ? error.message : t('error_generic'))
        }
    }

    if (status === "success") {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center justify-center py-12 text-center space-y-5"
            >
                <div className="relative">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center border border-emerald-500/30">
                        <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                        {submittedMode === "message"
                            ? (isEn ? "Message Sent!" : "Üzenet elküldve!")
                            : t('success_title')}
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto leading-relaxed text-sm">
                        {submittedMode === "message"
                            ? (isEn
                                ? "Thank you for writing! We sent a confirmation to your email and will respond within 2 business hours."
                                : "Köszönjük a megkeresést! Küldtünk egy visszaigazolást az e-mail címedre, munkaidőben 2 órán belül válaszolunk.")
                            : t('success_message')}
                    </p>
                </div>

                <Button
                    onClick={() => { setStatus("idle"); setCurrentStep("topic") }}
                    variant="outline"
                    className="rounded-full px-6 border-white/10 hover:bg-white/5"
                >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {submittedMode === "message"
                        ? (isEn ? "Send another message" : "Új üzenet küldése")
                        : t('new_booking')}
                </Button>
            </motion.div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Mode Switcher Pill */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-white/[0.04] border border-white/10">
                <button
                    type="button"
                    onClick={() => { setMode("meeting"); setErrorMessage("") }}
                    className={cn(
                        "flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer",
                        mode === "meeting"
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20 font-bold"
                            : "text-white/60 hover:text-white"
                    )}
                >
                    <Video className="h-4 w-4 shrink-0" />
                    <span>{isEn ? "Book 30-min Call" : "30 perces videóhívás"}</span>
                </button>
                <button
                    type="button"
                    onClick={() => { setMode("message"); setErrorMessage("") }}
                    className={cn(
                        "flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer",
                        mode === "message"
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20 font-bold"
                            : "text-white/60 hover:text-white"
                    )}
                >
                    <MailCheck className="h-4 w-4 shrink-0" />
                    <span>{isEn ? "Quick Message" : "Gyors üzenet"}</span>
                </button>
            </div>

            {mode === "meeting" ? (
                <>
                    {/* 3-Step Indicator */}
                    <div className="flex items-center justify-between px-2">
                        {MEETING_STEPS.map((step, index) => {
                            const isActive = index === currentStepIndex
                            const isCompleted = index < currentStepIndex
                            const stepIcons = [Sparkles, CalendarIcon, User]
                            const StepIcon = stepIcons[index]
                            const stepLabels = [
                                isEn ? 'Topic' : 'Téma',
                                isEn ? 'Schedule' : 'Időpont',
                                isEn ? 'Details' : 'Adatok',
                            ]

                            return (
                                <div key={step} className="flex items-center flex-1 last:flex-none">
                                    <div className="flex flex-col items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (isCompleted) setCurrentStep(step)
                                            }}
                                            disabled={!isCompleted && !isActive}
                                            className={cn(
                                                "relative h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer disabled:cursor-default",
                                                isActive && "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25 text-slate-950",
                                                isCompleted && "bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/30",
                                                !isActive && !isCompleted && "bg-white/5 border border-white/10 text-white/35"
                                            )}
                                        >
                                            {isCompleted ? (
                                                <CheckCircle2 className="h-4 w-4" />
                                            ) : (
                                                <StepIcon className="h-4 w-4" />
                                            )}
                                        </button>
                                        <span className={cn(
                                            "text-[11px] font-semibold transition-colors",
                                            isActive ? "text-cyan-400" : isCompleted ? "text-emerald-400/80" : "text-white/35"
                                        )}>
                                            {stepLabels[index]}
                                        </span>
                                    </div>
                                    {index < MEETING_STEPS.length - 1 && (
                                        <div className="flex-1 mx-3 mb-5">
                                            <div className="h-px bg-white/10 relative overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-300"
                                                    style={{ width: isCompleted ? "100%" : "0%" }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* Step Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -16 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Step 1: Topic Selection (lowest friction) */}
                            {currentStep === "topic" && (
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <h3 className="text-base font-bold text-white">{isEn ? 'What would you like to discuss?' : 'Miről szeretnél egyeztetni?'}</h3>
                                        <p className="text-xs text-muted-foreground">{isEn ? 'Pick a topic to continue (30-min free call)' : 'Válassz témát a 30 perces ingyenes konzultációhoz'}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {TOPICS.map((topic) => {
                                            const Icon = topic.icon
                                            const isSelected = formData.topic === topic.value
                                            return (
                                                <button
                                                    key={topic.value}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, topic: topic.value }))}
                                                    className={cn(
                                                        "relative flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-center",
                                                        isSelected
                                                            ? `bg-gradient-to-br ${topic.gradient} ${topic.border} shadow-lg`
                                                            : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/25"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "h-11 w-11 rounded-xl flex items-center justify-center transition-colors",
                                                        isSelected ? `bg-gradient-to-br ${topic.gradient}` : "bg-white/5"
                                                    )}>
                                                        <Icon className={cn("h-5 w-5", isSelected ? topic.iconColor : "text-white/45")} />
                                                    </div>
                                                    <span className={cn(
                                                        "text-xs sm:text-sm font-semibold transition-colors",
                                                        isSelected ? "text-white" : "text-white/70"
                                                    )}>
                                                        {t(`topics.${topic.value}`)}
                                                    </span>
                                                    <div className={cn(
                                                        "absolute top-2.5 right-2.5 h-4 w-4 rounded-full border flex items-center justify-center transition-all",
                                                        isSelected ? "bg-cyan-400 border-cyan-400 text-slate-950" : "border-white/20 text-transparent"
                                                    )}>
                                                        <CheckCircle2 className="h-3 w-3" />
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Schedule */}
                            {currentStep === "schedule" && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <div>
                                            <h3 className="text-base font-bold text-white">{isEn ? 'Pick a Date & Time' : 'Válassz napot és időpontot'}</h3>
                                            <p className="text-xs text-muted-foreground">{isEn ? 'Mon–Fri, Central European Time (CET)' : 'Hétfő–Péntek munkanapokon'}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setMode("message")}
                                            className="text-xs text-cyan-400 hover:text-cyan-300 underline-offset-2 hover:underline cursor-pointer"
                                        >
                                            {isEn ? "Prefer just messaging? →" : "Inkább csak üzenetet írok →"}
                                        </button>
                                    </div>

                                    {/* High-contrast Dark Calendar */}
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3 overflow-hidden">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            fromMonth={todayStart}
                                            onSelect={(d) => { setDate(d); setFormData(prev => ({ ...prev, time: "" })) }}
                                            disabled={(d) =>
                                                d < tomorrowStart || d.getDay() === 0 || d.getDay() === 6
                                            }
                                            locale={dateLocale}
                                            className="mx-auto"
                                            classNames={{
                                                caption_label: "text-sm font-bold text-white",
                                                head_cell: "text-white/45 rounded-md w-9 font-semibold text-[0.75rem]",
                                                nav_button: "h-7 w-7 bg-white/5 border border-white/15 text-white hover:bg-white/15 rounded-md p-0 flex items-center justify-center",
                                                day: "h-9 w-9 p-0 font-semibold text-white/90 hover:bg-cyan-500/20 hover:text-cyan-300 rounded-lg transition-colors flex items-center justify-center cursor-pointer",
                                                day_selected: "bg-cyan-500 text-slate-950 font-black hover:bg-cyan-400 hover:text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.45)]",
                                                day_today: "border border-white/15 text-white/30 bg-transparent",
                                                day_disabled: "text-white/20 opacity-40 cursor-not-allowed hover:bg-transparent hover:text-white/20",
                                                day_outside: "text-white/15 opacity-30",
                                            }}
                                        />
                                    </div>

                                    {/* Time Slots */}
                                    {date && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-2.5"
                                        >
                                            <p className="text-xs font-medium text-white/70 flex items-center gap-2">
                                                <Clock className="h-3.5 w-3.5 text-cyan-400" />
                                                {format(date, "PPP", { locale: dateLocale })}
                                            </p>
                                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                                {TIME_SLOTS.map((time) => {
                                                    const isSelected = formData.time === time
                                                    return (
                                                        <button
                                                            key={time}
                                                            type="button"
                                                            onClick={() => setFormData(prev => ({ ...prev, time }))}
                                                            className={cn(
                                                                "h-9 rounded-xl text-xs font-bold transition-all duration-150 border cursor-pointer",
                                                                isSelected
                                                                    ? "bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-400 text-slate-950 shadow-md shadow-cyan-500/25"
                                                                    : "bg-white/[0.04] border-white/10 text-white/75 hover:bg-white/[0.08] hover:border-white/25 hover:text-white"
                                                            )}
                                                        >
                                                            {time}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            )}

                            {/* Step 3: Details & Optional Message */}
                            {currentStep === "details" && (
                                <div className="space-y-4">
                                    {/* Clickable Summary */}
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 grid grid-cols-2 gap-3 text-xs">
                                        <button
                                            type="button"
                                            onClick={() => setCurrentStep("topic")}
                                            className="text-left hover:bg-white/[0.04] p-1 -m-1 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <span className="text-white/40 block">{t('topic')}</span>
                                            <span className="font-semibold text-cyan-400">
                                                {formData.topic ? t(`topics.${formData.topic}`) : "—"}
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setCurrentStep("schedule")}
                                            className="text-left hover:bg-white/[0.04] p-1 -m-1 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <span className="text-white/40 block">{isEn ? 'Appointment' : 'Időpont'}</span>
                                            <span className="font-semibold text-white">
                                                {date ? format(date, "MM. dd.", { locale: dateLocale }) : "—"}{" "}
                                                <span className="text-cyan-400">{formData.time || ""}</span>
                                            </span>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="relative group">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-cyan-400 transition-colors">
                                                <User className="h-4 w-4" />
                                            </div>
                                            <Input
                                                required
                                                placeholder={t('name_placeholder')}
                                                value={formData.name}
                                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                className="pl-10 h-11 bg-white/[0.03] border-white/10 rounded-xl focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-white/25"
                                            />
                                        </div>
                                        <div>
                                            <div className="relative group">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-cyan-400 transition-colors">
                                                    <Mail className="h-4 w-4" />
                                                </div>
                                                <Input
                                                    required
                                                    type="email"
                                                    placeholder={t('email_placeholder')}
                                                    value={formData.email}
                                                    onBlur={() => setEmailTouched(true)}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                                    className={cn(
                                                        "pl-10 h-11 bg-white/[0.03] rounded-xl placeholder:text-white/25",
                                                        emailTouched && formData.email && !isEmailValid
                                                            ? "border-red-500/60 focus:border-red-400"
                                                            : "border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                                                    )}
                                                />
                                            </div>
                                            {emailTouched && formData.email && !isEmailValid && (
                                                <p className="text-[11px] text-red-400 mt-1">
                                                    {isEn ? "Please enter a valid email (e.g. name@domain.com)." : "Érvényes e-mail címet adj meg (pl. nev@ceg.hu)."}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <Textarea
                                        placeholder={t('message_placeholder')}
                                        className="min-h-[90px] bg-white/[0.03] border-white/10 rounded-xl focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-white/25 resize-none text-sm"
                                        value={formData.message}
                                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                    />
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </>
            ) : (
                /* Quick Message Mode (Single screen, zero calendar friction) */
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <div className="space-y-2">
                        <p className="text-xs font-semibold text-white/60">
                            {isEn ? "Topic (optional)" : "Téma (opcionális)"}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {TOPICS.map((topic) => {
                                const isSelected = formData.topic === topic.value
                                return (
                                    <button
                                        key={topic.value}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, topic: isSelected ? "" : topic.value }))}
                                        className={cn(
                                            "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer",
                                            isSelected
                                                ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                                                : "bg-white/[0.03] border-white/10 text-white/65 hover:border-white/25 hover:text-white"
                                        )}
                                    >
                                        {t(`topics.${topic.value}`)}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-cyan-400 transition-colors">
                                <User className="h-4 w-4" />
                            </div>
                            <Input
                                required
                                placeholder={t('name_placeholder')}
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="pl-10 h-11 bg-white/[0.03] border-white/10 rounded-xl focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-white/25"
                            />
                        </div>
                        <div>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-cyan-400 transition-colors">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <Input
                                    required
                                    type="email"
                                    placeholder={t('email_placeholder')}
                                    value={formData.email}
                                    onBlur={() => setEmailTouched(true)}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className={cn(
                                        "pl-10 h-11 bg-white/[0.03] rounded-xl placeholder:text-white/25",
                                        emailTouched && formData.email && !isEmailValid
                                            ? "border-red-500/60 focus:border-red-400"
                                            : "border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                                    )}
                                />
                            </div>
                            {emailTouched && formData.email && !isEmailValid && (
                                <p className="text-[11px] text-red-400 mt-1">
                                    {isEn ? "Please enter a valid email (e.g. name@domain.com)." : "Érvényes e-mail címet adj meg (pl. nev@ceg.hu)."}
                                </p>
                            )}
                        </div>
                    </div>

                    <Textarea
                        required
                        placeholder={isEn ? "Write your question or briefly describe what you need..." : "Írd le kérdésed vagy miben segíthetünk..."}
                        className="min-h-[120px] bg-white/[0.03] border-white/10 rounded-xl focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-white/25 resize-none text-sm"
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    />
                </motion.div>
            )}

            {/* Error Message */}
            <AnimatePresence>
                {errorMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium text-center"
                    >
                        {errorMessage}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation / Submit Footer */}
            {mode === "meeting" ? (
                <div className="space-y-3 pt-1">
                    <div className="flex items-center gap-3">
                        {currentStepIndex > 0 && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={goBack}
                                className="rounded-xl border-white/10 hover:bg-white/5 h-11 px-5"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {isEn ? 'Back' : 'Vissza'}
                            </Button>
                        )}

                        {currentStep !== "details" ? (
                            <Button
                                type="button"
                                onClick={goNext}
                                disabled={!canProceedMeeting}
                                className={cn(
                                    "flex-1 rounded-xl h-11 text-sm font-bold transition-all duration-200",
                                    canProceedMeeting
                                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                                        : "bg-white/10 text-white/40 cursor-not-allowed"
                                )}
                            >
                                {isEn ? 'Continue' : 'Tovább'}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={status === "loading" || !canProceedMeeting}
                                className="flex-1 rounded-xl h-11 text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all duration-200 disabled:opacity-45"
                            >
                                {status === "loading" ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t('submitting')}
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        {t('submit')}
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                    <p className="text-[11px] text-white/40 text-center">
                        {isEn
                            ? "Free 30-min consultation • No obligation • Instant confirmation"
                            : "Ingyenes 30 perces egyeztetés • Kötelezettségmentes • Azonnali visszaigazolás"}
                    </p>
                </div>
            ) : (
                <div className="space-y-3 pt-1">
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={status === "loading" || !canSubmitMessage}
                        className="w-full rounded-xl h-11 text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all duration-200 disabled:opacity-45"
                    >
                        {status === "loading" ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('submitting')}
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                {isEn ? "Send Message" : "Üzenet küldése"}
                            </>
                        )}
                    </Button>
                    <p className="text-[11px] text-white/40 text-center">
                        {isEn
                            ? "Average reply time: <2 hours on business days"
                            : "Átlagos válaszidő munkanapokon: 2 órán belül"}
                    </p>
                </div>
            )}
        </div>
    )
}
