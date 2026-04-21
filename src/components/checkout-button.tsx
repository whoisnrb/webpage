"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { createCheckoutSession } from "@/app/actions/stripe-checkout"
import { Loader2, ArrowRight } from "lucide-react"

interface CheckoutButtonProps {
    serviceName: string
    price: number
    currency: string
    className?: string
    children: React.ReactNode
}

export function CheckoutButton({ serviceName, price, currency, className, children }: CheckoutButtonProps) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    const handleCheckout = () => {
        startTransition(async () => {
            setError(null)
            const result = await createCheckoutSession({
                serviceName,
                price,
                currency
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
