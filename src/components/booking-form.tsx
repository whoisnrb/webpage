"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { hu, enUS } from "date-fns/locale"
import { Calendar as CalendarIcon, Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useRecaptcha } from "@/components/recaptcha-provider"
import { useTranslations, useLocale } from "next-intl"

export function BookingForm() {
    const t = useTranslations('Booking')
    const { executeRecaptcha } = useRecaptcha()
    const locale = useLocale()
    const dateLocale = locale === 'hu' ? hu : enUS

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMessage("")
        console.log("Form submitted. Data:", { ...formData, date })

        if (!date || !formData.name || !formData.email || !formData.topic || !formData.time) {
            console.log("Validation failed")
            setErrorMessage(t('error_fill_all'))
            return
        }

        setStatus("loading")

        try {
            console.log("Executing reCAPTCHA...")
            const token = await executeRecaptcha("booking_form")

            if (!token) {
                throw new Error("reCAPTCHA failed")
            }

            console.log("Sending request to /api/booking...")
            const response = await fetch("/api/booking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    date: date.toISOString(),
                    recaptchaToken: token
                })
            })

            console.log("Response status:", response.status)
            const data = await response.json()
            console.log("Response data:", data)

            if (!response.ok) {
                throw new Error(data.error || "Failed to book")
            }

            setStatus("success")
            setFormData({ name: "", email: "", topic: "", time: "", message: "" })
            setDate(undefined)
        } catch (error) {
            console.error("Submission error:", error)
            setStatus("error")
            setErrorMessage(error instanceof Error ? error.message : t('error_generic'))
        }
    }

    if (status === "success") {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center p-8 text-center space-y-4 bg-muted/30 rounded-lg border border-green-500/20"
            >
                <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold">{t('success_title')}</h3>
                <p className="text-muted-foreground">
                    {t('success_message')}
                </p>
                <Button onClick={() => setStatus("idle")} variant="outline">
                    {t('new_booking')}
                </Button>
            </motion.div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">{t('name')}</label>
                    <Input
                        required
                        placeholder={t('name_placeholder')}
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">{t('email')}</label>
                    <Input
                        required
                        type="email"
                        placeholder={t('email_placeholder')}
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">{t('topic')}</label>
                    <Select
                        required
                        onValueChange={(value) => setFormData(prev => ({ ...prev, topic: value }))}
                        value={formData.topic}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={t('topic_placeholder')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="consultation">{t('topics.consultation')}</SelectItem>
                            <SelectItem value="development">{t('topics.development')}</SelectItem>
                            <SelectItem value="automation">{t('topics.automation')}</SelectItem>
                            <SelectItem value="audit">{t('topics.audit')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 flex flex-col">
                        <label className="text-sm font-medium">{t('date')}</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    {date ? (
                                        format(date, "PPP", { locale: dateLocale })
                                    ) : (
                                        <span>{t('select_date')}</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    disabled={(date) =>
                                        date < new Date() || date < new Date("1900-01-01") || date.getDay() === 0 || date.getDay() === 6
                                    }
                                    initialFocus
                                    locale={dateLocale}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t('time')}</label>
                        <Select
                            required
                            onValueChange={(value) => setFormData(prev => ({ ...prev, time: value }))}
                            value={formData.time}
                            disabled={!date}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t('select_time')} />
                            </SelectTrigger>
                            <SelectContent>
                                {["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"].map((time) => (
                                    <SelectItem key={time} value={time}>
                                        {time}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">{t('message')}</label>
                <Textarea
                    placeholder={t('message_placeholder')}
                    className="min-h-[100px]"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                />
            </div>

            {errorMessage && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
                    {errorMessage}
                </div>
            )}



            <Button type="submit" className="w-full" disabled={status === "loading"}>
                {status === "loading" ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('submitting')}
                    </>
                ) : (
                    t('submit')
                )}
            </Button>
        </form>
    )
}
