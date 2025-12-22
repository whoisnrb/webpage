import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatPrice(
    price: number,
    options: {
        currency?: "USD" | "EUR" | "HUF"
        notation?: Intl.NumberFormatOptions["notation"]
    } = {}
) {
    const { currency = "USD", notation = "standard" } = options

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        notation,
        maximumFractionDigits: currency === "HUF" ? 0 : 2,
    }).format(price)
}

export function formatDate(date: Date | string) {
    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date))
}

export function absoluteUrl(path: string) {
    return `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${path}`
}
