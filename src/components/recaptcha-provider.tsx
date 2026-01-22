"use client";

import Script from "next/script";
import { createContext, useContext, useCallback } from "react";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

interface RecaptchaContextType {
    executeRecaptcha: (action: string) => Promise<string | null>;
    siteKey: string;
}

const RecaptchaContext = createContext<RecaptchaContextType | null>(null);

export function RecaptchaProvider({ children }: { children: React.ReactNode }) {
    const executeRecaptcha = useCallback(async (action: string): Promise<string | null> => {
        try {
            if (typeof window === "undefined" || !(window as any).grecaptcha) {
                console.warn("reCAPTCHA not loaded yet");
                return null;
            }

            await (window as any).grecaptcha.ready(() => { });

            const token = await (window as any).grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
            return token;
        } catch (error) {
            console.error("reCAPTCHA execution error:", error);
            return null;
        }
    }, []);

    return (
        <RecaptchaContext.Provider value={{ executeRecaptcha, siteKey: RECAPTCHA_SITE_KEY }}>
            <Script
                src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
                strategy="afterInteractive"
            />
            {children}
        </RecaptchaContext.Provider>
    );
}

export function useRecaptcha() {
    const context = useContext(RecaptchaContext);
    if (!context) {
        throw new Error("useRecaptcha must be used within RecaptchaProvider");
    }
    return context;
}
