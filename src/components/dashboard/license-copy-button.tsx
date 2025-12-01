"use client"

import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface LicenseCopyButtonProps {
    licenseKey: string
}

export function LicenseCopyButton({ licenseKey }: LicenseCopyButtonProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(licenseKey)
            setCopied(true)
            toast.success("Licenc kulcs másolva!")
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            toast.error("Nem sikerült másolni a kulcsot.")
        }
    }

    return (
        <Button variant="ghost" size="icon" onClick={handleCopy}>
            {copied ? (
                <Check className="h-4 w-4 text-green-500" />
            ) : (
                <Copy className="h-4 w-4 text-muted-foreground" />
            )}
        </Button>
    )
}
