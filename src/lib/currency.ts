export type CurrencyCode = 'HUF' | 'EUR' | 'USD' | 'GBP';

export interface Currency {
    code: CurrencyCode;
    symbol: string;
    rate: number; // Rate relative to baseline (HUF)
    label: string;
}

// Default baseline rates (HUF is 1.0)
// In production, these are replaced by live data from the API in CurrencyProvider
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

export function formatPrice(amount: number, currencyCode: CurrencyCode, locale?: string): string {
    const rounded = Math.ceil(amount);
    const resolvedLocale = locale || (currencyCode === 'HUF' ? 'hu-HU' : (currencyCode === 'GBP' ? 'en-GB' : 'en-US'));
    return new Intl.NumberFormat(resolvedLocale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(rounded);
}
