"use client"

import { useCurrency } from "./currency-provider"
import { formatPrice, CurrencyCode } from "@/lib/currency"
import { cn } from "@/lib/utils"

interface PriceDisplayProps {
    amount: number;
    baseCurrency?: CurrencyCode;
    className?: string;
}

export function PriceDisplay({ amount, baseCurrency = 'HUF', className }: PriceDisplayProps) {
    const { currency, rates } = useCurrency();

    // Dynamic conversion using live rates from context
    const convertWithLiveRates = (val: number, from: CurrencyCode, to: CurrencyCode) => {
        if (from === to) return val;
        // Amount / rate of 'from' gives value in HUF base, then multiply by 'to' rate
        const amountInBase = val / (rates[from] || 1);
        return amountInBase * (rates[to] || 1);
    };

    const convertedAmount = convertWithLiveRates(amount, baseCurrency, currency);
    const formatted = formatPrice(convertedAmount, currency);

    return (
        <span className={cn("font-bold tracking-tight text-foreground", className)}>
            {formatted}
        </span>
    );
}
