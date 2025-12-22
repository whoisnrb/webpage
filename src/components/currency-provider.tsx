"use client"

import * as React from "react"
import { CurrencyCode, CURRENCIES } from "@/lib/currency"

interface CurrencyContextType {
    currency: CurrencyCode;
    setCurrency: (code: CurrencyCode) => void;
}

const CurrencyContext = React.createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrencyState] = React.useState<CurrencyCode>('HUF');

    // Load from localStorage on mount
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
        <CurrencyContext.Provider value={{ currency, setCurrency }}>
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
