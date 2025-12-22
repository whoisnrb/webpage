"use client"

import * as React from "react"
import { CurrencyCode, CURRENCIES } from "@/lib/currency"

interface CurrencyContextType {
    currency: CurrencyCode;
    setCurrency: (code: CurrencyCode) => void;
    rates: Record<CurrencyCode, number>;
    isLoading: boolean;
}

const CurrencyContext = React.createContext<CurrencyContextType | undefined>(undefined);

// Fallback rates if API fails
const FALLBACK_RATES: Record<CurrencyCode, number> = {
    HUF: 1,
    EUR: 0.0025,
    USD: 0.0027,
    GBP: 0.0021,
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrencyState] = React.useState<CurrencyCode>('HUF');
    const [rates, setRates] = React.useState<Record<CurrencyCode, number>>(FALLBACK_RATES);
    const [isLoading, setIsLoading] = React.useState(true);

    // Fetch live rates
    React.useEffect(() => {
        async function fetchRates() {
            try {
                // Using a free, reliable public API (no key required for basic usage)
                const response = await fetch('https://open.er-api.com/v6/latest/HUF');
                const data = await response.json();

                if (data && data.rates) {
                    const newRates: Record<CurrencyCode, number> = {
                        HUF: 1,
                        EUR: data.rates.EUR || FALLBACK_RATES.EUR,
                        USD: data.rates.USD || FALLBACK_RATES.USD,
                        GBP: data.rates.GBP || FALLBACK_RATES.GBP,
                    };
                    setRates(newRates);
                    console.log('Live currency rates updated:', newRates);
                }
            } catch (error) {
                console.error('Failed to fetch live currency rates:', error);
                // Keep fallback rates
            } finally {
                setIsLoading(false);
            }
        }

        fetchRates();

        // Refresh every hour
        const interval = setInterval(fetchRates, 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Load saved currency from localStorage on mount
    React.useEffect(() => {
        const saved = localStorage.getItem('user-currency') as CurrencyCode;
        if (saved && CURRENCIES[saved]) {
            setCurrencyState(saved);
        }
    }, []);

    const setCurrency = (code: CurrencyCode) => {
        setCurrencyState(code);
        localStorage.setItem('user-currency', code);
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, rates, isLoading }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = React.useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
