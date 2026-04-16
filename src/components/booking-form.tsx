"use client"

import { useState, useMemo } from "react"
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
    Search,
    Send,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useRecaptcha } from "@/components/recaptcha-provider"
import { useTranslations, useLocale } from "next-intl"

const TOPICS = [
    { value: "consultation", icon: MessageSquare, gradient: "from-cyan-500/20 to-blue-500/20", border: "border-cyan-500/30", iconColor: "text-cyan-400" },
    { value: "development", icon: Code2, gradient: "from-violet-500/20 to-purple-500/20", border: "border-violet-500/30", iconColor: "text-violet-400" },
    { value: "automation", icon: Zap, gradient: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/30", iconColor: "text-amber-400" },
    { value: "audit", icon: Shield, gradient: "from-emerald-500/20 to-green-500/20", border: "border-emerald-500/30", iconColor: "text-emerald-400" },
]

const TIME_SLOTS = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"]

const STEPS = ["details", "topic", "schedule", "message"] as const
type Step = typeof STEPS[number]

export function BookingForm() {
    const t = useTranslations('Booking')
    const { executeRecaptcha } = useRecaptcha()
    const locale = useLocale()
    const dateLocale = locale === 'hu' ? hu : enUS

    const [currentStep, setCurrentStep] = useState<Step>("details")
    const [date, setDate] = useState<Date>()
    const [errorMessage, setErrorMessage] = useState("")
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        topic: "",
        time: "",
        message: "",
    })

    const currentStepIndex = STEPS.indexOf(currentStep)

    const canProceed = useMemo(() => {
        switch (currentStep) {
            case "details":
                return formData.name.trim() !== "" && formData.email.trim() !== "" && formData.email.includes("@")
            case "topic":
                return formData.topic !== ""
            case "schedule":
                return !!date && formData.time !== ""
            case "message":
                return true
            default:
                return false
        }
    }, [currentStep, formData, date])

    const goNext = () => {
        const idx = STEPS.indexOf(currentStep)
        if (idx < STEPS.length - 1) {
            setCurrentStep(STEPS[idx + 1])
            setErrorMessage("")
        }
    }

    const goBack = () => {
        const idx = STEPS.indexOf(currentStep)
        if (idx > 0) {
            setCurrentStep(STEPS[idx - 1])
            setErrorMessage("")
        }
    }

    const handleSubmit = async () => {
        setErrorMessage("")

        if (!date || !formData.name || !formData.email || !formData.topic || !formData.time) {
            setErrorMessage(t('error_fill_all'))
            return
        }

        setStatus("loading")

        try {
            const token = await executeRecaptcha("booking_form")

            const response = await fetch("/api/booking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    date: date.toISOString(),
                    recaptchaToken: token
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to book")
            }

            setStatus("success")
            setFormData({ name: "", email: "", topic: "", time: "", message: "" })
            setDate(undefined)
        } catch (error) {
            setStatus("error")
            setErrorMessage(error instanceof Error ? error.message : t('error_generic'))
        }
    }

    if (status === "success") {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center justify-center py-16 text-center space-y-6"
            >
                {/* Animated success rings */}
                <div className="relative">
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                        className="h-24 w-24 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center border border-emerald-500/30"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                        >
                            <CheckCircle2 className="h-12 w-12 text-emerald-400" />
                        </motion.div>
                    </motion.div>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ delay: 0.3, duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
                        className="absolute inset-0 rounded-full border-2 border-emerald-400/30"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-2"
                >
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                        {t('success_title')}
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                        {t('success_message')}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <Button
                        onClick={() => { setStatus("idle"); setCurrentStep("details") }}
                        variant="outline"
                        className="rounded-full px-6 border-white/10 hover:bg-white/5"
                    >
                        <Sparkles className="mr-2 h-4 w-4" />
                        {t('new_booking')}
                    </Button>
                </motion.div>
            </motion.div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Step Indicator */}
            <div className="flex items-center justify-between px-2">
                {STEPS.map((step, index) => {
                    const isActive = index === currentStepIndex
                    const isCompleted = index < currentStepIndex
                    const stepIcons = [User, Search, CalendarIcon, Send]
                    const StepIcon = stepIcons[index]
                    const stepLabels = [
                        locale === 'hu' ? 'Adatok' : 'Details',
                        locale === 'hu' ? 'Téma' : 'Topic',
                        locale === 'hu' ? 'Időpont' : 'Schedule',
                        locale === 'hu' ? 'Üzenet' : 'Message',
                    ]

                    return (
                        <div key={step} className="flex items-center flex-1 last:flex-none">
                            <div className="flex flex-col items-center gap-2">
                                <motion.button
                                    onClick={() => {
                                        if (isCompleted) setCurrentStep(step)
                                    }}
                                    disabled={!isCompleted && !isActive}
                                    className={cn(
                                        "relative h-11 w-11 rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer",
                                        isActive && "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25",
                                        isCompleted && "bg-gradient-to-br from-emerald-500/80 to-cyan-500/80 hover:shadow-lg hover:shadow-emerald-500/20",
                                        !isActive && !isCompleted && "bg-white/5 border border-white/10"
                                    )}
                                    whileHover={isCompleted ? { scale: 1.1 } : undefined}
                                    whileTap={isCompleted ? { scale: 0.95 } : undefined}
                                >
                                    {isCompleted ? (
                                        <CheckCircle2 className="h-5 w-5 text-white" />
                                    ) : (
                                        <StepIcon className={cn(
                                            "h-5 w-5 transition-colors",
                                            isActive ? "text-white" : "text-white/30"
                                        )} />
                                    )}
                                    {isActive && (
                                        <motion.div
                                            layoutId="stepGlow"
                                            className="absolute inset-0 rounded-full border-2 border-cyan-400/50"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </motion.button>
                                <span className={cn(
                                    "text-xs font-medium transition-colors hidden sm:block",
                                    isActive ? "text-cyan-400" : isCompleted ? "text-emerald-400/70" : "text-white/30"
                                )}>
                                    {stepLabels[index]}
                                </span>
                            </div>
                            {index < STEPS.length - 1 && (
                                <div className="flex-1 mx-3 mb-6 hidden sm:block">
                                    <div className="h-px bg-white/10 relative overflow-hidden">
                                        <motion.div
                                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-emerald-500"
                                            initial={{ width: "0%" }}
                                            animate={{ width: isCompleted ? "100%" : "0%" }}
                                            transition={{ duration: 0.5, ease: "easeInOut" }}
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
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Step 1: Details */}
                    {currentStep === "details" && (
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold">{locale === 'hu' ? 'Személyes adatok' : 'Personal Details'}</h3>
                                <p className="text-sm text-muted-foreground">{locale === 'hu' ? 'Hogy elérjünk téged' : 'So we can reach you'}</p>
                            </div>
                            <div className="space-y-4">
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-cyan-400 transition-colors">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <Input
                                        required
                                        placeholder={t('name_placeholder')}
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="pl-10 h-12 bg-white/[0.03] border-white/10 rounded-xl focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-all placeholder:text-white/20"
                                    />
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-cyan-400 transition-colors">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <Input
                                        required
                                        type="email"
                                        placeholder={t('email_placeholder')}
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        className="pl-10 h-12 bg-white/[0.03] border-white/10 rounded-xl focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-all placeholder:text-white/20"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Topic Selection */}
                    {currentStep === "topic" && (
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold">{locale === 'hu' ? 'Témaválasztás' : 'Select a Topic'}</h3>
                                <p className="text-sm text-muted-foreground">{locale === 'hu' ? 'Miben segíthetünk?' : 'What can we help you with?'}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {TOPICS.map((topic) => {
                                    const Icon = topic.icon
                                    const isSelected = formData.topic === topic.value
                                    return (
                                        <motion.button
                                            key={topic.value}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, topic: topic.value }))}
                                            className={cn(
                                                "relative flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-300 cursor-pointer text-center",
                                                isSelected
                                                    ? `bg-gradient-to-br ${topic.gradient} ${topic.border} shadow-lg`
                                                    : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20"
                                            )}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            <div className={cn(
                                                "h-12 w-12 rounded-xl flex items-center justify-center transition-all",
                                                isSelected
                                                    ? `bg-gradient-to-br ${topic.gradient}`
                                                    : "bg-white/5"
                                            )}>
                                                <Icon className={cn(
                                                    "h-6 w-6 transition-colors",
                                                    isSelected ? topic.iconColor : "text-white/40"
                                                )} />
                                            </div>
                                            <span className={cn(
                                                "text-sm font-medium transition-colors",
                                                isSelected ? "text-white" : "text-white/60"
                                            )}>
                                                {t(`topics.${topic.value}`)}
                                            </span>
                                            {isSelected && (
                                                <motion.div
                                                    layoutId="topicSelected"
                                                    className="absolute top-2 right-2"
                                                    initial={false}
                                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                >
                                                    <div className="h-5 w-5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                                                        <CheckCircle2 className="h-3 w-3 text-white" />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </motion.button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Schedule */}
                    {currentStep === "schedule" && (
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold">{locale === 'hu' ? 'Időpont választás' : 'Pick a Time'}</h3>
                                <p className="text-sm text-muted-foreground">{locale === 'hu' ? 'Válassz egy neked megfelelő időpontot' : 'Choose a convenient slot'}</p>
                            </div>

                            {/* Calendar */}
                            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 overflow-hidden">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={(d) => { setDate(d); setFormData(prev => ({ ...prev, time: "" })) }}
                                    disabled={(d) =>
                                        d < new Date() || d < new Date("1900-01-01") || d.getDay() === 0 || d.getDay() === 6
                                    }
                                    locale={dateLocale}
                                    className="mx-auto"
                                />
                            </div>

                            {/* Time Slots */}
                            {date && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-3"
                                >
                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-cyan-400" />
                                        {format(date, "PPP", { locale: dateLocale })}
                                    </p>
                                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                        {TIME_SLOTS.map((time) => {
                                            const isSelected = formData.time === time
                                            return (
                                                <motion.button
                                                    key={time}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, time }))}
                                                    className={cn(
                                                        "h-10 rounded-xl text-sm font-medium transition-all duration-200 border cursor-pointer",
                                                        isSelected
                                                            ? "bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-400/50 text-white shadow-lg shadow-cyan-500/20"
                                                            : "bg-white/[0.03] border-white/10 text-white/60 hover:bg-white/[0.06] hover:border-white/20 hover:text-white"
                                                    )}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    {time}
                                                </motion.button>
                                            )
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}

                    {/* Step 4: Message */}
                    {currentStep === "message" && (
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold">{locale === 'hu' ? 'Még valami?' : 'Anything else?'}</h3>
                                <p className="text-sm text-muted-foreground">{locale === 'hu' ? 'Opcionálisan leírhatod a projekted' : 'Optionally describe your project'}</p>
                            </div>

                            {/* Summary */}
                            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                                <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400/70">{locale === 'hu' ? 'Összefoglaló' : 'Summary'}</p>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="space-y-1">
                                        <p className="text-white/40 text-xs">{t('name')}</p>
                                        <p className="font-medium truncate">{formData.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-white/40 text-xs">{t('email')}</p>
                                        <p className="font-medium truncate">{formData.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-white/40 text-xs">{t('topic')}</p>
                                        <p className="font-medium">{formData.topic ? t(`topics.${formData.topic}`) : "—"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-white/40 text-xs">{locale === 'hu' ? 'Időpont' : 'Appointment'}</p>
                                        <p className="font-medium">
                                            {date ? format(date, "MM/dd", { locale: dateLocale }) : "—"}{" "}
                                            <span className="text-cyan-400">{formData.time || ""}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative group">
                                <Textarea
                                    placeholder={t('message_placeholder')}
                                    className="min-h-[120px] bg-white/[0.03] border-white/10 rounded-xl focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-all placeholder:text-white/20 resize-none"
                                    value={formData.message}
                                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                />
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
                {errorMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center"
                    >
                        {errorMessage}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-3 pt-2">
                {currentStepIndex > 0 && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={goBack}
                        className="rounded-xl border-white/10 hover:bg-white/5 h-12 px-5"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {locale === 'hu' ? 'Vissza' : 'Back'}
                    </Button>
                )}

                {currentStep !== "message" ? (
                    <Button
                        type="button"
                        onClick={goNext}
                        disabled={!canProceed}
                        className={cn(
                            "flex-1 rounded-xl h-12 text-base font-semibold transition-all duration-300",
                            canProceed
                                ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
                                : "bg-white/5 text-white/30"
                        )}
                    >
                        {locale === 'hu' ? 'Tovább' : 'Continue'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={status === "loading"}
                        className="flex-1 rounded-xl h-12 text-base font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-300"
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
        </div>
    )
}
