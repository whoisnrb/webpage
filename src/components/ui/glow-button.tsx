"use client"

import * as React from "react"
import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface GlowButtonProps extends ButtonProps {
    glowColor?: string
}

export const GlowButton = React.forwardRef<HTMLButtonElement, GlowButtonProps>(
    ({ className, glowColor = "rgba(124, 58, 237, 0.5)", children, ...props }, ref) => {
        return (
            <div className="relative group">
                <div
                    className="absolute -inset-0.5 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"
                    style={{ background: `linear-gradient(to right, ${glowColor}, ${glowColor})` }}
                ></div>
                <Button
                    ref={ref}
                    className={cn("relative", className)}
                    {...props}
                >
                    {children}
                </Button>
            </div>
        )
    }
)
GlowButton.displayName = "GlowButton"
