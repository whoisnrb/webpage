"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { createCheckoutSession } from "@/app/actions/stripe-checkout"
import { Loader2 } from "lucide-react"
import { useCurrency } from "@/components/currency-provider"
import { CurrencyCode } from "@/lib/currency"

interface CheckoutButtonProps {
    serviceName: string
    price: number
    currency?: string
    baseCurrency?: CurrencyCode
    className?: string
    children: React.ReactNode
}

export function CheckoutButton({ 
    serviceName, 
    price, 
    currency: propCurrency, 
    baseCurrency = 'HUF',
    className, 
    children 
}: CheckoutButtonProps) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const { currency: contextCurrency, rates } = useCurrency()

    const activeCurrency = ((propCurrency || contextCurrency) as CurrencyCode) || 'HUF'

    const handleCheckout = () => {
        startTransition(async () => {
            setError(null)

            // Convert base price (default HUF) to active target currency (e.g. EUR, USD, GBP, HUF)
            const finalPrice = activeCurrency === baseCurrency
                ? price
                : Math.ceil((price / (rates[baseCurrency] || 1)) * (rates[activeCurrency] || 0.0025))

            const result = await createCheckoutSession({
                serviceName,
                price: finalPrice,
                currency: activeCurrency
            })

            if (result.error) {
                setError(result.error)
                return
            }

            if (result.url) {
                window.location.href = result.url
            }
        })
    }

    return (
        <div className="w-full">
            <Button
                onClick={handleCheckout}
                disabled={isPending}
                className={className}
            >
                {isPending ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : null}
                {children}
            </Button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    )
}
