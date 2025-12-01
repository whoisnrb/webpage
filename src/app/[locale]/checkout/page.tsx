"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, CreditCard, Lock, Loader2 } from "lucide-react"

import { useCart } from "@/components/ecommerce/cart-provider"

function CheckoutContent() {
    const searchParams = useSearchParams()
    const { items, total, clearCart } = useCart()
    const [loading, setLoading] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        taxNumber: "",
        zipCode: "",
        city: "",
        address: "",
    })

    const [paymentMethod, setPaymentMethod] = useState<'SIMPLEPAY' | 'TRANSFER' | 'PAYPAL'>('TRANSFER')

    // If cart is empty, redirect or show message (handled in render)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handlePayment = async () => {
        // Validáció
        if (!formData.firstName || !formData.lastName || !formData.email) {
            alert('Kérlek töltsd ki a kötelező mezőket!')
            return
        }

        // Email validáció
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            alert('Kérlek adj meg egy érvényes email címet!')
            return
        }

        if (items.length === 0) {
            alert('A kosarad üres!')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/payment/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    packageName: `Rendelés: ${items.map(i => i.name).join(', ')}`, // Summary of items
                    amount: total, // Use cart total
                    customerEmail: formData.email.trim(),
                    customerName: `${formData.lastName} ${formData.firstName}`.trim(),
                    items: items, // Pass full items if API supports it (optional for now)
                    paymentMethod: paymentMethod // Add payment method
                }),
            })

            const data = await response.json()

            if (data.success && data.paymentUrl) {
                // Átirányítás SimplePay fizetési oldalra
                window.location.href = data.paymentUrl
            } else {
                console.error('Payment error:', data)
                alert(`Hiba történt: ${data.message || data.error || 'Ismeretlen hiba'}`)
            }
        } catch (error) {
            console.error('Payment error:', error)
            alert('Hiba történt a fizetés indításakor. Ellenőrizd a konzolt a részletekért.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1 bg-muted/30 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-8 text-center">Pénztár</h1>

                    <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Form Section */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Contact Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">1</span>
                                        Kapcsolattartási adatok
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Vezetéknév *</label>
                                                <Input
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    placeholder="Kovács"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Keresztnév *</label>
                                                <Input
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    placeholder="János"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Email cím *</label>
                                            <Input
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="janos@ceg.hu"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Telefonszám</label>
                                            <Input
                                                name="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="+36 30 123 4567"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Billing Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">2</span>
                                        Számlázási adatok
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Cégnév (opcionális)</label>
                                            <Input
                                                name="company"
                                                value={formData.company}
                                                onChange={handleInputChange}
                                                placeholder="Minta Kft."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Adószám (opcionális)</label>
                                            <Input
                                                name="taxNumber"
                                                value={formData.taxNumber}
                                                onChange={handleInputChange}
                                                placeholder="12345678-1-42"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Irányítószám</label>
                                                <Input
                                                    name="zipCode"
                                                    value={formData.zipCode}
                                                    onChange={handleInputChange}
                                                    placeholder="1052"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Város</label>
                                                <Input
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    placeholder="Budapest"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Utca, házszám</label>
                                            <Input
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                placeholder="Fő utca 1."
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">3</span>
                                        Fizetés
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {/* Payment Method Selection */}
                                        <div className="space-y-3">
                                            <label className="text-sm font-medium">Válassz fizetési módot:</label>

                                            <div
                                                className="p-4 border rounded-lg flex items-center gap-4 opacity-60 cursor-not-allowed bg-muted/20"
                                            >
                                                <div className="h-4 w-4 rounded-full border border-muted-foreground flex items-center justify-center">
                                                </div>
                                                <CreditCard className="h-6 w-6 text-muted-foreground" />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-muted-foreground">Bankkártya (SimplePay)</p>
                                                        <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold uppercase">Hamarosan</span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Azonnali, biztonságos fizetés</p>
                                                </div>
                                            </div>

                                            <div
                                                className={`p-4 border rounded-lg flex items-center gap-4 cursor-pointer transition-colors ${paymentMethod === 'TRANSFER' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted/50'}`}
                                                onClick={() => setPaymentMethod('TRANSFER')}
                                            >
                                                <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${paymentMethod === 'TRANSFER' ? 'border-primary' : 'border-muted-foreground'}`}>
                                                    {paymentMethod === 'TRANSFER' && <div className="h-2 w-2 rounded-full bg-primary" />}
                                                </div>
                                                <div className="h-6 w-6 flex items-center justify-center bg-muted rounded text-xs font-bold text-muted-foreground">
                                                    UT
                                                </div>
                                                <div>
                                                    <p className="font-medium">Előre utalás</p>
                                                    <p className="text-xs text-muted-foreground">Díjbekérő alapján</p>
                                                </div>
                                            </div>

                                            <div
                                                className={`p-4 border rounded-lg flex items-center gap-4 cursor-pointer transition-colors ${paymentMethod === 'PAYPAL' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted/50'}`}
                                                onClick={() => setPaymentMethod('PAYPAL')}
                                            >
                                                <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${paymentMethod === 'PAYPAL' ? 'border-primary' : 'border-muted-foreground'}`}>
                                                    {paymentMethod === 'PAYPAL' && <div className="h-2 w-2 rounded-full bg-primary" />}
                                                </div>
                                                <div className="h-6 w-6 flex items-center justify-center bg-[#003087] rounded text-xs font-bold text-white">
                                                    PP
                                                </div>
                                                <div>
                                                    <p className="font-medium">PayPal</p>
                                                    <p className="text-xs text-muted-foreground">Nemzetközi fizetés</p>
                                                </div>
                                            </div>
                                        </div>

                                        {paymentMethod === 'SIMPLEPAY' && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center py-2">
                                                <Lock className="h-4 w-4" />
                                                A fizetés titkosított csatornán zajlik SimplePay rendszerén keresztül.
                                            </div>
                                        )}

                                        <Button
                                            className="w-full bg-accent hover:bg-accent/90 text-white font-bold"
                                            onClick={handlePayment}
                                            disabled={loading || items.length === 0}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Feldolgozás...
                                                </>
                                            ) : (
                                                paymentMethod === 'SIMPLEPAY'
                                                    ? `Fizetés indítása (${new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(total)})`
                                                    : `Rendelés leadása (${new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(total)})`
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-24">
                                <CardHeader>
                                    <CardTitle>Rendelés összesítése</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {items.map((item) => (
                                            <div key={`${item.id}-${item.license}`} className="flex justify-between text-sm border-b pb-2 last:border-0 last:pb-0">
                                                <div className="flex-1 pr-4">
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-xs text-muted-foreground capitalize">{item.license} licenc (x{item.quantity})</p>
                                                </div>
                                                <p className="font-semibold whitespace-nowrap">
                                                    {new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        ))}

                                        {items.length === 0 && (
                                            <p className="text-sm text-muted-foreground text-center py-4">A kosarad üres.</p>
                                        )}

                                        <div className="border-t pt-4 flex justify-between font-bold text-lg">
                                            <span>Összesen</span>
                                            <span>{new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(total)}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground text-center">
                                            Alanyi adómentes (AAM) - A feltüntetett árak a fizetendő végösszegek.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    )
}
