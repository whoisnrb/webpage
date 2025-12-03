"use client";

import TurnstileWidget from "react-turnstile";

interface TurnstileProps {
    onVerify: (token: string) => void;
}

export function Turnstile({ onVerify }: TurnstileProps) {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    if (!siteKey) {
        console.warn("Turnstile site key is missing");
        return null;
    }

    return (
        <div className="w-full flex justify-center my-4">
            <TurnstileWidget
                sitekey={siteKey}
                onVerify={onVerify}
                theme="dark"
            />
        </div>
    );
}
