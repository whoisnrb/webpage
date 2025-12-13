"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"; // Assuming standard UI button exists
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
    value: string;
}

export function CopyButton({ value }: CopyButtonProps) {
    const [hasCopied, setHasCopied] = useState(false);

    const onCopy = () => {
        navigator.clipboard.writeText(value);
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2000);
    };

    return (
        <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground hover:bg-transparent hover:text-foreground"
            onClick={onCopy}
        >
            {hasCopied ? (
                <Check className="h-4 w-4 text-green-500" />
            ) : (
                <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">Copy</span>
        </Button>
    );
}
