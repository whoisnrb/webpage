"use client"

import { useState } from "react"
import { useCart } from "@/components/ecommerce/cart-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Loader2, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
    const { items, total } = useCart()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [waiverAccepted, setWaiverAccepted] = useState(false)
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
    })

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!waiverAccepted) {
            toast.error("A vásárlás folytatásához el kell fogadnia a lemondó nyilatkozatot.")
            return
        }

        if (items.length === 0) {
            toast.error("A kosara üres.")
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch("/api/payment/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    packageName: items.map(i => i.name).join(", "),
                    amount: total,
                    customerEmail: formData.email,
                    customerName: formData.name,
                    paymentMethod: "SIMPLEPAY"
                }),
            })

            const data = await response.json()

            if (data.success && data.paymentUrl) {
                window.location.href = data.paymentUrl
            } else {
                toast.error("Hiba történt a fizetés indításakor: " + (data.error || "Ismeretlen hiba"))
            }
        } catch (error) {
            toast.error("Váratlan hiba történt.")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold mb-4">A kosara üres</h1>
                <Button onClick={() => router.push("/")}>Vissza a főoldalra</Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12 md:py-16">
            <h1 className="text-3xl font-bold mb-8 text-center">Pénztár</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Order Summary */}
                <div className="space-y-6">
                    <Card className="p-6 bg-muted/30">
                        <h2 className="text-xl font-semibold mb-4">Rendelés összesítése</h2>
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={`${item.id}-${item.license}`} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-muted-foreground capitalize">{item.license} licenc</p>
                                    </div>
                                    <p className="font-medium">{item.price.toLocaleString()} Ft</p>
                                </div>
                            ))}
                            <div className="pt-4 border-t flex justify-between items-center text-lg font-bold">
                                <span>Összesen:</span>
                                <span>{total.toLocaleString()} Ft</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Az árak tartalmazzák az ÁFA-t (ha alkalmazandó).
                            </p>
                        </div>
                    </Card>
                </div>

                {/* Checkout Form */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-6">Számlázási adatok</h2>
                        <form onSubmit={handlePayment} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Teljes név / Cégnév</Label>
                                <Input
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Kovács János"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email cím</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="janos@example.com"
                                />
                            </div>

                            <div className="pt-4 border-t space-y-4">
                                <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg border border-primary/20">
                                    <Checkbox
                                        id="waiver"
                                        checked={waiverAccepted}
                                        onCheckedChange={(checked) => setWaiverAccepted(checked as boolean)}
                                        className="mt-1"
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label
                                            htmlFor="waiver"
                                            className="text-sm font-medium leading-normal cursor-pointer"
                                        >
                                            Tudomásul veszem, hogy a teljesítés megkezdésével (a digitális tartalom letöltésével vagy hozzáférhetővé tételével) elveszítem a 14 napos elállási jogomat.
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            A vásárlás folytatásához el kell fogadnia ezt a nyilatkozatot, mivel digitális terméket vásárol.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Checkbox
                                        id="terms"
                                        checked={termsAccepted}
                                        onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label
                                            htmlFor="terms"
                                            className="text-sm font-medium leading-none cursor-pointer"
                                        >
                                            Elfogadom az <a href="/aszf" target="_blank" className="text-primary hover:underline">Általános Szerződési Feltételeket</a> és az <a href="/adatvedelem" target="_blank" className="text-primary hover:underline">Adatkezelési Tájékoztatót</a>.
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="w-full" size="lg" disabled={isLoading || !waiverAccepted || !termsAccepted}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Fizetés indítása...
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="mr-2 h-4 w-4" />
                                        Fizetés SimplePay-vel
                                    </>
                                )}
                            </Button>

                            <div className="flex justify-center gap-4 mt-4 opacity-70 grayscale hover:grayscale-0 transition-all">
                                {/* SimplePay logo placeholder or text */}
                                <span className="text-xs text-muted-foreground">Biztonságos fizetés SimplePay rendszeren keresztül.</span>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    )
}
