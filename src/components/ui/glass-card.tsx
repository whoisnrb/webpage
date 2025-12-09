import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    intensity?: "low" | "medium" | "high";
    hoverEffect?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ children, className, intensity = "medium", hoverEffect = true, ...props }, ref) => {
        const blurIntensity = {
            low: "backdrop-blur-sm bg-white/5 dark:bg-black/5",
            medium: "backdrop-blur-md bg-white/10 dark:bg-black/10",
            high: "backdrop-blur-xl bg-white/20 dark:bg-black/20",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-xl border border-white/20 dark:border-white/10 shadow-xl overflow-hidden transition-all duration-300",
                    blurIntensity[intensity],
                    hoverEffect && "hover:scale-[1.02] hover:shadow-2xl hover:bg-white/15 dark:hover:bg-black/15",
                    className
                )}
                {...props}
            >
                {/* Noise texture overlay for texture */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

                {/* Shine effect on top border */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />

                <div className="relative z-10">
                    {children}
                </div>
            </div>
        );
    }
);

GlassCard.displayName = "GlassCard";
