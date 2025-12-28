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
import { useTranslations } from "next-intl"
import { PriceDisplay } from "@/components/price-display"
import { Link } from "@/i18n/routing"

export default function CheckoutPage() {
    const t = useTranslations('Checkout')
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
            toast.error(t('error_waiver'))
            return
        }

        if (items.length === 0) {
            toast.error(t('error_empty'))
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
                toast.error(t('error_payment') + (data.error || "Ismeretlen hiba"))
            }
        } catch (error) {
            toast.error(t('error_generic'))
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold mb-4">{t('empty_cart')}</h1>
                <Button onClick={() => router.push("/")}>{t('back_to_home')}</Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12 md:py-16">
            <h1 className="text-3xl font-bold mb-8 text-center">{t('title')}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Order Summary */}
                <div className="space-y-6">
                    <Card className="p-6 bg-muted/30">
                        <h2 className="text-xl font-semibold mb-4">{t('summary_title')}</h2>
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={`${item.id}-${item.license}`} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-muted-foreground capitalize">{item.license} license</p>
                                    </div>
                                    <PriceDisplay amount={item.price} className="font-medium" />
                                </div>
                            ))}
                            <div className="pt-4 border-t flex justify-between items-center text-lg font-bold">
                                <span>{t('total_label')}</span>
                                <PriceDisplay amount={total} />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                {t('vat_included')}
                            </p>
                        </div>
                    </Card>
                </div>

                {/* Checkout Form */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-6">{t('billing_title')}</h2>
                        <form onSubmit={handlePayment} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">{t('name_label')}</Label>
                                <Input
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder={t('name_placeholder')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">{t('email_label')}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder={t('email_placeholder')}
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
                                            {t('waiver_label')}
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            {t('waiver_subtext')}
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
                                            {t.rich('terms_label', {
                                                link1: (chunks) => <Link href="/aszf" target="_blank" className="text-primary hover:underline">{chunks}</Link>,
                                                link2: (chunks) => <Link href="/adatvedelem" target="_blank" className="text-primary hover:underline">{chunks}</Link>
                                            })}
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="w-full" size="lg" disabled={isLoading || !waiverAccepted || !termsAccepted}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t('checkout_loading')}
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="mr-2 h-4 w-4" />
                                        {t('pay_with_simplepay')}
                                    </>
                                )}
                            </Button>

                            <div className="flex justify-center gap-4 mt-4 opacity-70 grayscale hover:grayscale-0 transition-all">
                                {/* SimplePay logo placeholder or text */}
                                <span className="text-xs text-muted-foreground">{t('secure_payment_desc')}</span>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    )
}
