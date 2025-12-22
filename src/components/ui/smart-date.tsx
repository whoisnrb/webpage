"use client"

import * as React from "react"
import { format, formatDistanceToNow } from "date-fns"
import { hu, enUS } from "date-fns/locale"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"

interface SmartDateProps {
    date: Date | string | number;
    formatStr?: string;
    relative?: boolean;
    showTimezone?: boolean;
    className?: string;
}

export function SmartDate({
    date,
    formatStr = "PPP",
    relative = false,
    showTimezone = false,
    className
}: SmartDateProps) {
    const params = useParams();
    const locale = params.locale === 'hu' ? hu : enUS;
    const [mounted, setMounted] = React.useState(false);
    const dateObj = new Date(date);

    // Prevent hydration mismatch by only rendering client-side timezone-specific data
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <span className={className}>...</span>;
    }

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return (
        <span className={cn("inline-flex items-center gap-1.5", className)}>
            {relative ? (
                <span>{formatDistanceToNow(dateObj, { addSuffix: true, locale })}</span>
            ) : (
                <span>{format(dateObj, formatStr, { locale })}</span>
            )}
            {showTimezone && (
                <span className="text-[10px] opacity-50 font-medium uppercase tracking-tighter">
                    ({timezone})
                </span>
            )}
        </span>
    );
}
