"use client"

import { useState } from "react"
import { X } from "lucide-react"

export function PromoBanner() {
    const [isVisible, setIsVisible] = useState(true)

    if (!isVisible) return null

    return (
        <div className="bg-primary px-4 py-3 text-white">
            <div className="container mx-auto flex items-center justify-between text-sm font-medium">
                <p className="text-center flex-1">
                    🚀 Indulási akció: Használd a <span className="font-bold">START2026</span> kódot 20% kedvezményért!
                </p>
                <button
                    onClick={() => setIsVisible(false)}
                    className="text-white/80 hover:text-white transition-colors"
                    aria-label="Bezárás"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}
