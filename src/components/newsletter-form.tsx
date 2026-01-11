"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Mail, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"

export function NewsletterForm() {
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const t = useTranslations("Newsletter")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setStatus("loading")

        try {
            const response = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Newsletter submission failed:", errorData);
                throw new Error("Failed to subscribe");
            }

            setStatus("success")
            setEmail("")

            setTimeout(() => setStatus("idle"), 3000)
        } catch (error) {
            console.error(error)
            setStatus("error")
            setTimeout(() => setStatus("idle"), 3000)
        }
    }

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                {status === "success" ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 text-emerald-500 text-sm font-medium"
                    >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{t("success")}</span>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                                <Input
                                    type="email"
                                    placeholder={t("placeholder")}
                                    className="h-11 pl-9 bg-transparent border-white/20 focus:border-primary rounded-lg text-white text-sm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={status === "loading"}
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={status === "loading"}
                                className="h-11 px-6 bg-cyan-400 hover:bg-cyan-500 text-black font-bold rounded-lg transition-colors"
                            >
                                {status === "loading" ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    t("button")
                                )}
                            </Button>
                        </div>
                        <p className="text-[11px] text-white/40 leading-tight">
                            {t("description")}
                        </p>
                        {status === "error" && (
                            <p className="text-[11px] text-red-400">{t("error")}</p>
                        )}
                    </form>
                )}
            </AnimatePresence>
        </div>
    )
}
