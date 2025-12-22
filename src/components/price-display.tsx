"use client"

import { useCurrency } from "./currency-provider"
import { convertPrice, formatPrice, CurrencyCode } from "@/lib/currency"
import { cn } from "@/lib/utils"

interface PriceDisplayProps {
    amount: number;
    baseCurrency?: CurrencyCode;
    className?: string;
}

export function PriceDisplay({ amount, baseCurrency = 'HUF', className }: PriceDisplayProps) {
    const { currency } = useCurrency();
    const convertedAmount = convertPrice(amount, baseCurrency, currency);
    const formatted = formatPrice(convertedAmount, currency);

    return (
        <span className={cn("font-bold tracking-tight", className)}>
            {formatted}
        </span>
    );
}
