export type CurrencyCode = 'HUF' | 'EUR' | 'USD' | 'GBP';

export interface Currency {
    code: CurrencyCode;
    symbol: string;
    rate: number; // Rate relative to baseline (HUF)
    label: string;
}

export const CURRENCIES: Record<CurrencyCode, Currency> = {
    HUF: { code: 'HUF', symbol: 'Ft', rate: 1, label: 'Forint' },
    EUR: { code: 'EUR', symbol: '€', rate: 0.0025, label: 'Euro' },
    USD: { code: 'USD', symbol: '$', rate: 0.0027, label: 'US Dollar' },
    GBP: { code: 'GBP', symbol: '£', rate: 0.0021, label: 'British Pound' },
};

export function convertPrice(amount: number, from: CurrencyCode, to: CurrencyCode): number {
    if (from === to) return amount;
    const amountInHuf = amount / CURRENCIES[from].rate;
    return amountInHuf * CURRENCIES[to].rate;
}

export function formatPrice(amount: number, currencyCode: CurrencyCode, locale: string = 'hu-HU'): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: currencyCode === 'HUF' ? 0 : 2,
        maximumFractionDigits: currencyCode === 'HUF' ? 0 : 2,
    }).format(amount);
}
