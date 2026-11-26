"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { Send, User, Loader2, Star, MessageSquare, Sparkles, CheckCircle2, Mail } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslations, useLocale } from "next-intl"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type Message = {
    id: string
    role: "bot" | "user"
    content: string
    type?: "text" | "input" | "email" | "textarea"
}

type FeedbackPayload = {
    name: string
    email: string
    feedback: string
    rating?: number
    locale: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function AiFeedbackChat() {
    const t = useTranslations("AiFeedback")
    const locale = useLocale()
    const isEn = locale === "en"

    const [mode, setMode] = useState<"quick" | "chat">("quick")

    // Quick review state
    const [rating, setRating] = useState<number>(5)
    const [hoverRating, setHoverRating] = useState<number>(0)
    const [quickName, setQuickName] = useState("")
    const [quickEmail, setQuickEmail] = useState("")
    const [quickText, setQuickText] = useState("")
    const [emailTouched, setEmailTouched] = useState(false)
    const [quickLoading, setQuickLoading] = useState(false)
    const [quickDone, setQuickDone] = useState(false)

    // Chat mode state
    const [messages, setMessages] = useState<Message[]>([])
    const [inputValue, setInputValue] = useState("")
    const [formData, setFormData] = useState<{ name: string; email: string; feedback: string }>({ name: "", email: "", feedback: "" })
    const [step, setStep] = useState<"name" | "email" | "feedback" | "done">("name")
    const [isTyping, setIsTyping] = useState(false)
    const scrollAreaRef = useRef<HTMLDivElement>(null)

    const isQuickEmailValid = useMemo(() => EMAIL_REGEX.test(quickEmail.trim()), [quickEmail])

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                { id: "1", role: "bot", content: t("steps.1_intro"), type: "text" },
                { id: "2", role: "bot", content: t("steps.2_ask_name"), type: "input" }
            ])
        }
    }, [t, messages.length])

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
        }
    }, [messages, isTyping])

    const submitFeedback = async (payload: FeedbackPayload): Promise<{ ok: boolean; error?: string }> => {
        try {
            const response = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
            const data = await response.json().catch(() => ({}))
            if (!response.ok || !data.success) {
                return { ok: false, error: data.error }
            }
            return { ok: true }
        } catch {
            return { ok: false }
        }
    }

    const handleQuickSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setEmailTouched(true)

        if (!quickName.trim() || !isQuickEmailValid || quickText.trim().length < 5) {
            toast.error(
                isEn
                    ? "Please fill in your name, a valid email, and at least a short sentence."
                    : "Kérjük, adj meg nevet, érvényes e-mail címet és legalább pár szót a véleményedből."
            )
            return
        }

        setQuickLoading(true)
        const res = await submitFeedback({
            name: quickName.trim(),
            email: quickEmail.trim(),
            feedback: quickText.trim(),
            rating,
            locale: isEn ? "en" : "hu",
        })
        setQuickLoading(false)

        if (res.ok) {
            setQuickDone(true)
            toast.success(isEn ? "Thank you for your feedback!" : "Köszönjük a visszajelzésedet!")
        } else {
            toast.error(res.error || (isEn ? "Could not send feedback." : "Hiba történt a küldés során."))
        }
    }

    const handleChatSend = async () => {
        const trimmed = inputValue.trim()
        if (!trimmed) return

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: trimmed,
            type: "text"
        }

        setMessages(prev => [...prev, userMsg])
        setInputValue("")
        setIsTyping(true)

        setTimeout(async () => {
            let nextStep = step
            let botResponse: Message | null = null

            if (step === "name") {
                setFormData(prev => ({ ...prev, name: trimmed }))
                botResponse = {
                    id: Date.now().toString(),
                    role: "bot",
                    content: t("steps.3_ask_email", { name: trimmed }),
                    type: "email"
                }
                nextStep = "email"
            } else if (step === "email") {
                if (!EMAIL_REGEX.test(trimmed)) {
                    botResponse = {
                        id: Date.now().toString(),
                        role: "bot",
                        content: isEn
                            ? "That email looks invalid. Please enter a valid address (e.g. name@company.com)."
                            : "Ez nem tűnik érvényes e-mail címnek. Kérlek, adj meg egy valódi címet (pl. nev@ceg.hu).",
                        type: "email"
                    }
                    nextStep = "email"
                } else {
                    setFormData(prev => ({ ...prev, email: trimmed }))
                    botResponse = {
                        id: Date.now().toString(),
                        role: "bot",
                        content: t("steps.4_ask_feedback"),
                        type: "textarea"
                    }
                    nextStep = "feedback"
                }
            } else if (step === "feedback") {
                const payload: FeedbackPayload = {
                    name: formData.name,
                    email: formData.email,
                    feedback: trimmed,
                    locale: isEn ? "en" : "hu"
                }
                setFormData(prev => ({ ...prev, feedback: trimmed }))
                const res = await submitFeedback(payload)

                if (res.ok) {
                    botResponse = {
                        id: Date.now().toString(),
                        role: "bot",
                        content: t("steps.5_thank_you"),
                        type: "text"
                    }
                    nextStep = "done"
                } else {
                    botResponse = {
                        id: Date.now().toString(),
                        role: "bot",
                        content: res.error || (isEn
                            ? "Sorry, something went wrong sending your feedback. Please try again."
                            : "Sajnáljuk, hiba történt a küldés közben. Kérjük, próbáld meg újra."),
                        type: "textarea"
                    }
                    nextStep = "feedback"
                }
            }

            if (botResponse) {
                setMessages(prev => [...prev, botResponse!])
            }
            setStep(nextStep)
            setIsTyping(false)
        }, 650)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleChatSend()
        }
    }

    return (
        <div className="rounded-3xl border border-white/10 bg-[#06101c]/85 backdrop-blur-2xl shadow-[0_0_50px_-15px_rgba(6,182,212,0.18)] overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500/60 via-blue-500/60 to-transparent" />

            {/* Mode Switcher Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-base sm:text-lg font-black text-white">
                        {isEn ? "Share Your Experience" : "Oszd meg a tapasztalatodat"}
                    </h2>
                    <p className="text-xs text-white/50">
                        {isEn ? "Takes 20 seconds — helps others choose with confidence" : "Kb. 20 másodperc — minden visszajelzést személyesen elolvasunk"}
                    </p>
                </div>

                <div className="inline-grid grid-cols-2 p-1 rounded-xl bg-white/[0.04] border border-white/10 shrink-0">
                    <button
                        type="button"
                        onClick={() => setMode("quick")}
                        className={cn(
                            "flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                            mode === "quick"
                                ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold"
                                : "text-white/60 hover:text-white"
                        )}
                    >
                        <Star className="h-3.5 w-3.5" />
                        <span>{isEn ? "Quick Rating" : "Gyors értékelés"}</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("chat")}
                        className={cn(
                            "flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                            mode === "chat"
                                ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold"
                                : "text-white/60 hover:text-white"
                        )}
                    >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>{isEn ? "Alvin AI" : "Alvin Chat"}</span>
                    </button>
                </div>
            </div>

            {mode === "quick" ? (
                quickDone ? (
                    <div className="p-8 sm:p-10 text-center space-y-4">
                        <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">
                            {isEn ? "Thank you for your review!" : "Köszönjük az értékelést!"}
                        </h3>
                        <p className="text-sm text-white/60 max-w-md mx-auto">
                            {isEn
                                ? "Your feedback has been logged and our team will reply by email shortly."
                                : "Visszajelzésed beérkezett, csapatunk hamarosan reagál rá e-mailben is."}
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => { setQuickDone(false); setQuickName(""); setQuickEmail(""); setQuickText(""); setRating(5); setEmailTouched(false) }}
                            className="rounded-xl border-white/15 bg-white/5 hover:bg-white/10 text-white"
                        >
                            <Sparkles className="mr-2 h-4 w-4 text-cyan-400" />
                            {isEn ? "Send another review" : "Új vélemény írása"}
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleQuickSubmit} className="p-5 sm:p-6 space-y-4">
                        {/* Interactive Star Picker */}
                        <div className="flex items-center justify-between flex-wrap gap-2 p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
                            <span className="text-xs font-bold text-white/75">
                                {isEn ? "How satisfied were you?" : "Mennyire voltál elégedett?"}
                            </span>
                            <div className="flex items-center gap-1.5">
                                {[1, 2, 3, 4, 5].map((star) => {
                                    const active = star <= (hoverRating || rating)
                                    return (
                                        <button
                                            key={star}
                                            type="button"
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setRating(star)}
                                            aria-label={`${star} star`}
                                            className="p-0.5 transition-transform hover:scale-110 cursor-pointer"
                                        >
                                            <Star
                                                className={cn(
                                                    "h-6 w-6 transition-colors",
                                                    active ? "fill-cyan-400 text-cyan-400" : "text-white/20"
                                                )}
                                            />
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3">
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
                                <Input
                                    required
                                    value={quickName}
                                    onChange={(e) => setQuickName(e.target.value)}
                                    placeholder={isEn ? "Your name *" : "Neved *"}
                                    className="h-11 pl-10 bg-white/[0.03] border-white/10 focus:border-cyan-400 rounded-xl text-white placeholder:text-white/30"
                                />
                            </div>
                            <div>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
                                    <Input
                                        required
                                        type="email"
                                        value={quickEmail}
                                        onBlur={() => setEmailTouched(true)}
                                        onChange={(e) => setQuickEmail(e.target.value)}
                                        placeholder={t("placeholder_email")}
                                        className={cn(
                                            "h-11 pl-10 bg-white/[0.03] rounded-xl text-white placeholder:text-white/30",
                                            emailTouched && quickEmail && !isQuickEmailValid
                                                ? "border-red-500/60 focus:border-red-400"
                                                : "border-white/10 focus:border-cyan-400"
                                        )}
                                    />
                                </div>
                                {emailTouched && quickEmail && !isQuickEmailValid && (
                                    <p className="text-[11px] text-red-400 mt-1">
                                        {isEn ? "Please enter a valid email address." : "Kérjük, érvényes e-mail címet adj meg."}
                                    </p>
                                )}
                            </div>
                        </div>

                        <Textarea
                            required
                            value={quickText}
                            onChange={(e) => setQuickText(e.target.value)}
                            placeholder={isEn ? "Tell us how we helped your business or what we can improve..." : "Írd le röviden, miben segítettünk vagy min javíthatnánk..."}
                            className="min-h-[100px] bg-white/[0.03] border-white/10 focus:border-cyan-400 rounded-xl text-white placeholder:text-white/30 text-sm resize-none"
                        />

                        <Button
                            type="submit"
                            disabled={quickLoading}
                            className="w-full h-11 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black tracking-wide shadow-[0_0_25px_rgba(6,182,212,0.3)]"
                        >
                            {quickLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {isEn ? "Sending..." : "Küldés folyamatban..."}
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    {isEn ? "Submit Review" : "Vélemény elküldése"}
                                </>
                            )}
                        </Button>
                    </form>
                )
            ) : (
                /* AI Chat Mode (compact height, no autoFocus scroll jump, real validation) */
                <div className="flex flex-col h-[400px]">
                    <div className="px-4 py-2.5 border-b border-white/10 bg-white/[0.02] flex items-center gap-2.5">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden border border-cyan-400/50 bg-slate-950 shrink-0">
                            <Image src="/alvin-avatar.png" alt="Alvin" fill className="object-cover" unoptimized />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">Alvin</span>
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                {t("status_online")}
                            </span>
                        </div>
                    </div>

                    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                        <div className="space-y-3.5">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                                >
                                    <Avatar className="h-7 w-7 shrink-0">
                                        {msg.role === "bot" ? (
                                            <div className="relative h-full w-full rounded-full overflow-hidden border border-cyan-400/40 bg-slate-950">
                                                <Image src="/alvin-avatar.png" alt="Alvin" fill className="object-cover" unoptimized />
                                            </div>
                                        ) : (
                                            <div className="h-full w-full bg-cyan-500/20 flex items-center justify-center rounded-full">
                                                <User className="h-3.5 w-3.5 text-cyan-300" />
                                            </div>
                                        )}
                                    </Avatar>
                                    <div
                                        className={cn(
                                            "rounded-2xl px-3.5 py-2 max-w-[82%] text-xs sm:text-sm leading-relaxed",
                                            msg.role === "bot"
                                                ? "bg-white/[0.06] border border-white/10 text-white/90 rounded-tl-none"
                                                : "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-semibold rounded-tr-none"
                                        )}
                                    >
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex gap-2.5">
                                    <Avatar className="h-7 w-7 shrink-0">
                                        <div className="relative h-full w-full rounded-full overflow-hidden border border-cyan-400/40 bg-slate-950">
                                            <Image src="/alvin-avatar.png" alt="Alvin" fill className="object-cover" unoptimized />
                                        </div>
                                    </Avatar>
                                    <div className="bg-white/[0.06] border border-white/10 rounded-2xl rounded-tl-none px-3.5 py-2.5 flex items-center gap-1">
                                        <span className="h-1.5 w-1.5 bg-cyan-400/70 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="h-1.5 w-1.5 bg-cyan-400/70 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="h-1.5 w-1.5 bg-cyan-400/70 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    <div className="p-3 border-t border-white/10 bg-white/[0.02]">
                        <div className="flex w-full gap-2">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={step === "email" ? t("placeholder_email") : t("placeholder_text")}
                                disabled={step === "done" || isTyping}
                                className="flex-1 h-10 bg-white/[0.04] border-white/10 focus:border-cyan-400 rounded-xl text-white text-sm placeholder:text-white/35"
                            />
                            <Button
                                type="button"
                                onClick={handleChatSend}
                                disabled={!inputValue.trim() || step === "done" || isTyping}
                                size="icon"
                                className="h-10 w-10 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 hover:from-cyan-300 hover:to-blue-500"
                            >
                                {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
