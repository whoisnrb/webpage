"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, FileText, Loader2, CheckCircle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function LeadMagnet() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
        }

        try {
            const response = await fetch("/api/lead-magnet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "Hiba történt")
            }

            setIsSuccess(true)
            toast.success(result.message)
        } catch (error) {
            toast.error("Hiba történt a feliratkozás során. Kérlek próbáld újra.")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="py-16 md:py-24 bg-primary text-primary-foreground relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
            </div>

            <div className="container relative mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1 text-center lg:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Kezdd el az automatizálást még ma!
                        </h2>
                        <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto lg:mx-0">
                            Töltsd le ingyenes &quot;Automation Starter Pack&quot; csomagunkat, ami 10 azonnal használható scriptet tartalmaz vállalkozásod felgyorsítására.
                        </p>
                        <ul className="space-y-3 mb-8 text-left inline-block">
                            <li className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-secondary" />
                                <span>10 db Python & Node.js script</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-secondary" />
                                <span>Telepítési útmutatók magyarul</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-secondary" />
                                <span>Videós segédlet</span>
                            </li>
                        </ul>
                    </div>

                    <div className="flex-1 w-full max-w-md bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
                        {isSuccess ? (
                            <div className="text-center py-12 space-y-4">
                                <div className="h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle className="h-8 w-8 text-green-400" />
                                </div>
                                <h3 className="text-2xl font-bold">Sikeres feliratkozás!</h3>
                                <p className="text-primary-foreground/80">
                                    Hamarosan küldjük az anyagot a megadott e-mail címre.
                                </p>
                                <Button
                                    variant="outline"
                                    className="mt-4 border-white/20 text-white hover:bg-white/10 hover:text-white"
                                    onClick={() => setIsSuccess(false)}
                                >
                                    Új feliratkozás
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium mb-1">Név</label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="Kovács János"
                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-1">E-mail cím</label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="janos@ceg.hu"
                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full bg-accent hover:bg-accent/90 text-white font-bold"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Feldolgozás...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="mr-2 h-4 w-4" />
                                            Letöltés Ingyen
                                        </>
                                    )}
                                </Button>
                                <p className="text-xs text-center text-primary-foreground/60">
                                    Az adataidat bizalmasan kezeljük. Nincs spam.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
