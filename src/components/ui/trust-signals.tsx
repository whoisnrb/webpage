
import { ShieldCheck, Lock, Award } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

interface TrustSignalsProps {
    className?: string
    orientation?: "horizontal" | "vertical"
    size?: "sm" | "md" | "lg"
    variant?: "default" | "minimal"
}

export function TrustSignals({
    className,
    orientation = "horizontal",
    size = "md",
    variant = "default"
}: TrustSignalsProps) {
    const t = useTranslations('TrustSignals')

    const signals = [
        {
            icon: Lock,
            title: t('ssl_title'),
            description: t('ssl_desc'),
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10",
        },
        {
            icon: ShieldCheck,
            title: t('gdpr_title'),
            description: t('gdpr_desc'),
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
        },
        {
            icon: Award,
            title: t('experts_title'),
            description: t('experts_desc'),
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
        }
    ]

    const sizeClasses = {
        sm: { icon: "h-4 w-4", text: "text-xs", title: "text-xs font-semibold" },
        md: { icon: "h-5 w-5", text: "text-sm", title: "text-sm font-semibold" },
        lg: { icon: "h-6 w-6", text: "text-base", title: "text-base font-bold" },
    }

    if (variant === "minimal") {
        return (
            <div className={cn(
                "flex gap-4 flex-wrap",
                orientation === "vertical" ? "flex-col" : "flex-row items-center",
                className
            )}>
                {signals.map((signal, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-muted-foreground" title={signal.description}>
                        <signal.icon className={cn(sizeClasses[size].icon, "text-foreground/60")} />
                        <span className={cn(sizeClasses[size].text)}>{signal.title}</span>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className={cn(
            "grid gap-4",
            orientation === "vertical" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-3",
            className
        )}>
            {signals.map((signal, idx) => (
                <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
                >
                    <div className={cn("p-2 rounded-md shrink-0", signal.bgColor)}>
                        <signal.icon className={cn(sizeClasses[size].icon, signal.color)} />
                    </div>
                    <div>
                        <h4 className={cn(sizeClasses[size].title, "mb-0.5")}>
                            {signal.title}
                        </h4>
                        <p className={cn("text-muted-foreground leading-tight", sizeClasses[size].text)}>
                            {signal.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}
